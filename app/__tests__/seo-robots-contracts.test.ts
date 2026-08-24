/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-ROBOTS-001
 * Purpose: Automated contract test enforcing robots.txt rules, preview lockdown, and disallow coverage
 * Sprint: SEO Sprint 1
 */

import { afterEach, describe, expect, it } from "vitest"
import robots from "../robots"

describe("robots metadata contracts", () => {
  const originalVercelEnv = process.env.VERCEL_ENV
  const originalDisableIndexing = process.env.NEXT_PUBLIC_DISABLE_INDEXING

  afterEach(() => {
    process.env.VERCEL_ENV = originalVercelEnv
    process.env.NEXT_PUBLIC_DISABLE_INDEXING = originalDisableIndexing
  })

  it("disallows all crawling for preview deployments", () => {
    process.env.VERCEL_ENV = "preview"
    process.env.NEXT_PUBLIC_DISABLE_INDEXING = undefined

    expect(robots().rules).toEqual({
      userAgent: "*",
      disallow: "/",
    })
  })

  it("disallows all crawling when NEXT_PUBLIC_DISABLE_INDEXING is true", () => {
    process.env.VERCEL_ENV = "production"
    process.env.NEXT_PUBLIC_DISABLE_INDEXING = "true"

    expect(robots().rules).toEqual({
      userAgent: "*",
      disallow: "/",
    })
  })

  it("keeps production public routes crawlable while private and auth routes are blocked", () => {
    process.env.VERCEL_ENV = "production"
    process.env.NEXT_PUBLIC_DISABLE_INDEXING = undefined

    const result = robots()
    expect(result.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
    })

    const expectedDisallowed = [
      "/admin",
      "/admin/",
      "/dashboard",
      "/dashboard/",
      "/startup",
      "/startup/",
      "/enterprise",
      "/enterprise/",
      "/regulator",
      "/regulator/",
      "/settings",
      "/settings/",
      "/support",
      "/support/",
      "/api",
      "/api/",
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/change-password",
      "/unsubscribe",
      "/unsubscribe/",
    ]

    for (const path of expectedDisallowed) {
      expect(result.rules).toHaveProperty("disallow", expect.arrayContaining([path]))
    }
  })
})
