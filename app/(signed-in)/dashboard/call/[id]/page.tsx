"use client"

import { LoadingSpinner } from "@/components/LoadingSpinner"
import StatusCard from "@/components/StatusCard"
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

function CallPage() {
  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()
  const router = useRouter()
  const t = useTranslations("call")

  const handleLeaveCall = () => {
    router.push("/dashboard")
  }

  if (callingState === CallingState.LEFT) {
    return (
      <div className="flex items-center justify-center h-full ">
        <StatusCard
          title={t("callLeaving")}
          className="bg-gray-50 rounded-lg pb-4 text-black"
        >
          <LoadingSpinner size="lg" className="mb-0" />
        </StatusCard>
      </div>
    )
  }

  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex items-center justify-center h-full ">
        <StatusCard
          title={t("joiningCall")}
          description="Please wait while we join the call"
          className="bg-gray-50 rounded-lg pb-4 text-black"
        >
          <LoadingSpinner size="lg" className="mb-0" />
        </StatusCard>
      </div>
    )
  }

  if (callingState === CallingState.RECONNECTING) {
    return (
      <StatusCard
        title={t("reconnecting")}
        description={t("connectionLost")}
        className="bg-yellow-50 rounded-lg border-yellow-200 text-black"
      >
        <div className="animate-pulse rounded-full h-12 w-12 bg-yellow-400 mx-auto" />
      </StatusCard>
    )
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <StatusCard
        title={t("loadingCall")}
        description={`${t("status")}: ${callingState}`}
        className="bg-gray-50 rounded-lg"
      >
        <div className="animate-pulse rounded-full h-12 w-12 bg-gray-400 mx-auto" />
      </StatusCard>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 relative">
        <SpeakerLayout />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <CallControls onLeave={handleLeaveCall} />
      </div>
    </div>
  )
}

export default CallPage
