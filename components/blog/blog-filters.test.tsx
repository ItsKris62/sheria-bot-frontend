import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { BlogFilters } from "./blog-filters"
import { resetBlogAnalyticsDedupForTests } from "@/lib/analytics/blog-events"
import { trackEvent } from "@/lib/analytics"

const navigationMocks = vi.hoisted(() => ({
  push: vi.fn(),
  params: "q=CBK+licensing&category=Regulatory+Updates&page=2",
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigationMocks.push }),
  useSearchParams: () => new URLSearchParams(navigationMocks.params),
}))

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  window.sessionStorage.clear()
  resetBlogAnalyticsDedupForTests()
  navigationMocks.params = "q=CBK+licensing&category=Regulatory+Updates&page=2"
})

describe("BlogFilters", () => {
  it("tracks search without sending the raw query text", () => {
    render(
      <BlogFilters
        resultCount={3}
        page={2}
        categories={[{ name: "Regulatory Updates", count: 3 }]}
        tags={[{ name: "CBK", count: 2 }]}
      />,
    )

    const calls = vi.mocked(trackEvent).mock.calls
    expect(calls.some(([event]) => event === "blog_search_performed")).toBe(true)
    expect(JSON.stringify(calls)).not.toContain("CBK licensing")
    expect(JSON.stringify(calls)).toContain('"queryLength":13')
  })

  it("resets page and preserves committed search when category changes", () => {
    render(
      <BlogFilters
        resultCount={3}
        page={2}
        categories={[{ name: "Data Protection", count: 1 }]}
        tags={[]}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /data protection/i }))
    expect(navigationMocks.push).toHaveBeenCalledWith("/blog?q=CBK+licensing&category=Data+Protection")
  })

  it("trims search, removes page, and removes empty query from the URL", () => {
    navigationMocks.params = "page=4"
    render(
      <BlogFilters
        resultCount={2}
        page={4}
        categories={[]}
        tags={[]}
      />,
    )

    fireEvent.change(screen.getByLabelText("Search SheriaBot articles"), {
      target: { value: "  AML   reporting  " },
    })
    fireEvent.click(screen.getByRole("button", { name: "Search" }))
    expect(navigationMocks.push).toHaveBeenCalledWith("/blog?q=AML+reporting")

    fireEvent.change(screen.getByLabelText("Search SheriaBot articles"), {
      target: { value: "   " },
    })
    fireEvent.click(screen.getByRole("button", { name: "Search" }))
    expect(navigationMocks.push).toHaveBeenLastCalledWith("/blog")
  })

  it("preserves category when toggling tags and exposes active state", () => {
    navigationMocks.params = "category=Regulatory+Updates&tag=CBK&page=3"
    render(
      <BlogFilters
        resultCount={4}
        page={3}
        categories={[{ name: "Regulatory Updates", count: 4 }]}
        tags={[{ name: "CBK", count: 2 }, { name: "AML", count: 1 }]}
      />,
    )

    expect(screen.getByRole("button", { name: "#CBK" })).toHaveAttribute("aria-current", "page")
    fireEvent.click(screen.getByRole("button", { name: "#AML" }))
    expect(navigationMocks.push).toHaveBeenCalledWith("/blog?category=Regulatory+Updates&tag=AML")
  })
})
