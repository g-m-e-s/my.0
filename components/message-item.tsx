"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageItemProps {
  role: "user" | "assistant"
  content: string
  conversationId?: string
}

export function MessageItem({ role, content, conversationId }: MessageItemProps) {
  const [showActions, setShowActions] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
  }

  const handleListen = () => {
    // Text-to-speech functionality would go here
    console.log("Listen to message:", content)
  }

  return (
    <div
      className={cn("group flex max-w-[80%] flex-col", role === "user" ? "ml-auto" : "")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      data-conversation-id={conversationId}
    >
      {role === "assistant" && <div className="mb-1 text-xs font-semibold text-muted-foreground">my.0</div>}
      <div
        className={cn(
          "rounded-lg p-3",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground shadow-sm border",
        )}
      >
        {content}
      </div>
      {role === "assistant" && (
        <div className={cn("mt-2 flex gap-2 transition-opacity", showActions ? "opacity-100" : "opacity-0")}>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleListen}>
            <Volume2 className="h-3 w-3" />
            Ouvir
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
            Copiar
          </Button>
        </div>
      )}
    </div>
  )
}
