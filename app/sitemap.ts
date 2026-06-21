import type { MetadataRoute } from 'next'
import { getSiteUrl, absoluteUrl } from '@/lib/site-url'

async function getPublishedSlugs() {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/trpc/blog.publicSlugs`)
  
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.result.data.map((post: any) => ({
      slug: post.slug,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt
    }))
  } catch (error) {
    throw error // Let the main sitemap function handle the failure
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static public pages ───────────────────────────────────────────────────
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

  // ── Dynamic blog post pages ───────────────────────────────────────────────
  try {
    const posts = await getPublishedSlugs()
    
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch (error) {
    console.warn("[sitemap] Failed to fetch blog slugs; returning static routes only")
    return staticRoutes
  }
}
