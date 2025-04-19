"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export function VoronButton() {
  const [open, setOpen] = useState(false)

  const memoryItems = [
    {
      title: "Preferências de Interface",
      content: "Você demonstrou preferência por interfaces minimalistas e monocromáticas no estilo xAI/Tesla UI.",
    },
    {
      title: "Modelos Utilizados",
      content:
        "Suas interações são processadas principalmente com GPT-4.5 com Investigar e Claude 3.7 Sonnet com Extended Thinking.",
    },
    {
      title: "Integrações Importantes",
      content: "Você utiliza frequentemente as integrações com GitHub e Google Drive para projetos.",
    },
    {
      title: "Tópicos Recorrentes",
      content:
        "Interesse em armazenamento vetorial e processamento de grafos para memória persistente em sistemas de IA.",
    },
  ]

  return (
    <>
      <div className="px-4 py-3">
        <Button variant="default" className="w-full justify-start gap-2" onClick={() => setOpen(true)}>
          <Brain className="h-4 w-4" />
          Voron - Memória Processada
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Voron - Memória Processada
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {memoryItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <CardTitle className="mb-2 text-base">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
