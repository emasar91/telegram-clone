"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useChatContext } from "stream-chat-react"
import { handleBotTelegramAI } from "@/actions/botTelegram"
import { Event } from "stream-chat"

const BOT_TELEGRAM_ID = "user_398rB8F6I92w57TYqAN5oRGmJR4"

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
      console.log("Bot Telegram Listener detected event:", event.type, event)

      // 1. Only respond to new messages
      if (
        event.type !== "message.new" &&
        event.type !== "notification.message_new"
      )
        return

      const { message, channel_id, channel_type } = event
      console.log(
        "New message details:",
        message?.text,
        "from",
        message?.user?.id,
      )

      // 2. Only respond if the message is from the CURRENT user
      // This prevents duplicate triggers from multiple users or tabs
      if (!message || !message.user || message.user.id !== user.id) {
        console.log(
          `Ignoring: message.user.id (${message?.user?.id}) !== user.id (${user.id})`,
        )
        return
      }
      if (!channel_id || !channel_type) return

      // 3. Get channel details to check membership
      const channel = client.channel(channel_type, channel_id)

      console.log(
        `Checking membership for Josef (${BOT_TELEGRAM_ID}) in ${channel_id}`,
      )

      // Ensure state is loaded
      if (
        !channel.state?.members ||
        Object.keys(channel.state.members).length === 0
      ) {
        console.log("Channel state not loaded, calling watch...")
        await channel.watch()
      }

      const members = Object.keys(channel.state.members)
      console.log("Current channel members:", members)

      // 4. Trigger AI if Josef is in the channel
      if (members.includes(BOT_TELEGRAM_ID)) {
        console.log("JOSEF IS HERE! Requesting AI response from server...")
        // We call the server action to handle Groq + Stream posting
        const result = await handleBotTelegramAI(
          channel_id,
          message.text || "",
          channel_type,
        )
        console.log("AI Server Result:", result)
      } else {
        console.log("Josef is not in this channel. Membership list:", members)
      }
    }

    console.log("Josef AI: Initializing listener...")
    client.on(handleEvent)

    return () => {
      client.off(handleEvent)
    }
  }, [client, user])
}
