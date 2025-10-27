"use client";
import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { logout, getSession } from "@/lib/auth";

export default function SettingsPopover({ children, onClearAll }) {
  const [open, setOpen] = useState(false);
  const session = getSession();
  const fullName = session && session.name && session.lastname
    ? `${session.name} ${session.lastname}`
    : "Utente";

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

  function handleLogout() {
    if (confirm("Sei sicuro di voler uscire?")) {
      logout();
      // Reload the page to trigger authentication check
      window.location.reload();
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="top">
        <div className="p-4">
          <div className="mb-2">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {fullName}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {session?.email || ""}
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
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
