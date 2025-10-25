/**
 * Client-side streaming utilities for real-time OpenAI responses using Server-Sent Events (SSE)
 */

import { useState, useEffect } from "react";

// Streaming event types matching backend models
export interface StreamingEvent {
  type: "start" | "content" | "complete" | "error" | "cancelled" | "fallback_initiated" | "timeout" | "stream_done";
  timestamp: number;
  [key: string]: any;
}

export interface StreamingStartEvent extends StreamingEvent {
  type: "start";
  message: string;
}

export interface StreamingContentEvent extends StreamingEvent {
  type: "content";
  data: string;
  chunk_id?: number;
  total_chars?: number;
  chars_per_second?: number;
  source?: string;
}

export interface StreamingCompleteEvent extends StreamingEvent {
  type: "complete";
  final_content: string;
  conversation_id: string;
  stored_in_db?: boolean;
  streaming_stats?: {
    total_chunks: number;
    final_length: number;
    average_chunk_size: number;
    words_count: number;
  };
  fallback_used?: boolean;
}

export interface StreamingErrorEvent extends StreamingEvent {
  type: "error";
  error: string;
  accumulated_chars?: number;
}

export interface StreamingFallbackEvent extends StreamingEvent {
  type: "fallback_initiated";
  message: string;
  error_context: string;
}

export interface StreamingTimeoutEvent extends StreamingEvent {
  type: "timeout";
  message: string;
  timeout_seconds: number;
}

// Callback types
export type StreamingEventCallback = (event: StreamingEvent) => void;
export type StreamingContentCallback = (content: string, isComplete: boolean) => void;
export type StreamingErrorCallback = (error: string, context?: string) => void;
export type StreamingCompleteCallback = (finalContent: string) => void;
export type ConnectionStatusCallback = (connected: boolean) => void;

export interface StreamingOptions {
  timeout?: number; // in milliseconds
  onEvent?: StreamingEventCallback;
  onContent?: StreamingContentCallback;
  onError?: StreamingErrorCallback;
  onComplete?: StreamingCompleteCallback;
  onConnectionChange?: ConnectionStatusCallback;
}

class StreamingClient {
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectDelay: number = 1000;
  private currentStreamId: string | null = null;
  private abortController: AbortController | null = null;

  // Accumulated content for progressive display
  private accumulatedContent: string = "";

  // Event callbacks
  private eventCallbacks: StreamingEventCallback[] = [];
  private contentCallbacks: StreamingContentCallback[] = [];
  private errorCallbacks: StreamingErrorCallback[] = [];
  private completeCallbacks: StreamingCompleteCallback[] = [];
  private connectionCallbacks: ConnectionStatusCallback[] = [];

  // Public API
  async sendMessage(
    conversationId: string,
    message: string,
    openaiConversationId?: string,
    file?: any,
    options: StreamingOptions = {}
  ): Promise<{ streamId: string }> {
    try {
      // Close any existing connection
      this.disconnect();

      // Reset all state for new stream
      this.accumulatedContent = "";
      this.reconnectAttempts = 0;
      this.abortController = new AbortController();

      // Register callbacks if provided
      if (options.onEvent) this.onEvent(options.onEvent);
      if (options.onContent) this.onContent(options.onContent);
      if (options.onError) this.onError(options.onError);
      if (options.onComplete) this.onComplete(options.onComplete);
      if (options.onConnectionChange) this.onConnectionChange(options.onConnectionChange);

      // Construct streaming URL
      const url = "/api/chat/stream";

      // Create POST request for streaming
      const initResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          conversationId: conversationId,
          message: message,
          openaiConversationId: openaiConversationId,
          file: file,
        }),
        signal: this.abortController.signal,
      });

      if (!initResponse.ok) {
        throw new Error(`Failed to initiate streaming: ${initResponse.statusText}`);
      }

      // The response should be the actual SSE stream
      this.connectToStream(initResponse, options.timeout);

      return { streamId: this.currentStreamId || "unknown" };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown streaming error";
      this.notifyError(errorMessage);
      throw error;
    }
  }

  disconnect(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isConnected = false;
    this.currentStreamId = null;
    this.notifyConnectionStatus(false);
  }

  // Event subscription methods
  onEvent(callback: StreamingEventCallback): () => void {
    this.eventCallbacks.push(callback);
    return () => this.removeCallback(this.eventCallbacks, callback);
  }

  onContent(callback: StreamingContentCallback): () => void {
    this.contentCallbacks.push(callback);
    return () => this.removeCallback(this.contentCallbacks, callback);
  }

  onError(callback: StreamingErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => this.removeCallback(this.errorCallbacks, callback);
  }

  onComplete(callback: StreamingCompleteCallback): () => void {
    this.completeCallbacks.push(callback);
    return () => this.removeCallback(this.completeCallbacks, callback);
  }

  onConnectionChange(callback: ConnectionStatusCallback): () => void {
    this.connectionCallbacks.push(callback);
    return () => this.removeCallback(this.connectionCallbacks, callback);
  }

  // State getters
  getIsConnected(): boolean {
    return this.isConnected;
  }

  getCurrentContent(): string {
    return this.accumulatedContent;
  }

  // Private methods
  private connectToStream(response: Response, timeout?: number): void {
    // For modern browsers, we can read the response as a stream
    if (!response.body) {
      throw new Error("No response body for streaming");
    }

    // Create a readable stream reader
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    this.isConnected = true;
    this.notifyConnectionStatus(true);

    // Set up timeout if specified
    let timeoutId: NodeJS.Timeout | null = null;
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(() => {
        this.handleTimeout(timeout);
      }, timeout);
    }

    // Read the stream
    const readStream = async (): Promise<void> => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            if (timeoutId) clearTimeout(timeoutId);
            this.isConnected = false;
            this.notifyConnectionStatus(false);
            break;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });

          // Process SSE formatted data
          this.processSSEChunk(chunk);
        }
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);
        // Don't handle as error if it was an abort (intentional disconnect)
        if (error instanceof Error && error.name !== "AbortError") {
          this.handleStreamError(error);
        }
      }
    };

    readStream();
  }

  private processSSEChunk(chunk: string): void {
    // Split chunk by lines and process SSE format
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const eventData = line.substring(6); // Remove 'data: ' prefix
          if (eventData.trim()) {
            const event: StreamingEvent = JSON.parse(eventData);
            this.handleStreamingEvent(event);
          }
        } catch (error) {
          console.error("Failed to parse SSE event:", error, "Line:", line);
        }
      }
    }
  }

  private handleStreamingEvent(event: StreamingEvent): void {
    // Notify all event callbacks
    this.notifyEvent(event);

    switch (event.type) {
      case "start":
        console.log("Streaming started:", (event as StreamingStartEvent).message);
        break;

      case "content":
        const contentEvent = event as StreamingContentEvent;
        this.accumulatedContent += contentEvent.data;
        this.notifyContent(contentEvent.data, false);
        break;

      case "complete":
        const completeEvent = event as StreamingCompleteEvent;
        // Content is already accumulated progressively
        this.notifyContent("", true); // Signal completion
        this.notifyComplete(this.accumulatedContent);
        this.disconnect();
        break;

      case "error":
        const errorEvent = event as StreamingErrorEvent;
        this.notifyError(errorEvent.error);
        this.disconnect();
        break;

      case "fallback_initiated":
        const fallbackEvent = event as StreamingFallbackEvent;
        console.warn("Streaming fallback activated:", fallbackEvent.message);
        // Don't disconnect - fallback will send content via non-streaming
        break;

      case "timeout":
        const timeoutEvent = event as StreamingTimeoutEvent;
        this.notifyError(`Streaming timeout after ${timeoutEvent.timeout_seconds} seconds`);
        this.disconnect();
        break;

      case "stream_done":
        console.log("Stream done event received");
        break;

      default:
        console.log("Unknown streaming event type:", event.type, event);
    }
  }

  private handleStreamError(error: any): void {
    console.error("Streaming error:", error);
    this.isConnected = false;
    this.notifyConnectionStatus(false);

    const errorMessage = error instanceof Error ? error.message : "Streaming connection error";
    this.notifyError(errorMessage);

    // Attempt reconnection if appropriate
    this.attemptReconnection();
  }

  private handleTimeout(timeoutMs: number): void {
    console.warn(`Streaming timeout after ${timeoutMs}ms`);
    this.notifyError(`Connection timeout after ${timeoutMs / 1000} seconds`);
    this.disconnect();
  }

  private attemptReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting streaming reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );

      setTimeout(() => {
        // For now, we don't auto-reconnect streams as they're message-specific
        // The client should initiate a new stream request
        console.log("Streaming reconnection not implemented - client should retry");
      }, this.reconnectDelay);

      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 10000);
    }
  }

  // Notification methods
  private notifyEvent(event: StreamingEvent): void {
    this.eventCallbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("Error in streaming event callback:", error);
      }
    });
  }

  private notifyContent(content: string, isComplete: boolean): void {
    this.contentCallbacks.forEach((callback) => {
      try {
        callback(content, isComplete);
      } catch (error) {
        console.error("Error in streaming content callback:", error);
      }
    });
  }

  private notifyError(error: string, context?: string): void {
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(error, context);
      } catch (error) {
        console.error("Error in streaming error callback:", error);
      }
    });
  }

  private notifyComplete(finalContent: string): void {
    this.completeCallbacks.forEach((callback) => {
      try {
        callback(finalContent);
      } catch (error) {
        console.error("Error in streaming complete callback:", error);
      }
    });
  }

  private notifyConnectionStatus(connected: boolean): void {
    this.isConnected = connected;
    this.connectionCallbacks.forEach((callback) => {
      try {
        callback(connected);
      } catch (error) {
        console.error("Error in streaming connection callback:", error);
      }
    });
  }

  private removeCallback<T>(array: T[], callback: T): void {
    const index = array.indexOf(callback);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
}

// React hook for easy integration with React components
export function useStreaming() {
  const [client] = useState(() => new StreamingClient());
  const [isConnected, setIsConnected] = useState(false);
  const [currentContent, setCurrentContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const unsubscribeConnection = client.onConnectionChange(setIsConnected);

    const unsubscribeContent = client.onContent((content, isComplete) => {
      if (isComplete) {
        setIsStreaming(false);
      } else {
        setCurrentContent((prev) => prev + content);
        setIsStreaming(true);
      }
    });

    const unsubscribeComplete = client.onComplete((finalContent) => {
      // Content is already accumulated progressively
      setCurrentContent(client.getCurrentContent());
      setIsStreaming(false);
    });

    const unsubscribeError = client.onError(() => {
      setIsStreaming(false);
    });

    return () => {
      unsubscribeConnection();
      unsubscribeContent();
      unsubscribeComplete();
      unsubscribeError();
      client.disconnect();
    };
  }, [client]);

  const sendMessage = async (
    conversationId: string,
    message: string,
    openaiConversationId?: string,
    file?: any,
    options?: StreamingOptions
  ) => {
    // Reset content state before starting new stream
    setCurrentContent("");
    setIsStreaming(true);

    try {
      const result = await client.sendMessage(
        conversationId,
        message,
        openaiConversationId,
        file,
        options
      );
      return result;
    } catch (error) {
      setIsStreaming(false);
      setCurrentContent(""); // Also reset on error
      throw error;
    }
  };

  const disconnect = () => {
    client.disconnect();
    setIsStreaming(false);
  };

  return {
    sendMessage,
    disconnect,
    isConnected,
    currentContent,
    isStreaming,
    client, // Access to raw client for advanced usage
  };
}

// Default export - singleton instance (optional, can create instances as needed)
export const streamingClient = new StreamingClient();

// Named export for creating custom instances
export { StreamingClient };
