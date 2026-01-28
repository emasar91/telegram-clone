"use client"
import { useRef, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function VideoHoverCard({ type }: { type: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const t = useTranslations("home")

  const handleMouseEnter = () => {
    const video = videoRef.current
    if (!video) return

    if (video.ended) {
      video.currentTime = 0
      video.play()
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.play()
  }, [])

  const width = type === "android" ? "w-[245px]" : "w-[350px]"

  return (
    <div
      className={`flex items-center justify-center flex-col ${width} group mt-12`}
    >
      <div
        onMouseEnter={handleMouseEnter}
        className={`relative ${type === "android" ? "h-[240px] w-[192px]" : "h-[240px] w-[304px]"} overflow-hidden rounded-xl cursor-pointer`}
      >
        <video
          ref={videoRef}
          src={`/assets/videos/${type}.mp4`}
          muted
          playsInline
          className="absolute transition-opacity hover:opacity-100"
        />
      </div>
      <div
        className={`flex w-full gap-3 mt-6 items-center justify-center flex-col`}
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
    </div>
  )
}
