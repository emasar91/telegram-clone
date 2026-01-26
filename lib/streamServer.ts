import { StreamChat } from "stream-chat"

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

export default streamServerClient
