# SheriaBot SEO — Kenya Search Intent & Funnel Map
**File ID:** `SEO-S02-DOC-INTENT-MAP-003`  
**Sprint:** `SEO-S02`  
**Purpose:** Mapping user personas, search queries, search intent categories, and funnel conversion hooks  
**Status:** Final Research Baseline  

---

## 1. Persona Taxonomy

In Kenya's fintech and regulatory compliance ecosystem, 4 primary search personas determine query intent and conversion behavior:

1. **Fintech Founder / CEO (`Persona A`):** Wants rapid clarity on whether a product is legal, what licenses are required, cost of compliance, and how fast they can launch without regulatory enforcement.
2. **Head of Compliance / AML Officer (`Persona B`):** Needs exact statutory references, reporting deadlines (FRC, CBK, ODPC), operational checklists, and audit-ready proof.
3. **Legal Counsel / In-House Lawyer (`Persona C`):** Seeks precise section-by-section legal citations, statutory interpretation, cross-framework comparisons, and policy drafting support.
4. **Product Manager / Engineering Lead (`Persona D`):** Looks for data protection thresholds, notifiable data breach protocols (real risk of harm standard), data residency rules, and technical security mandates.

---

## 2. Comprehensive Search Intent Mapping

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THE SHERIABOT INTENT & CONVERSION FUNNEL                                                                 │
├────────────────────────────────┬──────────────────────────────────────────┬──────────────────────────────┤
│ TOP OF FUNNEL (TOFU)           │ MIDDLE OF FUNNEL (MOFU)                  │ BOTTOM OF FUNNEL (BOFU)      │
│ Intent: Informational          │ Intent: Commercial Investigation         │ Intent: Transactional        │
│ "What are the rules?"          │ "How do I meet the requirements?"        │ "Which software solves this?"│
│ Goal: Organic Traffic & Trust  │ Goal: Free Trial / Interactive Checklist │ Goal: Paid Subscription / Demo│
└────────────────────────────────┴──────────────────────────────────────────┴──────────────────────────────┘
```

| Search Query | Search Intent | Funnel Stage | Primary Persona | User Question / Problem | Recommended Conversion Hook |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `fintech regulations Kenya` | Informational | TOFU | Founder / PM | "What regulatory bodies oversee fintech in Kenya?" | Free Kenya FinTech Regulatory Overview Guide |
| `Data Protection Act Kenya summary` | Informational | TOFU | Legal / Founder | "What are the 8 data protection principles under DPA 2019?" | Knowledge Base Article + Statute Citation Chip |
| `CBK fintech regulations` | Informational | TOFU | Founder / Legal | "Does CBK regulate my specific fintech business model?" | Interactive Compliance Query Engine |
| `what is a digital credit provider Kenya` | Informational | TOFU | Founder / PM | "Does my app count as a digital lender under CBK rules?" | DCP Readiness Assessment Checklist |
| `POCAMLA Kenya summary` | Informational | TOFU | Compliance | "What constitutes a reporting institution under POCAMLA?" | Free AML/CFT Statutory Guidance Note |
| `digital credit provider licence Kenya requirements`| Commercial Investigation| MOFU | Founder / Compliance | "What documents and capital do I need for a DCP licence?" | Step-by-Step Form CBK DCP 1 Checklist + Tool |
| `payment service provider licence Kenya capital requirements`| Commercial Investigation| MOFU | Founder / CFO | "What is the minimum capital for a retail PSP vs e-money?" | Interactive PSP Capital Tier Comparison Table |
| `ODPC data controller registration requirements`| Commercial Investigation| MOFU | Compliance / Legal | "Do I meet the KES 5M / 10 employee mandatory threshold?" | Free ODPC Registration Threshold Calculator |
| `DPIA template Kenya fintech` | Commercial Investigation| MOFU | DPO / PM | "How do I perform a Data Protection Impact Assessment?" | Downloadable DPIA Structure + AI Policy Generator |
| `AML policy Kenya fintech requirements` | Commercial Investigation| MOFU | Compliance Officer | "What mandatory clauses must exist in our AML/KYC policy?" | AI-Generated Statutory AML Policy Preview |
| `CMA regulatory sandbox eligibility Kenya` | Commercial Investigation| MOFU | Founder / Product | "Can we test our new financial product in the CMA sandbox?" | Sandbox Checklist + Pre-Application Review |
| `compliance software Kenya` | Transactional | BOFU | Head of Compliance / CEO | "What software is available to automate Kenya compliance?" | 14-Day Free Trial (No Credit Card Required) |
| `regtech Kenya software` | Transactional | BOFU | Compliance / CTO | "Which local RegTech platforms support CBK & ODPC tracking?" | Interactive Product Demo / Book Enterprise Call |
| `compliance management software Kenya` | Transactional | BOFU | Compliance Officer | "How can our team manage multi-framework audits in one place?" | Start Free Startup / Business Plan Trial |
| `regulatory gap analysis tool Kenya` | Transactional | BOFU | Risk Lead / Legal | "How do I score our current policies against Kenyan law?" | Run Free Instant Regulatory Gap Analysis |

---

## 3. Intent Routing Strategy

1. **Informational Queries (TOFU):** Direct to **Knowledge Base** (`/knowledge-base/...`) or **Kenya Topic Cluster Guides** (`/kenya/...`). Primary goal is high topical authority, zero fluff, and citing primary statutes.
2. **Commercial Investigation Queries (MOFU):** Direct to dedicated **Kenya Regulatory Hub Authority Pages** (`/kenya/cbk-digital-credit-provider-compliance`, `/kenya/odpc-data-protection-compliance`). These pages must provide comprehensive breakdowns + interactive widgets/checklists.
3. **Transactional Queries (BOFU):** Direct to **Solution & Pricing Pages** (`/solutions/startups`, `/solutions/enterprise`, `/pricing`). Emphasize transparent pricing, instant 14-day free trials, enterprise security, and verified local statutory grounding.
