import type { Metadata } from "next"
import "./globals.css"
import ConvexClientProvider from "@/providers/ConvexClientProvider"
import IntlProvider from "@/providers/IntlProvider"
import localFont from "next/font/local"
import ClerkProviderClient from "@/providers/ClerkProvider"
import { SidebarProvider } from "@/providers/SidebarProvider"

export const metadata: Metadata = {
  title: "Telegram Clone",
  description:
    "A Telegram clone with video call feature and more. Created by Emanuel Sarco",
  icons: {
    icon: "/assets/images/telegram-icon.png",
  },
  openGraph: {
    title: "Telegram Clone",
    description:
      "A Telegram clone with video call feature and more. Created by Emanuel Sarco",
    images: [
      {
        url: "/assets/images/telegram-icon.png",
        width: 1200,
        height: 630,
        alt: "Telegram Clone",
      },
    ],
  },
}

export const lucida = localFont({
  src: "./fonts/LucidaSansUnicode.ttf",
  variable: "--font-lucida",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={lucida.variable}>
      <body className={`font-sans antialiased`}>
        <IntlProvider>
          <ClerkProviderClient>
            <ConvexClientProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ConvexClientProvider>
          </ClerkProviderClient>
        </IntlProvider>
      </body>
    </html>
  )
}
