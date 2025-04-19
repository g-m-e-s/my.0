"use client"

import { useState } from "react"
import { useConversation } from "@/lib/context/conversation-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, FileText, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function ConversationTemplates() {
  const { templates, addTab } = useConversation()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTemplates = searchQuery
    ? templates.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : templates

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      addTab(template.title, undefined, templateId)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <FileText className="h-4 w-4" />
        Templates
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Templates de Conversa</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <CardDescription className="text-xs">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-xs text-muted-foreground">
                      {template.initialMessages.length} mensagens iniciais
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full" onClick={() => handleUseTemplate(template.id)}>
                      <Plus className="mr-2 h-3.5 w-3.5" />
                      Usar Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
