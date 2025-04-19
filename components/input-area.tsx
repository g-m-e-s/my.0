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
    <div className="border-t bg-card p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-3 mb-2 md:mb-3">
        <div className="flex gap-2 overflow-x-auto md:overflow-visible">
          <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={switchToWhiteboard}>
            <LayoutPanelLeft className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Lousa</span>
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={switchToTerminal}>
            <Code className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Código</span>
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={switchToInvestigate}>
            <Search className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Investigar</span>
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
          placeholder="Digite sua mensagem..."
          className="min-h-[40px] md:min-h-[48px] pr-10 md:pr-12 resize-none text-sm md:text-base"
          rows={1}
        />
        <Button 
          size="icon" 
          className="absolute right-1 md:right-2 bottom-1 md:bottom-2 h-8 w-8 md:h-9 md:w-9" 
          onClick={handleSend} 
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}
