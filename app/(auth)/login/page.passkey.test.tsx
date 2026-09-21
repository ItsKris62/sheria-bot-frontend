import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import LoginPage from "./page"
import * as webauthnHelper from "@/lib/webauthn"

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
  verifyTotpLogin: vi.fn(),
  loginWithPasskey: vi.fn(),
}))

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    login: authMocks.login,
    isLoginLoading: false,
    loginError: null,
    verifyTotpLogin: authMocks.verifyTotpLogin,
    isVerifyTotpLoading: false,
    verifyTotpError: null,
    loginWithPasskey: authMocks.loginWithPasskey,
    isPasskeyLoading: false,
    passkeyError: null,
  }),
}))

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverMock
})

beforeEach(() => {
  vi.clearAllMocks()
  window.sessionStorage.clear()
  window.history.replaceState(null, "", "/login")
})

describe("LoginPage - Passkey / WebAuthn Integration", () => {
  it("1. renders 'Sign in with Passkey' when isWebAuthnSupported() returns true", () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    vi.spyOn(webauthnHelper, "isConditionalMediationAvailable").mockResolvedValue(false)

    render(<LoginPage />)

    expect(screen.getByRole("button", { name: /sign in with passkey/i })).toBeInTheDocument()
  })

  it("2. does not render the button when unsupported", () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(false)

    render(<LoginPage />)

    expect(screen.queryByRole("button", { name: /sign in with passkey/i })).not.toBeInTheDocument()
  })

  it("3. clicking calls loginWithPasskey (triggering generateAuthenticationOptions, startAuthentication, verifyAuthentication)", async () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    vi.spyOn(webauthnHelper, "isConditionalMediationAvailable").mockResolvedValue(false)
    authMocks.loginWithPasskey.mockResolvedValue({ success: true })

    render(<LoginPage />)

    const passkeyBtn = screen.getByRole("button", { name: /sign in with passkey/i })
    fireEvent.click(passkeyBtn)

    await waitFor(() => {
      expect(authMocks.loginWithPasskey).toHaveBeenCalledWith({ useBrowserAutofill: false })
    })
  })

  it("4. NotAllowedError from ceremony does not surface an error message", async () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    vi.spyOn(webauthnHelper, "isConditionalMediationAvailable").mockResolvedValue(false)

    const notAllowedErr = new Error("The operation either timed out or was not allowed.")
    notAllowedErr.name = "NotAllowedError"
    authMocks.loginWithPasskey.mockRejectedValue(notAllowedErr)

    render(<LoginPage />)

    const passkeyBtn = screen.getByRole("button", { name: /sign in with passkey/i })
    fireEvent.click(passkeyBtn)

    await waitFor(() => {
      expect(authMocks.loginWithPasskey).toHaveBeenCalled()
    })

    // Confirm no error banner rendered
    expect(screen.queryByText(/cancelled/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/failed/i)).not.toBeInTheDocument()
  })

  it("5. backend PASSKEY_RATE_LIMITED renders the rate-limit message", async () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    vi.spyOn(webauthnHelper, "isConditionalMediationAvailable").mockResolvedValue(false)

    authMocks.loginWithPasskey.mockRejectedValue(new Error("PASSKEY_RATE_LIMITED"))

    render(<LoginPage />)

    const passkeyBtn = screen.getByRole("button", { name: /sign in with passkey/i })
    fireEvent.click(passkeyBtn)

    await waitFor(() => {
      expect(screen.getByText(/too many passkey attempts\. please wait a few minutes\./i)).toBeInTheDocument()
    })
  })

  it("6. backend UNAUTHORIZED (expired) renders timeout message and allows retry", async () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    vi.spyOn(webauthnHelper, "isConditionalMediationAvailable").mockResolvedValue(false)

    authMocks.loginWithPasskey.mockRejectedValue(new Error("Passkey authentication expired"))

    render(<LoginPage />)

    const passkeyBtn = screen.getByRole("button", { name: /sign in with passkey/i })
    fireEvent.click(passkeyBtn)

    await waitFor(() => {
      expect(screen.getByText(/passkey session timed out\. please try again\./i)).toBeInTheDocument()
    })

    // Retry should be possible by clicking button again
    authMocks.loginWithPasskey.mockResolvedValueOnce({ success: true })
    fireEvent.click(passkeyBtn)

    await waitFor(() => {
      expect(authMocks.loginWithPasskey).toHaveBeenCalledTimes(2)
    })
  })
})
