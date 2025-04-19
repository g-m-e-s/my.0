"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useInterface } from "@/lib/context/interface-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Square, Circle, Pencil, Eraser, Undo, Redo, Download, Trash2, X } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Tool = "pencil" | "eraser" | "rectangle" | "circle"
type DrawingOperation = {
  tool: Tool
  points?: { x: number; y: number }[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  color: string
  width: number
}

export function WhiteboardInterface() {
  const { setMode, previousMode } = useInterface()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [drawing, setDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<Tool>("pencil")
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(2)
  const [operations, setOperations] = useState<DrawingOperation[]>([])
  const [redoStack, setRedoStack] = useState<DrawingOperation[]>([])
  const [currentOperation, setCurrentOperation] = useState<DrawingOperation | null>(null)

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        setContext(ctx)
      }
    }

    const handleResize = () => {
      if (canvasRef.current && context) {
        // Save current drawing
        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Resize canvas
        canvasRef.current.width = canvasRef.current.offsetWidth
        canvasRef.current.height = canvasRef.current.offsetHeight

        // Restore context properties
        context.lineCap = "round"
        context.lineJoin = "round"

        // Restore drawing
        context.putImageData(imageData, 0, 0)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [context])

  // Redraw canvas when operations change
  useEffect(() => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      operations.forEach((op) => {
        context.strokeStyle = op.color
        context.lineWidth = op.width

        if (op.tool === "pencil" && op.points) {
          context.beginPath()
          op.points.forEach((point, i) => {
            if (i === 0) {
              context.moveTo(point.x, point.y)
            } else {
              context.lineTo(point.x, point.y)
            }
          })
          context.stroke()
        } else if (op.tool === "eraser" && op.points) {
          context.strokeStyle = "#ffffff"
          context.beginPath()
          op.points.forEach((point, i) => {
            if (i === 0) {
              context.moveTo(point.x, point.y)
            } else {
              context.lineTo(point.x, point.y)
            }
          })
          context.stroke()
        } else if (op.tool === "rectangle" && op.start && op.end) {
          context.beginPath()
          context.rect(op.start.x, op.start.y, op.end.x - op.start.x, op.end.y - op.start.y)
          context.stroke()
        } else if (op.tool === "circle" && op.start && op.end) {
          const radius = Math.sqrt(Math.pow(op.end.x - op.start.x, 2) + Math.pow(op.end.y - op.start.y, 2))
          context.beginPath()
          context.arc(op.start.x, op.start.y, radius, 0, 2 * Math.PI)
          context.stroke()
        }
      })
    }
  }, [operations, context])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !context) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setDrawing(true)

    if (currentTool === "pencil" || currentTool === "eraser") {
      const newOperation: DrawingOperation = {
        tool: currentTool,
        points: [{ x, y }],
        color,
        width: currentTool === "eraser" ? 20 : lineWidth,
      }
      setCurrentOperation(newOperation)
    } else {
      const newOperation: DrawingOperation = {
        tool: currentTool,
        start: { x, y },
        end: { x, y },
        color,
        width: lineWidth,
      }
      setCurrentOperation(newOperation)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !context || !canvasRef.current || !currentOperation) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentTool === "pencil" || currentTool === "eraser") {
      setCurrentOperation((prev) => {
        if (!prev || !prev.points) return prev
        return {
          ...prev,
          points: [...prev.points, { x, y }],
        }
      })

      // Draw current stroke
      context.strokeStyle = currentTool === "eraser" ? "#ffffff" : color
      context.lineWidth = currentTool === "eraser" ? 20 : lineWidth
      context.beginPath()
      context.moveTo(
        currentOperation.points![currentOperation.points!.length - 1].x,
        currentOperation.points![currentOperation.points!.length - 1].y,
      )
      context.lineTo(x, y)
      context.stroke()
    } else {
      // For shapes, we'll redraw the entire canvas on each move
      setCurrentOperation((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          end: { x, y },
        }
      })
    }
  }

  const stopDrawing = () => {
    if (drawing && currentOperation) {
      setOperations([...operations, currentOperation])
      setRedoStack([])
      setCurrentOperation(null)
    }
    setDrawing(false)
  }

  const handleUndo = () => {
    if (operations.length === 0) return
    const lastOperation = operations[operations.length - 1]
    setRedoStack([...redoStack, lastOperation])
    setOperations(operations.slice(0, -1))
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const nextOperation = redoStack[redoStack.length - 1]
    setOperations([...operations, nextOperation])
    setRedoStack(redoStack.slice(0, -1))
  }

  const handleClear = () => {
    setOperations([])
    setRedoStack([])
  }

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "my0-whiteboard.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const handleClose = () => {
    setMode(previousMode || "chat")
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-card p-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to chat</span>
          </Button>
          <div className="ml-2 text-sm font-medium">Whiteboard</div>
        </div>

        <ToggleGroup type="single" value={currentTool} onValueChange={(value: Tool) => value && setCurrentTool(value)}>
          <ToggleGroupItem value="pencil" aria-label="Pencil tool">
            <Pencil className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="eraser" aria-label="Eraser tool">
            <Eraser className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="rectangle" aria-label="Rectangle tool">
            <Square className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="circle" aria-label="Circle tool">
            <Circle className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-input bg-transparent"
          />
          <select
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="h-8 rounded border border-input bg-transparent px-2 text-xs"
          >
            <option value="1">1px</option>
            <option value="2">2px</option>
            <option value="4">4px</option>
            <option value="6">6px</option>
            <option value="8">8px</option>
          </select>
          <Button variant="ghost" size="icon" onClick={handleUndo} disabled={operations.length === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRedo} disabled={redoStack.length === 0}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close whiteboard</span>
          </Button>
        </div>
      </div>

      <div className="relative flex-1 bg-white">
        <canvas
          ref={canvasRef}
          className="absolute h-full w-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  )
}
