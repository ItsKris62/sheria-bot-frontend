import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Scale,
  Shield,
  Target,
  Users,
  Lightbulb,
  Heart,
  ArrowRight,
  CheckCircle2,
  Building2,
  GraduationCap,
  Code2,
  Cpu,
} from "lucide-react"
import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "About Us — Regulatory Intelligence for FinTech | SheriaBot",
  description:
    "Learn about SheriaBot's mission to make financial regulation and compliance management accessible, accurate, and actionable for African fintechs.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About Us — Regulatory Intelligence for FinTech | SheriaBot",
    description:
      "Learn about SheriaBot's mission to make financial regulation and compliance management accessible, accurate, and actionable for African fintechs.",
    url: absoluteUrl("/about"),
  },
}

const values = [
  {
    icon: Target,
    title: "Accuracy First",
    description: "Every citation, checklist item, and policy recommendation is strictly grounded in primary statute.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Enterprise-grade security with encrypted document storage for sensitive regulatory intelligence.",
  },
  {
    icon: Lightbulb,
    title: "Domain Innovation",
    description: "Leveraging specialized retrieval-augmented intelligence to solve complex regulatory challenges.",
  },
  {
    icon: Heart,
    title: "Kenya-First Architecture",
    description: "Purpose-built for Kenya's unique fintech ecosystem, CBK regulations, and ODPC requirements.",
  },
]

const team = [
  {
    icon: Scale,
    name: "Regulatory Policy & Legal Research",
    role: "Domain Compliance",
    bio: "Continuously monitoring, structuring, and verifying Kenyan financial sector regulations, gazette notices, and circulars.",
  },
  {
    icon: Cpu,
    name: "AI & RAG Infrastructure",
    role: "Engineering",
    bio: "Designing hallucination-resistant, citation-grounded retrieval architectures for legal and regulatory intelligence.",
  },
  {
    icon: Code2,
    name: "Product & Regulatory Workflows",
    role: "Product Engineering",
    bio: "Building intuitive compliance checklists, gap analysis tools, and policy generation workflows for growing teams.",
  },
  {
    icon: Shield,
    name: "Security & Data Governance",
    role: "Infrastructure & Security",
    bio: "Maintaining rigorous RBAC, data encryption, and local data compliance standards across the platform.",
  },
]

const milestones = [
  { year: "Phase 1", event: "Platform Architecture & Primary Kenyan Legal Corpus Ingestion" },
  { year: "Phase 2", event: "RAG-Powered Compliance Query Engine & Citation Grounding Release" },
  { year: "Phase 3", event: "Automated Policy Generator, Gap Analysis & Licensing Checklists" },
  { year: "Phase 4", event: "Multi-Entity Enterprise Management & Continuous Regulatory Change Monitoring" },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              About SheriaBot
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Transforming Regulatory Compliance in{" "}
              <span className="text-primary">Kenya&apos;s Fintech Sector</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We&apos;re on a mission to democratize regulatory knowledge and make compliance 
              accessible to every fintech company in Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                Bridging the Gap Between Regulation and Innovation
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Kenya&apos;s fintech sector is one of Africa&apos;s most vibrant, with innovations like M-Pesa 
                leading the way. But rapid innovation means evolving regulations, and keeping up is a 
                challenge for both startups and regulators.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                SheriaBot was founded to solve this problem. We use AI to make Kenya&apos;s regulatory 
                landscape accessible, understandable, and actionable for everyone in the fintech ecosystem.
              </p>
              <div className="mt-8 flex gap-4">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">
                    Join Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="bg-transparent">
                  <Link href="/contact">Contact Team</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: GraduationCap, value: "50+", label: "Laws & Circulars Indexed" },
                { icon: Scale, value: "5", label: "Core Regulatory Pillars" },
                { icon: Shield, value: "100%", label: "Primary-Source Grounded" },
                { icon: Building2, value: "14-Day", label: "Free Evaluation Trial" },
              ].map((stat) => (
                <Card key={stat.label} className="border-border/50 bg-card/50">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="mx-auto h-8 w-8 text-primary" />
                    <p className="font-numeric mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              What Drives Us
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Focus Areas Section */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Our Disciplines
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Cross-Disciplinary Expertise
            </h2>
            <p className="mt-4 text-muted-foreground">
              Combining regulatory research, AI engineering, and African fintech compliance.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="border-border/50 bg-card">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <member.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs font-medium text-primary mt-1">{member.role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Key Milestones
            </h2>
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {milestone.year.slice(2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-foreground">{milestone.year}</p>
                    <p className="mt-1 text-muted-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Transform Your Compliance Process?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join over 100 fintech companies already using SheriaBot to navigate 
                Kenya&apos;s regulatory landscape.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
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
