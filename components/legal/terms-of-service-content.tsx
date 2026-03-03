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

function Clause({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="space-y-1.5">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="pl-3 border-l-2 border-border space-y-1.5">{children}</div>
    </div>
  )
}

function WarningBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-400">{title}</p>
      <div className="text-sm text-amber-200/80 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/8 p-4 text-sm text-muted-foreground leading-relaxed">
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

export function TermsOfServiceContent() {
  return (
    <div className="space-y-8 text-sm">
      {/* Preamble */}
      <Callout>
        These Terms of Service ("Terms") constitute a legally binding agreement between{" "}
        <strong className="text-foreground">SheriaBot Technologies Limited</strong>, a company incorporated under the
        laws of the Republic of Kenya with registration number [C/XXXXX] ("SheriaBot," "we," "us," or "our"), and
        the organisation or individual accessing or using the SheriaBot platform ("Customer," "you," or "your").{" "}
        <br />
        <br />
        <strong className="text-foreground">
          BY CLICKING "I AGREE," CREATING AN ACCOUNT, OR ACCESSING THE PLATFORM, YOU CONFIRM THAT YOU HAVE READ,
          UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY, WHICH IS INCORPORATED HEREIN BY
          REFERENCE.
        </strong>
      </Callout>

      {/* Section 1 — Definitions */}
      <DocSection id="definitions" number="1" title="Definitions">
        <p>In these Terms, the following definitions apply:</p>
        <div className="space-y-2">
          {[
            ['"Platform"', 'SheriaBot\'s web-based AI compliance application available at https://www.sheriabot.co.ke, including all associated APIs, tools, mobile interfaces, and documentation.'],
            ['"AI Services"', 'The artificial intelligence and machine learning features embedded in the Platform that process compliance queries, analyse regulatory documents, and generate Outputs.'],
            ['"Authorised User"', 'An employee, contractor, or agent of the Customer who is authorised by the Customer to access and use the Platform under the Customer\'s Subscription.'],
            ['"Customer Data"', 'Data, content, documents, and information submitted, uploaded, or transmitted by the Customer or its Authorised Users to the Platform, including documents uploaded for compliance analysis.'],
            ['"Output"', 'AI-generated responses, compliance reports, checklists, risk assessments, and other materials produced by the Platform in response to Customer inputs.'],
            ['"Subscription"', 'The pricing plan selected by the Customer entitling it to access and use the Platform and its features for a specified billing period.'],
            ['"Confidential Information"', 'Any non-public information disclosed by one party to the other that is designated as confidential or that reasonably should be understood to be confidential.'],
          ].map(([term, def]) => (
            <div key={term} className="flex gap-2 p-2.5 rounded-md bg-muted/20 border border-border/50">
              <span className="font-mono font-medium text-primary shrink-0">{term}</span>
              <span className="text-muted-foreground">— {def}</span>
            </div>
          ))}
        </div>
      </DocSection>

      {/* Section 2 — Account Registration */}
      <DocSection id="account" number="2" title="Account Registration and Security">
        <Clause title="2.1 Eligibility">
          <p>
            You must be a duly registered legal entity, or an individual operating in a professional capacity in the
            financial services, fintech, or regulatory sector, to create an account. By registering, you represent and
            warrant that you have the legal authority to bind your organisation to these Terms.
          </p>
        </Clause>

        <Clause title="2.2 Account Accuracy">
          <p>
            You agree to provide accurate, current, and complete information during registration and to maintain the
            accuracy of such information promptly if any details change. SheriaBot is not liable for consequences
            arising from inaccurate registration information.
          </p>
        </Clause>

        <Clause title="2.3 Account Security and Credentials">
          <p>
            You are solely responsible for maintaining the confidentiality of your account credentials (username,
            password, and API keys). You must immediately notify SheriaBot at{" "}
            <span className="text-primary">support@sheriabot.co.ke</span> of any suspected unauthorised access to or
            use of your account. SheriaBot is not liable for any loss, damage, or regulatory consequences resulting
            from unauthorised use of your credentials.
          </p>
        </Clause>

        <Clause title="2.4 Authorised Users">
          <p>
            You may permit Authorised Users to access the Platform up to the number specified in your Subscription
            plan. You are fully responsible for ensuring that all Authorised Users comply with these Terms and that
            their actions on the Platform are treated as your own. Sharing credentials between users is strictly
            prohibited.
          </p>
        </Clause>

        <Clause title="2.5 Account Verification">
          <p>
            SheriaBot reserves the right to verify the identity and credentials of any registered organisation. We
            may request supporting documentation (e.g., Certificate of Incorporation, regulatory licences) and may
            suspend accounts pending verification.
          </p>
        </Clause>
      </DocSection>

      {/* Section 3 — Acceptable Use */}
      <DocSection id="acceptable-use" number="3" title="Acceptable Use Policy">
        <Clause title="3.1 Permitted Use">
          <p>
            The Platform may be used solely for lawful regulatory compliance research, analysis, and management
            purposes within the financial services industry, including but not limited to: reviewing CBK, CMA, IRA,
            and other Kenyan regulatory requirements; conducting compliance gap assessments; and generating internal
            compliance checklists.
          </p>
        </Clause>

        <Clause title="3.2 Prohibited Conduct">
          <p>
            You must not, and must ensure your Authorised Users do not, use the Platform to:
          </p>
          <BulletList
            items={[
              "Distribute AI-generated Outputs to third parties as formal legal advice, legal opinions, or as the work of a qualified legal practitioner",
              "Attempt to reverse-engineer, decompile, disassemble, or extract the underlying AI models, algorithms, or source code",
              "Upload content that is unlawful, defamatory, infringing of third-party intellectual property rights, or that contains malware or malicious code",
              "Use automated bots, scrapers, crawlers, or other unauthorized means to access, extract, or index Platform content",
              "Share, sell, sublicence, or transfer account credentials to individuals who are not registered Authorised Users",
              "Use the Platform in connection with any activity that violates Kenyan law, including the Central Bank of Kenya Act, the Capital Markets Act, the Data Protection Act, or any applicable financial regulation",
              "Attempt to circumvent, bypass, or interfere with any security, access control, rate-limiting, or authentication mechanism",
              "Submit Personal Data of third parties without proper consent or lawful basis under the Kenya Data Protection Act, 2019",
              "Use the Platform to train, fine-tune, or develop competing AI models or compliance tools",
            ]}
          />
        </Clause>

        <Clause title="3.3 Enforcement">
          <p>
            SheriaBot reserves the right to monitor Platform usage (at an aggregate and pseudonymous level) to detect
            policy violations. A breach of this Section 3 may result in immediate suspension or termination of your
            account without refund, in addition to any legal remedies available to SheriaBot.
          </p>
        </Clause>
      </DocSection>

      {/* Section 4 — Payment Terms */}
      <DocSection id="payment" number="4" title="Payment Terms and Subscriptions">
        <Clause title="4.1 Subscription Fees">
          <p>
            You agree to pay the Subscription fees as set out in your selected pricing plan at the time of
            registration or plan upgrade. All fees are quoted in USD or Kenya Shillings (KES) and are inclusive of
            applicable Value Added Tax (VAT) where required under the VAT Act, 2013, and the Kenya Revenue Authority
            guidelines.
          </p>
        </Clause>

        <Clause title="4.2 Billing and Invoicing">
          <p>
            Subscriptions are billed monthly or annually in advance, at the beginning of each billing period.
            Invoices are issued electronically to the billing email address registered on your account. It is your
            responsibility to ensure your billing contact details are current.
          </p>
        </Clause>

        <Clause title="4.3 Payment Terms and Late Payment">
          <p>
            Payment is due within <strong className="text-foreground">14 days</strong> of the invoice date. Overdue
            amounts attract interest at the rate prescribed under the Kenya Late Payment of Commercial Debts Act or,
            if that Act does not apply, at the Central Bank of Kenya base rate plus 4% per annum, calculated daily.
            SheriaBot may suspend Platform access for accounts with outstanding overdue invoices after 7 days'
            written notice.
          </p>
        </Clause>

        <Clause title="4.4 No Refund Policy">
          <p>
            All Subscription fees are non-refundable except where required by applicable Kenyan consumer protection
            law or as expressly stated in a separate Order Form. Cancellation of a Subscription takes effect at the
            end of the then-current billing period; no credits or refunds are issued for unused portions of a billing
            period.
          </p>
        </Clause>

        <Clause title="4.5 Price Changes">
          <p>
            SheriaBot will provide at least{" "}
            <strong className="text-foreground">30 days' written notice</strong> of any Subscription fee increases
            before they take effect. Continued use of the Platform after the effective date of the price change
            constitutes your acceptance of the new pricing.
          </p>
        </Clause>

        <Clause title="4.6 Taxes">
          <p>
            You are responsible for all applicable taxes, withholding taxes, duties, and levies imposed by any
            governmental authority in connection with your use of the Platform, other than taxes based on
            SheriaBot's net income.
          </p>
        </Clause>
      </DocSection>

      {/* Section 5 — IP */}
      <DocSection id="ip" number="5" title="Intellectual Property">
        <Clause title="5.1 SheriaBot Platform Ownership">
          <p>
            SheriaBot retains all intellectual property rights, including copyright, trade secrets, patent rights, and
            trademark rights, in and to the Platform, the AI models and algorithms, the regulatory knowledge base,
            software code, interface designs, and all associated documentation ("SheriaBot IP"). Nothing in these
            Terms transfers any ownership interest in SheriaBot IP to you.
          </p>
        </Clause>

        <Clause title="5.2 Licence to Use the Platform">
          <p>
            Subject to your compliance with these Terms and timely payment of all applicable fees, SheriaBot grants
            you a limited, non-exclusive, non-transferable, non-sublicensable licence to access and use the Platform
            during your Subscription period, solely for your internal regulatory compliance purposes.
          </p>
        </Clause>

        <Clause title="5.3 Customer Data Ownership">
          <p>
            You retain all intellectual property rights in your Customer Data. By uploading or submitting Customer
            Data to the Platform, you grant SheriaBot a limited, non-exclusive, royalty-free licence to process,
            store, and use your Customer Data solely to: (a) provide the Services to you; (b) maintain and improve
            Platform reliability; and (c) comply with legal obligations. SheriaBot will not use your Customer Data to
            train AI models without your explicit written consent.
          </p>
        </Clause>

        <Clause title="5.4 Ownership of AI Outputs">
          <p>
            Subject to your compliance with these Terms and payment of applicable fees, SheriaBot assigns to you all
            intellectual property rights in Outputs generated specifically from your queries. You acknowledge that:
          </p>
          <BulletList
            items={[
              "Outputs are AI-generated and may not be unique — similar queries from other customers may produce substantially similar results",
              "SheriaBot does not warrant the originality, novelty, or registrability of Outputs",
              "Outputs do not constitute legal opinions and cannot be claimed as the work of a qualified legal practitioner",
            ]}
          />
        </Clause>

        <Clause title="5.5 Feedback Licence">
          <p>
            If you provide suggestions, ideas, feature requests, or other feedback about the Platform ("Feedback"),
            you grant SheriaBot a perpetual, irrevocable, worldwide, royalty-free licence to use, incorporate, and
            commercialise such Feedback without any obligation of attribution, compensation, or confidentiality.
          </p>
        </Clause>
      </DocSection>

      {/* Section 6 — AI Disclaimers */}
      <DocSection id="ai-disclaimers" number="6" title="AI-Specific Disclaimers">
        <WarningBox title="Critical Notice — Not Legal Advice">
          <p>
            <strong>
              THE PLATFORM PROVIDES AI-ASSISTED COMPLIANCE INFORMATION AND REGULATORY GUIDANCE FOR GENERAL
              INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY.
            </strong>
          </p>
          <p>
            IT DOES NOT CONSTITUTE, AND MUST NOT BE RELIED UPON AS, FORMAL LEGAL ADVICE, A LEGAL OPINION, LEGAL
            COUNSEL, OR THE PRACTICE OF LAW. NO ADVOCATE-CLIENT, SOLICITOR-CLIENT, OR ATTORNEY-CLIENT RELATIONSHIP
            IS CREATED BETWEEN SHERIABOT AND YOU OR ANY AUTHORISED USER BY YOUR USE OF THE PLATFORM OR BY RECEIPT OF
            ANY OUTPUT.
          </p>
        </WarningBox>

        <Clause title="6.1 Obligation to Consult Qualified Counsel">
          <p>
            Before making any decision that carries material regulatory, legal, or financial risk — including but not
            limited to: formal regulatory filings, responses to enforcement actions, licence applications, or
            adoption of compliance frameworks — you must consult a qualified advocate enrolled with the Law Society
            of Kenya, a certified compliance officer, or a specialist regulatory advisor.
          </p>
        </Clause>

        <Clause title="6.2 Accuracy and Limitations of AI Outputs">
          <p>AI-generated Outputs may contain:</p>
          <BulletList
            items={[
              "Factual errors, inaccuracies, or 'hallucinations' — plausible-sounding but incorrect information",
              "Outdated regulatory references that do not reflect recent amendments, circulars, or gazette notices",
              "Omissions of jurisdiction-specific nuances relevant to your particular regulatory context",
              "Misinterpretations of complex or ambiguous statutory language",
            ]}
          />
          <p className="mt-2">
            SheriaBot makes continuous efforts to update its regulatory knowledge base but cannot guarantee that all
            content reflects the most current regulatory position at the time of your query. You are solely
            responsible for verifying all Outputs against primary regulatory sources, including official CBK, CMA,
            IRA, and ODPC publications.
          </p>
        </Clause>

        <Clause title="6.3 Sole Responsibility for Regulatory Compliance">
          <p>
            Regulatory compliance is and remains your sole legal responsibility. SheriaBot is not responsible for any
            regulatory fines, enforcement actions, licence suspensions, penalties, or compliance failures arising from
            your reliance on any Output. The Platform is a decision-support tool, not a substitute for professional
            compliance management.
          </p>
        </Clause>
      </DocSection>

      {/* Section 7 — Warranties */}
      <DocSection id="warranties" number="7" title="Disclaimer of Warranties">
        <WarningBox title="As-Is Disclaimer">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY THE LAWS OF THE REPUBLIC OF KENYA, THE PLATFORM AND ALL SERVICES ARE
            PROVIDED <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong> WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED.
          </p>
          <p>SHERIABOT EXPRESSLY DISCLAIMS ALL WARRANTIES INCLUDING, WITHOUT LIMITATION:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
            <li>WARRANTIES OF NON-INFRINGEMENT OF THIRD-PARTY RIGHTS</li>
            <li>WARRANTIES THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE AT ALL TIMES</li>
            <li>WARRANTIES THAT ANY OUTPUT WILL BE ACCURATE, COMPLETE, OR FIT FOR YOUR INTENDED PURPOSE</li>
            <li>WARRANTIES THAT DEFECTS WILL BE CORRECTED OR THAT THE PLATFORM IS FREE OF VIRUSES</li>
          </ul>
        </WarningBox>
        <p>
          Any statements made by SheriaBot representatives regarding the Platform's capabilities constitute
          descriptions of product features and not warranties as to the suitability of the Platform for your
          specific regulatory requirements.
        </p>
      </DocSection>

      {/* Section 8 — Liability */}
      <DocSection id="liability" number="8" title="Limitation of Liability">
        <Clause title="8.1 Exclusion of Consequential and Indirect Losses">
          <WarningBox title="Liability Exclusion">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE KENYAN LAW, SHERIABOT SHALL NOT BE LIABLE TO YOU OR ANY
              THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES,
              INCLUDING BUT NOT LIMITED TO: LOSS OF PROFIT, LOSS OF REVENUE, LOSS OF DATA, LOSS OF GOODWILL,
              REGULATORY FINES OR PENALTIES, ENFORCEMENT COSTS, BUSINESS INTERRUPTION, OR COST OF SUBSTITUTE
              SERVICES, EVEN IF SHERIABOT HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </WarningBox>
        </Clause>

        <Clause title="8.2 Aggregate Liability Cap">
          <p>
            SheriaBot's total aggregate liability to you in connection with these Terms, whether arising in contract,
            tort (including negligence), breach of statutory duty, or otherwise, shall not exceed the{" "}
            <strong className="text-foreground">
              total Subscription fees paid by you to SheriaBot in the three (3) calendar months immediately
              preceding the event giving rise to the claim
            </strong>
            .
          </p>
        </Clause>

        <Clause title="8.3 Exceptions to Limitation">
          <p>
            Nothing in these Terms limits or excludes SheriaBot's liability for: (a) death or personal injury caused
            by SheriaBot's negligence; (b) fraud or fraudulent misrepresentation; (c) any other liability that cannot
            lawfully be limited or excluded under Kenyan law.
          </p>
        </Clause>
      </DocSection>

      {/* Section 9 — Indemnification */}
      <DocSection id="indemnification" number="9" title="Indemnification">
        <p>
          You agree to indemnify, defend (at SheriaBot's request), and hold harmless SheriaBot, its directors,
          officers, employees, contractors, successors, and assigns from and against any and all claims, liabilities,
          damages, losses, judgments, and expenses (including reasonable advocate's fees and litigation costs) arising
          out of or in connection with:
        </p>
        <BulletList
          items={[
            "Your breach of any representation, warranty, or obligation under these Terms",
            "Your use or misuse of the Platform, including use by your Authorised Users",
            "Your Customer Data, including any claim that it infringes third-party intellectual property rights or violates applicable data protection laws",
            "Your violation of any applicable law, regulation, or third-party right",
            "Your reliance on any Output for regulatory compliance decisions without independent verification",
          ]}
        />
      </DocSection>

      {/* Section 10 — Termination */}
      <DocSection id="termination" number="10" title="Termination">
        <Clause title="10.1 Termination by Customer">
          <p>
            You may terminate your Subscription at any time by providing written notice to{" "}
            <span className="text-primary">support@sheriabot.co.ke</span>. Termination takes effect at the end of
            the then-current billing period. No refunds are issued for the unused portion of a pre-paid period.
          </p>
        </Clause>

        <Clause title="10.2 Termination by SheriaBot">
          <p>SheriaBot may terminate or suspend your account and access to the Platform immediately if:</p>
          <BulletList
            items={[
              "You materially breach these Terms and fail to cure the breach within 14 days of written notice",
              "You fail to pay any amounts due and the overdue balance remains unpaid after 21 days' notice",
              "You become insolvent, enter into receivership, administration, or voluntary liquidation",
              "Continued provision of the Platform to you would violate applicable law or regulatory requirements",
              "You engage in conduct that SheriaBot reasonably believes constitutes a criminal offence",
            ]}
          />
        </Clause>

        <Clause title="10.3 Effect of Termination">
          <p>Upon termination of your Subscription, for any reason:</p>
          <BulletList
            items={[
              "All licences granted to you under these Terms immediately cease",
              "You must immediately cease using the Platform and delete any locally cached Outputs",
              "SheriaBot will provide a 30-day data export window during which you may download your Customer Data in a standard format",
              "Following the export window, SheriaBot will delete your Customer Data in accordance with our data retention schedule (see Privacy Policy, Section 7)",
              "Accrued payment obligations, indemnification obligations, and any clauses stated to survive termination shall remain in force",
            ]}
          />
        </Clause>
      </DocSection>

      {/* Section 11 — Data Protection */}
      <DocSection id="data-protection" number="11" title="Data Protection">
        <p>
          Both parties acknowledge their respective obligations under the{" "}
          <strong className="text-foreground">Kenya Data Protection Act, 2019</strong>, the{" "}
          <strong className="text-foreground">
            Data Protection (General) Regulations, 2021
          </strong>
          , and any other applicable data protection legislation.
        </p>
        <p>
          In respect of personal data submitted by the Customer to the Platform (Customer Data), SheriaBot acts as a{" "}
          <strong className="text-foreground">Data Processor</strong> and the Customer acts as the{" "}
          <strong className="text-foreground">Data Controller</strong>. SheriaBot's processing activities are
          governed by our Privacy Policy, which constitutes the Data Processing Agreement between the parties. By
          accepting these Terms, you also accept the Privacy Policy in its capacity as a data processing agreement.
        </p>
        <p>
          As Data Controller, you warrant that you have a lawful basis for submitting any personal data to the
          Platform and that doing so complies with your obligations under the DPA. You shall indemnify SheriaBot for
          any losses arising from your failure to comply with data protection law in respect of Customer Data.
        </p>
      </DocSection>

      {/* Section 12 — Confidentiality */}
      <DocSection id="confidentiality" number="12" title="Confidentiality">
        <p>
          Each party agrees to: (a) keep the other party's Confidential Information strictly confidential; (b) not
          disclose it to any third party without prior written consent; and (c) use it only for the purposes
          permitted under these Terms. These obligations do not apply to information that is: (i) publicly available
          through no breach of these Terms; (ii) independently developed by the receiving party; (iii) received from
          a third party without restriction; or (iv) required to be disclosed by law or regulatory authority
          (provided prompt notice is given where legally permissible).
        </p>
      </DocSection>

      {/* Section 13 — Modifications */}
      <DocSection id="modifications" number="13" title="Modifications to the Terms and Platform">
        <p>
          SheriaBot reserves the right to modify these Terms at any time. For{" "}
          <strong className="text-foreground">material changes</strong> (those that materially alter your rights or
          obligations), we will provide at least{" "}
          <strong className="text-foreground">30 days' advance written notice</strong> by email and/or a prominent
          in-platform notice. Your continued use of the Platform after the effective date of the changes constitutes
          your acceptance.
        </p>
        <p>
          SheriaBot may also modify, update, or discontinue Platform features at any time. For Subscription features
          that are materially reduced or discontinued, we will provide at least 30 days' notice and offer a
          pro-rated credit or the opportunity to terminate without penalty.
        </p>
      </DocSection>

      {/* Section 14 — Governing Law */}
      <DocSection id="governing-law" number="14" title="Governing Law and Dispute Resolution">
        <Clause title="14.1 Governing Law">
          <p>
            These Terms and any dispute or claim arising out of or in connection with them (including non-contractual
            disputes) shall be governed by and construed in accordance with the laws of the{" "}
            <strong className="text-foreground">Republic of Kenya</strong>.
          </p>
        </Clause>

        <Clause title="14.2 Good-Faith Negotiation">
          <p>
            In the event of any dispute arising out of or relating to these Terms, the parties shall first attempt to
            resolve the matter through good-faith negotiation between senior representatives of each party for a
            period of not less than <strong className="text-foreground">30 days</strong> following written notice of
            the dispute.
          </p>
        </Clause>

        <Clause title="14.3 Arbitration">
          <p>
            Failing resolution through negotiation, disputes shall be finally resolved by binding arbitration in
            accordance with the{" "}
            <strong className="text-foreground">Arbitration Act, Chapter 49 of the Laws of Kenya</strong>. The seat
            and venue of arbitration shall be <strong className="text-foreground">Nairobi, Kenya</strong>. The
            arbitration shall be conducted in English before a single arbitrator appointed by mutual agreement, or
            failing agreement, by the Chartered Institute of Arbitrators (Kenya Branch). The arbitral award shall be
            final and binding.
          </p>
        </Clause>

        <Clause title="14.4 Injunctive Relief">
          <p>
            Nothing in this Section prevents either party from seeking urgent injunctive or other equitable relief
            from a court of competent jurisdiction to protect intellectual property rights or confidential information.
          </p>
        </Clause>
      </DocSection>

      {/* Section 15 — General */}
      <DocSection id="general" number="15" title="General Provisions">
        <div className="space-y-3">
          {[
            ["15.1 Entire Agreement", "These Terms, together with the Privacy Policy and any Order Form or SOW executed by the parties, constitute the entire agreement between SheriaBot and the Customer regarding the Platform and supersede all prior agreements, representations, and understandings."],
            ["15.2 Severability", "If any provision of these Terms is held to be invalid, unlawful, or unenforceable by a court of competent jurisdiction, that provision shall be severed without affecting the validity and enforceability of the remaining provisions."],
            ["15.3 Waiver", "Failure by either party to exercise or enforce any right or remedy under these Terms does not constitute a waiver of that right or remedy. A waiver is only effective if made in writing and signed by an authorised representative."],
            ["15.4 Force Majeure", "Neither party shall be liable for failure or delay in performance caused by circumstances beyond its reasonable control, including acts of God, government actions, civil disturbances, power or telecommunications failures, or cyberattacks, provided the affected party gives prompt notice and uses reasonable efforts to mitigate the impact."],
            ["15.5 Assignment", "You may not assign or transfer these Terms, or any rights or obligations under them, without SheriaBot's prior written consent. SheriaBot may assign these Terms to an affiliate or in connection with a merger, acquisition, or sale of all or substantially all of its assets, upon written notice to you."],
            ["15.6 Notices", "All legal notices under these Terms must be in writing and sent to: legal@sheriabot.co.ke (for SheriaBot) or the email address registered on your account (for you). Notices are effective upon receipt."],
            ["15.7 Relationship of Parties", "The parties are independent contractors. Nothing in these Terms creates a partnership, joint venture, agency, franchise, or employment relationship between SheriaBot and the Customer."],
          ].map(([title, body]) => (
            <div key={title} className="p-3 rounded-md border border-border bg-muted/10">
              <p className="font-medium text-foreground text-sm">{title}</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  )
}
