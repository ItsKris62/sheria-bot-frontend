# SheriaBot SEO — Content Freshness & Regulatory Dependency Policy
**File ID:** `SEO-S04-DOC-FRESHNESS-006`  
**Sprint:** `SEO-S04`  
**Status:** Approved  

---

## 1. Review Cadence & Thresholds

To maintain search trust and legal fidelity, SheriaBot content adheres to explicit review schedules:

| Content Tier | Route Pattern | Mandatory Review Cadence | Immediate Trigger |
| :--- | :--- | :--- | :--- |
| **Tier 1: Master Pillars** | `/kenya/*` | Every **90 Days** | Any gazetted amendment to parent statute |
| **Tier 2: Operational Guides**| `/knowledge-base/*` | Every **180 Days** | Regulator circular or form schedule revision |
| **Tier 3: Editorial Articles**| `/blog/*` | As needed / Event-driven | Fact correction or supersede notices |

---

## 2. Statutory Dependency Mapping

Each regulatory authority and knowledge base page maps directly to governing primary instruments:

| Page Route | Governing Primary Instruments | Secondary Regulatory Circulars |
| :--- | :--- | :--- |
| `/kenya/fintech-compliance-requirements` | CBK Act Cap. 491, DPA 2019, POCAMLA Cap. 59A, CMA Act Cap. 485A | National Payment System Act, Sector Regs |
| `/kenya/cbk-digital-credit-provider-compliance` | Central Bank of Kenya (DCP) Regulations, 2022 | CBK/PG/02 Fit & Proper Prudential Guidelines |
| `/kenya/odpc-data-protection-compliance` | Data Protection Act, 2019 | Data Protection (Registration) Regs 2021, General Regs 2021 |
| `/kenya/aml-cft-fintech-compliance` | POCAMLA Cap. 59A | POCAMLA Regulations 2023, FRC AML/CFT Guidelines |
| `/kenya/regulatory-sandbox-guide` | Capital Markets Act (Cap. 485A) | CMA (Regulatory Sandbox) Policy Guidance Notes, 2019 |
| `/knowledge-base/dpia-data-protection-impact-assessment-kenya` | Data Protection Act, 2019 (Sec 31) | Data Protection (General) Regs 2021 (Reg 49) |
| `/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide` | CBK (DCP) Regulations, 2022 (Reg 5) | CBK Supervisory Circulars & Annual Returns |
| `/knowledge-base/odpc-data-protection-registration-renewal-kenya`| Data Protection (Registration) Regs, 2021 (Reg 9 & 11) | ODPC Renewal Guidance Notes |
| `/knowledge-base/frc-goaml-registration-str-reporting-guide` | POCAMLA Cap. 59A (Sec 44 & 47A) | FRC goAML Registration Directives & LN 19/2023 |
| `/knowledge-base/kenya-fintech-compliance-checklist-calendar` | CBK Act Cap. 491, DPA 2019, POCAMLA Cap. 59A | Multi-Regulator Statutory Timelines |

---

## 3. Decay Detection & Review Actions

When automated freshness monitors (e.g. `W-CONTENT-07 Freshness Monitor`) detect that a published article requires attention:
1. `W-CONTENT-07` executes `agents.automation.runFreshnessReview`.
2. A `BlogFreshnessReview` record is created with risk tier, score, and action (`FRESH`, `REVIEW_SOON`, `HUMAN_REVIEW_REQUIRED`, `REVISION_REQUIRED`, `URGENT_REVISION`, `ARCHIVE_RECOMMENDED`).
3. If revision is recommended, a `BlogRevisionRequest` is persisted and surfaced for editorial action.
4. If urgent revision or archive is recommended, a high-severity `ContentOpsAlert` is triggered.
5. The published `BlogPost` is **not silently rewritten**, and its publication status remains unchanged until human editors review the revision request.
6. `lastReviewedAt` is updated only after an editorial review/revision workflow completes.
