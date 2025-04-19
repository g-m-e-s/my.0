"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { MCPServer, MCPModel } from "@/lib/mcp/types"
import { v4 as uuidv4 } from "uuid"

interface MCPContextType {
  servers: MCPServer[]
  connectedServers: number
  maxServers: number
  addServer: (name: string, url: string) => Promise<boolean>
  removeServer: (id: string) => void
  getServerStatus: (id: string) => "online" | "offline" | "connecting"
  getAvailableModels: () => MCPModel[]
}

const MCPContext = createContext<MCPContextType | undefined>(undefined)

export function MCPProvider({ children }: { children: React.ReactNode }) {
  const [servers, setServers] = useState<MCPServer[]>([])
  const maxServers = 6

  // Load servers from localStorage on initial render
  useEffect(() => {
    const savedServers = localStorage.getItem("my0-mcp-servers")
    if (savedServers) {
      try {
        setServers(JSON.parse(savedServers))
      } catch (error) {
        console.error("Error loading MCP servers from localStorage:", error)
      }
    }
  }, [])

  // Save servers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("my0-mcp-servers", JSON.stringify(servers))
  }, [servers])

  const addServer = async (name: string, url: string): Promise<boolean> => {
    if (servers.length >= maxServers) {
      return false
    }

    // In a real implementation, we would validate the server URL and check connectivity
    // For now, we'll simulate a connection
    const newServer: MCPServer = {
      id: uuidv4(),
      name,
      url,
      status: "connecting",
      models: [],
      connectedAt: new Date().toISOString(),
    }

    setServers((prev) => [...prev, newServer])

    // Simulate connection and model discovery
    setTimeout(() => {
      setServers((prev) =>
        prev.map((server) =>
          server.id === newServer.id
            ? {
                ...server,
                status: "online",
                models: [
                  {
                    id: "gpt-4",
                    name: "GPT-4",
                    provider: "OpenAI",
                    contextWindow: 8192,
                    capabilities: ["chat", "embeddings"],
                  },
                  {
                    id: "claude-3",
                    name: "Claude 3",
                    provider: "Anthropic",
                    contextWindow: 100000,
                    capabilities: ["chat"],
                  },
                ],
              }
            : server,
        ),
      )
    }, 2000)

    return true
  }

  const removeServer = (id: string) => {
    setServers((prev) => prev.filter((server) => server.id !== id))
  }

  const getServerStatus = (id: string) => {
    const server = servers.find((s) => s.id === id)
    return server?.status || "offline"
  }

  const getAvailableModels = () => {
    return servers.filter((s) => s.status === "online").flatMap((s) => s.models)
  }

  return (
    <MCPContext.Provider
      value={{
        servers,
        connectedServers: servers.filter((s) => s.status === "online").length,
        maxServers,
        addServer,
        removeServer,
        getServerStatus,
        getAvailableModels,
      }}
    >
      {children}
    </MCPContext.Provider>
  )
}

export function useMCP() {
  const context = useContext(MCPContext)
  if (context === undefined) {
    throw new Error("useMCP must be used within an MCPProvider")
  }
  return context
}
