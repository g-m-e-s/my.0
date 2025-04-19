"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type InterfaceMode = "chat" | "terminal" | "whiteboard" | "investigate"

interface InterfaceContextType {
  mode: InterfaceMode
  setMode: (mode: InterfaceMode) => void
  previousMode: InterfaceMode | null
  setPreviousMode: (mode: InterfaceMode | null) => void
}

const InterfaceContext = createContext<InterfaceContextType | undefined>(undefined)

export function InterfaceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<InterfaceMode>("chat")
  const [previousMode, setPreviousMode] = useState<InterfaceMode | null>(null)

  const handleSetMode = (newMode: InterfaceMode) => {
    if (newMode !== mode) {
      setPreviousMode(mode)
      setMode(newMode)
    }
  }

  return (
    <InterfaceContext.Provider
      value={{
        mode,
        setMode: handleSetMode,
        previousMode,
        setPreviousMode,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  )
}

export function useInterface() {
  const context = useContext(InterfaceContext)
  if (context === undefined) {
    throw new Error("useInterface must be used within an InterfaceProvider")
  }
  return context
}
