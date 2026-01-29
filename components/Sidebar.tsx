"use client"

import { PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton, useUser } from "@clerk/nextjs"
import { Separator } from "./ui/separator"
import { ChannelList } from "stream-chat-react"
import { ChannelSort } from "stream-chat"
import NewChatDialog from "./NewChatDialog"
import { Button } from "./ui/button"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUser()

  const filters = {
    members: { $in: [user?.id as string] },
    type: { $in: ["messaging", "team"] },
  }

  const options = {
    presence: true,
    state: true,
  }

  const sort: ChannelSort = {
    last_message_at: -1,
  }

  return (
    <>
      {/* Overlay para mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 sm:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Contenedor del Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-dvh transition-all duration-300 ease-in-out bg-white border-r overflow-hidden flex flex-col",
          // Desktop: Controlamos el margen izquierdo para que el contenido de la derecha se desplace
          "sm:relative sm:z-0",
          isOpen
            ? "translate-x-0 w-[350px] sm:ml-0"
            : "-translate-x-full w-[350px] sm:ml-[-350px] sm:translate-x-0 sm:border-r-0",
        )}
      >
        {/* Contenido interno con ancho FIJO para que NO se deforme al cerrar */}
        <div className="w-[350px] flex flex-col h-full shrink-0 bg-[#fafafa]">
          <div className="flex h-[72px] shrink-0 items-center justify-between p-4">
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Welcome back
              </span>
              <span className="text-sm font-semibold truncate">
                {user?.fullName || "User"}
              </span>
            </div>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>

          <Separator className="shrink-0" />

          <div className="flex-1 group min-h-0 relative">
            <ChannelList
              filters={filters}
              options={options}
              sort={sort}
              EmptyStateIndicator={() => (
                <div className="flex h-full flex-col items-center justify-center px-4 bg-[#fafafa]">
                  <div className="text-6xl mb-6 opacity-20">💬</div>
                  <h2 className="text-xl font-medium mb-2">Ready to chat?</h2>
                  <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                    Your conversation will appear here once you start chatting
                  </p>
                </div>
              )}
            />

            {/* Botón con animación de escala (Pop-in) */}
            <div className="absolute right-6 bottom-6 z-50">
              <NewChatDialog>
                <Button
                  className={cn(
                    "h-14 w-14 rounded-full bg-[#3390ec] shadow-xl transition-all duration-300",
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
