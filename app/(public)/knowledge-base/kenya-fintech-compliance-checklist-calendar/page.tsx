/**
 * SheriaBot SEO
 * File ID: SEO-S04-KE-KB-CHECKLIST-014
 * Route: /knowledge-base/kenya-fintech-compliance-checklist-calendar
 * Purpose: Actionable operational compliance checklist and annual statutory deadlines calendar
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
import { ArrowRight, CheckCircle2, Calendar, Scale, Shield, Building2, Landmark } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kenya FinTech Compliance Checklist & Deadlines | SheriaBot',
  description:
    'Consolidated operational compliance checklist and annual statutory calendar for fintechs in Kenya covering CBK, ODPC, FRC, and CMA filing obligations.',
  alternates: {
    canonical: absoluteUrl('/knowledge-base/kenya-fintech-compliance-checklist-calendar'),
  },
  openGraph: {
    title: 'Kenya FinTech Compliance Checklist & Annual Calendar | SheriaBot',
    description:
      'Master operational compliance checklist and annual statutory deadlines table across CBK, ODPC, FRC, and CMA for Kenyan fintechs.',
    url: absoluteUrl('/knowledge-base/kenya-fintech-compliance-checklist-calendar'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya FinTech Compliance Checklist & Deadlines | SheriaBot',
    description:
      'Master operational compliance checklist and annual statutory deadlines table across CBK, ODPC, FRC, and CMA for Kenyan fintechs.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Knowledge Base', url: '/knowledge-base' },
  {
    name: 'FinTech Compliance Checklist',
    url: '/knowledge-base/kenya-fintech-compliance-checklist-calendar',
  },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Central Bank of Kenya (Digital Credit Providers) Regulations, 2022',
    instrument: 'Legal Notice No. 46 of 2022',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'https://www.centralbank.go.ke/wp-content/uploads/2022/03/Central-Bank-of-Kenya-Digital-Credit-Providers-Regulations-2022.pdf',
  },
  {
    title: 'Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021',
    instrument: 'Legal Notice No. 265 of 2021',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2021/LN265_2021.pdf',
  },
  {
    title: 'Proceeds of Crime and Anti-Money Laundering Act (POCAMLA Cap. 59A)',
    instrument: 'Principal Act',
    authority: 'Financial Reporting Centre (FRC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/ProceedsofCrimeandAnti-MoneyLaunderingAct_No9of2009.pdf',
  },
]

export default function FintechComplianceChecklistPage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="Knowledge Base Operational Guide"
      h1="Kenya FinTech Compliance Checklist & Statutory Deadlines Manual"
      subtitle="The consolidated compliance management matrix and statutory calendar mapping recurring regulatory filings, fees, and audit triggers across Kenyan financial authorities."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Multi-Regulator (CBK, ODPC, FRC, CMA)"
      quickAnswer={
        <p>
          Maintaining active compliance for a Kenyan fintech requires synchronizing filings across multiple regulatory bodies. Key statutory deadlines include the <strong>31 December</strong> dual mandate for Digital Credit Providers (KES 20,000 annual regulatory fee under Regulation 5(6) and compliance return under Regulation 5(7)); the <strong>24-month</strong> ODPC certificate renewal cycle under Regulation 11; and ongoing <strong>two-day</strong> STR reporting under Section 44(2) of POCAMLA Cap. 59A.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>FinTech Founders & Operations Directors:</strong> Executives structuring annual compliance budgets and filing calendars.</li>
          <li><strong>Chief Compliance Officers:</strong> Governance leaders tracking regulatory returns across banking, data privacy, and AML domains.</li>
          <li><strong>Corporate Secretaries & Legal Counsel:</strong> Professional advisors auditing annual corporate good standing and license maintenance.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Automate Your Statutory Compliance Calendar"
      ctaDescription="Track all recurring Kenyan regulatory filing dates, receive automated pre-deadline alerts, and generate supervisory reports with SheriaBot."
      ctaButtonText="Explore Compliance Calendar"
      ctaHref="/solutions/startups"
    >
      {/* Upward Link to Pillar */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-foreground/80 flex items-center justify-between">
        <span>Part of the <strong>Master Kenya FinTech Compliance Hub</strong>.</span>
        <Link
          href="/kenya/fintech-compliance-requirements"
          className="text-primary font-semibold flex items-center gap-1 hover:underline shrink-0"
        >
          View Master FinTech Hub <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Section 1: Consolidated Annual Statutory Deadlines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Consolidated Statutory Deadlines Matrix
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          The table below outlines the primary recurring compliance deadlines applicable to fintech operators in Kenya:
        </p>

        <div className="overflow-x-auto not-prose my-4 rounded-lg border border-border">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
              <tr>
                <th className="p-3">Regulator</th>
                <th className="p-3">Statutory Obligation</th>
                <th className="p-3">Legal Basis</th>
                <th className="p-3">Filing Frequency / Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="p-3 font-medium text-foreground">CBK</td>
                <td className="p-3">DCP Annual Regulatory Fee (KES 20,000)</td>
                <td className="p-3">Reg 5(6) & Second Sched.</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">On or before 31 December</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">CBK</td>
                <td className="p-3">DCP Annual Return Certifying Compliance</td>
                <td className="p-3">Regulation 5(7)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">On or before 31 December</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">ODPC</td>
                <td className="p-3">Data Controller / Processor Registration Renewal</td>
                <td className="p-3">Regulation 9 & 11</td>
                <td className="p-3">Every 24 Months (Pre-expiry)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">FRC</td>
                <td className="p-3">Suspicious Transaction Reports (STRs)</td>
                <td className="p-3">POCAMLA Sec. 44(2)</td>
                <td className="p-3">Within 2 Days of Suspicion</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">FRC</td>
                <td className="p-3">Cash Transaction Reports (CTRs &ge; US$15,000)</td>
                <td className="p-3">POCAMLA Sec. 44(6) & Reg 40</td>
                <td className="p-3">Ongoing / Real-time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Phase-by-Phase FinTech Compliance Checklist */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Phase-by-Phase Operational Compliance Checklist
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Phase A: Pre-Launch Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Local company incorporation under Companies Act 2015</p>
              <p>• Mandatory ODPC registration under Third Schedule</p>
              <p>• FRC reporting institution registration via goAML</p>
              <p>• Conduct pre-launch DPIA for algorithmic credit scoring</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Landmark className="h-4 w-4 text-primary" />
                Phase B: Ongoing Operational Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Continuous AML transaction monitoring & 2-day STR filing</p>
              <p>• Transparent total cost of credit disclosures</p>
              <p>• Section 43 breach incident logging & 72-hour harm notice</p>
              <p>• Prohibited debt collection & non-harassment policy audit</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
