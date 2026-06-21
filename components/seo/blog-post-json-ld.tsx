import { getSiteUrl, absoluteUrl } from '@/lib/site-url'

interface BlogPostJsonLdProps {
  slug: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  datePublished: string   // ISO 8601 string, e.g. "2025-01-15"
  dateModified: string
  readTime: string
  category?: string
  sources?: { url?: string | null }[]
}

export function BlogPostJsonLd({
  slug,
  title,
  excerpt,
  author,
  authorRole,
  datePublished,
  dateModified,
  readTime,
  category,
  sources,
}: BlogPostJsonLdProps) {
  const url = absoluteUrl(`/blog/${slug}`)
  const validCitations = sources?.map(s => s.url).filter(Boolean) as string[]

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    url,
    datePublished: new Date(datePublished).toISOString(),
    dateModified: new Date(dateModified).toISOString(),
    image: absoluteUrl('/og-image.png'),
    inLanguage: 'en-KE',
    timeRequired: readTime,
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: author,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SheriaBot',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/colored-logo.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: ['Kenya fintech', 'regulatory compliance', 'CBK', 'AML', 'KYC'],
  }

  if (category) {
    schema.articleSection = category
  }

  if (validCitations.length > 0) {
    schema.citation = validCitations
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

