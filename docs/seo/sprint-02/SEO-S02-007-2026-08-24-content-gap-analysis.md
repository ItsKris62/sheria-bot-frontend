# SheriaBot SEO — Kenya Content Gap & Cannibalization Analysis
**File ID:** `SEO-S02-DOC-CONTENT-GAPS-007`  
**Sprint:** `SEO-S02`  
**Purpose:** Gap analysis between current SheriaBot indexable pages and Kenya search universe + internal cannibalization audit  
**Status:** Final Research Baseline  

---

## 1. Content Gap Inventory

Comparing existing public pages against the verified Kenya keyword universe reveals significant high-intent search gaps:

| Keyword Cluster | Current Coverage Status | Existing URL (if any) | Gap Nature & Diagnosis | Strategic Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| `fintech compliance Kenya` | **NOT COVERED** | None | No central authoritative Kenya regulatory pillar exists. Homepage ranks broadly but lacks deep statutory breakdown. | **CREATE NEW** `/kenya/fintech-compliance-requirements` |
| `digital credit provider licence Kenya` | **NOT COVERED** | None | No public guide on CBK DCP 2022 Regulations, despite deep backend support in `seed-regulatory-frameworks.sql` (`cbk-dcp-2022`). | **CREATE NEW** `/kenya/cbk-digital-credit-provider-compliance` |
| `payment service provider licence Kenya` | **NOT COVERED** | None | High-value commercial intent query with zero public guidance on NPS Act tiers or trust accounts. | **CREATE NEW** `/kenya/cbk-payment-service-provider-licensing` |
| `ODPC data controller registration Kenya` | **COVERED WEAKLY** | `/data-protection` | Existing `/data-protection` is an internal legal policy modal, NOT an educational authority guide on ODPC registration. | **CREATE NEW** `/kenya/odpc-data-protection-compliance` |
| `AML compliance Kenya fintech` | **NOT COVERED** | None | No public page on POCAMLA, FRC reporting, or KYC thresholds. | **CREATE NEW** `/kenya/aml-cft-fintech-compliance` |
| `compliance software Kenya` | **COVERED WEAKLY** | `/solutions/startups`, `/pricing` | Solutions page discusses features but lacks structured target keywords for Kenya RegTech and GRC queries. | **OPTIMIZE** `/solutions/startups` & `/solutions/enterprise` |
| `CBK cybersecurity guidelines fintech` | **NOT COVERED** | None | Zero public coverage of CBK 2017 Guidance Note or cloud hosting regulations for banks and fintechs. | **CREATE NEW** `/kenya/cbk-cybersecurity-compliance` |
| `Kenya regulatory sandbox CMA` | **NOT COVERED** | None | Zero public guidance on sandbox entry criteria or live testing guidelines. | **CREATE NEW** `/kenya/regulatory-sandbox-guide` |

---

## 2. Content Cannibalization Audit

An audit of existing indexable routes (`/solutions/*`, `/blog`, `/knowledge-base`, `/data-protection`, `/privacy`, `/security`) was conducted to detect overlapping keyword targets:

| Keyword Cluster | URL A | URL B | Cannibalization Risk | Diagnosis & Resolution |
| :--- | :--- | :--- | :--- | :--- |
| `data protection policy Kenya` | `/data-protection` (Legal Policy) | `/privacy` (Privacy Notice) | **LOW** | `/data-protection` is our internal statutory data governance policy; `/privacy` is the customer privacy notice. Both are distinct legal documents. Self-canonicals prevent conflict. |
| `fintech compliance software` | `/solutions/startups` | `/solutions/enterprise` | **LOW** | Clear persona separation: Startups targets seed-to-Series A licensing/DCP readiness; Enterprise targets multi-entity GRC & API integrations. |
| `data controller registration` | `/data-protection` (Legal Policy) | Proposed `/kenya/odpc-data-protection-compliance` | **MEDIUM** | Risk: Crawlers might treat `/data-protection` as the educational guide. Resolution: `/data-protection` remains labeled as "Company Legal Document"; the `/kenya/...` guide acts as the external educational pillar. |
| `pricing and plans` | `/pricing` | `/solutions/startups` | **NONE** | `/pricing` contains the complete interactive tier matrix; `/solutions/*` links into pricing via CTAs. |

---

## 3. Existing Blog & Knowledge Base Inventory & Action Plan

| Content Item / Topic | Current Location | Search Intent | Parent Cluster | Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| Regulatory Framework Updates | `/blog/[slug]` | Informational (TOFU) | General Kenya FinTech | **KEEP & LINK**: Retain ISR dynamic rendering; add contextual backlinks to parent `/kenya/...` authority guides. |
| Legal Knowledge Base Articles | `/knowledge-base/[slug]` | Informational (TOFU/MOFU) | Specific Acts / Statutes | **EXPAND & RESTRUCTURE**: Ingest focused procedural explainers (e.g. Form CBK DCP 1, DPIA Guide) under KB and link to pillar hubs. |
| Internal Legal Overlays | `/(.)data-protection`, `/(.)privacy` | Legal / Policy | Company Governance | **KEEP**: Standalone legal documents with self-canonical and standard legal metadata. |
