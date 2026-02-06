import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  calls: defineTable({
    callerId: v.string(),
    calleeId: v.string(),
    callerName: v.string(),
    receptorCallName: v.string(),
    status: v.union(
      v.literal("calling"), // Timbre sonando
      v.literal("accepted"), // En conversación
      v.literal("rejected"), // Rechazada por el receptor
      v.literal("missed"), // Nadie contestó
      v.literal("ended"), // Terminó normalmente
    ),
    streamCallId: v.string(), // ID para conectar con Stream Video
    type: v.union(v.literal("audio"), v.literal("video")), // Para saber qué UI mostrar
  })
    // Índice para obtener la última llamada de un usuario (sea emisor o receptor)
    .index("by_caller", ["callerId"])
    // Índice para que el receptor escuche llamadas entrantes
    .index("by_callee", ["calleeId"])
    // Índice para que el receptor escuche llamadas entrantes
    .index("by_callee_status", ["calleeId", "status"])
    // Índice para que el emisor pueda monitorear si le aceptaron la llamada
    .index("by_caller_status", ["callerId", "status"])
    // Índice por streamCallId para actualizaciones rápidas desde webhooks de Stream si los usas luego
    .index("by_stream_id", ["streamCallId"]),
})
