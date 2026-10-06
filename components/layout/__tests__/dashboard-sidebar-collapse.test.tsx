import { render, screen, fireEvent, cleanup, within } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import React from "react"
import { DashboardSidebar } from "../dashboard-sidebar"
import { SidebarProvider } from "@/lib/sidebar-context"

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  usePathname: () => "/startup",
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock plan context
vi.mock("@/lib/plan-context", () => ({
  usePlan: () => ({
    hasFeature: (feature: string) => feature !== "licenseManagement", // Mock licenseManagement as locked
  }),
}))

// Mock alert notifications
vi.mock("@/hooks/use-alert-notifications", () => ({
  useAlertNotifications: () => ({
    alertUnreadCount: 3,
  }),
}))

// Mock missing document dialog
vi.mock("@/components/corpus-gap-report/report-missing-document-dialog", () => ({
  ReportMissingDocumentDialog: () => null,
}))

describe("DashboardSidebar — Batch 1B Sidebar & Accessibility", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it("renders expanded state with visible labels and proper navigation items", () => {
    render(
      <SidebarProvider defaultCollapsed={false}>
        <DashboardSidebar userType="startup" />
      </SidebarProvider>
    )

    // Expanded desktop shows Dashboard title & links
    const dashboardLinks = screen.getAllByRole("link", { name: /Dashboard/i })
    expect(dashboardLinks.length).toBeGreaterThan(0)
    expect(screen.getByText("Compliance Query")).toBeInTheDocument()
    expect(screen.getByText("Checklists")).toBeInTheDocument()
    expect(screen.getByText("Calendar")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Support")).toBeInTheDocument()

    // Collapse button has aria-expanded=true
    const collapseBtn = screen.getByRole("button", { name: /Collapse sidebar/i })
    expect(collapseBtn).toBeInTheDocument()
    expect(collapseBtn).toHaveAttribute("aria-expanded", "true")

    const desktopSidebar = screen.getByRole("complementary", { name: "Sidebar navigation" })
    expect(desktopSidebar).toHaveClass("h-dvh", "max-h-dvh")
  })

  it("toggles collapse state and updates aria-expanded attribute", () => {
    render(
      <SidebarProvider defaultCollapsed={false}>
        <DashboardSidebar userType="startup" />
      </SidebarProvider>
    )

    const toggleBtn = screen.getByRole("button", { name: /Collapse sidebar/i })
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true")

    // Click toggle to collapse
    fireEvent.click(toggleBtn)

    // After click, button changes to expand sidebar and aria-expanded becomes false
    const expandBtn = screen.getByRole("button", { name: /Expand sidebar/i })
    expect(expandBtn).toBeInTheDocument()
    expect(expandBtn).toHaveAttribute("aria-expanded", "false")
  })

  it("renders locked feature icons and preserves route destinations", () => {
    render(
      <SidebarProvider defaultCollapsed={false}>
        <DashboardSidebar userType="startup" />
      </SidebarProvider>
    )

    const licensesLinks = screen.getAllByRole("link", { name: /Licenses/i })
    expect(licensesLinks[0]).toHaveAttribute("href", "/startup/licenses")

    const queryLinks = screen.getAllByRole("link", { name: /Compliance Query/i })
    expect(queryLinks[0]).toHaveAttribute("href", "/startup/compliance-query")
  })

  it("injects unread badge count into Regulatory Alerts nav item", () => {
    render(
      <SidebarProvider defaultCollapsed={false}>
        <DashboardSidebar userType="startup" />
      </SidebarProvider>
    )

    const desktopNav = screen.getByRole("navigation", { name: /Main Navigation/i })
    const alertsLink = within(desktopNav).getByRole("link", { name: "Regulatory Alerts" })
    expect(alertsLink).toHaveAttribute("href", "/dashboard/alerts")
    // When rendered with badge, a badge indicator or text is rendered
    expect(alertsLink.querySelector("span")).not.toBeNull()
  })







  it("provides accessible aria-label on navigation items for icon-only collapsed mode", () => {
    render(
      <SidebarProvider defaultCollapsed={true}>
        <DashboardSidebar userType="startup" />
      </SidebarProvider>
    )

    // All links maintain accessible names via aria-label
    expect(screen.getAllByRole("link", { name: "Dashboard" }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: "Compliance Query" }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: "Checklists" }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: "Settings" }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: "Support" }).length).toBeGreaterThan(0)
  })
})
