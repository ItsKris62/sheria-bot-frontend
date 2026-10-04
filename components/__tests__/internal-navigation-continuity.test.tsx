import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PageHeader } from "@/components/ui/dashboard-components"
import { UsageCard } from "@/components/usage/usage-card"
import { UpgradeBanner } from "@/components/plan/feature-gate"
import { TrialStatusBanner } from "@/components/trial/TrialStatusBanner"

const testState = vi.hoisted(() => ({
  navigations: [] as string[],
}))

vi.mock("next/link", async () => {
  const ReactModule = await import("react")

  return {
    default: ReactModule.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
      function TestLink({ href, onClick, ...props }, ref) {
        return (
          <a
            ref={ref}
            href={href}
            onClick={(event) => {
              event.preventDefault()
              testState.navigations.push(href)
              onClick?.(event)
            }}
            {...props}
          />
        )
      },
    ),
  }
})

vi.mock("@/lib/trpc", () => ({
  trpc: {
    usage: {
      current: {
        useQuery: () => ({
          data: {
            period: {
              start: "2026-10-01T00:00:00.000Z",
              end: "2026-10-31T23:59:59.999Z",
              daysRemaining: 28,
              daysTotal: 31,
            },
            planTier: "STARTUP",
            categories: [
              {
                key: "regulatory_intelligence",
                label: "Regulatory intelligence",
                current: 0,
                limit: 0,
                available: false,
                percentUsed: 0,
              },
            ],
          },
          isLoading: false,
          isError: false,
        }),
      },
    },
  },
}))

vi.mock("@/lib/plan-context", () => ({
  usePlan: () => ({
    plan: "FREE_TRIAL",
    planDisplayName: "Free Trial",
    isLoading: false,
    trial: {
      daysRemaining: 4,
      usage: {
        complianceQueries: 1,
        gapAnalyses: 1,
        checklists: 1,
        vaultUploads: 1,
      },
      limits: {
        complianceQueries: 5,
        gapAnalyses: 5,
        checklists: 5,
        vaultUploads: 5,
      },
    },
  }),
}))

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

describe("authenticated internal navigation continuity", () => {
  beforeEach(() => {
    testState.navigations.length = 0
  })

  afterEach(() => {
    cleanup()
  })

  it.each([
    {
      name: "usage card",
      renderComponent: () => render(<UsageCard />),
      linkName: "Upgrade",
    },
    {
      name: "feature gate",
      renderComponent: () => render(<UpgradeBanner compact />),
      linkName: "Upgrade",
    },
    {
      name: "trial status banner",
      renderComponent: () => render(<TrialStatusBanner />),
      linkName: "Upgrade",
    },
  ])("uses client navigation from the $name billing CTA", ({ renderComponent, linkName }) => {
    renderComponent()

    fireEvent.click(screen.getByRole("link", { name: linkName }))

    expect(testState.navigations).toEqual(["/settings/billing"])
  })

  it("uses client navigation for internal breadcrumbs", () => {
    render(
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: "Dashboard", href: "/startup" }, { label: "Settings" }]}
      />,
    )

    fireEvent.click(screen.getByRole("link", { name: "Dashboard" }))

    expect(testState.navigations).toEqual(["/startup"])
  })

  it("preserves the feature gate pricing handoff in a separate tab", () => {
    render(<UpgradeBanner />)

    expect(screen.getByRole("link", { name: "View Plans" })).toHaveAttribute("target", "_blank")
    expect(screen.getByRole("link", { name: "View Plans" })).toHaveAttribute("rel", "noopener noreferrer")
  })
})
