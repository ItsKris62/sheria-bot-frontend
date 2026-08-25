# SheriaBot SEO — Kenya Topic Cluster Architecture
**File ID:** `SEO-S02-DOC-TOPIC-CLUSTERS-005`  
**Sprint:** `SEO-S02`  
**Purpose:** Structural design of hub-and-spoke topic clusters to establish overwhelming topical authority in Kenya  
**Status:** Final Research Baseline  

---

## 1. The Hub-and-Spoke Topic Cluster Strategy

Google evaluates domain expertise based on **topical depth and inter-connectivity**. Rather than isolated blog posts, SheriaBot structures all Kenya content into 5 interconnected **Regulatory Topic Clusters**.

Each cluster contains:
* **Pillar / Hub Page:** Comprehensive 2,500+ word evergreen guide covering the full regulatory landscape with primary law citations.
* **Supporting Spokes:** Focused Knowledge Base articles and Blog posts addressing specific sub-topics, forms, or procedural questions.
* **Bidirectional Hyperlinks:** Spokes pass authority upward to the Pillar; the Pillar links contextually down to Spokes and out to the Product.

---

## 2. Topic Cluster Blueprints

### Cluster 1: The Master Kenya FinTech Pillar
* **Hub URL:** `/kenya/fintech-compliance-requirements`
* **Primary Query:** `fintech compliance Kenya`
* **Coverage:** Complete architectural overview of the 5 regulatory bodies (CBK, ODPC, FRC, CMA, CAK), licensing paths by business model, compliance timeline, and common pitfalls.
* **Child Spokes:**
  * Spokes link back to `/kenya/fintech-compliance-requirements` with anchor: `"Kenya fintech compliance requirements"`.

---

### Cluster 2: CBK Digital Credit Providers (DCP)
* **Hub URL:** `/kenya/cbk-digital-credit-provider-compliance`
* **Primary Query:** `digital credit provider licence Kenya`
* **Statutory Grounding:** CBK Act Cap 491, CBK (Digital Credit Providers) Regulations 2022.
* **Hub Scope:**
  * Who is required to get a DCP licence vs who is exempt.
  * Regulation 5 licensing terms: perpetual validity unless suspended/revoked under Regulation 5(5); annual KES 20,000 fee under Regulation 5(6) and Second Schedule; mandatory annual return certifying compliance under Regulation 5(7) due on or before December 31 each year.
  * Fit & proper requirements for directors and shareholders (CBK/PG/02).
  * Capital requirements and application fees (KES 20,000).
  * Required policies: AML, Consumer Protection, Credit Risk, Data Privacy.
  * Step-by-step submission via CBK GDI Portal.
* **Spoke Sub-Topics:**
  1. `Form CBK DCP 1 Application Guide & Required Exhibits` (`/knowledge-base/...`)
  2. `CBK DCP Annual Compliance Return & Fee Submission Guide` (`/knowledge-base/...`)
  3. `Consumer Protection & Debt Collection Restrictions under DCP 2022` (`/knowledge-base/...`)

---

### Cluster 3: Payment Service Providers & National Payment Systems (PSP)
* **Hub URL:** `/kenya/cbk-payment-service-provider-licensing`
* **Primary Query:** `payment service provider licence Kenya`
* **Statutory Grounding:** National Payment System Act 2011, NPS Regulations 2014.
* **Hub Scope:**
  * Licensing tiers: Electronic Retail PSP, Small E-Money, E-Money Issuer, Designated Payment Instrument (specific tiered capital adequacy schedules subject to primary gazetted instrument verification).
  * Mandatory Trust Account / Float management structure.
  * Interoperability and merchant acquiring rules.
  * CBK Banking & Payment Services department submission process.
* **Spoke Sub-Topics:**
  1. `PSP Capital Adequacy & Core Capital Calculation in Kenya` (`/knowledge-base/...`)
  2. `Trust Account Setup & Float Safeguarding for E-Money Issuers` (`/knowledge-base/...`)
  3. `Payment Gateway & Aggregator Licensing Requirements under NPS Act` (`/knowledge-base/...`)

---

### Cluster 4: Data Protection & ODPC
* **Hub URL:** `/kenya/odpc-data-protection-compliance`
* **Primary Query:** `ODPC data controller registration Kenya`
* **Statutory Grounding:** Data Protection Act 2019, Data Protection (Registration) Regulations 2021, Data Protection (General) Regulations 2021.
* **Hub Scope:**
  * Mandatory registration thresholds: The small-entity exemption does not apply where the processing falls within a Third Schedule mandatory-registration purpose, including the provision of financial services.
  * Registration certificate validity: 24 months under Regulation 9; renewal governed by Regulation 11.
  * Data Controller vs Data Processor differentiation and fee tiers.
  * Form DPR1 online submission steps on the ODPC portal.
  * Notifiable data breach rules (Section 43): applies where personal data has been accessed/acquired without authorization AND there is a real risk of harm to the data subject; must notify the Data Commissioner without delay and within 72 hours of becoming aware.
  * Data Protection Impact Assessments (DPIA) under Section 31 DPA and Regulation 49 General Regulations 2021 (statutory high-risk processing test).
  * Cross-border personal data transfer constraints (Section 48).
* **Spoke Sub-Topics:**
  1. `Fintech DPIA Guide: Conducting Impact Assessments for Lending Apps` (`/knowledge-base/...`)
  2. `Notifiable Data Breach Incident Response & Reporting Workflow for ODPC Kenya` (`/knowledge-base/...`)
  3. `Cross-Border Financial Data Transfer Rules under Kenya DPA 2019` (`/knowledge-base/...`)

---

### Cluster 5: AML / CFT & Financial Reporting Centre (FRC)
* **Hub URL:** `/kenya/aml-cft-fintech-compliance`
* **Primary Query:** `AML compliance Kenya fintech`
* **Statutory Grounding:** POCAMLA Cap. 59A, POCAMLA Regulations 2023, Prevention of Terrorism Act.
* **Hub Scope:**
  * Reporting Institution registration obligations with FRC under POCAMLA Section 47A.
  * Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) protocols.
  * Politically Exposed Persons (PEP) screening obligations in Kenya.
  * Suspicious Transaction Reporting (STR) within two days after the suspicion arose under Section 44(2).
  * Cash Transaction Reporting (CTR) thresholds: US$15,000 or its equivalent in another currency under Section 44(6), Fourth Schedule and Regulation 40 of POCAMLA Regulations 2023 (legacy sources referenced prior US$10,000 / KES 1,000,000 threshold).
  * Appointing a qualified Money Laundering Reporting Officer (MLRO).
* **Spoke Sub-Topics:**
  1. `Fintech AML/CFT Policy Requirements: Mandatory Clauses & Risk Assessment` (`/knowledge-base/...`)
  2. `FRC goAML Registration & Electronic Reporting Guide for Fintechs` (`/knowledge-base/...`)
  3. `PEP Screening & Sanctions Compliance in Kenyan Financial Services` (`/knowledge-base/...`)
