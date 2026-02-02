"use client"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

const CustomModal = dynamic(() => import("@/components/CustomModal"), {
  loading: () => <div className="w-full h-full bg-white" />,
})

export default function VideoHoverCard({ type }: { type: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const t = useTranslations("home")

  const [openModal, setOpenModal] = useState(false)
  const [platform, setPlatform] = useState("")

  const handleMouseEnter = () => {
    const video = videoRef.current
    if (!video) return

    if (video.ended) {
      video.currentTime = 0
      video.play().catch((err) => {
        console.warn("Video playback failed on hover:", err)
      })
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.play().catch((err) => {
      console.warn("Initial video playback failed:", err)
    })
  }, [])

  const width = type === "android" ? "w-[245px]" : "w-[350px]"

  const handleModal = () => {
    setPlatform(t(type))
    setOpenModal(true)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className={`flex items-center justify-center flex-col ${width} group mt-12`}
    >
      <div
        onClick={handleModal}
        className={cn(
          "relative overflow-hidden rounded-xl cursor-pointer shadow-md transition-all duration-300 hover:shadow-xl",
          type === "android" ? "h-[240px] w-[192px]" : "h-[240px] w-[304px]",
        )}
      >
        <video
          ref={videoRef}
          src={`/assets/videos/${type}.mp4`}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300" />
      </div>
      <div
        onClick={handleModal}
        className={`flex w-full gap-3 mt-6 items-center justify-center flex-col cursor-pointer`}
      >
        <div className="flex gap-2 px-4 h-5">
          <Image
            src={`/assets/icons/${type}.svg`}
            alt={type}
            width={24}
            height={24}
          />
          <p className="text-telegram-blue font-lucida leading-[18px] text-[15px]">
            {t("for")}
          </p>
          <p className="text-telegram-blue font-lucida font-bold leading-[18px] text-[15px]">
            {t(type)}
          </p>
        </div>
        <span className="h-[3px] w-0 bg-telegram-blue transition-[width] duration-150 ease-out group-hover:w-full" />
      </div>
      <CustomModal
        open={openModal}
        platform={platform}
        handleClose={() => setOpenModal(false)}
      />
    </div>
  )
}
