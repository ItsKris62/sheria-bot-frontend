/**
 * SheriaBot SEO
 * File ID: SEO-S06-TEST-PROD-READINESS-030
 * Purpose: Automated contract test validating production readiness, release inventory routes, and CRO/Regional gates
 * Sprint: SEO Sprint 6
 */

import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import sitemap from '@/app/sitemap'
import { absoluteUrl, getSiteUrl } from '@/lib/site-url'
import { STATIC_KNOWLEDGE_BASE_REGISTRY } from '@/lib/seo/seo-static-knowledge-base-registry'

describe('SEO Production Readiness & Release Inventory Contracts (SEO-S06)', () => {
  const RELEASE_ROUTES = [
    '/',
    '/kenya/fintech-compliance-requirements',
    '/kenya/cbk-digital-credit-provider-compliance',
    '/kenya/odpc-data-protection-compliance',
    '/kenya/aml-cft-fintech-compliance',
    '/kenya/regulatory-sandbox-guide',
    '/kenya/regulatory-change-tracker',
    '/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide',
    '/knowledge-base/dpia-data-protection-impact-assessment-kenya',
    '/knowledge-base/odpc-data-protection-registration-renewal-kenya',
    '/knowledge-base/frc-goaml-registration-str-reporting-guide',
    '/knowledge-base/kenya-fintech-compliance-checklist-calendar',
    '/solutions',
    '/solutions/startups',
    '/solutions/enterprise',
    '/solutions/regulators',
  ]

  it('verifies that all authorized release inventory routes are present in the authoritative sitemap', async () => {
    const sitemapEntries = await sitemap()
    const urls = sitemapEntries.map((e) => e.url)

    for (const route of RELEASE_ROUTES) {
      const expectedUrl = route === '/' ? getSiteUrl() : absoluteUrl(route)
      expect(urls, `Route ${route} missing from sitemap`).toContain(expectedUrl)
    }
  })

  it('verifies all static Knowledge Base guides exist in the registry and have valid slugs', () => {
    expect(STATIC_KNOWLEDGE_BASE_REGISTRY.length).toBeGreaterThanOrEqual(5)

    for (const article of STATIC_KNOWLEDGE_BASE_REGISTRY) {
      expect(article.slug).toBeDefined()
      expect(article.title).toBeDefined()
      expect(article.regulator).toBeDefined()
      expect(article.jurisdiction).toBe('Kenya')
    }
  })

  it('verifies that future regional routes (Rwanda / Malawi) remain unmapped and gated until authorized', async () => {
    const sitemapEntries = await sitemap()
    const urls = sitemapEntries.map((e) => e.url)

    const unauthorizedRegionalRoutes = [
      absoluteUrl('/rwanda/fintech-compliance-requirements'),
      absoluteUrl('/malawi/fintech-compliance-requirements'),
    ]

    for (const route of unauthorizedRegionalRoutes) {
      expect(urls, `Unauthorized regional route ${route} found in sitemap`).not.toContain(route)
    }
  })
})
