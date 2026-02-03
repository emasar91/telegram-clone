"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useChatContext } from "stream-chat-react"
import { handleBotTelegramAI } from "@/actions/botTelegram"
import { Event } from "stream-chat"

export const BOT_TELEGRAM_ID = "user_398rB8F6I92w57TYqAN5oRGmJR4"

/**
 * Hook to handle Bot Telegram responses.
 * It listens for new messages in channels where Bot Telegram is a member
 * and triggers an AI response if the message is from the current user.
 */
export function useBotTelegramAi() {
  const { client } = useChatContext()
  const { user } = useUser()

  useEffect(() => {
    if (!client || !user) return

    const handleEvent = async (event: Event) => {
      const { message, channel_id, channel_type } = event

      // 1. Only respond if the message is from the CURRENT user
      // This prevents duplicate triggers from multiple users or tabs
      if (!message || !message.user || message.user.id !== user.id) {
        return
      }
      if (!channel_id || !channel_type) return

      // 2. Get channel details to check membership
      const channel = client.channel(channel_type, channel_id)

      // Ensure state is loaded
      if (
        !channel.state?.members ||
        Object.keys(channel.state.members).length === 0
      ) {
        await channel.watch()
      }

      const members = Object.keys(channel.state.members)

      // 3. Trigger AI if Josef is in the channel
      if (members.includes(BOT_TELEGRAM_ID)) {
        // We call the server action to handle Groq + Stream posting
        const result = await handleBotTelegramAI(
          channel_id,
          message.text || "",
          channel_type,
        )
        console.log("AI Server Result:", result)
      }
    }

    // Bind specifically to 'message.new' to avoid duplication with 'notification.message_new'
    client.on("message.new", handleEvent)

    return () => {
      client.off("message.new", handleEvent)
    }
  }, [client, user])
}
