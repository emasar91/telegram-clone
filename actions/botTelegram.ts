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
  if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY")
    return { success: false, error: "Missing GROQ_API_KEY" }
  }
  if (!process.env.STREAM_SECRET_KEY) {
    console.error("Missing STREAM_SECRET_KEY")
    return { success: false, error: "Missing STREAM_SECRET_KEY" }
  }

  try {
    // 1. Fetch recent message history for context
    const channel = serverClient.channel(channelType, channelId)
    const queryResponse = await channel.query({
      messages: { limit: 15 },
    })

    const history = queryResponse.messages
      .filter((m) => m.text) // Ensure there's text
      .map((m) => ({
        role:
          m.user?.id === BOT_TELEGRAM_ID
            ? ("assistant" as const)
            : ("user" as const),
        content: m.text || "",
      }))

    // 2. Get response from Groq with history
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres Bot Telegram, llamado Boti, un usuario normal de Telegram. Eres amigable, informal y hablas como una persona real. Evitas parecer un robot o un asistente. Respondes de forma concisa y natural.Estas en un proyecto de Telegram Clone, desarrollado por Emanuel Sarco, Desarrollador FrontEnd con React y Next, con 5 anios de experiencia. El estack es Next.js, TypeScript, Clerk, Stream Chat y Groq. En el proyecto se esta usando el framework Convex para la base de datos y el backend. En el proyecto se puede crear chats con usuarios y grupos, enviar mensajes, archivos y stickers. Tambien puedes buscar usuarios por nombre o correo electronico. Tambien puedes buscar grupos por nombre. Tambien se puede hacer videollamadas. En el caso que oregunten algo del proyecto recomenda entrar al portfolio, que es https://emasar-portfolio.vercel.app para tener mas informacion, y ver mas proyectos desarrollados por Emanuel Sarco.",
        },
        ...history,
      ],
      model: "llama-3.3-70b-versatile",
    })

    const aiResponse =
      completion.choices[0]?.message?.content || "No sé qué decir a eso..."

    // 2. Post response to Stream Chat as Bot Telegram
    await channel.sendMessage({
      text: aiResponse,
      user_id: BOT_TELEGRAM_ID,
    })

    return { success: true }
  } catch {
    return { success: false, error: "Failed to generate AI response" }
  }
}
