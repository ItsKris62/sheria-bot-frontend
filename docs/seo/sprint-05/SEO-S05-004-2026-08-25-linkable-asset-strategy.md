# SheriaBot SEO — Linkable Asset Strategy & Hero Asset Selection
**File ID:** `SEO-S05-DOC-ASSETS-004`  
**Sprint:** `SEO-S05`  
**Review Status:** Audited & Verified (`SEO-S05-RR`)  

---

## 1. Evaluation of Candidate Linkable Assets

| Candidate Asset | Concept Description | Target Linking Audience | Citation Potential | Implementation Complexity | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A. Kenya FinTech Regulatory Change Tracker** | Structured registry of gazetted notices, circulars, and amendments across CBK, ODPC, FRC, and CMA. | Tech journalists, VC analysts, compliance officers, founders | **VERY HIGH** | Moderate | **SELECTED HERO ASSET** |
| **B. Kenya FinTech Regulatory Map** | Interactive decision tree mapping business models to governing regulators. | Startup accelerators, founders, law students | HIGH | High | Phase 2 Candidate |
| **C. Annual FinTech Compliance Benchmark** | Data-backed industry survey of compliance costs and audit findings. | Industry researchers, business press | HIGH | High (Requires Survey Data) | Future Research Asset |
| **D. FinTech Statutory Deadlines Calendar** | Consolidated annual deadlines matrix across all regulators. | In-house legal counsel, CFOs | MODERATE | Low (Implemented in S04) | Supporting Asset |
| **E. East Africa FinTech Regulatory Landscape Report** | Comparative multi-jurisdiction regulatory study. | Institutional investors, policy makers | HIGH | High | Future Research Asset |

---

## 2. Selected Hero Linkable Asset Specification

* **Selected Hero Asset:** **Kenya FinTech Regulatory Change Tracker**
* **Target Route:** `/kenya/regulatory-change-tracker` (`SEO-S05-KE-ASSET-REGTRACKER-010`)
* **Primary Search & Citation Intent:** `Kenya fintech regulatory updates`, `CBK circulars fintech`, `ODPC regulatory notices Kenya`.
* **Data Source:** Static Server Component record constant (`REGULATORY_CHANGES`) audited against official gazette publications and primary regulator repositories.
* **Freshness Model:** Manual, Git-governed review upon gazette publication. Automated pipeline integration is planned as a future enhancement.
* **Expected Linking Audience:** Technology reporters needing citations for breaking regulatory stories; compliance advisors referencing official primary legal notices; startup directories referencing compliance data.
* **Core Value Layer:** Chronological registry of primary regulatory events with legal notice numbers, regulatory authority, effective dates, and verified primary document links.
