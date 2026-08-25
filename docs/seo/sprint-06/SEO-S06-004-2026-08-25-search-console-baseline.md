# SheriaBot SEO — Search Console & Performance Baseline
**File ID:** `SEO-S06-DOC-GSC-BASELINE-004`  
**Sprint:** `SEO-S06`  
**Review Status:** Pre-Production Audit / Baseline Measurement Protocol  

---

## 1. Google Search Console Connection Status

```text
GOOGLE SEARCH CONSOLE STATUS:
ACCESS_NOT_AVAILABLE (Pre-production environment awaiting operator domain verification)

SEARCH PERFORMANCE DATA:
DATA NOT AVAILABLE (Pre-deployment phase)

PRODUCTION MEASUREMENT:
BLOCKED PENDING DEPLOYMENT
```

---

## 2. Intended Canonical Search Console Property

* **Recommended Property Type:** **Domain Property** (`sheriabot.com`) via DNS TXT record verification.
* **Coverage:** Automatically consolidates all protocols (`http://`, `https://`) and host prefixes (`www.sheriabot.com`, `sheriabot.com`).
* **Sitemap Target:** `https://sheriabot.com/sitemap.xml`

---

## 3. Priority URL Inspection & Submission Hierarchy

Upon operator production deployment, the following priority submission queue should be submitted for URL Inspection in GSC:

### Tier 1: Core Authority Pillars & Hero Assets (Day 1 Post-Deploy)
1. `https://sheriabot.com/` (Homepage)
2. `https://sheriabot.com/kenya/fintech-compliance-requirements` (Master Pillar)
3. `https://sheriabot.com/kenya/cbk-digital-credit-provider-compliance` (CBK Spoke)
4. `https://sheriabot.com/kenya/odpc-data-protection-compliance` (ODPC Spoke)
5. `https://sheriabot.com/kenya/aml-cft-fintech-compliance` (FRC Spoke)
6. `https://sheriabot.com/kenya/regulatory-sandbox-guide` (Sandbox Spoke)
7. `https://sheriabot.com/kenya/regulatory-change-tracker` (Hero Linkable Asset)

### Tier 2: Static Operational Knowledge Base Guides (Day 2–3 Post-Deploy)
8. `https://sheriabot.com/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide`
9. `https://sheriabot.com/knowledge-base/dpia-data-protection-impact-assessment-kenya`
10. `https://sheriabot.com/knowledge-base/odpc-data-protection-registration-renewal-kenya`
11. `https://sheriabot.com/knowledge-base/frc-goaml-registration-str-reporting-guide`
12. `https://sheriabot.com/knowledge-base/kenya-fintech-compliance-checklist-calendar`

---

## 4. Search Console KPI Baseline Tracking Framework

To be populated by the operator after the first 28 days of live search data accumulation:

| Dimension | Metric Target (Month 1) | Metric Target (Month 3) | Primary Target Queries |
| :--- | :--- | :--- | :--- |
| **Total Impressions (Kenya)** | Baseline Accumulation | > 5,000 / mo | `fintech compliance kenya`, `cbk dcp regulations`, `odpc registration` |
| **Total Clicks** | Baseline Accumulation | > 350 / mo | Informational & Commercial Search Intent |
| **Average CTR (Kenya)** | > 3.5% | > 5.5% | High-intent regulatory queries |
| **Average Position (Top 10 Clusters)**| Top 20 | Top 5 | Primary authority spokes |
