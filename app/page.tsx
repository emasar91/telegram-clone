import Header from "@/components/Header"
import Image from "next/image"
import { useTranslations } from "next-intl"
import TelegramIcon from "@/public/assets/icons/TelegramIcon"
import VideoAnimate from "@/components/VideoAnimate"
import PcMacos from "@/components/PcMacos"
import FeaturesDucks from "@/components/FeaturesDucks"
export default function Home() {
  const t = useTranslations("home")

  return (
    <>
      <div className="w-full border-b border-gray-200 absolute top-[50px] left-0 right-0" />
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="flex items-center justify-center flex-col ">
          <Image
            src="/assets/images/telegram-icon.png"
            alt="Telegram Icon"
            width={130}
            height={130}
            className="mt-10"
            priority
          />
          <TelegramIcon />

          <p className="text-[#8c8c8c] mt-2 text-[20px] leading-[30px]">
            {t("subtitle")}
          </p>

          <div className="flex items-center justify-center sm:flex-row flex-col">
            <VideoAnimate type="android" />
            <VideoAnimate type="mac" />
          </div>

          <PcMacos />

          <FeaturesDucks />
        </div>
      </div>
    </>
  )
}
