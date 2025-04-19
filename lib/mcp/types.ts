export interface MCPServer {
  id: string
  name: string
  url: string
  status: "online" | "offline" | "connecting"
  models: MCPModel[]
  connectedAt: string
}

export interface MCPModel {
  id: string
  name: string
  provider: string
  contextWindow: number
  capabilities: string[]
}

export interface MCPMessage {
  role: "user" | "assistant" | "system"
  content: string
  name?: string
}

export interface MCPRequest {
  messages: MCPMessage[]
  model: string
  max_tokens?: number
  temperature?: number
  stream?: boolean
}

export interface MCPResponse {
  id: string
  model: string
  choices: {
    message: MCPMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
