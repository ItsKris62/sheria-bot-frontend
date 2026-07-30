import { afterEach, describe, expect, it } from "vitest"
import { getSiteUrl } from "./site-url"

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key]
  } else {
    process.env[key] = value
  }
}

describe("site URL resolution", () => {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL
  const originalVercelEnv = process.env.VERCEL_ENV
  const originalVercelUrl = process.env.VERCEL_URL

  afterEach(() => {
    restoreEnv("NEXT_PUBLIC_APP_URL", originalAppUrl)
    restoreEnv("VERCEL_ENV", originalVercelEnv)
    restoreEnv("VERCEL_URL", originalVercelUrl)
  })

  it("uses the configured app URL without a trailing slash", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://preview.example.test/"
    process.env.VERCEL_ENV = "preview"
    process.env.VERCEL_URL = "ignored.vercel.app"

    expect(getSiteUrl()).toBe("https://preview.example.test")
  })

  it("uses the Vercel preview host when no app URL is configured", () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    process.env.VERCEL_ENV = "preview"
    process.env.VERCEL_URL = "sheriabot-git-blog-uat.vercel.app"

    expect(getSiteUrl()).toBe("https://sheriabot-git-blog-uat.vercel.app")
  })

  it("falls back to the production host outside preview", () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    process.env.VERCEL_ENV = "production"
    process.env.VERCEL_URL = "sheriabot-git-blog-uat.vercel.app"

    expect(getSiteUrl()).toBe("https://sheriabot.com")
  })
})
