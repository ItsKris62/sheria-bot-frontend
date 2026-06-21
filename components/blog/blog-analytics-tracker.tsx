"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

export function BlogAnalyticsTracker({ slug, category, readingTime }: { slug: string, category: string, readingTime: number }) {
  useEffect(() => {
    trackEvent("blog_post_viewed", {
      blog_slug: slug,
      blog_category: category,
      read_time_seconds: readingTime * 60,
    })
  }, [slug, category, readingTime])

  return null
}
