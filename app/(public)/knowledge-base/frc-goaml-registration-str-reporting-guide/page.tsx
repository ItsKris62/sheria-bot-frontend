/**
 * SheriaBot SEO
 * File ID: SEO-S04-KE-KB-FRC-GOAML-013
 * Route: /knowledge-base/frc-goaml-registration-str-reporting-guide
 * Purpose: Practical operational manual for FRC goAML registration and STR submission
 * Sprint: SEO Sprint 4
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
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, FileText, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FRC goAML Registration & STR Submission Guide Kenya | SheriaBot',
  description:
    'Operational step-by-step manual for registering reporting institutions on goAML and filing Suspicious Transaction Reports (STRs) within two days under POCAMLA Cap. 59A.',
  alternates: {
    canonical: absoluteUrl('/knowledge-base/frc-goaml-registration-str-reporting-guide'),
  },
  openGraph: {
    title: 'FRC goAML Portal Registration & STR Reporting Guide | SheriaBot',
    description:
      'Operational guide for reporting institutions navigating goAML registration and Section 44(2) 2-day STR filing obligations in Kenya.',
    url: absoluteUrl('/knowledge-base/frc-goaml-registration-str-reporting-guide'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FRC goAML Registration & STR Submission Guide Kenya | SheriaBot',
    description:
      'Operational guide for reporting institutions navigating goAML registration and Section 44(2) 2-day STR filing obligations in Kenya.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Knowledge Base', url: '/knowledge-base' },
  {
    name: 'FRC goAML & STR Guide',
    url: '/knowledge-base/frc-goaml-registration-str-reporting-guide',
  },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Proceeds of Crime and Anti-Money Laundering Act (POCAMLA Cap. 59A)',
    instrument: 'Section 44(2) (STRs) & Section 47A (Registration)',
    authority: 'Financial Reporting Centre (FRC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/ProceedsofCrimeandAnti-MoneyLaunderingAct_No9of2009.pdf',
  },
  {
    title: 'Proceeds of Crime and Anti-Money Laundering Regulations, 2023',
    instrument: 'Legal Notice No. 153 of 2023',
    authority: 'Financial Reporting Centre (FRC) / National Treasury',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2023/LN153_2023.pdf',
  },
]

export default function FrcGoamlReportingGuidePage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="Knowledge Base Operational Guide"
      h1="FRC goAML Portal Registration & STR Reporting Guide for FinTechs"
      subtitle="The operational step-by-step manual for establishing reporting institution status on the Financial Reporting Centre goAML portal and executing statutory 2-day STR filings."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Financial Reporting Centre (FRC)"
      quickAnswer={
        <p>
          Under <strong>Section 47A of POCAMLA Cap. 59A</strong>, every reporting institution must register with the <strong>Financial Reporting Centre (FRC)</strong> via the goAML web portal before commencing commercial operations. Under <strong>Section 44(2)</strong>, reporting institutions must submit Suspicious Transaction Reports (STRs) within <strong>two days</strong> after suspicion arose. Strict tipping-off prohibitions apply under Section 49.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Money Laundering Reporting Officers (MLROs):</strong> Compliance officers with administrative access to the FRC goAML system.</li>
          <li><strong>FinTech Founders & Risk Directors:</strong> Executive leadership configuring AML/CFT transaction monitoring controls and CDD procedures.</li>
          <li><strong>Compliance Analysts:</strong> Operations personnel triaging automated red-flag alerts and drafting STR narratives.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Automate AML Transaction Monitoring Workflows"
      ctaDescription="Screen PEPs, structure STR documentation, and maintain tamper-evident compliance audit trails with SheriaBot."
      ctaButtonText="Explore AML Solutions"
      ctaHref="/solutions/enterprise"
    >
      {/* Upward Link to Pillar */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-foreground/80 flex items-center justify-between">
        <span>Part of the <strong>Kenya AML/CFT & POCAMLA Compliance Framework</strong>.</span>
        <Link
          href="/kenya/aml-cft-fintech-compliance"
          className="text-primary font-semibold flex items-center gap-1 hover:underline shrink-0"
        >
          View Main AML/CFT Pillar <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Section 1: goAML Registration Prerequisites */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Mandatory goAML Registration Under Section 47A
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Registration on the UNODC goAML platform operated by the FRC is mandatory for all reporting institutions. Registration establishes secure, encrypted communication between your compliance team and the intelligence agency.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Required Registration Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Formal Board Resolution appointing the MLRO</p>
              <p>• Certificate of Incorporation and CR12 company search</p>
              <p>• Certified copy of MLRO national identity card / passport</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Two-Day STR Mandate (Section 44(2))
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Suspicious transactions must be filed within <strong>2 days</strong></p>
              <p>• The clock begins when internal suspicion is formed</p>
              <p>• Tipping off any third party is a criminal offense under Sec. 49</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Step-by-Step STR Submission Workflow */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Step-by-Step STR Submission Process
        </h2>
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>1. Alert Escalation:</strong> Transaction monitoring engine flags unusual structuring, velocity anomalies, or high-risk geographic counterparties.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>2. MLRO Investigation:</strong> MLRO evaluates customer onboarding CDD, transaction history, and business justification to determine reasonable grounds for suspicion.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>3. goAML Web Form / XML Compilation:</strong> Compile the structured XML payload or enter the narrative directly into the FRC goAML portal.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>4. Transmission & Acknowledgement:</strong> Transmit the STR securely within the mandatory two-day statutory window and archive the electronic submission receipt.</span>
          </div>
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
