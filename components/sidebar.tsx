"use client"
import { useDispatch, useSelector } from "react-redux"
import { toggleSidebar } from "@/lib/redux/features/uiSlice"
import type { RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Github, X, User2, Mail } from "lucide-react"
import { ConversationItem } from "@/components/conversation-item"
import { MemoryButton } from "@/components/memory-button"
import Image from "next/image"

export function Sidebar() {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector((state: RootState) => state.ui)

  const conversations = [
    { id: "new", title: "Nova conversa", time: "Agora", active: true },
    { id: "data", title: "Análise de Dados", time: "14:30", active: false },
    { id: "ui", title: "Brainstorming de Interface", time: "12:15", active: false },
    { id: "project", title: "Plano de Projeto", time: "09:45", active: false },
  ]

  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={() => dispatch(toggleSidebar())}>
        <SheetContent side="left" className="p-0 sm:max-w-[280px]">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center">
                <Image src="/logo.png" alt="my.0 Logo" width={24} height={24} className="mr-2" />
                <span className="text-lg font-semibold">my.0</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>

            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Conversas de Hoje
            </div>

            <ScrollArea className="flex-1 px-2">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  title={conversation.title}
                  time={conversation.time}
                  active={conversation.active}
                />
              ))}
            </ScrollArea>

            <MemoryButton />

            <div className="border-t p-4">
              <div className="space-y-2">
                <Button variant="outline" className="flex w-full items-center justify-start gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Conectado
                </Button>
                <Button variant="outline" className="flex w-full items-center justify-start gap-2">
                  <User2 className="h-4 w-4" />
                  Microsoft Conectado
                </Button>
                <Button variant="outline" className="flex w-full items-center justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  Google Conectado
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
