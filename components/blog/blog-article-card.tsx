import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, FileText, User } from "lucide-react"
import { InstrumentedBlogLink } from "@/components/blog/instrumented-blog-link"
import type { BlogPostSummary } from "@/lib/blog/api"
import { safeImageUrl } from "@/lib/blog/url"
import { cn } from "@/lib/utils"

function formatDate(value?: string | null) {
  if (!value) return "Recently"
  return new Date(value).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function authorName(post: BlogPostSummary) {
  return post.author?.fullName || post.author?.name || "SheriaBot Editorial"
}

interface BlogArticleCardProps {
  post: BlogPostSummary
  placement: "featured" | "recent" | "search" | "category" | "related"
  priorityImage?: boolean
  relatedFromPostId?: string
  relatedCardPosition?: number
  relationshipBasis?: string
  variant?: "standard" | "featured" | "compact"
}

export function BlogArticleCard({
  post,
  placement,
  priorityImage = false,
  relatedFromPostId,
  relatedCardPosition,
  relationshipBasis,
  variant = "standard",
}: BlogArticleCardProps) {
  const imageUrl = safeImageUrl(post.coverImageUrl)
  const isFeatured = variant === "featured"
  const isCompact = variant === "compact"

  return (
    <InstrumentedBlogLink
      href={`/blog/${post.slug}`}
      postId={post.id}
      slug={post.slug}
      category={post.category}
      tags={post.tags || []}
      authorId={post.author?.id}
      publishedAt={post.publishedAt}
      placement={placement}
      relatedFromPostId={relatedFromPostId}
      relatedCardPosition={relatedCardPosition}
      relationshipBasis={relationshipBasis}
      className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card
        className={cn(
          "h-full overflow-hidden border-border/70 bg-card/80 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 motion-reduce:transform-none",
          isFeatured && "grid lg:grid-cols-[1.05fr_0.95fr]",
        )}
      >
        {!isCompact && (
          <div
            className={cn(
              "relative overflow-hidden bg-primary/10",
              isFeatured ? "min-h-[260px] lg:min-h-full" : "aspect-[16/10]",
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                priority={priorityImage}
                sizes={isFeatured ? "(max-width: 1024px) 100vw, 46vw" : "(max-width: 768px) 100vw, 33vw"}
                className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            ) : (
              <div className="flex h-full min-h-[180px] items-center justify-center border-b border-border/60 bg-[linear-gradient(135deg,rgba(34,197,94,0.18),rgba(15,23,42,0.08))]">
                <FileText className="h-10 w-10 text-primary/80" aria-hidden="true" />
              </div>
            )}
          </div>
        )}

        <CardContent className={cn("flex h-full flex-col p-5", isFeatured && "p-7 lg:p-8")}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs text-primary">
              {post.category || "General"}
            </Badge>
            {post.sourceCount ? (
              <span className="text-xs text-muted-foreground">
                {post.sourceCount} {post.sourceCount === 1 ? "source" : "sources"}
              </span>
            ) : null}
          </div>

          <h3
            className={cn(
              "mt-4 text-balance font-semibold leading-tight text-foreground transition-colors group-hover:text-primary",
              isFeatured ? "text-2xl sm:text-3xl" : "text-lg",
            )}
          >
            {post.title}
          </h3>

          {post.excerpt ? (
            <p className={cn("mt-3 text-sm leading-6 text-muted-foreground", isFeatured ? "line-clamp-4" : "line-clamp-3")}>
              {post.excerpt}
            </p>
          ) : null}

          {!isCompact && post.tags && post.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, isFeatured ? 4 : 3).map((tag) => (
                <span key={tag} className="rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {authorName(post)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {post.readingTime} min read
            </span>
          </div>
        </CardContent>
      </Card>
    </InstrumentedBlogLink>
  )
}
