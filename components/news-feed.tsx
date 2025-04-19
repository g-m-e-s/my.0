"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, RefreshCw, Newspaper, Globe, Lightbulb, Zap } from "lucide-react"

type NewsItem = {
  id: string
  title: string
  description: string
  source: string
  url: string
  publishedAt: string
  category: "tech" | "ai" | "world"
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"tech" | "ai" | "world">("tech")

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          id: "1",
          title: "OpenAI lança novo modelo GPT-5 com capacidades avançadas de raciocínio",
          description:
            "O novo modelo apresenta melhorias significativas em raciocínio matemático e compreensão contextual.",
          source: "TechCrunch",
          url: "#",
          publishedAt: "2025-04-18T10:30:00Z",
          category: "ai",
        },
        {
          id: "2",
          title: "Microsoft anuncia nova versão do Windows com IA integrada",
          description: "O Windows 12 terá recursos de IA integrados em todo o sistema operacional.",
          source: "The Verge",
          url: "#",
          publishedAt: "2025-04-18T09:15:00Z",
          category: "tech",
        },
        {
          id: "3",
          title: "Google apresenta nova geração de chips TPU para processamento de IA",
          description: "Os novos chips TPU v6 prometem ser 3x mais rápidos que a geração anterior.",
          source: "Wired",
          url: "#",
          publishedAt: "2025-04-17T14:45:00Z",
          category: "tech",
        },
        {
          id: "4",
          title: "Avanços em IA generativa transformam indústria criativa",
          description: "Artistas e designers estão adotando ferramentas de IA para ampliar suas capacidades criativas.",
          source: "MIT Technology Review",
          url: "#",
          publishedAt: "2025-04-17T11:20:00Z",
          category: "ai",
        },
        {
          id: "5",
          title: "Nova regulamentação de IA aprovada na União Europeia",
          description: "As novas regras estabelecem padrões rigorosos para sistemas de IA de alto risco.",
          source: "Reuters",
          url: "#",
          publishedAt: "2025-04-16T16:30:00Z",
          category: "world",
        },
        {
          id: "6",
          title: "Avanços em computação quântica prometem revolucionar a criptografia",
          description: "Pesquisadores alcançam marco importante na correção de erros quânticos.",
          source: "Science Daily",
          url: "#",
          publishedAt: "2025-04-16T13:45:00Z",
          category: "tech",
        },
        {
          id: "7",
          title: "Novo framework de IA ética lançado por consórcio global",
          description: "O framework estabelece diretrizes para o desenvolvimento responsável de sistemas de IA.",
          source: "AI News",
          url: "#",
          publishedAt: "2025-04-15T09:10:00Z",
          category: "ai",
        },
        {
          id: "8",
          title: "Conferência internacional sobre mudanças climáticas destaca papel da tecnologia",
          description: "Especialistas discutem como a IA pode ajudar a combater as mudanças climáticas.",
          source: "BBC",
          url: "#",
          publishedAt: "2025-04-15T08:30:00Z",
          category: "world",
        },
      ]

      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }

  const filteredNews = news.filter((item) => activeTab === "tech" || item.category === activeTab)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getCategoryIcon = (category: "tech" | "ai" | "world") => {
    switch (category) {
      case "tech":
        return <Globe className="h-4 w-4" />
      case "ai":
        return <Lightbulb className="h-4 w-4" />
      case "world":
        return <Newspaper className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Notícias em Destaque</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchNews} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <Tabs
        defaultValue="tech"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "tech" | "ai" | "world")}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tech" className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tecnologia</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">IA</span>
          </TabsTrigger>
          <TabsTrigger value="world" className="flex items-center gap-1">
            <Newspaper className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mundo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Carregando notícias...</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredNews.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getCategoryIcon(item.category)}
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="ml-auto" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-3.5 w-3.5" />
                          Ler mais
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
