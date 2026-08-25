/**
 * SheriaBot SEO
 * File ID: SEO-S03-TEST-LINKS-016
 * Purpose: Automated contract test validating hub-and-spoke linking and legal-claim regression prevention
 * Sprint: SEO Sprint 3
 */

import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('SEO Kenya Internal Links & Legal Regression Contracts', () => {
  const waveAPages = [
    'app/(public)/kenya/fintech-compliance-requirements/page.tsx',
    'app/(public)/kenya/cbk-digital-credit-provider-compliance/page.tsx',
    'app/(public)/kenya/odpc-data-protection-compliance/page.tsx',
    'app/(public)/kenya/aml-cft-fintech-compliance/page.tsx',
    'app/(public)/kenya/regulatory-sandbox-guide/page.tsx',
    'app/(public)/knowledge-base/dpia-data-protection-impact-assessment-kenya/page.tsx',
    'app/(public)/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide/page.tsx',
  ]

  it('verifies upward and lateral link architecture in Wave A components', () => {
    const cwd = process.cwd()

    const dpiaContent = fs.readFileSync(
      path.join(cwd, 'app/(public)/knowledge-base/dpia-data-protection-impact-assessment-kenya/page.tsx'),
      'utf-8'
    )
    expect(dpiaContent).toContain('/kenya/odpc-data-protection-compliance')

    const dcpAnnualContent = fs.readFileSync(
      path.join(cwd, 'app/(public)/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide/page.tsx'),
      'utf-8'
    )
    expect(dcpAnnualContent).toContain('/kenya/cbk-digital-credit-provider-compliance')

    const hubContent = fs.readFileSync(
      path.join(cwd, 'app/(public)/kenya/fintech-compliance-requirements/page.tsx'),
      'utf-8'
    )
    expect(hubContent).toContain('/kenya/cbk-digital-credit-provider-compliance')
    expect(hubContent).toContain('/kenya/odpc-data-protection-compliance')
    expect(hubContent).toContain('/kenya/aml-cft-fintech-compliance')
    expect(hubContent).toContain('/kenya/regulatory-sandbox-guide')
  })

  it('verifies zero occurrences of stale/prohibited legal formulations in new authority pages', () => {
    const cwd = process.cwd()
    const prohibitedPhrases = [
      'POCAMLA Cap 59B',
      'POCAMLA Cap. 59B',
      'within 7 days',
      '7 days of forming suspicion',
      'US$10,000 CTR',
      'annual licence renewal',
      'annual license renewal',
      'Regulation 9(3)',
    ]

    for (const pageRelPath of waveAPages) {
      const fullPath = path.join(cwd, pageRelPath)
      const content = fs.readFileSync(fullPath, 'utf-8')

      for (const phrase of prohibitedPhrases) {
        expect(
          content,
          `Prohibited stale legal phrase "${phrase}" found in ${pageRelPath}`
        ).not.toContain(phrase)
      }
    }
  })
})
