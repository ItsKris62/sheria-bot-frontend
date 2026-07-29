import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  BLOG_ANALYTICS_EVENTS,
  getBlogReadingSessionId,
  normalizedSearchLength,
  resetBlogAnalyticsDedupForTests,
  safeSourceDomain,
  trackBlogEventOnce,
} from "./blog-events"
import { trackEvent } from "@/lib/analytics"

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

describe("Blog analytics events", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    resetBlogAnalyticsDedupForTests()
  })

  it("uses an ephemeral sessionStorage reading-session ID", () => {
    const first = getBlogReadingSessionId()
    const second = getBlogReadingSessionId()
    expect(first).toBeTruthy()
    expect(second).toBe(first)
  })

  it("deduplicates one-shot events", () => {
    expect(trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.articleOpened, "post-1", { postId: "post-1" })).toBe(true)
    expect(trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.articleOpened, "post-1", { postId: "post-1" })).toBe(false)
    expect(trackEvent).toHaveBeenCalledTimes(1)
  })

  it("normalises search length without exposing raw search text", () => {
    expect(normalizedSearchLength("  CBK   licensing query ")).toBe(19)
  })

  it("extracts only safe source hostnames", () => {
    expect(safeSourceDomain("https://www.centralbank.go.ke/path?token=secret")).toBe("centralbank.go.ke")
    expect(safeSourceDomain("javascript:alert(1)")).toBeUndefined()
  })
})
