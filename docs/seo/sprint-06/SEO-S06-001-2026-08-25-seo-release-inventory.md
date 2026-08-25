# SheriaBot SEO — Initial SEO Programme Release Inventory (Sprints 01–05)
**File ID:** `SEO-S06-DOC-RELEASE-INVENTORY-001`  
**Sprint:** `SEO-S06`  
**Scope:** Complete Asset & Infrastructure Inventory for Operator Production Deployment  

---

## 1. Executive Release Scope

This inventory enumerates all code, static routes, registry entries, contract tests, and documentation artifacts authored across Sprints `SEO-S01` through `SEO-S05` within the `feat/phase3-multi-jurisdiction-comparison` branch.

All changes are strictly isolated to `fintech-regulatory-platform` (Frontend & Marketing Architecture). The backend repository (`fintech-regulatory-backend`) contains zero SEO modifications.

---

## 2. Inventory by Technical Component Classification

### A. Core Routing & Technical SEO (`SEO-S01`)
* `app/robots.ts` (`FRONTEND_CODE`): Authoritative dynamic robots generator enforcing public crawlability and protecting private dashboard routes.
* `app/sitemap.ts` (`SITEMAP`): Authoritative dynamic XML sitemap aggregating static marketing routes, Kenya authority routes, static KB articles, and dynamic blog entries.
* `lib/site-url.ts` (`METADATA`): Canonical base URL helper ensuring uniform HTTPS resolution.

### B. Kenya Regulatory Authority Pillar & Spoke Pages (`SEO-S03`)
* `app/(public)/kenya/page.tsx` (`ROUTING`): Server redirect (308) permanently routing `/kenya` to `/kenya/fintech-compliance-requirements`.
* `app/(public)/kenya/fintech-compliance-requirements/page.tsx` (`CONTENT` / `FRONTEND_CODE`): Master Kenya FinTech Pillar Hub (`SEO-S03-KE-HUB-001`).
* `app/(public)/kenya/cbk-digital-credit-provider-compliance/page.tsx` (`CONTENT` / `FRONTEND_CODE`): CBK DCP Statutory Guide (`SEO-S03-KE-SPOKE-CBK-002`).
* `app/(public)/kenya/odpc-data-protection-compliance/page.tsx` (`CONTENT` / `FRONTEND_CODE`): ODPC Data Protection Statutory Guide (`SEO-S03-KE-SPOKE-ODPC-003`).
* `app/(public)/kenya/aml-cft-fintech-compliance/page.tsx` (`CONTENT` / `FRONTEND_CODE`): FRC POCAMLA Statutory Guide (`SEO-S03-KE-SPOKE-AML-004`).
* `app/(public)/kenya/regulatory-sandbox-guide/page.tsx` (`CONTENT` / `FRONTEND_CODE`): CMA & CBK Regulatory Sandbox Guide (`SEO-S03-KE-SPOKE-SANDBOX-005`).

### C. Static Knowledge Base Authority Guides & Registry (`SEO-S03` & `SEO-S04`)
* `lib/seo/seo-static-knowledge-base-registry.ts` (`STATIC_REGISTRY`): Source-of-truth static registry merging pre-rendered authority articles with dynamic search/filter pipelines.
* `app/(public)/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide/page.tsx` (`CONTENT` / `FRONTEND_CODE`): CBK DCP Annual Return Guide (`SEO-S03-KE-KB-CBK-RETURN-006`).
* `app/(public)/knowledge-base/dpia-data-protection-impact-assessment-kenya/page.tsx` (`CONTENT` / `FRONTEND_CODE`): ODPC DPIA Assessment Guide (`SEO-S03-KE-KB-ODPC-DPIA-007`).
* `app/(public)/knowledge-base/odpc-data-protection-registration-renewal-kenya/page.tsx` (`CONTENT` / `FRONTEND_CODE`): ODPC Registration & Renewal Guide (`SEO-S04-KE-KB-ODPC-RENEWAL-012`).
* `app/(public)/knowledge-base/frc-goaml-registration-str-reporting-guide/page.tsx` (`CONTENT` / `FRONTEND_CODE`): FRC goAML Registration & STR Reporting Guide (`SEO-S04-KE-KB-FRC-GOAML-013`).
* `app/(public)/knowledge-base/kenya-fintech-compliance-checklist-calendar/page.tsx` (`CONTENT` / `FRONTEND_CODE`): FinTech Compliance Checklist & Calendar (`SEO-S04-KE-KB-CHECKLIST-014`).

### D. Hero Linkable Research Asset (`SEO-S05`)
* `app/(public)/kenya/regulatory-change-tracker/page.tsx` (`LINKABLE_ASSET` / `FRONTEND_CODE`): Kenya FinTech Regulatory Change Tracker (`SEO-S05-KE-ASSET-REGTRACKER-010`).

### E. Structured Data & Shared Layout Primitives (`SEO-S01` & `SEO-S03`)
* `components/seo/seo-authority-article-layout.tsx` (`STRUCTURED_DATA` / `FRONTEND_CODE`): Reusable layout embedding Breadcrumb JSON-LD, Article JSON-LD, and standardized primary authority links.
* `components/seo/seo-breadcrumb-json-ld.tsx` (`STRUCTURED_DATA`): Reusable breadcrumb structured data component.

### F. Automated Contract & Regression Tests (`TEST`)
* `app/__tests__/seo-sitemap-contracts.test.ts`
* `app/__tests__/seo-robots-contracts.test.ts`
* `app/__tests__/seo-canonical-contracts.test.ts`
* `app/__tests__/seo-kenya-authority-routes-contracts.test.ts`
* `app/__tests__/seo-kenya-metadata-contracts.test.ts`
* `app/__tests__/seo-kenya-internal-links-contracts.test.ts`
* `app/__tests__/seo-kenya-publication-gates.test.ts`
* `app/__tests__/seo-knowledge-base-static-registry-contracts.test.ts`
* `app/__tests__/seo-content-governance-contracts.test.ts`
* `app/__tests__/seo-linkable-assets-contracts.test.ts`

---

## 3. Wave B Publication Gate Enforcement (Negative Verification)

The following candidate routes remain **STRICTLY UNPUBLISHED / BLOCKED** from sitemaps, internal navigation, and search indexes:
1. `/kenya/cbk-payment-service-provider-licensing` (Pending PSP regulatory framework clearance)
2. `/kenya/cbk-cybersecurity-compliance` (Pending CBK cybersecurity guideline clearance)
3. `/knowledge-base/form-cbk-dcp-1-application-guide` (Pending DCP-1 application workflow validation)
