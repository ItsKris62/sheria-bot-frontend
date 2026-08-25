/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-HUB-001
 * Route: /kenya/fintech-compliance-requirements
 * Purpose: Master Kenya fintech regulatory authority pillar
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
import { ArrowRight, CheckCircle2, Shield, Landmark, Lock, FileCheck2, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kenya FinTech Compliance & Regulations: Master Guide | SheriaBot',
  description:
    'Comprehensive regulatory compliance roadmap for fintechs in Kenya. Understand CBK digital lending rules, ODPC data protection obligations, FRC AML/CFT requirements, and CMA sandbox participation.',
  alternates: {
    canonical: absoluteUrl('/kenya/fintech-compliance-requirements'),
  },
  openGraph: {
    title: 'Kenya FinTech Compliance & Regulatory Guide | SheriaBot',
    description:
      'Authoritative master guide on Kenyan fintech regulations across CBK, ODPC, FRC, and CMA.',
    url: absoluteUrl('/kenya/fintech-compliance-requirements'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya FinTech Compliance & Regulations: Master Guide | SheriaBot',
    description:
      'Authoritative master guide on Kenyan fintech regulations across CBK, ODPC, FRC, and CMA.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Kenya FinTech Compliance', url: '/kenya/fintech-compliance-requirements' },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Central Bank of Kenya Act (Cap. 491)',
    instrument: 'Principal Act',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/CentralBankofKenyaActCap491.pdf',
  },
  {
    title: 'Central Bank of Kenya (Digital Credit Providers) Regulations, 2022',
    instrument: 'Legal Notice No. 46 of 2022',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'https://www.centralbank.go.ke/wp-content/uploads/2022/03/Central-Bank-of-Kenya-Digital-Credit-Providers-Regulations-2022.pdf',
  },
  {
    title: 'Data Protection Act, 2019 (Act No. 24 of 2019)',
    instrument: 'Principal Act',
    authority: 'Office of the Data Protection Commissioner (ODPC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/TheDataProtectionAct__No24of2019.pdf',
  },
  {
    title: 'Proceeds of Crime and Anti-Money Laundering Act (POCAMLA Cap. 59A)',
    instrument: 'Principal Act',
    authority: 'Financial Reporting Centre (FRC)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/ProceedsofCrimeandAnti-MoneyLaunderingAct_No9of2009.pdf',
  },
  {
    title: 'Capital Markets (Regulatory Sandbox) Policy Guidance Notes, 2019',
    instrument: 'Policy Guidance Note',
    authority: 'Capital Markets Authority (CMA)',
    url: 'https://www.cma.or.ke/regulatory-sandbox-policy-guidance-notes/',
  },
]

export default function KenyaFintechCompliancePage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="Kenya FinTech Regulatory Hub"
      h1="Kenya FinTech Compliance & Regulatory Requirements: Complete Master Guide"
      subtitle="The authoritative overview of legal frameworks, licensing obligations, and statutory requirements governing financial technology enterprises operating in Kenya."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Multi-Regulator (CBK, ODPC, FRC, CMA)"
      quickAnswer={
        <p>
          FinTech compliance in Kenya is governed by a <strong>multi-regulator framework</strong> where obligations are determined by corporate activity rather than business model names. Key regulators include the <strong>Central Bank of Kenya (CBK)</strong> for digital lending and payment systems; the <strong>Office of the Data Protection Commissioner (ODPC)</strong> for consumer data processing and mandatory registration; the <strong>Financial Reporting Centre (FRC)</strong> for AML/CFT registration and reporting; and the <strong>Capital Markets Authority (CMA)</strong> for capital markets innovation and sandboxes.
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Digital Credit Providers (DCPs):</strong> Non-deposit-taking lending platforms and mobile credit apps.</li>
          <li><strong>Payment Service Innovators:</strong> Payment gateways, aggregators, electronic money operators, and merchant solutions.</li>
          <li><strong>Financial Data Processors:</strong> Any fintech collecting, profiling, or processing personal and transactional data of Kenyan data subjects.</li>
          <li><strong>AML Reporting Institutions:</strong> Entities handling customer funds, digital lending, or foreign exchange transfers.</li>
          <li><strong>Capital Markets Innovators:</strong> WealthTech platforms, robo-advisors, and crowdfunding intermediaries.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Accelerate Your Kenya Compliance Readiness"
      ctaDescription="Run interactive statutory gap analyses and generate compliance policies tailored to Kenyan financial regulations with SheriaBot."
      ctaButtonText="Explore FinTech Solutions"
      ctaHref="/solutions/startups"
    >
      {/* Section 1: The Multi-Regulator Framework */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Understanding Kenya&apos;s Multi-Regulator FinTech Architecture
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Unlike jurisdictions with a single unified financial authority, Kenya regulates financial technology through a functional model. Oversight is distributed across sector-specific statutory bodies established by Acts of Parliament. Compliance is determined by your platform&apos;s specific activities, custody of funds, and customer interactions:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Landmark className="h-4 w-4 text-primary" />
                Central Bank of Kenya (CBK)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>• Digital Credit Providers Regulations, 2022</p>
              <p>• National Payment System Act & Prudential Guidelines</p>
              <p>• Oversight of lending, float custody, and retail payments</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Data Protection Commissioner (ODPC)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>• Data Protection Act, 2019</p>
              <p>• Mandatory registration for financial services (Third Schedule)</p>
              <p>• Section 43 notifiable breach reporting & DPIA rules</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Financial Reporting Centre (FRC)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>• POCAMLA Cap. 59A & 2023 Regulations</p>
              <p>• Section 47A Reporting Institution registration</p>
              <p>• Suspicious Transaction Reporting (within 2 days) & CTRs</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Capital Markets Authority (CMA)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>• Capital Markets Act Cap. 485A</p>
              <p>• CMA Regulatory Sandbox Policy Guidance Note 2019</p>
              <p>• Investment-Based Crowdfunding Regulations 2022</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Core Regulatory Pillars & Authority Guides */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Core Kenya Regulatory Pillars
        </h2>

        {/* Pillar A: CBK Digital Lending */}
        <div className="rounded-lg border border-border p-5 bg-card/50 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Lending & Credit
            </Badge>
            <Link
              href="/kenya/cbk-digital-credit-provider-compliance"
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              Read Full DCP Guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Central Bank of Kenya (DCP Regulations, 2022)
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Entities offering digital credit must be licensed under Regulation 4. Licences enjoy perpetual validity under Regulation 5(5) unless suspended or revoked. Licensees must pay an annual fee of KES 20,000 under Regulation 5(6) and submit an annual compliance return under Regulation 5(7) on or before 31 December every year.
          </p>
        </div>

        {/* Pillar B: ODPC Data Protection */}
        <div className="rounded-lg border border-border p-5 bg-card/50 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Data Privacy & Governance
            </Badge>
            <Link
              href="/kenya/odpc-data-protection-compliance"
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              Read Full ODPC Guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Data Protection Act 2019 & ODPC Registration
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The small-entity exemption does not apply to entities providing financial services (Third Schedule). Financial data controllers and processors must register under Regulation 4, receive certificates valid for 24 months under Regulation 9, and comply with Section 43 notifiable breach rules (72-hour notification for real risk of harm).
          </p>
        </div>

        {/* Pillar C: AML / POCAMLA */}
        <div className="rounded-lg border border-border p-5 bg-card/50 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Anti-Money Laundering
            </Badge>
            <Link
              href="/kenya/aml-cft-fintech-compliance"
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              Read Full AML/CFT Guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            POCAMLA Cap. 59A & FRC Compliance
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reporting institutions must register with the FRC under Section 47A, appoint an MLRO, enforce CDD/EDD, report suspicious transactions within two days under Section 44(2), and report cash transactions equivalent to US$15,000 or above under Section 44(6) and POCAMLA Regulations 2023.
          </p>
        </div>

        {/* Pillar D: CMA Sandbox */}
        <div className="rounded-lg border border-border p-5 bg-card/50 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-primary/40 text-primary">
              Capital Markets Innovation
            </Badge>
            <Link
              href="/kenya/regulatory-sandbox-guide"
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              Read Full Sandbox Guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            CMA Regulatory Sandbox (Policy Guidance Note 2019)
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Innovators testing novel capital markets products, automated advisory algorithms, or crowdfunding solutions can apply for live testing under CMA supervision. Testing periods may extend up to 12 months with possible 12-month extensions.
          </p>
        </div>
      </section>

      {/* Section 3: Statutory Readiness Checklist */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          3. Baseline FinTech Compliance Checklist for Kenya
        </h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Corporate Structuring:</strong> Incorporate locally under the Companies Act 2015 and establish verified physical and registered offices.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Licensing Evaluation:</strong> Determine statutory licensing requirements under CBK (DCP Regulations 2022) or CMA depending on product scope.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>ODPC Data Registration:</strong> Register as Data Controller and/or Data Processor under Regulation 4 (24-month validity).</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>AML/CFT Framework:</strong> Register with FRC under Section 47A, implement goAML reporting workflows, and draft statutory AML policies.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong>Consumer Protection & Debt Recovery:</strong> Establish transparent disclosure policies, grievance redressal, and non-harassment rules.</span>
          </div>
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
