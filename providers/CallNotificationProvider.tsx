// components/CallNotificationProvider.tsx
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { IncomingCallModal } from "@/components/IncomingCallModal"

export const CallNotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { user } = useUser()
  const router = useRouter()

  // 1. Obtenemos el usuario de Convex usando el ID de Clerk

  // 2. Escuchamos si hay alguien llamándonos usando el ID de Convex
  const incomingCall = useQuery(
    api.calls.getIncomingCall,
    user?.id ? { userId: user.id } : "skip",
  )

  const updateStatus = useMutation(api.calls.updateCallStatus)

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
