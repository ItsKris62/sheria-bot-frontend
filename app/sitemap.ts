/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-SITEMAP-002
 * Route: /sitemap.xml
 * Purpose: Authoritative public sitemap generation and dynamic blog/KB indexability ingestion
 * Sprint: SEO Sprint 1
 */

import type { MetadataRoute } from 'next'
import { getSiteUrl, absoluteUrl } from '@/lib/site-url'

import { getTrpcUrl } from '@/lib/trpc-url'

async function getPublishedSlugs() {
  const url = getTrpcUrl('blog.publicSlugs')
  const res = await fetch(url.toString(), { next: { revalidate: 60 } })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json()
  return json.result.data
    .filter((post: any) => typeof post.slug === 'string' && post.slug.length > 0)
    .map((post: any) => ({
      slug: post.slug,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
    }))
}

async function getPublishedKnowledgeBaseArticles() {
  async function fetchPage(page: number) {
    const url = getTrpcUrl('content.listPublishedKnowledgeBase')
    url.searchParams.set('input', JSON.stringify({ page, limit: 50 }))

    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    return json.result.data
  }

  const firstPage = await fetchPage(1)
  const totalPages = Math.min(firstPage.pagination?.totalPages || 1, 20)
  const remainingPages =
    totalPages > 1
      ? await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => fetchPage(index + 2)))
      : []

  return [firstPage, ...remainingPages].flatMap((page) => page.items || [])
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getSiteUrl(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/pricing'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/solutions'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/solutions/startups'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/solutions/enterprise'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/solutions/regulators'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/security'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/data-protection'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/privacy'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/terms'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/careers'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/knowledge-base'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const [blogResult, knowledgeBaseResult] = await Promise.allSettled([
    getPublishedSlugs(),
    getPublishedKnowledgeBaseArticles(),
  ])

  const blogRoutes: MetadataRoute.Sitemap =
    blogResult.status === 'fulfilled'
      ? blogResult.value.map((post: any) => ({
          url: absoluteUrl(`/blog/${post.slug}`),
          lastModified: post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      : []

  if (blogResult.status === 'rejected') {
    console.warn('[sitemap] Failed to fetch blog slugs')
  }

  const knowledgeBaseRoutes: MetadataRoute.Sitemap =
    knowledgeBaseResult.status === 'fulfilled'
      ? knowledgeBaseResult.value.map((article: any) => ({
          url: absoluteUrl(`/knowledge-base/${article.slug}`),
          lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      : []

  if (knowledgeBaseResult.status === 'rejected') {
    console.warn('[sitemap] Failed to fetch Knowledge Base slugs')
  }

  return [...staticRoutes, ...blogRoutes, ...knowledgeBaseRoutes]
}
