import { NextIntlClientProvider } from "next-intl"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>
}
