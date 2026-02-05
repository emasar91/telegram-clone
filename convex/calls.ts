import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// 1. POST: Crear la llamada (Iniciada por el emisor)
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
    // Creamos el documento con estado inicial "calling"
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

// 2. GET: Escuchar llamadas entrantes (Usado por el receptor)
export const getIncomingCall = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_callee_status", (q) =>
        q.eq("calleeId", args.userId).eq("status", "calling"),
      )
      .unique() // Solo nos interesa la llamada activa actual
  },
})

// 3. PATCH: Actualizar el estado (Aceptar, Rechazar, Terminar)
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

// 4. GET: Obtener una llamada específica por ID (Para que el emisor la monitoree)
export const getCallByStreamId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_stream_id", (q) => q.eq("streamCallId", args.streamCallId))
      .unique()
  },
})
