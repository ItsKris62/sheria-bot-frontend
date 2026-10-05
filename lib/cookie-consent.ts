export const COOKIE_CONSENT_STORAGE_KEY = "sheriabot:cookie-consent"
export const LEGACY_ANALYTICS_CONSENT_KEY = "sheriabot:cookie_consent:analytics"
export const COOKIE_CONSENT_VERSION = "2026-10-05"
export const COOKIE_CONSENT_MAX_AGE_DAYS = 180

export type ConsentCategory = "functional" | "analytics"

export interface CookieConsentRecord {
  version: typeof COOKIE_CONSENT_VERSION
  necessary: true
  functional: boolean
  analytics: boolean
  updatedAt: string
  expiresAt: string
}

function isValidConsentRecord(value: unknown): value is CookieConsentRecord {
  if (!value || typeof value !== "object") return false
  const record = value as Partial<CookieConsentRecord>
  return (
    record.version === COOKIE_CONSENT_VERSION &&
    record.necessary === true &&
    typeof record.functional === "boolean" &&
    typeof record.analytics === "boolean" &&
    typeof record.updatedAt === "string" &&
    typeof record.expiresAt === "string" &&
    Number.isFinite(Date.parse(record.updatedAt)) &&
    Number.isFinite(Date.parse(record.expiresAt)) &&
    Date.parse(record.expiresAt) > Date.now()
  )
}

export function createConsentRecord(
  preferences: Pick<CookieConsentRecord, "functional" | "analytics">,
  now = new Date(),
): CookieConsentRecord {
  const expiresAt = new Date(now)
  expiresAt.setUTCDate(expiresAt.getUTCDate() + COOKIE_CONSENT_MAX_AGE_DAYS)

  return {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    functional: preferences.functional,
    analytics: preferences.analytics,
    updatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
}

export function readConsentRecord(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      return isValidConsentRecord(parsed) ? parsed : null
    }

    // Preserve the intent of the narrow legacy analytics opt-out until the
    // provider migrates it to the versioned record.
    if (window.localStorage.getItem(LEGACY_ANALYTICS_CONSENT_KEY) === "denied") {
      return createConsentRecord({ functional: false, analytics: false })
    }
  } catch {
    // Storage can be unavailable in hardened/private browsing contexts.
  }

  return null
}

export function writeConsentRecord(record: CookieConsentRecord): void {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
  window.localStorage.removeItem(LEGACY_ANALYTICS_CONSENT_KEY)
}

export function hasConsent(category: ConsentCategory): boolean {
  return readConsentRecord()?.[category] === true
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export function revokeOptionalStorage(record: CookieConsentRecord): void {
  if (typeof window === "undefined") return

  if (!record.functional) {
    const functionalKeys = [
      "sheriabot_sidebar_collapsed",
      "sheria-recent-searches",
      "sheriabot:compliance-query:selected-jurisdiction",
      "admin-alert-draft",
    ]
    functionalKeys.forEach((key) => window.localStorage.removeItem(key))
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith("sheriabot_passkey_nudge_dismissed_"))
      .forEach((key) => window.localStorage.removeItem(key))
    deleteCookie("sidebar:state")
  }

  if (!record.analytics) {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith("ph_") || key.startsWith("sheriabot:analytics:"))
      .forEach((key) => window.localStorage.removeItem(key))
    window.sessionStorage.removeItem("sheriabot.blog.readingSessionId")

    document.cookie
      .split(";")
      .map((part) => part.split("=")[0]?.trim())
      .filter((name): name is string => Boolean(name))
      .filter((name) => name === "_ga" || name === "_gid" || name === "_gat" || name.startsWith("_ga_") || name.startsWith("ph_"))
      .forEach(deleteCookie)
  }
}
