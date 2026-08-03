"use client"

import { useEffect, useRef } from "react"
import {
  BLOG_ANALYTICS_EVENTS,
  getBlogReadingSessionId,
  inferBlogReferrerType,
  trackBlogEventOnce,
} from "@/lib/analytics/blog-events"

interface BlogAnalyticsTrackerProps {
  postId: string
  slug: string
  category?: string
  tags?: string[]
  authorId?: string
  publishedAt?: string | null
  readingTime: number
  articleSelector?: string
}

function scrollDepthBucket(percent: number): 25 | 50 | 75 | 90 | 100 {
  if (percent >= 100) return 100
  if (percent >= 90) return 90
  if (percent >= 75) return 75
  if (percent >= 50) return 50
  return 25
}

export function BlogAnalyticsTracker({
  postId,
  slug,
  category,
  tags,
  authorId,
  publishedAt,
  readingTime,
  articleSelector = "[data-blog-article-content]",
}: BlogAnalyticsTrackerProps) {
  const activeSeconds = useRef(0)
  const maxScrollDepth = useRef(0)
  const articleVisible = useRef(false)

  useEffect(() => {
    const readingSessionId = getBlogReadingSessionId()
    const common = {
      postId,
      slug,
      category,
      tags,
      authorId,
      publishedAt: publishedAt ?? undefined,
      estimatedReadMinutes: readingTime,
      readingSessionId,
    }

    trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.articleOpened, postId, {
      ...common,
      referrerType: inferBlogReferrerType(document.referrer),
    })

    const article = document.querySelector<HTMLElement>(articleSelector)
    if (!article) return

    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          const entry = entries[0]
          articleVisible.current = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.25)
        }, { threshold: [0, 0.25, 0.5, 1] })
      : null

    observer?.observe(article)
    if (!observer) articleVisible.current = true

    const updateScrollDepth = () => {
      const rect = article.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const visibleBottom = Math.min(viewportHeight, rect.bottom)
      const progressed = Math.max(0, visibleBottom - rect.top)
      const percent = Math.min(100, Math.round((progressed / Math.max(rect.height, 1)) * 100))
      maxScrollDepth.current = Math.max(maxScrollDepth.current, percent)
    }

    const isActive = () => (
      document.visibilityState === "visible" &&
      document.hasFocus() &&
      articleVisible.current
    )

    const interval = window.setInterval(() => {
      updateScrollDepth()
      if (!isActive()) return

      activeSeconds.current += 1
      const bucket = scrollDepthBucket(maxScrollDepth.current)

      if (activeSeconds.current >= 10) {
        trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.engagementStarted, postId, {
          ...common,
          activeReadSeconds: activeSeconds.current,
          maxScrollDepthBucket: bucket,
        })
      }

      if (activeSeconds.current >= 30) {
        trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.articleEngaged, postId, {
          ...common,
          activeReadSeconds: activeSeconds.current,
          maxScrollDepthBucket: bucket,
        })
      }

      if (activeSeconds.current >= 30 && maxScrollDepth.current >= 75) {
        trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.articleCompleted, postId, {
          ...common,
          activeReadSeconds: activeSeconds.current,
          maxScrollDepthBucket: bucket,
        })
      }
    }, 1000)

    window.addEventListener("scroll", updateScrollDepth, { passive: true })
    window.addEventListener("resize", updateScrollDepth)
    updateScrollDepth()

    return () => {
      window.clearInterval(interval)
      observer?.disconnect()
      window.removeEventListener("scroll", updateScrollDepth)
      window.removeEventListener("resize", updateScrollDepth)
    }
  }, [articleSelector, authorId, category, postId, publishedAt, readingTime, slug, tags])

  return null
}
