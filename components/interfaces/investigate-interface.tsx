"use client"

import type React from "react"

import { useState } from "react"
import { useInterface } from "@/lib/context/interface-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, ExternalLink, FileText, Globe, Database, X } from "lucide-react"

type SearchResult = {
  id: string
  title: string
  snippet: string
  url: string
  source: "web" | "knowledge-base" | "documents"
}

export function InvestigateInterface() {
  const { setMode, previousMode } = useInterface()
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const handleSearch = () => {
    if (!query.trim()) return

    setSearching(true)
    setResults([])

    // Simulate search delay
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Vector Embeddings Explained",
          snippet:
            "Vector embeddings are numerical representations of data that capture semantic meaning. They're used in RAG systems to find relevant information.",
          url: "https://example.com/vector-embeddings",
          source: "web",
        },
        {
          id: "2",
          title: "Graph Databases for AI Applications",
          snippet:
            "Graph databases store data in nodes and relationships, making them ideal for complex knowledge representation in AI systems.",
          url: "https://example.com/graph-databases",
          source: "web",
        },
        {
          id: "3",
          title: "Internal Document: RAG Implementation",
          snippet:
            "This document outlines our approach to implementing Retrieval Augmented Generation using vector stores and knowledge graphs.",
          url: "/documents/rag-implementation.pdf",
          source: "documents",
        },
        {
          id: "4",
          title: "Knowledge Base: Vector Search Optimization",
          snippet:
            "Best practices for optimizing vector search in high-dimensional spaces, including indexing strategies and distance metrics.",
          url: "/kb/vector-search-optimization",
          source: "knowledge-base",
        },
        {
          id: "5",
          title: "Semantic Search vs Keyword Search",
          snippet:
            "Comparing traditional keyword search with modern semantic search approaches based on vector embeddings.",
          url: "https://example.com/semantic-vs-keyword",
          source: "web",
        },
      ]

      setResults(mockResults)
      setSearching(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleClose = () => {
    setMode(previousMode || "chat")
  }

  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter((result) => {
          if (activeTab === "web") return result.source === "web"
          if (activeTab === "kb") return result.source === "knowledge-base"
          if (activeTab === "docs") return result.source === "documents"
          return true
        })

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "web":
        return <Globe className="h-4 w-4 text-blue-500" />
      case "knowledge-base":
        return <Database className="h-4 w-4 text-purple-500" />
      case "documents":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-card p-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to chat</span>
          </Button>
          <div className="ml-2 text-sm font-medium">Investigate</div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close investigate</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b bg-muted/30 p-4">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for information..."
            className="pr-10"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={handleSearch}
            disabled={searching || !query.trim()}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="border-b bg-card px-4">
          <TabsList className="h-10">
            <TabsTrigger value="all" className="text-xs">
              All Results
            </TabsTrigger>
            <TabsTrigger value="web" className="text-xs">
              Web
            </TabsTrigger>
            <TabsTrigger value="kb" className="text-xs">
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="docs" className="text-xs">
              Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="flex-1 p-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1 p-4">
            {searching ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <Card key={result.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(result.source)}
                          <CardTitle className="text-base">{result.title}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open link</span>
                          </a>
                        </Button>
                      </div>
                      <CardDescription className="text-xs">{result.url}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{result.snippet}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : query ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-center text-sm text-muted-foreground">
                  No results found. Try a different search term.
                </p>
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <Search className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Enter a search term to investigate</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
