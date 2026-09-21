import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { PasskeysCard } from "@/components/settings/passkeys-card"
import * as webauthnHelper from "@/lib/webauthn"
import * as simplewebauthn from "@simplewebauthn/browser"
import { toast } from "sonner"

const trpcMocks = vi.hoisted(() => ({
  listUserPasskeys: vi.fn(),
  generateRegistrationOptions: vi.fn(),
  verifyRegistration: vi.fn(),
  renamePasskey: vi.fn(),
  deletePasskey: vi.fn(),
  invalidate: vi.fn(),
}))

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      passkey: {
        listUserPasskeys: { invalidate: trpcMocks.invalidate },
      },
      organization: {
        getSecurityCenter: { invalidate: trpcMocks.invalidate },
      },
    }),
    passkey: {
      listUserPasskeys: {
        useQuery: () => trpcMocks.listUserPasskeys(),
      },
      generateRegistrationOptions: {
        useMutation: () => ({
          mutateAsync: trpcMocks.generateRegistrationOptions,
          isPending: false,
        }),
      },
      verifyRegistration: {
        useMutation: () => ({
          mutateAsync: trpcMocks.verifyRegistration,
          isPending: false,
        }),
      },
      renamePasskey: {
        useMutation: () => ({
          mutateAsync: trpcMocks.renamePasskey,
          isPending: false,
        }),
      },
      deletePasskey: {
        useMutation: () => ({
          mutateAsync: trpcMocks.deletePasskey,
          isPending: false,
        }),
      },
    },
  },
  getErrorMessage: (err: any) => err?.message || "An error occurred",
}))

vi.mock("@simplewebauthn/browser", () => ({
  startRegistration: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
})

describe("PasskeysCard Component - Security Settings", () => {
  const mockPasskeyList = [
    {
      id: "pk_1",
      deviceName: "MacBook Pro Touch ID",
      backedUp: true,
      createdAt: new Date("2026-03-14T10:00:00Z"),
      lastUsedAt: new Date("2026-03-18T12:00:00Z"),
    },
    {
      id: "pk_2",
      deviceName: "YubiKey 5C NFC",
      backedUp: false,
      createdAt: new Date("2026-03-15T14:00:00Z"),
      lastUsedAt: null,
    },
  ]

  it("7. renders list of passkeys from listUserPasskeys", () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    trpcMocks.listUserPasskeys.mockReturnValue({
      data: mockPasskeyList,
      isLoading: false,
      isError: false,
    })

    render(<PasskeysCard />)

    expect(screen.getByText("MacBook Pro Touch ID")).toBeInTheDocument()
    expect(screen.getByText("YubiKey 5C NFC")).toBeInTheDocument()
    expect(screen.getByText("Synced")).toBeInTheDocument()
    expect(screen.getByText("Device-bound")).toBeInTheDocument()
    expect(screen.getByText("Never used")).toBeInTheDocument()
  })

  it("8. 'Add passkey' button disabled when unsupported", () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(false)
    trpcMocks.listUserPasskeys.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })

    render(<PasskeysCard />)

    const addBtn = screen.getByRole("button", { name: /add passkey/i })
    expect(addBtn).toBeDisabled()
    expect(screen.getByText(/passkeys are not supported in this browser/i)).toBeInTheDocument()
  })

  it("9. successful registration refreshes the list and shows success toast", async () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    trpcMocks.listUserPasskeys.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })

    trpcMocks.generateRegistrationOptions.mockResolvedValue({ challenge: "reg_chal_1" })
    vi.mocked(simplewebauthn.startRegistration).mockResolvedValue({ id: "cred_new", rawId: "cred_new", response: {} as any, type: "public-key" })
    trpcMocks.verifyRegistration.mockResolvedValue({ id: "pk_new", deviceName: "My Laptop" })

    render(<PasskeysCard />)

    // Open Add Modal
    const addBtn = screen.getByRole("button", { name: /add passkey/i })
    fireEvent.click(addBtn)

    expect(screen.getByText("Register a New Passkey")).toBeInTheDocument()

    // Click Continue & Scan
    const submitBtn = screen.getByRole("button", { name: /continue & scan/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(trpcMocks.generateRegistrationOptions).toHaveBeenCalled()
      expect(simplewebauthn.startRegistration).toHaveBeenCalledWith({
        optionsJSON: { challenge: "reg_chal_1" },
      })
      expect(trpcMocks.verifyRegistration).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.objectContaining({ id: "cred_new" }),
        })
      )
      expect(toast.success).toHaveBeenCalledWith("Passkey registered successfully")
      expect(trpcMocks.invalidate).toHaveBeenCalled()
    })
  })

  it("10. CONFLICT error from backend shows the 'already registered' message", async () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    trpcMocks.listUserPasskeys.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })

    trpcMocks.generateRegistrationOptions.mockResolvedValue({ challenge: "reg_chal_1" })
    vi.mocked(simplewebauthn.startRegistration).mockResolvedValue({ id: "cred_dup", rawId: "cred_dup", response: {} as any, type: "public-key" })
    trpcMocks.verifyRegistration.mockRejectedValue(new Error("This passkey is already registered"))

    render(<PasskeysCard />)

    const addBtn = screen.getByRole("button", { name: /add passkey/i })
    fireEvent.click(addBtn)

    const submitBtn = screen.getByRole("button", { name: /continue & scan/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("This passkey is already registered.")
    })
  })

  it("11. delete confirmation modal calls deletePasskey with the right id", async () => {
    vi.spyOn(webauthnHelper, "isWebAuthnSupported").mockReturnValue(true)
    trpcMocks.listUserPasskeys.mockReturnValue({
      data: [mockPasskeyList[0]],
      isLoading: false,
      isError: false,
    })
    trpcMocks.deletePasskey.mockResolvedValue({ id: "pk_1" })

    render(<PasskeysCard />)

    // Find and click delete action button on row
    const deleteBtn = screen.getByTitle("Delete")
    fireEvent.click(deleteBtn)

    // Confirm dialog is open with the security warning
    expect(screen.getByText("Delete Passkey?")).toBeInTheDocument()
    expect(screen.getByText(/you won't be able to sign in with this passkey anymore/i)).toBeInTheDocument()

    // Confirm delete in dialog
    const confirmDeleteBtn = screen.getByRole("button", { name: /delete passkey/i })
    fireEvent.click(confirmDeleteBtn)

    await waitFor(() => {
      expect(trpcMocks.deletePasskey).toHaveBeenCalledWith({ id: "pk_1" })
      expect(toast.success).toHaveBeenCalledWith("Passkey deleted")
      expect(trpcMocks.invalidate).toHaveBeenCalled()
    })
  })
})
