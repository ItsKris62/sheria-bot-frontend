import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { isAdminRouteActive } from "@/components/layout/admin-sidebar"
import { isDashboardRouteActive } from "@/components/layout/dashboard-sidebar"
import {
  SidebarProvider,
  useCloseMobileSidebarOnNavigation,
  useSidebar,
} from "@/lib/sidebar-context"

function MobileStateHarness({ pathname }: { pathname: string }) {
  const { mobileOpen, setMobileOpen } = useSidebar()
  useCloseMobileSidebarOnNavigation(pathname)

  return (
    <button onClick={() => setMobileOpen(true)}>
      {mobileOpen ? "open" : "closed"}
    </button>
  )
}

describe("sidebar navigation behavior", () => {
  it("updates dashboard active states from committed pathname", () => {
    expect(isDashboardRouteActive("/startup", "/startup")).toBe(true)
    expect(isDashboardRouteActive("/startup/compliance-query", "/startup/compliance-query")).toBe(true)
    expect(isDashboardRouteActive("/settings/security", "/settings")).toBe(true)
    expect(isDashboardRouteActive("/dashboard/alerts/alert-1", "/dashboard/alerts")).toBe(true)
    expect(isDashboardRouteActive("/startup/gap-analysis", "/startup")).toBe(false)
  })

  it("updates admin active states without broad parent collisions", () => {
    expect(isAdminRouteActive("/admin", "/admin")).toBe(true)
    expect(isAdminRouteActive("/admin/users/user-1", "/admin/users")).toBe(true)
    expect(isAdminRouteActive("/admin/analytics/feedback", "/admin/analytics", true)).toBe(false)
  })

  it("closes the persistent mobile drawer after pathname changes", async () => {
    const view = render(
      <SidebarProvider>
        <MobileStateHarness pathname="/startup" />
      </SidebarProvider>,
    )
    fireEvent.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toHaveTextContent("open")

    view.rerender(
      <SidebarProvider>
        <MobileStateHarness pathname="/settings" />
      </SidebarProvider>,
    )

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("closed"))
  })
})
