"use client"

import { useState } from "react"
import { useConversation } from "@/lib/context/conversation-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { GitMerge } from "lucide-react"

export function ConversationMerge() {
  const { tabs, activeTabId, mergeConversations } = useConversation()
  const [open, setOpen] = useState(false)
  const [selectedTabs, setSelectedTabs] = useState<string[]>([activeTabId])

  const handleToggleTab = (tabId: string) => {
    setSelectedTabs((prev) => (prev.includes(tabId) ? prev.filter((id) => id !== tabId) : [...prev, tabId]))
  }

  const handleMerge = () => {
    if (selectedTabs.length >= 2) {
      mergeConversations(selectedTabs)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <GitMerge className="h-4 w-4" />
        Mesclar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Mesclar Conversas</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Selecione as conversas que deseja mesclar em uma única conversa.
            </p>

            <div className="space-y-2">
              {tabs.map((tab) => (
                <div key={tab.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tab-${tab.id}`}
                    checked={selectedTabs.includes(tab.id)}
                    onCheckedChange={() => handleToggleTab(tab.id)}
                  />
                  <Label htmlFor={`tab-${tab.id}`} className="text-sm font-medium">
                    {tab.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleMerge} disabled={selectedTabs.length < 2}>
              Mesclar Conversas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
