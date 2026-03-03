/**
 * Global JSON-LD structured data injected into every page via the root layout.
 *
 * Schemas included:
 *  - WebSite  → enables Google Sitelinks Search Box
 *  - Organization → knowledge panel, logo, social links
 *  - SoftwareApplication → app store-style rich result for the SaaS product
 *
 * Per-page schemas (e.g. BlogPosting) live in their own page components.
 * Swap https://sheriabot.com for your real domain before going live.
 */

const BASE_URL = 'https://sheriabot.com'

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SheriaBot',
  url: BASE_URL,
  description:
    "AI-powered regulatory intelligence platform for Kenya's fintech sector.",
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/knowledge-base?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SheriaBot',
  url: BASE_URL,
  logo: `${BASE_URL}/colored-logo.svg`,
  description:
    "SheriaBot helps Kenya fintech companies navigate regulatory compliance with AI-powered intelligence.",
  foundingDate: '2024',
  areaServed: 'KE',
  knowsAbout: [
    'Kenya fintech regulations',
    'CBK compliance',
    'AML/KYC',
    'Data Protection Act Kenya',
    'Regulatory sandbox',
  ],
  sameAs: [
    // Add your real social URLs here:
    // 'https://twitter.com/sheriabot',
    // 'https://linkedin.com/company/sheriabot',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@sheriabot.com',   // swap with real address
    availableLanguage: ['English', 'Swahili'],
  },
}

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SheriaBot',
  url: BASE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free trial available. Paid plans for full compliance suite.',
  },
  description:
    "AI-powered compliance intelligence for Kenya fintech — policy generation, gap analysis, regulatory tracking.",
  featureList: [
    'AI-powered compliance checklist generation',
    'Regulatory gap analysis',
    'CBK, AML/KYC, Data Protection Act guidance',
    'Document-level compliance queries',
    'Audit log & compliance reporting',
  ],
  screenshot: `${BASE_URL}/og-image.png`,
  inLanguage: 'en-KE',
}

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
    </>
  )
}
