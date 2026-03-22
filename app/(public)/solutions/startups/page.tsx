import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Rocket,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  HelpCircle,
} from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Compliance Queries",
    description:
      "Ask any compliance question in plain English and get instant, cited answers grounded in Kenya's actual regulations — CBK, CMA, IRA, and more.",
  },
  {
    icon: ClipboardList,
    title: "Personalised Compliance Checklists",
    description:
      "Generate a tailored compliance checklist based on your business stage, target segment, and services offered. Know exactly what you need to do.",
  },
  {
    icon: ShieldCheck,
    title: "Gap Analysis",
    description:
      "Upload your internal policies or documents and get an AI-powered gap analysis showing exactly where you fall short of regulatory requirements.",
  },
  {
    icon: TrendingUp,
    title: "Compliance Score Dashboard",
    description:
      "Track your compliance health across five key categories: Data Protection, AML/KYC, CBK Licensing, Consumer Protection, and Cybersecurity.",
  },
  {
    icon: BookOpen,
    title: "Regulatory Knowledge Base",
    description:
      "Access a comprehensive, always-updated library of Kenya's fintech regulations, CBK circulars, and licensing requirements.",
  },
  {
    icon: HelpCircle,
    title: "Guided Licensing Pathways",
    description:
      "Step-by-step guides for every CBK licence type — from Payment Service Provider to Mobile Loan App — so you never miss a requirement.",
  },
]

const plans = [
  {
    stage: "Pre-Revenue",
    description: "Just starting out? Get the compliance foundations right from day one.",
    items: ["Business registration checklist", "AML/KYC basic framework", "5 compliance queries/month"],
  },
  {
    stage: "Early Stage",
    description: "Launching your MVP and approaching regulators for the first time.",
    items: ["Full licensing pathway guide", "Unlimited compliance queries", "Gap analysis on 3 documents"],
  },
  {
    stage: "Growth Stage",
    description: "Scaling your product and maintaining ongoing compliance.",
    items: ["Real-time compliance score", "Unlimited gap analyses", "Priority support & alerts"],
  },
]

const benefits = [
  "Understand regulations in plain English — no lawyers needed for initial research",
  "Cut compliance preparation time by up to 60%",
  "Avoid CBK application rejections with pre-submission checklists",
  "Stay ahead of regulatory changes with automatic alerts",
  "Affordable pricing designed for early-stage fintech budgets",
  "Trusted by 100+ Kenyan fintech startups",
]

export default function ForStartupsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              For Startups
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Navigate Kenya&apos;s Fintech{" "}
              <span className="text-primary">Regulations with Confidence</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              SheriaBot gives fintech startups instant access to compliance guidance, personalised
              checklists, and gap analysis — so you can focus on building your product, not
              deciphering regulation.
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
              Everything a Fintech Founder Needs
            </h2>
            <p className="mt-4 text-muted-foreground">
              From your first compliance question to your CBK licence application.
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

      {/* Stage-based Plans */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              For Every Stage
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Built for Your Growth Journey
            </h2>
            <p className="mt-4 text-muted-foreground">
              SheriaBot scales with you — from idea to Series A and beyond.
            </p>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.stage} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">{plan.stage}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
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
                Why SheriaBot
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                Stop Guessing. Start Complying.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Kenyan fintech founders waste hundreds of hours — and thousands of shillings in
                legal fees — trying to understand what&apos;s required of them. SheriaBot puts that
                knowledge at your fingertips, instantly.
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
                { icon: Zap, value: "60%", label: "Time Saved on Compliance" },
                { icon: Globe, value: "100+", label: "Startups Onboarded" },
                { icon: Lock, value: "50+", label: "Laws & Circulars Indexed" },
                { icon: ShieldCheck, value: "5", label: "Compliance Categories Tracked" },
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Your Compliance Journey Starts Here
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join over 100 Kenyan fintech startups using SheriaBot to get compliant faster and
                launch with confidence.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">
                    Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <Link href="/pricing">See Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
