/**
 * SheriaBot SEO
 * File ID: SEO-S03-TEST-KB-REGISTRY-018
 * Purpose: Automated contract test validating static Knowledge Base registry discovery, search, filtering, and duplicate-slug protection
 * Sprint: SEO Sprint 3
 */

import { describe, expect, it } from 'vitest'
import {
  getStaticKnowledgeBaseRecords,
  filterStaticKnowledgeBase,
  mergeKnowledgeBaseDiscovery,
  type StaticKnowledgeBaseRecord,
} from '@/lib/seo/seo-static-knowledge-base-registry'
import type { PublishedKnowledgeBaseResponse } from '@/components/knowledge-base/types'

describe('SEO Knowledge Base Static Registry Contracts', () => {
  const records = getStaticKnowledgeBaseRecords()

  it('ensures both SEO-S03 static KB articles exist in the registry with unique slugs and Kenya jurisdiction', () => {
    expect(records.length).toBeGreaterThanOrEqual(2)

    const slugs = records.map((r) => r.slug)
    expect(slugs).toContain('dpia-data-protection-impact-assessment-kenya')
    expect(slugs).toContain('cbk-dcp-annual-compliance-return-fees-guide')
    expect(new Set(slugs).size).toBe(slugs.length)

    for (const record of records) {
      expect(record.jurisdiction).toBe('Kenya')
      expect(record.jurisdictionCode).toBe('KE')
      expect(record.canonicalPath).toBe(`/knowledge-base/${record.slug}`)
      expect(record.title).toBeDefined()
      expect(record.excerpt).toBeDefined()
      expect(record.lastReviewedAt).toBe('August 2026')
    }
  })

  it('verifies search discoverability for DPIA and CBK DCP search queries', () => {
    // Search: DPIA
    const dpiaSearchResults = filterStaticKnowledgeBase({ search: 'DPIA' })
    expect(dpiaSearchResults.map((a) => a.slug)).toContain(
      'dpia-data-protection-impact-assessment-kenya'
    )

    // Search: Data Protection Impact Assessment
    const dpiaFullSearchResults = filterStaticKnowledgeBase({
      search: 'Data Protection Impact Assessment',
    })
    expect(dpiaFullSearchResults.map((a) => a.slug)).toContain(
      'dpia-data-protection-impact-assessment-kenya'
    )

    // Search: CBK DCP
    const cbkDcpSearchResults = filterStaticKnowledgeBase({ search: 'CBK DCP' })
    expect(cbkDcpSearchResults.map((a) => a.slug)).toContain(
      'cbk-dcp-annual-compliance-return-fees-guide'
    )

    // Search: compliance return
    const returnSearchResults = filterStaticKnowledgeBase({ search: 'compliance return' })
    expect(returnSearchResults.map((a) => a.slug)).toContain(
      'cbk-dcp-annual-compliance-return-fees-guide'
    )
  })

  it('verifies category and tag filtering discoverability', () => {
    // Category: Data Protection
    const dataProtectionArticles = filterStaticKnowledgeBase({ category: 'Data Protection' })
    expect(dataProtectionArticles.map((a) => a.slug)).toContain(
      'dpia-data-protection-impact-assessment-kenya'
    )
    expect(dataProtectionArticles.map((a) => a.slug)).not.toContain(
      'cbk-dcp-annual-compliance-return-fees-guide'
    )

    // Category: Digital Lending
    const lendingArticles = filterStaticKnowledgeBase({ category: 'Digital Lending' })
    expect(lendingArticles.map((a) => a.slug)).toContain(
      'cbk-dcp-annual-compliance-return-fees-guide'
    )
    expect(lendingArticles.map((a) => a.slug)).not.toContain(
      'dpia-data-protection-impact-assessment-kenya'
    )

    // Tag: ODPC
    const odpcTagArticles = filterStaticKnowledgeBase({ tag: 'ODPC' })
    expect(odpcTagArticles.map((a) => a.slug)).toContain(
      'dpia-data-protection-impact-assessment-kenya'
    )

    // Tag: CBK
    const cbkTagArticles = filterStaticKnowledgeBase({ tag: 'CBK' })
    expect(cbkTagArticles.map((a) => a.slug)).toContain(
      'cbk-dcp-annual-compliance-return-fees-guide'
    )
  })

  it('merges static registry articles into normalized published KB discovery response', () => {
    const mockBackendResponse: PublishedKnowledgeBaseResponse = {
      items: [
        {
          id: 'backend-article-1',
          title: 'General Fintech Overview',
          slug: 'general-fintech-overview',
          excerpt: 'Overview of African fintech.',
          category: 'Fintech',
          subcategory: null,
          tags: ['Fintech'],
          publishedAt: '2026-08-01T00:00:00.000Z',
          updatedAt: '2026-08-01T00:00:00.000Z',
          viewCount: 10,
          readingTime: 3,
          author: null,
        },
      ],
      pagination: {
        page: 1,
        limit: 9,
        total: 1,
        totalPages: 1,
      },
    }

    const merged = mergeKnowledgeBaseDiscovery(mockBackendResponse, { page: 1, limit: 9 })
    expect(merged.pagination.total).toBe(records.length + 1) // backend + all static registry items
    const itemSlugs = merged.items.map((i) => i.slug)
    expect(itemSlugs).toContain('dpia-data-protection-impact-assessment-kenya')
    expect(itemSlugs).toContain('general-fintech-overview')
  })

  it('strictly fails closed (throws Error) when backend publishes a duplicate static slug', () => {
    const collidingBackendResponse: PublishedKnowledgeBaseResponse = {
      items: [
        {
          id: 'backend-colliding-article',
          title: 'DPIA Article from CMS',
          slug: 'dpia-data-protection-impact-assessment-kenya',
          excerpt: 'Colliding article description.',
          category: 'Data Protection',
          subcategory: null,
          tags: ['DPIA'],
          publishedAt: '2026-08-01T00:00:00.000Z',
          updatedAt: '2026-08-01T00:00:00.000Z',
          viewCount: 5,
          readingTime: 4,
          author: null,
        },
      ],
      pagination: {
        page: 1,
        limit: 9,
        total: 1,
        totalPages: 1,
      },
    }

    expect(() =>
      mergeKnowledgeBaseDiscovery(collidingBackendResponse, { page: 1, limit: 9 })
    ).toThrowError(/Duplicate Knowledge Base slug ownership/)
  })
})
