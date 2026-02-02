import { test, expect } from "@playwright/test"

test.describe("Landing Page", () => {
  test("should load correctly", async ({ page }) => {
    // Increase timeout for initial load in dev mode
    test.slow()
    await page.goto("/", { waitUntil: "networkidle" })

    // Verify the Header title (Telegram Clon/Clone)
    const titleLink = page.getByRole("link", { name: /Telegram Clon/i })
    await expect(titleLink).toBeVisible({ timeout: 15000 })

    // Verify the subtitle
    await expect(
      page.getByText(/era de mensajer|era of messaging/i),
    ).toBeVisible()

    // Check for the Connect/Sign In button in Header
    const signInBtn = page.getByRole("button", { name: /Sesion|Sign In/i })
    if ((await signInBtn.count()) > 0) {
      await expect(signInBtn).toBeVisible()
    }
  })

  test("should render main feature elements", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })

    // Check for core UI sections
    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator('img[alt="Telegram Icon"]')).toBeVisible()

    // Check if Video cards are present
    const videos = page.locator("video")
    await expect(videos).toHaveCount(2)
  })
})
