/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-CANONICAL-003
 * Purpose: Automated contract test enforcing unique, self-referencing canonical URLs on all public routes
 * Sprint: SEO Sprint 1
 */

import { describe, expect, it } from "vitest"
import { absoluteUrl } from "@/lib/site-url"
import { metadata as homeMetadata } from "@/app/(public)/page"
import { metadata as pricingMetadata } from "@/app/(public)/pricing/page"
import { metadata as aboutMetadata } from "@/app/(public)/about/page"
import { metadata as solutionsMetadata } from "@/app/(public)/solutions/page"
import { metadata as startupsMetadata } from "@/app/(public)/solutions/startups/page"
import { metadata as enterpriseMetadata } from "@/app/(public)/solutions/enterprise/page"
import { metadata as regulatorsMetadata } from "@/app/(public)/solutions/regulators/page"
import { metadata as contactMetadata } from "@/app/(public)/contact/layout"
import { metadata as securityMetadata } from "@/app/(public)/security/page"
import { metadata as privacyMetadata } from "@/app/(public)/privacy/page"
import { metadata as termsMetadata } from "@/app/(public)/terms/page"
import { metadata as careersMetadata } from "@/app/(public)/careers/page"
import { metadata as dataProtectionMetadata } from "@/app/(public)/data-protection/page"
import { metadata as pilotMetadata } from "@/app/(public)/pilot/page"
import { metadata as unsubscribeMetadata } from "@/app/(public)/unsubscribe/layout"

describe("SEO Canonical & Metadata Contracts", () => {
  it("ensures all public indexable pages have unique, self-referencing canonical URLs", () => {
    const contracts = [
      { name: "home", meta: homeMetadata, expectedPath: "/" },
      { name: "pricing", meta: pricingMetadata, expectedPath: "/pricing" },
      { name: "about", meta: aboutMetadata, expectedPath: "/about" },
      { name: "contact", meta: contactMetadata, expectedPath: "/contact" },
      { name: "solutions", meta: solutionsMetadata, expectedPath: "/solutions" },
      { name: "solutions/startups", meta: startupsMetadata, expectedPath: "/solutions/startups" },
      { name: "solutions/enterprise", meta: enterpriseMetadata, expectedPath: "/solutions/enterprise" },
      { name: "solutions/regulators", meta: regulatorsMetadata, expectedPath: "/solutions/regulators" },
      { name: "security", meta: securityMetadata, expectedPath: "/security" },
      { name: "privacy", meta: privacyMetadata, expectedPath: "/privacy" },
      { name: "terms", meta: termsMetadata, expectedPath: "/terms" },
      { name: "careers", meta: careersMetadata, expectedPath: "/careers" },
      { name: "data-protection", meta: dataProtectionMetadata, expectedPath: "/data-protection" },
    ]

    for (const { name, meta, expectedPath } of contracts) {
      expect(meta.title, `Missing title on ${name}`).toBeDefined()
      expect(meta.description, `Missing description on ${name}`).toBeDefined()
      expect(meta.alternates?.canonical, `Missing canonical on ${name}`).toBe(absoluteUrl(expectedPath))
      
      // Ensure no localhost or preview leaked into production canonicals
      expect(meta.alternates?.canonical).not.toContain("localhost")
    }
  })

  it("verifies pilot and unsubscribe routes are marked noindex", () => {
    expect(pilotMetadata.robots).toMatchObject({ index: false })
    expect(unsubscribeMetadata.robots).toMatchObject({ index: false, follow: false })
  })
})
