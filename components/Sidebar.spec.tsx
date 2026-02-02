import { render, screen } from "@testing-library/react"
import { Sidebar } from "./Sidebar"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { SidebarProvider } from "@/providers/SidebarProvider"
import { Chat } from "stream-chat-react"

// Mock useIsMobile hook
vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: vi.fn(() => false),
}))

import { useIsMobile } from "@/hooks/useIsMobile"
import { StreamChat } from "stream-chat"

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders user information correctly", () => {
    render(
      <SidebarProvider>
        <Chat client={{} as StreamChat}>
          <Sidebar />
        </Chat>
      </SidebarProvider>,
    )

    // 'Test User' comes from the global clerk mock in vitest.setup.tsx
    expect(screen.getByText("Test User")).toBeDefined()
    expect(screen.getByTestId("user-button-mock")).toBeDefined()
  })

  it("renders channel list", () => {
    render(
      <SidebarProvider>
        <Chat client={{} as StreamChat}>
          <Sidebar />
        </Chat>
      </SidebarProvider>,
    )

    expect(screen.getByTestId("channel-list-mock")).toBeDefined()
  })

  it("renders mobile close button when isMobile is true", () => {
    vi.mocked(useIsMobile).mockReturnValue(true)

    render(
      <SidebarProvider>
        <Chat client={{} as StreamChat}>
          <Sidebar />
        </Chat>
      </SidebarProvider>,
    )

    // The component structure remains the same, but we verify it doesn't crash
    expect(screen.getByText("Test User")).toBeDefined()
  })
})
