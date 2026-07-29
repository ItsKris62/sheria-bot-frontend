import { cache } from "react"

const DEFAULT_API_URL = "http://localhost:4000"

export interface BlogAuthor {
  id?: string
  fullName?: string | null
  name?: string | null
}

export interface BlogSource {
  id: string
  sourceType: "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | "INTERNATIONAL_STANDARD"
  title: string
  publisher?: string | null
  url?: string | null
  publishedAt?: string | null
  accessedAt?: string | null
  notes?: string | null
}

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  category?: string | null
  tags?: string[]
  featured?: boolean
  coverImageUrl?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  lastReviewedAt?: string | null
  jurisdiction?: string | null
  readingTime: number
  sourceCount?: number
  author?: BlogAuthor | null
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string
  seoTitle?: string | null
  seoDescription?: string | null
  canonicalUrl?: string | null
  ogImageUrl?: string | null
  sources?: BlogSource[]
}

export interface BlogListResponse {
  posts: BlogPostSummary[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface BlogTaxonomyItem {
  name: string
  count: number
}

export interface BlogTaxonomyResponse {
  categories: BlogTaxonomyItem[]
  tags: BlogTaxonomyItem[]
}

export interface BlogFeedbackSummary {
  helpfulCount: number
  notHelpfulCount: number
  totalResponses: number
}

export class BlogNotFoundError extends Error {
  constructor(message = "Blog post not found") {
    super(message)
    this.name = "BlogNotFoundError"
  }
}

function getTrpcUrl(procedure: string) {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "")
  const trpcBase = apiUrl.endsWith("/trpc") ? apiUrl : `${apiUrl}/trpc`
  return new URL(`${trpcBase}/${procedure}`)
}

function normaliseTrpcCode(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined
  const error = "error" in payload ? (payload as { error?: unknown }).error : undefined
  if (!error || typeof error !== "object") return undefined
  const data = "data" in error ? (error as { data?: unknown }).data : undefined
  if (!data || typeof data !== "object") return undefined
  const code = "code" in data ? (data as { code?: unknown }).code : undefined
  return typeof code === "string" ? code : undefined
}

async function fetchTrpc<T>(procedure: string, input?: unknown): Promise<T> {
  const url = getTrpcUrl(procedure)
  if (input !== undefined) {
    url.searchParams.set("input", JSON.stringify(input))
  }

  const res = await fetch(url.toString(), { next: { revalidate: 60 } })
  let json: unknown
  try {
    json = await res.json()
  } catch {
    json = null
  }

  const errorCode = normaliseTrpcCode(json)
  if (!res.ok || errorCode) {
    if (res.status === 404 || errorCode === "NOT_FOUND") {
      throw new BlogNotFoundError()
    }
    throw new Error(`Blog API request failed for ${procedure}`)
  }

  if (!json || typeof json !== "object" || !("result" in json)) {
    throw new Error(`Unexpected Blog API response for ${procedure}`)
  }

  return (json as { result: { data: T } }).result.data
}

export const getBlogList = cache(async (input: {
  search?: string
  category?: string
  tag?: string
  page?: number
  limit?: number
}): Promise<BlogListResponse> => fetchTrpc("blog.publicList", input))

export const getFeaturedBlogPosts = cache(async (limit = 2): Promise<BlogPostSummary[]> =>
  fetchTrpc("blog.getFeatured", { limit }),
)

export const getBlogTaxonomy = cache(async (): Promise<BlogTaxonomyResponse> =>
  fetchTrpc("blog.publicTaxonomy"),
)

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDetail> =>
  fetchTrpc("blog.publicGetBySlug", { slug }),
)

export const getBlogFeedbackSummary = cache(async (postId: string): Promise<BlogFeedbackSummary> =>
  fetchTrpc("blog.getPublicFeedbackSummary", { postId }),
)
