"use client"
import { useState } from "react"
import { Paperclip } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function ComposerActionsPopover({ children, onFileClick }) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen) => {
    console.log("[ComposerActionsPopover] Popover open change:", newOpen)
    setOpen(newOpen)
  }

  const handleFileUpload = () => {
    console.log("[ComposerActionsPopover] 'Add photos & files' button clicked")
    console.log("[ComposerActionsPopover] onFileClick exists:", !!onFileClick)
    onFileClick?.()
    console.log("[ComposerActionsPopover] onFileClick called, closing popover with delay")
    // Delay closing to ensure file dialog opens before popover unmounts
    setTimeout(() => setOpen(false), 100)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
