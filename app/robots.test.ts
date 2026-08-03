import { afterEach, describe, expect, it } from "vitest"
import robots from "./robots"

describe("robots metadata", () => {
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

  it("keeps production public routes crawlable while private app routes are blocked", () => {
    process.env.VERCEL_ENV = "production"
    process.env.NEXT_PUBLIC_DISABLE_INDEXING = undefined

    expect(robots().rules).toMatchObject({
      userAgent: "*",
      allow: "/",
    })
    expect(robots().rules).toHaveProperty("disallow", expect.arrayContaining(["/admin", "/api"]))
  })
})
