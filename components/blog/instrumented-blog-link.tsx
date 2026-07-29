"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import {
  BLOG_ANALYTICS_EVENTS,
  type BlogPlacement,
  trackBlogEvent,
  trackBlogEventOnce,
} from "@/lib/analytics/blog-events"

interface InstrumentedBlogLinkProps {
  href: string
  postId: string
  slug: string
  category?: string | null
  tags?: string[]
  authorId?: string
  publishedAt?: string | null
  placement: BlogPlacement
  relatedFromPostId?: string
  relatedCardPosition?: number
  relationshipBasis?: string
  children: React.ReactNode
  className?: string
}

export function InstrumentedBlogLink({
  href,
  postId,
  slug,
  category,
  tags,
  authorId,
  publishedAt,
  placement,
  relatedFromPostId,
  relatedCardPosition,
  relationshipBasis,
  children,
  className,
}: InstrumentedBlogLinkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return

    let dwellTimer: ReturnType<typeof setTimeout> | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          dwellTimer = setTimeout(() => {
            const impressionPlacement = placement === "category" ? "category" : placement
            trackBlogEventOnce(BLOG_ANALYTICS_EVENTS.articleImpression, `${postId}:${impressionPlacement}`, {
              postId,
              slug,
              category: category ?? undefined,
              tags,
              authorId,
              publishedAt: publishedAt ?? undefined,
              placement: impressionPlacement,
            })
            observer.unobserve(node)
          }, 750)
        } else if (dwellTimer) {
          clearTimeout(dwellTimer)
          dwellTimer = null
        }
      },
      { threshold: [0, 0.5, 1] },
    )

    observer.observe(node)

    return () => {
      if (dwellTimer) clearTimeout(dwellTimer)
      observer.disconnect()
    }
  }, [authorId, category, placement, postId, publishedAt, slug, tags])

  const handleClick = () => {
    if (placement === "featured") {
      trackBlogEvent(BLOG_ANALYTICS_EVENTS.featuredArticleOpened, {
        postId,
        slug,
        category: category ?? undefined,
        tags,
        authorId,
        publishedAt: publishedAt ?? undefined,
        placement,
      })
    }

    if (placement === "related" && relatedFromPostId && relatedCardPosition !== undefined) {
      trackBlogEvent(BLOG_ANALYTICS_EVENTS.relatedArticleOpened, {
        postId: relatedFromPostId,
        slug,
        category: category ?? undefined,
        destinationPostId: postId,
        relatedCardPosition,
        relationshipBasis,
        placement,
      })
    }
  }

  return (
    <Link ref={ref} href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
