/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-KB-DCP-ANNUAL-009
 * Route: /knowledge-base/cbk-dcp-annual-compliance-return-fees-guide
 * Purpose: DCP annual fee and annual compliance-return operational guide
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
import { ArrowRight, CheckCircle2, Calendar, FileText, AlertTriangle, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CBK DCP Annual Fee & Compliance Return Guide | SheriaBot',
  description:
    'Operational compliance manual for licensed Kenyan Digital Credit Providers. Understand Regulation 5(6) annual fees, Regulation 5(7) compliance returns, and December 31 deadlines.',
  alternates: {
    canonical: absoluteUrl('/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide'),
  },
  openGraph: {
    title: 'CBK DCP Annual Compliance Return & Fees Guide | SheriaBot',
    description:
      'Step-by-step operational manual for licensed DCPs preparing the annual December 31 statutory return and fee submission to the CBK.',
    url: absoluteUrl('/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CBK DCP Annual Fee & Compliance Return Guide | SheriaBot',
    description:
      'Step-by-step operational manual for licensed DCPs preparing the annual December 31 statutory return and fee submission to the CBK.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Knowledge Base', url: '/knowledge-base' },
  { name: 'CBK DCP Annual Return Guide', url: '/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide' },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Central Bank of Kenya (Digital Credit Providers) Regulations, 2022 (Regulation 5)',
    instrument: 'Legal Notice No. 46 of 2022',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'https://www.centralbank.go.ke/wp-content/uploads/2022/03/Central-Bank-of-Kenya-Digital-Credit-Providers-Regulations-2022.pdf',
  },
  {
    title: 'Central Bank of Kenya Act (Cap. 491, Section 59A)',
    instrument: 'Principal Act',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/CentralBankofKenyaActCap491.pdf',
  },
]

export default function CbkDcpAnnualReturnGuidePage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="Knowledge Base Operational Guide"
      h1="CBK DCP Annual Compliance Return & Annual Fee Guide"
      subtitle="The operational compliance checklist for licensed Kenyan Digital Credit Providers managing December 31 statutory fee payments and compliance return submissions."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Central Bank of Kenya (CBK)"
      quickAnswer={
        <p>
          Under <strong>Regulation 5 of the CBK (Digital Credit Providers) Regulations, 2022</strong>, a DCP licence is perpetual unless suspended or revoked (Regulation 5(5)). However, every licensed digital credit provider must fulfill two mandatory statutory obligations on or before <strong>31 December</strong> each year: pay the annual regulatory fee of <strong>KES 20,000</strong> (Regulation 5(6) + Second Schedule) and submit an <strong>annual return certifying compliance</strong> with the Act and Regulations (Regulation 5(7)).
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Licensed Digital Credit Providers (DCPs):</strong> All entities holding an active digital credit license issued by the CBK.</li>
          <li><strong>Compliance Officers & COOs:</strong> Corporate executives responsible for regulatory calendar tracking and supervisory filings.</li>
          <li><strong>Legal Counsel:</strong> Attorneys certifying statutory compliance and managing CBK correspondence.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Never Miss a Statutory Compliance Deadline"
      ctaDescription="Track CBK annual filings, manage compliance certificates, and generate supervisory reports with SheriaBot."
      ctaButtonText="Explore Compliance Calendar"
      ctaHref="/solutions/startups"
    >
      {/* Upward Link to Pillar */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-foreground/80 flex items-center justify-between">
        <span>Part of the <strong>CBK Digital Credit Provider Regulatory Framework</strong>.</span>
        <Link
          href="/kenya/cbk-digital-credit-provider-compliance"
          className="text-primary font-semibold flex items-center gap-1 hover:underline shrink-0"
        >
          View Main DCP Pillar <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Section 1: The December 31 Mandates */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. The Dual December 31 Statutory Obligations
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Regulation 5 establishes that while licences do not expire annually, continuous licensing is contingent upon fulfilling annual maintenance mandates:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                1. Annual Regulatory Fee (KES 20,000)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Mandated under <strong>Regulation 5(6)</strong> & Second Schedule</p>
              <p>• Statutory fee of KES 20,000 payable to CBK</p>
              <p>• Due on or before <strong>31 December</strong> every year</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                2. Return Certifying Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Mandated under <strong>Regulation 5(7)</strong></p>
              <p>• Formal corporate return certifying adherence to DCP Regs</p>
              <p>• Due on or before <strong>31 December</strong> every year</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Contents of the Annual Return */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Required Components of the Annual Return
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          The annual compliance return submitted under Regulation 5(7) requires licensees to certify compliance across key operational domains:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Pricing & Interest Disclosures:</strong> Certification that all interest rates, fees, and penalties comply with disclosed loan agreements and total cost of credit rules.</li>
          <li><strong>Consumer Protection & Debt Collection:</strong> Confirmation that debt collection policies strictly adhere to non-harassment rules under Regulation 23.</li>
          <li><strong>Data Privacy & Security:</strong> Proof of active ODPC registration and confirmation that borrower contact lists have not been unlawfully accessed.</li>
          <li><strong>Grievance Redressal:</strong> Summary report of customer complaints received, resolved, and pending during the reporting period.</li>
        </ul>
      </section>

      {/* Section 3: Recommended Preparation Timeline */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          3. Recommended Q4 Compliance Timeline
        </h2>
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>October (T-60 Days):</strong> Conduct internal audit of loan portfolio disclosures and customer complaint registers.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>November (T-30 Days):</strong> Draft the formal return certifying compliance and obtain Board / Managing Director sign-off.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>December (T-15 Days):</strong> Remit the KES 20,000 statutory fee and submit the certified return to the CBK Banking and Payment Services Department.</span>
          </div>
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
