/**
 * SheriaBot SEO
 * File ID: SEO-S03-TEST-GATES-015
 * Purpose: Automated contract test enforcing publication gates and preventing blocked Wave B routes from leaking into production sitemaps
 * Sprint: SEO Sprint 3
 */

import { describe, expect, it } from 'vitest'
import sitemap from '../sitemap'

describe('SEO Kenya Publication Gates (Wave B Block Enforcement)', () => {
  it('strictly excludes Wave B blocked routes from the public sitemap', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://sheriabot.com'
    process.env.VERCEL_ENV = 'production'

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    const blockedWaveBRoutes = [
      '/kenya/cbk-payment-service-provider-licensing',
      '/kenya/cbk-cybersecurity-compliance',
      '/knowledge-base/form-cbk-dcp-1-application-guide',
    ]

    for (const blockedRoute of blockedWaveBRoutes) {
      const fullBlockedUrl = `https://sheriabot.com${blockedRoute}`
      expect(
        urls,
        `Blocked Wave B route leaked into sitemap: ${fullBlockedUrl}`
      ).not.toContain(fullBlockedUrl)
    }
  })
})
