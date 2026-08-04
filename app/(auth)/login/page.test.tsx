import type React from "react"
import { render, screen } from "@testing-library/react"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import LoginPage from "./page"

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
}))

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    login: mocks.login,
    isLoginLoading: false,
    loginError: null,
  }),
}))

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver = ResizeObserverMock
})

beforeEach(() => {
  vi.clearAllMocks()
  window.sessionStorage.clear()
  window.history.replaceState(null, "", "/login")
})

describe("LoginPage", () => {
  it("renders the welcome title as the only page-level heading", () => {
    render(<LoginPage />)

    expect(screen.getByRole("heading", { level: 1, name: "Welcome back" })).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  })
})
