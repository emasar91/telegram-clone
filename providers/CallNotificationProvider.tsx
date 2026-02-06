// components/CallNotificationProvider.tsx
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { IncomingCallModal } from "@/components/IncomingCallModal"
import { useEffect, useRef } from "react"
import { toast } from "react-toastify"

export const CallNotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { user } = useUser()
  const router = useRouter()

  // 2. Escuchamos si hay alguien llamándonos usando el ID de Convex
  const incomingCall = useQuery(
    api.calls.getIncomingCall,
    user?.id ? { userId: user.id } : "skip",
  )

  const lastCall = useQuery(
    api.calls.getLastCallByUser,
    user?.id ? { userId: user.id } : "skip",
  )

  const updateStatus = useMutation(api.calls.updateCallStatus)

  // Ref para evitar duplicar Toasts al re-renderizar
  const lastProcessedCall = useRef<string | null>(null)
  console.log("🚀 ~ lastCall:", lastCall)

  // --- LÓGICA DE TOASTS ---
  useEffect(() => {
    if (!lastCall) return

    // Generamos una llave única por ID de llamada y estado
    const callKey = `${lastCall._id}-${lastCall.status}`

    // Si ya procesamos este estado de esta llamada, no hacemos nada
    if (lastProcessedCall.current === callKey) return

    const isCaller = lastCall.callerId === user?.id

    // Solo disparamos Toasts para estados finales
    if (lastCall.status === "ended") {
      toast.info("Llamada finalizada")
    } else if (lastCall.status === "rejected" && isCaller) {
      toast.error("Llamada rechazada")
    } else if (lastCall.status === "missed") {
      if (isCaller) {
        toast.info("El usuario no respondió")
      } else {
        toast.warning(`Llamada perdida de ${lastCall.callerName}`)
      }
    }

    lastProcessedCall.current = callKey
  }, [lastCall, user?.id])

  const handleAccept = async () => {
    if (!incomingCall) return
    await updateStatus({ callId: incomingCall._id, status: "accepted" })
    router.push(`/dashboard/call/${incomingCall.streamCallId}`)
  }

  const handleReject = async () => {
    if (!incomingCall) return
    await updateStatus({ callId: incomingCall._id, status: "rejected" })
  }

  return (
    <div className="relative w-full h-full">
      {children}
      {incomingCall && (
        <IncomingCallModal
          callerName={incomingCall.callerName} // Puedes agregar este campo al esquema
          type={incomingCall.type}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  )
}
