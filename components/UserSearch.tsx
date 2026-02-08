"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { useUserSearch } from "@/hooks/useUserSearch"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { Input } from "./ui/input"
import { Mail, Search, UserIcon, X } from "lucide-react"
import { Button } from "./ui/button"
import { InlineSpinner } from "./LoadingSpinner"
import Image from "next/image"
import { useTranslations } from "next-intl"

type Props = {
  onSelectUser: (user: Doc<"users">) => void
  className?: string
  placeholder?: string
}

/**
 * Component for searching users in the system.
 * Displays a search input and a list of matching users.
 * Filters out the currently authenticated user from results.
 */
function UserSearch({ onSelectUser, className, placeholder }: Props) {
  const { searchTerm, setSearchTerm, searchResults, isLoading } =
    useUserSearch()

  const { user } = useUser()

  const filteredResults = searchResults.filter((u) => u.userId !== user?.id)

  const t = useTranslations("newChatDialog")

  const handleSelectUser = (user: (typeof searchResults)[0]) => {
    onSelectUser(user)
    setSearchTerm("")
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchTerm && (
          <Button
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent hover:bg-transparent"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-muted-foreground " />
          </Button>
        )}
      </div>

      {searchTerm.trim() && (
        <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <InlineSpinner size="sm" />

                <span>{t("searchingForUsers")}</span>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <UserIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>
                {t("userNotFound")} &quot;{searchTerm}&quot;
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredResults.map((user) => (
                <button
                  role="option"
                  aria-selected={user.email === searchTerm}
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-accent transition-colors",
                    "border-b border-border last:border-0",
                    "focus:outline-accent focus:bg-accent cursor-pointer",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-2 ring-border h-10 w-10"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground truncate">
                          {user.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>

                      <div className="shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserSearch
