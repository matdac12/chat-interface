"use client";

import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Send, Loader2, Plus, Mic, X, Image, FileText } from "lucide-react";
import ComposerActionsPopover from "./ComposerActionsPopover";
import VoiceWaveform from "./VoiceWaveform";
import { cls } from "./utils";

const Composer = forwardRef(function Composer({ onSend, busy }, ref) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current;
      const lineHeight = 20; // Approximate line height in pixels
      const minHeight = 40;

      // Reset height to calculate scroll height
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const calculatedLines = Math.max(
        1,
        Math.floor((scrollHeight - 16) / lineHeight),
      ); // 16px for padding

      setLineCount(calculatedLines);

      if (calculatedLines <= 12) {
        // Auto-expand for 1-12 lines
        textarea.style.height = `${Math.max(minHeight, scrollHeight)}px`;
        textarea.style.overflowY = "hidden";
      } else {
        // Fixed height with scroll for 12+ lines
        textarea.style.height = `${minHeight + 11 * lineHeight}px`; // 12 lines total
        textarea.style.overflowY = "auto";
      }
    }
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        setValue((prev) => {
          const newValue = prev
            ? `${prev}\n\n${templateContent}`
            : templateContent;
          setTimeout(() => {
            inputRef.current?.focus();
            const length = newValue.length;
            inputRef.current?.setSelectionRange(length, length);
          }, 0);
          return newValue;
        });
      },
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    [],
  );

  // File validation
  function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    if (file.size > maxSize) {
      alert("Il file deve essere inferiore a 10MB");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Formato non supportato. Sono accettati solo immagini (PNG, JPG, GIF, WEBP) e PDF.",
      );
      return false;
    }

    return true;
  }

  // Read file as base64
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1]; // Remove data:image/png;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Handle file selection
  async function handleFileSelect(file) {
    if (!file || !validateFile(file)) return;

    try {
      const base64Data = await readFileAsBase64(file);
      setAttachedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data,
      });
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Errore durante la lettura del file");
    }
  }

  // Handle file input change
  function handleFileInputChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Remove attached file
  function handleFileRemove() {
    setAttachedFile(null);
  }

  // Drag and drop handlers
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  async function handleSend() {
    if (!value.trim() || sending) return;
    const messageToSend = value;
    const fileToSend = attachedFile;
    setSending(true);
    setValue(""); // Clear immediately
    setAttachedFile(null); // Clear file
    inputRef.current?.focus();
    try {
      await onSend?.(messageToSend, fileToSend);
    } finally {
      setSending(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        // Transcribe the audio
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Impossibile accedere al microfono. Verifica i permessi del browser.",
      );
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  async function transcribeAudio(audioBlob) {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();

      if (data.success && data.text) {
        // Insert transcribed text into the textarea
        setValue((prev) => {
          const newValue = prev ? `${prev} ${data.text}` : data.text;
          // Focus and move cursor to end
          setTimeout(() => {
            inputRef.current?.focus();
            const length = newValue.length;
            inputRef.current?.setSelectionRange(length, length);
          }, 0);
          return newValue;
        });
      } else {
        throw new Error(data.error || "Transcription failed");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Errore durante la trascrizione dell'audio. Riprova.");
    } finally {
      setIsTranscribing(false);
    }
  }

  function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const hasContent = value.length > 0;

  return (
    <div className="border-t border-zinc-200/60 p-4 dark:border-zinc-800">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        className={cls(
          "mx-auto flex flex-col rounded-2xl border bg-white shadow-sm dark:bg-zinc-950 transition-all duration-200",
          "max-w-3xl border-zinc-300 dark:border-zinc-700 p-3",
          isDragging && "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* File preview */}
        {attachedFile && (
          <div className="mb-2 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center gap-2">
            {attachedFile.type.startsWith("image/") ? (
              <Image className="h-4 w-4 text-zinc-500 shrink-0" />
            ) : (
              <FileText className="h-4 w-4 text-zinc-500 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                {attachedFile.name}
              </div>
              <div className="text-xs text-zinc-500">
                {formatFileSize(attachedFile.size)}
              </div>
            </div>
            <button
              onClick={handleFileRemove}
              className="shrink-0 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Rimuovi file"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        )}

        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Come posso aiutarti?"
            rows={1}
            className={cls(
              "w-full resize-none bg-transparent text-sm outline-none placeholder:text-zinc-400 transition-all duration-200",
              "px-0 py-2 min-h-[40px] text-left",
            )}
            style={{
              height: "auto",
              overflowY: lineCount > 12 ? "auto" : "hidden",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <ComposerActionsPopover
            onFileClick={() => fileInputRef.current?.click()}
          >
            <button
              className="inline-flex shrink-0 items-center justify-center rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
              title="Add attachment"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ComposerActionsPopover>

          <div className="flex items-center gap-2 shrink-0">
            {isRecording && <VoiceWaveform isActive={isRecording} />}
            <button
              onClick={toggleRecording}
              disabled={isTranscribing}
              className={cls(
                "inline-flex items-center justify-center rounded-full p-2 transition-colors",
                isRecording
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                  : isTranscribing
                    ? "text-zinc-400 cursor-not-allowed"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
              )}
              title={
                isRecording
                  ? "Clicca per fermare la registrazione"
                  : isTranscribing
                    ? "Trascrizione in corso..."
                    : "Registra messaggio vocale"
              }
            >
              {isTranscribing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || busy || !value.trim()}
              className={cls(
                "inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-white dark:text-zinc-900",
                (sending || busy || !value.trim()) &&
                  "opacity-50 cursor-not-allowed",
              )}
            >
              {sending || busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-3xl px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
        Premi{" "}
        <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 dark:border-zinc-600 dark:bg-zinc-800">
          Invio
        </kbd>{" "}
        per inviare ·{" "}
        <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 dark:border-zinc-600 dark:bg-zinc-800">
          Shift
        </kbd>
        +
        <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 dark:border-zinc-600 dark:bg-zinc-800">
          Invio
        </kbd>{" "}
        per nuova riga
      </div>
    </div>
  );
});

export default Composer;
