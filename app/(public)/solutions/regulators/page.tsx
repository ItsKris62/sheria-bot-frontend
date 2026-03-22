import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Scale,
  Shield,
  FileText,
  Database,
  BarChart3,
  Search,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
  Bell,
  Layers,
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "AI Policy Drafting",
    description:
      "Generate compliant policy documents grounded in Kenya's legal framework. Review, edit, and publish in minutes, not weeks.",
  },
  {
    icon: Database,
    title: "Regulatory Corpus Management",
    description:
      "Maintain a living, searchable corpus of all active regulations, circulars, and guidelines under your jurisdiction.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Find relevant precedents and cross-references across thousands of regulatory documents instantly with AI-powered search.",
  },
  {
    icon: BarChart3,
    title: "Compliance Analytics",
    description:
      "Track adoption rates, identify compliance gaps across regulated entities, and generate supervision reports automatically.",
  },
  {
    icon: Bell,
    title: "Industry Alerts",
    description:
      "Push regulatory updates and policy changes directly to all regulated entities in your jurisdiction with audit trails.",
  },
  {
    icon: Users,
    title: "Stakeholder Collaboration",
    description:
      "Collaborate internally on policy drafts with version control, comments, and approval workflows before publishing.",
  },
]

const benefits = [
  "Reduce policy drafting time by up to 70%",
  "Maintain a single source of truth for all regulations",
  "Automated consistency checks across policy documents",
  "Full audit trails for all regulatory actions",
  "Secure, Kenya-resident data storage",
  "API access for integration with existing systems",
]

const useCases = [
  {
    icon: Scale,
    title: "Central Bank of Kenya",
    description: "Draft prudential guidelines, issue circulars, and manage licensing frameworks for banks and SACCOs.",
  },
  {
    icon: Shield,
    title: "Capital Markets Authority",
    description: "Manage securities regulations, licensing registers, and market conduct rules in one place.",
  },
  {
    icon: BookOpen,
    title: "Communications Authority",
    description: "Publish digital finance regulations and track compliance across licensed payment service providers.",
  },
  {
    icon: Layers,
    title: "Insurance Regulatory Authority",
    description: "Streamline policy issuance for microinsurance, insurtech licensing, and claims compliance.",
  },
]

export default function ForRegulatorsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              For Regulators
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Modernise Your{" "}
              <span className="text-primary">Regulatory Operations</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              SheriaBot gives Kenya&apos;s financial regulators a unified platform to draft policies,
              manage regulatory corpora, and supervise compliance — powered by AI built for Kenya&apos;s
              legal framework.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/register">
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent">
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Platform Features
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Regulate Effectively
            </h2>
            <p className="mt-4 text-muted-foreground">
              Purpose-built tools for Kenya&apos;s financial sector regulators.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Use Cases
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Built for Kenya&apos;s Key Regulators
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((uc) => (
              <Card key={uc.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <uc.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{uc.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{uc.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Key Benefits
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                Why Leading Regulators Choose SheriaBot
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Kenya&apos;s regulatory landscape is evolving fast. SheriaBot helps regulators stay
                ahead with AI-assisted tools that reduce operational burden and improve policy quality.
              </p>
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "70%", label: "Faster Policy Drafting" },
                { value: "100%", label: "Audit Trail Coverage" },
                { value: "50+", label: "Regulations Indexed" },
                { value: "24/7", label: "Platform Availability" },
              ].map((stat) => (
                <Card key={stat.label} className="border-border/50 bg-card/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Modernise Your Regulatory Processes?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join Kenya&apos;s forward-thinking regulators using SheriaBot to drive efficient,
                evidence-based supervision.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
