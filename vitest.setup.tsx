import "@testing-library/jest-dom"
import { vi } from "vitest"
import React from "react"

// --- DOM Polyfills ---
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// --- Next.js Mocks ---
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock("next/dynamic", () => ({
  default:
    () =>
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// --- Clerk Mock ---
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: "user_test_id",
      fullName: "Test User",
      imageUrl: "https://example.com/image.png",
    },
  }),
  useAuth: () => ({
    userId: "user_test_id",
    getToken: () => Promise.resolve("mock_token"),
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  UserButton: () => <div data-testid="user-button-mock" />,
  SignIn: () => <div data-testid="signin-mock" />,
  SignUp: () => <div data-testid="signup-mock" />,
}))

// --- Stream Chat Mock ---
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

// --- next-intl Mock ---
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "es",
}))
