"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilePickerButtonProps {
  onFileSelect?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onModelSelect?: (model: string) => void
}

export function FilePickerButton({
  onFileSelect,
  accept,
  multiple = false,
  maxSize = 10,
  onModelSelect,
}: FilePickerButtonProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("Base")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    // Filter files by size
    const validFiles = files.filter((file) => {
      const sizeInMB = file.size / (1024 * 1024)
      return sizeInMB <= maxSize
    })

    setSelectedFiles(validFiles)
    onFileSelect?.(validFiles)
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    onModelSelect?.(value)
  }

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
    onFileSelect?.(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <Button onClick={handleButtonClick} size="icon" className="size-10">
          <Plus className="size-5" />
        </Button>

        <Select value={selectedModel} onValueChange={handleModelChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Base">Base</SelectItem>
            <SelectItem value="Medio">Medio</SelectItem>
            <SelectItem value="Avanzato">Avanzato</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} selected
          </p>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="shrink-0">
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
