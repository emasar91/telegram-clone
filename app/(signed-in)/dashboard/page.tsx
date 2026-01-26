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
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOutIcon, VideoIcon } from "lucide-react"

function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const { channel, setActiveChannel } = useChatContext()
  const { setOpen } = useSidebar()

  const handleCall = () => {
    if (!channel || !user) return

    router.push(`/dashboard/call/${channel.id}`)
    setOpen(false)
  }

  const handleLeaveChat = async () => {
    if (!channel || !user) return

    const confirm = window.confirm("Are you sure you want to leave this chat?")
    if (!confirm) return

    try {
      await channel.removeMembers([user.id])
      setActiveChannel(undefined)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error leaving chat:", error)
    }
  }

  return (
    <div className="flex flex-col w-full flex-1">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex items-center justify-between">
              {channel.data?.member_count === 1 ? (
                <ChannelHeader title="Everyone else has left this chat" />
              ) : (
                <ChannelHeader />
              )}
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCall}>
                  <VideoIcon className="w-4 h-4" />
                  Video Call
                </Button>

                <Button
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  variant="outline"
                  onClick={handleLeaveChat}
                >
                  <LogOutIcon className="w-4 h-4" />
                  Leave Chat
                </Button>
              </div>
            </div>

            <MessageList />

            <div className="sticky bottom-0 w-full">
              <MessageInput />
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            No chat selected
          </h2>
          <p className="text-muted-foreground text-sm">
            Select a chat from the sidebar to start messaging
          </p>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
