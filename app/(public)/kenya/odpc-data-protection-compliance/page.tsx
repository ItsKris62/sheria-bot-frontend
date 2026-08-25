/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-ODPC-004
 * Route: /kenya/odpc-data-protection-compliance
 * Purpose: Kenya fintech data protection and ODPC compliance authority guide
 * Sprint: SEO Sprint 3
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { absoluteUrl } from '@/lib/site-url'
import {
  SeoAuthorityArticleLayout,
  type PrimarySource,
} from '@/components/seo/seo-authority-article-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, ShieldCheck, AlertTriangle, FileSpreadsheet, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ODPC Data Controller Registration & Compliance Kenya | SheriaBot',
  description:
    'Complete ODPC compliance guide for Kenya fintechs. Master Data Controller & Processor registration, 24-month certificate validity, Section 43 breach notifications, and DPIA rules.',
  alternates: {
    canonical: absoluteUrl('/kenya/odpc-data-protection-compliance'),
  },
  openGraph: {
    title: 'ODPC Data Protection & Registration Guide Kenya | SheriaBot',
    description:
      'Authoritative guide to ODPC registration, Third Schedule mandatory scope, 24-month validity, and Section 43 breach reporting.',
    url: absoluteUrl('/kenya/odpc-data-protection-compliance'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ODPC Data Controller Registration & Compliance Kenya | SheriaBot',
    description:
      'Authoritative guide to ODPC registration, Third Schedule mandatory scope, 24-month validity, and Section 43 breach reporting.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Kenya FinTech Compliance', url: '/kenya/fintech-compliance-requirements' },
  { name: 'ODPC Data Protection Compliance', url: '/kenya/odpc-data-protection-compliance' },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Data Protection Act, 2019 (Act No. 24 of 2019)',
    instrument: 'Principal Act',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/TheDataProtectionAct__No24of2019.pdf',
  },
  {
    title: 'Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021',
    instrument: 'Legal Notice No. 265 of 2021',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2021/LN265_2021.pdf',
  },
  {
    title: 'Data Protection (General) Regulations, 2021',
    instrument: 'Legal Notice No. 263 of 2021',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2021/LN263_2021.pdf',
  },
]

export default function OdpcDataProtectionCompliancePage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="ODPC Regulatory Authority Guide"
      h1="ODPC Data Protection Compliance & Registration Guide for Kenyan FinTechs"
      subtitle="Operational requirements for data controllers and processors under Kenya's Data Protection Act 2019, Third Schedule financial services mandates, and ODPC statutory guidelines."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Office of the Data Protection Commissioner (ODPC)"
      quickAnswer={
        <p>
          FinTech enterprises operating in Kenya must comply with the <strong>Data Protection Act, 2019</strong> and the <strong>Registration Regulations 2021</strong>. Under Regulation 13(2) and the Third Schedule, the small-entity threshold exemption does <strong>not</strong> apply where processing involves the <strong>provision of financial services</strong>. Registration certificates remain valid for <strong>24 months</strong> under Regulation 9 (with renewal governed by Regulation 11). Under Section 43(1), a personal data breach is notifiable to the Data Commissioner within 72 hours of awareness only when there is unauthorized access and a <strong>real risk of harm</strong> to the data subject.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Data Controllers in Financial Services:</strong> FinTechs determining the purpose and means of processing customer financial records.</li>
          <li><strong>Data Processors:</strong> SaaS and cloud providers processing transactional or credit data on behalf of financial institutions.</li>
          <li><strong>Data Protection Officers (DPOs):</strong> Designated personnel managing data protection impact assessments and compliance audits under Section 24.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Automate Your ODPC Compliance Documentation"
      ctaDescription="Generate statutory privacy notices, conduct DPIAs, and manage data inventory registers with SheriaBot."
      ctaButtonText="Explore Privacy Tools"
      ctaHref="/solutions/startups"
    >
      {/* Section 1: Mandatory Registration & Third Schedule Scope */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Mandatory Registration Scope & Third Schedule Applicability
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Under Regulation 4 of the Registration Regulations 2021, any entity acting as a Data Controller or Data Processor in Kenya must register with the ODPC unless exempt.
        </p>
        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            The Financial Services Mandatory Registration Rule
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            While Regulation 13(1) provides a general threshold exemption for entities with an annual turnover under KES 5 million and fewer than 10 employees, <strong>Regulation 13(2) and the Third Schedule explicitly override this exemption</strong> for designated sectors. The Third Schedule specifies the <em>provision of financial services</em> as a mandatory registration category. Consequently, all fintechs and financial technology entities processing personal data must register with the ODPC regardless of turnover or employee size.
          </p>
        </div>
      </section>

      {/* Section 2: Certificate Validity & Renewal Lifecycle */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Certificate Validity & Renewal Lifecycle
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Upon successful verification of application Form DPR1, the ODPC issues a Certificate of Registration:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                24-Month Validity (Regulation 9)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>A Certificate of Registration issued by the ODPC remains valid for a period of <strong>24 months</strong> from the date of issuance.</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Renewal Procedure (Regulation 11)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>Under Regulation 11, renewal applications must be submitted prior to the expiration of the 24-month validity period to ensure uninterrupted registration status.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: Notifiable Data Breach Reporting */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          3. Notifiable Data Breach Reporting Under Section 43
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          A critical compliance rule under the Data Protection Act 2019 is the distinction between internal security incidents and <strong>notifiable personal data breaches</strong>:
        </p>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5 space-y-2.5">
          <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            The Statutory &quot;Real Risk of Harm&quot; Standard (Section 43(1))
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Under Section 43(1) of the Act, a Data Controller is required to notify the Data Commissioner without delay and <strong>within 72 hours of becoming aware</strong> only where personal data has been accessed or acquired by an unauthorized person <strong>and there is a real risk of harm to the data subject</strong>. Where an incident does not meet this threshold, it must be documented in the organization&apos;s internal incident log but does not trigger mandatory ODPC notification.
          </p>
        </div>
      </section>

      {/* Section 4: Data Protection Impact Assessment (DPIA) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          4. Data Protection Impact Assessments (DPIA)
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Under Section 31 of the Act and Regulation 49 of the General Regulations 2021, Data Controllers must conduct a DPIA before deploying processing operations likely to result in high risks to data subjects. This applies to automated credit evaluation, facial biometrics for KYC, and systematic behavioral profiling.
        </p>
        <p className="text-sm">
          <Link
            href="/knowledge-base/dpia-data-protection-impact-assessment-kenya"
            className="text-primary font-medium inline-flex items-center gap-1 hover:underline"
          >
            Read the Complete DPIA Step-by-Step Methodology Guide <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
