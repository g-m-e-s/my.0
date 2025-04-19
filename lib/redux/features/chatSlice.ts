import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  conversationId?: string
  metadata?: {
    type?: string
    [key: string]: any
  }
}

interface ChatState {
  activeConversation: string
  messages: Message[]
}

const initialState: ChatState = {
  activeConversation: "default",
  messages: [
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou o my.0, seu assistente com GPT-4.5 com Investigar e Claude 3.7 Sonnet com Extended Thinking. Como posso ajudar você hoje?",
      timestamp: new Date().toISOString(),
      conversationId: "default",
    },
    {
      id: "2",
      role: "user",
      content: "Como funciona o armazenamento vetorial e o processamento de grafos no my.0?",
      timestamp: new Date().toISOString(),
      conversationId: "default",
    },
    {
      id: "3",
      role: "assistant",
      content: `O armazenamento vetorial e processamento de grafos no my.0 funcionam juntos para criar uma memória persistente e contextual:

Armazenamento Vetorial:
• Cada mensagem e documento são convertidos em vetores de alta dimensão
• Usamos embeddings avançados para capturar o significado semântico
• Esses vetores são armazenados em bancos otimizados como Pinecone
• Permite busca por similaridade semântica, não apenas por palavras-chave

Processamento de Grafos:
• Construímos um grafo de conhecimento conectando entidades e conceitos
• Durante o "Sono da Penseira", analisamos relações entre informações
• O grafo mantém o contexto entre diferentes conversas
• Isso permite que o sistema faça conexões que não seriam óbvias

Juntos, esses sistemas permitem que o my.0 mantenha uma compreensão profunda e contextual das suas interações ao longo do tempo.`,
      timestamp: new Date().toISOString(),
      conversationId: "default",
    },
  ],
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // Add conversationId if not provided
      const message = {
        ...action.payload,
        conversationId: action.payload.conversationId || state.activeConversation,
      }
      state.messages.push(message)
    },
    clearConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload
      // Keep only the welcome message for this conversation
      state.messages = state.messages.filter(
        (msg) =>
          msg.conversationId !== conversationId ||
          (msg.conversationId === conversationId && msg.role === "assistant" && msg.id === "1"),
      )
    },
  },
})

export const { setActiveConversation, addMessage, clearConversation } = chatSlice.actions
export default chatSlice.reducer
