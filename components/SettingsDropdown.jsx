"use client";
import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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

export default function SettingsDropdown({ children, onClearAll }) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { data: session } = useSession();
  const fullName = session?.user?.name || "Utente";

  async function handleLogout() {
    await signOut({ redirect: true, callbackUrl: "/" });
    setLogoutDialogOpen(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="top">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Esci</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Conferma uscita</AlertDialogTitle>
                <AlertDialogDescription>
                  Sei sicuro di voler uscire dall'applicazione?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Esci
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Elimina tutte le chat</span>
              </DropdownMenuItem>
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
                  onClick={onClearAll}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  Elimina tutto
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
