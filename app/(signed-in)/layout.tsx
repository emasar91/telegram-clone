"use client"

import UserSyncWrapper from "@/components/UserSyncWrapper"
import { Chat } from "stream-chat-react"
import streamClient from "@/lib/stream"
import "stream-chat-react/dist/css/v2/index.css"
import Header from "@/components/Header"
import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)
  return (
    <UserSyncWrapper>
      <Chat client={streamClient}>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

          {/* Contenido principal */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <Header onToggleSidebar={toggleSidebar} />

            {/* Contenido */}
            <main className="flex-1 flex overflow-y-auto p-6 justify-center">
              {children}
            </main>
          </div>
        </div>
      </Chat>
    </UserSyncWrapper>
  )
}

export default Layout
