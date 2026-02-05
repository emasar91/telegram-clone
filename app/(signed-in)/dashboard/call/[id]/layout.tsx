"use client"

import { useUser } from "@clerk/nextjs"
import {
  Call,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
} from "@stream-io/video-react-sdk"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createToken } from "@/actions/createToken"
import StatusCard from "@/components/StatusCard"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Video, PhoneOff } from "lucide-react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useTranslations } from "next-intl"
import { useSidebar } from "@/providers/SidebarProvider"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

import "@stream-io/video-react-sdk/dist/css/styles.css"

type Props = {
  children: React.ReactNode
}

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("Missing Stream API key")
}

export default function CallLayout({ children }: Props) {
  const { user } = useUser()
  const { id } = useParams()
  const router = useRouter()
  const { setOpenSidebar } = useSidebar()
  const t = useTranslations("call")

  const [call, setCall] = useState<Call | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [client, setClient] = useState<StreamVideoClient | null>(null)

  // --- CONVEX DATA ---
  const convexCall = useQuery(
    api.calls.getCallByStreamId,
    typeof id === "string" ? { streamCallId: id } : "skip",
  )
  const updateStatus = useMutation(api.calls.updateCallStatus)

  // --- 1. LÓGICA DE TIMEOUT (Para el emisor) ---
  // const CALL_TIMEOUT_MS = 10000 // 10 segundos para pruebas

  // useEffect(() => {
  //   if (
  //     !convexCall ||
  //     convexCall.status !== "calling" ||
  //     user?.id !== convexCall.callerId
  //   )
  //     return

  //   const timeoutId = setTimeout(async () => {
  //     console.log("La llamada expiró por falta de respuesta")
  //     await updateStatus({
  //       callId: convexCall._id,
  //       status: "missed",
  //     })
  //   }, CALL_TIMEOUT_MS)

  //   return () => clearTimeout(timeoutId)
  // }, [convexCall?.status, convexCall?._id, user?.id, updateStatus])

  // --- 2. CONFIGURACIÓN STREAM USER & CLIENT ---
  const streamUser = useMemo(() => {
    if (!user?.id) return null
    return {
      id: user.id,
      name:
        user.fullName ||
        user.firstName ||
        user.emailAddresses[0].emailAddress ||
        "Unknown",
      image: user.imageUrl || "",
      type: "authenticated" as const,
    }
  }, [user])

  const tokenProvider = useCallback(async () => {
    if (!user?.id) throw new Error("User not found")
    return await createToken(user.id)
  }, [user])

  useEffect(() => {
    if (!streamUser) return
    const newClient = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
      user: streamUser,
      tokenProvider,
    })
    setClient(newClient)
    return () => {
      newClient.disconnectUser().catch(console.error)
      setClient(null)
    }
  }, [streamUser, tokenProvider])

  // --- 3. UNIÓN A LA LLAMADA & LIMPIEZA ---
  useEffect(() => {
    if (!client || !id || !convexCall) return
    if (convexCall.status !== "accepted") return

    const streamCall = client.call("default", id as string)

    const joinCall = async () => {
      try {
        streamCall.camera.disable()
        streamCall.microphone.disable()
        await streamCall.join({ create: true })
        setCall(streamCall)
      } catch (err) {
        console.error("Error joining call:", err)
        setError(err instanceof Error ? err.message : "Failed to connect")
      }
    }

    joinCall()

    return () => {
      // 1. Disparamos la actualización a Convex INMEDIATAMENTE
      // No esperamos al .then() de stream porque el componente ya se está muriendo
      updateStatus({ callId: convexCall._id, status: "ended" }).catch(() => {})

      // 2. Salimos de la llamada de Stream
      if (streamCall?.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(console.error)
      }
    }
    //eslint-disable-next-line
  }, [id, client, convexCall?.status, convexCall?._id, updateStatus])

  // --- 4. ESCUCHAR EVENTOS DE STREAM (Colgar nativo) ---
  useEffect(() => {
    if (!call || !convexCall) return

    const handleCallEnded = async () => {
      if (convexCall.status === "accepted" || convexCall.status === "calling") {
        await updateStatus({ callId: convexCall._id, status: "ended" })
      }
    }

    // Si alguien presiona el botón rojo nativo de Stream
    const unsubscribeEnded = call.on("call.ended", handleCallEnded)

    // Si la sesión se queda vacía
    const unsubscribeLeft = call.on("call.session_participant_left", () => {
      if (call.state.participantCount <= 1) {
        handleCallEnded()
      }
    })

    return () => {
      unsubscribeEnded()
      unsubscribeLeft()
    }
  }, [call, convexCall, updateStatus])

  // --- 5. REDIRECCIÓN POR ESTADO DE CONVEX ---
  useEffect(() => {
    if (!convexCall) return
    const exitStatuses = ["rejected", "ended", "missed"]
    if (exitStatuses.includes(convexCall.status)) {
      router.push("/dashboard")
    }
  }, [convexCall?.status, router])

  useEffect(() => {
    if (!convexCall) return

    const handleEndCallOnExit = async () => {
      // Solo actuamos si la llamada está activa o sonando
      if (convexCall.status === "accepted" || convexCall.status === "calling") {
        // Intentamos actualizar Convex antes de que la página desaparezca
        await updateStatus({
          callId: convexCall._id,
          status: "ended",
        })
      }
    }

    // CASO A: Volver atrás o adelante en el navegador
    const handlePopState = () => {
      handleEndCallOnExit()
    }

    // CASO B: Recargar página o cerrar pestaña
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // No podemos usar await aquí de forma fiable, pero disparamos la petición
      updateStatus({
        callId: convexCall._id,
        status: "ended",
      })
      // Nota: Algunos navegadores modernos requieren que no pongas return para que sea silencioso
    }

    window.addEventListener("popstate", handlePopState)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [convexCall, updateStatus])

  const handleCancelCall = async () => {
    if (convexCall) {
      await updateStatus({ callId: convexCall._id, status: "ended" })
    }
  }

  useEffect(() => {
    if (!convexCall?._id) return

    const handleAppClose = () => {
      // Intentamos marcar la llamada como terminada al cerrar/recargar la pestaña
      if (convexCall.status === "accepted" || convexCall.status === "calling") {
        updateStatus({ callId: convexCall._id, status: "ended" })
      }
    }

    // Escuchar recarga o cierre de pestaña
    window.addEventListener("beforeunload", handleAppClose)
    // Escuchar botones de atrás/adelante del navegador
    window.addEventListener("popstate", handleAppClose)

    return () => {
      window.removeEventListener("beforeunload", handleAppClose)
      window.removeEventListener("popstate", handleAppClose)
    }
  }, [convexCall, updateStatus])

  // --- RENDERING ---

  if (error) {
    return (
      <StatusCard
        title={t("callError")}
        description={error}
        className="bg-red-50"
      >
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
        <Button
          onClick={() => router.push("/dashboard")}
          className="mt-4 w-full"
        >
          {t("goBack")}
        </Button>
      </StatusCard>
    )
  }

  if (!client || !convexCall) {
    return (
      <StatusCard title={t("initializingClient")} className="bg-slate-50">
        <LoadingSpinner size="lg" />
      </StatusCard>
    )
  }

  if (convexCall.status === "calling") {
    setOpenSidebar(false)
    return (
      <StatusCard
        title={t("callingTo", { name: convexCall.receptorCallName })}
        description={t("waitingForResponse")}
        className="bg-blue-50"
      >
        <div className="relative mx-auto w-20 h-20 mb-4">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-blue-600 rounded-full p-5 shadow-lg">
            <Video className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            onClick={handleCancelCall}
            className="rounded-full py-6 w-fit mx-auto mt-4 cursor-pointer"
          >
            <PhoneOff className="mr-2 h-5 w-5" /> {t("cancelCall")}
          </Button>
        </div>
      </StatusCard>
    )
  }

  if (call) {
    return (
      <StreamVideo client={client}>
        <StreamTheme className="text-white">
          <StreamCall call={call}>
            <CallStateWatcher convexCallId={convexCall._id} />
            {children}
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900">
      <LoadingSpinner size="lg" />
    </div>
  )
}

function CallStateWatcher({ convexCallId }: { convexCallId: Id<"calls"> }) {
  const call = useCall()
  const updateStatus = useMutation(api.calls.updateCallStatus)

  useEffect(() => {
    if (!call) return

    const handleStateChange = async () => {
      // Si el estado de Stream cambia a "left" o "ended", avisamos a Convex
      if (
        call.state.callingState === CallingState.LEFT ||
        call.state.callingState === CallingState.OFFLINE
      ) {
        console.log(
          "Detectado fin de llamada en Stream, actualizando Convex...",
        )
        await updateStatus({ callId: convexCallId, status: "ended" })
      }
    }

    const unsubscribeEnded = call.on("call.ended", handleStateChange)
    const unsubscribeLeft = call.on(
      "call.session_participant_left",
      handleStateChange,
    )

    return () => {
      unsubscribeEnded()
      unsubscribeLeft()
    }
  }, [call, convexCallId, updateStatus])

  return null // No renderiza nada, solo escucha
}
