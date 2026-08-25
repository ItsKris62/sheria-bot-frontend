# SheriaBot SEO — Regional Expansion Readiness Matrix (Rwanda & Malawi)
**File ID:** `SEO-S06-DOC-REGIONAL-006`  
**Sprint:** `SEO-S06`  
**Review Status:** Strategic Assessment & Architecture Planning  

---

## 1. Regional Expansion Policy Principles

1. **Evidence Readiness Over Page Count:** No public SEO authority pages may be created for a jurisdiction without verified statutory corpus ingestion, claim verification, and localized RAG accuracy in the core product.
2. **Zero Generic Duplicate Content:** Renaming "Kenya" to "Rwanda" without jurisdiction-specific statutory instruments (e.g. National Bank of Rwanda directives, Data Protection Law N° 058/2021) is strictly prohibited.
3. **URL Directory Namespace:** Future regional authority hubs will follow the top-level country directory structure:
   - `/rwanda/fintech-compliance-requirements`
   - `/malawi/fintech-compliance-requirements`

---

## 2. Multi-Jurisdiction SEO Readiness Audit Matrix

| Governance / Technical Dimension | Kenya (`/kenya/*`) | Rwanda (`/rwanda/*`) | Malawi (`/malawi/*`) |
| :--- | :--- | :--- | :--- |
| **Product Corpus & Ingestion** | **READY** (CBK, ODPC, FRC, CMA) | **PARTIAL** (BNR sandbox & DPA 2021 corpus mapped) | **NOT_READY** (Corpus pipeline pending) |
| **Primary Statutory Citations** | **READY** (Gazette verified) | **PARTIAL** (Primary PDFs required) | **NOT_READY** (Unverified) |
| **Claim-Verification Engine** | **READY** (Verified in CI) | **NOT_READY** (Jurisdiction routing pending) | **NOT_READY** (Pending) |
| **Search Intent & Keyword Universe**| **READY** (Documented in S02)| **PARTIAL** (Kigali FinTech Hub mapped) | **NOT_READY** (Unmapped) |
| **Static Pre-Rendering & Hub Routes**| **READY** (7 routes deployed)| **NOT_READY** (No routes created in S06) | **NOT_READY** (No routes created in S06) |
| **Automated CI Contract Tests** | **READY** (33 test files green)| **NOT_READY** (No tests created) | **NOT_READY** (No tests created) |
| **Maintenance & Operator Ownership**| **READY** (Documented S04/S05)| **NOT_READY** (Pending operator allocation)| **NOT_READY** (Pending) |
| **OVERALL SEO READINESS VERDICT** | **READY FOR PRODUCTION** | **NOT SEO READY (PHASE 2 TARGET)** | **NOT SEO READY (PHASE 3 TARGET)** |

---

## 3. Recommended Regional Expansion Sequencing

* **Phase 1 (Current):** Complete Kenya production deployment and establish Search Console authority baseline.
* **Phase 2 (Post-90 Days):** Ingest and claim-verify Rwandan statutory corpus (National Bank of Rwanda Regulation No. 22/2017 governing Payment Services, Law N° 058/2021 relating to the protection of personal data and privacy). Author Rwanda Regulatory Evidence Matrix prior to page implementation.
* **Phase 3:** Evaluate Malawi (Reserve Bank of Malawi Payment Systems Act & Financial Crimes Act) following Rwandan market establishment.
