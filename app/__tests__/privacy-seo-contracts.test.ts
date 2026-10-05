import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { LEGAL_REVISIONS } from "@/lib/legal-revisions"

const root = resolve(__dirname, "../..")
const source = (path: string) => readFileSync(resolve(root, path), "utf8")

describe("privacy and AI-discoverability contracts", () => {
  it("keeps legal revision dates explicit and stable", () => {
    expect(LEGAL_REVISIONS.privacy.updated).toBe("2026-10-05")
    expect(LEGAL_REVISIONS["cookie-policy"].updated).toBe("2026-10-05")
    expect(source("lib/legal-revisions.ts")).not.toContain("new Date()")
  })

  it("publishes a public llms.txt with only production public URLs", () => {
    const llms = source("public/llms.txt")
    expect(llms).toMatch(/^# SheriaBot/m)
    expect(llms).toContain("## Legal and Privacy")
    expect(llms).toContain("https://sheriabot.com/cookie-policy")
    const urls = [...llms.matchAll(/https:\/\/[^)\s]+/g)].map((match) => match[0])
    expect(urls.every((url) => new URL(url).origin === "https://sheriabot.com")).toBe(true)
    for (const url of urls) {
      expect(new URL(url).pathname).not.toMatch(/^\/(admin|startup|settings|api)(\/|$)/)
    }
  })

  it("keeps robots, sitemap, llms, cookie policy, and Kenya content public in middleware", () => {
    const middleware = source("middleware.ts")
    for (const route of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/cookie-policy", "/kenya"]) {
      expect(middleware).toContain(`'${route}'`)
    }
  })

  it("advertises llms.txt with the v2 describedby relation", () => {
    expect(source("app/layout.tsx")).toContain('<link rel="describedby" href="/llms.txt" />')
  })
})
