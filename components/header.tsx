"use client"

import { useDispatch } from "react-redux"
import { toggleSidebar } from "@/lib/redux/features/uiSlice"
import { setActiveModel } from "@/lib/redux/features/modelSlice"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Menu } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { MCPServers } from "@/components/mcp-servers"
import Image from "next/image"

export function Header() {
  const dispatch = useDispatch()
  const { activeModel } = useSelector((state: RootState) => state.model)

  return (
    <div className="flex h-14 items-center border-b bg-card px-4 shadow-sm">
      <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="ml-4 flex items-center">
        <Image src="/logo.png" alt="my.0 Logo" width={24} height={24} className="mr-2" />
        <span className="font-medium">my.0</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <MCPServers />

        <div className="overflow-x-auto">
          <ToggleGroup
            type="single"
            value={activeModel}
            onValueChange={(value) => value && dispatch(setActiveModel(value))}
            className="flex-nowrap"
          >
            <ToggleGroupItem value="gpt-4o" aria-label="Toggle GPT-4o" className="text-xs whitespace-nowrap">
              GPT-4o
            </ToggleGroupItem>
            <ToggleGroupItem value="openai-o1" aria-label="Toggle OpenAI o1" className="text-xs whitespace-nowrap">
              OpenAI o1
            </ToggleGroupItem>
            <ToggleGroupItem value="claude-3.7" aria-label="Toggle Claude 3.7" className="text-xs whitespace-nowrap">
              Claude 3.7
            </ToggleGroupItem>
            <ToggleGroupItem value="grok-3" aria-label="Toggle Grok 3" className="text-xs whitespace-nowrap">
              Grok 3
            </ToggleGroupItem>
            <ToggleGroupItem value="phi-4" aria-label="Toggle Phi 4" className="text-xs whitespace-nowrap">
              Phi 4
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
