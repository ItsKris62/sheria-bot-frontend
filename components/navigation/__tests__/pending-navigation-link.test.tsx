import React, { useReducer } from "react"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import SettingsLayout from "@/app/(dashboard)/settings/layout"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { DashboardSidebar, isDashboardRouteActive } from "@/components/layout/dashboard-sidebar"
import { PendingNavigationLink } from "@/components/navigation/pending-navigation-link"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"

const navigationState = vi.hoisted(() => ({
  pathname: "/startup",
  pendingHref: null as string | null,
  prefetches: [] as string[],
  featuresEnabled: true,
  listeners: new Set<() => void>(),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useRouter: () => ({
    prefetch: (href: string) => navigationState.prefetches.push(href),
  }),
}))

vi.mock("@/lib/plan-context", () => ({
  usePlan: () => ({ hasFeature: () => navigationState.featuresEnabled }),
}))

vi.mock("@/hooks/use-alert-notifications", () => ({
  useAlertNotifications: () => ({ alertUnreadCount: 0 }),
}))

vi.mock("@/lib/trpc", () => ({
  trpc: {
    adminSupport: {
      stats: {
        useQuery: () => ({ data: { open: 4 } }),
      },
    },
  },
}))

vi.mock("@/components/corpus-gap-report/report-missing-document-dialog", () => ({
  ReportMissingDocumentDialog: ({ open }: { open: boolean }) => open
    ? <div role="dialog">Missing document dialog</div>
    : null,
}))

vi.mock("next/link", async () => {
  const ReactModule = await import("react")
  const LinkStatusContext = ReactModule.createContext({ pending: false })

  type NavigateEvent = { preventDefault: () => void }
  type TestLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    onNavigate?: (event: NavigateEvent) => void
    prefetch?: boolean | "auto" | null
  }

  const setPendingHref = (href: string | null) => {
    navigationState.pendingHref = href
    navigationState.listeners.forEach((listener) => listener())
  }

  const TestLink = ReactModule.forwardRef<HTMLAnchorElement, TestLinkProps>(function TestLink(
    { children, href, onClick, onNavigate, prefetch, target, ...props },
    ref,
  ) {
    const [, rerender] = ReactModule.useReducer((count: number) => count + 1, 0)

    ReactModule.useEffect(() => {
      navigationState.listeners.add(rerender)
      return () => {
        navigationState.listeners.delete(rerender)
      }
    }, [])

    return (
      <LinkStatusContext.Provider value={{ pending: navigationState.pendingHref === href }}>
        <a
          {...props}
          ref={ref}
          href={href}
          target={target}
          data-prefetch={String(prefetch)}
          onClick={(event) => {
            onClick?.(event)
            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey ||
              (target && target !== "_self")
            ) {
              event.preventDefault()
              return
            }

            event.preventDefault()
            if (href === navigationState.pathname) {
              setPendingHref(null)
              return
            }

            let prevented = false
            onNavigate?.({ preventDefault: () => { prevented = true } })
            if (!prevented) setPendingHref(href)
          }}
        >
          {children}
        </a>
      </LinkStatusContext.Provider>
    )
  })

  return {
    default: TestLink,
    useLinkStatus: () => ReactModule.useContext(LinkStatusContext),
  }
})

function NavigationHarness({ collapsed = false }: { collapsed?: boolean }) {
  const links = [
    { title: "Dashboard", href: "/startup" },
    { title: "Gap Analysis", href: "/startup/gap-analysis" },
    { title: "Applications", href: "/startup/applications" },
  ]

  return (
    <nav aria-label="Test navigation">
      {links.map((item) => {
        const active = isDashboardRouteActive(navigationState.pathname, item.href)

        return (
          <PendingNavigationLink
            key={item.href}
            href={item.href}
            pendingLabel={item.title}
            aria-label={item.title}
            aria-current={active ? "page" : undefined}
            className={collapsed ? "relative h-10 w-10" : "relative"}
          >
            <span>{item.title}</span>
          </PendingNavigationLink>
        )
      })}
    </nav>
  )
}

function MobileSidebarHarness() {
  const { mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      <button type="button" onClick={() => setMobileOpen(true)}>Open navigation</button>
      <output aria-label="Mobile drawer state">{mobileOpen ? "open" : "closed"}</output>
      <DashboardSidebar userType="startup" />
    </>
  )
}

describe("PendingNavigationLink", () => {
  beforeEach(() => {
    navigationState.pathname = "/startup"
    navigationState.pendingHref = null
    navigationState.prefetches.length = 0
    navigationState.featuresEnabled = true
    navigationState.listeners.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it("keeps the committed route active while the destination is pending", () => {
    const view = render(<NavigationHarness />)
    const dashboard = screen.getByRole("link", { name: "Dashboard" })
    const gapAnalysis = screen.getByRole("link", { name: "Gap Analysis" })

    fireEvent.click(gapAnalysis)

    expect(dashboard).toHaveAttribute("aria-current", "page")
    expect(gapAnalysis).not.toHaveAttribute("aria-current")
    expect(within(gapAnalysis).getByText("Opening Gap Analysis")).toBeInTheDocument()
    expect(gapAnalysis.querySelector("[data-navigation-pending='true']")).toHaveAttribute("aria-busy", "true")

    navigationState.pathname = "/startup/gap-analysis"
    navigationState.pendingHref = null
    view.rerender(<NavigationHarness />)

    expect(screen.getByRole("link", { name: "Gap Analysis" })).toHaveAttribute("aria-current", "page")
    expect(document.querySelector("[data-navigation-pending='true']")).not.toBeInTheDocument()
  })

  it("does not leave pending feedback for same-route or modified clicks", () => {
    render(<NavigationHarness />)

    fireEvent.click(screen.getByRole("link", { name: "Dashboard" }))
    expect(document.querySelector("[data-navigation-pending='true']")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("link", { name: "Gap Analysis" }), { ctrlKey: true })
    expect(document.querySelector("[data-navigation-pending='true']")).not.toBeInTheDocument()
  })

  it("moves pending feedback to the latest rapid navigation", () => {
    render(<NavigationHarness />)
    const gapAnalysis = screen.getByRole("link", { name: "Gap Analysis" })
    const applications = screen.getByRole("link", { name: "Applications" })

    fireEvent.click(gapAnalysis)
    expect(gapAnalysis.querySelector("[data-navigation-pending='true']")).toBeInTheDocument()

    fireEvent.click(applications)
    expect(gapAnalysis.querySelector("[data-navigation-pending='true']")).not.toBeInTheDocument()
    expect(applications.querySelector("[data-navigation-pending='true']")).toBeInTheDocument()
  })

  it("keeps an icon-level pending indicator in collapsed navigation", () => {
    render(<NavigationHarness collapsed />)
    const gapAnalysis = screen.getByRole("link", { name: "Gap Analysis" })

    fireEvent.click(gapAnalysis)

    expect(gapAnalysis).toHaveClass("h-10", "w-10")
    expect(gapAnalysis.querySelector("[data-navigation-pending='true'] svg")).toBeInTheDocument()
  })

  it("closes the mobile drawer as soon as Next accepts navigation", () => {
    render(
      <SidebarProvider>
        <MobileSidebarHarness />
      </SidebarProvider>,
    )
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }))
    expect(screen.getByLabelText("Mobile drawer state")).toHaveTextContent("open")

    const gapAnalysisLinks = screen.getAllByRole("link", { name: "Gap Analysis" })
    fireEvent.click(gapAnalysisLinks.at(-1)!)

    expect(screen.getByLabelText("Mobile drawer state")).toHaveTextContent("closed")
  })

  it("opens the missing-document action without route-pending state", () => {
    render(
      <SidebarProvider>
        <MobileSidebarHarness />
      </SidebarProvider>,
    )
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }))

    const reportButtons = screen.getAllByRole("button", { name: "Report Missing Document" })
    fireEvent.click(reportButtons.at(-1)!)

    expect(screen.getByText("Missing document dialog")).toBeInTheDocument()
    expect(screen.getByLabelText("Mobile drawer state")).toHaveTextContent("closed")
    expect(document.querySelector("[data-navigation-pending='true']")).not.toBeInTheDocument()
  })

  it("keeps Settings mounted while Security transitions to Billing", () => {
    navigationState.pathname = "/settings/security"
    const view = render(<SettingsLayout><p>Settings content</p></SettingsLayout>)
    const workspace = document.querySelector("[data-settings-workspace='true']")
    const navigations = screen.getAllByRole("navigation", { name: "Settings navigation" })
    const desktopNavigation = navigations.at(-1)!
    const security = within(desktopNavigation).getByRole("link", { name: "Security" })
    const billing = within(desktopNavigation).getByRole("link", { name: "Billing" })

    fireEvent.click(billing)

    expect(security).toHaveAttribute("aria-current", "page")
    expect(billing).not.toHaveAttribute("aria-current")
    expect(billing.querySelector("[data-navigation-pending='true']")).toBeInTheDocument()

    navigationState.pathname = "/settings/billing"
    navigationState.pendingHref = null
    view.rerender(<SettingsLayout><p>Billing content</p></SettingsLayout>)

    expect(document.querySelector("[data-settings-workspace='true']")).toBe(workspace)
    expect(screen.getAllByRole("link", { name: "Billing" }).at(-1)).toHaveAttribute("aria-current", "page")
  })

  it("shows admin pending feedback without changing support data or width", () => {
    navigationState.pathname = "/admin"
    render(
      <SidebarProvider>
        <AdminSidebar />
      </SidebarProvider>,
    )
    const sidebar = screen.getByLabelText("Admin sidebar navigation")
    const users = screen.getByRole("link", { name: "User Management" })

    fireEvent.click(users)

    expect(sidebar).toHaveClass("w-64")
    expect(users.querySelector("[data-navigation-pending='true']")).toBeInTheDocument()
    expect(screen.getByText("4")).toBeInTheDocument()
  })

  it("prefetches an intent route once on hover or keyboard focus", () => {
    render(
      <PendingNavigationLink
        href="/startup/compliance-query"
        pendingLabel="Compliance Query"
        prefetchStrategy="intent"
      >
        Compliance Query
      </PendingNavigationLink>,
    )
    const link = screen.getByRole("link", { name: "Compliance Query" })

    fireEvent.mouseEnter(link)
    fireEvent.focus(link)
    fireEvent.mouseEnter(link)

    expect(navigationState.prefetches).toEqual(["/startup/compliance-query"])
    expect(link).toHaveAttribute("data-prefetch", "false")
    expect(document.querySelector("[data-navigation-pending='true']")).not.toBeInTheDocument()
  })

  it("does not prefetch locked routes or action-only items", () => {
    navigationState.featuresEnabled = false
    render(
      <SidebarProvider>
        <DashboardSidebar userType="startup" />
      </SidebarProvider>,
    )
    const gapAnalysis = screen.getAllByRole("link", { name: "Gap Analysis" })[0]
    const reportAction = screen.getAllByRole("button", { name: "Report Missing Document" })[0]

    fireEvent.mouseEnter(gapAnalysis)
    fireEvent.focus(gapAnalysis)
    fireEvent.mouseEnter(reportAction)
    fireEvent.focus(reportAction)

    expect(gapAnalysis).toHaveAttribute("data-prefetch", "false")
    expect(navigationState.prefetches).toEqual([])
  })

  it("prefetches Settings routes without navigating or loading data", () => {
    navigationState.pathname = "/settings/security"
    render(<SettingsLayout><p>Security content</p></SettingsLayout>)
    const billing = screen.getAllByRole("link", { name: "Billing" })[0]

    fireEvent.focus(billing)

    expect(navigationState.prefetches).toEqual(["/settings/billing"])
    expect(screen.getByText("Security content")).toBeInTheDocument()
    expect(document.querySelector("[data-navigation-pending='true']")).not.toBeInTheDocument()
  })

  it("keeps rare Admin routes out of automatic and manual prefetch", () => {
    navigationState.pathname = "/admin"
    render(
      <SidebarProvider>
        <AdminSidebar />
      </SidebarProvider>,
    )
    const users = screen.getByRole("link", { name: "User Management" })
    const aiConfiguration = screen.getByRole("link", { name: "AI Configuration" })

    fireEvent.mouseEnter(aiConfiguration)
    fireEvent.focus(aiConfiguration)
    expect(aiConfiguration).toHaveAttribute("data-prefetch", "false")
    expect(navigationState.prefetches).toEqual([])

    fireEvent.mouseEnter(users)
    expect(navigationState.prefetches).toEqual(["/admin/users"])
  })

  it("preserves pending navigation after a route was prefetched", () => {
    render(
      <PendingNavigationLink
        href="/startup/gap-analysis"
        pendingLabel="Gap Analysis"
        prefetchStrategy="intent"
      >
        Gap Analysis
      </PendingNavigationLink>,
    )
    const link = screen.getByRole("link", { name: "Gap Analysis" })

    fireEvent.mouseEnter(link)
    fireEvent.click(link)

    expect(navigationState.prefetches).toEqual(["/startup/gap-analysis"])
    expect(link.querySelector("[data-navigation-pending='true']")).toBeInTheDocument()
  })
})
