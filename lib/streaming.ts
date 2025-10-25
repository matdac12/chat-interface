/**
 * Streaming utilities for Server-Sent Events (SSE) implementation
 * Handles streaming OpenAI responses to frontend clients
 */

import OpenAI from "openai";
import { createMessage, updateConversation } from "./db";

// Event types for streaming
export interface StreamingEvent {
  type: "start" | "content" | "complete" | "error" | "fallback_initiated" | "timeout" | "stream_done";
  timestamp: number;
  [key: string]: any;
}

export interface ContentEvent extends StreamingEvent {
  type: "content";
  data: string;
  chunk_id?: number;
  total_chars?: number;
  chars_per_second?: number;
  source?: string;
}

export interface CompleteEvent extends StreamingEvent {
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

/**
 * Utility class for parsing different types of OpenAI streaming events
 */
export class OpenAIStreamingEventParser {
  private chunkCount: number = 0;
  private accumulatedContent: string = "";
  private lastChunkTime: number = Date.now();

  parseEvent(event: any): StreamingEvent | null {
    this.chunkCount++;
    const currentTime = Date.now();

    // Main content event (Responses API)
    if (event.output_text !== undefined && event.output_text !== null) {
      const newContent = event.output_text.substring(this.accumulatedContent.length);
      this.accumulatedContent = event.output_text;

      if (newContent) {
        const timeSinceLast = (currentTime - this.lastChunkTime) / 1000;
        const charsPerSecond = timeSinceLast > 0 ? newContent.length / timeSinceLast : 0;

        this.lastChunkTime = currentTime;
        return {
          type: "content",
          data: newContent,
          timestamp: currentTime,
          chunk_id: this.chunkCount,
          total_chars: this.accumulatedContent.length,
          chars_per_second: Math.round(charsPerSecond * 100) / 100,
        };
      }
    }

    // ResponseTextDeltaEvent from Responses API
    if (event.delta !== undefined && event.delta !== null && typeof event.delta === "string") {
      const deltaContent = event.delta;
      if (deltaContent) {
        this.accumulatedContent += deltaContent;
        return {
          type: "content",
          data: deltaContent,
          timestamp: currentTime,
          chunk_id: this.chunkCount,
          source: "responses_text_delta",
          total_chars: this.accumulatedContent.length,
        };
      }
    }

    // Legacy delta content events (Chat Completions API)
    if (event.delta && typeof event.delta === "object" && "content" in event.delta) {
      const deltaContent = event.delta.content || event.delta.text || "";
      if (deltaContent) {
        this.accumulatedContent += deltaContent;
        return {
          type: "content",
          data: deltaContent,
          timestamp: currentTime,
          chunk_id: this.chunkCount,
          source: "chat_completions_delta",
          total_chars: this.accumulatedContent.length,
        };
      }
    }

    // Choice-based events
    if (event.choices && Array.isArray(event.choices)) {
      for (const choice of event.choices) {
        if (choice.delta && choice.delta.content) {
          const deltaContent = choice.delta.content;
          if (deltaContent) {
            this.accumulatedContent += deltaContent;
            return {
              type: "content",
              data: deltaContent,
              timestamp: currentTime,
              chunk_id: this.chunkCount,
              choice_index: choice.index || 0,
              total_chars: this.accumulatedContent.length,
            };
          }
        }
      }
    }

    // Error events
    if (event.error || (event.type === "error")) {
      const errorMessage = String(event.error || "Unknown streaming error");
      return {
        type: "error",
        error: errorMessage,
        timestamp: currentTime,
        chunk_id: this.chunkCount,
        accumulated_chars: this.accumulatedContent.length,
      };
    }

    // Special event types
    if (event.type) {
      if (event.type === "done") {
        return {
          type: "stream_done",
          message: "OpenAI streaming completed naturally",
          timestamp: currentTime,
          total_chunks: this.chunkCount,
          final_length: this.accumulatedContent.length,
        };
      }
      if (event.type === "function_call" || event.type === "tool_call") {
        return {
          type: "content",
          tool_type: event.type,
          timestamp: currentTime,
          chunk_id: this.chunkCount,
          data: "",
        };
      }
    }

    return null; // Unknown event type
  }

  getCompletionEvent(additionalData?: Partial<CompleteEvent>): CompleteEvent {
    const completionData: CompleteEvent = {
      type: "complete",
      final_content: this.accumulatedContent,
      timestamp: Date.now(),
      conversation_id: "",
      streaming_stats: {
        total_chunks: this.chunkCount,
        final_length: this.accumulatedContent.length,
        average_chunk_size: this.chunkCount > 0 ? this.accumulatedContent.length / this.chunkCount : 0,
        words_count: this.accumulatedContent ? this.accumulatedContent.split(/\s+/).length : 0,
      },
      ...additionalData,
    };

    return completionData;
  }

  getAccumulatedContent(): string {
    return this.accumulatedContent;
  }
}

/**
 * Handles fallback scenarios when streaming fails
 */
export class StreamingFallbackHandler {
  constructor(
    private openaiClient: OpenAI,
    private promptId: string
  ) {}

  async *handleStreamingFailure(
    conversationId: string,
    localConversationId: string,
    userMessage: string,
    userId: string,
    openaiConvId: string,
    errorContext: string = "Unknown streaming error",
    file?: any
  ): AsyncGenerator<string> {
    try {
      // Send fallback notification
      const fallbackData = {
        type: "fallback_initiated",
        message: "Streaming failed, using fallback response method",
        error_context: errorContext,
        timestamp: Date.now(),
      };
      yield `data: ${JSON.stringify(fallbackData)}\n\n`;

      console.log("🔄 Streaming fallback activated:", errorContext);

      // Prepare input for non-streaming request
      let responseInput: any;

      if (!file) {
        responseInput = userMessage;
      } else {
        const isImage = file.type.startsWith("image/");
        const isPDF = file.type === "application/pdf";

        if (isImage) {
          responseInput = [
            {
              role: "user",
              content: [
                {
                  type: "input_image",
                  image_url: `data:${file.type};base64,${file.data}`,
                },
                {
                  type: "input_text",
                  text: userMessage,
                },
              ],
            },
          ];
        } else if (isPDF) {
          const pdfBuffer = Buffer.from(file.data, "base64");
          const blob = new Blob([pdfBuffer], { type: "application/pdf" });
          const uploadedFile = await this.openaiClient.files.create({
            file: new File([blob], file.name, { type: "application/pdf" }),
            purpose: "assistants",
          });

          responseInput = [
            {
              role: "user",
              content: [
                {
                  type: "input_file",
                  file_id: uploadedFile.id,
                },
                {
                  type: "input_text",
                  text: userMessage,
                },
              ],
            },
          ];
        }
      }

      // Use non-streaming response
      const response = await this.openaiClient.responses.create({
        model: "gpt-5-nano",
        prompt: {
          id: this.promptId,
        },
        input: responseInput,
        conversation: openaiConvId,
      });

      const assistantText = response.output_text || "No response generated";

      // Store fallback response in database
      try {
        await createMessage(localConversationId, "assistant", assistantText);
        console.log("✅ Fallback response stored in database");
      } catch (dbError) {
        console.error("❌ Failed to store fallback response in DB:", dbError);
      }

      // Send fallback response as single chunk
      const contentData = {
        type: "content",
        data: assistantText,
        timestamp: Date.now(),
        source: "fallback_complete",
      };
      yield `data: ${JSON.stringify(contentData)}\n\n`;

      // Send completion with fallback indication
      const completionData: CompleteEvent = {
        type: "complete",
        final_content: assistantText,
        conversation_id: openaiConvId,
        timestamp: Date.now(),
        fallback_used: true,
        stored_in_db: true,
      };
      yield `data: ${JSON.stringify(completionData)}\n\n`;

    } catch (fallbackError) {
      // Last resort error handling
      console.error("❌ Fallback handler failed:", fallbackError);

      const errorData = {
        type: "error",
        error: `Fallback handler failed: ${(fallbackError as Error).message}`,
        original_error: errorContext,
        timestamp: Date.now(),
      };
      yield `data: ${JSON.stringify(errorData)}\n\n`;
    }
  }
}

/**
 * Manages streaming connections and OpenAI response forwarding
 */
export class StreamingManager {
  constructor(
    private openaiClient: OpenAI,
    private promptId: string
  ) {}

  async *streamResponse(
    conversationId: string,
    localConversationId: string,
    userMessage: string,
    userId: string,
    openaiConvId: string,
    file?: any
  ): AsyncGenerator<string> {
    try {
      console.log("🔧 StreamingManager.streamResponse called");
      console.log("🔧 OpenAI Conversation:", openaiConvId);
      console.log("🔧 Local Conversation:", localConversationId);
      console.log("🔧 Message:", userMessage.substring(0, 50));

      // Prepare input based on whether file is present
      let responseInput: any;

      if (!file) {
        responseInput = userMessage;
      } else {
        const isImage = file.type.startsWith("image/");
        const isPDF = file.type === "application/pdf";

        console.log(`File attached: ${file.name} (${file.type})`);

        if (isImage) {
          responseInput = [
            {
              role: "user",
              content: [
                {
                  type: "input_image",
                  image_url: `data:${file.type};base64,${file.data}`,
                },
                {
                  type: "input_text",
                  text: userMessage,
                },
              ],
            },
          ];
        } else if (isPDF) {
          console.log("Processing PDF, uploading to Files API...");
          const pdfBuffer = Buffer.from(file.data, "base64");
          const blob = new Blob([pdfBuffer], { type: "application/pdf" });

          const uploadedFile = await this.openaiClient.files.create({
            file: new File([blob], file.name, { type: "application/pdf" }),
            purpose: "assistants",
          });

          console.log("PDF uploaded successfully, file ID:", uploadedFile.id);

          responseInput = [
            {
              role: "user",
              content: [
                {
                  type: "input_file",
                  file_id: uploadedFile.id,
                },
                {
                  type: "input_text",
                  text: userMessage,
                },
              ],
            },
          ];
        }
      }

      // Create streaming response from OpenAI
      console.log("Creating streaming response with prompt_id:", this.promptId);
      const responseStream = await this.openaiClient.responses.create({
        model: "gpt-5-nano",
        prompt: {
          id: this.promptId,
        },
        input: responseInput,
        conversation: openaiConvId,
        stream: true, // Enable streaming
      });

      // Process streaming events with enhanced parsing
      const parser = new OpenAIStreamingEventParser();

      console.log("🔄 Starting to process streaming events");

      let eventCount = 0;
      for await (const event of responseStream) {
        eventCount++;
        console.log(`📦 Event ${eventCount} received from OpenAI`);
        const parsed = parser.parseEvent(event);
        if (parsed) {
          console.log(`✉️  Yielding event type: ${parsed.type}, data length: ${parsed.data?.length || 0}`);
          yield `data: ${JSON.stringify(parsed)}\n\n`;
        } else {
          console.log(`⚠️  Event ${eventCount} could not be parsed`);
        }
      }

      console.log(`✅ Streaming completed successfully (${eventCount} events processed)`);

      // Store assistant message in database
      const finalContent = parser.getAccumulatedContent();
      try {
        await createMessage(localConversationId, "assistant", finalContent);
        console.log("✅ Assistant message stored in database");
      } catch (dbError) {
        console.error("❌ Failed to store assistant message in DB:", dbError);
      }

      // Send completion event
      const completionEvent = parser.getCompletionEvent({
        conversation_id: openaiConvId,
        stored_in_db: true,
      });
      yield `data: ${JSON.stringify(completionEvent)}\n\n`;

    } catch (error) {
      console.error("❌ Streaming error:", error);

      // Use fallback handler for streaming failures
      const fallbackHandler = new StreamingFallbackHandler(this.openaiClient, this.promptId);

      yield* fallbackHandler.handleStreamingFailure(
        conversationId,
        localConversationId,
        userMessage,
        userId,
        openaiConvId,
        `Streaming error: ${(error as Error).message}`,
        file
      );
    }
  }
}

/**
 * Helper class to build streaming responses with proper error handling
 */
export class StreamingResponseBuilder {
  static async buildChatStream(
    streamingManager: StreamingManager,
    conversationId: string,
    localConversationId: string,
    userMessage: string,
    userId: string,
    openaiConvId: string,
    file?: any,
    timeoutSeconds: number = 30
  ): Promise<Response> {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = Date.now();
        let isClosed = false;

        try {
          console.log("🛠️ Stream generator started");

          // Helper function to safely enqueue
          const safeEnqueue = (data: Uint8Array) => {
            if (!isClosed) {
              try {
                controller.enqueue(data);
              } catch (error) {
                console.warn("⚠️  Failed to enqueue (stream may be closed):", error);
                isClosed = true;
              }
            }
          };

          // Send initial acknowledgment
          const startData = {
            type: "start",
            message: "Response starting...",
            timestamp: Date.now(),
          };
          safeEnqueue(encoder.encode(`data: ${JSON.stringify(startData)}\n\n`));

          console.log("🛠️ Start event sent, streaming response...");

          // Stream the response with timeout
          for await (const chunk of streamingManager.streamResponse(
            conversationId,
            localConversationId,
            userMessage,
            userId,
            openaiConvId,
            file
          )) {
            // Check timeout
            if ((Date.now() - startTime) / 1000 > timeoutSeconds) {
              const timeoutData = {
                type: "timeout",
                message: "Streaming timeout reached, switching to fallback",
                timeout_seconds: timeoutSeconds,
                timestamp: Date.now(),
              };
              safeEnqueue(encoder.encode(`data: ${JSON.stringify(timeoutData)}\n\n`));
              break;
            }

            safeEnqueue(encoder.encode(chunk));
          }

          console.log("✅ Stream completed successfully");
          if (!isClosed) {
            controller.close();
            isClosed = true;
          }

        } catch (error) {
          console.error("❌ StreamingResponseBuilder error:", error);

          // Send error event
          const errorData = {
            type: "error",
            error: `Streaming failed: ${(error as Error).message}`,
            timestamp: Date.now(),
          };
          safeEnqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
          if (!isClosed) {
            controller.close();
            isClosed = true;
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        // text/event-stream tells proxies/browsers to flush each chunk immediately
        "Content-Type": "text/event-stream; charset=utf-8",
        // Prevent intermediaries (and Next.js) from buffering SSE frames
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering
      },
    });
  }
}
