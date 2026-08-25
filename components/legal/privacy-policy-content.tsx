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
          <tr className="border-b border-border bg-muted/40">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-medium text-foreground">
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

export function PrivacyPolicyContent() {
  return (
    <div className="space-y-8 text-sm">
      {/* Preamble */}
      <Callout>
        <strong className="text-foreground">SheriaBot Technologies Limited</strong> (&quot;SheriaBot,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
        is committed to protecting personal data in compliance with the{" "}
        <strong className="text-foreground">Kenya Data Protection Act, 2019 (DPA)</strong>, the{" "}
        <strong className="text-foreground">
          Data Protection (General) Regulations, 2021 (Legal Notice No. 263 of 2021)
        </strong>
        , and statutory guidelines issued by the{" "}
        <strong className="text-foreground">Office of the Data Protection Commissioner (ODPC)</strong>. This Privacy
        Notice truthfully describes how we collect, process, store, protect, and dispose of personal data across the SheriaBot platform.
      </Callout>

      {/* Section 1 */}
      <DocSection id="data-controller" number="1" title="Data Controller and Processor Identity">
        <p>
          Depending on your relationship with SheriaBot and the category of data processed, SheriaBot operates as either a Data Controller or a Data Processor under Section 2 of the DPA 2019:
        </p>
        <InfoTable
          rows={[
            ["Entity Name", "SheriaBot Technologies Limited"],
            ["Registered Office", "Nairobi, Kenya"],
            ["Data Controller Scope", "User accounts, billing, direct marketing, telemetry, and platform security logs"],
            ["Data Processor Scope", "Customer-uploaded compliance policies, Document Vault files, and proprietary gap analysis context"],
            ["Data Protection Officer", "dpo@sheriabot.com"],
            ["General Privacy Inquiries", "privacy@sheriabot.com"],
            ["ODPC Registration Status", "Filing under assessment pursuant to Registration Regulations 2021 (Legal Notice No. 265 of 2021)"],
          ]}
        />
      </DocSection>

      {/* Section 2 */}
      <DocSection id="definitions" number="2" title="Definitions and Statutory Interpretation">
        <p>
          Capitalised terms in this Notice carry the authoritative statutory definitions provided in Section 2 of the Kenya Data Protection Act, 2019:
        </p>
        <ul className="space-y-2 list-none pl-0">
          {[
            ["Personal Data", "Any information relating to an identified or identifiable natural person."],
            [
              "Data Controller",
              "A natural or legal person, public authority, agency, or other body which, alone or jointly with others, determines the purpose and means of processing personal data.",
            ],
            [
              "Data Processor",
              "A natural or legal person, public authority, agency, or other body which processes personal data on behalf of the Data Controller.",
            ],
            [
              "Processing",
              "Any operation performed on personal data, including collection, recording, storage, adaptation, retrieval, consultation, use, disclosure, dissemination, erasure, or destruction.",
            ],
            [
              "Data Subject",
              "The natural person to whom personal data relates.",
            ],
            [
              "ODPC",
              "The Office of the Data Protection Commissioner established pursuant to Section 5 of the Act.",
            ],
          ].map(([term, definition], idx) => (
            <li key={idx} className="border-l-2 border-primary/30 pl-3">
              <strong className="text-foreground">{term}:</strong> {definition}
            </li>
          ))}
        </ul>
      </DocSection>

      {/* Section 3 */}
      <DocSection id="categories" number="3" title="Categories of Personal Data We Process">
        <LegalTable
          headers={["Data Category", "Specific Data Fields Collected", "Storage Infrastructure", "Role"]}
          rows={[
            [
              "Account & Identity",
              "Full name, corporate email address, telephone number, avatar image, account status, role, TOTP MFA secret.",
              "Supabase PostgreSQL (Frankfurt, Germany) & Supabase Auth",
              "Controller",
            ],
            [
              "Organization Profile",
              "Company name, company type, registration number, CBK/CMA license number, physical address, admin contact details.",
              "Supabase PostgreSQL (Frankfurt, Germany)",
              "Controller",
            ],
            [
              "Authentication & Sessions",
              "Session tokens, IP address, user-agent string, device fingerprint, login timestamp history.",
              "Supabase PostgreSQL, Upstash Redis (2h TTL), Secure HTTP-Only Cookies",
              "Controller",
            ],
            [
              "Billing & Payments",
              "M-Pesa telephone number (254XXXXXXXXX), IntaSend transaction ID, invoice number, amount (KES), payment status.",
              "Supabase PostgreSQL & IntaSend Payment Gateway",
              "Controller",
            ],
            [
              "Compliance Documents",
              "Uploaded policy documents, manuals, and licensing evidence submitted to the Document Vault or Gap Analysis module.",
              "Cloudflare R2 (SSE-S3 Encrypted) & Supabase PostgreSQL metadata",
              "Processor",
            ],
            [
              "Compliance Queries",
              "Natural-language regulatory queries, generated answers, statutory citations, and verifier claims.",
              "Supabase PostgreSQL & Upstash Redis (24h cache)",
              "Controller / Processor",
            ],
            [
              "Product Telemetry",
              "Pseudonymous user IDs, user role, subscription tier, and sanitized interaction events (no document or PII text).",
              "PostHog EU (eu.i.posthog.com / Germany)",
              "Controller",
            ],
            [
              "Error Diagnostics",
              "Sanitized error stack traces, request execution timings, and non-PII diagnostic metadata.",
              "Sentry (PII scrubbed at ingress)",
              "Controller",
            ],
          ]}
        />
      </DocSection>

      {/* Section 4 */}
      <DocSection id="lawful-bases" number="4" title="Lawful Bases for Processing Under Kenya DPA 2019 Section 30">
        <p>
          In strict adherence to Section 30(1) of the Kenya Data Protection Act 2019, every processing activity conducted by SheriaBot is anchored upon an authoritative statutory ground:
        </p>
        <div className="space-y-4">
          <SubSection title="1. Performance of a Contract / Pre-Contractual Steps (Section 30(1)(b)(i))">
            <p>
              We process identity credentials, organization details, uploaded documents, compliance prompts, and session tokens to provision, maintain, and deliver our regulatory compliance SaaS services, AI query engine, and document vault in accordance with our Terms of Service.
            </p>
          </SubSection>
          <SubSection title="2. Compliance with a Legal Obligation (Section 30(1)(b)(ii))">
            <p>
              We retain financial transaction records, M-Pesa receipts, and tax invoices pursuant to statutory obligations under the <strong>Tax Procedures Act, 2015 (Section 23)</strong> and the <strong>Income Tax Act (Cap. 470, Section 54A/55)</strong>. We also maintain immutable security audit logs pursuant to statutory accountability mandates.
            </p>
          </SubSection>
          <SubSection title="3. Legitimate Interests (Section 30(1)(b)(vii))">
            <p>
              We process pseudonymised product telemetry, rate-limiting telemetry, and error diagnostics to maintain system availability, prevent fraud, troubleshoot crashes, and optimize platform user experience.
            </p>
          </SubSection>
          <SubSection title="4. Express Consent & Direct Marketing (Section 30(1)(a), Section 37 & General Regs 14–18)">
            <p>
              Where required by law, we seek express opt-in consent for non-essential communications, public newsletter subscriptions, and early pilot access evaluations. Consent may be freely withdrawn at any time via our uncharged one-click unsubscribe mechanism.
            </p>
          </SubSection>
        </div>
      </DocSection>

      {/* Section 5 */}
      <DocSection id="ai-processing" number="5" title="Artificial Intelligence and Vector Search Architecture">
        <p>
          SheriaBot employs Large Language Models (LLMs) and semantic vector search to provide automated regulatory analysis. Our architecture enforces strict privacy boundaries:
        </p>
        <div className="space-y-3">
          <SubSection title="1. Vector Search Isolation (Pinecone Vector DB)">
            <p>
              Our vector search database (Pinecone) indexes <strong className="text-foreground">only public Kenyan statutory legislation, CBK prudential guidelines, CMA regulations, and official gazette notices</strong>. Customer-uploaded compliance documents, private internal policies, and personal query texts are <strong className="text-foreground">NEVER vectorized, chunked, or stored in Pinecone</strong>.
            </p>
          </SubSection>
          <SubSection title="2. Model Training Excluded">
            <p>
              AI completions are powered primarily by Anthropic Claude 3.5 Sonnet under commercial enterprise API terms. Under these terms, customer inputs, uploaded policy excerpts, and generated answers are not used to train, retrain, or improve AI models.
            </p>
          </SubSection>
          <SubSection title="3. Provider Data Retention Terms">
            <p>
              AI providers process submitted content under their commercial service and data-processing terms. Provider-side retention may vary by service, account configuration, safety requirements, and applicable law.
            </p>
          </SubSection>
          <SubSection title="4. Advisory Status of Automated Outputs (Section 35)">
            <p>
              SheriaBot delivers automated regulatory intelligence and compliance drafting. Outputs do not constitute binding legal advice and do not produce automated legal effects on data subjects without human review.
            </p>
          </SubSection>
        </div>
      </DocSection>

      {/* Section 6 */}
      <DocSection id="subprocessors" number="6" title="Third-Party Subprocessors and Service Providers">
        <p>
          We engage vetted third-party subprocessors to deliver platform capabilities. International transfers are governed by appropriate safeguards pursuant to DPA Section 48(a) and General Regulations rr.40–41:
        </p>
        <LegalTable
          headers={["Provider", "Service Provided", "Data Transmitted", "Hosting Region & Transfer Basis"]}
          rows={[
            [
              "Supabase, Inc. (AWS)",
              "Managed PostgreSQL Database & Authentication",
              "User profiles, organizations, query records, auth credentials",
              "Frankfurt, Germany (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Cloudflare, Inc.",
              "Cloudflare R2 Encrypted Object Storage",
              "Customer uploaded documents, gap analysis files, exports",
              "Global / United States (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Upstash, Inc.",
              "Serverless Redis Cache & Session Index",
              "Session revocation keys, pending TOTP secrets (10m TTL)",
              "United States (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Anthropic, PBC",
              "Claude 3.5 Sonnet LLM Inference",
              "Compliance queries, policy excerpts in active prompt context",
              "United States (Section 48(a) Commercial API DPA)",
            ],
            [
              "Pinecone Systems, Inc.",
              "Regulatory Semantic Vector Index",
              "Public Kenyan regulatory corpus (no personal data transmitted)",
              "United States (Non-personal data)",
            ],
            [
              "PostHog, Inc.",
              "Product Telemetry & Feature Gates",
              "Pseudonymous user IDs, roles, plan tiers, sanitized counters",
              "Frankfurt, Germany (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Functional Software (Sentry)",
              "Application Error Diagnostics",
              "Error stack traces and sanitized request metadata",
              "United States / EU (Section 48(a) PII Scrubbed Ingress)",
            ],
            [
              "Resend, Inc.",
              "Transactional & Notification Email API",
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
              "M-Pesa Payment Processing & STK Push",
              "Phone numbers (254XXXXXXXXX), amounts (KES), invoice IDs",
              "Nairobi, Kenya (Domestic Kenyan Processing / CBK Regulated)",
            ],
            [
              "Render Services, Inc.",
              "Backend API Container Hosting",
              "Fastify Node.js server execution in transit",
              "United States (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
            [
              "Vercel, Inc.",
              "Frontend Web Application & Edge Routing",
              "Next.js web traffic, client IP, edge caching",
              "United States / Global Edge (Section 48(a) Appropriate Safeguards / SCCs)",
            ],
          ]}
        />
      </DocSection>

      {/* Section 7 */}
      <DocSection id="cross-border" number="7" title="Cross-Border Data Transfers (Sections 48–49 & General Regs Part VII)">
        <p>
          In compliance with Sections 48 and 49 of the Kenya Data Protection Act 2019 and Part VII of the General Regulations 2021:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <strong className="text-foreground">Appropriate Safeguards (DPA Section 48(a) & General Regulations rr.40–41):</strong> Cross-border transfers to international cloud providers operate pursuant to appropriate technical and contractual safeguards providing enforceable data protection guarantees.
          </li>
          <li>
            <strong className="text-foreground">Domestic Processing:</strong> M-Pesa payment processing via IntaSend Payments Limited remains entirely within Kenya.
          </li>
        </ul>
      </DocSection>

      {/* Section 8 */}
      <DocSection id="cookies-telemetry" number="8" title="Cookies, Telemetry and Tracking Reality">
        <p>
          SheriaBot maintains a minimal, privacy-centric approach to browser storage and product telemetry:
        </p>
        <LegalTable
          headers={["Technology / Storage", "Purpose", "Data Stored", "Consent / Control Mechanism"]}
          rows={[
            [
              "Supabase Auth Cookie",
              "Essential authentication and session maintenance",
              "Encrypted JWT session identifier (HTTP-only, Secure, SameSite=Lax)",
              "Strictly Necessary (Exempt from opt-in consent)",
            ],
            [
              "Sidebar & UI State",
              "Remembers user navigation preferences",
              "Sidebar open/closed boolean state (Max age: 7 days)",
              "Strictly Necessary for UI functionality",
            ],
            [
              "PostHog Product Analytics",
              "Feature engagement and funnel conversion tracking",
              "Pseudonymous user ID, role, plan tier, sanitized event names",
              "Legitimate Interests / Session recording disabled",
            ],
            [
              "Browser LocalStorage",
              "Local caching for active compliance query jurisdiction selection",
              "Selected jurisdiction code (e.g. 'KE', 'NG') and draft form state",
              "Client-Side Functional Storage (Cleared on logout)",
            ],
          ]}
        />
        <Callout>
          <strong className="text-foreground">Privacy Protection Guarantee:</strong> SheriaBot does not use third-party advertising tracking networks, does not engage in cross-site behavioural profiling, and has <strong className="text-foreground">explicitly disabled session replay video recordings</strong> in our PostHog telemetry setup.
        </Callout>
      </DocSection>

      {/* Section 9 */}
      <DocSection id="retention" number="9" title="Data Retention and Erasure Schedules">
        <p>
          Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected or to satisfy statutory accounting and regulatory requirements:
        </p>
        <LegalTable
          headers={["Data Classification", "Active Retention Period", "Quarantine / Grace Period", "Disposal & Erasure Method"]}
          rows={[
            [
              "User Account & Credentials",
              "Duration of active contract",
              "30 Days (Status: SUSPENDED, email/name anonymized immediately)",
              "Scheduled background worker purges database record & Supabase Auth",
            ],
            [
              "Document Vault Files",
              "Active subscription lifetime",
              "30 Days from user deletion request (uploadStatus: DELETED)",
              "Automated R2 binary object destruction and metadata deletion",
            ],
            [
              "Compliance Queries",
              "180 Days active dashboard history",
              "180 to 365 Days: Free-text scrubbed; >365 Days: Deep purged",
              "Automated retention script anonymizes free text and prunes expired rows",
            ],
            [
              "Billing & Tax Invoices",
              "Statutory tax retention (5 yrs TPA / 10 yrs ITA — Subject to legal confirmation)",
              "Not applicable (Statutory Tax Exemption)",
              "Archival pursuant to Tax Procedures Act, 2015 & Income Tax Act",
            ],
            [
              "Pending TOTP Secrets",
              "10 Minutes (600 Seconds)",
              "Instant Redis TTL Expiration",
              "Automatic Redis key expiration or instant deletion on confirmation",
            ],
            [
              "Structured Server Logs",
              "Standard cloud retention",
              "Continuous automated redaction",
              "All PII and secrets redacted at generation before log sink",
            ],
          ]}
        />
      </DocSection>

      {/* Section 10 */}
      <DocSection id="data-subject-rights" number="10" title="Data Subject Rights Under Kenya DPA 2019">
        <p>
          Under Part IV (Sections 25 to 40) of the Kenya Data Protection Act 2019, you possess actionable statutory rights regarding your personal data:
        </p>
        <ul className="space-y-3 list-none pl-0">
          {[
            [
              "Right to be Informed (Section 29)",
              "You have the right to be provided with clear, transparent, and accurate information about how your personal data is collected and processed, as detailed in this Notice.",
            ],
            [
              "Right of Access (Section 26(a))",
              "You have the right to request confirmation of whether we process your personal data and to obtain a copy of that data through our self-service export tools or by contacting our DPO.",
            ],
            [
              "Right to Rectification (Section 40(1)(a))",
              "You have the right to update or correct inaccurate, outdated, or incomplete personal data via your Account Settings dashboard at any time.",
            ],
            [
              "Right to Erasure (Section 40(1)(b))",
              "You have the right to request the deletion or destruction of your personal data where it is no longer necessary, subject to statutory retention exemptions (e.g. tax and accounting records).",
            ],
            [
              "Right to Restrict Processing (Section 34)",
              "You have the right to request the restriction of processing of your personal data under the statutory circumstances specified in Section 34(1) of the Act.",
            ],
            [
              "Right to Data Portability (Section 38)",
              "You have the right to receive your personal data in a structured, commonly used, and machine-readable format (JSON export available in Account Settings).",
            ],
            [
              "Right to Object to Direct Marketing (Section 37 & General Reg 16)",
              "You have the right to opt out of commercial direct marketing communications at any time without charge via the one-click unsubscribe link in all outreach emails.",
            ],
          ].map(([right, desc], idx) => (
            <li key={idx} className="border-l-2 border-primary/30 pl-3">
              <strong className="text-foreground">{right}:</strong> {desc}
            </li>
          ))}
        </ul>
        <p className="pt-2">
          To exercise any of these statutory rights, please submit a verified Data Subject Access Request (DSAR) to our Data Protection Officer at <strong className="text-foreground">dpo@sheriabot.com</strong> or <strong className="text-foreground">privacy@sheriabot.com</strong>.
        </p>
      </DocSection>

      {/* Section 11 */}
      <DocSection id="security-breach" number="11" title="Security Safeguards and Statutory Breach Notification">
        <p>
          SheriaBot enforces multi-layered technical and organizational measures (TOMs) pursuant to Section 41 of the DPA 2019:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong>Encryption in Transit:</strong> Mandatory TLS encryption across all public web and API endpoints.</li>
          <li><strong>Encryption at Rest:</strong> Storage encryption at rest across database and object vaults.</li>
          <li><strong>Authentication & MFA:</strong> RFC 6238 Time-based One-Time Password (TOTP) two-factor authentication with 600-second Redis TTL for setup keys.</li>
          <li><strong>PII Redaction:</strong> Automated structured logging filters stripping passwords, authorization headers, phone numbers, and emails before log persistence.</li>
          <li><strong>Statutory Breach Protocol (Section 43 & General Regs 37–39):</strong> In the event of a confirmed personal data breach presenting a real risk of harm, we notify the <strong className="text-foreground">Data Commissioner within seventy-two (72) hours</strong> of becoming aware, notify affected data subjects without undue delay where high risk exists, and maintain an internal incident breach register.</li>
        </ul>
      </DocSection>

      {/* Section 12 */}
      <DocSection id="complaints" number="12" title="Regulatory Inquiries and Complaints">
        <p>
          If you have questions or concerns regarding our privacy practices or wish to lodge a complaint, please contact our Data Protection Officer directly:
        </p>
        <InfoTable
          rows={[
            ["DPO Contact", "dpo@sheriabot.com"],
            ["Legal Department", "privacy@sheriabot.com"],
            ["Physical Address", "SheriaBot Technologies Limited, Nairobi, Kenya"],
          ]}
        />
        <p className="pt-2">
          You also have the statutory right under Section 56 of the Kenya Data Protection Act 2019 and the Complaints Handling Regulations 2021 (Legal Notice No. 264 of 2021) to lodge a formal complaint with the supervisory authority:
        </p>
        <InfoTable
          rows={[
            ["Supervisory Authority", "Office of the Data Protection Commissioner (ODPC)"],
            ["Postal Address", "P.O. Box 30920-00100, GPO, Nairobi, Kenya"],
            ["Physical Location", "Britam Tower, 12th & 13th Floors, Hospital Road, Upper Hill, Nairobi"],
            ["Official Website", "https://www.odpc.go.ke"],
            ["Email Address", "complaints@odpc.go.ke / info@odpc.go.ke"],
          ]}
        />
      </DocSection>
    </div>
  )
}
