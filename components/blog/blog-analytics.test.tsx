import React, { forwardRef } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"
import { BlogAnalyticsTracker } from "./blog-analytics-tracker"
import { InstrumentedBlogLink } from "./instrumented-blog-link"
import { resetBlogAnalyticsDedupForTests } from "@/lib/analytics/blog-events"
import { trackEvent } from "@/lib/analytics"

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

vi.mock("next/link", () => {
  const MockLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
    ({ href, children, ...props }, ref) => (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    ),
  )
  MockLink.displayName = "MockNextLink"

  return { default: MockLink }
})

class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()

  constructor(private callback: IntersectionObserverCallback) {
    observers.push(this)
  }

  trigger(entry: Partial<IntersectionObserverEntry>) {
    this.callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

let observers: MockIntersectionObserver[] = []
let visibilityState = "visible"
let documentHasFocus = true

beforeEach(() => {
  observers = []
  visibilityState = "visible"
  documentHasFocus = true
  vi.useFakeTimers()
  vi.clearAllMocks()
  window.sessionStorage.clear()
  resetBlogAnalyticsDedupForTests()
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: MockIntersectionObserver,
  })
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => visibilityState,
  })
  vi.spyOn(document, "hasFocus").mockImplementation(() => documentHasFocus)
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("InstrumentedBlogLink", () => {
  it("fires an impression once after visibility threshold and dwell", () => {
    render(
      <InstrumentedBlogLink href="/blog/cbk" postId="post-1" slug="cbk" placement="recent">
        Article
      </InstrumentedBlogLink>,
    )

    observers[0].trigger({ isIntersecting: true, intersectionRatio: 0.6 })
    vi.advanceTimersByTime(749)
    expect(trackEvent).not.toHaveBeenCalledWith("blog_article_impression", expect.anything())

    vi.advanceTimersByTime(1)
    expect(trackEvent).toHaveBeenCalledWith("blog_article_impression", expect.objectContaining({
      postId: "post-1",
      placement: "recent",
    }))

    observers[0].trigger({ isIntersecting: true, intersectionRatio: 0.8 })
    vi.advanceTimersByTime(1000)
    expect(vi.mocked(trackEvent).mock.calls.filter(([event]) => event === "blog_article_impression")).toHaveLength(1)
  })

  it("does not fire an impression below the visibility threshold", () => {
    render(
      <InstrumentedBlogLink href="/blog/cbk" postId="post-1" slug="cbk" placement="recent">
        Article
      </InstrumentedBlogLink>,
    )

    observers[0].trigger({ isIntersecting: true, intersectionRatio: 0.4 })
    vi.advanceTimersByTime(1000)
    expect(trackEvent).not.toHaveBeenCalledWith("blog_article_impression", expect.anything())
  })
})

describe("BlogAnalyticsTracker", () => {
  it("fires article open once for the same post across remounts", () => {
    const first = render(<BlogAnalyticsTracker postId="post-1" slug="cbk" readingTime={4} />)
    first.unmount()

    render(<BlogAnalyticsTracker postId="post-1" slug="cbk" readingTime={4} />)

    expect(vi.mocked(trackEvent).mock.calls.filter(([event]) => event === "blog_article_opened")).toHaveLength(1)
  })

  it("fires article open once and emits active engagement milestones", () => {
    render(
      <>
        <article data-blog-article-content>Body</article>
        <BlogAnalyticsTracker postId="post-1" slug="cbk" readingTime={4} />
      </>,
    )

    const article = document.querySelector("[data-blog-article-content]") as HTMLElement
    vi.spyOn(article, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 800,
      height: 1000,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
    observers[0].trigger({ isIntersecting: true, intersectionRatio: 0.5 })

    expect(trackEvent).toHaveBeenCalledWith("blog_article_opened", expect.objectContaining({ postId: "post-1" }))
    vi.advanceTimersByTime(10_000)
    expect(trackEvent).toHaveBeenCalledWith("blog_article_engagement_started", expect.objectContaining({ activeReadSeconds: 10 }))
    vi.advanceTimersByTime(20_000)
    expect(trackEvent).toHaveBeenCalledWith("blog_article_engaged", expect.objectContaining({ activeReadSeconds: 30 }))
    expect(trackEvent).toHaveBeenCalledWith("blog_article_completed", expect.objectContaining({ maxScrollDepthBucket: 75 }))
  })

  it("pauses active time while hidden", () => {
    render(
      <>
        <article data-blog-article-content>Body</article>
        <BlogAnalyticsTracker postId="post-1" slug="cbk" readingTime={4} />
      </>,
    )

    observers[0].trigger({ isIntersecting: true, intersectionRatio: 0.5 })
    visibilityState = "hidden"
    vi.advanceTimersByTime(30_000)
    expect(trackEvent).not.toHaveBeenCalledWith("blog_article_engaged", expect.anything())
  })

  it("pauses active time while unfocused", () => {
    render(
      <>
        <article data-blog-article-content>Body</article>
        <BlogAnalyticsTracker postId="post-1" slug="cbk" readingTime={4} />
      </>,
    )

    observers[0].trigger({ isIntersecting: true, intersectionRatio: 0.5 })
    documentHasFocus = false
    vi.advanceTimersByTime(30_000)
    expect(trackEvent).not.toHaveBeenCalledWith("blog_article_engaged", expect.anything())
  })

  it("requires both active time and scroll depth before completion", () => {
    render(
      <>
        <article data-blog-article-content>Body</article>
        <BlogAnalyticsTracker postId="post-1" slug="cbk" readingTime={4} />
      </>,
    )

    const article = document.querySelector("[data-blog-article-content]") as HTMLElement
    vi.spyOn(article, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 400,
      height: 2000,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
    observers[0].trigger({ isIntersecting: true, intersectionRatio: 0.5 })

    vi.advanceTimersByTime(30_000)

    expect(trackEvent).toHaveBeenCalledWith("blog_article_engaged", expect.objectContaining({ activeReadSeconds: 30 }))
    expect(trackEvent).not.toHaveBeenCalledWith("blog_article_completed", expect.anything())
  })
})
