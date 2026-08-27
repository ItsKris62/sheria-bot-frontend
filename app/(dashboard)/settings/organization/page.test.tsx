import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import OrganizationSettingsPage from "./page"

const mocks = vi.hoisted(() => ({
  updateSettingsMutate: vi.fn(),
  getSettingsData: {
    id: "org-1",
    name: "Pilot Fintech",
    registrationNumber: "REG-1",
    industry: "Financial Services",
    website: "",
    address: "Nairobi",
    contactPerson: "Amina",
    contactPosition: "Compliance Lead",
    contactEmail: "compliance@example.test",
    contactPhone: "",
    homeJurisdictionCode: null as string | null,
    currentMemberRole: "OWNER",
    canManageOrganizationSettings: true,
  },
  invalidate: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock("@/lib/auth-store", () => ({
  useAuthStore: (selector: (state: { user: { role: string } }) => unknown) =>
    selector({ user: { role: "STARTUP" } }),
}))

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      organization: { getSettings: { invalidate: mocks.invalidate } },
      billing: { getPlanAndUsage: { invalidate: mocks.invalidate } },
      user: { getProfile: { invalidate: mocks.invalidate } },
    }),
    organization: {
      getSettings: {
        useQuery: () => ({ data: mocks.getSettingsData, isLoading: false }),
      },
      getSeatUsage: {
        useQuery: () => ({ data: null }),
      },
      getTeamOverview: {
        useQuery: () => ({ data: null }),
      },
      updateSettings: {
        useMutation: () => ({
          mutate: mocks.updateSettingsMutate,
          isPending: false,
        }),
      },
    },
  },
}))

describe("OrganizationSettingsPage jurisdiction onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getSettingsData = {
      ...mocks.getSettingsData,
      homeJurisdictionCode: null,
      currentMemberRole: "OWNER",
      canManageOrganizationSettings: true,
    }
  })

  it("lets an owner confirm a missing primary jurisdiction without offering Nigeria", () => {
    render(<OrganizationSettingsPage />)

    expect(
      screen.getByText("Confirm your organization's primary regulatory jurisdiction"),
    ).toBeInTheDocument()
    expect(screen.getByText("Nigeria")).toBeInTheDocument()
    expect(screen.queryByRole("radio", { name: /Nigeria/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("radio", { name: /Rwanda/i }))
    fireEvent.click(screen.getByRole("button", { name: /Confirm Jurisdiction/i }))

    expect(mocks.updateSettingsMutate).toHaveBeenCalledWith({
      homeJurisdictionCode: "RW",
      homeJurisdictionReason: "Owner/admin onboarding confirmation",
    })
  })

  it("shows members a recovery path without allowing mutation", () => {
    mocks.getSettingsData = {
      ...mocks.getSettingsData,
      currentMemberRole: "MEMBER",
      canManageOrganizationSettings: false,
    }

    render(<OrganizationSettingsPage />)

    expect(screen.getByText("Ask an organization owner or admin to confirm the jurisdiction.")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /Confirm Jurisdiction/i })).not.toBeInTheDocument()
  })
})
