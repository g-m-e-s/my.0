"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Paperclip, X, File, ImageIcon, FileText, FileCode, Upload, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type FileWithPreview = {
  file: File
  id: string
  preview?: string
  progress: number
  status: "uploading" | "complete" | "error"
}

export function FileUpload({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (newFiles: File[]) => {
    const filesToAdd = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...filesToAdd])

    // Simulate upload progress
    filesToAdd.forEach((fileWithPreview) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileWithPreview.id) {
              const newProgress = Math.min(f.progress + 10, 100)
              if (newProgress === 100) {
                clearInterval(interval)
                return { ...f, progress: newProgress, status: "complete" }
              }
              return { ...f, progress: newProgress }
            }
            return f
          }),
        )
      }, 300)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const handleUpload = () => {
    const completedFiles = files.filter((f) => f.status === "complete").map((f) => f.file)
    if (completedFiles.length === 0) return

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      onFilesSelected(completedFiles)
      setIsUploading(false)
      setFiles([])
      setOpen(false)
    }, 1000)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-6 w-6 text-blue-500" />
    if (file.type.includes("pdf")) return <FileText className="h-6 w-6 text-red-500" />
    if (file.type.includes("word") || file.type.includes("document"))
      return <FileText className="h-6 w-6 text-blue-500" />
    if (file.type.includes("excel") || file.type.includes("sheet"))
      return <FileText className="h-6 w-6 text-green-500" />
    if (file.type.includes("text") || file.name.endsWith(".txt")) return <FileText className="h-6 w-6 text-gray-500" />
    if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts") ||
      file.name.endsWith(".py") ||
      file.name.endsWith(".java")
    )
      return <FileCode className="h-6 w-6 text-yellow-500" />
    return <File className="h-6 w-6 text-gray-500" />
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Paperclip className="h-4 w-4" />
        Anexar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Anexar Arquivos</DialogTitle>
          </DialogHeader>

          <div
            className={cn(
              "mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.js,.ts,.py,.java"
            />
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">Arraste e solte arquivos aqui ou</p>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="mb-2">
              Selecionar Arquivos
            </Button>
            <p className="text-xs text-muted-foreground">Suporta imagens, PDFs, documentos e arquivos de código</p>
          </div>

          {files.length > 0 && (
            <ScrollArea className="mt-4 max-h-[200px]">
              <div className="space-y-2">
                {files.map((fileWithPreview) => (
                  <div key={fileWithPreview.id} className="flex items-center gap-4 rounded-md border p-2">
                    {fileWithPreview.preview ? (
                      <img
                        src={fileWithPreview.preview || "/placeholder.svg"}
                        alt={fileWithPreview.file.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      getFileIcon(fileWithPreview.file)
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{fileWithPreview.file.name}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={fileWithPreview.progress} className="h-1.5 w-full" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {fileWithPreview.status === "uploading"
                            ? `${fileWithPreview.progress}%`
                            : fileWithPreview.status === "complete"
                              ? "Completo"
                              : "Erro"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(fileWithPreview.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || files.some((f) => f.status === "uploading") || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Arquivos"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
