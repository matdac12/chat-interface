"use client";
import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { signOut, useSession } from "next-auth/react";

export default function SettingsPopover({ children, onClearAll }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const fullName = session?.user?.name || "Utente";

  async function handleLogout() {
    if (confirm("Sei sicuro di voler uscire?")) {
      await signOut({ redirect: true, callbackUrl: "/" });
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
              {session?.user?.email || ""}
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-600 dark:text-red-400">
                  <Trash2 className="h-4 w-4" />
                  <span>Elimina tutte le chat</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione eliminerà tutte le conversazioni e non può essere annullata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onClearAll?.();
                      setOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    Elimina tutto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
