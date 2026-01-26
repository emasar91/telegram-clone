"use client"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import React, { useCallback, useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingSpinner"
import streamClient from "@/lib/stream"
import { createToken } from "@/actions/createToken"

type Props = {
  children: React.ReactNode
}

function UserSyncWrapper({ children }: Props) {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const createOrUpdateUser = useMutation(api.users.upsertUser)

  const syncUser = useCallback(async () => {
    if (!user?.id) {
      setError("User not found")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const tokenProvider = async () => {
        if (!user?.id) {
          throw new Error("User not authenticated")
        }

        const token = await createToken(user.id)

        return token
      }

      await createOrUpdateUser({
        userId: user.id,
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0].emailAddress ||
          "Unknown User",
        email: user.emailAddresses[0].emailAddress || "",
        imageUrl: user.imageUrl || "",
      })

      await streamClient.connectUser(
        {
          id: user.id,
          name:
            user.fullName ||
            user.firstName ||
            user.emailAddresses[0].emailAddress ||
            "Unknown User",
          image: user.imageUrl || "",
        },
        tokenProvider,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync user data")
    } finally {
      setIsLoading(false)
    }
  }, [createOrUpdateUser, user])

  const disconnectUser = useCallback(async () => {
    try {
      await streamClient.disconnectUser()
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (!isUserLoaded) return
    if (user) {
      syncUser()
    } else {
      disconnectUser()
      setIsLoading(false)
    }
    return () => {
      disconnectUser()
    }
  }, [user, isUserLoaded, syncUser, disconnectUser])

  if (!isUserLoaded || isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        message={!isUserLoaded ? "Loading user..." : "Syncing user data..."}
        className="min-h-screen"
      />
    )
  }

  if (error) {
    return (
      <div className="flex-1 items-center justify-center bg-white px-6">
        <p className="text-red-500 text-lg font-semibold  mb-2">Sync Error</p>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <p className="text-gray-500 text-sm text-center">
          Please try restarting your browser or contact support if the problem
          persists.
        </p>
      </div>
    )
  }

  return <div>{children}</div>
}

export default UserSyncWrapper
