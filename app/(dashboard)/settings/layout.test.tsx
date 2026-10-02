import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { UserRole } from "@/lib/auth-store"
import SettingsLayout, { settingsNav } from "./layout"

const mocks = vi.hoisted(() => ({
  pathname: "/settings/security",
  role: "STARTUP" as UserRole,
}))

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}))

vi.mock("@/lib/auth-store", () => ({
  useAuthStore: (selector: (state: { user: { role: UserRole } }) => unknown) =>
    selector({ user: { role: mocks.role } }),
}))

vi.mock("@/components/layout/dashboard-sidebar", () => ({
  DashboardSidebar: ({ userType }: { userType: string }) => <div data-testid="dashboard-sidebar">{userType}</div>,
}))

vi.mock("@/components/layout/admin-sidebar", () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar">admin</div>,
}))

vi.mock("@/components/layout/dashboard-header", () => ({
  DashboardHeader: ({ userType }: { userType: string }) => <div data-testid="dashboard-header">{userType}</div>,
}))

vi.mock("@/components/layout/dashboard-shell", () => ({
  DashboardShell: ({ sidebar, header, children }: { sidebar: React.ReactNode; header: React.ReactNode; children: React.ReactNode }) => (
    <div>{sidebar}{header}{children}</div>
  ),
}))

vi.mock("@/lib/sidebar-context", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => children,
}))

afterEach(() => {
  cleanup()
  mocks.pathname = "/settings/security"
  mocks.role = "STARTUP"
})

describe("SettingsLayout", () => {
  it.each([
    ["STARTUP", "startup", "dashboard-sidebar"],
    ["ENTERPRISE", "startup", "dashboard-sidebar"],
    ["REGULATOR", "regulator", "dashboard-sidebar"],
    ["ADMIN", "admin", "admin-sidebar"],
  ] as const)("uses the existing %s global shell", (role, shellType, sidebarTestId) => {
    mocks.role = role
    render(<SettingsLayout><p>Settings content</p></SettingsLayout>)

    expect(screen.getByTestId(sidebarTestId)).toHaveTextContent(shellType)
    expect(screen.getByTestId("dashboard-header")).toHaveTextContent(shellType)
  })

  it("preserves every settings route and marks the current section", () => {
    render(<SettingsLayout><p>Settings content</p></SettingsLayout>)
    const navigation = screen.getAllByRole("navigation", { name: "Settings navigation" })[0]

    for (const item of settingsNav) {
      expect(within(navigation).getByRole("link", { name: item.title })).toHaveAttribute("href", item.href)
    }
    expect(within(navigation).getByRole("link", { name: "Security" })).toHaveAttribute("aria-current", "page")
    expect(within(navigation).getByRole("link", { name: "Profile" })).not.toHaveAttribute("aria-current")
  })

  it("keeps a mobile settings navigation available", () => {
    render(<SettingsLayout><p>Settings content</p></SettingsLayout>)

    expect(screen.getAllByRole("navigation", { name: "Settings navigation" })).toHaveLength(2)
  })
})
