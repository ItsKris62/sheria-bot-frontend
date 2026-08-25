/**
 * SheriaBot SEO
 * File ID: SEO-S05-KE-ASSET-REGTRACKER-010
 * Route: /kenya/regulatory-change-tracker
 * Purpose: Public Hero Linkable Asset tracking verified Kenyan regulatory changes, circulars, and gazetted amendments across CBK, ODPC, FRC, and CMA
 * Sprint: SEO Sprint 5
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
import { ArrowRight, ExternalLink, Calendar, ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kenya FinTech Regulatory Change Tracker (CBK, ODPC, FRC, CMA) | SheriaBot',
  description:
    'Live public registry of gazetted regulatory notices, supervisory circulars, and statutory amendments governing FinTech, digital lending, and data privacy in Kenya.',
  alternates: {
    canonical: absoluteUrl('/kenya/regulatory-change-tracker'),
  },
  openGraph: {
    title: 'Kenya FinTech Regulatory Change Tracker | SheriaBot',
    description:
      'Verified repository of Kenyan regulatory updates across Central Bank of Kenya, ODPC, Financial Reporting Centre, and Capital Markets Authority.',
    url: absoluteUrl('/kenya/regulatory-change-tracker'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya FinTech Regulatory Change Tracker | SheriaBot',
    description:
      'Verified repository of Kenyan regulatory updates across Central Bank of Kenya, ODPC, Financial Reporting Centre, and Capital Markets Authority.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Kenya Compliance', url: '/kenya/fintech-compliance-requirements' },
  {
    name: 'Regulatory Change Tracker',
    url: '/kenya/regulatory-change-tracker',
  },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Central Bank of Kenya (Digital Credit Providers) Regulations, 2022',
    instrument: 'Legal Notice No. 46 of 2022',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2022/LN46_2022.pdf',
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
  {
    title: 'Proceeds of Crime and Anti-Money Laundering Regulations, 2023',
    instrument: 'Legal Notice No. 153 of 2023',
    authority: 'Financial Reporting Centre (FRC) / National Treasury',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2023/LN153_2023.pdf',
  },
  {
    title: 'Capital Markets (Regulatory Sandbox) Policy Guidance Notes, 2019',
    instrument: 'Policy Guidance Note (PGN) — March 2019',
    authority: 'Capital Markets Authority (CMA)',
    url: 'https://www.cma.or.ke/wp-content/uploads/2022/03/Regulatory-Sandbox-Policy-Guidance-Notes-2019.pdf',
  },
]

export type RegulatoryStatus =
  | 'IN_FORCE'
  | 'GAZETTED'
  | 'PROPOSED'
  | 'AMENDED'
  | 'REPEALED'
  | 'SUPERSEDED'
  | 'ACTIVE_GUIDANCE'
  | 'SUPERSEDED_GUIDANCE'
  | 'WITHDRAWN_GUIDANCE'

export type InstrumentType =
  | 'ACT'
  | 'REGULATIONS'
  | 'LEGAL_NOTICE'
  | 'POLICY_GUIDANCE'
  | 'CIRCULAR'
  | 'GUIDELINE'

export interface RegulatoryChangeRecord {
  id: string
  instrument: string
  instrumentType: InstrumentType
  legalNotice: string
  regulator: string
  gazetteDate: string
  effectiveDate: string
  status: RegulatoryStatus
  summary: string
  primaryUrl: string
  lastVerified: string
}

export const REGULATORY_CHANGES: RegulatoryChangeRecord[] = [
  {
    id: 'REG-FRC-2023-LN153',
    instrument: 'Proceeds of Crime and Anti-Money Laundering Regulations, 2023',
    instrumentType: 'REGULATIONS',
    legalNotice: 'Legal Notice No. 153 of 2023',
    regulator: 'Financial Reporting Centre (FRC)',
    gazetteDate: '17 November 2023',
    effectiveDate: '6 October 2023 (Commenced)',
    status: 'IN_FORCE',
    summary:
      'Revoked and replaced the 2013 Regulations under POCAMLA Cap. 59A. Established the US$15,000 equivalent CTR threshold under Regulation 40, mandated Section 47A reporting institution registration on goAML, and codified 2-day STR submission timelines under Section 44(2).',
    primaryUrl: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2023/LN153_2023.pdf',
    lastVerified: 'August 2026',
  },
  {
    id: 'REG-CBK-2022-LN46',
    instrument: 'Central Bank of Kenya (Digital Credit Providers) Regulations, 2022',
    instrumentType: 'REGULATIONS',
    legalNotice: 'Legal Notice No. 46 of 2022',
    regulator: 'Central Bank of Kenya (CBK)',
    gazetteDate: '22 April 2022',
    effectiveDate: '22 April 2022',
    status: 'IN_FORCE',
    summary:
      'Established statutory oversight for digital credit providers under the Central Bank of Kenya Act (Cap. 491). Enacted Regulation 5(5) perpetual license validity, Regulation 5(6) KES 20,000 annual fee due Dec 31, and Regulation 5(7) annual compliance return due Dec 31.',
    primaryUrl: 'https://www.centralbank.go.ke/wp-content/uploads/2022/03/Central-Bank-of-Kenya-Digital-Credit-Providers-Regulations-2022.pdf',
    lastVerified: 'August 2026',
  },
  {
    id: 'REG-ODPC-2021-LN265',
    instrument: 'Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021',
    instrumentType: 'REGULATIONS',
    legalNotice: 'Legal Notice No. 265 of 2021',
    regulator: 'Office of the Data Protection Commissioner (ODPC)',
    gazetteDate: '14 January 2022',
    effectiveDate: '14 July 2022 (Effective under Reg. 1(2))',
    status: 'IN_FORCE',
    summary:
      'Mandated data controller and processor registration under Section 18 DPA 2019. Established Regulation 9 24-month certificate validity, Regulation 11 renewal workflows, and mandatory registration for financial service providers under the Third Schedule.',
    primaryUrl: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2021/LN265_2021.pdf',
    lastVerified: 'August 2026',
  },
  {
    id: 'REG-ODPC-2021-LN263',
    instrument: 'Data Protection (General) Regulations, 2021',
    instrumentType: 'REGULATIONS',
    legalNotice: 'Legal Notice No. 263 of 2021',
    regulator: 'Office of the Data Protection Commissioner (ODPC)',
    gazetteDate: '14 January 2022',
    effectiveDate: '14 January 2022 (Commenced)',
    status: 'IN_FORCE',
    summary:
      'Codified operational standards for data protection impact assessments (Regulation 49), commercial use of personal data, and Section 43 breach notifications governed by the real risk of harm standard.',
    primaryUrl: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2021/LN263_2021.pdf',
    lastVerified: 'August 2026',
  },
  {
    id: 'REG-CMA-2019-PGN',
    instrument: 'CMA Regulatory Sandbox Policy Guidance Notes, 2019',
    instrumentType: 'POLICY_GUIDANCE',
    legalNotice: 'Policy Guidance Note (PGN) — March 2019',
    regulator: 'Capital Markets Authority (CMA)',
    gazetteDate: 'March 2019',
    effectiveDate: 'March 2019 (Current Guidance)',
    status: 'ACTIVE_GUIDANCE',
    summary:
      'Established live testing environment for capital markets fintechs under the Capital Markets Act (Cap. 485A). Governs maximum 12-month testing window with potential 12-month extension and boundary risk mitigation controls.',
    primaryUrl: 'https://www.cma.or.ke/wp-content/uploads/2022/03/Regulatory-Sandbox-Policy-Guidance-Notes-2019.pdf',
    lastVerified: 'August 2026',
  },
]

export default function KenyaRegulatoryChangeTrackerPage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="Public Linkable Research Asset"
      h1="Kenya FinTech Regulatory Change Tracker"
      subtitle="A source-grounded intelligence resource tracking gazetted legal notices, supervisory circulars, and statutory amendments governing financial technology in Kenya."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Multi-Agency (CBK, ODPC, FRC, CMA)"
      quickAnswer={
        <p>
          The <strong>Kenya FinTech Regulatory Change Tracker</strong> documents gazetted statutory instruments, regulatory circulars, and supervisory policy notes issued by the Central Bank of Kenya (CBK), Office of the Data Protection Commissioner (ODPC), Financial Reporting Centre (FRC), and Capital Markets Authority (CMA). Each entry provides verified legal notice identifiers, effective dates, and direct links to official primary source documents.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Technology Journalists & Media:</strong> Verified reference data for reporting on Kenyan financial technology policy.</li>
          <li><strong>FinTech Founders & Compliance Officers:</strong> Operational tracking of gazetted amendments and recurring deadlines.</li>
          <li><strong>Legal Researchers & Institutional Investors:</strong> Primary legal citations and supervisory frameworks.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Automate Regulatory Tracking for Your FinTech"
      ctaDescription="Never miss a gazetted circular or filing deadline. Track changes and generate compliance checklists with SheriaBot."
      ctaButtonText="Explore Compliance Platform"
      ctaHref="/solutions/startups"
    >
      {/* Upward Link to Master Pillar */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-foreground/80 flex items-center justify-between">
        <span>Part of the <strong>Master Kenya FinTech Compliance Framework</strong>.</span>
        <Link
          href="/kenya/fintech-compliance-requirements"
          className="text-primary font-semibold flex items-center gap-1 hover:underline shrink-0"
        >
          View Master FinTech Hub <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Regulatory Change Log Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Chronological Regulatory Change Log
          </h2>
          <Badge variant="outline" className="border-primary/40 text-primary">
            {REGULATORY_CHANGES.length} Verified Instruments
          </Badge>
        </div>
        <p className="leading-relaxed text-muted-foreground text-sm">
          All records are audited against official gazette publications and primary regulator repositories.
        </p>

        <div className="space-y-4 not-prose my-6">
          {REGULATORY_CHANGES.map((item) => (
            <Card key={item.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {item.regulator}
                    </span>
                    <CardTitle className="text-base font-bold text-foreground">
                      {item.instrument}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{item.legalNotice}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] font-mono border-border">
                      {item.instrumentType.replace('_', ' ')}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        item.status === 'IN_FORCE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium'
                          : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-medium'
                      }
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm">
                <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                  {item.summary}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Gazetted: {item.gazetteDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Effective: {item.effectiveDate}
                    </span>
                  </div>
                  <a
                    href={item.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    Primary Gazette Document <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
