# SheriaBot SEO — Live Route & Canonical Verification Matrix
**File ID:** `SEO-S03-RR-DOC-ROUTES-002`  
**Review ID:** `SEO-S03-RR`  
**Sprint:** `SEO-S03`  
**Status:** Validated  

---

## 1. Route Status & Canonical Matrix

| Route Path | HTTP Status | Prerender Type | Canonical URL | Indexable | OG Type | Title Tag Standard |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/kenya` | `308 (Redirect)` | Static (`next/navigation`) | `https://sheriabot.com/kenya/fintech-compliance-requirements` | No (Redirect) | N/A | N/A |
| `/kenya/fintech-compliance-requirements` | `200 OK` | Prerendered Static (SSG) | `https://sheriabot.com/kenya/fintech-compliance-requirements` | `Yes` | `article` | `Kenya FinTech Compliance & Regulations: Master Guide \| SheriaBot` |
| `/kenya/cbk-digital-credit-provider-compliance` | `200 OK` | Prerendered Static (SSG) | `https://sheriabot.com/kenya/cbk-digital-credit-provider-compliance` | `Yes` | `article` | `CBK Digital Credit Provider Licence Kenya: Compliance Guide \| SheriaBot` |
| `/kenya/odpc-data-protection-compliance` | `200 OK` | Prerendered Static (SSG) | `https://sheriabot.com/kenya/odpc-data-protection-compliance` | `Yes` | `article` | `ODPC Data Controller Registration & Compliance Kenya \| SheriaBot` |
| `/kenya/aml-cft-fintech-compliance` | `200 OK` | Prerendered Static (SSG) | `https://sheriabot.com/kenya/aml-cft-fintech-compliance` | `Yes` | `article` | `Kenya AML/CFT & POCAMLA FinTech Compliance Guide \| SheriaBot` |
| `/kenya/regulatory-sandbox-guide` | `200 OK` | Prerendered Static (SSG) | `https://sheriabot.com/kenya/regulatory-sandbox-guide` | `Yes` | `article` | `Kenya CMA Regulatory Sandbox: FinTech Application Guide \| SheriaBot` |
| `/knowledge-base/dpia-data-protection-impact-assessment-kenya` | `200 OK` | Prerendered Static (SSG) | `https://sheriabot.com/knowledge-base/dpia-data-protection-impact-assessment-kenya` | `Yes` | `article` | `Data Protection Impact Assessment (DPIA) Guide Kenya \| SheriaBot` |
| `/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide` | `200 OK` | Prerendered Static (SSG) | `https://sheriabot.com/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide` | `Yes` | `article` | `CBK DCP Annual Fee & Compliance Return Guide \| SheriaBot` |

---

## 2. Blocked Routes (Wave B Negative Verification)

| Route Path | Expected HTTP | Sitemap Entry | Self-Canonical | Gate Status |
| :--- | :--- | :--- | :--- | :--- |
| `/kenya/cbk-payment-service-provider-licensing` | `404 Not Found` | `ABSENT (0 matches)` | `NONE` | `BLOCKED` |
| `/kenya/cbk-cybersecurity-compliance` | `404 Not Found` | `ABSENT (0 matches)` | `NONE` | `BLOCKED` |
| `/knowledge-base/form-cbk-dcp-1-application-guide` | `404 Not Found` | `ABSENT (0 matches)` | `NONE` | `BLOCKED` |

---

## 3. Preview Environment Protection

On Vercel Preview environments (`process.env.VERCEL_ENV === "preview"`), the global robots metadata and sitemap generator enforce `robots: { index: false, follow: false }` across all public routes, preventing accidental indexing of pre-release builds.
