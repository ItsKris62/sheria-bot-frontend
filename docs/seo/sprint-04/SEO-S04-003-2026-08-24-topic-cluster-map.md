# SheriaBot SEO — Kenya Topic Cluster Architecture Map
**File ID:** `SEO-S04-DOC-CLUSTERS-003`  
**Sprint:** `SEO-S04`  
**Status:** Approved  

---

## 1. Master Cluster Architecture

```
                                  [ Cluster A: Master FinTech Hub ]
                             /kenya/fintech-compliance-requirements
                                             │
      ┌──────────────────────────────┬───────┴──────────────────────┬─────────────────────────────┐
      ▼                              ▼                              ▼                             ▼
[ Cluster B: CBK DCP ]      [ Cluster C: ODPC ]           [ Cluster D: AML/FRC ]       [ Cluster E: CMA Sandbox ]
/kenya/cbk-digital-credit   /kenya/odpc-data-protection   /kenya/aml-cft-fintech       /kenya/regulatory-sandbox
      │                              │                              │                             │
      ├─ DCP Annual Return           ├─ DPIA Guide                  ├─ goAML Registration         └─ Sandbox Eligibility
      ├─ Fit & Proper Vetting        ├─ Registration Renewal        ├─ STR 2-Day Filing              & Exit Pathways
      └─ Debt Collection Rules       └─ Breach Harm Test            └─ PEP / EDD Screening
```

---

## 2. Detailed Cluster Breakdown

### Cluster A: Master Kenya FinTech Compliance
* **Canonical Pillar Owner:** `/kenya/fintech-compliance-requirements`
* **Primary Query:** `fintech compliance Kenya`
* **Supporting Topics:**
  1. `kenya-fintech-compliance-checklist-calendar` (Consolidated operational calendar & deadlines)
  2. `fintech-regulatory-overview-kenya` (Multi-regulator classification roadmap)

### Cluster B: CBK Digital Credit Providers (DCP)
* **Canonical Pillar Owner:** `/kenya/cbk-digital-credit-provider-compliance`
* **Primary Query:** `digital credit provider licence Kenya`
* **Supporting Topics:**
  1. `cbk-dcp-annual-compliance-return-fees-guide` (Active in S03 — Reg 5(6)–(7) Dec 31 deadlines)
  2. `cbk-dcp-fit-and-proper-vetting-guide` (Director & shareholder vetting criteria under CBK/PG/02)
  3. `cbk-digital-lending-consumer-protection-rules` (Prohibited debt collection and harassment rules)

### Cluster C: ODPC Data Protection Compliance
* **Canonical Pillar Owner:** `/kenya/odpc-data-protection-compliance`
* **Primary Query:** `ODPC data controller registration Kenya`
* **Supporting Topics:**
  1. `dpia-data-protection-impact-assessment-kenya` (Active in S03 — Section 31 DPA & Reg 49)
  2. `odpc-data-protection-registration-renewal-kenya` (Regulation 11 renewal workflows before 24-month expiry)
  3. `odpc-section-43-breach-notification-harm-standard` (Real risk of harm test and 72-hour notifications)

### Cluster D: AML / CFT & POCAMLA Compliance
* **Canonical Pillar Owner:** `/kenya/aml-cft-fintech-compliance`
* **Primary Query:** `AML compliance Kenya fintech`
* **Supporting Topics:**
  1. `frc-goaml-registration-str-reporting-guide` (Section 47A portal setup & Section 44(2) 2-day STR mechanics)
  2. `fintech-cdd-edd-pep-screening-kenya` (Risk-based onboarding and beneficial ownership identification)
  3. `kenya-ctr-cash-transaction-reporting-thresholds` (US$15,000 equivalent reporting under Reg 40 of 2023 Regs)

### Cluster E: CMA Regulatory Sandbox
* **Canonical Pillar Owner:** `/kenya/regulatory-sandbox-guide`
* **Primary Query:** `Kenya CMA regulatory sandbox`
* **Supporting Topics:**
  1. `cma-sandbox-application-eligibility-criteria` (Innovation, consumer benefit, and test readiness benchmarks)
  2. `cma-sandbox-testing-period-exit-pathways` (12-month testing window, extensions, and commercial licensing)
