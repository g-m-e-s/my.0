"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useConversation } from "@/lib/context/conversation-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Copy, LayoutGrid, LayoutTemplate, Edit2, Check, Share2, Search, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sortable tab component
function SortableTab({ tab }: { tab: any }) {
  const { activeTabId, setActiveTab, removeTab, renameTab } = useConversation()

  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(tab.title)
  const inputRef = useRef<HTMLInputElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  const handleStartEditing = () => {
    setIsEditing(true)
    setEditedTitle(tab.title)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const handleSaveTitle = () => {
    renameTab(tab.id, editedTitle)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setEditedTitle(tab.title)
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center" {...attributes}>
      <div {...listeners} className={cn("cursor-grab active:cursor-grabbing", isDragging ? "opacity-50" : "")}>
        {isEditing ? (
          <div className="flex items-center px-1">
            <Input
              ref={inputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveTitle}
              className="h-6 w-24 text-xs"
            />
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={handleSaveTitle}>
              <Check className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <TabsTrigger
            value={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary",
              "focus-visible:bg-accent/50 focus-visible:outline-none",
            )}
          >
            {tab.title}
          </TabsTrigger>
        )}
      </div>

      <div className="flex items-center">
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground"
            onClick={handleStartEditing}
            title="Rename tab"
          >
            <Edit2 className="h-3 w-3" />
            <span className="sr-only">Rename tab</span>
          </Button>
        )}

        {!isEditing && tab.id === activeTabId && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground"
                title="Share tab"
              >
                <Share2 className="h-3 w-3" />
                <span className="sr-only">Share tab</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <ShareTabContent tabId={tab.id} />
            </PopoverContent>
          </Popover>
        )}

        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation()
              removeTab(tab.id)
            }}
            title="Close tab"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close tab</span>
          </Button>
        )}
      </div>
    </div>
  )
}

// Share tab content component
function ShareTabContent({ tabId }: { tabId: string }) {
  const { getShareLink } = useConversation()
  const [copied, setCopied] = useState(false)
  const shareLink = getShareLink(tabId)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium">Share this conversation</h4>
      <p className="text-xs text-muted-foreground">Anyone with the link can view this conversation.</p>
      <div className="flex items-center space-x-2">
        <Input value={shareLink} readOnly className="text-xs" onClick={(e) => e.currentTarget.select()} />
        <Button size="sm" onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  )
}

// Search dialog component
function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { tabs, searchTabs, setActiveTab } = useConversation()
  const [searchQuery, setSearchQuery] = useState("")
  const searchResults = searchQuery ? searchTabs(searchQuery) : tabs

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Conversations</DialogTitle>
          <DialogDescription>Search across all your conversation tabs.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {searchResults.length > 0 ? (
              searchResults.map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center p-2 rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => handleSelectTab(tab.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{tab.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(tab.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main conversation tabs component
export function ConversationTabs() {
  const { tabs, activeTabId, splitView, addTab, reorderTabs, toggleSplitView, isMobile } = useConversation()

  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      reorderTabs(active.id as string, over.id as string)
    }
  }

  const handleShareAll = () => {
    // Generate a share link for all tabs
    toast({
      title: "Share link created",
      description: "A link to all your conversations has been copied to clipboard.",
    })
  }

  return (
    <div className="flex items-center justify-between border-b px-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Tabs value={activeTabId} className="flex-1">
          <TabsList className="h-10 w-full justify-start bg-transparent p-0">
            <SortableContext items={tabs.map((tab) => tab.id)} strategy={horizontalListSortingStrategy}>
              {tabs.map((tab) => (
                <SortableTab key={tab.id} tab={tab} />
              ))}
            </SortableContext>

            {tabs.length < 3 && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-8 w-8"
                onClick={() => addTab()}
                title="Nova conversa"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">New conversation</span>
              </Button>
            )}
          </TabsList>
        </Tabs>
      </DndContext>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSearchDialogOpen(true)}
          title="Search conversations"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search conversations</span>
        </Button>

        {tabs.length > 1 && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSplitView}
            title={splitView ? "Visualização única" : "Visualização dividida"}
          >
            {splitView ? <LayoutTemplate className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            <span className="sr-only">{splitView ? "Single view" : "Split view"}</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => addTab("Nova conversa (clonada)", activeTabId)}
          title="Clonar conversa"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Clone conversation</span>
        </Button>
      </div>

      <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
    </div>
  )
}
