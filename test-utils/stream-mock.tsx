import { vi } from "vitest"

vi.mock("stream-chat-react", () => ({
  Chat: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chat-mock">{children}</div>
  ),
  ChannelList: () => <div data-testid="channel-list-mock" />,
  Channel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="channel-mock">{children}</div>
  ),
  Window: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="window-mock">{children}</div>
  ),
  ChannelHeader: () => <div data-testid="channel-header-mock" />,
  MessageList: () => <div data-testid="message-list-mock" />,
  MessageInput: () => <div data-testid="message-input-mock" />,
  Thread: () => <div data-testid="thread-mock" />,
  useChatContext: () => ({
    client: {
      user: { id: "test_user_id", name: "Test User" },
    },
  }),
}))

vi.mock("stream-chat", () => ({
  StreamChat: {
    getInstance: () => ({
      connectUser: vi.fn(),
      disconnectUser: vi.fn(),
    }),
  },
}))
