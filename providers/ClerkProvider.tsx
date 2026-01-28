import { esES, enUS } from "@clerk/localizations"
import { ClerkProvider } from "@clerk/nextjs"
import { useLocale } from "next-intl"
interface ClerkProviderProps {
  children: React.ReactNode
}

function ClerkProviderClient({ children }: ClerkProviderProps) {
  const locale = useLocale()

  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      localization={locale === "es" ? esES : enUS}
    >
      {children}
    </ClerkProvider>
  )
}

export default ClerkProviderClient
