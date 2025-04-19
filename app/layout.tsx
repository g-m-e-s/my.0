import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/lib/redux/provider"
import { InterfaceProvider } from "@/lib/context/interface-context"
import { ConversationProvider } from "@/lib/context/conversation-context"
import { MCPProvider } from "@/lib/context/mcp-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "my.0",
  description: "Advanced AI interface with vector storage and RAG capabilities",
  generator: 'v0.dev',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            <MCPProvider>
              <InterfaceProvider>
                <ConversationProvider>{children}</ConversationProvider>
              </InterfaceProvider>
            </MCPProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
