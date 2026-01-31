import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAutenticatedRoute = createRouteMatcher(["/dashboard(.*)"])
const isRootRoute = createRouteMatcher(["/"])

export default clerkMiddleware(async (auth, req) => {
  const userAgent = req.headers.get("user-agent") || ""

  const isBot =
    userAgent.includes("WhatsApp") ||
    userAgent.includes("facebookexternalhit") ||
    userAgent.includes("Facebot")

  if (isBot) {
    return NextResponse.next()
  }

  const { userId } = await auth()

  if (userId && isRootRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (isAutenticatedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
