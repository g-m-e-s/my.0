"use client"

import { useState } from "react"
import { useConversation } from "@/lib/context/conversation-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Download, FileJson, FileText, FileIcon as FilePdf } from "lucide-react"

export function ConversationExport() {
  const { activeTabId, exportConversation } = useConversation()
  const [open, setOpen] = useState(false)

  const handleExport = (format: "pdf" | "markdown" | "json") => {
    exportConversation(activeTabId, format)
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Download className="h-4 w-4" />
        Exportar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Exportar Conversa</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Button variant="outline" className="justify-start gap-2 h-16" onClick={() => handleExport("markdown")}>
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Markdown</div>
                <div className="text-xs text-muted-foreground">Exportar como arquivo de texto formatado</div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start gap-2 h-16" onClick={() => handleExport("json")}>
              <FileJson className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">JSON</div>
                <div className="text-xs text-muted-foreground">Exportar como dados estruturados</div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start gap-2 h-16" onClick={() => handleExport("pdf")}>
              <FilePdf className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">PDF</div>
                <div className="text-xs text-muted-foreground">Exportar como documento PDF</div>
              </div>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
