import React from "react";
import { Star, Trash2 } from "lucide-react";
import { Toggle } from "./ui/toggle";
import { cls, timeAgo } from "./utils";

export default function ConversationRow({
  data,
  active,
  onSelect,
  onTogglePin,
  onDelete,
  showMeta,
}) {
  const count = Array.isArray(data.messages)
    ? data.messages.length
    : data.messageCount;
  return (
    <div className="group relative">
      <div
        className={cls(
          "-mx-1 flex w-[calc(100%+8px)] items-center gap-2 rounded-lg px-2 py-2",
          active
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-100"
            : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        )}
      >
        <button
          onClick={onSelect}
          className="min-w-0 flex-1 text-left"
          title={data.title}
        >
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium tracking-tight">
              {data.title}
            </span>
            <span className="shrink-0 text-[11px] text-zinc-500 dark:text-zinc-400">
              {timeAgo(data.updatedAt)}
            </span>
          </div>
          {showMeta && (
            <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {count} messages
            </div>
          )}
        </button>
        <div className="flex items-center gap-1">
          <Toggle
            pressed={data.pinned}
            onPressedChange={(e) => {
              onTogglePin();
            }}
            size="sm"
            title={data.pinned ? "Unpin" : "Pin"}
            className="h-auto rounded-md p-1 text-zinc-500 opacity-0 transition group-hover:opacity-100 hover:bg-amber-50 hover:text-amber-500 hover:*:[svg]:fill-amber-500 hover:*:[svg]:stroke-amber-500 dark:text-zinc-300 dark:hover:bg-amber-950/20 dark:hover:text-amber-400 dark:hover:*:[svg]:fill-amber-400 dark:hover:*:[svg]:stroke-amber-400 data-[state=on]:bg-transparent data-[state=on]:text-amber-500 data-[state=on]:*:[svg]:fill-amber-500 data-[state=on]:*:[svg]:stroke-amber-500 dark:data-[state=on]:text-amber-400 dark:data-[state=on]:*:[svg]:fill-amber-400 dark:data-[state=on]:*:[svg]:stroke-amber-400"
            aria-label={data.pinned ? "Unpin conversation" : "Pin conversation"}
          >
            <Star className="h-4 w-4 transition-all" />
          </Toggle>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                confirm(
                  "Sei sicuro di voler eliminare questa conversazione? Questa azione non può essere annullata."
                )
              ) {
                onDelete?.();
              }
            }}
            title="Elimina conversazione"
            className="rounded-md p-1 text-zinc-500 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:text-zinc-300 dark:hover:bg-red-950/20 dark:hover:text-red-400"
            aria-label="Elimina conversazione"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute left-[calc(100%+6px)] top-1 hidden w-64 rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-700 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 md:group-hover:block">
        <div className="line-clamp-6 whitespace-pre-wrap">{data.preview}</div>
      </div>
    </div>
  );
}
