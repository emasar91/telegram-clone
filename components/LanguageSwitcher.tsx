"use client"

import { setLocale } from "@/actions/setLocale"
import { useRouter } from "next/navigation"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "./ui/menubar"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"
import { Globe, ChevronDown } from "lucide-react"

type LANG = "es" | "en"

export function LanguageSwitcher() {
  const router = useRouter()

  const t = useTranslations("header")

  const locale = useLocale()

  const changeLanguage = async (locale: LANG) => {
    await setLocale(locale)
    router.refresh()
  }
  const itemClass = (active: boolean) =>
    active
      ? "text-blue-500 data-[highlighted]:text-blue-500"
      : "data-[highlighted]:text-black"
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <Globe className="w-4 h-4 mr-2" />
          {locale.toUpperCase()}
          <ChevronDown className="w-4 h-4 ml-2" />
        </MenubarTrigger>
        <MenubarContent className="min-w-4">
          <MenubarItem
            onClick={() => changeLanguage("es")}
            className={itemClass(locale === "es")}
          >
            {t("es")}
          </MenubarItem>

          <MenubarItem
            onClick={() => changeLanguage("en")}
            className={itemClass(locale === "en")}
          >
            {t("en")}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
