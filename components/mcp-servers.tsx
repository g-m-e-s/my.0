"use client"

import { useState } from "react"
import { useMCP } from "@/lib/context/mcp-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Network, Plus, Trash2, Server, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export function MCPServers() {
  const { servers, connectedServers, maxServers, addServer, removeServer } = useMCP()
  const [open, setOpen] = useState(false)
  const [addingServer, setAddingServer] = useState(false)
  const [newServerName, setNewServerName] = useState("")
  const [newServerUrl, setNewServerUrl] = useState("")

  const handleAddServer = async () => {
    if (!newServerName.trim() || !newServerUrl.trim()) return

    setAddingServer(true)
    const success = await addServer(newServerName, newServerUrl)
    setAddingServer(false)

    if (success) {
      setNewServerName("")
      setNewServerUrl("")
      toast({
        title: "Servidor MCP adicionado",
        description: `${newServerName} foi adicionado com sucesso.`,
      })
    } else {
      toast({
        title: "Erro ao adicionar servidor",
        description: `Limite máximo de ${maxServers} servidores atingido.`,
      })
    }
  }

  const handleRemoveServer = (id: string, name: string) => {
    removeServer(id)
    toast({
      title: "Servidor MCP removido",
      description: `${name} foi removido com sucesso.`,
    })
  }

  const getStatusIcon = (status: "online" | "offline" | "connecting") => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "connecting":
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Network className="h-4 w-4" />
        <span>MCP</span>
        <Badge variant="secondary" className="ml-1 h-5 rounded-full px-2 text-xs">
          {connectedServers}/{maxServers}
        </Badge>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Servidores MCP</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Servidores Conectados</h4>
                <Badge variant="outline" className="font-normal">
                  {connectedServers}/{maxServers}
                </Badge>
              </div>

              <ScrollArea className="h-[200px] rounded-md border">
                {servers.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {servers.map((server) => (
                      <div key={server.id} className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                          <Server className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium leading-none">{server.name}</p>
                            <p className="text-xs text-muted-foreground">{server.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(server.status)}
                            <span className="text-xs capitalize">{server.status}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveServer(server.id, server.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove server</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                    <Server className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">Nenhum servidor MCP conectado</p>
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Adicionar Novo Servidor</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="server-name">Nome do Servidor</Label>
                  <Input
                    id="server-name"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    placeholder="Meu Servidor MCP"
                    disabled={addingServer || servers.length >= maxServers}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="server-url">URL do Servidor</Label>
                  <Input
                    id="server-url"
                    value={newServerUrl}
                    onChange={(e) => setNewServerUrl(e.target.value)}
                    placeholder="https://mcp.example.com"
                    disabled={addingServer || servers.length >= maxServers}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddServer}
              disabled={addingServer || !newServerName.trim() || !newServerUrl.trim() || servers.length >= maxServers}
            >
              {addingServer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Servidor
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
