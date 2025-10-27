"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

export default function VoiceChatTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);

  // Base64 encoding helper
  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Base64 decoding helper
  const base64ToArrayBuffer = (base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Start voice session
  const startSession = async () => {
    try {
      setStatus("Creating session...");
      setError("");

      // 1. Create ephemeral token from backend
      const response = await fetch("/api/realtime/session", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || "Failed to create session");
      }

      const { client_secret, model, voice } = await response.json();
      console.log("✅ Got client secret, model:", model, "voice:", voice);

      // 2. Connect to WebSocket with authentication
      // The client_secret is an ephemeral token used to authenticate the WebSocket
      setStatus("Connecting to WebSocket...");
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=${model}`,
        ['realtime', `openai-insecure-api-key.${client_secret}`] // Protocol headers for auth
      );

      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🔌 WebSocket connected");
        setIsConnected(true);
        setStatus("Configuring session...");

        // Send session configuration
        // Note: Instructions are already set during client_secret creation
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            turn_detection: {
              type: "server_vad", // Voice Activity Detection
            },
          }
        };

        console.log("📤 Sending session.update:", sessionConfig);
        ws.send(JSON.stringify(sessionConfig));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("📨 Received:", message.type);

        // Handle different event types
        switch (message.type) {
          case "session.created":
            console.log("✅ Session created:", message.session);
            break;

          case "session.updated":
            console.log("✅ Session updated!");
            setStatus("Connected - Ready to talk!");
            break;

          case "conversation.item.created":
            console.log("💬 Item created:", message.item);
            break;

          case "response.audio.delta":
            // Play audio chunk
            if (message.delta) {
              playAudioChunk(message.delta);
            }
            break;

          case "response.audio_transcript.delta":
            // Update transcript
            setTranscript(prev => prev + message.delta);
            break;

          case "response.text.delta":
            setTranscript(prev => prev + message.delta);
            break;

          case "response.done":
            console.log("✅ Response completed");
            setStatus("Response completed - Ready to talk!");
            break;

          case "error":
            console.error("❌ Error from server:", message.error);
            const errorMsg = message.error?.message || message.error?.type || JSON.stringify(message.error) || "Unknown error";
            setError(errorMsg);
            setStatus("Error occurred");
            break;

          default:
            // Log other events
            console.log("Event:", message.type);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setError("WebSocket connection error");
        setStatus("Error");
      };

      ws.onclose = () => {
        console.log("🔌 WebSocket closed");
        setIsConnected(false);
        setStatus("Disconnected");
        stopRecording();
      };

      // 3. Request microphone access
      setStatus("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000, // Required by Realtime API
        }
      });
      streamRef.current = stream;

      // 4. Setup audio context and recorder
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });

      setStatus("Connected - Click mic to start talking!");

    } catch (err) {
      console.error("❌ Failed to start session:", err);
      setError(err.message);
      setStatus("Failed to connect");
    }
  };

  // Start recording audio
  const startRecording = () => {
    if (!streamRef.current || !wsRef.current) return;

    setIsRecording(true);
    setStatus("Listening...");

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "audio/webm",
    });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
        // Convert audio to base64 and send to OpenAI
        const arrayBuffer = await event.data.arrayBuffer();
        const base64Audio = arrayBufferToBase64(arrayBuffer);

        wsRef.current.send(JSON.stringify({
          type: "input_audio_buffer.append",
          audio: base64Audio,
        }));
      }
    };

    // Send chunks every 100ms
    mediaRecorder.start(100);

    // Commit audio buffer when user stops talking (handled by server VAD)
    setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "input_audio_buffer.commit",
        }));
      }
    }, 100);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setStatus("Connected - Ready to talk!");
  };

  // Play audio chunk from AI
  const playAudioChunk = (base64Audio) => {
    try {
      const audioBuffer = base64ToArrayBuffer(base64Audio);
      const blob = new Blob([audioBuffer], { type: "audio/pcm" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("Failed to play audio:", err);
    }
  };

  // Disconnect session
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsRecording(false);
    setStatus("Disconnected");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-900">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="mb-2 text-2xl font-bold">🎙️ Realtime Voice Chat Test</h1>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          Proof of concept using OpenAI Realtime API with prompt variables
        </p>

        {/* Status */}
        <div className="mb-6 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
          <div className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Status
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">{status}</span>
            {!isConnected && status.includes("...") && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              Transcript
            </div>
            <p className="text-sm text-blue-900 dark:text-blue-100">{transcript}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4">
          {!isConnected ? (
            <button
              onClick={startSession}
              className="flex-1 rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Start Voice Session
            </button>
          ) : (
            <>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-white transition focus:outline-none focus:ring-2 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Stop Talking
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Start Talking
                  </>
                )}
              </button>
              <button
                onClick={disconnect}
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Disconnect
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
          <p className="mb-2 font-medium">How to use:</p>
          <ol className="list-inside list-decimal space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>Click "Start Voice Session" to connect</li>
            <li>Allow microphone access when prompted</li>
            <li>Click "Start Talking" and speak</li>
            <li>The AI will respond with voice (uses your prompt with user variables)</li>
            <li>Click "Stop Talking" or "Disconnect" when done</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
