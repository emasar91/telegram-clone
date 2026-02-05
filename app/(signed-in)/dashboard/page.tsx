"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChannelActionContext,
  useChannelStateContext,
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
import { BOT_TELEGRAM_ID, useBotTelegramAi } from "@/hooks/useBotTelegramAi"

const CustomModal = dynamic(() => import("@/components/CustomModal"), {
  loading: () => <div className="w-full h-full bg-white" />,
})

function DashboardPage() {
  const t = useTranslations("dashboard")
  const { user } = useUser()
  const router = useRouter()
  const { channel, setActiveChannel } = useChatContext()
  const { members } = channel?.state || {}
  const isBotTelegramMember = members?.[BOT_TELEGRAM_ID] || false

  const { setOpenSidebar } = useSidebar()

  // Enable Bot Telegram responses
  useBotTelegramAi()

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

  const channelMemberCount = channel?.data?.member_count
  console.log("🚀 ~ channelMemberCount:", channelMemberCount)

  const CustomThread = () => {
    const { closeThread } = useChannelActionContext()
    const { thread } = useChannelStateContext()

    if (!thread) return null
    return isMobile ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeThread} // Cerrar si hacen clic fuera del div
      >
        {/* Tu div centrado con límites de tamaño */}
        <div
          className="py-2 relative w-[95%] h-[80%] max-w-[400px] max-h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Evita que el clic interno cierre el modal
        >
          <Thread additionalMessageInputProps={{ maxRows: 5 }} />
        </div>
      </div>
    ) : (
      <Thread additionalMessageInputProps={{ maxRows: 5 }} />
    )
  }

  return (
    <div className="flex flex-col w-full flex-1 ">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex items-center justify-between p-2 bg-white">
              {channelMemberCount === 1 ? (
                <ChannelHeader title="Everyone else has left this chat" />
              ) : (
                <ChannelHeader />
              )}
              {channelMemberCount === 1 ? null : isMobile ? (
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="p-0">
                      <EllipsisVertical />
                    </MenubarTrigger>
                    <MenubarContent className="min-w-4 mr-2">
                      {!isBotTelegramMember && (
                        <MenubarItem
                          onClick={handleCall}
                          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                        >
                          <VideoIcon className="w-4 h-4" />
                          {t("chatButtons.videoCall")}
                        </MenubarItem>
                      )}

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
                  {!isBotTelegramMember && (
                    <Button
                      variant="outline"
                      onClick={handleCall}
                      className="cursor-pointer"
                    >
                      <VideoIcon className="w-4 h-4" />
                      {t("chatButtons.videoCall")}
                    </Button>
                  )}

                  <Button
                    className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50  dark:hover:bg-red-950"
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
            {channelMemberCount === 1 ? (
              <Button
                className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 bg-red-50 dark:hover:bg-red-950"
                variant="outline"
                onClick={() => setOpen(true)}
              >
                <LogOutIcon className="w-4 h-4" />
                {t("chatButtons.leave")}
              </Button>
            ) : (
              <div className="sticky bottom-0 w-full max-w-4xl mx-auto p-4">
                <MessageInput maxRows={5} />
              </div>
            )}
          </Window>
          <CustomThread />
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
