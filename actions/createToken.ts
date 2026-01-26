"use server"

import streamServerClient from "@/lib/streamServer"

export async function createToken(userId: string) {
  const token = await streamServerClient.createToken(userId)
  return token
}
