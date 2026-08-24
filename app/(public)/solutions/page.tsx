/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-SOLUTIONS-005
 * Route: /solutions
 * Purpose: Central solutions directory hub for startups, enterprise, and regulators
 * Sprint: SEO Sprint 1
 */

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Building2, Rocket, Scale, ShieldCheck, Zap, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Compliance & Regulatory Solutions | SheriaBot",
  description:
    "Explore tailored regulatory intelligence solutions for fintech startups, enterprise financial institutions, and regulatory bodies in Kenya.",
  alternates: {
    canonical: absoluteUrl("/solutions"),
  },
  openGraph: {
    title: "Compliance & Regulatory Solutions | SheriaBot",
    description:
      "Explore tailored regulatory intelligence solutions for fintech startups, enterprise financial institutions, and regulatory bodies in Kenya.",
    url: absoluteUrl("/solutions"),
  },
}

const solutions = [
  {
    icon: Rocket,
    title: "For Startups",
    href: "/solutions/startups",
    badge: "Early-Stage & Growth",
    description:
      "Navigate CBK licensing pathways, generate tailored compliance checklists, and conduct policy gap analysis from day one.",
    highlights: [
      "AI-powered compliance query engine",
      "Personalised licensing checklists",
      "Policy gap analysis & compliance scoring",
    ],
  },
  {
    icon: Building2,
    title: "For Enterprise",
    href: "/solutions/enterprise",
    badge: "Scale & Financial Groups",
    description:
      "Manage compliance across multiple regulated subsidiaries, integrate intelligence with existing GRC tools, and automate board reporting.",
    highlights: [
      "Multi-organisation management & RBAC",
      "REST API & webhook integrations",
      "Bulk gap analysis & enterprise SLAs",
    ],
  },
  {
    icon: Scale,
    title: "For Regulators",
    href: "/solutions/regulators",
    badge: "Supervision & Policy",
    description:
      "Modernise regulatory workflows with AI-assisted policy drafting, living legal corpus management, and compliance supervision.",
    highlights: [
      "AI policy drafting grounded in statute",
      "Searchable regulatory corpus repository",
      "Supervisory analytics & compliance auditing",
    ],
  },
]

export default function SolutionsIndexPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Solutions
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Compliance Infrastructure Built for Every Scale
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Whether you are an emerging fintech startup launching your first product, an enterprise
              banking group managing complex subsidiaries, or a regulatory body drafting guidance —
              SheriaBot has dedicated solutions for your regulatory lifecycle.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Cards */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {solutions.map((sol) => (
              <Card key={sol.title} className="flex flex-col border-border/50 bg-card/60 transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="flex flex-1 flex-col p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <sol.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {sol.badge}
                    </Badge>
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-foreground">{sol.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sol.description}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-border/50 pt-6">
                    {sol.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-4">
                    <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href={sol.href}>
                        Explore {sol.title} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Simplify Your Regulatory Compliance?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Get started with a free 14-day trial or talk to our compliance team about an enterprise deployment.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
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
