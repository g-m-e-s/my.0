"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addMessage, setActiveConversation } from "@/lib/redux/features/chatSlice"
import { v4 as uuidv4 } from "uuid"

export type ConversationTag = {
  id: string
  name: string
  color: string
}

export type ConversationTemplate = {
  id: string
  title: string
  description: string
  initialMessages: Array<{
    role: "user" | "assistant"
    content: string
  }>
}

export type ConversationTab = {
  id: string
  title: string
  active: boolean
  createdAt: string
  updatedAt: string
  tags: string[] // Tag IDs
  templateId?: string
}

interface ConversationContextType {
  tabs: ConversationTab[]
  activeTabId: string
  splitView: boolean
  tags: ConversationTag[]
  templates: ConversationTemplate[]
  conversationHistory: ConversationTab[]
  addTab: (title?: string, cloneFrom?: string, templateId?: string) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  toggleSplitView: () => void
  isMobile: boolean
  reorderTabs: (activeId: string, overId: string) => void
  renameTab: (id: string, newTitle: string) => void
  searchTabs: (query: string) => ConversationTab[]
  saveTabsToLocalStorage: () => void
  loadTabsFromLocalStorage: () => void
  getShareLink: (tabId: string) => string
  exportConversation: (tabId: string, format: "pdf" | "markdown" | "json") => void
  mergeConversations: (tabIds: string[]) => string
  addTag: (name: string, color: string) => string
  removeTag: (tagId: string) => void
  addTagToConversation: (conversationId: string, tagId: string) => void
  removeTagFromConversation: (conversationId: string, tagId: string) => void
  addTemplate: (
    title: string,
    description: string,
    initialMessages: Array<{ role: "user" | "assistant"; content: string }>,
  ) => string
  removeTemplate: (templateId: string) => void
  getConversationHistory: () => ConversationTab[]
  archiveConversation: (tabId: string) => void
  restoreConversation: (tabId: string) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { messages } = useSelector((state: RootState) => state.chat)
  const [tabs, setTabs] = useState<ConversationTab[]>([
    {
      id: "default",
      title: "Nova conversa",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    },
  ])
  const [activeTabId, setActiveTabId] = useState("default")
  const [splitView, setSplitView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [tags, setTags] = useState<ConversationTag[]>([
    { id: "tag1", name: "Importante", color: "#ef4444" },
    { id: "tag2", name: "Trabalho", color: "#3b82f6" },
    { id: "tag3", name: "Pessoal", color: "#10b981" },
    { id: "tag4", name: "Ideias", color: "#f59e0b" },
  ])
  const [templates, setTemplates] = useState<ConversationTemplate[]>([
    {
      id: "template1",
      title: "Brainstorming",
      description: "Iniciar uma sessão de brainstorming para gerar ideias criativas",
      initialMessages: [
        {
          role: "user",
          content: "Vamos fazer um brainstorming sobre [tema]. Preciso de ideias criativas e inovadoras.",
        },
        {
          role: "assistant",
          content: "Claro! Vamos explorar ideias criativas para o tema. Aqui estão algumas sugestões iniciais...",
        },
      ],
    },
    {
      id: "template2",
      title: "Análise de Código",
      description: "Analisar e melhorar um trecho de código",
      initialMessages: [
        {
          role: "user",
          content: "Pode analisar este código e sugerir melhorias?\n```\n// Cole seu código aqui\n```",
        },
        {
          role: "assistant",
          content: "Analisei seu código. Aqui está minha avaliação e sugestões de melhoria...",
        },
      ],
    },
  ])
  const [conversationHistory, setConversationHistory] = useState<ConversationTab[]>([])

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)

      // If mobile, disable split view
      if (window.innerWidth < 1024 && splitView) {
        setSplitView(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [splitView])

  // Load tabs from localStorage on initial render
  useEffect(() => {
    loadTabsFromLocalStorage()
  }, [])

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    saveTabsToLocalStorage()
  }, [tabs, tags, templates, conversationHistory])

  const addTab = (title = "Nova conversa", cloneFrom?: string, templateId?: string) => {
    // Limit to 3 tabs
    if (tabs.length >= 3) return

    const newId = uuidv4()
    const now = new Date().toISOString()

    // Update tabs
    setTabs((prev) =>
      prev
        .map((tab) => ({ ...tab, active: false }))
        .concat({
          id: newId,
          title,
          active: true,
          createdAt: now,
          updatedAt: now,
          tags: [],
          templateId,
        }),
    )

    setActiveTabId(newId)
    dispatch(setActiveConversation(newId))

    // Clone messages if needed
    if (cloneFrom) {
      const cloneMessages = messages.filter((msg) => msg.conversationId === cloneFrom)

      // Add cloned messages to new conversation
      cloneMessages.forEach((msg) => {
        dispatch(
          addMessage({
            ...msg,
            id: uuidv4(),
            conversationId: newId,
            timestamp: new Date().toISOString(),
            content: msg.content + (msg.role === "assistant" ? "\n\n(Clonado da conversa anterior)" : ""),
          }),
        )
      })
    } else if (templateId) {
      // Use template if provided
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        template.initialMessages.forEach((msg, index) => {
          dispatch(
            addMessage({
              id: `${newId}-template-${index}`,
              role: msg.role,
              content: msg.content,
              conversationId: newId,
              timestamp: new Date().toISOString(),
            }),
          )
        })
      }
    }

    return newId
  }

  const removeTab = (id: string) => {
    // Don't remove if it's the last tab
    if (tabs.length <= 1) return

    const isActive = tabs.find((tab) => tab.id === id)?.active
    const newTabs = tabs.filter((tab) => tab.id !== id)

    // If removing active tab, activate another one
    if (isActive && newTabs.length > 0) {
      newTabs[0].active = true
      setActiveTabId(newTabs[0].id)
      dispatch(setActiveConversation(newTabs[0].id))
    }

    setTabs(newTabs)
  }

  const setActiveTab = (id: string) => {
    setTabs((prev) =>
      prev.map((tab) => ({
        ...tab,
        active: tab.id === id,
        updatedAt: tab.id === id ? new Date().toISOString() : tab.updatedAt,
      })),
    )
    setActiveTabId(id)
    dispatch(setActiveConversation(id))
  }

  const toggleSplitView = () => {
    // Only allow split view if there are multiple tabs and not on mobile
    if (tabs.length > 1 && !isMobile) {
      setSplitView(!splitView)
    } else if (isMobile) {
      setSplitView(false)
    }
  }

  const reorderTabs = (activeId: string, overId: string) => {
    setTabs((prev) => {
      const oldIndex = prev.findIndex((tab) => tab.id === activeId)
      const newIndex = prev.findIndex((tab) => tab.id === overId)

      if (oldIndex === -1 || newIndex === -1) return prev

      const newTabs = [...prev]
      const [movedTab] = newTabs.splice(oldIndex, 1)
      newTabs.splice(newIndex, 0, movedTab)

      return newTabs
    })
  }

  const renameTab = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return

    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, title: newTitle, updatedAt: new Date().toISOString() } : tab)),
    )
  }

  const searchTabs = (query: string) => {
    if (!query.trim()) return tabs

    const lowerQuery = query.toLowerCase()
    return tabs.filter((tab) => tab.title.toLowerCase().includes(lowerQuery))
  }

  const saveTabsToLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("my0-tabs", JSON.stringify(tabs))
      localStorage.setItem("my0-active-tab", activeTabId)
      localStorage.setItem("my0-split-view", String(splitView))
      localStorage.setItem("my0-tags", JSON.stringify(tags))
      localStorage.setItem("my0-templates", JSON.stringify(templates))
      localStorage.setItem("my0-conversation-history", JSON.stringify(conversationHistory))
    }
  }

  const loadTabsFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      try {
        const savedTabs = localStorage.getItem("my0-tabs")
        const savedActiveTab = localStorage.getItem("my0-active-tab")
        const savedSplitView = localStorage.getItem("my0-split-view")
        const savedTags = localStorage.getItem("my0-tags")
        const savedTemplates = localStorage.getItem("my0-templates")
        const savedHistory = localStorage.getItem("my0-conversation-history")

        if (savedTabs) {
          const parsedTabs = JSON.parse(savedTabs) as ConversationTab[]
          setTabs(parsedTabs)
        }

        if (savedActiveTab) {
          setActiveTabId(savedActiveTab)
          dispatch(setActiveConversation(savedActiveTab))
        }

        if (savedSplitView && !isMobile) {
          setSplitView(savedSplitView === "true")
        }

        if (savedTags) {
          const parsedTags = JSON.parse(savedTags) as ConversationTag[]
          setTags(parsedTags)
        }

        if (savedTemplates) {
          const parsedTemplates = JSON.parse(savedTemplates) as ConversationTemplate[]
          setTemplates(parsedTemplates)
        }

        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory) as ConversationTab[]
          setConversationHistory(parsedHistory)
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }
  }

  const getShareLink = (tabId: string) => {
    // In a real implementation, this would generate a shareable link
    // For now, we'll just create a mock URL with the tab ID
    const tabMessages = messages.filter((msg) => msg.conversationId === tabId)
    const encodedData = encodeURIComponent(JSON.stringify(tabMessages))
    return `${window.location.origin}/share?data=${encodedData}`
  }

  const exportConversation = (tabId: string, format: "pdf" | "markdown" | "json") => {
    const tabMessages = messages.filter((msg) => msg.conversationId === tabId)
    const tab = tabs.find((t) => t.id === tabId)

    if (!tab) return

    let content = ""
    let filename = `${tab.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`
    let mimeType = ""

    if (format === "markdown") {
      content = `# ${tab.title}\n\n`
      content += `Exportado em: ${new Date().toLocaleString()}\n\n`

      tabMessages.forEach((msg) => {
        content += `## ${msg.role === "user" ? "Você" : "my.0"}\n\n`
        content += `${msg.content}\n\n`
      })

      filename += ".md"
      mimeType = "text/markdown"
    } else if (format === "json") {
      const exportData = {
        title: tab.title,
        createdAt: tab.createdAt,
        updatedAt: tab.updatedAt,
        messages: tabMessages,
      }

      content = JSON.stringify(exportData, null, 2)
      filename += ".json"
      mimeType = "application/json"
    } else if (format === "pdf") {
      // In a real implementation, this would generate a PDF
      // For now, we'll just alert that PDF export is not implemented
      alert("PDF export would be implemented here in a real application")
      return
    }

    // Create and download the file
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const mergeConversations = (tabIds: string[]) => {
    if (tabIds.length < 2) return ""

    const now = new Date().toISOString()
    const newId = uuidv4()
    const tabsToMerge = tabs.filter((tab) => tabIds.includes(tab.id))

    // Create a new tab with merged content
    const newTab: ConversationTab = {
      id: newId,
      title: `Merged: ${tabsToMerge.map((t) => t.title).join(" + ")}`,
      active: true,
      createdAt: now,
      updatedAt: now,
      tags: [...new Set(tabsToMerge.flatMap((tab) => tab.tags))], // Combine all tags without duplicates
    }

    // Get all messages from the tabs to merge, sorted by timestamp
    const allMessages = messages
      .filter((msg) => tabIds.includes(msg.conversationId || ""))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // Add the new tab
    setTabs((prev) => prev.map((tab) => ({ ...tab, active: false })).concat(newTab))
    setActiveTabId(newId)
    dispatch(setActiveConversation(newId))

    // Add all messages to the new conversation
    allMessages.forEach((msg, index) => {
      dispatch(
        addMessage({
          ...msg,
          id: `${newId}-merged-${index}`,
          conversationId: newId,
          timestamp: new Date(new Date(msg.timestamp).getTime() + index).toISOString(), // Ensure unique timestamps
        }),
      )
    })

    return newId
  }

  const addTag = (name: string, color: string) => {
    const newId = uuidv4()
    const newTag: ConversationTag = { id: newId, name, color }
    setTags((prev) => [...prev, newTag])
    return newId
  }

  const removeTag = (tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId))

    // Also remove this tag from all conversations
    setTabs((prev) =>
      prev.map((tab) => ({
        ...tab,
        tags: tab.tags.filter((id) => id !== tagId),
      })),
    )
  }

  const addTagToConversation = (conversationId: string, tagId: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === conversationId && !tab.tags.includes(tagId)
          ? { ...tab, tags: [...tab.tags, tagId], updatedAt: new Date().toISOString() }
          : tab,
      ),
    )
  }

  const removeTagFromConversation = (conversationId: string, tagId: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === conversationId
          ? { ...tab, tags: tab.tags.filter((id) => id !== tagId), updatedAt: new Date().toISOString() }
          : tab,
      ),
    )
  }

  const addTemplate = (
    title: string,
    description: string,
    initialMessages: Array<{ role: "user" | "assistant"; content: string }>,
  ) => {
    const newId = uuidv4()
    const newTemplate: ConversationTemplate = { id: newId, title, description, initialMessages }
    setTemplates((prev) => [...prev, newTemplate])
    return newId
  }

  const removeTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId))
  }

  const getConversationHistory = () => {
    return [...conversationHistory].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  const archiveConversation = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId)
    if (!tab) return

    // Add to history
    setConversationHistory((prev) => [...prev, { ...tab, active: false }])

    // Remove from active tabs
    removeTab(tabId)
  }

  const restoreConversation = (tabId: string) => {
    const historyTab = conversationHistory.find((t) => t.id === tabId)
    if (!historyTab || tabs.length >= 3) return

    // Add back to active tabs
    setTabs((prev) => [...prev.map((t) => ({ ...t, active: false })), { ...historyTab, active: true }])
    setActiveTabId(historyTab.id)
    dispatch(setActiveConversation(historyTab.id))

    // Remove from history
    setConversationHistory((prev) => prev.filter((t) => t.id !== tabId))
  }

  return (
    <ConversationContext.Provider
      value={{
        tabs,
        activeTabId,
        splitView,
        tags,
        templates,
        conversationHistory,
        addTab,
        removeTab,
        setActiveTab,
        toggleSplitView,
        isMobile,
        reorderTabs,
        renameTab,
        searchTabs,
        saveTabsToLocalStorage,
        loadTabsFromLocalStorage,
        getShareLink,
        exportConversation,
        mergeConversations,
        addTag,
        removeTag,
        addTagToConversation,
        removeTagFromConversation,
        addTemplate,
        removeTemplate,
        getConversationHistory,
        archiveConversation,
        restoreConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}
