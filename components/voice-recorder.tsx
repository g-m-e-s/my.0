"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, Square, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function VoiceRecorder({ onTranscription }: { onTranscription: (text: string) => void }) {
  const [open, setOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        chunksRef.current = []

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      chunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)

      // Start timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const handleProcessAudio = () => {
    if (!audioBlob) return

    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      // Simulate transcription
      const mockTranscriptions = [
        "Explique como funciona o armazenamento vetorial no my.0",
        "Quais são as vantagens de usar grafos de conhecimento para memória persistente?",
        "Como implementar um sistema de RAG eficiente com embeddings e grafos?",
        "Explique o conceito de Sono da Penseira no contexto de processamento de memória",
      ]

      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]

      onTranscription(randomTranscription)
      setIsProcessing(false)
      setAudioBlob(null)
      setOpen(false)
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Mic className="h-4 w-4" />
        Whisper
      </Button>

      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen && isRecording) {
            stopRecording()
          }
          setOpen(newOpen)
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Gravação de Voz</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6">
            {isRecording ? (
              <>
                <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                  <div className="absolute h-20 w-20 animate-ping rounded-full bg-red-400 opacity-75"></div>
                  <Mic className="h-10 w-10 text-red-500" />
                </div>
                <p className="mb-2 text-lg font-semibold">{formatTime(recordingTime)}</p>
                <p className="mb-4 text-sm text-muted-foreground">Gravando...</p>
                <Button variant="destructive" size="sm" className="gap-2" onClick={stopRecording}>
                  <Square className="h-4 w-4" />
                  Parar Gravação
                </Button>
              </>
            ) : audioBlob ? (
              <>
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                  <Mic className="h-10 w-10 text-green-500" />
                </div>
                <p className="mb-2 text-lg font-semibold">Gravação Concluída</p>
                <p className="mb-4 text-sm text-muted-foreground">Duração: {formatTime(recordingTime)}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAudioBlob(null)}>
                    Descartar
                  </Button>
                  <Button size="sm" className="gap-2" onClick={handleProcessAudio} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Processar Áudio"
                    )}
                  </Button>
                </div>
                {isProcessing && (
                  <div className="mt-4 w-full space-y-2">
                    <p className="text-xs text-center text-muted-foreground">Transcrevendo com Whisper...</p>
                    <Progress value={Math.random() * 100} className="h-1.5" />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                  <Mic className="h-10 w-10 text-blue-500" />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">Clique no botão abaixo para iniciar a gravação</p>
                <Button size="sm" className="gap-2" onClick={startRecording}>
                  <Mic className="h-4 w-4" />
                  Iniciar Gravação
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
