/**
 * SheriaBot SEO
 * File ID: SEO-S03-TEST-ROUTES-013
 * Purpose: Automated contract test validating Kenya authority routes and redirect integrity
 * Sprint: SEO Sprint 3
 */

import { describe, expect, it } from 'vitest'
import { absoluteUrl } from '@/lib/site-url'
import sitemap from '../sitemap'

describe('SEO Kenya Authority Routes Contracts', () => {
  it('verifies that all 7 Wave A Kenya authority routes are present in the authoritative sitemap', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://sheriabot.com'
    process.env.VERCEL_ENV = 'production'

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    const expectedWaveARoutes = [
      'https://sheriabot.com/kenya/fintech-compliance-requirements',
      'https://sheriabot.com/kenya/cbk-digital-credit-provider-compliance',
      'https://sheriabot.com/kenya/odpc-data-protection-compliance',
      'https://sheriabot.com/kenya/aml-cft-fintech-compliance',
      'https://sheriabot.com/kenya/regulatory-sandbox-guide',
      'https://sheriabot.com/knowledge-base/dpia-data-protection-impact-assessment-kenya',
      'https://sheriabot.com/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide',
    ]

    for (const route of expectedWaveARoutes) {
      expect(urls, `Missing Wave A route in sitemap: ${route}`).toContain(route)
    }
  })

  it('verifies /kenya is excluded from sitemap because it is a redirect route', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://sheriabot.com'
    process.env.VERCEL_ENV = 'production'

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    expect(urls).not.toContain('https://sheriabot.com/kenya')
  })
})
