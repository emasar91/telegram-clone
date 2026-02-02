"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, LogOutIcon, VideoIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useIsMobile } from "@/hooks/useIsMobile"
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { MenubarItem } from "@radix-ui/react-menubar"
import { useState } from "react"
import { useSidebar } from "@/providers/SidebarProvider"
import dynamic from "next/dynamic"

const CustomModal = dynamic(() => import("@/components/CustomModal"), {
  loading: () => <div className="w-full h-full bg-white" />,
})

function DashboardPage() {
  const t = useTranslations("dashboard")
  const { user } = useUser()
  const router = useRouter()
  const { channel, setActiveChannel } = useChatContext()
  const { setOpenSidebar } = useSidebar()

  const [open, setOpen] = useState(false)

  const handleConfirmLeave = async () => {
    if (!channel || !user) return

    try {
      await channel.removeMembers([user.id])
      setActiveChannel(undefined)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error leaving chat:", error)
    } finally {
      setOpen(false)
      setOpenSidebar(true)
    }
  }

  const handleCall = () => {
    if (!channel || !user) return
    setOpenSidebar(false)
    router.push(`/dashboard/call/${channel.id}`)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const isMobile = useIsMobile(900)

  return (
    <div className="flex flex-col w-full flex-1 ">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex items-center justify-between p-2 bg-white">
              {channel.data?.member_count === 1 ? (
                <ChannelHeader title="Everyone else has left this chat" />
              ) : (
                <ChannelHeader />
              )}
              {isMobile ? (
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="p-0">
                      <EllipsisVertical />
                    </MenubarTrigger>
                    <MenubarContent className="min-w-4 mr-2">
                      <MenubarItem
                        onClick={handleCall}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                      >
                        <VideoIcon className="w-4 h-4" />
                        {t("chatButtons.videoCall")}
                      </MenubarItem>

                      <MenubarItem
                        className="flex items-center gap-2 p-2 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => setOpen(true)}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        {t("chatButtons.leave")}
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCall}
                    className="cursor-pointer"
                  >
                    <VideoIcon className="w-4 h-4" />
                    {t("chatButtons.videoCall")}
                  </Button>

                  <Button
                    className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    variant="outline"
                    onClick={() => setOpen(true)}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    {t("chatButtons.leave")}
                  </Button>
                </div>
              )}
            </div>

            <MessageList />

            <div className="sticky bottom-0 w-full max-w-4xl mx-auto p-4">
              <MessageInput />
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full mx-4">
          <div className="flex flex-col items-center justify-center  bg-[#fafafa] p-4 border border-transparent rounded-lg">
            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
              {t("noChatSelected")}
            </h2>
            <p className="text-black text-sm text-center">{t("selectChat")}</p>
          </div>
        </div>
      )}

      <CustomModal
        open={open}
        handleClose={handleClose}
        onConfirm={handleConfirmLeave}
        onCancel={handleClose}
        title="chatButtons.leaveTitle"
        description="chatButtons.leaveDescription"
        translate="dashboard"
      />
    </div>
  )
}

export default DashboardPage
