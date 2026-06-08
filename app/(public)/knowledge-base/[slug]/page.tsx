import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 font-sans text-zinc-400 selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
          <BookOpen strokeWidth={1.5} className="h-8 w-8 text-zinc-500" />
        </div>
        <h1 className="mt-4 text-3xl font-medium text-white tracking-tight">Article Not Found</h1>
        <p className="mt-3 text-zinc-500">The framework or document you&apos;re looking for doesn&apos;t exist.</p>
        <Link 
          href="/knowledge-base"
          className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <ArrowLeft strokeWidth={1.5} className="w-4 h-4" />
          Back to Knowledge Base
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* --- HEADER SECTION --- */}
      <div className="max-w-3xl mx-auto px-6 pt-20 md:pt-28 pb-12">
        <header>
          <Link 
            href="/knowledge-base" 
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-emerald-400 transition-colors mb-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-md"
          >
            <ArrowLeft strokeWidth={1.5} className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Knowledge Base
          </Link>

          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium uppercase tracking-widest text-zinc-400 mb-6">
            {article.category}
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight mb-8">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 pb-12 border-b border-zinc-900/80">
            <div className="flex items-center gap-2">
              <Calendar strokeWidth={1.5} className="w-4 h-4 text-zinc-600" />
              <span>
                Last updated: {new Date(article.lastUpdated).toLocaleDateString("en-KE", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric" 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock strokeWidth={1.5} className="w-4 h-4 text-zinc-600" />
              <span>5 min read</span>
            </div>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="py-12">
          {article.content.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2 key={index} className="text-2xl md:text-3xl font-medium text-white mb-6 mt-12 tracking-tight leading-snug">
                  {block.text}
                </h2>
              )
            }
            if (block.type === "paragraph") {
              return (
                <p key={index} className="text-lg text-zinc-400 leading-relaxed mb-6">
                  {block.text}
                </p>
              )
            }
            if (block.type === "list") {
              return (
                <div key={index} className="mb-10 mt-6 bg-zinc-950/30 p-6 md:p-8 rounded-3xl border border-zinc-800/50">
                  <p className="text-lg font-medium text-zinc-200 mb-6">{block.text}</p>
                  <ul className="space-y-4">
                    {block.items?.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-4">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 strokeWidth={1.5} className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-zinc-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            return null
          })}

          {/* --- FEEDBACK MODULE --- */}
          <div className="mt-20 bg-zinc-950 border border-zinc-800/80 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-white font-medium mb-1">Was this article helpful?</h3>
              <p className="text-sm text-zinc-500">Your feedback helps us improve our compliance corpus.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                <ThumbsUp strokeWidth={1.5} className="w-4 h-4" />
                <span className="text-sm font-medium">Yes</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50">
                <ThumbsDown strokeWidth={1.5} className="w-4 h-4" />
                <span className="text-sm font-medium">No</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- RELATED ARTICLES --- */}
      <div className="py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="mb-10 text-2xl font-medium text-white tracking-tight">Related Frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {article.relatedArticles.map((related) => (
              <Link key={related.slug} href={`/knowledge-base/${related.slug}`} className="group outline-none">
                <article className="relative bg-zinc-950/40 border border-zinc-800/60 rounded-3xl p-7 flex flex-col h-full hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,135,90,0.08)] hover:border-emerald-500/30 transition-all duration-500 focus-within:ring-2 focus-within:ring-emerald-500/50">
                  <div className="mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800/80 group-hover:border-emerald-500/30 transition-colors duration-500 shadow-inner">
                      <FileText strokeWidth={1.5} className="w-5 h-5 text-zinc-300 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3 tracking-tight leading-snug group-hover:text-emerald-50 transition-colors duration-300">
                    {related.title}
                  </h3>
                  <div className="mt-auto pt-6 flex items-center text-emerald-400 text-sm font-medium">
                    Read article <ArrowRight strokeWidth={1.5} className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-zinc-950 border border-zinc-800/60 rounded-3xl p-10 md:p-16 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.1)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
              Need More Specific Guidance?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              SheriaBot can answer your specific compliance questions with AI-powered analysis tailored to your fintech model.
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 shadow-[0_0_20px_rgba(0,135,90,0.3)] hover:shadow-[0_0_30px_rgba(0,135,90,0.5)] hover:-translate-y-0.5"
            >
              Try SheriaBot Free
              <ArrowRight strokeWidth={1.5} className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
