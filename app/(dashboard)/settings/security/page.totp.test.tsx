import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  confirmTotpSetup: vi.fn(),
  disableTotp: vi.fn(),
  refreshStatus: vi.fn(),
  resetSetup: vi.fn(),
  setupTotp: vi.fn(),
  logout: vi.fn(),
  state: {} as Record<string, unknown>,
}))

vi.mock("next/dynamic", () => ({
  default: () => ({ value }: { value: string }) => <div data-testid="totp-qr">{value}</div>,
}))

vi.mock("@/hooks/use-user", () => ({
  useTotp: () => mocks.state,
  useUserActions: vi.fn(),
  useSessions: vi.fn(),
}))

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ logout: mocks.logout }),
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

import { TwoFactorCard } from "./page"

function setStatus(enabled: boolean) {
  mocks.state = {
    totpEnabled: enabled,
    isLoadingStatus: false,
    isStatusError: false,
    refreshStatus: mocks.refreshStatus,
    issuer: "SheriaBot",
    accountEmail: "user@example.com",
    accountLabel: "SheriaBot:user@example.com",
    recoveryCodesAvailable: enabled,
    setupTotp: mocks.setupTotp,
    isSettingUp: false,
    setupData: {
      secret: "TEST_KEY_NOT_A_REAL_SECRET",
      otpauth: "otpauth://totp/SheriaBot:user%40example.com?secret=REDACTED&issuer=SheriaBot",
    },
    setupError: null,
    resetSetup: mocks.resetSetup,
    confirmTotpSetup: mocks.confirmTotpSetup,
    isConfirming: false,
    confirmError: null,
    disableTotp: mocks.disableTotp,
    isDisabling: false,
    disableError: null,
  }
}

describe("Authenticator App security card", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setStatus(false)
    mocks.setupTotp.mockResolvedValue(mocks.state.setupData)
    mocks.confirmTotpSetup.mockImplementation(async () => {
      setStatus(true)
      return { success: true, backupCodes: [] }
    })
  })

  it("renders an existing authoritative enabled account without an Enable action", () => {
    setStatus(true)
    render(<TwoFactorCard />)

    expect(screen.getAllByText("Enabled").length).toBeGreaterThan(0)
    expect(screen.getByText("user@example.com")).toBeInTheDocument()
    expect(screen.getByText("SheriaBot")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Enable" })).not.toBeInTheDocument()
  })

  it("renders the authoritative disabled state", () => {
    render(<TwoFactorCard />)

    expect(screen.getAllByText("Not enabled").length).toBeGreaterThan(0)
    expect(screen.getByRole("button", { name: "Enable" })).toBeInTheDocument()
  })

  it("shows Enabled only after verification resolves and refreshed state is available", async () => {
    const testCode = Array.from({ length: 6 }, () => "1").join("")
    render(<TwoFactorCard />)

    fireEvent.click(screen.getByRole("button", { name: "Enable" }))
    expect(await screen.findByText("Set up Authenticator App")).toBeInTheDocument()
    expect(screen.getByText("SheriaBot")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Enter the 6-digit code from your app"), {
      target: { value: testCode },
    })
    fireEvent.click(screen.getByRole("button", { name: "Confirm & Enable" }))

    await waitFor(() => {
      expect(mocks.confirmTotpSetup).toHaveBeenCalledWith({ code: testCode })
      expect(screen.queryByRole("button", { name: "Enable" })).not.toBeInTheDocument()
      expect(screen.getAllByText("Enabled").length).toBeGreaterThan(0)
    })
  })

  it("does not render Enable when authoritative status cannot be confirmed", () => {
    mocks.state = { ...mocks.state, isStatusError: true }
    render(<TwoFactorCard />)

    expect(screen.getByText(/could not securely confirm/i)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Enable" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument()
  })

  it("keeps an enabled user in the disable dialog after a recoverable proof failure", async () => {
    const message = "Unable to verify your credentials. Check your password and authentication code and try again."
    setStatus(true)
    mocks.disableTotp.mockImplementation(async () => {
      mocks.state = { ...mocks.state, disableError: message }
      throw new Error(message)
    })
    const view = render(<TwoFactorCard />)

    fireEvent.click(screen.getByRole("button", { name: "Disable" }))
    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "wrong-password" } })
    fireEvent.change(screen.getByLabelText("Authenticator Code"), { target: { value: "123456" } })
    fireEvent.click(screen.getByRole("button", { name: "Disable 2FA" }))

    await waitFor(() => expect(mocks.disableTotp).toHaveBeenCalledTimes(1))
    view.rerender(<TwoFactorCard />)

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(message)
    expect(screen.getByLabelText("Current Password")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByLabelText("Authenticator Code")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getAllByText("Enabled").length).toBeGreaterThan(0)
    expect(mocks.logout).not.toHaveBeenCalled()
  })
})
