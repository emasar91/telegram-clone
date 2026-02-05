"use client"

import { useUser } from "@clerk/nextjs"
import {
  Call,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createToken } from "@/actions/createToken"
import StatusCard from "@/components/StatusCard"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Video } from "lucide-react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import { useTranslations } from "next-intl"
import { useSidebar } from "@/providers/SidebarProvider"

type Props = {
  children: React.ReactNode
}

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("Missing Stream API key")
}

function Layout({ children }: Props) {
  const { user } = useUser()
  const { id } = useParams()
  const [call, setCall] = useState<Call | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const { setOpenSidebar } = useSidebar()

  const t = useTranslations("call")

  const streamUser = useMemo(() => {
    if (!user?.id) return null
    return {
      id: user.id,
      name:
        user.fullName ||
        user.firstName ||
        user.emailAddresses[0].emailAddress ||
        "Unknown User",
      image: user.imageUrl || "",
      type: "authenticated" as const,
    }
  }, [user])

  const tokenProvider = useCallback(async () => {
    if (!user?.id) {
      throw new Error("User not found")
    }
    return await createToken(user.id)
  }, [user])

  useEffect(() => {
    if (!streamUser) {
      return
    }

    const newClient = StreamVideoClient.getOrCreateInstance({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
      user: streamUser,
      tokenProvider,
    })
    //eslint-disable-next-line
    setClient(newClient)

    return () => {
      setClient(null)
      newClient.disconnectUser().catch(console.error)
    }
  }, [streamUser, tokenProvider])

  useEffect(() => {
    if (!client || !id) return
    //eslint-disable-next-line
    setError(null)

    const streamCall = client.call("default", id as string)
    const joinCall = async () => {
      try {
        await streamCall.camera.disable()
        await streamCall.microphone.disable()
        await streamCall.join({
          create: true,
        })
        setCall(streamCall)
      } catch (error) {
        console.error("Error joining call:", error)
        setError(
          error instanceof Error ? error.message : "Failed to connect to call",
        )
      }
    }

    joinCall()

    return () => {
      if (streamCall && streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(console.error)
      }
    }
  }, [id, client])

  if (error) {
    setOpenSidebar(false)
    return (
      <StatusCard
        title={t("callError")}
        description={error}
        className="bg-red-500"
        action={
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t("retry")}
          </Button>
        }
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </StatusCard>
    )
  }

  if (!client) {
    setOpenSidebar(false)
    return (
      <StatusCard
        title={t("initializingClient")}
        description={t("settingUpCallEnvironment")}
        className=" bg-blue-50"
      >
        <LoadingSpinner size="lg" />
      </StatusCard>
    )
  }
  if (!call) {
    setOpenSidebar(false)
    return (
      <StatusCard title={t("joiningCall")} className=" bg-green-50">
        <div className="animate-bounce h16 w-16 mx-auto">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
            <Video className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="text-green-600 font-mono text-sm bg-green-100 px-3 py-1 rounded-full inline-block">
          {t("callId")} :{id}
        </div>
      </StatusCard>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme className="text-white">
        <StreamCall call={call}>{children}</StreamCall>
      </StreamTheme>
    </StreamVideo>
  )
}

export default Layout
