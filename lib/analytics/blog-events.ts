"use client"

import { trackEvent } from "@/lib/analytics"

export const BLOG_ANALYTICS_EVENTS = {
  listingViewed: "blog_listing_viewed",
  articleImpression: "blog_article_impression",
  articleOpened: "blog_article_opened",
  engagementStarted: "blog_article_engagement_started",
  articleEngaged: "blog_article_engaged",
  articleCompleted: "blog_article_completed",
  searchPerformed: "blog_search_performed",
  searchNoResults: "blog_search_no_results",
  categorySelected: "blog_category_selected",
  tagSelected: "blog_tag_selected",
  featuredArticleOpened: "blog_featured_article_opened",
  relatedArticleOpened: "blog_related_article_opened",
  sourceOpened: "blog_source_opened",
  productCtaClicked: "blog_product_cta_clicked",
  newsletterCtaViewed: "blog_newsletter_cta_viewed",
  newsletterSubscriptionCompleted: "blog_newsletter_subscription_completed",
  feedbackSubmitted: "blog_feedback_submitted",
  topicRequestSubmitted: "blog_topic_request_submitted",
  articleShared: "blog_article_shared",
} as const

export type BlogAnalyticsEvent = typeof BLOG_ANALYTICS_EVENTS[keyof typeof BLOG_ANALYTICS_EVENTS]

export type BlogPlacement = "featured" | "recent" | "related" | "search" | "category"
export type BlogReferrerType = "internal" | "search" | "social" | "newsletter" | "direct" | "other"
export type BlogCtaId = "request_demo" | "start_compliance_query" | "explore_regulatory_library" | "view_pricing" | "start_free_trial"

export interface BlogCommonProperties {
  postId?: string
  slug?: string
  category?: string
  tags?: string[]
  jurisdiction?: string
  authorId?: string
  publishedAt?: string
  placement?: BlogPlacement
  referrerType?: BlogReferrerType
  readingSessionId?: string
}

export interface BlogSearchProperties {
  queryLength: number
  queryFingerprint?: string
  resultCount: number
  hasResults: boolean
  category?: string
  page?: number
}

export interface BlogEngagementProperties extends BlogCommonProperties {
  activeReadSeconds?: number
  maxScrollDepthBucket?: 25 | 50 | 75 | 90 | 100
  estimatedReadMinutes?: number
}

export interface BlogSourceOpenProperties extends BlogCommonProperties {
  sourcePosition: number
  sourcePublisher?: string
  sourceType?: string
  sourceDomain?: string
}

export interface BlogRelatedOpenProperties extends BlogCommonProperties {
  destinationPostId: string
  relatedCardPosition: number
  relationshipBasis?: string
}

export type BlogEventProperties =
  | BlogCommonProperties
  | BlogSearchProperties
  | BlogEngagementProperties
  | BlogSourceOpenProperties
  | BlogRelatedOpenProperties
  | (BlogCommonProperties & {
      ctaId?: BlogCtaId
      sharePlatform?: string
      feedbackValue?: "HELPFUL" | "NOT_HELPFUL"
      topicCategory?: string
      resultCount?: number
      page?: number
    })

const SESSION_KEY = "sheriabot.blog.readingSessionId"
const dedupedEvents = new Set<string>()

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `blog-session-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getBlogReadingSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined

  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const created = makeId()
    window.sessionStorage.setItem(SESSION_KEY, created)
    return created
  } catch {
    return undefined
  }
}

export function trackBlogEvent(eventName: BlogAnalyticsEvent, properties: BlogEventProperties = {}): void {
  const readingSessionId = "readingSessionId" in properties ? properties.readingSessionId : undefined
  trackEvent(eventName, {
    ...properties,
    readingSessionId: readingSessionId ?? getBlogReadingSessionId(),
  })
}

export function trackBlogEventOnce(
  eventName: BlogAnalyticsEvent,
  dedupKey: string,
  properties: BlogEventProperties = {},
): boolean {
  const key = `${eventName}:${dedupKey}`
  if (dedupedEvents.has(key)) return false
  dedupedEvents.add(key)
  trackBlogEvent(eventName, properties)
  return true
}

export function safeSourceDomain(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined
    return parsed.hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return undefined
  }
}

export function normalizedSearchLength(query: string): number {
  return query.trim().replace(/\s+/g, " ").length
}

export async function fingerprintSearchQuery(query: string): Promise<string | undefined> {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ")
  if (!normalized) return undefined
  if (typeof crypto === "undefined" || !crypto.subtle) return undefined

  const bytes = new TextEncoder().encode(normalized)
  const hash = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32)
}

export function inferBlogReferrerType(referrer: string | undefined): BlogReferrerType {
  if (!referrer) return "direct"
  try {
    const source = new URL(referrer)
    if (typeof window !== "undefined" && source.hostname === window.location.hostname) return "internal"
    if (/google|bing|duckduckgo|yahoo/i.test(source.hostname)) return "search"
    if (/linkedin|twitter|x\.com|facebook|whatsapp/i.test(source.hostname)) return "social"
    return "other"
  } catch {
    return "other"
  }
}

export function resetBlogAnalyticsDedupForTests(): void {
  dedupedEvents.clear()
}
