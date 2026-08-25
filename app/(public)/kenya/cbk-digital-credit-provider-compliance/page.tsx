/**
 * SheriaBot SEO
 * File ID: SEO-S03-KE-CBK-DCP-002
 * Route: /kenya/cbk-digital-credit-provider-compliance
 * Purpose: CBK Digital Credit Provider compliance and licensing authority guide
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
import { ArrowRight, CheckCircle2, AlertCircle, ShieldAlert, FileText, CalendarCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CBK Digital Credit Provider Licence Kenya: Compliance Guide | SheriaBot',
  description:
    'Authoritative guide to CBK Digital Credit Provider (DCP) licensing in Kenya. Understand Regulation 5 perpetual validity, mandatory annual returns, consumer protection, and governance.',
  alternates: {
    canonical: absoluteUrl('/kenya/cbk-digital-credit-provider-compliance'),
  },
  openGraph: {
    title: 'CBK Digital Credit Provider Compliance & Licensing Guide | SheriaBot',
    description:
      'Complete operational guide on CBK DCP licensing, Regulation 5 perpetual validity, annual compliance returns, and debt collection restrictions.',
    url: absoluteUrl('/kenya/cbk-digital-credit-provider-compliance'),
    type: 'article',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CBK Digital Credit Provider Licence Kenya: Compliance Guide | SheriaBot',
    description:
      'Complete operational guide on CBK DCP licensing, Regulation 5 perpetual validity, annual compliance returns, and debt collection restrictions.',
  },
}

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Kenya FinTech Compliance', url: '/kenya/fintech-compliance-requirements' },
  { name: 'Digital Credit Provider Compliance', url: '/kenya/cbk-digital-credit-provider-compliance' },
]

const primarySources: PrimarySource[] = [
  {
    title: 'Central Bank of Kenya (Digital Credit Providers) Regulations, 2022',
    instrument: 'Legal Notice No. 46 of 2022',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'https://www.centralbank.go.ke/wp-content/uploads/2022/03/Central-Bank-of-Kenya-Digital-Credit-Providers-Regulations-2022.pdf',
  },
  {
    title: 'Central Bank of Kenya Act (Cap. 491)',
    instrument: 'Section 59A (Digital Credit Business)',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/CentralBankofKenyaActCap491.pdf',
  },
  {
    title: 'CBK Prudential Guidelines on Fit and Proper Criteria (CBK/PG/02)',
    instrument: 'Prudential Guideline',
    authority: 'Central Bank of Kenya (CBK)',
    url: 'https://www.centralbank.go.ke/wp-content/uploads/2016/08/Prudential-Guideline-on-Fit-and-Proper-Criteria.pdf',
  },
]

export default function CbkDigitalCreditProviderPage() {
  return (
    <SeoAuthorityArticleLayout
      breadcrumbs={breadcrumbs}
      badgeText="CBK Regulatory Authority Guide"
      h1="CBK Digital Credit Provider (DCP) Compliance & Licensing Guide"
      subtitle="The operational framework for establishing, licensing, and maintaining a compliant digital lending enterprise under the Central Bank of Kenya (Digital Credit Providers) Regulations, 2022."
      jurisdiction="Kenya"
      lastReviewed="August 2026"
      governingAuthority="Central Bank of Kenya (CBK)"
      quickAnswer={
        <p>
          Under the <strong>Central Bank of Kenya (Digital Credit Providers) Regulations, 2022</strong>, all non-deposit-taking digital lending entities must hold a valid CBK licence. Under <strong>Regulation 5(5)</strong>, a DCP licence remains valid perpetually unless suspended or revoked. Licensees must fulfill two statutory annual obligations on or before <strong>31 December</strong> each year: pay the annual regulatory fee of <strong>KES 20,000</strong> (Regulation 5(6) + Second Schedule) and submit an <strong>annual return certifying compliance</strong> with the Act and Regulations (Regulation 5(7)).
        </p>
      }
      appliesTo={
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Digital Credit Providers:</strong> Entities carrying on digital credit business through an electronic or digital channel.</li>
          <li><strong>Lending FinTech Founders & CEOs:</strong> Executives establishing credit scoring or digital loan disbursement platforms in Kenya.</li>
          <li><strong>Compliance Officers & Legal Teams:</strong> Professionals managing statutory filings, consumer protection policies, and CBK supervisory returns.</li>
        </ul>
      }
      primarySources={primarySources}
      ctaTitle="Automate Your DCP Compliance Workflows"
      ctaDescription="Track CBK statutory deadlines, generate consumer protection policies, and evaluate lending readiness with SheriaBot."
      ctaButtonText="Explore DCP Solutions"
      ctaHref="/solutions/startups"
    >
      {/* Section 1: Scope of Licensing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          1. Scope of Mandatory CBK DCP Licensing
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Under Section 59A of the Central Bank of Kenya Act (Cap. 491) and Regulation 4 of the 2022 Regulations, no person shall carry on digital credit business in Kenya unless licensed by the Central Bank. Digital credit business encompasses the provision of credit facilities through a digital channel where credit evaluation, loan disbursement, or recovery operations are electronically automated.
        </p>

        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            Statutory Exemptions from DCP Regulations
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            The DCP Regulations do not apply to institutions licensed under the Banking Act (Cap. 488), Microfinance Act, 2006, SACCO Societies Act, 2008, or entities recognized under any other statutory framework specifically exempting them from CBK DCP licensing.
          </p>
        </div>
      </section>

      {/* Section 2: Licence Terms & Perpetual Validity */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          2. Licence Terms & Perpetual Validity Under Regulation 5(5)
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          A critical distinction in Kenyan digital credit regulation is that DCP licences <strong>do not expire annually</strong>. Under Regulation 5(5), a licence issued by the CBK remains valid unless it is suspended or revoked under Regulation 8 or surrendered by the provider.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-500" />
                Annual Fee (Regulation 5(6))
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• KES 20,000 annual regulatory fee</p>
              <p>• Due on or before <strong>31 December</strong> every year</p>
              <p>• Payable directly to the Central Bank of Kenya</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-500" />
                Annual Return (Regulation 5(7))
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>• Return certifying statutory compliance</p>
              <p>• Due on or before <strong>31 December</strong> every year</p>
              <p>
                • Read the{' '}
                <Link
                  href="/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide"
                  className="font-medium text-primary hover:underline"
                >
                  Annual Return Operational Guide
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: Fit and Proper Standards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          3. Governance & Fit and Proper Standards
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Under Regulation 7 and CBK Prudential Guidelines (CBK/PG/02), significant shareholders (holding 10% or more of voting power) and proposed directors must satisfy fit and proper criteria. This vetting assesses:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Probity, Competence, and Soundness of Judgement:</strong> Relevant professional experience in financial services, banking, or technology.</li>
          <li><strong>Financial Integrity:</strong> Clean credit history (CRB clearance), statutory tax compliance (KRA clearance), and absence of bankruptcy proceedings.</li>
          <li><strong>Source of Capital:</strong> Verifiable documentation establishing the legitimate source of shareholding funds.</li>
        </ul>
      </section>

      {/* Section 4: Consumer Protection & Debt Collection */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          4. Consumer Protection & Prohibited Debt Collection Practices
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Regulation 23 and Regulation 24 establish stringent consumer protection measures designed to protect borrowers from predatory lending and abusive recovery practices:
        </p>

        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-5 space-y-2.5">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Strictly Prohibited Collection Behaviors
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
            <li>Harassing, threatening, or intimidating a borrower or contacts.</li>
            <li>Contacting family members, referees, or contacts without explicit statutory authorization.</li>
            <li>Debt shaming or disclosing debt status to unauthorized third parties.</li>
            <li>Charging hidden or unapproved administrative fees not disclosed in loan agreements.</li>
          </ul>
        </div>
      </section>
    </SeoAuthorityArticleLayout>
  )
}
