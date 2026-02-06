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

// --- NUEVOS IMPORTS PARA CONVEX ---
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const CustomModal = dynamic(() => import("@/components/CustomModal"), {
  loading: () => <div className="w-full h-full bg-white" />,
})

function DashboardPage() {
  const t = useTranslations("dashboard")
  const { user } = useUser()
  const router = useRouter()
  const { channel, setActiveChannel } = useChatContext()
  console.log("🚀 ~ channel:", channel)
  const { members } = channel?.state || {}
  const isBotTelegramMember = members?.[BOT_TELEGRAM_ID] || false
  const { setOpenSidebar } = useSidebar()

  const receptorCallName = Object.values(members || {}).filter(
    (member) => member.user?.id !== user?.id,
  )[0]?.user?.name

  // --- MUTATION DE CONVEX ---
  const createCall = useMutation(api.calls.createCall)

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

  // --- FUNCIÓN DE LLAMADA ACTUALIZADA ---
  const handleCall = async () => {
    if (!channel || !user) return

    // 1. Identificar al receptor (el miembro del canal que no soy yo)
    const calleeId = Object.keys(channel.state.members).find(
      (id) => id !== user.id,
    )

    if (!calleeId) {
      console.error("No se encontró a quién llamar")
      return
    }

    try {
      // 2. Crear el ID de la llamada (usamos el ID del canal o un UUID)
      const streamCallId = `call_${channel.id}_${Date.now()}`

      // 3. Registrar en Convex para que el receptor vea el Modal
      await createCall({
        callerId: user.id,
        calleeId: calleeId,
        callerName: user.fullName || user.firstName || "Usuario",
        receptorCallName: receptorCallName!,
        streamCallId: streamCallId,
        type: "video", // Puedes parametrizar esto si quieres audio/video
      })

      // 4. Ocultar sidebar y navegar a la página de la llamada
      setOpenSidebar(false)
      router.push(`/dashboard/call/${streamCallId}`)
    } catch (error) {
      console.error("Error al iniciar la llamada en Convex:", error)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const isMobile = useIsMobile(900)
  const channelMemberCount = channel?.data?.member_count

  // (El resto de tus componentes CustomThread y Return se mantienen igual...)
  const CustomThread = () => {
    const { closeThread } = useChannelActionContext()
    const { thread } = useChannelStateContext()

    if (!thread) return null
    return isMobile ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeThread}
      >
        <div
          className="py-2 relative w-[95%] h-[80%] max-w-[400px] max-h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
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
