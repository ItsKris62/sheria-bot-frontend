import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import SettingsLayout, { settingsNav } from "./layout"

const mocks = vi.hoisted(() => ({
  pathname: "/settings/security",
}))

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ prefetch: vi.fn() }),
}))

afterEach(() => {
  cleanup()
  mocks.pathname = "/settings/security"
})

describe("SettingsLayout", () => {
  it("renders only settings-local content inside the persistent global shell", () => {
    render(<SettingsLayout><p>Settings content</p></SettingsLayout>)

    expect(screen.getByText("Settings content")).toBeInTheDocument()
    expect(document.querySelector("[data-settings-workspace='true']")).toBeInTheDocument()
    expect(screen.queryByTestId("dashboard-sidebar")).not.toBeInTheDocument()
    expect(screen.queryByTestId("admin-sidebar")).not.toBeInTheDocument()
    expect(screen.queryByTestId("dashboard-header")).not.toBeInTheDocument()
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
