# SheriaBot SEO Programme — Production Release Manifest
**Release ID:** `SEO-REL-001`  
**Date:** 2026-08-25  
**Document ID:** `SEO-REL-DOC-MANIFEST-001`  
**Release Scope:** Complete Production Code & Contract Manifest for Sprints SEO-S01 through SEO-S06  
**Target Branch:** `feat/phase3-multi-jurisdiction-comparison` -> Operator Deployment Target  

---

## 1. Release Inventory & Classification Table

| File Path | Originating Sprint | Technical Classification | Purpose & Description | Release Required? |
| :--- | :--- | :--- | :--- | :--- |
| `app/robots.ts` | `SEO-S01` | `FRONTEND_CODE` | Dynamic robots.txt generation protecting private SaaS routes | **YES** |
| `app/sitemap.ts` | `SEO-S01` | `SITEMAP` | Authoritative dynamic XML sitemap with all Wave A & KB routes | **YES** |
| `lib/site-url.ts` | `SEO-S01` | `METADATA` | Central HTTPS canonical site URL resolver | **YES** |
| `components/seo/seo-breadcrumb-json-ld.tsx` | `SEO-S01` | `STRUCTURED_DATA` | Reusable BreadcrumbList JSON-LD component | **YES** |
| `components/seo/seo-authority-article-layout.tsx` | `SEO-S03` | `STRUCTURED_DATA` / `LAYOUT` | Standardized authority layout with Article JSON-LD & citations | **YES** |
| `app/(public)/kenya/page.tsx` | `SEO-S03` | `ROUTING` | Server 308 redirect from `/kenya` to master compliance hub | **YES** |
| `app/(public)/kenya/fintech-compliance-requirements/page.tsx` | `SEO-S03` | `CONTENT` / `PAGE` | Master Kenya FinTech Regulatory Compliance Hub (`SEO-S03-KE-HUB-001`) | **YES** |
| `app/(public)/kenya/cbk-digital-credit-provider-compliance/page.tsx` | `SEO-S03` | `CONTENT` / `PAGE` | CBK Digital Credit Provider Statutory Guide (`SEO-S03-KE-SPOKE-CBK-002`) | **YES** |
| `app/(public)/kenya/odpc-data-protection-compliance/page.tsx` | `SEO-S03` | `CONTENT` / `PAGE` | ODPC Data Protection Statutory Guide (`SEO-S03-KE-SPOKE-ODPC-003`) | **YES** |
| `app/(public)/kenya/aml-cft-fintech-compliance/page.tsx` | `SEO-S03` | `CONTENT` / `PAGE` | FRC POCAMLA Statutory Guide (`SEO-S03-KE-SPOKE-AML-004`) | **YES** |
| `app/(public)/kenya/regulatory-sandbox-guide/page.tsx` | `SEO-S03` | `CONTENT` / `PAGE` | CMA & CBK Regulatory Sandbox Guide (`SEO-S03-KE-SPOKE-SANDBOX-005`) | **YES** |
| `lib/seo/seo-static-knowledge-base-registry.ts` | `SEO-S03` / `SEO-S04` | `STATIC_REGISTRY` | Static Knowledge Base registry with tokenized multi-word search | **YES** |
| `app/(public)/knowledge-base/page.tsx` | `SEO-S03` / `SEO-S04` | `FRONTEND_CODE` | Integrated dynamic & static KB listing, search, and filtering | **YES** |
| `app/(public)/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide/page.tsx` | `SEO-S03` | `CONTENT` / `PAGE` | CBK DCP Annual Return Guide (`SEO-S03-KE-KB-CBK-RETURN-006`) | **YES** |
| `app/(public)/knowledge-base/dpia-data-protection-impact-assessment-kenya/page.tsx` | `SEO-S03` | `CONTENT` / `PAGE` | ODPC DPIA Assessment Guide (`SEO-S03-KE-KB-ODPC-DPIA-007`) | **YES** |
| `app/(public)/knowledge-base/odpc-data-protection-registration-renewal-kenya/page.tsx` | `SEO-S04` | `CONTENT` / `PAGE` | ODPC Registration & Renewal Guide (`SEO-S04-KE-KB-ODPC-RENEWAL-012`) | **YES** |
| `app/(public)/knowledge-base/frc-goaml-registration-str-reporting-guide/page.tsx` | `SEO-S04` | `CONTENT` / `PAGE` | FRC goAML Registration & STR Guide (`SEO-S04-KE-KB-FRC-GOAML-013`) | **YES** |
| `app/(public)/knowledge-base/kenya-fintech-compliance-checklist-calendar/page.tsx` | `SEO-S04` | `CONTENT` / `PAGE` | FinTech Compliance Checklist & Calendar (`SEO-S04-KE-KB-CHECKLIST-014`) | **YES** |
| `app/(public)/kenya/regulatory-change-tracker/page.tsx` | `SEO-S05` | `LINKABLE_ASSET` / `PAGE` | Kenya FinTech Regulatory Change Tracker (`SEO-S05-KE-ASSET-REGTRACKER-010`) | **YES** |
| `app/__tests__/seo-sitemap-contracts.test.ts` | `SEO-S01` | `TEST` | Contract test enforcing public sitemap routes & private exclusions | **YES** |
| `app/__tests__/seo-robots-contracts.test.ts` | `SEO-S01` | `TEST` | Contract test enforcing robots.txt disallow and allow rules | **YES** |
| `app/__tests__/seo-canonical-contracts.test.ts` | `SEO-S01` | `TEST` | Contract test enforcing HTTPS self-referential canonical URLs | **YES** |
| `app/__tests__/seo-kenya-authority-routes-contracts.test.ts` | `SEO-S03` | `TEST` | Contract test validating Wave A routes and /kenya redirect | **YES** |
| `app/__tests__/seo-kenya-metadata-contracts.test.ts` | `SEO-S03` | `TEST` | Contract test validating titles, descriptions, and OpenGraph tags | **YES** |
| `app/__tests__/seo-kenya-internal-links-contracts.test.ts` | `SEO-S03` | `TEST` | Contract test validating upward and lateral cluster linking | **YES** |
| `app/__tests__/seo-kenya-publication-gates.test.ts` | `SEO-S03` | `TEST` | Contract test strictly enforcing Wave B publication blocks | **YES** |
| `app/__tests__/seo-knowledge-base-static-registry-contracts.test.ts` | `SEO-S03` / `SEO-S04` | `TEST` | Contract test enforcing KB search, filtering, and duplicate-slug guards | **YES** |
| `app/__tests__/seo-content-governance-contracts.test.ts` | `SEO-S04` | `TEST` | Contract test validating content opportunity scorecard & calendar schemas | **YES** |
| `app/__tests__/seo-linkable-assets-contracts.test.ts` | `SEO-S05` | `TEST` | Contract test validating regulatory tracker citations, dates & sitemap | **YES** |
| `app/__tests__/seo-production-readiness-contracts.test.ts` | `SEO-S06` | `TEST` | Contract test validating 16 release inventory routes & regional gates | **YES** |

---

## 2. Release Scope Isolation Verification

* **Frontend Scope:** All changes are 100% contained within `fintech-regulatory-platform`.
* **Backend Scope:** `fintech-regulatory-backend` contains 0 SEO modifications and is not required for SEO deployment.
* **Dirty Files / Unrelated Feature Work:** 0 unrelated files present in working directory.

---

## 3. Secret & Debug Invariant Review

* **Secrets & Credentials:** Zero hardcoded API keys, JWT tokens, IntaSend keys, or HMAC secrets.
* **Debug Artifacts:** Zero `console.log` statements in authority layouts, zero preview host leaks (`localhost`, `*.vercel.app`).
* **Canonical Host:** All rendered metadata enforces `https://sheriabot.com`.
