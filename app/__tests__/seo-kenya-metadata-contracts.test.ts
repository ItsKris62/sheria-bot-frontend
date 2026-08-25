/**
 * SheriaBot SEO
 * File ID: SEO-S03-TEST-METADATA-014
 * Purpose: Automated contract test validating metadata, canonicals, and OpenGraph contracts on Kenya authority pages
 * Sprint: SEO Sprint 3
 */

import { describe, expect, it } from 'vitest'
import { absoluteUrl } from '@/lib/site-url'
import { metadata as hubMetadata } from '@/app/(public)/kenya/fintech-compliance-requirements/page'
import { metadata as dcpMetadata } from '@/app/(public)/kenya/cbk-digital-credit-provider-compliance/page'
import { metadata as odpcMetadata } from '@/app/(public)/kenya/odpc-data-protection-compliance/page'
import { metadata as amlMetadata } from '@/app/(public)/kenya/aml-cft-fintech-compliance/page'
import { metadata as sandboxMetadata } from '@/app/(public)/kenya/regulatory-sandbox-guide/page'
import { metadata as dpiaMetadata } from '@/app/(public)/knowledge-base/dpia-data-protection-impact-assessment-kenya/page'
import { metadata as dcpAnnualMetadata } from '@/app/(public)/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide/page'

describe('SEO Kenya Metadata & Canonical Contracts', () => {
  const waveAContracts = [
    {
      name: 'Kenya Hub',
      meta: hubMetadata,
      expectedPath: '/kenya/fintech-compliance-requirements',
      expectedTitleIncludes: 'Kenya FinTech Compliance',
    },
    {
      name: 'CBK DCP Guide',
      meta: dcpMetadata,
      expectedPath: '/kenya/cbk-digital-credit-provider-compliance',
      expectedTitleIncludes: 'Digital Credit Provider',
    },
    {
      name: 'ODPC Guide',
      meta: odpcMetadata,
      expectedPath: '/kenya/odpc-data-protection-compliance',
      expectedTitleIncludes: 'ODPC Data Controller Registration',
    },
    {
      name: 'AML Guide',
      meta: amlMetadata,
      expectedPath: '/kenya/aml-cft-fintech-compliance',
      expectedTitleIncludes: 'AML/CFT & POCAMLA',
    },
    {
      name: 'CMA Sandbox Guide',
      meta: sandboxMetadata,
      expectedPath: '/kenya/regulatory-sandbox-guide',
      expectedTitleIncludes: 'CMA Regulatory Sandbox',
    },
    {
      name: 'DPIA Spoke Guide',
      meta: dpiaMetadata,
      expectedPath: '/knowledge-base/dpia-data-protection-impact-assessment-kenya',
      expectedTitleIncludes: 'Data Protection Impact Assessment (DPIA)',
    },
    {
      name: 'DCP Annual Return Spoke Guide',
      meta: dcpAnnualMetadata,
      expectedPath: '/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide',
      expectedTitleIncludes: 'CBK DCP Annual Fee & Compliance Return Guide',
    },
  ]

  it('ensures each Wave A authority page has unique title, description, and exact self-referencing canonical', () => {
    const canonicals = new Set<string>()
    const titles = new Set<string>()

    for (const { name, meta, expectedPath, expectedTitleIncludes } of waveAContracts) {
      expect(meta.title, `Missing title on ${name}`).toBeDefined()
      expect(meta.title, `Title mismatch on ${name}`).toContain(expectedTitleIncludes)
      expect(meta.description, `Missing description on ${name}`).toBeDefined()

      const canonical = meta.alternates?.canonical as string
      expect(canonical, `Missing canonical on ${name}`).toBe(absoluteUrl(expectedPath))
      expect(canonical).not.toContain('localhost')

      // Ensure no duplicates
      expect(canonicals.has(canonical), `Duplicate canonical: ${canonical}`).toBe(false)
      canonicals.add(canonical)

      expect(titles.has(meta.title as string), `Duplicate title: ${meta.title}`).toBe(false)
      titles.add(meta.title as string)
    }
  })

  it('verifies OpenGraph and Twitter metadata contracts on Wave A pages', () => {
    for (const { name, meta, expectedPath } of waveAContracts) {
      expect(meta.openGraph, `Missing openGraph on ${name}`).toBeDefined()
      expect(meta.openGraph?.url, `OG url mismatch on ${name}`).toBe(absoluteUrl(expectedPath))
      expect(meta.twitter, `Missing twitter card on ${name}`).toBeDefined()
    }
  })
})
