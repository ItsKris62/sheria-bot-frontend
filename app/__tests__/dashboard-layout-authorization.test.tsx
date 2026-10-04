import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import StartupLayout from "@/app/(dashboard)/startup/layout"
import AdminLayout from "@/app/(dashboard)/admin/layout"
import RegulatorLayout from "@/app/(dashboard)/regulator/layout"
import SharedDashboardLayout from "@/app/(dashboard)/dashboard/layout"

vi.mock("@/components/auth-guard", () => ({
  AuthGuard: ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles?: string[] }>) => (
    <div data-testid="auth-guard" data-allowed-roles={allowedRoles?.join(",") ?? "authenticated"}>
      {children}
    </div>
  ),
}))

describe("dashboard branch authorization", () => {
  it.each([
    { Layout: StartupLayout, roles: "STARTUP,ENTERPRISE,ADMIN" },
    { Layout: AdminLayout, roles: "ADMIN" },
    { Layout: RegulatorLayout, roles: "REGULATOR,ADMIN" },
    { Layout: SharedDashboardLayout, roles: "STARTUP,ENTERPRISE,REGULATOR,ADMIN" },
  ])("preserves $roles route authorization", ({ Layout, roles }) => {
    render(<Layout><div>authorized content</div></Layout>)

    expect(screen.getByTestId("auth-guard")).toHaveAttribute("data-allowed-roles", roles)
    expect(screen.getByText("authorized content")).toBeInTheDocument()
  })
})
