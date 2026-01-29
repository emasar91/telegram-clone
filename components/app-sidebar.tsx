"use client"
import * as React from "react"
import { useUser } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { UserButton } from "@clerk/nextjs"
import { ChannelList } from "stream-chat-react"
import { ChannelSort } from "stream-chat"
import NewChatDialog from "./NewChatDialog"
import PencilIcon from "@/public/assets/icons/PencilIcon"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Welcome back
                  </span>
                  <span className="text-sm  font-semibold">
                    {user?.fullName || "Unknown User"}
                  </span>
                </div>
                <UserButton signInUrl="/sign-in" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="h-full">
        <SidebarGroup className="flex flex-col flex-1 min-h-0">
          <SidebarMenu className="flex flex-col flex-1 relative">
            {/* LISTA / EMPTY STATE */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChannelList
                filters={filters}
                options={options}
                sort={sort}
                EmptyStateIndicator={() => (
                  <div className="flex h-full flex-col items-center justify-center px-4">
                    <div className="text-6xl mb-6 opacity-20">💬</div>
                    <h2 className="text-xl font-medium mb-2">Ready to chat?</h2>
                    <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                      Your conversation will appear here once you start chatting
                    </p>
                  </div>
                )}
              />
            </div>

            {/* FLOATING ACTION BUTTON */}
            <NewChatDialog>
              <Button
                className="
                  absolute right-4 bottom-4 z-50
                  w-[56px] h-[56px] p-0
                  rounded-full bg-[#3390ec]

                  /* MOBILE (default) */
                  opacity-100 translate-y-0

                  /* DESKTOP (>=640) */
                  sm:opacity-0 sm:translate-y-6
                  sm:transition-all sm:duration-200 sm:ease-out
                  sm:group-hover:opacity-100
                  sm:group-hover:translate-y-0
                "
              >
                <PencilIcon className="size-6 text-white" />
              </Button>
            </NewChatDialog>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
