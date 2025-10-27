"use client";

import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Pencil, RefreshCw, Check, X, Image, FileText } from "lucide-react";
import Message from "./Message";
import Composer from "./Composer";
import { cls, timeAgo } from "./utils";

function ThinkingMessage() {
  return (
    <Message role="assistant">
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span>Sto pensando..</span>
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="thinking-dot" />
          <span className="thinking-dot animation-delay-150" />
          <span className="thinking-dot animation-delay-300" />
        </div>
      </div>
      <style jsx>{`
        .thinking-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background-color: rgb(148 163 184); /* zinc-400 */
          display: inline-block;
          animation: thinkingPulse 1.2s ease-in-out infinite;
        }

        .animation-delay-150 {
          animation-delay: 0.15s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        @keyframes thinkingPulse {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Message>
  );
}

const ChatPane = forwardRef(function ChatPane(
  {
    conversation,
    onSend,
    onEditMessage,
    onResendMessage,
    isThinking,
  },
  ref,
) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const composerRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent);
      },
    }),
    [],
  );

  if (!conversation) return null;

  const messages = Array.isArray(conversation.messages)
    ? conversation.messages
    : [];
  const count = messages.length || conversation.messageCount || 0;

  function startEdit(m) {
    setEditingId(m.id);
    setDraft(m.content);
  }
  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }
  function saveEdit() {
    if (!editingId) return;
    onEditMessage?.(editingId, draft);
    cancelEdit();
  }
  function saveAndResend() {
    if (!editingId) return;
    onEditMessage?.(editingId, draft);
    onResendMessage?.(editingId);
    cancelEdit();
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mb-2 text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">
          <span className="block leading-[1.05] font-sans text-2xl">
            {conversation.title}
          </span>
        </div>
        <div className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Aggiornata {timeAgo(conversation.updatedAt)} · {count} messaggi
        </div>

        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Nessun messaggio. Inizia a scrivere per cominciare.
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                {editingId === m.id ? (
                  <div
                    className={cls(
                      "rounded-2xl border p-2",
                      "border-zinc-200 dark:border-zinc-800",
                    )}
                  >
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-xl bg-transparent p-2 text-sm outline-none"
                      rows={3}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5 text-xs text-white dark:bg-white dark:text-zinc-900"
                      >
                        <Check className="h-3.5 w-3.5" /> Salva
                      </button>
                      <button
                        onClick={saveAndResend}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Salva e Reinvia
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
                      >
                        <X className="h-3.5 w-3.5" /> Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <Message role={m.role}>
                    {m.attachment && (
                      <div className="mb-2 pb-2 border-b border-zinc-200/50 dark:border-zinc-700/50">
                        {m.attachment.type === 'image' ? (
                          m.attachmentPreview ? (
                            // Show thumbnail if preview data exists
                            <div className="flex items-start gap-2">
                              <img
                                src={`data:${m.attachmentMimeType};base64,${m.attachmentPreview}`}
                                alt={m.attachment.name}
                                className="h-16 w-16 rounded object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                              />
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate flex items-center gap-1">
                                  <Image className="h-3 w-3 text-zinc-400" />
                                  {m.attachment.name}
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Fallback if no preview (e.g., after refresh)
                            <div className="flex items-center gap-1.5">
                              <Image className="h-3.5 w-3.5 text-zinc-400" />
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {m.attachment.name}
                              </span>
                            </div>
                          )
                        ) : (
                          // PDF - keep icon display
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {m.attachment.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {/* Content is updated directly in message object by useEffect */}
                      {m.content}
                    </div>
                    {/* Show streaming indicator for assistant messages that are actively streaming */}
                    {m.isStreaming && m.role === 'assistant' && (
                      <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-blue-500" />
                    )}
                  </Message>
                )}
              </div>
            ))}
            {/* Show thinking indicator when waiting for first chunk */}
            {isThinking && <ThinkingMessage />}
          </>
        )}
      </div>

      <Composer
        ref={composerRef}
        onSend={async (text, fileData) => {
          if (!text.trim()) return;
          setBusy(true);
          await onSend?.(text, fileData);
          setBusy(false);
        }}
        busy={busy}
      />
    </div>
  );
});

export default ChatPane;
