/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-AML-005
 * Route: /kenya/aml-cft-fintech-compliance
 * Purpose: Kenya AML/CFT and POCAMLA fintech compliance authority guide
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
import { ArrowRight, CheckCircle2, ShieldCheck, AlertCircle, FileText, UserCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kenya AML/CFT & POCAMLA FinTech Compliance Guide | SheriaBot',
  description:
    'Comprehensive AML/CFT compliance guide for Kenya fintechs. Master POCAMLA Cap. 59A rules, Section 47A FRC registration, STR 2-day reporting, and CTR US$15,000 thresholds.',
  alternates: {
    canonical: absoluteUrl('/kenya/aml-cft-fintech-compliance'),
  },
  openGraph: {
    title: 'Kenya AML/CFT & POCAMLA FinTech Compliance Guide | SheriaBot',
    description:
      'Authoritative guide to POCAMLA Cap. 59A, FRC registration, STR 2-day filing rules, and CTR thresholds for Kenyan fintechs.',
    url: absoluteUrl('/kenya/aml-cft-fintech-compliance'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya AML/CFT & POCAMLA FinTech Compliance Guide | SheriaBot',
    description:
      'Authoritative guide to POCAMLA Cap. 59A, FRC registration, STR 2-day filing rules, and CTR thresholds for Kenyan fintechs.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Kenya Compliance', url: '/kenya/fintech-compliance-requirements' },
  {
    name: 'AML/CFT & POCAMLA Guide',
    url: '/kenya/aml-cft-fintech-compliance',
  },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Proceeds of Crime and Anti-Money Laundering Act (POCAMLA Cap. 59A)',
    instrument: 'Principal Act',
    authority: 'Financial Reporting Centre (FRC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/ProceedsofCrimeandAnti-MoneyLaunderingAct_No9of2009.pdf',
  },
  {
    title: 'Proceeds of Crime and Anti-Money Laundering Regulations, 2023',
    instrument: 'Legal Notice No. 153 of 2023',
    authority: 'Financial Reporting Centre (FRC) / National Treasury',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2023/LN153_2023.pdf',
  },
  {
    title: 'Financial Reporting Centre (FRC) AML/CFT Guidelines for Reporting Institutions',
    instrument: 'Compliance Guidelines',
    authority: 'Financial Reporting Centre (FRC)',
    url: 'https://www.frc.go.ke/',
  },
]

export default function AmlCftFintechCompliancePage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="FRC Regulatory Authority Guide"
      h1="Kenya AML/CFT & POCAMLA Compliance Guide for FinTechs"
      subtitle="The statutory compliance blueprint for Reporting Institutions under POCAMLA Cap. 59A, the POCAMLA Regulations 2023, and Financial Reporting Centre (FRC) supervisory directives."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Financial Reporting Centre (FRC)"
      quickAnswer={
        <p>
          FinTech entities qualifying as Reporting Institutions must comply with the <strong>Proceeds of Crime and Anti-Money Laundering Act (POCAMLA Cap. 59A)</strong> and the <strong>POCAMLA Regulations, 2023</strong>. Core statutory mandates include mandatory registration with the FRC under <strong>Section 47A</strong> via the goAML portal; mandatory filing of Suspicious Transaction Reports (STRs) under <strong>Section 44(2)</strong> within <strong>two days</strong> after suspicion arose; and filing of Cash Transaction Reports (CTRs) under <strong>Section 44(6)</strong> for transactions equivalent to <strong>US$15,000 or above</strong> in any currency.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Digital Credit Providers & Lending Platforms:</strong> Handling loan originations, disbursements, and repayments.</li>
          <li><strong>Payment Service Providers & Remittance Gateways:</strong> Processing peer-to-peer, merchant, or cross-border money transfers.</li>
          <li><strong>Money Laundering Reporting Officers (MLROs):</strong> Compliance officers responsible for transaction monitoring and statutory FRC submissions.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Automate AML Policy Drafting & Verification"
      ctaDescription="Generate statutory AML/CFT compliance manuals and screen for regulatory gaps with SheriaBot compliance intelligence."
      ctaButtonText="Explore Enterprise Solutions"
      ctaHref="/solutions/enterprise"
    >
      {/* Section 1: FRC Registration */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Mandatory FRC Registration Under Section 47A
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Under Section 47A of POCAMLA Cap. 59A, all Reporting Institutions are legally required to register with the Financial Reporting Centre. Registration is conducted electronically through the FRC&apos;s goAML system and must be completed prior to commencing commercial financial operations.
        </p>
      </section>

      {/* Section 2: Suspicious & Cash Transaction Reporting */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Statutory Reporting Timelines & CTR Thresholds
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          POCAMLA Cap. 59A and the 2023 Regulations establish strict reporting thresholds for ongoing financial monitoring:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Suspicious Transaction Reports (STRs)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Mandatory under <strong>Section 44(2) POCAMLA</strong></p>
              <p>• Must be filed <strong>within two days</strong> after suspicion arose</p>
              <p>• Strict tipping-off prohibitions apply under Section 49</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Cash Transaction Reports (CTRs)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Mandatory under <strong>Section 44(6) & Regulation 40</strong></p>
              <p>• Threshold: <strong>US$15,000 or equivalent</strong> in another currency</p>
              <p>• Covers single transactions or aggregated linked cash deposits</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: Customer Due Diligence (CDD) & PEP Screening */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          3. Customer Due Diligence (CDD) & PEP Screening
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Under Section 45 of the Act, reporting institutions must implement a Risk-Based Approach (RBA) to customer onboarding. Key pillars include:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Identity Verification:</strong> Verifying individual data subjects against official government registers (e.g. IPRS).</li>
          <li><strong>Beneficial Ownership:</strong> Identifying individuals who ultimately own or control 10% or more of corporate legal entities.</li>
          <li><strong>Politically Exposed Persons (PEPs):</strong> Applying Enhanced Due Diligence (EDD) and senior management approval for domestic and foreign PEPs.</li>
        </ul>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
