"use client"

import { ConversationHistory } from "@/components/conversation-history"
import { ConversationTagging } from "@/components/conversation-tagging"
import { ConversationTemplates } from "@/components/conversation-templates"
import { ConversationExport } from "@/components/conversation-export"
import { ConversationMerge } from "@/components/conversation-merge"

export function ConversationToolbar() {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-2 overflow-x-auto">
      <ConversationHistory />
      <ConversationTagging />
      <ConversationTemplates />
      <ConversationExport />
      <ConversationMerge />
    </div>
  )
}
