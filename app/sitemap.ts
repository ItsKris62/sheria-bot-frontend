import type { MetadataRoute } from 'next'

const BASE_URL = 'https://sheriabot.com'

// Keep this list in sync with your actual blog slugs.
// When you move to a CMS or DB-backed blog, replace this with a fetch call.
const blogSlugs = [
  'cbk-digital-credit-providers-regulations-2024',
  'aml-kyc-best-practices-kenya-fintechs',
  'data-protection-act-fintech-compliance',
  'sandbox-regulatory-framework-kenya',
  'mpesa-integration-compliance-checklist',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static public pages ───────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/knowledge-base`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // ── Dynamic blog post pages ───────────────────────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
