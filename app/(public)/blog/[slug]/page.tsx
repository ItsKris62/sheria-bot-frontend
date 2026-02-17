import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  Linkedin,
  Twitter,
} from "lucide-react"

const blogPosts: Record<string, {
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string
  date: string
  readTime: string
  content: string[]
  relatedPosts: string[]
}> = {
  "cbk-digital-credit-providers-regulations-2024": {
    title: "Understanding the CBK Digital Credit Providers Regulations 2024",
    excerpt: "A comprehensive breakdown of the new regulations affecting digital lenders in Kenya.",
    category: "Regulatory Updates",
    author: "Dr. Amina Ochieng",
    authorRole: "CEO & Co-Founder",
    date: "2025-01-15",
    readTime: "8 min read",
    content: [
      "The Central Bank of Kenya (CBK) has issued new regulations that significantly impact the digital credit landscape. These regulations, effective from January 2025, introduce comprehensive requirements for all digital credit providers operating in Kenya.",
      "Key highlights of the new regulations include mandatory licensing requirements, enhanced consumer protection measures, interest rate caps, and stricter data handling protocols. All existing digital lenders must apply for a license within 6 months of the regulation's effective date.",
      "The licensing framework requires digital credit providers to maintain a minimum capital requirement of KES 10 million, demonstrate adequate governance structures, and implement robust risk management frameworks. Additionally, providers must establish clear and transparent pricing mechanisms.",
      "Consumer protection has been a major focus of these regulations. Lenders are now required to provide clear disclosure of all fees and charges before loan disbursement. The regulations also mandate a 48-hour cooling-off period during which borrowers can cancel loans without penalty.",
      "Data protection requirements have been strengthened to align with Kenya's Data Protection Act 2019. Digital lenders must now obtain explicit consent before accessing customer data and are prohibited from accessing contact lists, photos, or other personal information beyond what is strictly necessary for credit assessment.",
      "The regulations also address debt collection practices, prohibiting harassment, public shaming, or contacting borrowers' family members and employers. Lenders who violate these provisions face significant penalties including license revocation.",
      "For fintech companies, these regulations present both challenges and opportunities. While compliance costs will increase, the regulatory clarity should help legitimate players differentiate themselves from predatory lenders. SheriaBot can help you understand and implement these new requirements efficiently.",
    ],
    relatedPosts: ["aml-kyc-best-practices-kenya-fintechs", "data-protection-act-fintech-compliance"],
  },
  "aml-kyc-best-practices-kenya-fintechs": {
    title: "AML/KYC Best Practices for Kenya Fintechs",
    excerpt: "Learn the essential AML and KYC procedures every fintech must implement to stay compliant.",
    category: "Compliance Tips",
    author: "Grace Wanjiru",
    authorRole: "Head of Legal",
    date: "2025-01-10",
    readTime: "6 min read",
    content: [
      "Anti-Money Laundering (AML) and Know Your Customer (KYC) compliance is non-negotiable for fintech companies operating in Kenya. The Proceeds of Crime and Anti-Money Laundering Act (POCAMLA) sets the framework that all financial service providers must follow.",
      "Effective KYC starts with customer identification and verification. For individual customers, this typically involves collecting national ID or passport details, proof of address, and biometric data where applicable. For business customers, additional documentation including registration certificates and beneficial ownership information is required.",
      "Risk-based approach is central to modern AML compliance. Not all customers present the same level of risk. Your AML framework should categorize customers based on factors like transaction patterns, geographic location, business type, and source of funds. Higher-risk customers require enhanced due diligence.",
      "Transaction monitoring is another critical component. Fintechs must implement systems that can detect suspicious patterns such as unusual transaction volumes, rapid movement of funds, or transactions just below reporting thresholds (structuring). Automated monitoring tools are essential for scaling this capability.",
      "Suspicious Transaction Reports (STRs) must be filed with the Financial Reporting Centre (FRC) when your monitoring systems or staff identify potentially suspicious activity. The reporting must be done promptly and confidentially - tipping off customers about STRs is a criminal offense.",
      "Staff training is often overlooked but crucial. All employees who handle customer interactions or transactions should receive regular AML/KYC training. This includes understanding red flags, reporting procedures, and the consequences of non-compliance.",
      "Documentation and record-keeping requirements under POCAMLA mandate retention of customer records and transaction data for at least 7 years. These records must be readily accessible for regulatory inspection.",
    ],
    relatedPosts: ["cbk-digital-credit-providers-regulations-2024", "data-protection-act-fintech-compliance"],
  },
  "data-protection-act-fintech-compliance": {
    title: "Data Protection Act Compliance: A Fintech Guide",
    excerpt: "How Kenya's Data Protection Act 2019 affects fintech operations and compliance steps.",
    category: "Compliance Tips",
    author: "Peter Kamau",
    authorRole: "CTO & Co-Founder",
    date: "2025-01-05",
    readTime: "10 min read",
    content: [
      "Kenya's Data Protection Act 2019 (DPA) represents one of the most significant regulatory developments affecting fintechs. As a data controller or processor, your fintech must understand and implement the Act's requirements to avoid penalties and maintain customer trust.",
      "The DPA establishes eight key principles for data processing: lawfulness, fairness, and transparency; purpose limitation; data minimization; accuracy; storage limitation; integrity and confidentiality; and accountability. Every aspect of your data handling must align with these principles.",
      "Consent is the cornerstone of lawful data processing under the DPA. Fintechs must obtain clear, informed, and specific consent before collecting personal data. This means no more buried consent clauses in lengthy terms of service - consent must be prominent and easy to understand.",
      "Data subject rights are extensive under the DPA. Customers have the right to access their data, request corrections, request deletion (in certain circumstances), object to processing, and data portability. Your systems must be capable of fulfilling these requests within specified timeframes.",
      "Cross-border data transfers are heavily regulated. Personal data can only be transferred outside Kenya if the recipient country has adequate data protection laws or if specific safeguards (like binding corporate rules) are in place. This affects cloud hosting decisions and third-party integrations.",
      "Data Protection Impact Assessments (DPIAs) are required for high-risk processing activities. Given that fintechs typically handle sensitive financial data at scale, most will need to conduct DPIAs for their core operations.",
      "Registration with the Office of the Data Protection Commissioner (ODPC) is mandatory for data controllers and processors. The registration process requires detailed information about your data processing activities, security measures, and compliance framework.",
      "Breach notification requirements mandate that data controllers report breaches to the ODPC within 72 hours of becoming aware of them. If the breach poses a high risk to data subjects, they must also be notified directly.",
    ],
    relatedPosts: ["aml-kyc-best-practices-kenya-fintechs", "cbk-digital-credit-providers-regulations-2024"],
  },
}

const allPosts = [
  { slug: "cbk-digital-credit-providers-regulations-2024", title: "CBK Digital Credit Providers Regulations 2024", category: "Regulatory Updates" },
  { slug: "aml-kyc-best-practices-kenya-fintechs", title: "AML/KYC Best Practices for Kenya Fintechs", category: "Compliance Tips" },
  { slug: "data-protection-act-fintech-compliance", title: "Data Protection Act Compliance: A Fintech Guide", category: "Compliance Tips" },
  { slug: "sandbox-regulatory-framework-kenya", title: "Navigating Kenya's Regulatory Sandbox Framework", category: "Regulatory Updates" },
  { slug: "mpesa-integration-compliance-checklist", title: "M-Pesa Integration Compliance Checklist", category: "Compliance Tips" },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
        <p className="mt-2 text-muted-foreground">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild className="mt-6 bg-primary text-primary-foreground">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    )
  }

  const relatedPostsData = post.relatedPosts
    .map((relatedSlug) => allPosts.find((p) => p.slug === relatedSlug))
    .filter(Boolean)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <Badge variant="outline" className="mt-6 block w-fit">
            {post.category}
          </Badge>

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-foreground">{post.author}</p>
                <p className="text-xs">{post.authorRole}</p>
              </div>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("en-KE", { 
                month: "long", 
                day: "numeric", 
                year: "numeric" 
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_200px]">
            <article className="prose prose-invert max-w-none">
              {post.content.map((paragraph, index) => (
                <p key={index} className="mb-6 text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <p className="text-sm font-medium text-foreground">Share</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedPostsData.map((relatedPost) => (
              <Link key={relatedPost?.slug} href={`/blog/${relatedPost?.slug}`}>
                <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3 text-xs">
                      {relatedPost?.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                      {relatedPost?.title}
                    </h3>
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
                Need Help with Compliance?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                SheriaBot can help you navigate these regulations with AI-powered compliance tools.
              </p>
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/register">
                  Start Free Trial
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
