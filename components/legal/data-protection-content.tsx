"use client"

import React from "react"

function DocSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary shrink-0">
          {number}
        </span>
        {title}
      </h2>
      <div className="space-y-3 pl-8 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="space-y-1.5 pl-3 border-l-2 border-border">{children}</div>
    </div>
  )
}

function LegalTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-primary/10">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-transparent" : "bg-muted/20"}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-muted-foreground align-top text-xs">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InfoTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      {rows.map(([label, value], i) => (
        <div
          key={i}
          className={`grid grid-cols-[180px_1fr] gap-3 px-4 py-2.5 text-sm ${
            i % 2 === 0 ? "bg-muted/30" : "bg-transparent"
          }`}
        >
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground">{value}</span>
        </div>
      ))}
    </div>
  )
}

function Callout({
  variant = "info",
  children,
}: {
  variant?: "info" | "warning"
  children: React.ReactNode
}) {
  const styles =
    variant === "warning"
      ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
      : "bg-primary/8 border-primary/20 text-muted-foreground"
  return (
    <div className={`rounded-lg border p-4 text-sm leading-relaxed ${styles}`}>
      {children}
    </div>
  )
}

export function DataProtectionContent() {
  return (
    <div className="space-y-8 text-sm">
      {/* Preamble */}
      <Callout>
        <strong className="text-foreground">SheriaBot Data Protection Governance Framework</strong> establishes the
        mandatory policies, technical standards, and operational controls enforced by{" "}
        <strong className="text-foreground">SheriaBot Technologies Limited</strong> to ensure compliance with the{" "}
        <strong className="text-foreground">Kenya Data Protection Act, 2019 (DPA)</strong>, the{" "}
        <strong className="text-foreground">Data Protection (General) Regulations, 2021 (Legal Notice No. 263 of 2021)</strong>, and statutory guidelines issued by the{" "}
        <strong className="text-foreground">Office of the Data Protection Commissioner (ODPC)</strong>. This framework governs all internal engineering, data processing operations, subprocessor engagements, and customer data handling.
      </Callout>

      {/* Section 1 */}
      <DocSection id="framework-scope" number="1" title="Governance Framework Scope and Regulatory Baseline">
        <p>
          This Data Protection Policy applies to all systems, microservices, databases, employee roles, and third-party subprocessors involved in the ingestion, storage, transmission, or processing of personal and corporate regulatory data across SheriaBot.
        </p>
        <InfoTable
          rows={[
            ["Applicable Legislation", "Kenya Data Protection Act, 2019 (Act No. 24 of 2019)"],
            ["Subsidiary Regulations", "Data Protection (General) Regulations, 2021 (LN 263/2021); Complaints Handling Regulations, 2021 (LN 264/2021); Registration Regulations, 2021 (LN 265/2021)"],
            ["Supervisory Authority", "Office of the Data Protection Commissioner (ODPC), Nairobi, Kenya"],
            ["Data Controller Scope", "User registration, corporate customer accounts, M-Pesa billing, platform audit logs, and direct outreach"],
            ["Data Processor Scope", "Customer Document Vault files, private gap analysis policy uploads, and organization-specific compliance context"],
            ["Designated DPO", "dpo@sheriabot.com"],
          ]}
        />
      </DocSection>

      {/* Section 2 */}
      <DocSection id="data-protection-principles" number="2" title="Application of Data Protection Principles (Section 25)">
        <p>
          In accordance with Section 25 of the DPA 2019, SheriaBot designs and operates its SaaS architecture upon eight core principles:
        </p>
        <div className="space-y-3">
          <SubSection title="1. Lawfulness, Fairness and Transparency (s.25(a))">
            <p>
              Personal data is processed strictly upon lawful grounds under Section 30(1). Transparent notices truthfully explain processing mechanics without unverified claims or obscure legal language.
            </p>
          </SubSection>
          <SubSection title="2. Purpose Limitation (s.25(b))">
            <p>
              Personal and corporate compliance data collected for regulatory analysis, document vaulting, and billing is never repurposed, sold, or rented for secondary commercial exploitation or unauthorized advertising.
            </p>
          </SubSection>
          <SubSection title="3. Data Minimization (s.25(c))">
            <p>
              Only strictly necessary data fields are collected. Structured backend logging explicitly strips all contact identifiers, passwords, phone numbers, and secrets via Pino redaction before log persistence.
            </p>
          </SubSection>
          <SubSection title="4. Accuracy (s.25(d))">
            <p>
              Data subjects are provided with continuous self-service profile and organization editing capabilities to maintain accurate and up-to-date records.
            </p>
          </SubSection>
          <SubSection title="5. Storage Limitation (s.25(e) & s.39)">
            <p>
              Data is retained only for active operational lifecycles, followed by structured quarantine and automated purge routines for accounts, queries, and vault files.
            </p>
          </SubSection>
          <SubSection title="6. Integrity and Confidentiality (s.25(f) & s.41)">
            <p>
              Multi-layered technical and organizational controls (TLS in transit, storage encryption at rest, TOTP MFA, and Redis session token revocation) safeguard data against unauthorized access, loss, or destruction.
            </p>
          </SubSection>
          <SubSection title="7. Accountability (s.25(g))">
            <p>
              SheriaBot maintains granular, immutable audit trails recording administrative access, system changes, consent grants, and security events.
            </p>
          </SubSection>
        </div>
      </DocSection>

      {/* Section 3 */}
      <DocSection id="architecture-subprocessors" number="3" title="Verified Architecture and Subprocessor Ecosystem">
        <p>
          SheriaBot operates a multi-cloud infrastructure designed for high availability, security isolation, and data protection compliance:
        </p>
        <LegalTable
          headers={["Subprocessor / System", "Service Function", "Data Transferred & Stored", "Location & DPA 2019 Transfer Basis"]}
          rows={[
            [
              "Supabase, Inc. (AWS)",
              "Relational Database & Auth Engine",
              "User profiles, organizations, query logs, auth credentials",
              "Frankfurt, Germany (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Cloudflare, Inc. (R2)",
              "Encrypted Binary Object Storage",
              "Customer uploaded compliance documents, gap analysis files, exports",
              "Global / United States (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Upstash, Inc.",
              "Serverless Redis Cache & Session Index",
              "Session revocation keys, TOTP setup keys (10m TTL), rate limits",
              "United States (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Anthropic, PBC",
              "Claude 3.5 Sonnet LLM Inference",
              "Compliance queries and uploaded policy text (in-memory prompt only)",
              "United States (Section 48(a) Commercial API DPA)",
            ],
            [
              "Pinecone Systems, Inc.",
              "Semantic Regulatory Vector Index",
              "Public Kenyan legislation & guidelines (NO customer files indexed)",
              "United States (Non-personal public corpus)",
            ],
            [
              "PostHog, Inc.",
              "Product Telemetry & Feature Flags",
              "Pseudonymous user IDs, roles, plan tiers (Session replay disabled)",
              "Frankfurt, Germany (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Functional Software (Sentry)",
              "Application Crash Diagnostics",
              "Error stack traces with automated PII & header redaction",
              "United States / EU (Section 48(a) PII Scrubbed Ingress)",
            ],
            [
              "Resend, Inc.",
              "Transactional & Notification Email",
              "Recipient email addresses, names, password reset tokens",
              "United States (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Microsoft Azure",
              "Workflow & Automation Engine (Hosting n8n)",
              "Regulatory signal metadata, workflow execution IDs",
              "Global / EU / US (Section 48(a) Appropriate Safeguards)",
            ],
            [
              "IntaSend Payments Limited",
              "M-Pesa STK Push & Payment Webhooks",
              "Phone numbers (254XXXXXXXXX), transaction IDs, amounts (KES)",
              "Nairobi, Kenya (Domestic Kenyan Processing / CBK Regulated)",
            ],
            [
              "Render Services, Inc.",
              "Backend Fastify Node.js Container",
              "Runtime compute layer for API execution",
              "United States (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Vercel, Inc.",
              "Frontend Next.js Application & Edge CDN",
              "Client web requests, IP routing, edge caching",
              "United States / Global Edge (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
          ]}
        />
      </DocSection>

      {/* Section 4 */}
      <DocSection id="ai-governance" number="4" title="AI Governance and Data Isolation Architecture">
        <p>
          SheriaBot enforces rigorous boundaries to prevent confidential corporate data or personal data from leaking into foundation AI models:
        </p>
        <div className="space-y-3">
          <SubSection title="1. Public Corpus vs Private Customer Data Separation">
            <p>
              The Pinecone vector search database is populated <strong className="text-foreground">exclusively with public Kenyan legislation, regulations, guidelines, and gazettes</strong>. Customer-uploaded compliance policies, internal audit reports, and private prompts are <strong className="text-foreground">NEVER indexed or stored in Pinecone</strong>.
            </p>
          </SubSection>
          <SubSection title="2. Model Training Excluded">
            <p>
              Under our commercial API terms with Anthropic, PBC, data submitted via API endpoints is strictly excluded from model training or fine-tuning.
            </p>
          </SubSection>
          <SubSection title="3. Operational API Retention">
            <p>
              Commercial API requests are retained on provider servers in accordance with provider terms for trust, safety, and abuse monitoring before automated disposal.
            </p>
          </SubSection>
          <SubSection title="4. Automated Cost and Rate Safeguards">
            <p>
              An automated Redis-based cost metering system tracks daily API spend against hard administrator limits (default $500/day) to protect platform continuity and prevent resource exhaustion.
            </p>
          </SubSection>
        </div>
      </DocSection>

      {/* Section 5 */}
      <DocSection id="retention-disposal" number="5" title="Data Retention, Soft-Deletion and Hard-Purge Standards">
        <p>
          SheriaBot enforces standardized data lifecycle rules across all persistence layers:
        </p>
        <LegalTable
          headers={["Data Classification", "Active Retention", "Quarantine / Grace Period", "Permanent Hard-Purge Mechanism"]}
          rows={[
            [
              "User Account & Identity",
              "Duration of active contract",
              "30 Days (Account status set to SUSPENDED; email/name anonymized)",
              "Scheduled background worker purges database record & Supabase Auth",
            ],
            [
              "Document Vault Files",
              "Active subscription lifetime",
              "30 Days (Document marked uploadStatus: DELETED)",
              "Automated script deletes binary R2 object and removes database row",
            ],
            [
              "Compliance Queries",
              "180 Days active user review",
              "180 to 365 Days: Free-text scrubbed; >365 Days: Deep purged",
              "Automated retention script anonymizes free-text and purges expired records",
            ],
            [
              "Billing & M-Pesa Records",
              "Statutory tax retention (5 yrs TPA / 10 yrs ITA — Subject to legal confirmation)",
              "Not applicable (Statutory Tax Exemption)",
              "Preserved pursuant to Tax Procedures Act, 2015 & Income Tax Act",
            ],
            [
              "Pending TOTP 2FA Secrets",
              "10 Minutes (600 Seconds)",
              "Instant Redis TTL Expiration",
              "Automatic Redis key expiration without database persistence",
            ],
            [
              "Structured Server Logs",
              "Standard cloud retention",
              "Continuous automated redaction",
              "Pino redact filter censors passwords, tokens, phones, and emails",
            ],
          ]}
        />
      </DocSection>

      {/* Section 6 */}
      <DocSection id="direct-marketing-governance" number="6" title="Direct Marketing Governance (Section 37 & General Regs 14–18)">
        <p>
          All direct marketing campaigns, regulatory change newsletters, and pilot invitations operate under strict statutory consent controls:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong>Opt-In Consent Verification:</strong> Commercial marketing is dispatched only to contacts with verified opt-in records or existing contractual relationships (General Regulation 14).</li>
          <li><strong>Uncharged One-Click Opt-Out:</strong> Every email incorporates a functional, uncharged unsubscribe mechanism (Regulation 16).</li>
          <li><strong>Suppression Enforcement:</strong> The global `SuppressionList` table prevents further marketing communications to opted-out addresses (Regulation 17).</li>
        </ul>
      </DocSection>

      {/* Section 7 */}
      <DocSection id="security-safeguards" number="7" title="Technical and Organizational Security Measures (TOMs)">
        <p>
          Pursuant to Section 41 of the DPA 2019, SheriaBot maintains comprehensive technical safeguards:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong>Transport Layer Security:</strong> Mandatory TLS encryption across all public web and API endpoints.</li>
          <li><strong>Storage Encryption:</strong> Storage encryption at rest across database and object vaults.</li>
          <li><strong>Authentication & MFA:</strong> RFC 6238 TOTP two-factor authentication with 600-second Redis TTL for setup keys.</li>
          <li><strong>Session Revocation:</strong> Centralized Redis session revocation index allowing instantaneous cross-node session termination.</li>
          <li><strong>Logging Redaction:</strong> Structured JSON logging via Pino with automated redaction of sensitive credentials, phone numbers, and PII.</li>
        </ul>
      </DocSection>

      {/* Section 8 */}
      <DocSection id="incident-response" number="8" title="Security Incident and Statutory Breach Notification Protocol">
        <p>
          In compliance with Section 43 of the Kenya Data Protection Act 2019 and Regulations 37–39 of the General Regulations 2021:
        </p>
        <div className="space-y-3">
          <SubSection title="1. Real Risk of Harm Threshold">
            <p>
              Statutory breach notification obligations apply where personal data has been accessed or acquired by an unauthorized person and there is a <strong className="text-foreground">real risk of harm</strong> to affected data subjects.
            </p>
          </SubSection>
          <SubSection title="2. Controller 72-Hour Statutory ODPC Notification (s.43(1) & Reg 37)">
            <p>
              When acting as a Data Controller, SheriaBot shall notify the <strong className="text-foreground">Data Protection Commissioner without delay and where reasonably practicable within seventy-two (72) hours</strong> of becoming aware of a breach meeting the statutory threshold.
            </p>
          </SubSection>
          <SubSection title="3. Processor 48-Hour Notification (s.43(2) & Reg 38)">
            <p>
              When acting as a Data Processor, SheriaBot shall notify the relevant Data Controller <strong className="text-foreground">without delay and where reasonably practicable within forty-eight (48) hours</strong> of becoming aware of a personal data breach.
            </p>
          </SubSection>
          <SubSection title="4. Internal Incident Breach Register (Reg 37(4))">
            <p>
              SheriaBot maintains an internal breach register recording the facts relating to the personal data breach, its effects, and the remedial actions taken.
            </p>
          </SubSection>
        </div>
      </DocSection>

      {/* Section 9 */}
      <DocSection id="dsr-fulfillment" number="9" title="Data Subject Rights Management and Compliance SLA">
        <p>
          SheriaBot provides self-service tools and DPO workflows to fulfill statutory Data Subject Access Requests (DSARs) within statutory timelines:
        </p>
        <LegalTable
          headers={["Statutory Provision", "Right Description", "Operational Mechanism", "Responsible Role"]}
          rows={[
            ["Section 26", "Core Rights of Data Subjects", "Umbrella statutory rights framework", "DPO / Legal"],
            ["Section 29", "Duty to Notify Before Collection", "Public Privacy Notice and UI collection notices", "DPO / Product"],
            ["Section 34", "Restriction of Processing", "Formal DSR restriction tagging and processing hold", "DPO / Engineering"],
            ["Section 35", "Automated Decision-Making", "Advisory regulatory drafting; human review enforced", "Engineering / Product"],
            ["Section 37 & Reg 16", "Direct Marketing Objection", "One-click unsubscribe links & suppression list", "Marketing / Product"],
            ["Section 38", "Data Portability", "Structured JSON data package export via user.exportUserData", "Engineering"],
            ["Section 39", "Limitation to Retention", "Soft-delete quarantine and automated purge routines", "Engineering"],
            ["Section 40", "Rectification and Erasure", "Self-service Profile UI & Account Deletion workflows", "User / Engineering"],
          ]}
        />
        <p className="pt-2">
          DSAR submissions may be directed to <strong className="text-foreground">dpo@sheriabot.com</strong>.
        </p>
      </DocSection>
    </div>
  )
}
