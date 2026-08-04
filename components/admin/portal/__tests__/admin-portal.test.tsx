import { useEffect } from "react"
import type { ReactNode } from "react"
import { render, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Activity, Plus, Search, Users } from "lucide-react"
import {
  AdminDataPanel,
  AdminEmptyState,
  AdminErrorState,
  AdminFilterBar,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from "../index"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminSidebar, adminNav } from "@/components/layout/admin-sidebar"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/users",
}))

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} className={props.className} />
  ),
}))

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div role="dialog" className={className}>{children}</div>
  ),
  SheetTitle: ({ children, className }: { children: ReactNode; className?: string }) => (
    <h2 className={className}>{children}</h2>
  ),
}))

vi.mock("@/lib/trpc", () => ({
  trpc: {
    adminSupport: {
      stats: {
        useQuery: () => ({ data: { open: 3 } }),
      },
    },
  },
}))

function OpenMobileNav() {
  const { setMobileOpen } = useSidebar()

  useEffect(() => {
    setMobileOpen(true)
  }, [setMobileOpen])

  return null
}

describe("Admin portal presentation components", () => {
  it("renders one page-level h1 and an accessible primary action", () => {
    render(
      <AdminPageHeader
        title="User Management"
        description="Manage platform users."
        icon={Users}
        action={
          <Button>
            <Plus aria-hidden="true" />
            Add User
          </Button>
        }
      />
    )

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("heading", { level: 1, name: "User Management" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument()
    expect(screen.getByText("Admin")).toBeInTheDocument()
  })

  it("renders status text and loading, empty, error, and populated states without snapshots", () => {
    const { rerender } = render(<AdminStatCard label="System Health" value="Healthy" icon={Activity} status="success" badge="Live" />)

    expect(screen.getByText("System Health")).toBeInTheDocument()
    expect(screen.getByText("Healthy")).toBeInTheDocument()
    expect(screen.getByText("Live")).toBeInTheDocument()

    rerender(<AdminLoadingState rows={2} />)
    expect(screen.getByLabelText("Loading admin data").children).toHaveLength(2)

    rerender(<AdminEmptyState title="No users match the current filters" description="Adjust the search or filters." />)
    expect(screen.getByText("No users match the current filters")).toBeInTheDocument()

    rerender(<AdminErrorState title="We could not load audit events right now." description="Try again shortly." />)
    expect(screen.getByRole("alert")).toHaveTextContent("We could not load audit events right now.")
  })

  it("keeps filter search labelled and table shell horizontally contained", () => {
    render(
      <AdminDataPanel title="All Users" description="20 users">
        <AdminFilterBar>
          <label htmlFor="admin-test-search" className="sr-only">Search users</label>
          <Input id="admin-test-search" placeholder="Search users..." />
        </AdminFilterBar>
        <AdminTableShell data-testid="table-shell">
          <table>
            <thead>
              <tr>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>avery.long.sanitized.admin.operator.identifier@example.invalid</td>
              </tr>
            </tbody>
          </table>
        </AdminTableShell>
      </AdminDataPanel>
    )

    expect(screen.getByLabelText("Search users")).toBeInTheDocument()
    expect(screen.getByTestId("table-shell")).toHaveClass("overflow-x-auto")
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument()
    expect(screen.getByText("avery.long.sanitized.admin.operator.identifier@example.invalid")).toBeInTheDocument()
  })

  it("keeps admin sidebar active state and mobile navigation accessible", async () => {
    render(
      <SidebarProvider>
        <OpenMobileNav />
        <AdminSidebar />
      </SidebarProvider>
    )

    const desktopNav = screen.getAllByRole("navigation")[0]
    expect(within(desktopNav).getByRole("link", { name: "User Management" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "Collapse admin sidebar" })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("Admin Navigation"))
  })

  it("does not introduce functional emoji into admin navigation labels", () => {
    const labels = adminNav.flatMap((group) => [group.title, ...group.items.map((item) => item.title)]).join(" ")
    expect(labels).not.toMatch(/\p{Extended_Pictographic}/u)
  })
})
