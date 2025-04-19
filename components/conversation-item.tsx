"use client"

import { useDispatch } from "react-redux"
import { setActiveConversation } from "@/lib/redux/features/chatSlice"
import { toggleSidebar } from "@/lib/redux/features/uiSlice"
import { useConversation } from "@/lib/context/conversation-context"
import { cn } from "@/lib/utils"

interface ConversationItemProps {
  id?: string
  title: string
  time: string
  active?: boolean
}

export function ConversationItem({ id = "conversation", title, time, active = false }: ConversationItemProps) {
  const dispatch = useDispatch()
  const { setActiveTab } = useConversation()

  const handleClick = () => {
    dispatch(setActiveConversation(id))
    setActiveTab(id)
    dispatch(toggleSidebar())
  }

  return (
    <div
      className={cn("flex cursor-pointer rounded-md px-4 py-3 transition-colors hover:bg-muted", active && "bg-muted")}
      onClick={handleClick}
    >
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{time}</div>
      </div>
    </div>
  )
}
