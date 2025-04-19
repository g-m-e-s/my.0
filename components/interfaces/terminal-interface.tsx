"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addMessage } from "@/lib/redux/features/chatSlice"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useInterface } from "@/lib/context/interface-context"
import { ArrowLeft, X } from "lucide-react"

export function TerminalInterface() {
  const dispatch = useDispatch()
  const { messages } = useSelector((state: RootState) => state.chat)
  const { setMode, previousMode } = useInterface()
  const [command, setCommand] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter only code-related messages or commands
  const codeMessages = messages.filter(
    (msg) => (msg.role === "user" && msg.content.startsWith("/")) || msg.metadata?.type === "code",
  )

  useEffect(() => {
    // Focus the input when terminal is shown
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [codeMessages])

  const handleSendCommand = () => {
    if (command.trim()) {
      // Add user command
      dispatch(
        addMessage({
          id: Date.now().toString(),
          role: "user",
          content: command,
          timestamp: new Date().toISOString(),
          metadata: { type: "code" },
        }),
      )

      // Simulate response
      setTimeout(() => {
        let response = ""
        if (command.startsWith("ls")) {
          response = "Documents  Downloads  Pictures  Projects  README.md"
        } else if (command.startsWith("cd")) {
          response = `Changed directory to ${command.split(" ")[1]}`
        } else if (command.startsWith("python") || command.startsWith("node")) {
          response = "Running script...\nExecution complete."
        } else if (command.startsWith("git")) {
          response = "Git operation completed successfully."
        } else {
          response = `Command executed: ${command}`
        }

        dispatch(
          addMessage({
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response,
            timestamp: new Date().toISOString(),
            metadata: { type: "code" },
          }),
        )
      }, 500)

      setCommand("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendCommand()
    }
  }

  const handleClose = () => {
    setMode(previousMode || "chat")
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-black p-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800" onClick={handleClose}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to chat</span>
          </Button>
          <div className="ml-2 text-sm font-medium text-white">Terminal</div>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800" onClick={handleClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close terminal</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 bg-black p-4 font-mono text-sm text-green-500">
        <div ref={terminalRef} className="space-y-2">
          <div className="text-gray-400">Welcome to my.0 Terminal. Type commands to interact.</div>
          {codeMessages.map((message, index) => (
            <div key={message.id} className="space-y-1">
              {message.role === "user" ? (
                <div className="flex">
                  <span className="mr-2 text-yellow-500">$</span>
                  <span>{message.content}</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap pl-4 text-gray-300">{message.content}</div>
              )}
            </div>
          ))}
          <div className="flex items-center pt-2">
            <span className="mr-2 text-yellow-500">$</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-500 outline-none"
              placeholder="Type a command..."
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
