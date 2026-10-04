import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AuthenticatedPortalShell } from "@/components/layout/authenticated-portal-shell"
import SettingsLayout from "@/app/(dashboard)/settings/layout"
import { useAuthStore, type UserRole } from "@/lib/auth-store"
import { useSidebar } from "@/lib/sidebar-context"

let pathname = "/startup"

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ prefetch: vi.fn() }),
}))

vi.mock("@/components/layout/dashboard-sidebar", () => ({
  DashboardSidebar: ({ userType }: { userType: string }) => (
    <aside data-testid={`${userType}-sidebar`}>{userType} sidebar</aside>
  ),
}))

vi.mock("@/components/layout/admin-sidebar", () => ({
  AdminSidebar: () => <aside data-testid="admin-sidebar">admin sidebar</aside>,
}))

vi.mock("@/components/layout/dashboard-header", () => ({
  DashboardHeader: ({ userType }: { userType: string }) => (
    <header data-testid={`${userType}-header`}>{userType} header</header>
  ),
}))

vi.mock("@/components/layout/dashboard-shell", () => ({
  DashboardShell: ({ sidebar, header, banners, children }: React.PropsWithChildren<{
    sidebar: React.ReactNode
    header: React.ReactNode
    banners?: React.ReactNode
  }>) => (
    <div data-testid="dashboard-shell">
      {sidebar}
      {header}
      <div data-testid="portal-banners">{banners}</div>
      <main>{children}</main>
    </div>
  ),
}))

vi.mock("@/components/jurisdiction/jurisdiction-prompt-banner", () => ({
  JurisdictionPromptBanner: () => <div>jurisdiction banner</div>,
}))
vi.mock("@/components/plan/subscription-status-banner", () => ({
  SubscriptionStatusBanner: () => <div>subscription banner</div>,
}))
vi.mock("@/components/trial/TrialStatusBanner", () => ({
  TrialStatusBanner: () => <div>trial status banner</div>,
}))
vi.mock("@/components/trial/TrialCtaBanner", () => ({
  TrialCtaBanner: () => <div>trial CTA banner</div>,
}))

function setRole(role: UserRole) {
  useAuthStore.setState({
    user: {
      id: `${role.toLowerCase()}-user`,
      email: `${role.toLowerCase()}@example.test`,
      name: role,
      role,
      organizationId: "org-a",
      emailVerified: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    accessToken: "token-a",
    isAuthenticated: true,
    isInitialized: true,
    isLoading: false,
  })
}

function SidebarStateProbe() {
  const { collapsed, setCollapsed } = useSidebar()
  return (
    <button data-testid="sidebar-state" onClick={() => setCollapsed(!collapsed)}>
      {collapsed ? "collapsed" : "expanded"}
    </button>
  )
}

describe("AuthenticatedPortalShell continuity", () => {
  beforeEach(() => {
    pathname = "/startup"
    localStorage.clear()
  })

  it.each([
    { role: "STARTUP" as const, workspace: "/startup", shell: "startup" },
    { role: "ENTERPRISE" as const, workspace: "/startup", shell: "startup" },
    { role: "REGULATOR" as const, workspace: "/regulator", shell: "regulator" },
    { role: "ADMIN" as const, workspace: "/admin", shell: "admin" },
  ])("keeps the $role shell mounted across workspace and settings", ({ role, workspace, shell }) => {
    setRole(role)
    pathname = workspace
    const view = render(
      <AuthenticatedPortalShell>
        <SidebarStateProbe />
        <div>workspace content</div>
      </AuthenticatedPortalShell>,
    )
    const shellNode = screen.getByTestId("dashboard-shell")
    const sidebarNode = screen.getByTestId(`${shell}-sidebar`)
    const headerNode = screen.getByTestId(`${shell}-header`)

    fireEvent.click(screen.getByTestId("sidebar-state"))
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed")

    pathname = "/settings/security"
    view.rerender(
      <AuthenticatedPortalShell>
        <SidebarStateProbe />
        <div>settings content</div>
      </AuthenticatedPortalShell>,
    )

    expect(screen.getByTestId("dashboard-shell")).toBe(shellNode)
    expect(screen.getByTestId(`${shell}-sidebar`)).toBe(sidebarNode)
    expect(screen.getByTestId(`${shell}-header`)).toBe(headerNode)
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed")

    pathname = workspace
    view.rerender(
      <AuthenticatedPortalShell>
        <SidebarStateProbe />
        <div>workspace content again</div>
      </AuthenticatedPortalShell>,
    )

    expect(screen.getByTestId(`${shell}-sidebar`)).toBe(sidebarNode)
    expect(screen.getByTestId(`${shell}-header`)).toBe(headerNode)
  })

  it.each([
    { role: "STARTUP" as const, workspace: "/startup", shell: "startup" },
    { role: "REGULATOR" as const, workspace: "/regulator", shell: "regulator" },
  ])("keeps the $role shell mounted on shared regulatory alerts", ({ role, workspace, shell }) => {
    setRole(role)
    pathname = workspace
    const view = render(
      <AuthenticatedPortalShell><div>workspace</div></AuthenticatedPortalShell>,
    )
    const sidebarNode = screen.getByTestId(`${shell}-sidebar`)
    const headerNode = screen.getByTestId(`${shell}-header`)

    pathname = "/dashboard/alerts"
    view.rerender(
      <AuthenticatedPortalShell><div>alerts</div></AuthenticatedPortalShell>,
    )

    expect(screen.getByTestId(`${shell}-sidebar`)).toBe(sidebarNode)
    expect(screen.getByTestId(`${shell}-header`)).toBe(headerNode)
    expect(screen.getByText("trial status banner")).toBeInTheDocument()
  })

  it("keeps settings navigation mounted across settings child routes", () => {
    pathname = "/settings/security"
    const view = render(<SettingsLayout><div>security content</div></SettingsLayout>)
    const navigation = screen.getAllByRole("navigation", { name: "Settings navigation" })[0]
    expect(screen.getAllByRole("link", { name: "Security" })[0]).toHaveAttribute("aria-current", "page")

    pathname = "/settings/billing"
    view.rerender(<SettingsLayout><div>billing content</div></SettingsLayout>)

    expect(screen.getAllByRole("navigation", { name: "Settings navigation" })[0]).toBe(navigation)
    expect(screen.getAllByRole("link", { name: "Billing" })[0]).toHaveAttribute("aria-current", "page")
  })

  it("leaves the intentional support shell outside global chrome", () => {
    setRole("STARTUP")
    pathname = "/support"
    render(<AuthenticatedPortalShell><div>support content</div></AuthenticatedPortalShell>)

    expect(screen.getByText("support content")).toBeInTheDocument()
    expect(screen.queryByTestId("dashboard-shell")).not.toBeInTheDocument()
  })
})
