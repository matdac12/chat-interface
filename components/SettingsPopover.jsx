"use client";
import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function SettingsPopover({ children, onClearAll }) {
  const [open, setOpen] = useState(false);

  function handleClearAll() {
    if (
      confirm(
        "Sei sicuro di voler eliminare tutte le conversazioni? Questa azione non può essere annullata.",
      )
    ) {
      onClearAll?.();
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="top">
        <div className="p-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            j@gmail.com
          </div>

          <div className="space-y-1">
            <button className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
              <LogOut className="h-4 w-4" />
              <span>Esci</span>
            </button>

            <div className="border-t border-zinc-200 dark:border-zinc-800 my-2"></div>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              <span>Elimina tutte le chat</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
