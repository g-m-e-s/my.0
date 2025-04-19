"use client"

import { ConversationHistory } from "@/components/conversation-history"
import { ConversationTagging } from "@/components/conversation-tagging"
import { ConversationTemplates } from "@/components/conversation-templates"
import { ConversationExport } from "@/components/conversation-export"
import { ConversationMerge } from "@/components/conversation-merge"
import { MemoryButton } from "@/components/memory-button"
import { RAGButton } from "@/components/rag-button"
import { Separator } from "@/components/ui/separator"

export function ConversationToolbar() {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-2 overflow-x-auto">
      <ConversationHistory />
      <ConversationTagging />
      <ConversationTemplates />
      <ConversationExport />
      <ConversationMerge />
      <Separator orientation="vertical" className="h-6" />
      <RAGButton />
      <MemoryButton />
    </div>
  )
}
