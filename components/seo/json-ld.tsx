/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-JSONLD-011
 * Purpose: Global JSON-LD structured data (WebSite, Organization, SoftwareApplication)
 * Sprint: SEO Sprint 1
 */

import { getSiteUrl } from '@/lib/site-url'

const BASE_URL = getSiteUrl()

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
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@sheriabot.com',
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
    description: '14-day free trial available. Paid plans for full compliance suite.',
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
  screenshot: `${BASE_URL}/open-graph-logo.png`,
  inLanguage: 'en-KE',
}

export function JsonLd() {
  return (
    <>
      <script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        id="json-ld-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
    </>
  )
}
