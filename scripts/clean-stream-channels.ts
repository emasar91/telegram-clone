// scripts/clean-stream-channels.ts
import { config } from "dotenv"
import { StreamChat } from "stream-chat"

// Load environment variables from .env.local
config({ path: ".env.local" })

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not defined")
}

if (!process.env.STREAM_SECRET_KEY) {
  throw new Error("STREAM_SECRET_KEY is not defined")
}

const streamServerClient = new StreamChat(
  process.env.NEXT_PUBLIC_STREAM_API_KEY,
  process.env.STREAM_SECRET_KEY,
)

async function cleanChannels() {
  try {
    // Obtener todos los canales
    const channels = await streamServerClient.queryChannels({
      type: { $in: ["messaging", "team"] },
    })

    console.log(`Found ${channels.length} channels to delete`)

    // Eliminar cada canal
    for (const channel of channels) {
      await channel.delete()
      console.log(`Deleted channel: ${channel.id}`)
    }

    console.log("✅ All channels deleted successfully")
  } catch (error) {
    console.error("Error cleaning channels:", error)
  }
}

cleanChannels()
