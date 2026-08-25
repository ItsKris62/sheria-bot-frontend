/**
 * SheriaBot SEO
 * File ID: SEO-S04-KE-KB-ODPC-RENEWAL-012
 * Route: /knowledge-base/odpc-data-protection-registration-renewal-kenya
 * Purpose: Practical operational guide for ODPC registration renewal under Regulation 11
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
import { ArrowRight, CheckCircle2, Calendar, FileText, ShieldCheck, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ODPC Registration Renewal Guide Kenya | SheriaBot',
  description:
    'Complete operational manual for renewing your ODPC Data Controller and Data Processor registration certificate under Regulation 11 of the 2021 Regulations.',
  alternates: {
    canonical: absoluteUrl('/knowledge-base/odpc-data-protection-registration-renewal-kenya'),
  },
  openGraph: {
    title: 'ODPC Data Protection Certificate Renewal Guide Kenya | SheriaBot',
    description:
      'Step-by-step operational manual for renewing ODPC Data Controller and Processor certificates prior to 24-month expiration.',
    url: absoluteUrl('/knowledge-base/odpc-data-protection-registration-renewal-kenya'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ODPC Registration Renewal Guide Kenya | SheriaBot',
    description:
      'Step-by-step operational manual for renewing ODPC Data Controller and Processor certificates prior to 24-month expiration.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Knowledge Base', url: '/knowledge-base' },
  {
    name: 'ODPC Certificate Renewal Guide',
    url: '/knowledge-base/odpc-data-protection-registration-renewal-kenya',
  },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021 (Regulation 11 - Renewal)',
    instrument: 'Legal Notice No. 265 of 2021',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2021/LN265_2021.pdf',
  },
  {
    title: 'Data Protection Act, 2019 (Act No. 24 of 2019)',
    instrument: 'Principal Act',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/TheDataProtectionAct__No24of2019.pdf',
  },
]

export default function OdpcRegistrationRenewalGuidePage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="Knowledge Base Operational Guide"
      h1="ODPC Data Protection Certificate Renewal Guide for Kenyan FinTechs"
      subtitle="The operational manual for renewing your Data Controller and Data Processor Certificate of Registration under Regulation 11 of the Data Protection (Registration) Regulations, 2021."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Office of the Data Protection Commissioner (ODPC)"
      quickAnswer={
        <p>
          Under <strong>Regulation 9 of the Data Protection (Registration) Regulations, 2021</strong>, an ODPC Certificate of Registration is valid for <strong>24 months</strong> from issuance. Under <strong>Regulation 11</strong>, registered data controllers and data processors must apply for renewal prior to certificate expiration to avoid operating unlawfully. FinTechs providing financial services remain subject to mandatory registration regardless of annual revenue or staff size under the Third Schedule.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Registered Data Controllers:</strong> FinTechs holding an ODPC certificate approaching the 24-month validity threshold.</li>
          <li><strong>Registered Data Processors:</strong> Cloud and SaaS infrastructure vendors processing customer data on behalf of Kenyan financial institutions.</li>
          <li><strong>Data Protection Officers (DPOs):</strong> Compliance officers managing statutory renewal documentation and updated data flow registers.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Automate Your ODPC Renewal Documentation"
      ctaDescription="Audit data processing activities, update statutory registers, and prepare renewal filings with SheriaBot compliance intelligence."
      ctaButtonText="Explore Data Protection Tools"
      ctaHref="/solutions/startups"
    >
      {/* Upward Link to Pillar */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-foreground/80 flex items-center justify-between">
        <span>Part of the <strong>ODPC Data Protection Compliance Framework</strong>.</span>
        <Link
          href="/kenya/odpc-data-protection-compliance"
          className="text-primary font-semibold flex items-center gap-1 hover:underline shrink-0"
        >
          View Main ODPC Pillar <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Section 1: When to Renew */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Renewal Window & Validity Rules Under Regulation 11
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Unlike annual business licenses, ODPC certificates operate on a two-year lifecycle. Regulation 11 requires that renewal applications be submitted before the expiration of the active certificate to maintain unbroken legal authorization for data processing.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Recommended Timeline (T-60 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Begin internal data inventory review 60 days before the 24-month expiration date to document newly introduced data categories or third-party transfer corridors.
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Continuous Authorization
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Timely submission under Regulation 11 ensures continuous legal authorization while the ODPC processes verification and re-issues the certificate.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Step-by-Step Renewal Workflow */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. The Five-Stage ODPC Renewal Workflow
        </h2>
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Step 1: Data Inventory Audit:</strong> Review and update records of personal data processing activities, storage locations, and automated profiling tools.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Step 2: DPO & Corporate Verification:</strong> Confirm that designated Data Protection Officer contact details and physical address are accurate on Form DPR1.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Step 3: Portal Submission:</strong> Log in to the ODPC online registration portal and submit the renewal application with updated operational disclosures.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Step 4: Statutory Fee Remittance:</strong> Pay the renewal fee in accordance with the prescribed fee tiers in the Second Schedule.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Step 5: Certificate Re-Issuance:</strong> Download the renewed Certificate of Registration and update your internal compliance register.</span>
          </div>
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
