"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export function MemoryButton() {
  const [open, setOpen] = useState(false)

  const memoryItems = [
    {
      title: "Preferências de Interface",
      content: "Você demonstrou preferência por interfaces minimalistas e monocromáticas no estilo xAI/Tesla UI.",
    },
    {
      title: "Modelos Utilizados",
      content: "Suas interações são processadas principalmente com GPT-4o, OpenAI o1, Claude 3.7, Grok 3 e Phi 4.",
    },
    {
      title: "Integrações Importantes",
      content: "Você utiliza frequentemente as integrações com GitHub, Microsoft e Google para projetos.",
    },
    {
      title: "Tópicos Recorrentes",
      content:
        "Interesse em armazenamento vetorial e processamento de grafos para memória persistente em sistemas de IA.",
    },
  ]

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Brain className="h-4 w-4" />
        Memória
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Memória Processada
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
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
