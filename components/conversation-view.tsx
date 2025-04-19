"use client"

import { useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageItem } from "@/components/message-item"
import { useInterface } from "@/lib/context/interface-context"
import { TerminalInterface } from "@/components/interfaces/terminal-interface"
import { WhiteboardInterface } from "@/components/interfaces/whiteboard-interface"
import { InvestigateInterface } from "@/components/interfaces/investigate-interface"
import { NewsFeed } from "@/components/news-feed"

interface ConversationViewProps {
  conversationId: string
  onSendMessage: (content: string, conversationId: string) => void
}

export function ConversationView({ conversationId, onSendMessage }: ConversationViewProps) {
  const { messages } = useSelector((state: RootState) => state.chat)
  const { mode } = useInterface()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Filter messages for this conversation
  const conversationMessages = messages.filter((msg) => msg.conversationId === conversationId)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current && mode === "chat") {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [conversationMessages, mode])

  const handleSendMessage = (content: string) => {
    onSendMessage(content, conversationId)
  }

  // Render the appropriate interface based on mode
  if (mode === "terminal") {
    return <TerminalInterface />
  }

  if (mode === "whiteboard") {
    return <WhiteboardInterface />
  }

  if (mode === "investigate") {
    return <InvestigateInterface />
  }

  // Default chat interface
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {conversationMessages.length > 0 ? (
          <div className="flex flex-col gap-6">
            {conversationMessages.map((message) => (
              <MessageItem key={message.id} role={message.role} content={message.content} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl py-8">
            <NewsFeed />
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
