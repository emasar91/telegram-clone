"use client"

import { PanelLeftClose, PencilIcon, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton, useUser } from "@clerk/nextjs"
import { Separator } from "./ui/separator"
import { ChannelList } from "stream-chat-react"
import { ChannelSort } from "stream-chat"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { useSidebar } from "@/providers/SidebarProvider"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useMemo } from "react"
import dynamic from "next/dynamic"

const NewChatDialog = dynamic(() => import("./NewChatDialog"), { ssr: false })

// Hoist static EmptyStateIndicator component to avoid re-creation
const EmptyStateIndicator = ({
  text,
  description,
}: {
  text: string
  description: string
}) => (
  <div className="flex h-full flex-col items-center justify-center px-4 bg-[#fafafa]">
    <div className="mb-6 opacity-20">
      <MessageSquare className="size-16 text-telegram-blue" />
    </div>
    <h2 className="text-xl font-medium mb-2">{text}</h2>
    <p className="text-sm text-muted-foreground text-center max-w-[200px]">
      {description}
    </p>
  </div>
)

export function Sidebar() {
  const { user } = useUser()
  const t = useTranslations("sidebar")
  const { openSidebar, setOpenSidebar } = useSidebar()
  const isMobile = useIsMobile()

  const filters = useMemo(
    () => ({
      members: { $in: [user?.id as string] },
      type: { $in: ["messaging", "team"] },
    }),
    [user?.id],
  )

  const options = useMemo(
    () => ({
      presence: true,
      state: true,
    }),
    [],
  )

  const sort: ChannelSort = useMemo(
    () => ({
      last_message_at: -1,
    }),
    [],
  )

  return (
    <>
      {/* Overlay para mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 sm:hidden ",
          openSidebar ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpenSidebar(false)}
      />

      {/* Contenedor del Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-dvh transition-all duration-300 ease-in-out border-r overflow-hidden flex flex-col",
          // Desktop: Controlamos el margen izquierdo para que el contenido de la derecha se desplace
          "sm:relative sm:z-0",
          openSidebar
            ? "translate-x-0 w-[350px] sm:ml-0"
            : "-translate-x-full w-[350px] sm:ml-[-350px] sm:translate-x-0 sm:border-r-0",
        )}
      >
        {/* Contenido interno con ancho FIJO para que NO se deforme al cerrar */}
        <div className="w-[350px] flex flex-col h-full shrink-0 bg-t bg-[#fafafa]! ">
          <div className="flex h-[72px] shrink-0 items-center justify-between p-4">
            <div className="flex items-center gap-2">
              {isMobile && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="p-0! cursor-pointer"
                    onClick={() => setOpenSidebar(false)}
                  >
                    <PanelLeftClose className="size-6" />
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-6"
                  />
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  {t("welcome")}
                </span>
                <span className="text-sm font-semibold truncate">
                  {user?.fullName || "User"}
                </span>
              </div>
            </div>
            <UserButton />
          </div>

          <Separator className="shrink-0" />

          <div className="flex-1 group min-h-0 relative">
            <ChannelList
              filters={filters}
              options={options}
              sort={sort}
              EmptyStateIndicator={() => (
                <EmptyStateIndicator
                  text={t("ready")}
                  description={t("conversation")}
                />
              )}
            />

            {/* Botón con animación de escala (Pop-in) */}
            <div className="absolute right-6 bottom-6 z-50">
              <NewChatDialog>
                <Button
                  className={cn(
                    "h-14 w-14 rounded-full bg-[#3390ec] shadow-xl transition-all duration-300 cursor-pointer",
                    "scale-100 opacity-100", // Mobile
                    // Desktop: Solo aparece con hover en el sidebar
                    "sm:scale-0 sm:opacity-0 group-hover:scale-100 group-hover:opacity-100",
                  )}
                >
                  <PencilIcon className="size-6 text-white" />
                </Button>
              </NewChatDialog>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
