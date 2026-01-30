"use client"

import UserSyncWrapper from "@/components/UserSyncWrapper"
import { Chat } from "stream-chat-react"
import streamClient from "@/lib/stream"
import "stream-chat-react/dist/css/v2/index.css"
import Header from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Streami18n } from "stream-chat-react"
import { useLocale } from "next-intl"
import { useSidebar } from "@/providers/SidebarProvider"

function Layout({ children }: { children: React.ReactNode }) {
  const { openSidebar, setOpenSidebar } = useSidebar()

  const locale = useLocale()

  const toggleSidebar = () => setOpenSidebar(!openSidebar)

  const i18nInstance = new Streami18n({
    language: locale,
  })

  return (
    <UserSyncWrapper>
      <Chat client={streamClient} i18nInstance={i18nInstance}>
        <div className="flex h-dvh overflow-hidden bg-background">
          <Sidebar />

          {/* Contenido principal */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <Header onToggleSidebar={toggleSidebar} />

            {/* Contenido */}
            <main
              className="flex-1 flex overflow-y-auto justify-center h-dvh"
              style={{
                backgroundImage: `url('/assets/images/pattern.svg'), linear-gradient(309deg, rgba(209, 214, 141, 1) 0%, rgba(143, 187, 141, 1) 45%, rgba(143, 187, 141, 1) 56%, rgba(209, 214, 141, 1) 100%)`,
                backgroundRepeat: "repeat, no-repeat",
                backgroundSize: "450px, cover",
                backgroundAttachment: "local, fixed",
              }}
            >
              {children}
            </main>
          </div>
        </div>
      </Chat>
    </UserSyncWrapper>
  )
}

export default Layout
