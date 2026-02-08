import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Creates a new call record in the database.
 * Initial status is set to "calling".
 */
export const createCall = mutation({
  args: {
    callerId: v.string(),
    calleeId: v.string(),
    callerName: v.string(),
    receptorCallName: v.string(),
    streamCallId: v.string(),
    type: v.union(v.literal("audio"), v.literal("video")),
  },
  handler: async (ctx, args) => {
    const callId = await ctx.db.insert("calls", {
      callerId: args.callerId,
      calleeId: args.calleeId,
      callerName: args.callerName,
      streamCallId: args.streamCallId,
      receptorCallName: args.receptorCallName,
      type: args.type,
      status: "calling",
    })
    return callId
  },
})

/**
 * Retrieves the current incoming call for a specific user.
 * Returns the call only if status is "calling".
 */
export const getIncomingCall = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_callee_status", (q) =>
        q.eq("calleeId", args.userId).eq("status", "calling"),
      )
      .unique()
  },
})

/**
 * Updates the status of a call.
 * Possible statuses: accepted, rejected, missed, ended.
 */
export const updateCallStatus = mutation({
  args: {
    callId: v.id("calls"),
    status: v.union(
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("missed"),
      v.literal("ended"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.callId, { status: args.status })
  },
})

/**
 * Retrieves a call by its Stream Call ID.
 * Used for monitoring call status.
 */
export const getCallByStreamId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_stream_id", (q) => q.eq("streamCallId", args.streamCallId))
      .unique()
  },
})

/**
 * Retrieves the last call for a user, either as caller or callee.
 * Used for call history or resuming calls.
 */
export const getLastCallByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const callerCall = await ctx.db
      .query("calls")
      .withIndex("by_caller", (q) => q.eq("callerId", args.userId))
      .order("desc")
      .first()

    const calleeCall = await ctx.db
      .query("calls")
      .withIndex("by_callee", (q) => q.eq("calleeId", args.userId))
      .order("desc")
      .first()

    if (!callerCall) return calleeCall
    if (!calleeCall) return callerCall

    return callerCall._creationTime > calleeCall._creationTime
      ? callerCall
      : calleeCall
  },
})
