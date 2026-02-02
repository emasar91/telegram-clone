import { vi } from "vitest"

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
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <div data-testid="user-button-mock" />,
  SignIn: () => <div data-testid="signin-mock" />,
  SignUp: () => <div data-testid="signup-mock" />,
}))
