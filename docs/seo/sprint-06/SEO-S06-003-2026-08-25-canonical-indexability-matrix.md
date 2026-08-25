# SheriaBot SEO — Canonical & Indexability Matrix
**File ID:** `SEO-S06-DOC-CANONICAL-003`  
**Sprint:** `SEO-S06`  
**Review Status:** Code-Audited & Verified via CI Contracts (`app/__tests__/seo-canonical-contracts.test.ts`)  

---

## 1. Canonical Rules & Invariants

1. **Protocol & Host Invariant:** All canonical URLs resolve to `https://sheriabot.com` using the central helper `absoluteUrl(path)` from `@/lib/site-url`.
2. **Zero Collapse:** No secondary spoke or knowledge base article collapses to the homepage (`/`) or root `/kenya`.
3. **No Preview Hosts:** Vercel deployment preview URLs (`*.vercel.app`) or `localhost` never leak into canonical link tags or OpenGraph metadata.
4. **Self-Referencing:** Every standalone indexable article asserts its exact self-referential canonical URL.

---

## 2. Comprehensive Canonical & Meta Robots Matrix

| Public Route | Canonical Target | Robots Directives | OpenGraph URL | Breadcrumb Schema | Article Schema | Indexability Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `https://sheriabot.com/` | `index, follow` | `https://sheriabot.com/` | Yes | WebSite / Org | **INDEXABLE** |
| `/kenya` | N/A (Server 308) | `noindex, follow` | N/A | No | No | **REDIRECT ONLY** |
| `/kenya/fintech-compliance-requirements` | `https://sheriabot.com/kenya/fintech-compliance-requirements` | `index, follow` | `https://sheriabot.com/kenya/fintech-compliance-requirements` | Yes | Article | **INDEXABLE** |
| `/kenya/cbk-digital-credit-provider-compliance` | `https://sheriabot.com/kenya/cbk-digital-credit-provider-compliance` | `index, follow` | `https://sheriabot.com/kenya/cbk-digital-credit-provider-compliance` | Yes | Article | **INDEXABLE** |
| `/kenya/odpc-data-protection-compliance` | `https://sheriabot.com/kenya/odpc-data-protection-compliance` | `index, follow` | `https://sheriabot.com/kenya/odpc-data-protection-compliance` | Yes | Article | **INDEXABLE** |
| `/kenya/aml-cft-fintech-compliance` | `https://sheriabot.com/kenya/aml-cft-fintech-compliance` | `index, follow` | `https://sheriabot.com/kenya/aml-cft-fintech-compliance` | Yes | Article | **INDEXABLE** |
| `/kenya/regulatory-sandbox-guide` | `https://sheriabot.com/kenya/regulatory-sandbox-guide` | `index, follow` | `https://sheriabot.com/kenya/regulatory-sandbox-guide` | Yes | Article | **INDEXABLE** |
| `/kenya/regulatory-change-tracker` | `https://sheriabot.com/kenya/regulatory-change-tracker` | `index, follow` | `https://sheriabot.com/kenya/regulatory-change-tracker` | Yes | Article / WebPage | **INDEXABLE** |
| `/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide` | `https://sheriabot.com/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide` | `index, follow` | `https://sheriabot.com/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide` | Yes | Article | **INDEXABLE** |
| `/knowledge-base/dpia-data-protection-impact-assessment-kenya` | `https://sheriabot.com/knowledge-base/dpia-data-protection-impact-assessment-kenya` | `index, follow` | `https://sheriabot.com/knowledge-base/dpia-data-protection-impact-assessment-kenya` | Yes | Article | **INDEXABLE** |
| `/knowledge-base/odpc-data-protection-registration-renewal-kenya` | `https://sheriabot.com/knowledge-base/odpc-data-protection-registration-renewal-kenya` | `index, follow` | `https://sheriabot.com/knowledge-base/odpc-data-protection-registration-renewal-kenya` | Yes | Article | **INDEXABLE** |
| `/knowledge-base/frc-goaml-registration-str-reporting-guide` | `https://sheriabot.com/knowledge-base/frc-goaml-registration-str-reporting-guide` | `index, follow` | `https://sheriabot.com/knowledge-base/frc-goaml-registration-str-reporting-guide` | Yes | Article | **INDEXABLE** |
| `/knowledge-base/kenya-fintech-compliance-checklist-calendar` | `https://sheriabot.com/knowledge-base/kenya-fintech-compliance-checklist-calendar` | `index, follow` | `https://sheriabot.com/knowledge-base/kenya-fintech-compliance-checklist-calendar` | Yes | Article | **INDEXABLE** |

---

## 3. Protected Private Routes (Strict Noindex)

* `/admin/*` -> `noindex, nofollow` (Protected by `app/robots.ts` Disallow rule)
* `/startup/*` -> `noindex, nofollow` (Protected by `app/robots.ts` Disallow rule)
* `/regulator/*` -> `noindex, nofollow` (Protected by `app/robots.ts` Disallow rule)
* `/settings/*` -> `noindex, nofollow` (Protected by `app/robots.ts` Disallow rule)
* `/api/unsubscribe/*` -> `noindex, nofollow` (Protected by `app/robots.ts` Disallow rule)
