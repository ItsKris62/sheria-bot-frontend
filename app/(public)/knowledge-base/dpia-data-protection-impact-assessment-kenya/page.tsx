/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-KB-DPIA-008
 * Route: /knowledge-base/dpia-data-protection-impact-assessment-kenya
 * Purpose: Practical Kenya DPIA guidance supporting the ODPC pillar
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
import { ArrowRight, CheckCircle2, FileCode, AlertCircle, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Data Protection Impact Assessment (DPIA) Guide Kenya | SheriaBot',
  description:
    'Step-by-step practical guide to conducting a Data Protection Impact Assessment (DPIA) in Kenya under Section 31 DPA 2019 and Regulation 49 General Regulations 2021.',
  alternates: {
    canonical: absoluteUrl('/knowledge-base/dpia-data-protection-impact-assessment-kenya'),
  },
  openGraph: {
    title: 'Data Protection Impact Assessment (DPIA) Guide Kenya | SheriaBot',
    description:
      'Operational methodology for conducting DPIAs under Section 31 Data Protection Act 2019 for Kenyan fintechs.',
    url: absoluteUrl('/knowledge-base/dpia-data-protection-impact-assessment-kenya'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Protection Impact Assessment (DPIA) Guide Kenya | SheriaBot',
    description:
      'Operational methodology for conducting DPIAs under Section 31 Data Protection Act 2019 for Kenyan fintechs.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Knowledge Base', url: '/knowledge-base' },
  { name: 'DPIA FinTech Guide', url: '/knowledge-base/dpia-data-protection-impact-assessment-kenya' },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Data Protection Act, 2019 (Section 31 - Impact Assessment)',
    instrument: 'Principal Act',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/TheDataProtectionAct__No24of2019.pdf',
  },
  {
    title: 'Data Protection (General) Regulations, 2021 (Regulation 49 - Data Protection Impact Assessment)',
    instrument: 'Legal Notice No. 262 of 2021',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'https://www.odpc.go.ke/wp-content/uploads/2022/01/Data-Protection-General-Regulations-2021.pdf',
  },
]

export default function DpiaGuidePage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="Knowledge Base Operational Guide"
      h1="Data Protection Impact Assessment (DPIA) Guide for Kenyan FinTechs"
      subtitle="The operational methodology for conducting statutory impact assessments under Section 31 of the Data Protection Act 2019 and Regulation 49 of the General Regulations 2021."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Office of the Data Protection Commissioner (ODPC)"
      quickAnswer={
        <p>
          Under <strong>Section 31 of the Data Protection Act, 2019</strong> and <strong>Regulation 49 of the Data Protection (General) Regulations, 2021</strong>, a Data Protection Impact Assessment (DPIA) is mandatory prior to deploying processing operations likely to result in a <strong>high risk to the rights and freedoms of data subjects</strong>. In financial technology, high-risk triggers include automated credit scoring algorithms, biometric verification for customer onboarding, and systematic financial profiling.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Digital Lenders & Credit Scorers:</strong> Using algorithmic profiling to determine loan eligibility and credit limits.</li>
          <li><strong>FinTech Product & Engineering Teams:</strong> Deploying biometric identity verification or machine-learning transaction risk engines.</li>
          <li><strong>Data Protection Officers (DPOs):</strong> Documenting privacy risk evaluations prior to product launch or ODPC consultation.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Generate Statutory DPIA Reports Automatically"
      ctaDescription="Document data flows, identify processing risks, and generate audit-ready DPIA reports with SheriaBot."
      ctaButtonText="Explore DPIA Tools"
      ctaHref="/solutions/startups"
    >
      {/* Upward Link to Pillar */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-foreground/80 flex items-center justify-between">
        <span>Part of the <strong>ODPC Data Protection Compliance Framework</strong>.</span>
        <Link
          href="/kenya/odpc-data-protection-compliance"
          className="text-primary font-semibold flex items-center gap-1 hover:underline shrink-0"
        >
          View Main ODPC Guide <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Section 1: When a DPIA is Mandatory */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Statutory High-Risk Triggers Under Regulation 49
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Regulation 49 of the General Regulations 2021 specifies circumstances where a DPIA is legally mandatory:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Automated Decision-Making:</strong> Systematic profiling with significant financial or legal effects (e.g. instant automated credit approvals or denials).</li>
          <li><strong>Biometric Data Processing:</strong> Using facial recognition, fingerprints, or voiceprints for identity verification.</li>
          <li><strong>Large-Scale Data Processing:</strong> Processing substantial volumes of customer location, contact, or financial transaction logs.</li>
        </ul>
      </section>

      {/* Section 2: Step-by-Step Methodology */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. The Four-Stage DPIA Execution Methodology
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Stage 1: Processing Description</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Document data categories, storage infrastructure, retention periods, and third-party data flows.
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Stage 2: Necessity & Proportionality</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Evaluate whether data minimization principles are respected and lawful processing grounds are valid.
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Stage 3: Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Identify potential privacy harms, data leak vulnerabilities, and unauthorized access risks to data subjects.
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Stage 4: Mitigation Measures</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Deploy encryption, role-based access control, automated pseudonymization, and audit logs to mitigate identified risks.
            </CardContent>
          </Card>
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
