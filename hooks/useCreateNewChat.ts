import streamClient from "@/lib/stream"

export function useCreateNewChat() {
  const createNewChat = async ({
    members,
    createdBy,
    groupName,
    groupNameDefault,
    img,
  }: {
    members: string[]
    createdBy: string
    groupName?: string
    groupNameDefault?: string
    img?: string
  }) => {
    const isGroupChat = members.length > 2

    if (isGroupChat) {
      const existingChannel = await streamClient.queryChannels(
        {
          type: "messaging",
          members: { $in: members },
        },
        { created_at: -1 },
        { limit: 1 },
      )

      if (existingChannel.length > 0) {
        const channel = existingChannel[0]
        const channelMembers = Object.keys(channel.state.members)
        if (
          channelMembers.length === 2 &&
          members.length === 2 &&
          members.every((member) => channelMembers.includes(member))
        ) {
          return channel
        }
      }
    }

    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

    try {
      const channelData: {
        members: string[]
        name?: string
        created_by_id: string
        image?: string
      } = {
        members,
        created_by_id: createdBy,
        image: img,
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
    } catch (error) {
      console.log(error)
    }
  }
  return createNewChat
}
