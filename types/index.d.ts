export interface VectorStore {
  id: string
  name: string
  type: "pinecone" | "qdrant" | "weaviate"
  dimensions: number
  count: number
}

export interface GraphDatabase {
  id: string
  name: string
  type: "neo4j" | "tigergraph"
  nodes: number
  relationships: number
}

export interface AIModel {
  id: string
  name: string
  provider: "openai" | "anthropic" | "microsoft"
  contextWindow: number
  maxTokens: number
}

export interface RAGConfig {
  vectorStoreId: string
  graphDatabaseId: string
  embeddingModel: string
  retrievalStrategy: "semantic" | "hybrid" | "heuristic"
  reranking: boolean
}
