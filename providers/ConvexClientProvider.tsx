"use client"

import { useAuth } from "@clerk/nextjs"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined")
}

// Instantiate the Convex client at the module level to ensure it's a singleton.
// This prevents multiple client instances from being created during re-renders.
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}

export default ConvexClientProvider
