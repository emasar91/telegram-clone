"use client"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useIsMobile } from "@/hooks/useIsMobile"
import CustomModal from "./CustomModal"
import { useState } from "react"

function PcMacos() {
  const t = useTranslations("home")
  const [openModal, setOpenModal] = useState(false)

  const [platform, setPlatform] = useState("")

  const isMobile = useIsMobile(640)

  return (
    <div className="flex items-center justify-center w-full mt-20 flex-col">
      {!isMobile ? (
        <>
          <Image
            src="/assets/images/SiteDesktop.jpg"
            alt="Telegram PC"
            width={580}
            height={320}
            className="hidden sm:block"
          />
          <div className=" items-center justify-center w-full max-w-[580px] hidden sm:flex">
            <div
              onClick={() => {
                setPlatform(t("pc"))
                setOpenModal(true)
              }}
              className="group w-[53%] text-center cursor-pointer flex flex-col h-[280px] justify-end mt-[-218px]"
            >
              <div className="flex items-center justify-center gap-2">
                <p className="mt-2 font-lucida leading-[18px] text-[15px] text-center text-telegram-blue">
                  {t("for")}
                </p>

                <p className="mt-2 font-lucida leading-[18px] text-[15px] text-center text-telegram-blue font-bold">
                  {t("pc")}
                </p>
              </div>

              <span className="block mx-auto mt-2 h-[3px] w-full bg-telegram-blue scale-x-0 transition-transform duration-150 ease-out origin-center group-hover:scale-x-100" />
            </div>

            <div
              onClick={() => {
                setPlatform(t("macos"))
                setOpenModal(true)
              }}
              className="group w-[47%] text-center cursor-pointer flex flex-col h-[280px] justify-end mt-[-218px]"
            >
              <div className="flex items-center justify-center gap-2">
                <p className="mt-2 font-lucida leading-[18px] text-[15px] text-center text-telegram-blue">
                  {t("for")}
                </p>

                <p className="mt-2 font-lucida leading-[18px] text-[15px] text-center text-telegram-blue font-bold">
                  {t("macos")}
                </p>
              </div>

              <span className=" block mx-auto mt-2 h-[3px] w-full bg-telegram-blue scale-x-0 transition-transform duration-150 ease-out origin-center group-hover:scale-x-100" />
            </div>
          </div>
        </>
      ) : (
        <>
          <Image
            src="/assets/images/SiteDesktopMobile.jpg"
            alt="Telegram PC Mobile"
            width={304}
            height={160}
            className="block sm:hidden"
          />
          <div
            onClick={() => {
              setPlatform(t("pc") + " / " + t("macos"))
              setOpenModal(true)
            }}
            className="group w-[53%] text-center cursor-pointer flex-col h-[215px] justify-end mt-[-165px] flex sm:hidden"
          >
            <div className="flex items-center justify-center gap-2">
              <p className="mt-2 font-lucida leading-[18px] text-[15px] text-center text-telegram-blue">
                {t("for")} <span className="font-bold">{t("pcmacos")}</span>
              </p>
            </div>

            <span className="block mx-auto mt-2 h-[3px] w-full bg-telegram-blue scale-x-0 transition-transform duration-150 ease-out origin-center group-hover:scale-x-100" />
          </div>
        </>
      )}

      <CustomModal
        open={openModal}
        platform={platform}
        handleClose={() => setOpenModal(false)}
      />
    </div>
  )
}

export default PcMacos
