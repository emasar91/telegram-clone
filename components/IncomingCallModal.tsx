"use client"

import { Phone, PhoneOff, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  callerName: string
  type: "audio" | "video"
  onAccept: () => void
  onReject: () => void
}

export const IncomingCallModal = ({
  callerName,
  type,
  onAccept,
  onReject,
}: Props) => {
  return (
    <div className="absolute bottom-4 right-1/2 translate-x-1/2 w-full max-w-4xl z-50 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {callerName[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-white font-semibold truncate max-w-[150px]">
            {callerName}
          </h3>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            {type === "video" ? <Video size={14} /> : <Phone size={14} />}
            Llamada entrante...
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="icon"
          variant="destructive"
          onClick={onReject}
          className="rounded-full w-12 h-12 animate-pulse hover:animate-none"
        >
          <PhoneOff size={20} />
        </Button>
        <Button
          size="icon"
          onClick={onAccept}
          className="bg-green-500 hover:bg-green-600 rounded-full w-12 h-12"
        >
          <Phone size={20} className="text-white" />
        </Button>
      </div>
    </div>
  )
}
