"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { useCreateNewChat } from "@/hooks/useCreateNewChat"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useChatContext } from "stream-chat-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import UserSearch from "./UserSearch"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useLocale, useTranslations } from "next-intl"
import { defaultBotTelegramUser } from "@/convex/bot"
import { useSidebar } from "@/providers/SidebarProvider"

type Props = {
  children: React.ReactNode
}

function NewChatDialog({ children }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Doc<"users">[]>([
    defaultBotTelegramUser,
  ])
  const [groupName, setGroupName] = useState("")
  const createNewChat = useCreateNewChat()
  const { user } = useUser()
  const { setActiveChannel } = useChatContext()
  const t = useTranslations("newChatDialog")
  const locale = useLocale()
  const { setOpenSidebar } = useSidebar()

  const botInGroup = selectedUser.find(
    (u) => u._id === defaultBotTelegramUser._id,
  )
  const botCantBeInGroup = selectedUser.length > 1 && !!botInGroup

  const handlerSelectUser = (user: Doc<"users">) => {
    setSelectedUser((prev) => {
      // Check if user already exists to prevent duplicates
      if (prev.find((u) => u._id === user._id)) {
        return prev
      }
      return [...prev, user]
    })
  }

  const removeUser = (userId: string) => {
    setSelectedUser((prev) => prev.filter((u) => u._id !== userId))
  }

  const handlerOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      setSelectedUser([])
      setGroupName("")
    }
  }

  const handleCreateChat = async () => {
    const totalMembers = selectedUser.length + 1
    const isGroupChat = totalMembers > 2

    if (!user) return

    const channel = await createNewChat({
      members: [user.id as string, ...selectedUser.map((u) => u.userId)],
      createdBy: user.id as string,
      groupName: isGroupChat ? groupName.trim() || undefined : undefined,
      groupNameDefault: isGroupChat
        ? locale === "es"
          ? `Grupo (${totalMembers} miembros)`
          : `Group Chat (${totalMembers} members)`
        : undefined,
      img: undefined,
    })

    setActiveChannel(channel)
    setOpen(false)
    setSelectedUser([])
    setGroupName("")
    setOpenSidebar(false)
  }

  return (
    <Dialog open={open} onOpenChange={handlerOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>

          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <UserSearch
            onSelectUser={handlerSelectUser}
            className="w-full"
            placeholder={t("searchPlaceholder")}
          />

          {selectedUser.length > 0 && (
            <div className="space-x-3">
              <h4 className="text-sm font-medium text-foreground">
                {t("selectedUsers")} ({selectedUser.length})
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto mr-0">
                {selectedUser.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 bg-muted/50 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate text-foreground">
                          {user.name}
                        </p>

                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUser(user._id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {selectedUser.length > 1 && (
                <div className="space-y-2">
                  <label
                    htmlFor="groupName"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("groupName")}
                  </label>
                  <Input
                    id="groupName"
                    type="text"
                    value={groupName}
                    placeholder={t("enterGroupName")}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("leaveEmpty")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {botCantBeInGroup && (
          <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded-md">
            {t("botCantBeInGroup")}
          </p>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUser.length === 0 || botCantBeInGroup}
            className="bg-telegram-blue cursor-pointer"
          >
            {selectedUser.length > 1
              ? t("createGroupChat", { count: selectedUser.length + 1 })
              : selectedUser.length === 1
                ? t("startChat")
                : t("createChat")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewChatDialog
