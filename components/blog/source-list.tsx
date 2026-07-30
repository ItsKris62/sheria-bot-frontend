"use client"

import { ExternalLink, BookOpen, Building2, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  BLOG_ANALYTICS_EVENTS,
  safeSourceDomain,
  trackBlogEvent,
} from "@/lib/analytics/blog-events"
import { safeSourceUrl } from "@/lib/blog/url"

export type BlogSourceType = "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | "INTERNATIONAL_STANDARD"

interface SourceItem {
  id: string
  sourceType: BlogSourceType
  title: string
  publisher?: string | null
  url?: string | null
  publishedAt?: Date | string | null
  accessedAt?: Date | string | null
  notes?: string | null
}

interface SourceListProps {
  sources: SourceItem[]
  postId?: string
  slug?: string
  category?: string
}

const getSourceIcon = (type: BlogSourceType) => {
  switch (type) {
    case "OFFICIAL": return <Building2 className="w-4 h-4 text-primary" />
    case "INTERNATIONAL_STANDARD": return <Globe className="w-4 h-4 text-secondary" />
    default: return <BookOpen className="w-4 h-4 text-muted-foreground" />
  }
}

const getSourceBadgeVariant = (type: BlogSourceType): "default" | "secondary" | "outline" => {
  switch (type) {
    case "OFFICIAL": return "default"
    case "INTERNATIONAL_STANDARD": return "secondary"
    case "THIRD_PARTY": return "outline"
    case "MEDIA": return "outline"
    default: return "outline"
  }
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function SourceList({ sources, postId, slug, category }: SourceListProps) {
  const publicSources = sources?.filter((source) => source.sourceType !== "INTERNAL") ?? []
  if (publicSources.length === 0) return null

  return (
    <section aria-labelledby="sources-heading" className="mt-12 border-t border-border pt-8">
      <h2 id="sources-heading" className="text-xl font-semibold text-foreground">Sources and references</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        SheriaBot articles cite public materials where available. External source links open in a new tab.
      </p>
      <div className="space-y-4">
        {publicSources.map((source, index) => {
          const safeUrl = safeSourceUrl(source.url)
          const sourceDomain = safeSourceDomain(safeUrl)
          return (
          <div key={source.id} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
            <div className="mt-1">{getSourceIcon(source.sourceType)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={getSourceBadgeVariant(source.sourceType)} className="text-[10px] py-0">
                  {source.sourceType.replace('_', ' ')}
                </Badge>
              </div>
              <h4 className="font-medium text-card-foreground">{source.title}</h4>
              <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {source.publisher && <span>{source.publisher}</span>}
                {sourceDomain && <span>{sourceDomain}</span>}
                {source.publishedAt && <span>Published: {formatDate(source.publishedAt)}</span>}
                {source.accessedAt && <span>Accessed: {formatDate(source.accessedAt)}</span>}
              </div>
              {safeUrl && (
                <a
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackBlogEvent(BLOG_ANALYTICS_EVENTS.sourceOpened, {
                      postId,
                      slug,
                      category,
                      sourcePosition: index + 1,
                      sourcePublisher: source.publisher ?? undefined,
                      sourceType: source.sourceType,
                      sourceDomain,
                    })
                  }}
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-2 font-medium"
                >
                  View Source <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        )})}
      </div>
    </section>
  )
}
