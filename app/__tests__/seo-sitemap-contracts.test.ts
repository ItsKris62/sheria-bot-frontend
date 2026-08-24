/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-SITEMAP-002
 * Purpose: Automated contract test enforcing sitemap coverage and strict private route exclusion
 * Sprint: SEO Sprint 1
 */

import { afterEach, describe, expect, it } from "vitest"
import sitemap from "../sitemap"

describe("sitemap metadata contract", () => {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL
  const originalVercelEnv = process.env.VERCEL_ENV

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl
    process.env.VERCEL_ENV = originalVercelEnv
  })

  it("includes all durable public static routes", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://sheriabot.com"
    process.env.VERCEL_ENV = "production"

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    const expectedStaticRoutes = [
      "https://sheriabot.com",
      "https://sheriabot.com/pricing",
      "https://sheriabot.com/about",
      "https://sheriabot.com/contact",
      "https://sheriabot.com/solutions",
      "https://sheriabot.com/solutions/startups",
      "https://sheriabot.com/solutions/enterprise",
      "https://sheriabot.com/solutions/regulators",
      "https://sheriabot.com/security",
      "https://sheriabot.com/data-protection",
      "https://sheriabot.com/privacy",
      "https://sheriabot.com/terms",
      "https://sheriabot.com/careers",
      "https://sheriabot.com/blog",
      "https://sheriabot.com/knowledge-base",
    ]

    for (const expected of expectedStaticRoutes) {
      expect(urls).toContain(expected)
    }
  })

  it("strictly excludes private, auth, pilot, and unsubscribe routes", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://sheriabot.com"
    process.env.VERCEL_ENV = "production"

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    const forbiddenPatterns = [
      "/admin",
      "/dashboard",
      "/startup",
      "/enterprise",
      "/regulator",
      "/settings",
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/change-password",
      "/unsubscribe",
      "/pilot",
      "/api",
    ]

    for (const url of urls) {
      for (const pattern of forbiddenPatterns) {
        expect(url).not.toContain(`https://sheriabot.com${pattern}`)
      }
    }
  })
})
