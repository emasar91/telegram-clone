import type { Metadata, Viewport } from "next"
import "./globals.css"
import ConvexClientProvider from "@/providers/ConvexClientProvider"
import IntlProvider from "@/providers/IntlProvider"
import localFont from "next/font/local"
import ClerkProviderClient from "@/providers/ClerkProvider"
import { SidebarProvider } from "@/providers/SidebarProvider"
import NotificationContainer from "@/components/NotificationCenter"

export const metadata: Metadata = {
  metadataBase: new URL("https://emasar-telegram-clone.vercel.app"),
  title: {
    default: "Telegram Clone",
    template: "%s | Telegram Clone",
  },
  description:
    "A Telegram clone with video call feature and more. Created by Emanuel Sarco",
  openGraph: {
    title: "Telegram Clone",
    description:
      "A Telegram clone with video call feature and more. Created by Emanuel Sarco",
    url: "https://emasar-telegram-clone.vercel.app",
    images: [
      {
        url: "/assets/images/telegram-icon.png",
        width: 1200,
        height: 630,
        alt: "Telegram Clone",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3390ec",
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
              <SidebarProvider>
                {children}
                <NotificationContainer />
              </SidebarProvider>
            </ConvexClientProvider>
          </ClerkProviderClient>
        </IntlProvider>
      </body>
    </html>
  )
}
