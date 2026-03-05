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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 list-none">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function PrincipleRow({
  principle,
  article,
  description,
}: {
  principle: string
  article: string
  description: string
}) {
  return (
    <div className="flex gap-3 p-3 rounded-md bg-muted/20 border border-border">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-primary uppercase tracking-wide">{principle}</span>
          <span className="text-xs text-muted-foreground/60 font-mono">{article}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export function DataProtectionContent() {
  return (
    <div className="space-y-8 text-sm">
      {/* Preamble */}
      <Callout>
        This Data Protection Policy sets out{" "}
        <strong className="text-foreground">SheriaBot Technologies Limited&apos;s</strong> organisational framework for
        processing personal data in compliance with the{" "}
        <strong className="text-foreground">Kenya Data Protection Act, 2019 (DPA 2019)</strong>, the{" "}
        <strong className="text-foreground">Data Protection (General) Regulations, 2021</strong>, and the{" "}
        <strong className="text-foreground">Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021</strong>.
        It is intended for review by data subjects, regulators, auditors, and internal personnel alike and
        constitutes a binding internal policy effective from the date stated above.
      </Callout>

      {/* Section 1 — Purpose & Scope */}
      <DocSection id="purpose" number="1" title="Purpose and Scope">
        <p>
          This Policy articulates SheriaBot&apos;s data protection obligations, governance framework, and
          technical and organisational measures (TOMs) in respect of all personal data processed in connection with
          the SheriaBot platform and its associated operations.
        </p>
        <SubSection title="1.1 Scope of Application">
          <p>This Policy applies to:</p>
          <BulletList
            items={[
              "All personal data processed by SheriaBot in connection with the provision of its AI-powered regulatory compliance platform",
              "Personal data of registered users (natural persons), their Authorised Users, and employee or contractor contacts at client organisations",
              "Personal data processed by SheriaBot acting as a Data Controller (e.g., its own employees, direct website visitors)",
              "Personal data processed by SheriaBot acting as a Data Processor on behalf of client organisations (Data Controllers) — in which case this Policy is supplemented by the applicable Data Processing Agreement",
              "All internal personnel with access to personal data, including employees, contractors, and third-party service providers",
            ]}
          />
        </SubSection>
        <SubSection title="1.2 Regulatory Framework">
          <p>SheriaBot operates under the following Kenyan data protection instruments:</p>
          <BulletList
            items={[
              "Kenya Data Protection Act, 2019 (Cap. 411C) — primary legislation",
              "Data Protection (General) Regulations, 2021 — processing obligations and data subject rights",
              "Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021 — registration requirements",
              "Data Protection (Complaints Handling Procedure and Enforcement) Regulations, 2021 — enforcement procedures",
              "Guidelines and circulars issued by the Office of the Data Protection Commissioner (ODPC)",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 2 — Data Protection Principles */}
      <DocSection id="principles" number="2" title="Data Protection Principles">
        <p>
          SheriaBot processes personal data in strict accordance with the principles established under{" "}
          <strong className="text-foreground">Section 25 of the DPA 2019</strong>. Each principle is embedded into
          our platform design, operational procedures, and contractual arrangements with sub-processors.
        </p>
        <div className="space-y-2">
          <PrincipleRow
            principle="Lawfulness, Fairness & Transparency"
            article="s.25(a)"
            description="Personal data is processed on a clear, identified legal basis (contract, consent, legal obligation, or legitimate interest). Data subjects are informed of all processing activities through our Privacy Policy at the point of data collection. No personal data is processed covertly or for undisclosed purposes."
          />
          <PrincipleRow
            principle="Purpose Limitation"
            article="s.25(b)"
            description="Personal data is collected only for specified, explicit, and legitimate purposes — namely providing AI-powered compliance services, account management, and platform improvement — and is not subsequently processed in any manner incompatible with those purposes. Any new processing purpose requires a fresh legal basis and, where necessary, updated disclosure to data subjects."
          />
          <PrincipleRow
            principle="Data Minimisation"
            article="s.25(c)"
            description="We collect only personal data that is adequate, relevant, and necessary for the stated purposes. Registration fields are designed to capture only operationally required information. AI query processing transmits only the query content and necessary contextual excerpts — not the user's full profile or unrelated data."
          />
          <PrincipleRow
            principle="Accuracy"
            article="s.25(d)"
            description="SheriaBot takes reasonable steps to ensure that personal data held is accurate and, where necessary, kept up to date. Users may update their account information at any time via the platform settings. We provide mechanisms for users to rectify inaccurate data through our data subject rights process."
          />
          <PrincipleRow
            principle="Storage Limitation"
            article="s.25(e)"
            description="Personal data is retained only for as long as necessary for the identified purpose, subject to statutory minimum retention obligations under Kenyan law (see Section 10). Upon expiry of the retention period, data is securely deleted or irreversibly anonymised. Our automated retention schedule enforces deletion timelines across all data categories."
          />
          <PrincipleRow
            principle="Integrity & Confidentiality"
            article="s.25(f)"
            description="Appropriate technical and organisational security measures are applied proportionate to the risks posed by processing. These include TLS 1.3 encryption in transit, AES-256 encryption at rest, role-based access controls, multi-tenant data isolation, regular security audits, and documented incident response procedures (see our Security Policy for full details)."
          />
          <PrincipleRow
            principle="Accountability"
            article="s.25(g)"
            description="SheriaBot, as Data Controller, takes responsibility for demonstrating compliance with the above principles. This includes maintaining records of processing activities, conducting Data Protection Impact Assessments for high-risk processing, training personnel, and cooperating fully with the ODPC in the exercise of its supervisory functions."
          />
        </div>
      </DocSection>

      {/* Section 3 — Roles & Responsibilities */}
      <DocSection id="roles" number="3" title="Roles and Responsibilities">
        <SubSection title="3.1 Data Controller">
          <p>
            For processing activities related to its own operations (user account management, employee data,
            marketing communications), SheriaBot acts as the{" "}
            <strong className="text-foreground">Data Controller</strong> and determines the purposes and means of
            processing. All obligations under Part III of the DPA 2019 apply to SheriaBot in this capacity.
          </p>
        </SubSection>
        <SubSection title="3.2 Data Processor">
          <p>
            When processing personal data submitted by client organisations to the platform (Customer Data —
            including compliance documents, query content, and organisational data), SheriaBot acts as a{" "}
            <strong className="text-foreground">Data Processor</strong> on behalf of the client (Data Controller).
            Processing is governed by the Privacy Policy which constitutes the Data Processing Agreement, and by
            the client&apos;s lawful instructions. SheriaBot will not process Customer Data outside the scope of those
            instructions except as required by Kenyan law.
          </p>
        </SubSection>
        <SubSection title="3.3 Designated Data Protection Contact">
          <InfoTable
            rows={[
              ["Role", "Designated Data Protection Officer / Compliance Lead"],
              ["Contact Email", "dpo@sheriabot.co.ke"],
              ["Responsibilities", "Oversight of DPA 2019 compliance, DPIA coordination, DSR handling, ODPC liaison, staff training"],
            ]}
          />
        </SubSection>
        <SubSection title="3.4 Platform Administrators">
          <p>
            Platform administrators are responsible for implementing access controls, managing user permissions,
            conducting access reviews, and ensuring that only authorised personnel access personal data. All
            administrative actions are logged in the audit trail.
          </p>
        </SubSection>
        <SubSection title="3.5 Development Team">
          <p>
            The engineering team is responsible for implementing privacy-by-design and security-by-design
            principles throughout the software development lifecycle (SDLC). This includes: input validation,
            parameterised queries, data minimisation in API design, encryption of sensitive fields, and secure
            handling of secrets and credentials.
          </p>
        </SubSection>
        <SubSection title="3.6 All Personnel">
          <p>
            Every member of SheriaBot&apos;s team who has access to personal data — whether employee, contractor,
            or consultant — is individually responsible for processing data in accordance with this Policy and
            their specific role obligations. Violations of this Policy may result in disciplinary action.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 4 — Processing Activities Register */}
      <DocSection id="register" number="4" title="Data Processing Activities Register">
        <p>
          In accordance with <strong className="text-foreground">Section 31 of the DPA 2019</strong>, SheriaBot
          maintains a register of all personal data processing activities. The principal activities are summarised
          below. A full, up-to-date register is maintained internally and is available to the ODPC on request.
        </p>
        <LegalTable
          headers={["Processing Activity", "Data Categories", "Legal Basis", "Retention", "Sub-Processor(s)"]}
          rows={[
            [
              "User account registration & management",
              "Name, email, job title, phone, organisation details",
              "Performance of contract — s.30(a)",
              "Account lifetime + 12 months",
              "Railway (PostgreSQL)",
            ],
            [
              "AI compliance query processing",
              "Query text, contextual document excerpts, conversation history",
              "Performance of contract + Consent — s.30(a)(b)",
              "12 months from query date",
              "Anthropic (Claude API), Pinecone",
            ],
            [
              "Compliance document storage",
              "Uploaded compliance docs, licences, policies",
              "Performance of contract + Consent — s.30(a)(b)",
              "Until user deletion + 90 days",
              "Cloudflare R2",
            ],
            [
              "Regulatory document indexing (RAG)",
              "Public regulatory texts (Kenyan laws, CBK/CMA guidelines)",
              "Legitimate interest — s.30(d)",
              "Indefinite (public domain data)",
              "Pinecone (embeddings only)",
            ],
            [
              "JWT-based authentication & session management",
              "User ID, session tokens (no PII in token payload)",
              "Performance of contract — s.30(a)",
              "Session duration only (short-lived tokens)",
              "Railway (Redis)",
            ],
            [
              "Transactional email delivery",
              "Email address, name, notification content",
              "Performance of contract — s.30(a)",
              "24 months",
              "Resend",
            ],
            [
              "Platform usage analytics",
              "Page views, feature usage, IP address, device info (anonymised)",
              "Legitimate interest — s.30(d)",
              "Anonymised form indefinitely",
              "Vercel (edge analytics)",
            ],
            [
              "Compliance score & checklist generation",
              "Organisational compliance data, checklist responses",
              "Performance of contract — s.30(a)",
              "Duration of subscription + 12 months",
              "Railway (PostgreSQL)",
            ],
            [
              "Audit logging of administrative actions",
              "User ID, action type, timestamp, affected record",
              "Legal obligation + Legitimate interest — s.30(c)(d)",
              "3 years",
              "Railway (PostgreSQL)",
            ],
            [
              "Support communications",
              "Email address, name, query content",
              "Legitimate interest — s.30(d)",
              "3 years",
              "Resend, Railway",
            ],
          ]}
        />
      </DocSection>

      {/* Section 5 — DPIA */}
      <DocSection id="dpia" number="5" title="Data Protection Impact Assessments">
        <p>
          SheriaBot conducts <strong className="text-foreground">Data Protection Impact Assessments (DPIAs)</strong>{" "}
          in accordance with <strong className="text-foreground">Section 31A of the DPA 2019</strong> for processing
          activities that are likely to result in high risk to the rights and freedoms of data subjects.
        </p>
        <SubSection title="5.1 Triggers for DPIA">
          <p>A DPIA is mandatory before commencing any of the following processing activities:</p>
          <BulletList
            items={[
              "Large-scale processing of sensitive personal data as defined under the DPA 2019",
              "Systematic monitoring of users or their compliance behaviour at scale",
              "Deploying new AI processing capabilities that analyse or profile individual users",
              "Cross-border transfers of personal data to recipients in countries without an adequacy finding",
              "Onboarding a new sub-processor that will process personal data on our behalf",
              "Any significant change to the architecture of the platform that affects how personal data is stored, processed, or transmitted",
            ]}
          />
        </SubSection>
        <SubSection title="5.2 Existing DPIAs">
          <p>
            DPIAs have been conducted for the following high-risk processing activities currently in operation:
          </p>
          <BulletList
            items={[
              "AI query processing via Anthropic Claude API — assessing the risks of transmitting user queries to a third-party AI provider in the United States",
              "Pinecone vector storage — assessing the risks of storing regulatory document embeddings and any indirect personal data exposure",
              "Cloudflare R2 document storage — assessing the risks of storing sensitive compliance documents (CBK licences, privacy policies, financial records) uploaded by users",
              "Cross-border data transfer framework — assessing the adequacy of transfer safeguards to US-based sub-processors",
            ]}
          />
        </SubSection>
        <SubSection title="5.3 DPIA Process">
          <p>Each DPIA follows a structured process:</p>
          <BulletList
            items={[
              "Step 1 — Describe the processing: Document the nature, scope, context, and purposes of the processing activity",
              "Step 2 — Assess necessity and proportionality: Confirm that processing is limited to what is necessary for the stated purpose",
              "Step 3 — Identify and assess risks: Map potential risks to data subjects' rights and freedoms, assessing likelihood and severity",
              "Step 4 — Identify risk mitigations: Define technical and organisational measures to reduce risk to an acceptable level",
              "Step 5 — Document and sign off: Record the DPIA findings, obtain sign-off from the Data Protection Officer, and retain the record",
              "Step 6 — Consult the ODPC if required: Where residual risk remains high after mitigation, consult the ODPC before proceeding",
            ]}
          />
        </SubSection>
        <SubSection title="5.4 DPIA Record Retention">
          <p>
            All completed DPIA records are retained for a minimum of 5 years from the date of completion and are
            available for inspection by the ODPC on request. DPIAs are reviewed and updated whenever the
            processing activity changes materially.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 6 — Cross-Border Transfers */}
      <DocSection id="cross-border" number="6" title="Cross-Border Data Transfers">
        <p>
          SheriaBot operates with infrastructure providers located outside the Republic of Kenya. All cross-border
          transfers of personal data are conducted in accordance with{" "}
          <strong className="text-foreground">Section 48 of the DPA 2019</strong>, which requires that personal data
          transferred outside Kenya is afforded a level of protection equivalent to that guaranteed under Kenyan law.
        </p>
        <SubSection title="6.1 Transfer Destinations and Safeguards">
          <LegalTable
            headers={["Recipient / Sub-Processor", "Country", "Data Transferred", "Safeguard"]}
            rows={[
              ["Anthropic, PBC", "United States", "AI query text, contextual document excerpts", "Data Processing Agreement + Standard Contractual Clauses"],
              ["Pinecone, Inc.", "United States", "Text embeddings of regulatory documents", "Data Processing Agreement + Standard Contractual Clauses"],
              ["Cloudflare, Inc. (R2)", "United States / Global CDN", "Uploaded compliance documents", "Data Processing Agreement; Cloudflare SOC 2 Type II compliance"],
              ["Railway Corp.", "United States", "All structured data (PostgreSQL, Redis)", "Data Processing Agreement + Standard Contractual Clauses"],
              ["Render, Inc.", "United States", "API request data (processed transiently)", "Data Processing Agreement"],
              ["Vercel, Inc.", "United States / Global Edge", "Page view data, edge request logs", "Data Processing Agreement; Vercel SOC 2 Type II compliance"],
              ["Resend, Inc.", "United States", "Email addresses, notification content", "Data Processing Agreement"],
            ]}
          />
        </SubSection>
        <SubSection title="6.2 Adequacy Assessment">
          <p>
            Prior to any cross-border transfer, SheriaBot conducts an assessment to determine whether the
            recipient country provides an adequate level of data protection. Where an adequacy determination
            has not been made by the ODPC in respect of the recipient country, SheriaBot relies on:
          </p>
          <BulletList
            items={[
              "Standard Contractual Clauses (SCCs) binding the recipient to equivalent data protection obligations",
              "The recipient sub-processor's independently audited compliance certifications (SOC 2, ISO 27001) as evidence of adequate technical and organisational security",
              "Contractual restrictions preventing sub-processors from processing data for purposes other than those specified in the Data Processing Agreement",
            ]}
          />
        </SubSection>
        <SubSection title="6.3 Right to Transfer Safeguards">
          <p>
            Data subjects may obtain a copy of the relevant transfer safeguards by submitting a written request
            to <span className="text-primary">privacy@sheriabot.co.ke</span>. Where contractual confidentiality
            prevents full disclosure, we will describe the nature of the safeguard in as much detail as is
            permissible.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 7 — Data Subject Rights Procedures */}
      <DocSection id="dsr-procedures" number="7" title="Data Subject Rights Procedures">
        <p>
          This section describes SheriaBot&apos;s internal procedures for handling data subject requests (DSRs) submitted
          under the DPA 2019. External-facing information on data subject rights is set out in Section 9 of the
          Privacy Policy.
        </p>
        <SubSection title="7.1 Receipt and Acknowledgement">
          <p>
            All DSRs submitted to <span className="text-primary">privacy@sheriabot.co.ke</span> are logged in our
            DSR register upon receipt. An acknowledgement is sent to the requester within{" "}
            <strong className="text-foreground">3 business days</strong> confirming receipt and providing an
            estimated response date.
          </p>
        </SubSection>
        <SubSection title="7.2 Identity Verification">
          <p>
            Before processing a DSR, SheriaBot verifies the identity of the requester to prevent unauthorised
            disclosure. Verification is conducted by cross-referencing the request against account registration
            data. Where identity cannot be confirmed via account data alone, additional verification may be
            requested (e.g., verification of the registered email address).
          </p>
        </SubSection>
        <SubSection title="7.3 Response Timeframe">
          <p>
            SheriaBot responds to all DSRs within <strong className="text-foreground">21 days</strong> of receipt,
            in accordance with the DPA 2019. Where a request is particularly complex or involves multiple data
            categories, this period may be extended by a further 30 days, provided the requester is notified of
            the extension and its reasons within the initial 21-day period.
          </p>
        </SubSection>
        <SubSection title="7.4 Grounds for Refusal">
          <p>
            SheriaBot may decline to process a DSR (in whole or in part) where permitted by the DPA 2019, including where:
          </p>
          <BulletList
            items={[
              "The request is manifestly unfounded or excessive (in which case we may charge a reasonable fee or refuse)",
              "Compliance would adversely affect the rights and freedoms of third parties",
              "Processing is necessary for the establishment, exercise, or defence of legal claims",
              "Processing is required by applicable Kenyan law (e.g., statutory retention obligations)",
            ]}
          />
          <p className="mt-2">
            Where a request is refused, the data subject is informed of the reason and their right to lodge a
            complaint with the ODPC.
          </p>
        </SubSection>
        <SubSection title="7.5 Data Portability">
          <p>
            Where a right to data portability request is received, SheriaBot provides the data subject&apos;s personal
            data in a structured, commonly used, machine-readable format (JSON or CSV) within the applicable
            response timeframe. The export covers account data, compliance query history, and generated outputs
            associated with the data subject&apos;s account.
          </p>
        </SubSection>
        <SubSection title="7.6 DSR Record-Keeping">
          <p>
            All DSRs received, the actions taken, any refusals (with grounds), and the response dates are
            recorded in the DSR log and retained for a minimum of 3 years. This log is available for inspection
            by the ODPC.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 8 — Data Breach Response */}
      <DocSection id="breach-response" number="8" title="Data Breach Response Procedure">
        <Callout variant="warning">
          <strong className="text-foreground">Statutory Obligation:</strong> Under{" "}
          <strong className="text-foreground">Section 43 of the DPA 2019</strong>, SheriaBot must notify the ODPC of
          a personal data breach that is likely to result in risk to the rights and freedoms of data subjects within{" "}
          <strong className="text-foreground">72 hours</strong> of becoming aware of the breach. Affected data
          subjects must be notified without unreasonable delay where the breach is likely to result in high risk.
        </Callout>
        <SubSection title="8.1 Definition of a Personal Data Breach">
          <p>
            A personal data breach means a breach of security leading to the accidental or unlawful destruction,
            loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored, or
            otherwise processed by SheriaBot. This includes both external attacks and internal incidents.
          </p>
        </SubSection>
        <SubSection title="8.2 Detection and Internal Reporting">
          <BulletList
            items={[
              "Any employee, contractor, or sub-processor who becomes aware of or suspects a personal data breach must report it internally to the Data Protection Officer at dpo@sheriabot.co.ke within 4 hours of discovery",
              "The DPO is responsible for convening an initial incident response team within 24 hours",
              "All systems access logs, error logs, and audit trails relevant to the suspected breach are preserved immediately upon report",
            ]}
          />
        </SubSection>
        <SubSection title="8.3 Severity Classification">
          <LegalTable
            headers={["Severity", "Description", "Notification Required"]}
            rows={[
              [
                "High",
                "Breach likely to result in significant risk to data subjects (e.g., exposure of account credentials, compliance documents, or financial data)",
                "ODPC within 72 hours + data subjects without delay",
              ],
              [
                "Medium",
                "Breach with moderate risk (e.g., limited access to non-sensitive account metadata by an unauthorised internal user)",
                "ODPC within 72 hours; data subjects at DPO discretion",
              ],
              [
                "Low",
                "Breach unlikely to result in risk to data subjects (e.g., brief unintentional access to anonymised logs)",
                "Internal record only; ODPC notification not required",
              ],
            ]}
          />
        </SubSection>
        <SubSection title="8.4 ODPC Notification Content">
          <p>
            ODPC notifications will include, to the extent available at the time of notification:
          </p>
          <BulletList
            items={[
              "The nature of the personal data breach, including categories and approximate number of data subjects affected",
              "The categories and approximate number of personal data records concerned",
              "Name and contact details of the Data Protection Officer",
              "Description of the likely consequences of the breach",
              "Description of the measures taken or proposed to address the breach and mitigate its effects",
            ]}
          />
        </SubSection>
        <SubSection title="8.5 Breach Documentation">
          <p>
            All personal data breaches — regardless of severity, and whether or not notification to the ODPC is
            required — are recorded in the breach register. Each entry includes: date and time of discovery,
            nature of the breach, categories and volume of data affected, technical root cause, immediate
            containment actions, longer-term remediation measures, and post-incident review outcomes. The breach
            register is retained for a minimum of 5 years.
          </p>
        </SubSection>
        <SubSection title="8.6 Post-Breach Review">
          <p>
            Following the resolution of any breach, the incident response team conducts a post-incident review
            within 30 days to identify root causes, assess the effectiveness of the response, and implement
            preventive controls to reduce the likelihood of recurrence.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 9 — Third-Party Processor Management */}
      <DocSection id="processors" number="9" title="Third-Party Data Processor Management">
        <p>
          SheriaBot appoints sub-processors only where necessary for the provision of its services and in
          compliance with <strong className="text-foreground">Section 34 of the DPA 2019</strong>.
        </p>
        <SubSection title="9.1 Pre-Engagement Assessment">
          <p>
            Before engaging a new sub-processor, SheriaBot conducts a due diligence assessment covering:
          </p>
          <BulletList
            items={[
              "The sub-processor's data protection and privacy policy",
              "Availability and terms of a Data Processing Agreement",
              "Security certifications held (SOC 2, ISO 27001, or equivalent)",
              "Sub-processor's own sub-processing chain and any applicable transfer mechanisms",
              "Breach notification procedures and timelines",
            ]}
          />
        </SubSection>
        <SubSection title="9.2 Data Processing Agreements">
          <p>
            SheriaBot enters into a Data Processing Agreement (DPA) with every sub-processor before any personal
            data is transferred. Each DPA mandates that the sub-processor:
          </p>
          <BulletList
            items={[
              "Processes personal data only on documented instructions from SheriaBot",
              "Implements appropriate technical and organisational security measures",
              "Does not engage further sub-processors without SheriaBot's prior written consent",
              "Assists SheriaBot in responding to data subject requests",
              "Notifies SheriaBot without undue delay upon becoming aware of a personal data breach",
              "Returns or destroys all personal data upon termination of the agreement",
            ]}
          />
        </SubSection>
        <SubSection title="9.3 Current Sub-Processor List">
          <LegalTable
            headers={["Sub-Processor", "Role", "Country", "DPA in Place"]}
            rows={[
              ["Anthropic, PBC", "AI model inference (Claude API)", "United States", "Yes"],
              ["Pinecone, Inc.", "Vector database (RAG knowledge retrieval)", "United States", "Yes"],
              ["Cloudflare, Inc.", "Document storage (R2) and CDN delivery", "United States / Global", "Yes"],
              ["Railway Corp.", "Database hosting (PostgreSQL + Redis)", "United States", "Yes"],
              ["Render, Inc.", "Backend application hosting", "United States", "Yes"],
              ["Vercel, Inc.", "Frontend hosting and edge delivery", "United States / Global", "Yes"],
              ["Resend, Inc.", "Transactional email delivery", "United States", "Yes"],
            ]}
          />
          <p className="mt-2">
            This list is updated whenever a new sub-processor is engaged. Data subjects and clients are notified
            of material changes to the sub-processor list with at least 14 days&apos; advance notice.
          </p>
        </SubSection>
        <SubSection title="9.4 Ongoing Monitoring">
          <p>
            SheriaBot reviews sub-processor compliance at least annually, including reviewing updated security
            certifications, DPA adherence, and any material changes to the sub-processor&apos;s data handling
            practices.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 10 — Data Retention & Disposal */}
      <DocSection id="retention" number="10" title="Data Retention and Disposal">
        <SubSection title="10.1 Retention Schedule">
          <LegalTable
            headers={["Data Category", "Retention Period", "Legal / Business Basis"]}
            rows={[
              ["Account registration data (name, email, org)", "Account lifetime + 12 months after deletion", "Contractual; limitation periods"],
              ["AI compliance query logs and conversation history", "12 months, then anonymised", "Legitimate interest (service quality)"],
              ["Uploaded compliance documents and licences", "Until user deletion; soft-deleted for 90 days, then permanently deleted", "Contractual obligation"],
              ["Compliance scores and checklist results", "Duration of subscription + 12 months", "Contractual; legitimate interest"],
              ["Transactional email records", "24 months", "Legitimate interest; dispute resolution"],
              ["Usage analytics and telemetry (anonymised)", "Indefinitely in anonymised form", "Legitimate interest (service improvement)"],
              ["Payment and invoicing records", "7 years", "Kenya Income Tax Act, Cap. 470; VAT Act, 2013"],
              ["Audit logs of administrative actions", "3 years", "Legitimate interest; legal obligation"],
              ["Data Subject Request records", "3 years from date of response", "Legal obligation; accountability"],
              ["Data Breach incident records", "5 years from date of incident", "Legal obligation; accountability"],
              ["Data Processing Impact Assessments", "5 years from date of completion", "Legal obligation; accountability"],
            ]}
          />
        </SubSection>
        <SubSection title="10.2 Soft Delete and Recovery Window">
          <p>
            SheriaBot implements a soft delete mechanism for user-uploaded documents: upon deletion, records are
            marked as <span className="font-mono text-xs text-primary">DELETED</span> and retained for a 90-day
            recovery window before permanent erasure. During this window, an authorised user may restore the
            document. After 90 days, the document is permanently deleted from Cloudflare R2 storage and all
            associated database records are hard-deleted.
          </p>
        </SubSection>
        <SubSection title="10.3 Secure Disposal Procedures">
          <BulletList
            items={[
              "Database records: hard-deleted via parameterised DELETE queries upon expiry of the retention period; deletion is recorded in the audit log",
              "Cloudflare R2 objects: permanently deleted via the R2 API upon expiry; deletion is confirmed and logged",
              "Pinecone vector embeddings: removed by vector ID when the associated regulatory document is retired or when user data associated with embeddings must be erased",
              "Redis cache entries: expire automatically via TTL; no long-term personal data stored in cache",
              "Automated scripts run monthly to identify and process records that have reached their retention expiry",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 11 — Training & Awareness */}
      <DocSection id="training" number="11" title="Training and Awareness">
        <p>
          SheriaBot recognises that data protection compliance depends as much on people as on technology. All
          personnel with access to personal data receive structured training on their data protection obligations.
        </p>
        <SubSection title="11.1 Mandatory Training Programme">
          <BulletList
            items={[
              "Induction training: All new employees and contractors complete mandatory data protection training within 14 days of joining, covering the DPA 2019 fundamentals, SheriaBot's policies, and role-specific obligations",
              "Annual refresher training: All personnel complete an annual data protection refresher covering legislative updates, policy changes, and lessons learned from incidents",
              "Role-specific training: Engineers receive training on secure coding practices and privacy-by-design; operations staff receive training on access control and data handling procedures",
              "Incident response training: The incident response team receives scenario-based training on breach detection, containment, and ODPC notification procedures",
            ]}
          />
        </SubSection>
        <SubSection title="11.2 Training Record-Keeping">
          <p>
            Completion of all mandatory training is recorded in the HR system. Training records are retained for
            the duration of the individual&apos;s engagement with SheriaBot plus 2 years.
          </p>
        </SubSection>
        <SubSection title="11.3 Data Protection Awareness">
          <p>
            The DPO issues periodic data protection bulletins covering recent ODPC guidance, relevant regulatory
            developments in Kenya and internationally, and reminders of key internal obligations. All bulletins
            are archived on the internal knowledge base.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 12 — Policy Review */}
      <DocSection id="review" number="12" title="Policy Review and Maintenance">
        <p>
          This Data Protection Policy is a living document maintained by SheriaBot&apos;s Data Protection Officer
          and is subject to regular review to reflect changes in applicable law, regulatory guidance, platform
          architecture, and processing activities.
        </p>
        <SubSection title="12.1 Review Cycle">
          <BulletList
            items={[
              "This Policy is reviewed in full at least annually, with the next scheduled review due 12 months from the effective date shown above",
              "Triggered reviews are conducted whenever: (a) the DPA 2019 or its regulations are amended; (b) the ODPC issues material new guidance; (c) a significant change is made to the platform's data processing architecture; or (d) a data breach reveals a gap in existing controls",
            ]}
          />
        </SubSection>
        <SubSection title="12.2 Version Control">
          <p>
            Each version of this Policy is assigned a version number and effective date. Previous versions are
            archived and retained for a minimum of 5 years. Material changes to this Policy are communicated to
            registered users by email at least 30 days before taking effect.
          </p>
        </SubSection>
        <SubSection title="12.3 Contact">
          <InfoTable
            rows={[
              ["Data Protection Officer", "dpo@sheriabot.co.ke"],
              ["Privacy Queries", "privacy@sheriabot.co.ke"],
              ["Legal Notices", "legal@sheriabot.co.ke"],
              ["Supervisory Authority", "Office of the Data Protection Commissioner (ODPC) — www.odpc.go.ke"],
              ["ODPC Address", "P.O. Box 22181 — 00505, Nairobi, Kenya"],
            ]}
          />
        </SubSection>
      </DocSection>
    </div>
  )
}
