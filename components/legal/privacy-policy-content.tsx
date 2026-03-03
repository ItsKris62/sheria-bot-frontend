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
          className={`grid grid-cols-[160px_1fr] gap-3 px-4 py-2.5 text-sm ${
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
                <td key={j} className="px-4 py-2.5 text-muted-foreground align-top">
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
        <strong className="text-foreground">SheriaBot Technologies Limited</strong> ("SheriaBot," "we," "us," or "our")
        is committed to protecting personal data in strict compliance with the{" "}
        <strong className="text-foreground">Kenya Data Protection Act, 2019 (DPA)</strong>, the{" "}
        <strong className="text-foreground">
          Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021
        </strong>
        , and the guidelines issued by the{" "}
        <strong className="text-foreground">Office of the Data Protection Commissioner (ODPC)</strong>. This Privacy
        Policy explains how we collect, process, store, share, and protect personal data when you use the SheriaBot
        platform.
      </Callout>

      {/* Section 1 */}
      <DocSection id="data-controller" number="1" title="Data Controller Information">
        <InfoTable
          rows={[
            ["Data Controller", "SheriaBot Technologies Limited"],
            ["Registered Address", "Nairobi, Kenya"],
            ["Company Registration", "[C/XXXXX] — Laws of Kenya"],
            ["ODPC Registration No.", "ODPC-XXXXXX"],
            ["Data Protection Officer", "dpo@sheriabot.co.ke"],
            ["General Privacy Queries", "privacy@sheriabot.co.ke"],
            ["Phone", "+254 (0) XXX XXX XXX"],
          ]}
        />
      </DocSection>

      {/* Section 2 */}
      <DocSection id="definitions" number="2" title="Definitions">
        <p>
          The following terms carry the meanings assigned to them under the Kenya Data Protection Act, 2019, and shall
          apply throughout this Privacy Policy:
        </p>
        <ul className="space-y-2 list-none">
          {[
            ["Personal Data", "Any information relating to an identified or identifiable natural person."],
            [
              "Processing",
              "Any operation performed on personal data, including collection, recording, storage, organisation, use, disclosure, erasure, or destruction.",
            ],
            [
              "Data Subject",
              "The identified or identifiable natural person to whom personal data relates.",
            ],
            [
              "Data Controller",
              "A natural or legal person who determines the purpose and means of processing personal data.",
            ],
            [
              "Data Processor",
              "A natural or legal person who processes personal data on behalf of a data controller.",
            ],
            [
              "Sensitive Personal Data",
              "Data relating to a natural person's race, health status, ethnic social origin, conscience, belief, genetic data, biometric data, property details, marital status, family details, sex, or sexual orientation.",
            ],
          ].map(([term, def]) => (
            <li key={term} className="flex gap-2">
              <span className="font-medium text-foreground shrink-0">"{term}"</span>
              <span>means {def}</span>
            </li>
          ))}
        </ul>
      </DocSection>

      {/* Section 3 */}
      <DocSection id="data-collected" number="3" title="Data We Collect">
        <SubSection title="3.1 Account and Registration Data">
          <p>When you create an account on the Platform, we collect:</p>
          <ul className="mt-1.5 space-y-1 list-disc list-inside">
            <li>Full name, job title, and professional role</li>
            <li>Work email address and hashed password</li>
            <li>Organization name, type (Fintech Startup, Financial Institution, or Regulator), and registration details</li>
            <li>Physical business address and billing contact details</li>
          </ul>
        </SubSection>

        <SubSection title="3.2 Compliance Query and Document Data">
          <p>When you use our AI compliance tools, we collect:</p>
          <ul className="mt-1.5 space-y-1 list-disc list-inside">
            <li>Compliance questions, regulatory queries, and checklist submissions</li>
            <li>Documents uploaded for regulatory analysis (internal policies, contracts, compliance frameworks)</li>
            <li>AI-generated responses, compliance assessments, and audit outputs</li>
            <li>Query history and session logs associated with your account</li>
          </ul>
        </SubSection>

        <SubSection title="3.3 Usage and Telemetry Data">
          <p>We automatically collect technical data to maintain and improve the Platform:</p>
          <ul className="mt-1.5 space-y-1 list-disc list-inside">
            <li>IP address, browser type, operating system, and device identifiers</li>
            <li>Pages visited, features used, session duration, and clickstream data</li>
            <li>Error logs, crash reports, and diagnostic data</li>
            <li>API call volumes and response-time metrics</li>
          </ul>
        </SubSection>

        <SubSection title="3.4 Payment Data">
          <p>
            For paid subscriptions, we collect billing contact name, email, and invoicing details. Payment card
            processing is handled exclusively by our certified payment processors. We do not store, transmit, or have
            access to full card numbers, CVV codes, or PINs.
          </p>
        </SubSection>

        <SubSection title="3.5 Communications Data">
          <p>
            When you contact our support team, submit feedback, or communicate with us via email or in-app chat, we
            retain records of those communications to resolve queries and improve service quality.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 4 */}
      <DocSection id="purposes" number="4" title="Purposes of Processing and Legal Basis">
        <p>We process your personal data on the following legal bases under Sections 30–32 of the DPA, 2019:</p>
        <LegalTable
          headers={["Purpose of Processing", "Legal Basis (DPA 2019)"]}
          rows={[
            ["Account creation and authentication", "Performance of contract — s.30(a)"],
            ["Providing AI compliance services", "Performance of contract — s.30(a)"],
            ["Processing payments and issuing invoices", "Performance of contract — s.30(a)"],
            ["Sending service notifications and transactional emails", "Performance of contract / Legitimate interests — s.30(a)(d)"],
            ["Fraud prevention and platform security monitoring", "Legitimate interests / Legal obligation — s.30(c)(d)"],
            ["Improving AI model accuracy and platform features", "Legitimate interests — s.30(d)"],
            ["Analytics and platform performance measurement", "Legitimate interests — s.30(d)"],
            ["Marketing and promotional communications", "Consent — s.30(b)"],
            ["Tax records, financial reporting, and regulatory audits", "Legal obligation — s.30(c)"],
          ]}
        />
        <p>
          Where processing is based on <strong className="text-foreground">consent</strong>, you may withdraw your
          consent at any time by contacting privacy@sheriabot.co.ke without affecting the lawfulness of prior
          processing.
        </p>
      </DocSection>

      {/* Section 5 */}
      <DocSection id="ai-processing" number="5" title="AI Processing and Sub-Processors">
        <Callout variant="warning">
          <strong className="text-foreground">Important Notice:</strong> SheriaBot uses third-party AI model
          sub-processors to power its compliance engine. Your compliance queries and relevant document excerpts are
          transmitted to these sub-processors as necessary to generate AI outputs. We maintain Data Processing
          Agreements (DPAs) with all sub-processors ensuring equivalent levels of data protection.
        </Callout>

        <SubSection title="5.1 Primary AI Sub-Processor">
          <InfoTable
            rows={[
              ["Provider", "Anthropic, PBC"],
              ["Service", "Large Language Model (Claude) — AI compliance query processing"],
              ["Data Transmitted", "Compliance queries and contextual document excerpts"],
              ["Data Location", "United States"],
              [
                "Data Use Restriction",
                "Anthropic's API does not use submitted data to train models by default; data is processed transiently and not retained for model training.",
              ],
              ["Safeguard", "Data Processing Agreement (DPA) with Standard Contractual Clauses"],
            ]}
          />
        </SubSection>

        <SubSection title="5.2 Other Infrastructure Sub-Processors">
          <LegalTable
            headers={["Provider", "Service", "Location"]}
            rows={[
              ["Pinecone", "Vector database for AI knowledge retrieval (RAG)", "United States"],
              ["Cloudflare R2", "Document storage and CDN delivery", "United States / Global"],
              ["Resend", "Transactional and notification email delivery", "United States"],
              ["Neon / PostgreSQL", "Relational database for account and compliance data", "United States"],
              ["Redis (Upstash)", "Session management and caching", "United States"],
            ]}
          />
        </SubSection>

        <p>
          A full and current list of sub-processors is available upon written request at{" "}
          <span className="text-primary">privacy@sheriabot.co.ke</span>. We will provide at least 14 days' notice
          before onboarding a new sub-processor that processes your personal data.
        </p>
      </DocSection>

      {/* Section 6 */}
      <DocSection id="cross-border" number="6" title="Cross-Border Data Transfers">
        <p>
          The Platform operates with infrastructure providers located outside Kenya. All cross-border transfers of
          personal data are conducted in accordance with{" "}
          <strong className="text-foreground">Section 48 of the Data Protection Act, 2019</strong>, which requires
          that the receiving country or organisation provides an adequate level of protection equivalent to Kenyan
          standards.
        </p>
        <p>Our transfer safeguards include:</p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>
            <strong className="text-foreground">Standard Contractual Clauses (SCCs)</strong> or equivalent
            contractual instruments with each data processor
          </li>
          <li>
            <strong className="text-foreground">Adequacy assessments</strong> of recipient countries prior to any
            transfer
          </li>
          <li>
            <strong className="text-foreground">Data Processing Agreements</strong> mandating that sub-processors
            apply security measures equivalent to those described in Section 8 of this Policy
          </li>
        </ul>
        <p>
          You may obtain a copy of the relevant transfer safeguards by contacting{" "}
          <span className="text-primary">privacy@sheriabot.co.ke</span>.
        </p>
      </DocSection>

      {/* Section 7 */}
      <DocSection id="retention" number="7" title="Data Retention">
        <p>
          We retain personal data only for as long as is necessary for the stated purposes, taking into account
          applicable Kenyan statutory retention obligations:
        </p>
        <LegalTable
          headers={["Data Category", "Retention Period", "Legal Basis"]}
          rows={[
            ["Account data", "Duration of subscription + 7 years", "Income Tax Act, Cap. 470"],
            ["Compliance query data and AI outputs", "3 years from date of query", "Legitimate interests"],
            ["Uploaded documents", "Duration of subscription + 1 year", "Contractual obligation"],
            ["Usage and system logs", "12 months", "Legitimate interests"],
            ["Payment records and invoices", "7 years", "Income Tax Act / VAT Act, 2013"],
            ["Support communications", "3 years", "Legitimate interests"],
            ["Marketing consent records", "Until consent withdrawn + 3 years", "Legal obligation"],
          ]}
        />
        <p>
          Upon expiry of the applicable retention period, data is securely deleted or anonymised. You may request
          earlier deletion subject to Section 9 of this Policy.
        </p>
      </DocSection>

      {/* Section 8 */}
      <DocSection id="security" number="8" title="Data Security">
        <p>
          We implement appropriate technical and organisational measures (TOMs) to protect personal data against
          accidental or unlawful destruction, loss, alteration, unauthorised disclosure, or access:
        </p>
        <ul className="space-y-2 list-none">
          {[
            ["Encryption at Rest", "AES-256 encryption for all stored data, including documents and database records."],
            ["Encryption in Transit", "TLS 1.3 for all data transmitted between your browser and our servers."],
            ["Access Control", "Role-based access control (RBAC) with the principle of least privilege. Multi-factor authentication (MFA) mandatory for all administrative access."],
            ["Penetration Testing", "Regular independent penetration tests and vulnerability assessments conducted at least annually."],
            ["Pseudonymisation", "Applied where technically feasible to reduce risk in the event of unauthorised access."],
            ["Incident Response", "A documented data breach response procedure with a 72-hour ODPC notification window as required by Section 43 of the DPA."],
            ["Employee Training", "All staff with access to personal data undergo mandatory data protection training."],
          ].map(([measure, detail]) => (
            <li key={measure} className="flex gap-2">
              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shrink-0" />
              <span>
                <strong className="text-foreground">{measure}:</strong> {detail}
              </span>
            </li>
          ))}
        </ul>
        <p>
          In the event of a personal data breach that is likely to result in risk to the rights of data subjects, we
          will notify the ODPC and affected data subjects without undue delay as required under{" "}
          <strong className="text-foreground">Section 43 of the DPA, 2019</strong>.
        </p>
      </DocSection>

      {/* Section 9 */}
      <DocSection id="rights" number="9" title="Data Subject Rights">
        <p>
          Under the Kenya Data Protection Act, 2019, you (or the natural persons whose data you submit) have the
          following rights:
        </p>
        <div className="space-y-3">
          {[
            ["Right of Access (s.26)", "Request a copy of personal data we hold about you, including details of how it is being processed."],
            ["Right to Rectification (s.27)", "Request correction of inaccurate, incomplete, or misleading personal data."],
            ["Right to Erasure (s.28)", "Request deletion of your personal data where it is no longer necessary for the original purpose, or where you withdraw consent."],
            ["Right to Restriction (s.29)", "Request that we restrict processing of your data in certain circumstances, such as while you contest its accuracy."],
            ["Right to Data Portability (s.38)", "Receive personal data you have provided to us in a structured, commonly used, machine-readable format, and request transfer to another controller."],
            ["Right to Object (s.35)", "Object to processing of your personal data based on legitimate interests, including for direct marketing purposes."],
            ["Right to Withdraw Consent", "Where processing is based on consent, withdraw it at any time. Withdrawal does not affect the lawfulness of prior processing."],
          ].map(([right, description], i) => (
            <div key={right} className="flex gap-3 p-3 rounded-md bg-muted/20 border border-border">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-foreground text-sm">{right}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-md border border-border bg-muted/20 p-3">
          <p>
            To exercise any of these rights, submit a written request to{" "}
            <span className="text-primary font-medium">privacy@sheriabot.co.ke</span> with the subject line{" "}
            <em>"Data Subject Request."</em> We will acknowledge and respond within{" "}
            <strong className="text-foreground">21 days</strong> as required by the DPA. If you are dissatisfied with
            our response, you have the right to lodge a complaint with the{" "}
            <strong className="text-foreground">
              Office of the Data Protection Commissioner (ODPC)
            </strong>{" "}
            at <span className="text-primary">www.odpc.go.ke</span>.
          </p>
        </div>
      </DocSection>

      {/* Section 10 */}
      <DocSection id="cookies" number="10" title="Cookies and Tracking Technologies">
        <LegalTable
          headers={["Cookie Category", "Purpose", "Consent Required"]}
          rows={[
            ["Strictly Necessary", "Session management, authentication, security (CSRF protection)", "No — essential for Platform function"],
            ["Functional", "User preferences (language, theme, display settings)", "No — improves user experience"],
            ["Analytics", "Platform performance metrics and feature usage analysis (anonymised)", "Yes — opt-in via cookie banner"],
            ["Marketing", "Personalised content and advertising", "Yes — explicit opt-in required"],
          ]}
        />
        <p>
          You can manage or withdraw cookie consent at any time via our cookie preference centre (accessible from the
          footer of any page) or by configuring your browser to reject non-essential cookies. Note that disabling
          strictly necessary cookies will prevent you from using the Platform.
        </p>
      </DocSection>

      {/* Section 11 */}
      <DocSection id="children" number="11" title="Children's Data">
        <p>
          SheriaBot is a B2B platform designed for use by duly registered legal entities and their authorised
          employees operating in a professional capacity in the financial services industry. The Platform is{" "}
          <strong className="text-foreground">not intended for use by individuals under the age of 18</strong>. We do
          not knowingly collect or process personal data from minors.
        </p>
        <p>
          If you believe we have inadvertently collected personal data from an individual under 18, please contact{" "}
          <span className="text-primary">privacy@sheriabot.co.ke</span> immediately and we will take prompt steps to
          delete such data.
        </p>
      </DocSection>

      {/* Section 12 */}
      <DocSection id="changes" number="12" title="Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in law, technology, or our
          processing activities. All updates will be posted on this page with a revised "Last Updated" date.
        </p>
        <p>
          <strong className="text-foreground">Material changes</strong> (those that affect your rights or our core
          data processing activities) will be notified by email and/or a prominent notice on the Platform at least{" "}
          <strong className="text-foreground">30 days</strong> before taking effect. Your continued use of the
          Platform after the effective date constitutes acceptance of the revised Policy.
        </p>
      </DocSection>

      {/* Section 13 */}
      <DocSection id="contact" number="13" title="Contact Us">
        <p>For any privacy-related queries, concerns, or to exercise your data subject rights:</p>
        <InfoTable
          rows={[
            ["Data Protection Officer", "dpo@sheriabot.co.ke"],
            ["Privacy Queries", "privacy@sheriabot.co.ke"],
            ["Legal Notices", "legal@sheriabot.co.ke"],
            ["Mailing Address", "SheriaBot Technologies Limited, Nairobi, Kenya"],
            ["Phone", "+254 (0) XXX XXX XXX"],
            ["ODPC", "www.odpc.go.ke — for unresolved complaints"],
          ]}
        />
      </DocSection>
    </div>
  )
}
