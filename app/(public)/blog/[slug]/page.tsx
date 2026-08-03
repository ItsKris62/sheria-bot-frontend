import type { Metadata } from "next"
import type { Components } from "react-markdown"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown, { defaultUrlTransform } from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, MapPin, ShieldCheck, User } from "lucide-react"
import { BlogAnalyticsTracker } from "@/components/blog/blog-analytics-tracker"
import { BlogArticleCard } from "@/components/blog/blog-article-card"
import { BlogFeedback } from "@/components/blog/blog-feedback"
import { BlogNewsletterSignup } from "@/components/blog/blog-newsletter-signup"
import { BlogProductCtaLink } from "@/components/blog/blog-product-cta-link"
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents"
import { SocialShare } from "@/components/blog/social-share"
import { SourceList } from "@/components/blog/source-list"
import { BlogPostJsonLd } from "@/components/seo/blog-post-json-ld"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getBlogList, getBlogPostBySlug, BlogNotFoundError } from "@/lib/blog/api"
import { extractTableOfContents, slugifyHeading } from "@/lib/blog/markdown"
import { safeImageUrl } from "@/lib/blog/url"
import { absoluteUrl } from "@/lib/site-url"

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatDate(value?: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString("en-KE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function stringifyChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(stringifyChildren).join("")
  if (children && typeof children === "object" && "props" in children) {
    return stringifyChildren((children as { props?: { children?: ReactNode } }).props?.children)
  }
  return ""
}

function createMarkdownComponents(): Components {
  const seen = new Map<string, number>()

  function headingId(children: ReactNode) {
    const baseId = slugifyHeading(stringifyChildren(children))
    const count = seen.get(baseId) ?? 0
    seen.set(baseId, count + 1)
    return count === 0 ? baseId : `${baseId}-${count + 1}`
  }

  return {
    h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
    h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
    a: ({ href, children }) => (
      <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-border/70">
        <table>{children}</table>
      </div>
    ),
  }
}

function transformMarkdownUrl(url: string) {
  if (url.startsWith("#") || url.startsWith("/")) return url
  try {
    const parsed = new URL(url)
    if (["https:", "http:", "mailto:"].includes(parsed.protocol)) return defaultUrlTransform(url)
  } catch {
    return "#"
  }
  return "#"
}

async function getRelatedPosts(category: string | null | undefined, tags: string[] | undefined, currentSlug: string) {
  const tag = tags?.[0]
  const related = await getBlogList({
    category: category || undefined,
    tag,
    limit: 4,
    page: 1,
  })

  let posts = related.posts.filter((post) => post.slug !== currentSlug).slice(0, 3)
  if (posts.length === 0 && category) {
    const categoryPosts = await getBlogList({ category, limit: 4, page: 1 })
    posts = categoryPosts.posts.filter((post) => post.slug !== currentSlug).slice(0, 3)
  }

  return posts
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getBlogPostBySlug(slug)
    const url = post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`)
    const imageUrl = safeImageUrl(post.ogImageUrl || post.coverImageUrl) || absoluteUrl("/og-image.png")

    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "SheriaBot compliance insight.",
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        url,
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || undefined,
        publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        authors: [post.author?.fullName || post.author?.name || "SheriaBot Editorial"],
        section: post.category || undefined,
        tags: [...(post.tags || []), post.category, "Kenya fintech", "compliance"].filter(Boolean) as string[],
        images: [{ url: imageUrl }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || undefined,
        images: [imageUrl],
      },
    }
  } catch (error) {
    if (error instanceof BlogNotFoundError) {
      return {
        title: "Article Not Found | SheriaBot Blog",
        description: "The SheriaBot Blog article you are looking for could not be found.",
      }
    }
    throw error
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  let post
  try {
    post = await getBlogPostBySlug(slug)
  } catch (error) {
    if (error instanceof BlogNotFoundError) notFound()
    throw error
  }

  const relatedPosts = await getRelatedPosts(post.category, post.tags, post.slug)

  const tocItems = extractTableOfContents(post.content || "")
  const coverImage = safeImageUrl(post.coverImageUrl)
  const imageUrl = safeImageUrl(post.ogImageUrl || post.coverImageUrl) || absoluteUrl("/og-image.png")
  const canonicalUrl = post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`)
  const publishedDate = formatDate(post.publishedAt)
  const updatedDate = formatDate(post.updatedAt)
  const reviewedDate = formatDate(post.lastReviewedAt)
  const author = post.author?.fullName || post.author?.name || "SheriaBot Editorial"
  const publicSources = post.sources?.filter((source) => source.sourceType !== "INTERNAL") ?? []
  const sourceCount = post.sources ? publicSources.length : post.sourceCount || 0

  return (
    <main className="flex flex-col">
      <BlogPostJsonLd
        slug={post.slug}
        title={post.title}
        excerpt={post.excerpt || ""}
        author={author}
        authorRole="Editorial"
        datePublished={post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()}
        dateModified={post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString()}
        readTime={`${post.readingTime} min read`}
        category={post.category || undefined}
        imageUrl={imageUrl}
        sources={publicSources}
      />

      <BlogAnalyticsTracker
        postId={post.id}
        slug={post.slug}
        category={post.category || undefined}
        tags={post.tags || []}
        authorId={post.author?.id}
        publishedAt={post.publishedAt}
        readingTime={post.readingTime}
      />

      <section className="border-b border-border bg-background pt-28">
        <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="-ml-3 mb-7 text-muted-foreground hover:text-foreground">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to Blog
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
              {post.category || "General"}
            </Badge>
            {post.jurisdiction ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {post.jurisdiction}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" aria-hidden="true" />
              {author}
            </span>
            {publishedDate ? (
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Published {publishedDate}
              </span>
            ) : null}
            {updatedDate && updatedDate !== publishedDate ? (
              <span>Updated {updatedDate}</span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingTime} min read
            </span>
          </div>
        </div>

        {coverImage ? (
          <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-border/70 bg-muted">
              <Image
                src={coverImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover"
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
          <article
            className="prose prose-invert max-w-none prose-headings:scroll-mt-28 prose-a:text-primary prose-a:underline-offset-4 prose-blockquote:border-primary prose-table:text-sm"
            data-blog-article-content
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={createMarkdownComponents()}
              urlTransform={transformMarkdownUrl}
            >
              {post.content}
            </ReactMarkdown>

            <section aria-labelledby="regulatory-trust-heading" className="not-prose mt-12 rounded-lg border border-border/70 bg-card/80 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <h2 id="regulatory-trust-heading" className="text-lg font-semibold text-foreground">
                    Regulatory trust notes
                  </h2>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    {post.jurisdiction ? (
                      <div>
                        <dt className="text-muted-foreground">Jurisdiction</dt>
                        <dd className="font-medium text-foreground">{post.jurisdiction}</dd>
                      </div>
                    ) : null}
                    {reviewedDate ? (
                      <div>
                        <dt className="text-muted-foreground">Last reviewed</dt>
                        <dd className="font-medium text-foreground">{reviewedDate}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="text-muted-foreground">Sources cited</dt>
                      <dd className="font-medium text-foreground">{sourceCount}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    SheriaBot publishes regulatory content through admin editorial controls. This article is educational and does not constitute legal advice.
                  </p>
                </div>
              </div>
            </section>

            <SourceList
              sources={publicSources}
              postId={post.id}
              slug={post.slug}
              category={post.category || undefined}
            />

            <Alert className="not-prose mt-10 border-border/70 bg-muted/40">
              <AlertTitle className="text-foreground">Disclaimer</AlertTitle>
              <AlertDescription className="text-sm leading-6 text-muted-foreground">
                This article is for general informational purposes only and does not constitute legal advice. For advice specific to your organisation, consult a qualified legal or compliance professional.
              </AlertDescription>
            </Alert>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <BlogTableOfContents items={tocItems} />
            <Card className="border-border/70 bg-card/80">
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold text-foreground">Share this article</h2>
                <div className="mt-4">
                  <SocialShare
                    title={post.title}
                    url={canonicalUrl}
                    excerpt={post.excerpt}
                    postId={post.id}
                    slug={post.slug}
                    category={post.category || "General"}
                  />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <BlogFeedback postId={post.id} slug={post.slug} category={post.category || undefined} />
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-5">
            <h2 className="text-lg font-semibold text-foreground">Turn this into action</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ask SheriaBot a compliance question grounded in regulatory context.
            </p>
            <Button asChild className="mt-5">
              <BlogProductCtaLink
                href="/startup/compliance-query"
                ctaId="start_compliance_query"
                postId={post.id}
                slug={post.slug}
                category={post.category || undefined}
              >
                Ask a compliance question
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </BlogProductCtaLink>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="article-newsletter-heading" className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border/70 bg-card/80 p-7">
            <h2 id="article-newsletter-heading" className="text-2xl font-semibold text-foreground">
              Keep up with regulatory developments
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Get SheriaBot editorial updates without sharing your article feedback or reading history publicly.
            </p>
            <BlogNewsletterSignup sourcePage={`/blog/${post.slug}`} postId={post.id} slug={post.slug} category={post.category || undefined} />
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section aria-labelledby="related-articles-heading" className="border-t border-border/60 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 id="related-articles-heading" className="text-2xl font-semibold text-foreground">
                Related articles
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <BlogArticleCard
                  key={relatedPost.id}
                  post={relatedPost}
                  placement="related"
                  variant="compact"
                  relatedFromPostId={post.id}
                  relatedCardPosition={index + 1}
                  relationshipBasis={post.tags?.length ? "tag" : "category"}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
