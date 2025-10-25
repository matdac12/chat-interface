"use client"
import { useState } from "react"
import { Paperclip } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function ComposerActionsPopover({ children, onFileClick }) {
  const [open, setOpen] = useState(false)

  const handleFileUpload = () => {
    onFileClick?.()
    setOpen(false) // Close popover immediately after clicking
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start" side="top">
        <div className="p-2">
          <button
            onClick={handleFileUpload}
            className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Paperclip className="h-4 w-4" />
            <span>Add photos & files</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
