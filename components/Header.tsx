"use client"

import { SignInButton, UserButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated } from "convex/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Separator } from "@/components/ui/separator"
import { PanelLeft } from "lucide-react"

function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")

  const t = useTranslations("header")

  return (
    <header
      className={`flex items-center ${!isDashboard && "justify-between"} px-4 w-full sm:px-6 h-[50px]`}
    >
      {isDashboard && (
        <>
          <div onClick={onToggleSidebar} className="cursor-pointer mr-2">
            <PanelLeft />
          </div>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </>
      )}

      <Link href="/dashboard" className="font-medium uppercase tracking-widest">
        {t("title")}
      </Link>
      {!isDashboard && (
        <div className="flex items-center gap-2">
          <Authenticated>
            {!isDashboard && (
              <Link href="/dashboard">
                <Button variant="outline">{t("dashboard")}</Button>
              </Link>
            )}
            <UserButton />
          </Authenticated>
        </div>
      )}
      <div className={`flex items-center gap-2 ${isDashboard && "ml-auto"}`}>
        <LanguageSwitcher />

        {!isDashboard && (
          <Unauthenticated>
            <SignInButton
              mode="modal"
              forceRedirectUrl="/dashboard"
              signUpForceRedirectUrl="/dashboard"
            >
              <Button className="cursor-pointer" variant="outline">
                {t("signIn")}
              </Button>
            </SignInButton>
          </Unauthenticated>
        )}
      </div>
    </header>
  )
}

export default Header
