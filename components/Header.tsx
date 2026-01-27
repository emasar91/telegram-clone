"use client"

import { SignInButton, UserButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated } from "convex/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "./LanguageSwitcher"

function Header() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")

  const t = useTranslations("header")

  return (
    <header className="flex items-center justify-between px-4 h-15 sm:px-6">
      <Link href="/dashboard" className="font-medium uppercase tracking-widest">
        {t("title")}
      </Link>
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
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        <Unauthenticated>
          <SignInButton
            mode="modal"
            forceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
          >
            <Button variant="outline">{t("signIn")}</Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </header>
  )
}

export default Header
