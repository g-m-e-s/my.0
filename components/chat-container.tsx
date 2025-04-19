"use client"

import { useDispatch } from "react-redux"
import { addMessage } from "@/lib/redux/features/chatSlice"
import { InputArea } from "@/components/input-area"
import { useInterface } from "@/lib/context/interface-context"
import { useConversation } from "@/lib/context/conversation-context"
import { ConversationView } from "@/components/conversation-view"
import { ConversationTabs } from "@/components/conversation-tabs"
import { ConversationToolbar } from "@/components/conversation-toolbar"
import { cn } from "@/lib/utils"

export function ChatContainer() {
  const dispatch = useDispatch()
  const { mode } = useInterface()
  const { tabs, activeTabId, splitView } = useConversation()

  const handleSendMessage = (content: string, conversationId: string) => {
    // Add user message
    dispatch(
      addMessage({
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        conversationId,
      }),
    )

    // Simulate assistant response
    setTimeout(() => {
      dispatch(
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Isso é uma resposta simulada para: "${content}"`,
          timestamp: new Date().toISOString(),
          conversationId,
        }),
      )
    }, 1000)
  }

  // If not in chat mode, render the specialized interface without tabs and toolbar
  if (mode !== "chat") {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <ConversationView conversationId={activeTabId} onSendMessage={handleSendMessage} />
        <InputArea onSendMessage={(content) => handleSendMessage(content, activeTabId)} />
      </div>
    )
  }

  // In split view, show all tabs side by side
  if (splitView) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <ConversationTabs />
        <ConversationToolbar />
        <div className="flex flex-1 overflow-hidden">
          {tabs.map((tab, index) => (
            <div key={tab.id} className={cn("flex flex-1 flex-col overflow-hidden", index > 0 && "border-l")}>
              <div className="p-2 text-center text-xs font-medium text-muted-foreground">{tab.title}</div>
              <ConversationView conversationId={tab.id} onSendMessage={handleSendMessage} />
            </div>
          ))}
        </div>
        <InputArea onSendMessage={(content) => handleSendMessage(content, activeTabId)} />
      </div>
    )
  }

  // Regular single view
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ConversationTabs />
      <ConversationToolbar />
      <ConversationView conversationId={activeTabId} onSendMessage={handleSendMessage} />
      <InputArea onSendMessage={(content) => handleSendMessage(content, activeTabId)} />
    </div>
  )
}
