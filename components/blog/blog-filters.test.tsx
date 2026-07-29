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
})
