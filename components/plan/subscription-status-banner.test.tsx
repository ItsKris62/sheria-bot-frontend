import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"
import { SubscriptionStatusBanner } from "./subscription-status-banner"
import { usePlan } from "@/lib/plan-context"

vi.mock("@/lib/plan-context", () => ({
  usePlan: vi.fn(),
}))

const mockedUsePlan = vi.mocked(usePlan)

describe("SubscriptionStatusBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("routes past-due IntaSend users to billing instead of Stripe portal", () => {
    mockedUsePlan.mockReturnValue({
      plan: "STARTUP",
      isLoading: false,
      billing: {
        subscriptionStatus: "PAST_DUE",
        activePaymentProvider: "INTASEND",
        stripeEnabled: false,
        trialEndsAt: null,
        gracePeriodEndsAt: null,
      },
    } as any)

    render(<SubscriptionStatusBanner />)

    const link = screen.getByRole("link", { name: /pay renewal/i })
    expect(link).toHaveAttribute("href", "/settings/billing")
    expect(screen.queryByText(/update payment/i)).not.toBeInTheDocument()
  })

  it("routes expiring trial users to billing for M-Pesa setup", () => {
    mockedUsePlan.mockReturnValue({
      plan: "STARTUP",
      isLoading: false,
      billing: {
        subscriptionStatus: "TRIALING",
        activePaymentProvider: "INTASEND",
        stripeEnabled: false,
        trialEndsAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
        gracePeriodEndsAt: null,
      },
    } as any)

    render(<SubscriptionStatusBanner />)

    const link = screen.getByRole("link", { name: /add m-pesa/i })
    expect(link).toHaveAttribute("href", "/settings/billing")
  })
})
