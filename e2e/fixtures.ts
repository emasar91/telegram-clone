import { test as base, chromium, type BrowserContext } from "@playwright/test"
import path from "path"
import fs from "fs"

export const test = base.extend<{
  persistentContext: BrowserContext
}>({
  persistentContext: async ({}, use) => {
    const userDataDir = path.resolve(__dirname, "../playwright-user-data")

    // Ensure the directory exists
    if (!fs.existsSync(userDataDir)) {
      throw new Error(
        `Persistent user data directory not found at ${userDataDir}. Please run 'npx playwright codegen --user-data-dir=playwright-user-data' first.`,
      )
    }

    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: process.env.CI ? true : false, // Hard to do MFA in headless unless already trusted
    })

    await use(context)
    await context.close()
  },

  // Override the default page to use the persistent context
  page: async ({ persistentContext }, use) => {
    const page =
      persistentContext.pages()[0] || (await persistentContext.newPage())
    await use(page)
  },
})

export { expect } from "@playwright/test"
