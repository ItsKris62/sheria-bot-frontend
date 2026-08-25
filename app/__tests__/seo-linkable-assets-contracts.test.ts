/**
 * SheriaBot SEO
 * File ID: SEO-S05-TEST-ASSETS-020
 * Purpose: Automated contract test validating Hero Linkable Asset routes, metadata, canonicals, and sitemap presence
 * Sprint: SEO Sprint 5
 */

import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import sitemap from '@/app/sitemap'
import { absoluteUrl } from '@/lib/site-url'

describe('SEO Linkable Assets Contracts (SEO-S05)', () => {
  it('verifies that /kenya/regulatory-change-tracker is included in the authoritative sitemap', async () => {
    const sitemapEntries = await sitemap()
    const urls = sitemapEntries.map((e) => e.url)

    const expectedUrl = absoluteUrl('/kenya/regulatory-change-tracker')
    expect(urls).toContain(expectedUrl)

    const entry = sitemapEntries.find((e) => e.url === expectedUrl)
    expect(entry).toBeDefined()
    expect(entry?.priority).toBe(0.9)
    expect(entry?.changeFrequency).toBe('weekly')
  })

  it('verifies the Hero Linkable Asset has valid canonicals, upward pillar links, and primary source links', () => {
    const cwd = process.cwd()
    const filePath = path.join(
      cwd,
      'app/(public)/kenya/regulatory-change-tracker/page.tsx'
    )
    const content = fs.readFileSync(filePath, 'utf-8')

    // Canonical check
    expect(content).toContain("canonical: absoluteUrl('/kenya/regulatory-change-tracker')")

    // Upward link to Master Hub
    expect(content).toContain('/kenya/fintech-compliance-requirements')

    // Presence of key regulators
    expect(content).toContain('Central Bank of Kenya (CBK)')
    expect(content).toContain('Office of the Data Protection Commissioner (ODPC)')
    expect(content).toContain('Financial Reporting Centre (FRC)')
    expect(content).toContain('Capital Markets Authority (CMA)')

    // Primary source legal notices & guidance
    expect(content).toContain('Legal Notice No. 153 of 2023')
    expect(content).toContain('Legal Notice No. 46 of 2022')
    expect(content).toContain('Legal Notice No. 265 of 2021')
    expect(content).toContain('Legal Notice No. 263 of 2021')
    expect(content).toContain('Policy Guidance Note')

    // Verified publication & commencement dates
    expect(content).toContain('22 April 2022')
    expect(content).toContain('14 July 2022')
    expect(content).toContain('14 January 2022')
    expect(content).toContain('17 November 2023')
  })

  it('verifies zero occurrences of stale legal phrases and superseded citations in the linkable asset page', () => {
    const cwd = process.cwd()
    const filePath = path.join(
      cwd,
      'app/(public)/kenya/regulatory-change-tracker/page.tsx'
    )
    const content = fs.readFileSync(filePath, 'utf-8')

    const prohibitedPhrases = [
      'POCAMLA Cap 59B',
      'POCAMLA Cap. 59B',
      'within 7 days',
      'US$10,000 CTR',
      'annual licence renewal',
      'annual license renewal',
      'Regulation 9(3)',
      'Legal Notice No. 19 of 2023',
      'LN 19 of 2023',
      'LN19_2023',
      'Legal Notice No. 262 of 2021',
      '18 March 2022',
      '18 Mar 2022',
      '14 February 2022',
    ]

    for (const phrase of prohibitedPhrases) {
      expect(content, `Found stale phrase "${phrase}" in linkable asset`).not.toContain(phrase)
    }
  })
})
