import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
} from "lucide-react"

const knowledgeBaseArticles: Record<string, {
  title: string
  category: string
  categoryId: string
  lastUpdated: string
  content: { type: "heading" | "paragraph" | "list"; text: string; items?: string[] }[]
  relatedArticles: { slug: string; title: string }[]
}> = {
  "getting-started-with-sheriabot": {
    title: "Getting Started with SheriaBot",
    category: "Getting Started",
    categoryId: "getting-started",
    lastUpdated: "2025-01-15",
    content: [
      { type: "paragraph", text: "Welcome to SheriaBot! This guide will help you set up your account and start using our AI-powered regulatory compliance platform." },
      { type: "heading", text: "Creating Your Account" },
      { type: "paragraph", text: "To create your SheriaBot account, visit our registration page and select your user type: Fintech Startup or Regulator. Each user type has access to different features tailored to their needs." },
      { type: "list", text: "Account setup steps:", items: [
        "Visit /register and click 'Get Started'",
        "Enter your email address and create a secure password",
        "Select your user type (Startup or Regulator)",
        "Complete your organization profile",
        "Verify your email address",
      ]},
      { type: "heading", text: "Running Your First Query" },
      { type: "paragraph", text: "Once your account is set up, navigate to the Compliance Query section. Here you can ask questions about Kenya's fintech regulations in natural language." },
      { type: "list", text: "Tips for effective queries:", items: [
        "Be specific about your business type (e.g., 'digital lender', 'payment service provider')",
        "Include the regulatory area you're asking about (e.g., 'KYC requirements', 'licensing')",
        "Ask follow-up questions to drill down into specific requirements",
      ]},
      { type: "heading", text: "Understanding Results" },
      { type: "paragraph", text: "SheriaBot provides answers with citations to specific laws and regulations. Each citation links to the relevant section of the legal document, allowing you to verify the information." },
    ],
    relatedArticles: [
      { slug: "understanding-compliance-queries", title: "Understanding Compliance Queries" },
      { slug: "cbk-licensing-framework-overview", title: "CBK Licensing Framework Overview" },
    ],
  },
  "cbk-licensing-framework-overview": {
    title: "CBK Licensing Framework Overview",
    category: "CBK Regulations",
    categoryId: "cbk-regulations",
    lastUpdated: "2025-01-10",
    content: [
      { type: "paragraph", text: "The Central Bank of Kenya (CBK) has established a comprehensive licensing framework for financial service providers. This guide provides an overview of the different license categories and their requirements." },
      { type: "heading", text: "License Categories" },
      { type: "paragraph", text: "CBK issues several types of licenses depending on the nature of financial services being offered:" },
      { type: "list", text: "Main license types:", items: [
        "Banking License - For commercial banks and microfinance banks",
        "Digital Credit Provider License - For digital lenders and credit apps",
        "Payment Service Provider License - For payment platforms and money transfer services",
        "Foreign Exchange Bureau License - For forex dealers",
      ]},
      { type: "heading", text: "Common Requirements" },
      { type: "paragraph", text: "While specific requirements vary by license type, all applicants must demonstrate:" },
      { type: "list", text: "Core requirements:", items: [
        "Adequate capital (minimum varies by license type)",
        "Fit and proper directors and key management",
        "Robust corporate governance structures",
        "Comprehensive risk management framework",
        "AML/CFT compliance program",
        "IT systems and cybersecurity measures",
      ]},
      { type: "heading", text: "Application Process" },
      { type: "paragraph", text: "The licensing process typically takes 3-6 months and involves document submission, due diligence by CBK, and in some cases, on-site inspections. SheriaBot can help you prepare your application by generating compliance checklists specific to your license type." },
    ],
    relatedArticles: [
      { slug: "digital-credit-provider-license", title: "Digital Credit Provider License Requirements" },
      { slug: "payment-service-provider-registration", title: "Payment Service Provider Registration" },
    ],
  },
  "digital-credit-provider-license": {
    title: "Digital Credit Provider License Requirements",
    category: "Licensing & Registration",
    categoryId: "licensing",
    lastUpdated: "2025-01-08",
    content: [
      { type: "paragraph", text: "The Digital Credit Providers Regulations 2024 require all digital lenders operating in Kenya to obtain a license from the Central Bank of Kenya. This guide outlines the key requirements." },
      { type: "heading", text: "Minimum Capital Requirements" },
      { type: "paragraph", text: "Digital credit providers must maintain minimum paid-up capital of KES 10 million. This capital must be fully paid and unencumbered. CBK may increase this requirement based on the scale of operations." },
      { type: "heading", text: "Governance Requirements" },
      { type: "list", text: "Board and management requirements:", items: [
        "Minimum of 5 directors, majority being non-executive",
        "At least one director with financial services experience",
        "CEO must have minimum 5 years of senior management experience",
        "Compliance officer must be appointed",
        "Board committees for Risk, Audit, and Credit must be established",
      ]},
      { type: "heading", text: "Operational Requirements" },
      { type: "list", text: "Key operational requirements:", items: [
        "Registered office in Kenya",
        "Adequate IT infrastructure with local data storage",
        "Clear loan pricing disclosure mechanisms",
        "Established customer complaint handling procedures",
        "Proper debt collection practices",
      ]},
      { type: "heading", text: "Application Documents" },
      { type: "paragraph", text: "Your license application must include audited financial statements, business plan, risk management framework, AML policy, data protection policy, and technology risk assessment. SheriaBot can help you generate many of these documents." },
    ],
    relatedArticles: [
      { slug: "cbk-licensing-framework-overview", title: "CBK Licensing Framework Overview" },
      { slug: "kyc-requirements-for-fintechs", title: "KYC Requirements for Fintechs" },
    ],
  },
  "kyc-requirements-for-fintechs": {
    title: "KYC Requirements for Fintechs",
    category: "AML/KYC Compliance",
    categoryId: "aml-kyc",
    lastUpdated: "2025-01-05",
    content: [
      { type: "paragraph", text: "Know Your Customer (KYC) requirements under the Proceeds of Crime and Anti-Money Laundering Act (POCAMLA) apply to all financial service providers in Kenya, including fintechs." },
      { type: "heading", text: "Customer Identification" },
      { type: "paragraph", text: "Before establishing a business relationship, you must verify your customer's identity using reliable, independent source documents." },
      { type: "list", text: "For individual customers, collect:", items: [
        "National ID card or passport",
        "Proof of address (utility bill, bank statement)",
        "Photograph (for in-person onboarding)",
        "KRA PIN (for certain transactions)",
      ]},
      { type: "list", text: "For business customers, collect:", items: [
        "Certificate of incorporation",
        "CR12 (company registration details)",
        "Board resolution authorizing the relationship",
        "IDs of directors and beneficial owners",
        "Business permits and licenses",
      ]},
      { type: "heading", text: "Ongoing Monitoring" },
      { type: "paragraph", text: "KYC is not a one-time exercise. You must continuously monitor customer relationships for changes in risk profile and update customer information periodically. High-risk customers require enhanced monitoring." },
      { type: "heading", text: "Record Keeping" },
      { type: "paragraph", text: "All KYC documentation must be retained for at least 7 years from the end of the business relationship. Records must be readily accessible for regulatory inspection." },
    ],
    relatedArticles: [
      { slug: "transaction-monitoring-guide", title: "Transaction Monitoring Guide" },
      { slug: "data-protection-act-overview", title: "Data Protection Act 2019 Overview" },
    ],
  },
  "data-protection-act-overview": {
    title: "Data Protection Act 2019 Overview",
    category: "Data Protection",
    categoryId: "data-protection",
    lastUpdated: "2025-01-03",
    content: [
      { type: "paragraph", text: "Kenya's Data Protection Act 2019 establishes a comprehensive framework for the protection of personal data. This overview covers key provisions relevant to fintech companies." },
      { type: "heading", text: "Key Principles" },
      { type: "list", text: "The Act establishes eight data protection principles:", items: [
        "Lawfulness, fairness, and transparency",
        "Purpose limitation",
        "Data minimization",
        "Accuracy",
        "Storage limitation",
        "Integrity and confidentiality",
        "Accountability",
      ]},
      { type: "heading", text: "Consent Requirements" },
      { type: "paragraph", text: "Processing of personal data requires valid consent, which must be freely given, specific, informed, and unambiguous. Consent for sensitive data (health, biometric, financial) requires explicit consent." },
      { type: "heading", text: "Data Subject Rights" },
      { type: "list", text: "Individuals have the right to:", items: [
        "Be informed about data collection",
        "Access their personal data",
        "Rectify inaccurate data",
        "Erasure (right to be forgotten)",
        "Restrict processing",
        "Data portability",
        "Object to processing",
      ]},
      { type: "heading", text: "Registration Requirements" },
      { type: "paragraph", text: "Data controllers and processors must register with the Office of the Data Protection Commissioner (ODPC). Fintechs handling personal data must complete this registration and maintain it current." },
    ],
    relatedArticles: [
      { slug: "consent-management-best-practices", title: "Consent Management Best Practices" },
      { slug: "kyc-requirements-for-fintechs", title: "KYC Requirements for Fintechs" },
    ],
  },
  "mpesa-integration-compliance": {
    title: "M-Pesa Integration Compliance",
    category: "Payments & Mobile Money",
    categoryId: "payments",
    lastUpdated: "2024-12-28",
    content: [
      { type: "paragraph", text: "Integrating with Safaricom's M-Pesa platform requires compliance with both Safaricom's partnership requirements and regulatory obligations under the National Payment System Act." },
      { type: "heading", text: "Safaricom Requirements" },
      { type: "list", text: "To become an M-Pesa partner:", items: [
        "Registered Kenyan business entity",
        "Valid business permits and licenses",
        "Compliance with CBK regulations (if applicable)",
        "Technical infrastructure meeting Safaricom standards",
        "Data security and privacy measures",
      ]},
      { type: "heading", text: "Regulatory Considerations" },
      { type: "paragraph", text: "If your M-Pesa integration involves payment services beyond simple collections, you may need to register as a Payment Service Provider with CBK. SheriaBot can help you determine your regulatory obligations." },
      { type: "heading", text: "Consumer Protection" },
      { type: "paragraph", text: "All M-Pesa integrations must comply with CBK consumer protection guidelines, including clear fee disclosure, dispute resolution mechanisms, and protection of customer funds." },
      { type: "heading", text: "API Best Practices" },
      { type: "list", text: "Technical compliance considerations:", items: [
        "Secure storage of API credentials",
        "Transaction logging and reconciliation",
        "Error handling and customer communication",
        "Compliance with M-Pesa sandbox testing requirements",
      ]},
    ],
    relatedArticles: [
      { slug: "national-payment-system-act", title: "National Payment System Act Guide" },
      { slug: "payment-service-provider-registration", title: "Payment Service Provider Registration" },
    ],
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function KnowledgeBaseArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = knowledgeBaseArticles[slug]

  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Article Not Found</h1>
        <p className="mt-2 text-muted-foreground">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild className="mt-6 bg-primary text-primary-foreground">
          <Link href="/knowledge-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link 
            href="/knowledge-base" 
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Link>

          <Badge variant="outline" className="mt-6 block w-fit">
            {article.category}
          </Badge>

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: {new Date(article.lastUpdated).toLocaleDateString("en-KE", { 
              month: "long", 
              day: "numeric", 
              year: "numeric" 
            })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            {article.content.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2 key={index} className="mb-4 mt-8 text-xl font-semibold text-foreground">
                    {block.text}
                  </h2>
                )
              }
              if (block.type === "paragraph") {
                return (
                  <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                    {block.text}
                  </p>
                )
              }
              if (block.type === "list") {
                return (
                  <div key={index} className="mb-4">
                    <p className="mb-2 text-muted-foreground">{block.text}</p>
                    <ul className="space-y-2 pl-6">
                      {block.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              }
              return null
            })}
          </div>

          {/* Feedback */}
          <Card className="mt-12 border-border/50 bg-card/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Was this article helpful?</p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Yes
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Articles */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Related Articles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {article.relatedArticles.map((related) => (
              <Link key={related.slug} href={`/knowledge-base/${related.slug}`}>
                <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                      {related.title}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Need More Specific Guidance?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                SheriaBot can answer your specific compliance questions with AI-powered analysis.
              </p>
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/register">
                  Try SheriaBot Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
