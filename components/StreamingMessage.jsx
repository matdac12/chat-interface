"use client";

import { useEffect, useRef, useState } from "react";

export default function StreamingMessage({
  content,
  isStreaming,
  isComplete = false,
  onComplete,
  className = "",
  streamingSpeed = 50, // Characters per second for animation effect
  showTypingIndicator = true,
}) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [finalContent, setFinalContent] = useState("");
  const [pendingQueue, setPendingQueue] = useState("");
  const lastContentRef = useRef("");

  // Track incoming content chunks and queue only the new delta
  useEffect(() => {
    if (!content) {
      setDisplayedContent("");
      setPendingQueue("");
      lastContentRef.current = "";
      return;
    }

    if (content.length > lastContentRef.current.length) {
      const delta = content.slice(lastContentRef.current.length);
      lastContentRef.current = content;
      setPendingQueue((prev) => prev + delta);
    }
  }, [content]);

  // Drain the pending queue at a consistent pace
  useEffect(() => {
    if (!pendingQueue.length) {
      if (!isStreaming) setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const delay = Math.max(10, 1000 / streamingSpeed);
    const timeout = setTimeout(() => {
      setDisplayedContent((prev) => prev + pendingQueue[0]);
      setPendingQueue((prev) => prev.slice(1));
    }, delay);

    return () => clearTimeout(timeout);
  }, [pendingQueue, streamingSpeed, isStreaming]);

  // Show final content immediately when streaming completes
  useEffect(() => {
    if (isComplete && content) {
      setDisplayedContent(content);
      setPendingQueue("");
      lastContentRef.current = content;
      setFinalContent(content);
      setIsTyping(false);
    }
  }, [isComplete, content]);

  // Handle completion callback
  useEffect(() => {
    if (isComplete && content && onComplete && finalContent !== content) {
      setFinalContent(content);
      onComplete(content);
    }
  }, [isComplete, content, onComplete, finalContent]);

  return (
    <>
      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .streaming-content {
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: 1.4;
        }

        .typing-cursor {
          animation: blink 1s infinite;
          font-size: 1rem;
          color: oklch(0.5 0.15 250);
          font-weight: bold;
          margin-left: 1px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: oklch(0.5 0.15 250);
          animation: pulse 1.5s infinite;
        }
      `}</style>

      <div
        className={`flex flex-col rounded-2xl border border-zinc-200/60 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
        style={{
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {/* Message header */}
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Assistente</span>
            {/* Streaming status badge */}
            {(isStreaming || isTyping) && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <span className="pulse-dot" />
                In streaming...
              </span>
            )}
          </div>
        </div>

        {/* Main streaming content */}
        <div className="streaming-content text-sm text-zinc-900 dark:text-zinc-100">
          {displayedContent}
          {/* Show typing indicator while streaming */}
          {(isStreaming || isTyping) && showTypingIndicator && (
            <span className="typing-cursor">|</span>
          )}
        </div>
      </div>
    </>
  );
}
