import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getUserByClerkUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      return null
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()

    return user
  },
})

export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, { userId, name, email, imageUrl }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()

    if (user) {
      await ctx.db.patch(user._id, {
        name,
        imageUrl,
      })

      return user._id
    } else {
      return await ctx.db.insert("users", {
        userId,
        name,
        email,
        imageUrl,
      })
    }
  },
})

export const searchUsers = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm.trim()) {
      return []
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    const users = await ctx.db.query("users").collect()

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedSearchTerm) ||
        user.email.toLowerCase().includes(normalizedSearchTerm),
    )
  },
})

import { defaultBotTelegramUser } from "./bot"

export { defaultBotTelegramUser }
