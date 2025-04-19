"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RAGButton() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsSearching(true)
    // Aqui você implementaria a chamada real para o sistema RAG
    setTimeout(() => {
      setResults([
        { title: "Resultado 1", content: "Conteúdo do resultado 1..." },
        { title: "Resultado 2", content: "Conteúdo do resultado 2..." },
      ])
      setIsSearching(false)
    }, 1000)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Database className="h-4 w-4" />
        RAG
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Pesquisa RAG
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <span className="sr-only">Fechar</span>
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite sua busca..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>

            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">{result.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}