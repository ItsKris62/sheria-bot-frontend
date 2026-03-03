/**
 * BlogPosting JSON-LD — rendered inside each /blog/[slug] page.
 * Gives Google rich result eligibility (author, date, headline).
 */

const BASE_URL = 'https://sheriabot.com'

interface BlogPostJsonLdProps {
  slug: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  datePublished: string   // ISO 8601 string, e.g. "2025-01-15"
  readTime: string
}

export function BlogPostJsonLd({
  slug,
  title,
  excerpt,
  author,
  authorRole,
  datePublished,
  readTime,
}: BlogPostJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished: new Date(datePublished).toISOString(),
    dateModified: new Date(datePublished).toISOString(),
    image: `${BASE_URL}/og-image.png`,
    inLanguage: 'en-KE',
    timeRequired: readTime,
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
        url: `${BASE_URL}/colored-logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`,
    },
    keywords: ['Kenya fintech', 'regulatory compliance', 'CBK', 'AML', 'KYC'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
