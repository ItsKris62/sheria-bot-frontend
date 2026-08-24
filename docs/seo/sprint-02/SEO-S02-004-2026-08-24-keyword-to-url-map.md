# SheriaBot SEO — Kenya Keyword-to-URL Ownership Map
**File ID:** `SEO-S02-DOC-KEYWORD-URL-MAP-004`  
**Sprint:** `SEO-S02`  
**Purpose:** Single source of truth assigning strict 1-to-1 keyword cluster ownership to prevent internal cannibalization  
**Status:** Final Research Baseline  

---

## 1. Ownership Principles & Cannibalization Prevention Rules

To ensure maximum ranking power in Kenya, SheriaBot enforces four strict routing rules:

1. **One Primary URL per Search Intent:** Every primary keyword cluster is owned by exactly ONE URL. Multiple pages must NEVER target the identical primary query.
2. **Differentiated Content Typology:**
   * `/kenya/...` = Authoritative evergreen regulatory intelligence & operational guides (MOFU/TOFU).
   * `/solutions/...` = Commercial software positioning & capability landing pages (BOFU).
   * `/knowledge-base/...` = Granular statutory definitions & single-issue procedural explainers (TOFU).
   * `/blog/...` = Timely regulatory news, gazette updates, and thought leadership (TOFU/MOFU).
3. **No Thin Secondary Pages:** Related secondary terms are merged into the comprehensive primary authority guide rather than split across thin subpages.
4. **Contextual Upward Linking:** Knowledge Base and Blog articles must pass PageRank up to their parent `/kenya/...` pillar page.

---

## 2. Complete Keyword-to-URL Allocation Matrix

| Cluster ID | Primary Target Keyword | Secondary Variations | Intent | Funnel | Target URL | Content Type | Priority | Cannibalization Guard |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CL-01** | `fintech compliance Kenya` | `fintech regulations Kenya`, `fintech regulatory requirements Kenya`, `fintech regulatory compliance Kenya` | Commercial Investigation | MOFU | `/kenya/fintech-compliance-requirements` | Regulatory Pillar Hub | **P0 (Critical)** | Do not write general blog post with identical title. |
| **CL-02** | `digital credit provider licence Kenya` | `digital lender licence Kenya`, `DCP licence Kenya`, `CBK digital lender requirements`, `Form CBK DCP 1` | Commercial Investigation | MOFU | `/kenya/cbk-digital-credit-provider-compliance` | Deep Regulatory Guide | **P0 (Critical)** | Consolidate all DCP licensing search intent here. |
| **CL-03** | `payment service provider licence Kenya` | `PSP licence Kenya CBK`, `payment regulations Kenya`, `National Payment System Act Kenya compliance`, `e-money issuer licence` | Commercial Investigation | MOFU | `/kenya/cbk-payment-service-provider-licensing` | Deep Regulatory Guide | **P0 (Critical)** | Cover all 4 NPS PSP tiers on this single guide. |
| **CL-04** | `ODPC data controller registration Kenya` | `Data Protection Act Kenya compliance`, `ODPC registration requirements fintech`, `data processor registration Kenya` | Commercial Investigation | MOFU | `/kenya/odpc-data-protection-compliance` | Deep Regulatory Guide | **P0 (Critical)** | Do not confuse with generic `/data-protection` legal policy. |
| **CL-05** | `AML compliance Kenya fintech` | `POCAMLA compliance Kenya`, `KYC requirements Kenya fintech`, `FRC reporting requirements Kenya`, `suspicious transaction reporting Kenya` | Commercial Investigation | MOFU | `/kenya/aml-cft-fintech-compliance` | Deep Regulatory Guide | **P0 (Critical)** | Merge POCAMLA, FRC, and KYC operational terms. |
| **CL-06** | `compliance software Kenya` | `regtech Kenya`, `compliance management software Kenya`, `regulatory monitoring software Kenya` | Transactional | BOFU | `/solutions/startups` & `/solutions/enterprise` | Commercial Solution Page | **P0 (Critical)** | Target commercial software intent on solution pages. |
| **CL-07** | `CBK cybersecurity guidelines fintech` | `fintech cybersecurity compliance Kenya`, `cloud hosting regulations Kenya financial institutions` | Commercial Investigation | MOFU | `/kenya/cbk-cybersecurity-compliance` | Deep Regulatory Guide | **P1 (High)** | Address CBK 2017 Guidance Note & cloud hosting rules. |
| **CL-08** | `Kenya regulatory sandbox CMA CBK` | `CMA fintech sandbox Kenya`, `regulatory sandbox fintech Kenya` | Commercial Investigation | MOFU | `/kenya/regulatory-sandbox-guide` | Deep Regulatory Guide | **P1 (High)** | Unify CMA and CBK sandbox application requirements. |
| **CL-09** | `DPIA Kenya template fintech` | `data protection impact assessment Kenya fintech`, `ODPC DPIA requirements` | Commercial Investigation | BOFU | `/knowledge-base/dpia-data-protection-impact-assessment-kenya` | Knowledge Base Article | **P1 (High)** | Link directly to in-app policy drafting generator. |
| **CL-10** | `digital credit provider annual renewal CBK` | `DCP licence renewal requirements Kenya`, `CBK DCP annual returns` | Commercial Investigation | MOFU | `/knowledge-base/cbk-dcp-annual-licence-renewal-guide` | Knowledge Base Article | **P1 (High)** | Capture yearly December 31 compliance surge. |

---

## 3. URL Architecture Hierarchy & Structure

```
https://sheriabot.com
│
├── /solutions                                     [Commercial Hub]
│   ├── /solutions/startups                       (Keywords: "fintech compliance software Kenya", "regtech startup")
│   ├── /solutions/enterprise                     (Keywords: "enterprise compliance software Kenya", "GRC software")
│   └── /solutions/regulators                     (Keywords: "regulatory supervision software", "policy drafting AI")
│
├── /kenya                                         [Kenya Regulatory Authority Hub]
│   ├── /kenya/fintech-compliance-requirements    (Pillar: "fintech compliance Kenya", "fintech regulations Kenya")
│   ├── /kenya/cbk-digital-credit-provider-compliance (Guide: "digital credit provider licence Kenya", "DCP licence")
│   ├── /kenya/cbk-payment-service-provider-licensing (Guide: "payment service provider licence Kenya", "PSP licence")
│   ├── /kenya/odpc-data-protection-compliance   (Guide: "ODPC data controller registration Kenya", "DPA 2019")
│   ├── /kenya/aml-cft-fintech-compliance        (Guide: "AML compliance Kenya", "POCAMLA requirements fintech")
│   ├── /kenya/cbk-cybersecurity-compliance      (Guide: "CBK cybersecurity guidelines", "fintech cloud hosting")
│   └── /kenya/regulatory-sandbox-guide          (Guide: "Kenya regulatory sandbox", "CMA fintech sandbox")
│
├── /knowledge-base                                [Operational & Term Reference]
│   ├── /knowledge-base/dpia-data-protection-impact-assessment-kenya
│   ├── /knowledge-base/cbk-dcp-annual-licence-renewal-guide
│   └── /knowledge-base/[slug]                    (Dynamic statutory explainers)
│
└── /blog                                          [Regulatory Intelligence & News]
    └── /blog/[slug]                              (Dynamic gazette analysis & commentary)
```
