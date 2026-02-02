import streamClient from "@/lib/stream"

export function useCreateNewChat() {
  const createNewChat = async ({
    members,
    createdBy,
    groupName,
    groupNameDefault,
  }: {
    members: string[]
    createdBy: string
    groupName?: string
    groupNameDefault?: string
  }) => {
    const isGroupChat = members.length > 2

    // 1. Check for existing channel with these exact members
    const existingChannels = await streamClient.queryChannels(
      {
        type: isGroupChat ? "team" : "messaging",
        members: { $in: members },
      },
      {},
      { limit: 30 },
    )

    const findExactMatch = existingChannels.find((channel) => {
      const channelMembers = Object.keys(channel.state.members)
      return (
        channelMembers.length === members.length &&
        members.every((m) => channelMembers.includes(m))
      )
    })

    if (findExactMatch) {
      return findExactMatch
    }

    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

    try {
      const channelData: {
        members: string[]
        name?: string
        created_by_id: string
      } = {
        members,
        created_by_id: createdBy,
      }

      if (isGroupChat) {
        channelData.name = groupName || groupNameDefault
      }

      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging",
        channelId,
        channelData,
      )

      await channel.watch({ presence: true })
      return channel
    } catch (error) {
      console.log(error)
      return undefined
    }
  }
  return createNewChat
}
