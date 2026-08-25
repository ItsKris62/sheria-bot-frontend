# SheriaBot SEO — Internal Link Architecture & Anchor Text Strategy
**File ID:** `SEO-S02-DOC-INTERNAL-LINKS-006`  
**Sprint:** `SEO-S02`  
**Purpose:** Internal PageRank flow, anchor text rules, breadcrumb hierarchy, and product conversion link paths  
**Status:** Final Research Baseline  

---

## 1. Information Architecture & PageRank Distribution Model

Authority must flow systematically from high-authority brand entry points (Homepage, Solutions) down into deep regulatory guides, while granular supporting spokes pass relevance upward.

```
                    ┌─────────────────────────┐
                    │     HOMEPAGE (/)        │
                    └────────────┬────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
┌───────────────────────┐                  ┌───────────────────────┐
│ /solutions (Hub)      │                  │ /kenya/fintech-       │
│ - /solutions/startups │                  │   compliance (Pillar) │
│ - /solutions/enterprise                  └───────────┬───────────┘
│ - /solutions/regulators                              │
└──────────┬────────────┘                              │
           │                                           │
           │         ┌─────────────────────────────────┴─────────────────────────────────┐
           │         ▼                                 ▼                                 ▼
           │  ┌──────────────┐                  ┌──────────────┐                  ┌──────────────┐
           │  │ /kenya/cbk-  │                  │ /kenya/cbk-  │                  │ /kenya/odpc- │
           │  │   dcp-guide  │                  │   psp-guide  │                  │   dpa-guide  │
           │  └──────┬───────┘                  └──────┬───────┘                  └──────┬───────┘
           │         │                                 │                                 │
           └─────────┼─────────────────────────────────┼─────────────────────────────────┘
                     ▼                                 ▼                                 ▼
             ┌──────────────┐                  ┌──────────────┐                  ┌──────────────┐
             │ /knowledge-  │                  │ /knowledge-  │                  │ /knowledge-  │
             │ base/spoke-1 │                  │ base/spoke-2 │                  │ base/spoke-3 │
             └──────────────┘                  └──────────────┘                  └──────────────┘
```

---

## 2. Anchor Text Strategy & Approved Vocabulary Matrix

To avoid algorithmic over-optimization penalties while maintaining descriptive relevance for search engines, SheriaBot enforces a **Descriptive Anchor Text Standard**.

### Rules:
* ❌ **BANNED:** `"click here"`, `"learn more"`, `"read this"`, `"here"`, `"article"`.
* ❌ **BANNED:** Repeatedly using 100% exact-match keywords on every internal link.
* ✅ **MANDATORY:** Contextual, grammatically natural phrases that describe the destination's exact subject matter.

### Approved Anchor Vocabulary Matrix

| Target Destination URL | Page Title / Purpose | Approved Natural Anchor Variations | Prohibited / Spammy Variations |
| :--- | :--- | :--- | :--- |
| `/kenya/fintech-compliance-requirements` | Master FinTech Pillar | `Kenya fintech regulatory framework`, `compliance obligations for Kenyan fintechs`, `Kenya financial sector regulation guide` | `fintech compliance Kenya` (repeated 50x across site) |
| `/kenya/cbk-digital-credit-provider-compliance` | CBK DCP Guide | `CBK digital credit provider requirements`, `licensing process for digital lenders in Kenya`, `Digital Credit Providers Regulations 2022` | `DCP licence`, `click here for DCP` |
| `/kenya/cbk-payment-service-provider-licensing` | CBK PSP Guide | `payment service provider licensing in Kenya`, `CBK NPS Act capital requirements`, `e-money and payment gateway authorization` | `PSP licence`, `payment licence Kenya` |
| `/kenya/odpc-data-protection-compliance` | ODPC Data Protection Guide | `ODPC data controller registration process`, `Kenya Data Protection Act 2019 compliance`, `statutory data protection obligations in Kenya` | `ODPC`, `data protection Kenya` |
| `/kenya/aml-cft-fintech-compliance` | AML / POCAMLA Guide | `AML and KYC requirements for Kenyan fintechs`, `POCAMLA compliance obligations`, `Financial Reporting Centre reporting rules` | `AML Kenya`, `POCAMLA` |
| `/solutions/startups` | Startup Solution Page | `SheriaBot startup compliance platform`, `automated compliance tools for emerging fintechs`, `licensing checklist software` | `compliance software`, `buy software` |
| `/pricing` | Pricing Page | `view SheriaBot plan comparison`, `transparent compliance platform pricing`, `14-day free evaluation trial` | `pricing`, `cheap compliance` |

---

## 3. Structural Breadcrumb Schema Hierarchy

Every regulatory page must render standard HTML breadcrumbs and structured JSON-LD `BreadcrumbList` matching the logical information hierarchy:

1. **Homepage:** `Home` (`/`)
2. **Country Hub:** `Kenya Compliance` (`/kenya/fintech-compliance-requirements`)
3. **Regulatory Pillar:** `CBK Regulation` (`/kenya/cbk-digital-credit-provider-compliance`)
4. **Knowledge Base Leaf:** `Form CBK DCP 1 Application Guide` (`/knowledge-base/...`)

---

## 4. Product Conversion Linking Rules

Every high-intent educational guide must provide non-intrusive, contextually relevant entry points to SheriaBot's live software capabilities:

* **DCP Guide:** Links to the *Interactive Licensing Readiness Checklist* & *AI Policy Generator*.
* **PSP Guide:** Links to the *Capital Adequacy & Trust Account Requirement Gap Tool*.
* **ODPC Guide:** Links to the *Data Protection Impact Assessment (DPIA) Workspace*.
* **AML Guide:** Links to the *Statutory AML Policy Drafter & KYC Threshold Tracker*.
