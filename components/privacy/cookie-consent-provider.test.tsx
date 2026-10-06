import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CookieConsentProvider } from "./cookie-consent-provider"
import { CookieSettingsButton } from "./cookie-settings-button"
import { COOKIE_CONSENT_STORAGE_KEY, readConsentRecord } from "@/lib/cookie-consent"

let pathname = "/pricing"

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}))

describe("CookieConsentProvider", () => {
  beforeEach(() => {
    localStorage.clear()
    pathname = "/pricing"
  })

  it("keeps the homepage hero unobstructed while retaining explicit cookie settings", async () => {
    const user = userEvent.setup()
    pathname = "/"

    render(
      <CookieConsentProvider>
        <main>Homepage</main>
        <CookieSettingsButton />
      </CookieConsentProvider>,
    )

    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Cookie Settings" }))
    expect(screen.getByRole("dialog", { name: "Cookie preferences" })).toBeInTheDocument()
  })

  it("shows balanced first-visit choices and persists rejection", async () => {
    const user = userEvent.setup()
    render(<CookieConsentProvider><main>Page</main></CookieConsentProvider>)

    expect(await screen.findByRole("region", { name: "Cookie consent" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Accept All" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Reject Non-Essential" })).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Reject Non-Essential" }))
    expect(readConsentRecord()).toMatchObject({ necessary: true, functional: false, analytics: false })
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument()
  })

  it("supports custom preferences", async () => {
    const user = userEvent.setup()
    render(<CookieConsentProvider><main>Page</main></CookieConsentProvider>)

    await user.click(await screen.findByRole("button", { name: "Manage Preferences" }))
    await user.click(screen.getByRole("switch", { name: "Functional preferences: Optional" }))
    await user.click(screen.getByRole("button", { name: "Save Preferences" }))

    expect(readConsentRecord()).toMatchObject({ functional: true, analytics: false })
    expect(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).not.toBeNull()
  })
})
