"use client"

import { useState } from "react"
import { useConversation } from "@/lib/context/conversation-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tag, Plus, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"

export function ConversationTagging() {
  const { tags, activeTabId, tabs, addTag, removeTag, addTagToConversation, removeTagFromConversation } =
    useConversation()
  const [open, setOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6")
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  const activeTab = tabs.find((tab) => tab.id === activeTabId)
  const activeTags = activeTab
    ? activeTab.tags.map((tagId) => tags.find((tag) => tag.id === tagId)).filter(Boolean)
    : []

  const handleAddTag = () => {
    if (!newTagName.trim()) return
    const tagId = addTag(newTagName, newTagColor)
    addTagToConversation(activeTabId, tagId)
    setNewTagName("")
    setNewTagColor("#3b82f6")
  }

  const handleToggleTag = (tagId: string) => {
    if (activeTab?.tags.includes(tagId)) {
      removeTagFromConversation(activeTabId, tagId)
    } else {
      addTagToConversation(activeTabId, tagId)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Tag className="h-4 w-4" />
        Tags
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {activeTags.map((tag) => (
                <div
                  key={tag?.id}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-white"
                  style={{ backgroundColor: tag?.color }}
                >
                  {tag?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full p-0 text-white hover:bg-white/20"
                    onClick={() => removeTagFromConversation(activeTabId, tag?.id || "")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove tag</span>
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tags Disponíveis</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 rounded-full"
                    style={{
                      borderColor: tag.color,
                      backgroundColor: activeTab?.tags.includes(tag.id) ? tag.color : "transparent",
                      color: activeTab?.tags.includes(tag.id) ? "white" : tag.color,
                    }}
                    onClick={() => handleToggleTag(tag.id)}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Criar Nova Tag</h4>
              <div className="flex items-center gap-2">
                <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md p-0"
                      style={{ backgroundColor: newTagColor }}
                    >
                      <span className="sr-only">Pick color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <HexColorPicker color={newTagColor} onChange={setNewTagColor} />
                  </PopoverContent>
                </Popover>
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nome da tag"
                  className="h-8"
                />
                <Button size="sm" onClick={handleAddTag} disabled={!newTagName.trim()}>
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
