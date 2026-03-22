import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  Network,
  Settings,
  ShieldCheck,
  BarChart3,
  Key,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Lock,
  Zap,
  FileCheck,
  Layers,
} from "lucide-react"

const features = [
  {
    icon: Network,
    title: "Multi-Organisation Management",
    description:
      "Manage compliance across multiple subsidiaries, business units, or portfolio companies from a single enterprise dashboard.",
  },
  {
    icon: Key,
    title: "API & System Integrations",
    description:
      "Integrate SheriaBot's compliance intelligence directly into your existing GRC systems, ERPs, and internal tools via REST API.",
  },
  {
    icon: Users,
    title: "Team & Role Management",
    description:
      "Advanced RBAC with custom roles, departmental access controls, and approval workflows designed for large compliance teams.",
  },
  {
    icon: BarChart3,
    title: "Enterprise Analytics",
    description:
      "Board-ready compliance dashboards with trend analysis, benchmark comparisons, and exportable audit reports.",
  },
  {
    icon: FileCheck,
    title: "Bulk Gap Analysis",
    description:
      "Run gap analyses across entire policy libraries simultaneously. Identify systemic compliance risks across your organisation.",
  },
  {
    icon: Settings,
    title: "Custom Workflows",
    description:
      "Configure bespoke compliance workflows, approval chains, and escalation paths that match your internal governance structure.",
  },
]

const integrations = [
  "REST API with full OpenAPI spec",
  "Webhook notifications for compliance events",
  "SSO / SAML 2.0 for identity management",
  "Data export in JSON, CSV, and PDF formats",
  "Custom branding and white-label options",
  "Dedicated SLA with 99.9% uptime guarantee",
]

const useCases = [
  {
    icon: Building2,
    title: "Banks & Financial Groups",
    description:
      "Centralise compliance management across all regulated subsidiaries — banking, insurance, asset management — in one platform.",
  },
  {
    icon: Globe,
    title: "Regional Fintech Groups",
    description:
      "Manage compliance obligations across multiple East African jurisdictions with localised regulatory content per market.",
  },
  {
    icon: Layers,
    title: "VC-Backed Portfolios",
    description:
      "Give portfolio companies access to compliance tools while maintaining investor-level oversight of their regulatory health.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Consultancies",
    description:
      "Manage multiple client organisations from one interface, generate client-branded reports, and scale your advisory practice.",
  },
]

const benefits = [
  "Single pane of glass for all your regulated entities",
  "Dedicated customer success manager and priority support",
  "Custom compliance frameworks tailored to your sector",
  "Enterprise SLA with contractual uptime guarantees",
  "Data residency in Kenya for regulatory compliance",
  "Volume pricing with flexible billing options",
]

export default function ForEnterprisePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              For Enterprise
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Enterprise-Grade Compliance{" "}
              <span className="text-primary">at Scale</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              SheriaBot Enterprise gives large financial institutions, banking groups, and
              compliance teams the tools to manage complex, multi-entity regulatory obligations
              with the security and control they require.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">
                  Talk to Enterprise Sales <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent">
                <Link href="/pricing">View Pricing</Link>
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
              Enterprise Features
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Power, Control, and Scale
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to run compliance operations across a complex organisation.
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
              Who Uses SheriaBot Enterprise
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

      {/* Benefits + Integrations */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <Badge variant="outline" className="mb-4">
                Enterprise Benefits
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                Compliance Infrastructure Built for Your Scale
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Large organisations face regulatory complexity that standard tools can&apos;t handle.
                SheriaBot Enterprise is purpose-designed to give compliance, legal, and risk teams
                the visibility and control they need.
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
            <div>
              <Badge variant="outline" className="mb-4">
                Integrations & Technical
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                Plug Into Your Existing Stack
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                SheriaBot is built to integrate with your existing GRC, ERP, and internal tooling —
                not replace it.
              </p>
              <ul className="mt-8 space-y-3">
                {integrations.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, value: "20+", label: "Enterprise Clients" },
              { icon: Lock, value: "99.9%", label: "Uptime SLA" },
              { icon: Globe, value: "5+", label: "Jurisdictions Covered" },
              { icon: Users, value: "500+", label: "Enterprise Users" },
            ].map((stat) => (
              <Card key={stat.label} className="border-border/50 bg-card/50">
                <CardContent className="p-6 text-center">
                  <stat.icon className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Let&apos;s Build Your Compliance Stack Together
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Our enterprise team will work with you to configure SheriaBot to fit your
                organisation&apos;s exact compliance requirements.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">
                    Contact Enterprise Sales <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <Link href="/pricing">View Enterprise Pricing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
