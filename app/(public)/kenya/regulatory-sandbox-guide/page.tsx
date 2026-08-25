/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-CMA-SANDBOX-007
 * Route: /kenya/regulatory-sandbox-guide
 * Purpose: Kenya CMA Regulatory Sandbox authority guide
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
import { ArrowRight, CheckCircle2, Lightbulb, Clock, ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kenya CMA Regulatory Sandbox: FinTech Application Guide | SheriaBot',
  description:
    'Complete operational guide to the Capital Markets Authority (CMA) Regulatory Sandbox in Kenya. Learn eligibility criteria, 12-month testing parameters, and exit strategies.',
  alternates: {
    canonical: absoluteUrl('/kenya/regulatory-sandbox-guide'),
  },
  openGraph: {
    title: 'Kenya CMA Regulatory Sandbox Guide | SheriaBot',
    description:
      'Authoritative guide to entering and navigating the Capital Markets Authority Regulatory Sandbox in Kenya for fintech innovators.',
    url: absoluteUrl('/kenya/regulatory-sandbox-guide'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya CMA Regulatory Sandbox: FinTech Application Guide | SheriaBot',
    description:
      'Authoritative guide to entering and navigating the Capital Markets Authority Regulatory Sandbox in Kenya for fintech innovators.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Kenya FinTech Compliance', url: '/kenya/fintech-compliance-requirements' },
  { name: 'CMA Regulatory Sandbox Guide', url: '/kenya/regulatory-sandbox-guide' },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Capital Markets (Regulatory Sandbox) Policy Guidance Notes, 2019',
    instrument: 'Policy Guidance Note',
    authority: 'Capital Markets Authority (CMA)',
    url: 'https://www.cma.or.ke/regulatory-sandbox-policy-guidance-notes/',
  },
  {
    title: 'Capital Markets Act (Cap. 485A)',
    instrument: 'Principal Act',
    authority: 'Capital Markets Authority (CMA)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/CapitalMarketsActCap485A.pdf',
  },
  {
    title: 'Capital Markets (Investment-Based Crowdfunding) Regulations, 2022',
    instrument: 'Legal Notice No. 250 of 2022',
    authority: 'Capital Markets Authority (CMA)',
    url: 'https://www.cma.or.ke/',
  },
]

export default function CmaRegulatorySandboxPage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="CMA Regulatory Authority Guide"
      h1="Kenya CMA Regulatory Sandbox: FinTech Application & Compliance Guide"
      subtitle="The official framework for testing innovative capital markets products, automated advisory algorithms, and blockchain solutions under Capital Markets Authority supervision."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Capital Markets Authority (CMA)"
      quickAnswer={
        <p>
          The <strong>Capital Markets Authority (CMA) Regulatory Sandbox</strong>, established under the <strong>Regulatory Sandbox Policy Guidance Note, 2019</strong>, provides a live testing environment for innovative capital markets products and business models. The initial testing period is agreed with the CMA and <strong>may not exceed 12 months</strong>; an extension of <strong>up to a further 12 months</strong> may be approved upon formal application where justified. Applicants must demonstrate genuine innovation, direct consumer benefit, testing readiness, and robust risk safeguards.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>WealthTech & Robo-Advisory Platforms:</strong> Automated investment algorithms and digital portfolio managers.</li>
          <li><strong>Crowdfunding & Capital Formation Innovators:</strong> Equity and debt-based crowdfunding intermediaries seeking regulatory live-testing.</li>
          <li><strong>Blockchain & Tokenization Projects:</strong> Distributed ledger solutions facilitating asset fractionalization or digital security settlement.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Assess Sandbox Readiness with SheriaBot"
      ctaDescription="Review sandbox eligibility, structure test boundary metrics, and draft consumer safeguard policies with SheriaBot."
      ctaButtonText="Explore Startup Sandbox Tools"
      ctaHref="/solutions/startups"
    >
      {/* Section 1: Objectives & Innovation Scope */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Objectives of the CMA Regulatory Sandbox
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          The CMA Regulatory Sandbox is designed to encourage financial innovation in capital markets while safeguarding investor interests. It allows innovators to deploy live solutions with real retail or institutional customers under prescribed boundary conditions (e.g. capped transaction volumes and customer cohorts).
        </p>
      </section>

      {/* Section 2: Testing Period & Extension Terms */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Testing Parameters & Timeline Rules
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Under Clause 6 of the 2019 Policy Guidance Note, the sandbox establishes clear operational limits:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Initial Period (Up to 12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>The initial testing duration is agreed individually with the CMA based on product complexity and cannot exceed 12 months.</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Extension Option (Up to 12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>Where additional testing data is necessary, an extension of up to a further 12 months may be granted upon approved formal request.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: Eligibility & Admission Criteria */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          3. Core Eligibility Criteria
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          To qualify for admission into the CMA Sandbox, applicants must satisfy five foundational statutory tests:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Genuine Innovation:</strong> The solution must offer a genuinely new proposition or improve existing financial services significantly.</li>
          <li><strong>Identified Regulatory Barrier:</strong> The applicant operates in a space without clear regulatory coverage or requires temporary regulatory waivers.</li>
          <li><strong>Consumer Benefit:</strong> Clear evidence demonstrating lower costs, improved access, or enhanced security for Kenyan investors.</li>
          <li><strong>Testing Readiness:</strong> A fully developed technical product with functional prototype and testing plan.</li>
          <li><strong>Risk & Exit Plan:</strong> Defined protocols for customer data protection, compensation in case of loss, and orderly shutdown if testing concludes.</li>
        </ul>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
