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

type Props = {
  children: React.ReactNode
}

function NewChatDialog({ children }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Doc<"users">[]>([])
  const [groupName, setGroupName] = useState("")
  const createNewChat = useCreateNewChat()
  const { user } = useUser()
  const { setActiveChannel } = useChatContext()

  const handlerSelectUser = (user: Doc<"users">) => {
    if (!selectedUser.find((u) => u._id === user._id)) {
      setSelectedUser((prev) => [...prev, user])
    }
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
    })

    setActiveChannel(channel)
    setOpen(false)
    setSelectedUser([])
    setGroupName("")
  }

  return (
    <Dialog open={open} onOpenChange={handlerOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start a new Chat</DialogTitle>

          <DialogDescription>
            Search for user to start a new chat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <UserSearch onSelectUser={handlerSelectUser} className="w-full" />

          {selectedUser.length > 0 && (
            <div className="space-x-3">
              {" "}
              <h4 className="text-sm font-medium text-foreground">
                Selected Users ({selectedUser.length})
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
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
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
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
                    Group Name (Optional)
                  </label>
                  <Input
                    id="groupName"
                    type="text"
                    value={groupName}
                    placeholder="Enter group name"
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use default group name
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUser.length === 0}
          >
            {selectedUser.length > 1
              ? `Create Group Chat (${selectedUser.length + 1})`
              : selectedUser.length === 1
                ? `Start Chat`
                : "Create Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewChatDialog
