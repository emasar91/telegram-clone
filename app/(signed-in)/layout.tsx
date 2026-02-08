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
import { CallNotificationProvider } from "@/providers/CallNotificationProvider"

function Layout({ children }: { children: React.ReactNode }) {
  const { openSidebar, setOpenSidebar } = useSidebar()

  const locale = useLocale()

  const toggleSidebar = () => setOpenSidebar(!openSidebar)

  const i18nInstance = new Streami18n({
    language: locale,
  })

  return (
    <UserSyncWrapper>
      <CallNotificationProvider>
        <Chat client={streamClient} i18nInstance={i18nInstance}>
          <div className="flex h-dvh overflow-hidden bg-background">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
              <Header onToggleSidebar={toggleSidebar} />

              <main className="flex-1 flex overflow-y-auto justify-center h-dvh bg-[url('/assets/images/pattern.svg'),_linear-gradient(309deg,_rgba(209,214,141,1)_0%,_rgba(143,187,141,1)_45%,_rgba(143,187,141,1)_56%,_rgba(209,214,141,1)_100%)] bg-size-[450px,cover] bg-position-[repeat,no-repeat] bg-[local,fixed]">
                {children}
              </main>
            </div>
          </div>
        </Chat>
      </CallNotificationProvider>
    </UserSyncWrapper>
  )
}

export default Layout
