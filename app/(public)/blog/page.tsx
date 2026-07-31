import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { ArrowRight, BookOpen, CalendarDays, FileSearch, Library, MessageSquareText, ShieldCheck, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogArticleCard } from "@/components/blog/blog-article-card"
import { BlogFilters } from "@/components/blog/blog-filters"
import { BlogNewsletterSignup } from "@/components/blog/blog-newsletter-signup"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { BlogProductCtaLink } from "@/components/blog/blog-product-cta-link"
import { BlogTopicRequest } from "@/components/blog/blog-topic-request"
import type { BlogCtaId } from "@/lib/analytics/blog-events"
import { getBlogList, getBlogTaxonomy, getFeaturedBlogPosts } from "@/lib/blog/api"
import { buildBlogHref, cleanBlogParam, normaliseBlogPage } from "@/lib/blog/url"
import { absoluteUrl } from "@/lib/site-url"

const PAGE_SIZE = 9

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

function resolveState(searchParams: { [key: string]: string | undefined }) {
  const q = cleanBlogParam(searchParams.q)
  const category = cleanBlogParam(searchParams.category)
  const tag = cleanBlogParam(searchParams.tag)
  const page = normaliseBlogPage(searchParams.page)
  return { q, category, tag, page }
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const state = resolveState(await searchParams)
  const isSearchPage = Boolean(state.q)
  const canonicalPath = isSearchPage
    ? "/blog"
    : buildBlogHref({ category: state.category, tag: state.tag, page: state.page }, "")

  const title = state.category
    ? `${state.category} Articles | SheriaBot Blog`
    : "Compliance Intelligence for African Fintech Teams | SheriaBot Blog"

  const description = "Practical regulatory analysis, compliance guidance and fintech operations insights from SheriaBot for Kenyan and African financial services teams."

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    robots: isSearchPage ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: "SheriaBot",
      images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-image.png")],
    },
  }
}

const exploreLinks = [
  {
    title: "Compliance Query",
    href: "/startup/compliance-query",
    description: "Ask a regulatory question and get grounded guidance.",
    icon: MessageSquareText,
    ctaId: "start_compliance_query",
  },
  {
    title: "Gap Analysis",
    href: "/startup/gap-analysis",
    description: "Compare your controls against compliance expectations.",
    icon: FileSearch,
    ctaId: "request_demo",
  },
  {
    title: "Policy Generator",
    href: "/regulator/policy-generator",
    description: "Draft structured policy artefacts from regulatory inputs.",
    icon: ShieldCheck,
    ctaId: "explore_regulatory_library",
  },
  {
    title: "Knowledge Base",
    href: "/knowledge-base",
    description: "Browse source-backed compliance guidance.",
    icon: Library,
    ctaId: "explore_regulatory_library",
  },
  {
    title: "Compliance Calendar",
    href: "/startup/calendar",
    description: "Keep upcoming regulatory dates visible.",
    icon: CalendarDays,
    ctaId: "request_demo",
  },
] satisfies Array<{
  title: string
  href: string
  description: string
  icon: LucideIcon
  ctaId: BlogCtaId
}>

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const state = resolveState(await searchParams)
  const [data, featuredPosts, taxonomy] = await Promise.all([
    getBlogList({
      search: state.q,
      category: state.category,
      tag: state.tag,
      page: state.page,
      limit: PAGE_SIZE,
    }),
    getFeaturedBlogPosts(2),
    getBlogTaxonomy(),
  ])

  if (data.pagination.pages > 0 && state.page > data.pagination.pages) {
    redirect(buildBlogHref({ ...state, page: data.pagination.pages }, ""))
  }

  const posts = data.posts || []
  const hasFilters = Boolean(state.q || state.category || state.tag)
  const blogIsEmpty = posts.length === 0 && !hasFilters && data.pagination.total === 0
  const resultLabel = `${data.pagination.total} ${data.pagination.total === 1 ? "article" : "articles"}`
  const placement = state.q ? "search" : state.category || state.tag ? "category" : "recent"

  return (
    <main className="flex flex-col">
      <section className="border-b border-border bg-background pt-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Compliance intelligence for African fintech teams
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Practical analysis, regulatory updates and implementation guidance from SheriaBot for founders, legal teams, operators and regulators building across Kenya and Africa.
            </p>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/80 p-5 shadow-elevated">
            <Suspense fallback={<div className="h-36 rounded-md bg-muted/40" />}>
              <BlogFilters
                resultCount={data.pagination.total}
                page={data.pagination.page}
                categories={taxonomy.categories}
                tags={taxonomy.tags}
              />
            </Suspense>
          </div>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section aria-labelledby="featured-article-heading" className="border-b border-border/60 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Featured</p>
                <h2 id="featured-article-heading" className="mt-2 text-2xl font-semibold text-foreground">
                  Editor-selected insight
                </h2>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredPosts.map((post, index) => (
                <BlogArticleCard
                  key={post.id}
                  post={post}
                  placement="featured"
                  variant="featured"
                  priorityImage={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="articles" aria-labelledby="recent-articles-heading" className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Recent articles</p>
              <h2 id="recent-articles-heading" tabIndex={-1} className="mt-2 text-2xl font-semibold text-foreground focus:outline-none">
                {state.category || state.tag || state.q ? "Filtered guidance" : "Latest from SheriaBot"}
              </h2>
              <p aria-live="polite" className="mt-2 text-sm text-muted-foreground">
                Showing {resultLabel}
                {state.category ? ` in ${state.category}` : ""}
                {state.tag ? ` tagged ${state.tag}` : ""}
                {state.q ? " matching your search" : ""}.
              </p>
            </div>
            {hasFilters && (
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/blog#articles">Clear filters</Link>
              </Button>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
              <div className="rounded-lg border border-border/70 bg-card/80 p-8">
                <BookOpen className="h-9 w-9 text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {blogIsEmpty ? "No published Blog articles yet" : "No articles matched this view"}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {blogIsEmpty
                    ? "SheriaBot editors have not published public Blog articles yet. The Knowledge Base remains available for source-backed guidance."
                    : `No public articles matched${state.q ? " your search" : ""}${state.category ? ` in ${state.category}` : ""}${state.tag ? ` tagged ${state.tag}` : ""}. Try clearing filters, checking the Knowledge Base, or asking the editorial team to cover this topic.`}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {!blogIsEmpty && (
                    <Button asChild>
                      <Link href="/blog#articles">Clear filters</Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild className="bg-transparent">
                    <Link href="/knowledge-base">Open Knowledge Base</Link>
                  </Button>
                </div>
              </div>
              <BlogTopicRequest sourcePage="/blog" category={state.category} compact />
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogArticleCard key={post.id} post={post} placement={placement} />
                ))}
              </div>
              <BlogPagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.pages}
                state={state}
              />
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="explore-sheriabot-heading" className="border-y border-border/60 bg-muted/20 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Explore SheriaBot</p>
            <h2 id="explore-sheriabot-heading" className="mt-2 text-2xl font-semibold text-foreground">
              Turn insight into compliance action
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {exploreLinks.map((item) => (
              <BlogProductCtaLink
                key={item.href}
                href={item.href}
                ctaId={item.ctaId}
                className="group rounded-lg border border-border/70 bg-card/70 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none"
              >
                <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-foreground group-hover:text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Open <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </span>
              </BlogProductCtaLink>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="blog-newsletter-heading" className="py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-7">
            <h2 id="blog-newsletter-heading" className="text-2xl font-semibold text-foreground">
              Get the Kenyan Compliance Brief
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              A weekly editorial digest of regulatory developments and practical implementation guidance. No fabricated popularity metrics, just the updates worth reviewing.
            </p>
            <BlogNewsletterSignup sourcePage="/blog" category={state.category} />
          </div>
          <BlogTopicRequest sourcePage="/blog" category={state.category} compact />
        </div>
      </section>
    </main>
  )
}
