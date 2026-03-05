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
          className={`grid grid-cols-[200px_1fr] gap-3 px-4 py-2.5 text-sm ${
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
  variant?: "info" | "warning" | "success"
  children: React.ReactNode
}) {
  const styles =
    variant === "warning"
      ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
      : variant === "success"
        ? "bg-primary/10 border-primary/30 text-foreground"
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

function ControlCard({
  label,
  detail,
}: {
  label: string
  detail: string
}) {
  return (
    <div className="flex gap-3 p-3 rounded-md bg-muted/20 border border-border">
      <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shrink-0" />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{detail}</p>
      </div>
    </div>
  )
}

function ComplianceTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-primary/30 bg-primary/10 text-xs font-medium text-primary">
      {label}
    </span>
  )
}

export function SecurityPolicyContent() {
  return (
    <div className="space-y-8 text-sm">
      {/* Preamble */}
      <Callout>
        This Security Policy provides a public-facing overview of the technical and organisational security
        measures implemented by{" "}
        <strong className="text-foreground">SheriaBot Technologies Limited</strong> to protect the confidentiality,
        integrity, and availability of data processed on the SheriaBot platform. It is intended to provide
        transparency to users, prospective customers, and regulators regarding our security posture. Specific
        implementation details that could aid malicious actors are deliberately excluded from this public
        document.
      </Callout>

      {/* Section 1 — Commitment */}
      <DocSection id="commitment" number="1" title="Our Commitment to Security">
        <p>
          SheriaBot processes sensitive regulatory and compliance data on behalf of Kenya&apos;s fintech sector —
          including CBK licence information, internal compliance documents, regulatory gap analyses, and AI
          compliance assessments. This makes security foundational to our operations, not an afterthought.
        </p>
        <p>
          We approach security as a continuous discipline that spans platform architecture, software development,
          operational procedures, and personnel practices. Our security programme is aligned with the principles
          of internationally recognised frameworks:
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <ComplianceTag label="NIST Cybersecurity Framework (CSF)" />
          <ComplianceTag label="ISO/IEC 27001 Principles" />
          <ComplianceTag label="OWASP Top 10" />
          <ComplianceTag label="Kenya DPA 2019" />
          <ComplianceTag label="CBK Cybersecurity Guidelines" />
          <ComplianceTag label="Computer Misuse & Cybercrimes Act, 2018" />
        </div>
        <p className="mt-2">
          <strong className="text-foreground">Note on certifications:</strong> Reference to the above frameworks
          reflects alignment with their principles and controls. SheriaBot does not claim ISO 27001 certification
          or any other third-party certification unless explicitly stated. We are committed to pursuing formal
          certifications as the platform scales.
        </p>
        <SubSection title="1.1 Security Responsible Disclosure">
          <p>
            SheriaBot encourages responsible disclosure of security vulnerabilities. If you believe you have
            discovered a security vulnerability in our platform, please report it to{" "}
            <span className="text-primary">security@sheriabot.co.ke</span> before public disclosure. We will
            acknowledge receipt within 2 business days and work to investigate and remediate confirmed
            vulnerabilities promptly. We do not take legal action against researchers who report vulnerabilities
            in good faith through this channel.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 2 — Infrastructure Security */}
      <DocSection id="infrastructure" number="2" title="Infrastructure Security">
        <SubSection title="2.1 Cloud Hosting and Provider Security">
          <p>
            SheriaBot&apos;s infrastructure is hosted exclusively on industry-leading cloud providers, each with
            their own independent security certifications:
          </p>
          <InfoTable
            rows={[
              ["Frontend (Web App)", "Vercel — SOC 2 Type II certified, global edge network with DDoS protection"],
              ["Backend (API)", "Render — SOC 2 Type II certified, isolated deployment environments"],
              ["Database (PostgreSQL)", "Railway — automated encrypted backups, private network isolation"],
              ["Cache (Redis)", "Railway — TLS-encrypted connections, no sensitive data stored long-term"],
              ["File Storage", "Cloudflare R2 — SOC 2 Type II; server-side encryption at rest; private bucket (no public access)"],
              ["AI Processing", "Anthropic (US) — enterprise-grade security; API inputs not used for model training"],
              ["Vector Database", "Pinecone — SOC 2 Type II; stores only mathematical embeddings, not source documents"],
              ["Email Delivery", "Resend — transactional email provider with SPF, DKIM, and DMARC configured"],
            ]}
          />
        </SubSection>
        <SubSection title="2.2 Network Security">
          <BulletList
            items={[
              "All traffic to and from the SheriaBot platform is encrypted using TLS 1.2+ (TLS 1.3 preferred). HTTP is automatically redirected to HTTPS on all endpoints",
              "HSTS (HTTP Strict Transport Security) is enforced with a minimum max-age of 12 months, preventing downgrade attacks",
              "All inter-service communication between backend components traverses private networks — no direct public exposure of database or cache endpoints",
              "API endpoints are exposed only through the backend application layer; no direct database ports are accessible from the public internet",
            ]}
          />
        </SubSection>
        <SubSection title="2.3 Database Security">
          <BulletList
            items={[
              "PostgreSQL database is encrypted at rest using AES-256",
              "Database connections use TLS-encrypted connections; plaintext connections are rejected",
              "Automated backups are performed regularly by Railway, with point-in-time recovery capability",
              "Backup retention covers a rolling 7-day window as standard, with key backups retained longer for disaster recovery purposes",
              "Database credentials are stored exclusively as environment variables; never committed to version control",
            ]}
          />
        </SubSection>
        <SubSection title="2.4 File Storage Security">
          <BulletList
            items={[
              "Cloudflare R2 storage buckets are private: no public access is permitted",
              "All stored objects (uploaded compliance documents) are encrypted at rest using Cloudflare's server-side encryption",
              "Document downloads are served via presigned URLs with short expiry windows (minutes, not hours) — limiting the attack window if a URL is intercepted",
              "Storage paths are namespaced by organisation ID, preventing any possibility of cross-tenant file access even if a storage key is guessed",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 3 — Application Security */}
      <DocSection id="application" number="3" title="Application Security">
        <SubSection title="3.1 Authentication and Session Management">
          <div className="space-y-2">
            <ControlCard
              label="JWT-Based Authentication"
              detail="Access to the platform is controlled via short-lived JSON Web Tokens (JWTs). Access tokens have a short expiry period (minutes to hours depending on role); refresh tokens enable seamless re-authentication without requiring repeated login. Tokens are cryptographically signed using industry-standard algorithms."
            />
            <ControlCard
              label="Password Security"
              detail="Passwords are hashed using Argon2 (or bcrypt as a fallback), which are the industry-standard memory-hard hashing algorithms specifically designed to resist GPU-accelerated brute-force attacks. Plaintext passwords are never stored, logged, or transmitted."
            />
            <ControlCard
              label="Email Verification"
              detail="New accounts require email verification before accessing the platform. Verification links are time-limited (24 hours) and one-time use. Resend of verification emails is rate-limited to prevent abuse."
            />
            <ControlCard
              label="Password Reset Security"
              detail="Password reset links are cryptographically random, single-use, and expire within 1 hour. Expired or used tokens are immediately invalidated."
            />
          </div>
        </SubSection>
        <SubSection title="3.2 Authorisation and Access Control">
          <p>
            SheriaBot implements <strong className="text-foreground">Role-Based Access Control (RBAC)</strong>{" "}
            with four defined roles, each with strictly scoped permissions:
          </p>
          <InfoTable
            rows={[
              ["Regulator", "Read access to regulatory frameworks and policy generation tools; cannot access startup compliance data"],
              ["Startup", "Full access to compliance tools (AI queries, checklists, gap analysis, document management) within their organisation"],
              ["Enterprise", "Extended feature set including team management and advanced analytics; scoped to their organisation"],
              ["Admin", "Platform administration; internal SheriaBot use only; full audit trail of all administrative actions"],
            ]}
          />
          <p className="mt-2">
            Per-organisation data isolation is enforced at the database query level — every query is scoped to
            the authenticated user&apos;s organisation ID. There is no scenario in which a user can access data
            belonging to a different organisation through normal platform functionality.
          </p>
        </SubSection>
        <SubSection title="3.3 Input Validation and Injection Prevention">
          <div className="space-y-2">
            <ControlCard
              label="Schema Validation"
              detail="All API inputs are validated against strict schemas defined using the Zod library. Invalid requests are rejected at the API layer before reaching any business logic or database operations."
            />
            <ControlCard
              label="SQL Injection Prevention"
              detail="The platform uses Prisma ORM exclusively for all database interactions. Prisma generates parameterised queries, which structurally prevent SQL injection attacks regardless of input content."
            />
            <ControlCard
              label="XSS Prevention"
              detail="React's default output escaping prevents cross-site scripting (XSS) attacks in all rendered UI components. Content Security Policy headers provide an additional layer of protection."
            />
            <ControlCard
              label="File Upload Validation"
              detail="Uploaded files are validated by magic byte inspection (reading the actual file binary header) rather than relying solely on the client-provided MIME type or file extension, which can be trivially spoofed. Only PDF, PNG, JPEG, and DOCX files are accepted. Files are renamed with UUIDs upon upload, preventing path traversal and enumeration attacks."
            />
          </div>
        </SubSection>
        <SubSection title="3.4 HTTP Security Headers">
          <p>
            All responses from the SheriaBot backend include the following security headers, enforced via the
            Helmet middleware:
          </p>
          <BulletList
            items={[
              "Content-Security-Policy (CSP) — restricts the sources from which scripts, styles, and other resources can be loaded",
              "X-Content-Type-Options: nosniff — prevents MIME-type sniffing attacks",
              "X-Frame-Options: DENY — prevents the platform from being embedded in iframes (clickjacking protection)",
              "Strict-Transport-Security (HSTS) — enforces HTTPS for all future requests from the browser",
              "Referrer-Policy: strict-origin-when-cross-origin — controls referrer information sent with requests",
              "Permissions-Policy — restricts access to browser features such as camera, microphone, and geolocation",
            ]}
          />
        </SubSection>
        <SubSection title="3.5 Rate Limiting and Abuse Prevention">
          <BulletList
            items={[
              "All API endpoints are rate-limited to prevent brute-force attacks, credential stuffing, and abuse of AI processing endpoints",
              "Authentication endpoints (login, password reset, email verification) have stricter rate limits than general API endpoints",
              "AI query endpoints are rate-limited per user and per organisation to prevent abuse and manage costs equitably",
              "Rate limit violations are logged and monitored for patterns indicating automated attack attempts",
            ]}
          />
        </SubSection>
        <SubSection title="3.6 tRPC API Security">
          <p>
            SheriaBot uses tRPC for all client-server communication. Every tRPC procedure enforces:
          </p>
          <BulletList
            items={[
              "Authentication middleware: unauthenticated requests to protected procedures are rejected with 401",
              "Authorisation checks: role-based checks enforce that users can only call procedures appropriate to their role",
              "Input validation: all procedure inputs are validated via Zod schemas as part of the tRPC procedure definition",
              "Audit logging: sensitive procedures (document upload, gap analysis, account management) are logged to the audit trail",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 4 — AI & Data Processing Security */}
      <DocSection id="ai-security" number="4" title="AI and Data Processing Security">
        <Callout variant="success">
          <strong className="text-foreground">Transparency Commitment:</strong> SheriaBot is an AI-powered
          compliance platform. We are committed to full transparency about how AI processing affects data security
          and privacy. This section explains exactly how user data flows through our AI pipeline.
        </Callout>
        <SubSection title="4.1 Query Transmission to Anthropic">
          <BulletList
            items={[
              "User compliance queries are transmitted to Anthropic's Claude API over TLS-encrypted connections",
              "Queries are accompanied by retrieved regulatory document context (from Pinecone) — not the user's full account data or uploaded documents unless the user explicitly submits a document for analysis",
              "Anthropic's API usage policy (as of the effective date of this Policy) does not use API inputs to train models by default. SheriaBot maintains a Data Processing Agreement with Anthropic confirming this restriction",
              "Anthropic processes queries transiently for the purpose of generating a response; queries are not retained by Anthropic for training purposes under our enterprise API agreement",
            ]}
          />
        </SubSection>
        <SubSection title="4.2 Pinecone Vector Database">
          <BulletList
            items={[
              "Pinecone stores mathematical vector embeddings of Kenyan regulatory documents (CBK guidelines, CMA regulations, DPA 2019 text, etc.). These are public domain regulatory texts",
              "Vector embeddings are mathematical representations of text — they are not the original documents and cannot be directly reversed into readable text",
              "No personal data from user accounts, queries, or uploaded documents is stored in Pinecone. The vector database contains only embeddings of public regulatory content",
              "SheriaBot maintains a DPA with Pinecone governing the security of the vector storage infrastructure",
            ]}
          />
        </SubSection>
        <SubSection title="4.3 No AI Model Training on User Data">
          <p>
            <strong className="text-foreground">SheriaBot does not use user data to train, fine-tune, or
            otherwise improve AI models.</strong> This applies to:
          </p>
          <BulletList
            items={[
              "User compliance queries submitted to the AI assistant",
              "Documents uploaded by users for compliance analysis",
              "AI-generated outputs (compliance reports, checklists, gap analyses)",
              "User interaction patterns, corrections, or feedback",
            ]}
          />
          <p className="mt-2">
            Aggregated, anonymised usage data may be used to improve platform performance (e.g., optimising
            prompt engineering or retrieval quality), but this never involves individual user data or any
            personally identifiable information.
          </p>
        </SubSection>
        <SubSection title="4.4 Document Analysis Security">
          <p>
            When a user submits a document for compliance analysis (e.g., uploading a privacy policy for gap
            analysis), the document content is:
          </p>
          <BulletList
            items={[
              "Read from Cloudflare R2 using short-lived presigned URLs generated on-demand",
              "Chunked into segments for analysis; only the relevant chunks are transmitted to the AI for processing",
              "Not cached in memory beyond the duration of the analysis request",
              "Not shared with other users or organisations under any circumstances",
              "Retained in Cloudflare R2 storage until the user deletes it, subject to the retention schedule in the Privacy Policy",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 5 — Data Isolation */}
      <DocSection id="isolation" number="5" title="Data Isolation and Access Control">
        <SubSection title="5.1 Multi-Tenant Architecture">
          <p>
            SheriaBot operates a multi-tenant architecture in which all customers share the same underlying
            infrastructure, but data is rigorously isolated between tenants (organisations).
          </p>
          <BulletList
            items={[
              "Every database table containing customer data includes an organisationId foreign key. All queries from authenticated API endpoints automatically filter by the requesting user's organisationId",
              "This isolation is enforced at the data access layer — it is not possible for a user of Organisation A to retrieve data belonging to Organisation B through any API endpoint, regardless of how the request is crafted",
              "Cloudflare R2 storage paths include the organisationId as a namespace prefix. Files are never served without a valid presigned URL tied to the correct organisation",
              "Redis cache keys are namespaced by organisationId and userId, preventing cross-tenant cache poisoning",
            ]}
          />
        </SubSection>
        <SubSection title="5.2 Principle of Least Privilege">
          <BulletList
            items={[
              "Internal SheriaBot personnel access to production systems is restricted to those with a demonstrable operational need",
              "Production database credentials are not stored on developer workstations; access is via controlled, audited channels",
              "API keys and service credentials are stored exclusively in environment variables managed by the hosting provider's secret management systems",
              "All API keys and service credentials are scoped to the minimum permissions required for their function (e.g., R2 API keys have read/write access only to the designated bucket, not account-level access)",
            ]}
          />
        </SubSection>
        <SubSection title="5.3 Audit Logging">
          <p>
            SheriaBot maintains a comprehensive audit log of access to sensitive data and administrative actions:
          </p>
          <BulletList
            items={[
              "All authentication events (successful login, failed login attempts, password resets) are logged with timestamp, IP address, and user agent",
              "Administrative actions (user suspension, organisation verification, data deletion) are logged with the actor's identity, the action taken, and the affected records",
              "Document access events (upload, download, deletion) are logged per organisation",
              "AI query submissions are logged (query metadata, not content) for service delivery and abuse detection",
              "Audit logs are immutable — records cannot be modified or deleted via the normal application interface",
              "Audit logs are retained for 3 years in accordance with our data retention schedule",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 6 — Incident Response */}
      <DocSection id="incident-response" number="6" title="Incident Response">
        <p>
          SheriaBot maintains a documented incident response plan aligned with the requirements of the{" "}
          <strong className="text-foreground">Kenya Data Protection Act, 2019</strong> and the{" "}
          <strong className="text-foreground">Computer Misuse and Cybercrimes Act, 2018</strong>.
        </p>
        <SubSection title="6.1 Incident Categories">
          <BulletList
            items={[
              "Personal data breach: Accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data (notifiable under DPA 2019 s.43)",
              "Service availability incident: Unplanned outage or significant degradation of the platform affecting users' ability to access their compliance data",
              "Security incident: Any event suggesting a threat to the confidentiality, integrity, or availability of the platform (e.g., attempted intrusion, DDoS attack, compromised credential)",
              "Third-party sub-processor incident: A security incident at a sub-processor (e.g., Anthropic, Cloudflare, Railway) that may affect SheriaBot customer data",
            ]}
          />
        </SubSection>
        <SubSection title="6.2 Response Timelines">
          <InfoTable
            rows={[
              ["Suspected breach reported internally", "Within 4 hours of discovery"],
              ["Initial incident assessment", "Within 24 hours of report"],
              ["ODPC notification (if notifiable)", "Within 72 hours of becoming aware (DPA 2019 s.43)"],
              ["Affected user notification (if high risk)", "Without unreasonable delay after ODPC notification"],
              ["Post-incident review", "Within 30 days of incident resolution"],
            ]}
          />
        </SubSection>
        <SubSection title="6.3 Reporting a Security Concern">
          <p>
            To report a security vulnerability or a suspected security incident affecting the SheriaBot platform:
          </p>
          <BulletList
            items={[
              "Email: security@sheriabot.co.ke — for responsible disclosure of vulnerabilities",
              "Email: support@sheriabot.co.ke — for suspected account compromise or unusual activity on your account",
              "Please include: a description of the issue, steps to reproduce (if applicable), the potential impact, and your contact details for follow-up",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 7 — Business Continuity */}
      <DocSection id="continuity" number="7" title="Business Continuity and Disaster Recovery">
        <SubSection title="7.1 Service Availability">
          <p>
            SheriaBot is committed to maintaining high availability of the platform. Our infrastructure providers
            (Vercel, Render, Railway, Cloudflare) each operate across multiple geographic regions with built-in
            redundancy. In the event of a regional failure affecting a single provider, traffic can be redirected
            to alternative regions.
          </p>
        </SubSection>
        <SubSection title="7.2 Database Backups">
          <BulletList
            items={[
              "Automated daily backups of the PostgreSQL database are performed by Railway, retained for a rolling 7-day window",
              "Point-in-time recovery (PITR) is available, enabling restoration to any point within the backup window in the event of data corruption or accidental deletion",
              "Backup integrity is verified periodically by the engineering team",
            ]}
          />
        </SubSection>
        <SubSection title="7.3 Document Storage Resilience">
          <p>
            Compliance documents stored on Cloudflare R2 benefit from Cloudflare&apos;s globally distributed
            infrastructure, which provides built-in redundancy and durability. Cloudflare R2 is engineered for{" "}
            <strong className="text-foreground">99.999999999% (eleven nines)</strong> data durability.
          </p>
        </SubSection>
        <SubSection title="7.4 Recovery Objectives">
          <InfoTable
            rows={[
              ["Recovery Time Objective (RTO)", "Target: 4 hours for major infrastructure failures; 1 hour for application-layer incidents"],
              ["Recovery Point Objective (RPO)", "Target: 24 hours (based on daily backup schedule); PITR available for shorter windows"],
              ["Communication During Outage", "Status updates posted to status.sheriabot.co.ke and via email to registered users for outages exceeding 30 minutes"],
            ]}
          />
        </SubSection>
        <SubSection title="7.5 Planned Maintenance">
          <p>
            Scheduled maintenance windows are communicated to registered users via email and in-app notifications
            at least 48 hours in advance. Maintenance is scheduled during low-usage periods where possible (e.g.,
            weekend evenings EAT) to minimise disruption.
          </p>
        </SubSection>
      </DocSection>

      {/* Section 8 — Secure Development */}
      <DocSection id="development" number="8" title="Secure Development Practices">
        <p>
          Security is embedded into every stage of the SheriaBot software development lifecycle (SDLC), not
          applied as a post-development layer.
        </p>
        <SubSection title="8.1 Codebase Security">
          <div className="space-y-2">
            <ControlCard
              label="Strict TypeScript"
              detail="The entire codebase (frontend and backend) is written in strict TypeScript with no 'any' types permitted. This provides compile-time type safety, significantly reducing a class of runtime errors and potential vulnerabilities that arise from unexpected data types."
            />
            <ControlCard
              label="Dependency Management"
              detail="All third-party dependencies are audited using automated tooling (npm audit / pnpm audit) as part of the CI/CD pipeline. High-severity vulnerabilities trigger automated alerts and must be remediated before deployment. Outdated dependencies are reviewed and updated on a regular schedule."
            />
            <ControlCard
              label="Secret Management"
              detail="Environment variables are used for all secrets (API keys, database credentials, JWT signing secrets). No secrets are committed to version control. Production secrets are managed via hosting provider secret management systems (Vercel environment variables, Render secret groups, Railway secrets)."
            />
            <ControlCard
              label="Code Review"
              detail="All code changes to the production codebase require peer review by at least one other engineer before merging. Security-sensitive changes (authentication, authorisation, data handling) receive additional scrutiny."
            />
          </div>
        </SubSection>
        <SubSection title="8.2 CI/CD Pipeline Security">
          <BulletList
            items={[
              "Automated TypeScript compilation checks run on every pull request — type errors block deployment",
              "Dependency vulnerability scanning runs on every CI build",
              "Environment-specific configurations separate development, staging, and production environments; production credentials are never used in development or testing",
              "Deployment to production requires successful completion of all CI checks",
            ]}
          />
        </SubSection>
        <SubSection title="8.3 Privacy-by-Design">
          <BulletList
            items={[
              "New features involving personal data processing are reviewed against the Data Protection Policy before implementation",
              "Data minimisation is considered at the API design stage — endpoints collect only the data fields required for their stated function",
              "Data Protection Impact Assessments are conducted for high-risk new features before launch (see Data Protection Policy, Section 5)",
              "Security and privacy considerations are included in the definition of 'done' for all development tasks",
            ]}
          />
        </SubSection>
      </DocSection>

      {/* Section 9 — Compliance Alignment */}
      <DocSection id="compliance" number="9" title="Regulatory and Standards Alignment">
        <p>
          SheriaBot&apos;s security programme is designed to align with the following Kenyan regulatory
          requirements and international security frameworks. Alignment does not imply formal certification unless
          explicitly stated.
        </p>
        <SubSection title="9.1 Kenyan Legal Obligations">
          <div className="space-y-2">
            <ControlCard
              label="Kenya Data Protection Act, 2019 (Cap. 411C)"
              detail="SheriaBot's data protection and security controls are designed to satisfy the obligations of a registered Data Controller and Data Processor under the DPA 2019, including the requirements of Section 41 (security of processing) and Section 43 (personal data breach notification)."
            />
            <ControlCard
              label="Computer Misuse and Cybercrimes Act, 2018"
              detail="SheriaBot's platform access controls, audit logging, and incident response procedures are designed to support compliance with Kenya's Computer Misuse and Cybercrimes Act, including provisions relating to unauthorised access, data interference, and system interference."
            />
            <ControlCard
              label="CBK Cybersecurity Guidelines"
              detail="As a platform serving regulated Kenyan financial institutions, SheriaBot aligns its security controls with the Central Bank of Kenya's cybersecurity guidelines, including requirements for access controls, encryption, incident response, and third-party risk management."
            />
          </div>
        </SubSection>
        <SubSection title="9.2 International Framework Alignment">
          <div className="space-y-2">
            <ControlCard
              label="NIST Cybersecurity Framework (CSF)"
              detail="SheriaBot's security controls are mapped to the five core functions of the NIST CSF: Identify, Protect, Detect, Respond, and Recover. This framework informs our risk assessment approach, control selection, and incident response planning."
            />
            <ControlCard
              label="ISO/IEC 27001 Principles"
              detail="While SheriaBot does not currently hold ISO 27001 certification, our information security management approach is aligned with the standard's Annex A controls, including asset management, access control, cryptography, physical security, and incident management."
            />
            <ControlCard
              label="OWASP Top 10"
              detail="The development team uses the OWASP Top 10 as a reference checklist during code review and security testing, ensuring the platform addresses the most critical web application security risks including injection, broken authentication, and misconfiguration."
            />
            <ControlCard
              label="PCI-DSS Awareness"
              detail="In anticipation of future payment processing integration (M-PESA, Stripe), SheriaBot's architecture is designed with PCI-DSS awareness. Payment card data will never be stored on SheriaBot's infrastructure — all card processing will be handled by PCI-DSS certified payment processors."
            />
          </div>
        </SubSection>
      </DocSection>

      {/* Section 10 — Contact */}
      <DocSection id="contact" number="10" title="Security Contacts">
        <p>For security-related matters, please use the appropriate contact below:</p>
        <InfoTable
          rows={[
            ["Security Vulnerabilities", "security@sheriabot.co.ke — responsible disclosure of security vulnerabilities"],
            ["Account Security Issues", "support@sheriabot.co.ke — suspected account compromise, unusual activity"],
            ["Data Protection Officer", "dpo@sheriabot.co.ke — data protection and privacy concerns"],
            ["Legal / Regulatory", "legal@sheriabot.co.ke — regulatory inquiries, law enforcement requests"],
            ["General Support", "support@sheriabot.co.ke — general platform support"],
            ["Mailing Address", "SheriaBot Technologies Limited, Nairobi, Kenya"],
          ]}
        />
        <Callout variant="warning">
          <strong className="text-foreground">Law Enforcement Requests:</strong> SheriaBot responds to valid
          legal process (court orders, regulatory demands) issued under the laws of the Republic of Kenya. All
          such requests must be directed to <span className="text-primary">legal@sheriabot.co.ke</span> and
          accompanied by the relevant legal instrument. We will notify affected users of disclosure requests
          unless prohibited by law from doing so.
        </Callout>
      </DocSection>
    </div>
  )
}
