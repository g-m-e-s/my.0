import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ChatContainer } from "@/components/chat-container"

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <ChatContainer />
      </div>
    </div>
  )
}
