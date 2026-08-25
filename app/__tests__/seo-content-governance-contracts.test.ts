/**
 * SheriaBot SEO
 * File ID: SEO-S04-TEST-GOVERNANCE-019
 * Purpose: Automated contract test validating content governance, canonical topic ownership, freshness metadata, and link contracts
 * Sprint: SEO Sprint 4
 */

import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  getStaticKnowledgeBaseRecords,
  filterStaticKnowledgeBase,
} from '@/lib/seo/seo-static-knowledge-base-registry'

describe('SEO Content Governance & Topical Authority Contracts', () => {
  const records = getStaticKnowledgeBaseRecords()

  it('ensures all 5 static Knowledge Base authority records are registered with complete governance metadata', () => {
    expect(records.length).toBe(5)

    const slugs = records.map((r) => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)

    const expectedSlugs = [
      'dpia-data-protection-impact-assessment-kenya',
      'cbk-dcp-annual-compliance-return-fees-guide',
      'odpc-data-protection-registration-renewal-kenya',
      'frc-goaml-registration-str-reporting-guide',
      'kenya-fintech-compliance-checklist-calendar',
    ]

    for (const expected of expectedSlugs) {
      expect(slugs).toContain(expected)
    }

    for (const record of records) {
      expect(record.jurisdiction).toBe('Kenya')
      expect(record.jurisdictionCode).toBe('KE')
      expect(record.lastReviewedAt).toBe('August 2026')
      expect(record.category).toBeDefined()
      expect(record.tags.length).toBeGreaterThan(0)
      expect(record.canonicalPath).toBe(`/knowledge-base/${record.slug}`)
    }
  })

  it('verifies search query discovery for Sprint 4 Batch 1 supporting guides', () => {
    // Search: ODPC Renewal
    const renewalResults = filterStaticKnowledgeBase({ search: 'ODPC renewal' })
    expect(renewalResults.map((a) => a.slug)).toContain(
      'odpc-data-protection-registration-renewal-kenya'
    )

    // Search: goAML
    const goamlResults = filterStaticKnowledgeBase({ search: 'goAML' })
    expect(goamlResults.map((a) => a.slug)).toContain(
      'frc-goaml-registration-str-reporting-guide'
    )

    // Search: Checklist
    const checklistResults = filterStaticKnowledgeBase({ search: 'checklist' })
    expect(checklistResults.map((a) => a.slug)).toContain(
      'kenya-fintech-compliance-checklist-calendar'
    )
  })

  it('verifies upward hub-and-spoke internal linking in new supporting guides', () => {
    const cwd = process.cwd()

    const renewalContent = fs.readFileSync(
      path.join(
        cwd,
        'app/(public)/knowledge-base/odpc-data-protection-registration-renewal-kenya/page.tsx'
      ),
      'utf-8'
    )
    expect(renewalContent).toContain('/kenya/odpc-data-protection-compliance')

    const goamlContent = fs.readFileSync(
      path.join(
        cwd,
        'app/(public)/knowledge-base/frc-goaml-registration-str-reporting-guide/page.tsx'
      ),
      'utf-8'
    )
    expect(goamlContent).toContain('/kenya/aml-cft-fintech-compliance')

    const checklistContent = fs.readFileSync(
      path.join(
        cwd,
        'app/(public)/knowledge-base/kenya-fintech-compliance-checklist-calendar/page.tsx'
      ),
      'utf-8'
    )
    expect(checklistContent).toContain('/kenya/fintech-compliance-requirements')
  })

  it('verifies zero occurrences of stale legal phrases across all Sprint 4 guides', () => {
    const cwd = process.cwd()
    const s04Pages = [
      'app/(public)/knowledge-base/odpc-data-protection-registration-renewal-kenya/page.tsx',
      'app/(public)/knowledge-base/frc-goaml-registration-str-reporting-guide/page.tsx',
      'app/(public)/knowledge-base/kenya-fintech-compliance-checklist-calendar/page.tsx',
    ]

    const prohibitedPhrases = [
      'POCAMLA Cap 59B',
      'POCAMLA Cap. 59B',
      'within 7 days',
      'US$10,000 CTR',
      'annual licence renewal',
      'annual license renewal',
      'Regulation 9(3)',
    ]

    for (const pagePath of s04Pages) {
      const content = fs.readFileSync(path.join(cwd, pagePath), 'utf-8')
      for (const phrase of prohibitedPhrases) {
        expect(content, `Found stale phrase "${phrase}" in ${pagePath}`).not.toContain(phrase)
      }
    }
  })
})
