"use client"

import Link from "next/link"
import { forwardRef } from "react"
import {
  BLOG_ANALYTICS_EVENTS,
  type BlogCtaId,
  trackBlogEvent,
} from "@/lib/analytics/blog-events"

interface BlogProductCtaLinkProps {
  href: string
  ctaId: BlogCtaId
  postId?: string
  slug?: string
  category?: string
  children: React.ReactNode
  className?: string
}

export const BlogProductCtaLink = forwardRef<HTMLAnchorElement, BlogProductCtaLinkProps>(function BlogProductCtaLink(
  { href, ctaId, postId, slug, category, children, className },
  ref,
) {
  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onClick={() => {
        trackBlogEvent(BLOG_ANALYTICS_EVENTS.productCtaClicked, {
          ctaId,
          postId,
          slug,
          category,
        })
      }}
    >
      {children}
    </Link>
  )
})
