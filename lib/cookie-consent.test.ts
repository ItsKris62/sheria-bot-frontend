import { beforeEach, describe, expect, it } from "vitest"
import {
  COOKIE_CONSENT_MAX_AGE_DAYS,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  createConsentRecord,
  hasConsent,
  readConsentRecord,
  revokeOptionalStorage,
  writeConsentRecord,
} from "./cookie-consent"

describe("versioned cookie consent", () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it("treats a fresh visitor as not consented", () => {
    expect(readConsentRecord()).toBeNull()
    expect(hasConsent("analytics")).toBe(false)
  })

  it("persists a versioned record with a stable 180-day expiry", () => {
    const now = new Date("2026-10-05T10:00:00.000Z")
    const record = createConsentRecord({ functional: true, analytics: false }, now)
    writeConsentRecord(record)

    expect(readConsentRecord()).toEqual(record)
    expect(record.version).toBe(COOKIE_CONSENT_VERSION)
    expect((Date.parse(record.expiresAt) - Date.parse(record.updatedAt)) / 86_400_000).toBe(COOKIE_CONSENT_MAX_AGE_DAYS)
    expect(hasConsent("functional")).toBe(true)
    expect(hasConsent("analytics")).toBe(false)
  })

  it("reprompts for an expired or wrong-version record", () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify({
      ...createConsentRecord({ functional: true, analytics: true }, new Date("2020-01-01T00:00:00.000Z")),
      version: "old-policy",
    }))
    expect(readConsentRecord()).toBeNull()
  })

  it("removes optional storage without deleting authentication cookies", () => {
    localStorage.setItem("sheria-recent-searches", "[]")
    localStorage.setItem("ph_example_posthog", "analytics")
    sessionStorage.setItem("sheriabot.blog.readingSessionId", "reading")
    document.cookie = "sidebar:state=true; path=/"
    document.cookie = "_ga=test; path=/"
    document.cookie = "sb-project-auth-token=auth-session; path=/"

    revokeOptionalStorage(createConsentRecord({ functional: false, analytics: false }))

    expect(localStorage.getItem("sheria-recent-searches")).toBeNull()
    expect(localStorage.getItem("ph_example_posthog")).toBeNull()
    expect(sessionStorage.getItem("sheriabot.blog.readingSessionId")).toBeNull()
    expect(document.cookie).toContain("sb-project-auth-token=auth-session")
    expect(document.cookie).not.toContain("sidebar:state")
    expect(document.cookie).not.toContain("_ga=")
  })
})
