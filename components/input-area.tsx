"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, LayoutPanelLeft, Code, Search } from "lucide-react"
import { useInterface } from "@/lib/context/interface-context"
import { FileUpload } from "@/components/file-upload"
import { VoiceRecorder } from "@/components/voice-recorder"

interface InputAreaProps {
  onSendMessage: (content: string) => void
}

export function InputArea({ onSendMessage }: InputAreaProps) {
  const { setMode } = useInterface()
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFilesSelected = (files: File[]) => {
    // In a real implementation, we would upload these files and add them to the conversation
    // For now, we'll just add a message with the file names
    const fileNames = files.map((file) => file.name).join(", ")
    onSendMessage(`Arquivos anexados: ${fileNames}`)
  }

  const handleTranscription = (text: string) => {
    setMessage(text)
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const switchToWhiteboard = () => {
    setMode("whiteboard")
  }

  const switchToTerminal = () => {
    setMode("terminal")
  }

  const switchToInvestigate = () => {
    setMode("investigate")
  }

  return (
    <div className="border-t bg-card p-4">
      <div className="flex justify-between mb-3 overflow-x-auto">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={switchToWhiteboard}>
            <LayoutPanelLeft className="h-4 w-4 mr-2" />
            Lousa
          </Button>
          <Button variant="outline" size="sm" onClick={switchToTerminal}>
            <Code className="h-4 w-4 mr-2" />
            Código
          </Button>
          <Button variant="outline" size="sm" onClick={switchToInvestigate}>
            <Search className="h-4 w-4 mr-2" />
            Investigar
          </Button>
        </div>
        <div className="flex gap-2">
          <FileUpload onFilesSelected={handleFilesSelected} />
          <VoiceRecorder onTranscription={handleTranscription} />
        </div>
      </div>

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem ou use o Whisper para falar..."
          className="min-h-[48px] pr-12 resize-none"
          rows={1}
        />
        <Button size="icon" className="absolute right-2 bottom-2" onClick={handleSend} disabled={!message.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}
