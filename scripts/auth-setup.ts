import { chromium } from "@playwright/test"
import path from "path"
import fs from "fs"

async function setupAuth() {
  const userDataDir = path.resolve(__dirname, "../playwright-user-data")

  // Ensure the directory exists
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true })
  }

  console.log("Launching browser in persistent mode...")
  console.log(`User data directory: ${userDataDir}`)

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: "chrome", // Use Chrome to better handle Cloudflare
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = context.pages()[0] || (await context.newPage())

  console.log("Navigating to http://localhost:3000...")
  await page.goto("http://localhost:3000")

  console.log("Please log in manually in the opened browser window.")
  console.log(
    "Once you reach the Dashboard, the script will detect it and save your session.",
  )

  try {
    // Wait for the URL to contain '/dashboard' which indicates successful login
    await page.waitForURL("**/dashboard", { timeout: 0 })
    console.log("Successfully reached Dashboard! Saving session...")

    // Wait a couple of seconds to ensure everything is saved
    await page.waitForTimeout(3000)
  } catch (error) {
    console.error("An error occurred or the browser was closed:", error)
  } finally {
    await context.close()
    console.log(
      "Browser closed. Session should be saved in 'playwright-user-data'.",
    )
    process.exit(0)
  }
}

setupAuth().catch((err) => {
  console.error("Failed to setup auth:", err)
  process.exit(1)
})
