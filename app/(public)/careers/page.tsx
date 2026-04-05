import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Zap,
  Globe,
  TrendingUp,
  Heart,
  Briefcase,
  Code2,
  BarChart3,
  Handshake,
  ShieldCheck,
  Rocket,
  Eye,
  Scale,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Careers — SheriaBot",
  description:
    "Join SheriaBot and help build the future of regulatory compliance in Africa. We're looking for mission-driven engineers, compliance analysts, and growth leaders in Nairobi.",
}

const whyJoin = [
  {
    icon: Heart,
    title: "Mission-Driven Work",
    description:
      "Every line of code you ship helps a Kenyan fintech stay compliant, stay operating, and continue serving customers. This is work that matters.",
  },
  {
    icon: Code2,
    title: "Cutting-Edge Tech Stack",
    description:
      "RAG pipelines, large language models, real-time compliance monitoring — you'll work with technologies that are reshaping the regulatory landscape across East Africa.",
  },
  {
    icon: Rocket,
    title: "Ground Floor Opportunity",
    description:
      "We're early. That means your decisions shape the product, the culture, and the company trajectory. High ownership, high impact — no committees.",
  },
  {
    icon: Globe,
    title: "Kenya-First, Africa-Minded",
    description:
      "We're not adapting a global platform to Kenya — we're building from Nairobi outward. Deep regulatory domain expertise baked into everything we ship.",
  },
]


const coreValues = [
  {
    icon: ShieldCheck,
    title: "Regulatory Rigour",
    description: "We never guess at compliance. Every answer is grounded in actual Kenyan statute.",
  },
  {
    icon: Zap,
    title: "Ship Fast, Ship Right",
    description: "Speed without quality is noise. We move quickly but hold the bar high on correctness.",
  },
  {
    icon: Scale,
    title: "Kenya First",
    description: "We build for the local ecosystem. Global frameworks are context; Kenyan law is canon.",
  },
  {
    icon: Eye,
    title: "Transparency by Default",
    description: "Open communication internally and with clients. No hidden pricing, no surprise behaviour.",
  },
]

export default function CareersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Careers
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Build the Future of{" "}
              <span className="text-primary">Compliance in Africa</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              SheriaBot is hiring mission-driven people who want to work at the intersection of AI, law,
              and Kenya&apos;s fintech revolution. If you want your work to matter — this is where to do it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="#open-roles">
                  View Open Roles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300">
                <a href="mailto:careers@sheriabot.com">Send a General Application</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Why SheriaBot
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Work That Changes Kenya&apos;s Fintech Landscape
            </h2>
            <p className="mt-4 text-muted-foreground">
              We&apos;re a small team doing outsized work. Here&apos;s why people choose to build here.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyJoin.map((item) => (
              <Card key={item.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Open Positions
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Join the Team
            </h2>
            <p className="mt-4 text-muted-foreground">
              We&apos;re a small, high-output team. Every hire shapes the trajectory of the company.
            </p>
          </div>

          <div className="mt-16">
            <div className="rounded-xl border border-border/50 bg-card/50 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">No Open Positions Right Now</h3>
              <p className="mt-3 mx-auto max-w-md text-muted-foreground leading-relaxed">
                We&apos;re not actively hiring at the moment, but we&apos;re always interested in hearing from
                exceptional people. Send us a general application and we&apos;ll be in touch when the right
                opportunity opens up.
              </p>
              <Button
                size="lg"
                asChild
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href="mailto:careers@sheriabot.com">
                  Send a General Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <p className="text-muted-foreground">
              Don&apos;t see your role?{" "}
              <span className="font-medium text-foreground">
                We&apos;re always looking for exceptional people.
              </span>{" "}
              Send us a note at{" "}
              <a
                href="mailto:careers@sheriabot.com"
                className="text-primary underline-offset-4 hover:underline"
              >
                careers@sheriabot.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              How We Work
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              These aren&apos;t wall posters — they&apos;re the principles that drive every product decision and
              every client interaction.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <Card key={value.title} className="border-border/50 bg-card">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4">
                The Bigger Picture
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                Solving a Real Problem for Kenya&apos;s Fintech Ecosystem
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Kenya has one of Africa&apos;s most sophisticated regulatory environments — the CBK, ODPC,
                CMA, CA, and KRA all issue guidance that fintechs must track simultaneously. Most companies
                either over-invest in compliance teams or under-invest and face enforcement risk.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                SheriaBot turns that regulatory complexity into a competitive advantage: automated gap
                analysis, AI-generated policies grounded in actual Kenyan statute, and real-time monitoring
                of regulatory changes — so compliance teams spend their time on strategy, not search.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, value: "100+", label: "Fintechs Served" },
                { icon: BarChart3, value: "50+", label: "Kenyan Laws Indexed" },
                { icon: Handshake, value: "5", label: "Regulatory Partners" },
                { icon: ShieldCheck, value: "98%", label: "Citation Accuracy" },
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
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Interested? Let&apos;s Talk.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Whether you see a fit in our open roles or just want to introduce yourself — reach out.
                We respond to every application personally.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="mailto:careers@sheriabot.com">
                    Email Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300">
                  <Link href="/about">Learn About SheriaBot</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
