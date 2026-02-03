"use server"

import Groq from "groq-sdk"
import { StreamChat } from "stream-chat"

const BOT_TELEGRAM_ID = "user_398rB8F6I92w57TYqAN5oRGmJR4"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY!,
)

export async function handleBotTelegramAI(
  channelId: string,
  userMessage: string,
  channelType: string = "messaging",
) {
  console.log(
    `Server Action: Received message for channel ${channelId} (${channelType}): "${userMessage}"`,
  )

  if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY")
    return { success: false, error: "Missing GROQ_API_KEY" }
  }
  if (!process.env.STREAM_SECRET_KEY) {
    console.error("Missing STREAM_SECRET_KEY")
    return { success: false, error: "Missing STREAM_SECRET_KEY" }
  }

  try {
    console.log("Fetching completion from Groq...")
    // 1. Get response from Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres Bot Telegram, un usuario normal de Telegram. Eres amigable, informal y hablas como una persona real. Evitas parecer un robot o un asistente. Respondes de forma concisa y natural.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "llama-3.3-70b-versatile",
    })

    const aiResponse =
      completion.choices[0]?.message?.content || "No sé qué decir a eso..."

    // 2. Post response to Stream Chat as Bot Telegram
    const channel = serverClient.channel(channelType, channelId)

    await channel.sendMessage({
      text: aiResponse,
      user_id: BOT_TELEGRAM_ID,
    })

    return { success: true }
  } catch (error) {
    console.error("Error in Bot Telegram:", error)
    return { success: false, error: "Failed to generate AI response" }
  }
}
