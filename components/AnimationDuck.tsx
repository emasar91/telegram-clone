"use client" // Lottie necesita ejecutarse en el cliente

import dynamic from "next/dynamic"

// Dynamically import Lottie to reduce initial bundle size
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted/20 animate-pulse rounded-full" />
  ),
})

interface Props {
  title: string
  subtitle: React.ReactNode
  duck: object
}

export default function AnimationDuck({ title, subtitle, duck }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full md:w-1/2 lg:w-1/3 ">
      <div className="w-48 h-48">
        <Lottie animationData={duck} loop={true} className="w-full h-full" />
      </div>
      <p className="mt-4 text-[26px] leading-[29px] text-telegram-blue font-lucida">
        {title}
      </p>
      <p className="mt-4 text-[15px] leading-[24px] text-gray-500 font-lucida max-w-[260px] text-center">
        {subtitle}
      </p>
    </div>
  )
}
