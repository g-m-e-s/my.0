"use client"

import { useState } from "react"
import { useConversation } from "@/lib/context/conversation-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Clock, RotateCcw } from "lucide-react"
import { format } from "date-fns"

export function ConversationHistory() {
  const { conversationHistory, restoreConversation } = useConversation()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = searchQuery
    ? conversationHistory.filter((conv) => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversationHistory

  const handleRestore = (id: string) => {
    restoreConversation(id)
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Clock className="h-4 w-4" />
        Histórico
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Histórico de Conversas</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar no histórico..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {filteredHistory.length > 0 ? (
              <div className="space-y-4">
                {filteredHistory.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-accent"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{conversation.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(conversation.createdAt), "dd/MM/yyyy HH:mm")}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleRestore(conversation.id)}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restaurar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <Clock className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Nenhuma conversa arquivada encontrada</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
