"use client"

import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { DemoModal } from "@/components/landing/demo-modal"
import { PricingSection } from "@/components/landing/pricing-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LogoMarquee } from "@/components/landing/logo-marquee"
import { ComplianceEvidenceSection } from "@/components/landing/compliance-evidence-section"
import { REGULATOR_LOGOS } from "@/lib/constants/logos"
import {
  Scale,
  Shield,
  Zap,
  FileText,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  BookOpen,
  Bell,
  Lock,
  Globe,
  Clock,
  ChevronRight,
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Generate regulator-ready policies in minutes",
    description: "Instantly draft customized compliance documents tailored to your specific fintech business model.",
  },
  {
    icon: BookOpen,
    title: "Ask CBK, AML, and Data Protection questions with citations",
    description: "Get accurate, source-backed answers from Kenya's comprehensive legal and regulatory corpus.",
  },
  {
    icon: FileText,
    title: "Track compliance gaps before they become audit issues",
    description: "Proactively identify and resolve missing policies or regulatory requirements in your operations.",
  },
  {
    icon: Bell,
    title: "Receive alerts when Kenyan fintech rules change",
    description: "Stay ahead of the curve with real-time notifications whenever relevant regulations are updated.",
  },
  {
    icon: Shield,
    title: "Build checklists for licensing, KYC, and reporting obligations",
    description: "Ensure you meet every regulatory requirement with auto-generated, step-by-step compliance workflows.",
  },
  {
    icon: BarChart3,
    title: "Prove compliance with audit-ready visual reporting",
    description: "Maintain a clear, traceable history of your compliance queries and regulatory alignment for regulators.",
  },
]

const stats = [
  { value: "50+", label: "Kenyan Laws & Regulations" },
  { value: "1000+", label: "Compliance Queries Processed" },
  { value: "98%", label: "Citation Accuracy" },
  { value: "24/7", label: "AI Availability" },
]

const testimonials = [
  {
    quote: "SheriaBot has transformed how we approach regulatory compliance. What used to take weeks now takes hours.",
    author: "Sarah Wanjiku",
    role: "Chief Compliance Officer",
    company: "FinPay Kenya",
  },
  {
    quote: "The AI-generated policies are remarkably accurate. The citation tracking alone has saved us countless hours of legal research.",
    author: "James Odhiambo",
    role: "Legal Counsel",
    company: "MobiLend Solutions",
  },
  {
    quote: "As a regulator, having instant access to policy templates and compliance frameworks has streamlined our entire workflow.",
    author: "Dr. Grace Mutua",
    role: "Senior Policy Analyst",
    company: "Central Bank of Kenya",
  },
]

const howItWorksSteps = [
  {
    step: "01",
    title: "Connect Your Business",
    description: "Tell us about your fintech product. Our AI analyzes your business model to identify applicable regulations.",
    icon: Users,
  },
  {
    step: "02",
    title: "Get AI Analysis",
    description: "Receive instant compliance checklists, gap analysis, and policy recommendations tailored to your needs.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Stay Compliant",
    description: "Monitor regulatory changes, track your compliance status, and generate reports with our dashboard.",
    icon: Scale,
  },
]

function handleSpotlightMove(event: MouseEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect()

  event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`)
}

function useParallax() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (!ref.current) return
      const elements = ref.current.querySelectorAll("[data-parallax]")
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const speed = Number.parseFloat(el.getAttribute("data-parallax") || "0.5")
        const yPos = (window.innerHeight - rect.top) * speed * 0.1
        const element = el as HTMLElement

        if (element.hasAttribute("data-ambient-layer")) {
          element.style.setProperty("--parallax-y", `${yPos}px`)
        } else {
          element.style.transform = `translateY(${yPos}px)`
        }
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!ref.current || event.pointerType === "touch") return

      const target = event.target as Element | null
      const section = target?.closest("[data-ambient-section]") as HTMLElement | null
      if (!section) return

      const rect = section.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      const driftX = (x - 50) / 50
      const driftY = (y - 50) / 50

      section.style.setProperty("--mouse-x", `${x}%`)
      section.style.setProperty("--mouse-y", `${y}%`)
      section.style.setProperty("--drift-x", driftX.toFixed(3))
      section.style.setProperty("--drift-y", driftY.toFixed(3))
      section.style.setProperty("--drift-x-px", `${(driftX * 8).toFixed(2)}px`)
      section.style.setProperty("--drift-y-px", `${(driftY * 6).toFixed(2)}px`)
      section.style.setProperty("--drift-x-px-inverse", `${(driftX * -5).toFixed(2)}px`)
      section.style.setProperty("--drift-y-px-inverse", `${(driftY * -4).toFixed(2)}px`)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [])

  return ref
}

function SectionAtmosphere({
  tone = "green",
  density = "normal",
}: {
  tone?: "green" | "gold"
  density?: "quiet" | "normal"
}) {
  const accent =
    tone === "gold"
      ? "rgba(198,161,91,0.12)"
      : "rgba(30,215,96,0.11)"
  const secondary =
    tone === "gold"
      ? "rgba(30,215,96,0.045)"
      : "rgba(15,169,88,0.055)"
  const opacity = density === "quiet" ? "opacity-55" : "opacity-80"

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-[background,transform,opacity] duration-700 ease-out ${opacity}`}
        style={{
          background: `radial-gradient(circle at var(--mouse-x,50%) var(--mouse-y,30%), ${accent}, transparent 30%), linear-gradient(115deg, transparent 0%, ${secondary} 42%, transparent 76%)`,
          transform:
            "translate3d(var(--drift-x-px,0px), calc(var(--parallax-y,0px) + var(--drift-y-px,0px)), 0)",
        }}
        data-parallax={density === "quiet" ? "0.035" : "0.055"}
        data-ambient-layer
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(245,247,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,246,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,45%),black,transparent_58%)] motion-reduce:hidden"
        style={{
          transform:
            "translate3d(var(--drift-x-px-inverse,0px), calc(var(--parallax-y,0px) + var(--drift-y-px-inverse,0px)), 0)",
        }}
        data-parallax="0.025"
        data-ambient-layer
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-brand-green/25 to-transparent" />
    </>
  )
}

function AmbientSection({
  children,
  className,
  id,
  tone,
  density,
}: {
  children: ReactNode
  className: string
  id?: string
  tone?: "green" | "gold"
  density?: "quiet" | "normal"
}) {
  return (
    <section
      id={id}
      data-ambient-section
      className={`relative isolate overflow-hidden ${className}`}
    >
      <SectionAtmosphere tone={tone} density={density} />
      {children}
    </section>
  )
}

export default function LandingPage() {
  const parallaxRef = useParallax()
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div ref={parallaxRef} className="relative overflow-hidden">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Hero Section */}
      <AmbientSection className="flex min-h-[90vh] items-center pt-20 pb-32" density="normal">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-4xl text-center">
            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              <span className="text-balance">
                AI-Powered{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-brand-green">Compliance</span>
                  <span className="absolute -inset-1 -z-10 bg-brand-green/10 blur-lg rounded-lg" />
                </span>
                {" "}for Kenya&apos;s Fintech Industry
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed text-balance">
              <span className="block font-medium text-foreground mb-4">Kenyan fintech compliance, answered with legal citations.</span>
              <span className="block">Ask questions about CBK, AML, KYC, Data Protection, and payment regulations. Get source-backed answers, generate checklists, and prepare audit-ready documents in minutes.</span>
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                asChild 
                className="group w-full sm:w-auto bg-brand-green text-foreground-on-green hover:bg-brand-green-hover rounded-xl shadow-glow-green hover:shadow-glow-green transition-all duration-300 px-8 h-12 text-base font-semibold"
              >
                <Link href="/register">
                  Run Your First Compliance Query
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setDemoOpen(true)}
                aria-label="Open tutorial videos"
                className="group w-full sm:w-auto rounded-xl border-border-strong bg-transparent px-8 h-12 text-base text-foreground transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-foreground-on-green hover:shadow-glow-green focus-visible:ring-brand-green/50"
              >
                <FileText className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                 Tutorial Videos
              </Button>
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="group relative rounded-xl border border-border bg-surface/50 p-4 transition-all duration-300 hover:border-brand-green/30 hover:bg-surface"
                  data-parallax={0.05 + index * 0.02}
                >
                  <div className="font-numeric text-2xl sm:text-3xl font-bold text-brand-green">{stat.value}</div>
                  <div className="mt-1 text-xs sm:text-sm text-foreground-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AmbientSection>

      {/* Logo Marquee Section */}
      <AmbientSection className="border-y border-border py-16" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-foreground-muted mb-2 uppercase tracking-wider">
            Built around Kenya&apos;s key regulatory frameworks
          </p>
          <p className="text-center text-xs text-foreground-muted/60 mb-8">
            SheriaBot is not affiliated with or endorsed by the listed regulators.
          </p>
        </div>
        <LogoMarquee 
          logos={REGULATOR_LOGOS}
          speed="slow" 
          pauseOnHover 
        />
      </AmbientSection>

      <ComplianceEvidenceSection />

      {/* Features Section */}
      <AmbientSection id="features" className="py-24 sm:py-32 scroll-mt-20" density="quiet">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-brand-green/30 text-brand-green bg-brand-green/5 px-4 py-1">
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Everything You Need for{" "}
              <span className="text-brand-green">Regulatory Compliance</span>
            </h2>
            <p className="mt-6 text-lg text-foreground-muted">
              Built specifically for Kenya&apos;s fintech ecosystem with deep understanding of local regulations.
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group relative overflow-hidden border-border bg-surface/50 backdrop-blur-sm transition-all duration-500 hover:border-brand-green/30 hover:bg-surface"
                data-parallax={0.05 + index * 0.02}
              >
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition-all duration-500 group-hover:bg-brand-green group-hover:text-foreground-on-green group-hover:shadow-glow-green-sm">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-foreground-muted leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center text-sm text-brand-green opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span>Learn more</span>
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
                {/* Hover glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-green/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Card>
            ))}
          </div>
        </div>
      </AmbientSection>

      {/* How It Works Section */}
      <AmbientSection id="how-it-works" className="border-y border-border bg-surface/30 py-24 sm:py-32 scroll-mt-20" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-brand-green/30 text-brand-green bg-brand-green/5 px-4 py-1">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Three Steps to{" "}
              <span className="text-brand-green">Full Compliance</span>
            </h2>
          </div>

          <div className="relative mt-20 grid gap-8 lg:grid-cols-3 lg:gap-6">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-6 z-0 hidden h-px overflow-hidden bg-gradient-to-r from-brand-green/10 via-brand-green/35 to-brand-green/10 lg:block">
              <div className="absolute inset-y-0 w-1/3 animate-thread-pulse bg-gradient-to-r from-transparent via-brand-green to-transparent shadow-[0_0_18px_rgba(34,197,94,0.75)]" />
            </div>

            {howItWorksSteps.map((item, index) => (
              <div 
                key={item.step} 
                className={`group relative z-10 pt-12 ${index === 1 ? "lg:translate-y-7" : ""}`}
                data-parallax={0.1 + index * 0.03}
              >
                <div className="font-numeric absolute left-8 top-0 z-20 flex h-12 min-w-12 items-center justify-center rounded-full border border-brand-green/35 bg-background/80 px-3 text-sm font-bold text-brand-green shadow-[0_0_20px_rgba(34,197,94,0.22)] backdrop-blur-md transition-all duration-500 group-hover:border-brand-green/70 group-hover:text-foreground">
                  <span className="absolute inset-0 rounded-full bg-brand-green/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative">
                    {item.step}
                  </span>
                </div>

                <div
                  className="
                    relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10
                    bg-white/[0.02] p-8 shadow-elevated backdrop-blur-md
                    transition-all duration-500 hover:-translate-y-1 hover:border-brand-green/50
                    hover:bg-white/[0.04] hover:shadow-glow-green
                  "
                  onMouseMove={handleSpotlightMove}
                >
                  <div
                    className="
                      pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100
                      [background:radial-gradient(220px_circle_at_var(--spotlight-x,50%)_var(--spotlight-y,30%),rgba(34,197,94,0.18),transparent_68%)]
                    "
                  />
                  <div className="pointer-events-none absolute -bottom-4 right-4 font-numeric text-9xl font-black leading-none text-white/5">
                    {item.step}
                  </div>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-brand-green/20 bg-brand-green/10 text-brand-green">
                    <item.icon className="h-7 w-7 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  </div>

                  <h3 className="relative mt-8 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="relative mt-4 text-foreground-muted leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AmbientSection>

      {/* Testimonials Section */}
      <AmbientSection id="testimonials" className="py-24 sm:py-32 scroll-mt-20" density="normal">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-brand-green/30 text-brand-green bg-brand-green/5 px-4 py-1">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Trusted by Kenya&apos;s{" "}
              <span className="text-brand-green">Fintech Leaders</span>
            </h2>
          </div>

          <div className="relative mt-20 grid gap-6 lg:grid-cols-3 lg:items-center lg:gap-5">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author} 
                data-parallax={0.1 + index * 0.05}
              >
                <Card
                  className={`group relative overflow-hidden border border-white/10 border-l-white/20 border-t-white/25 bg-surface/55 shadow-elevated backdrop-blur-2xl transition-all duration-500 hover:border-brand-green/35 hover:bg-surface/70 hover:shadow-glow-green ${
                    index === 1
                      ? "z-10 bg-surface/75 shadow-glow-green lg:-translate-y-6 lg:scale-[1.04]"
                      : "opacity-[0.82] lg:translate-y-8 lg:scale-[0.94] hover:opacity-100"
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/45 via-brand-green/35 to-transparent" />
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/35 via-brand-green/20 to-transparent" />
                  <div className="absolute inset-x-0 -top-px h-28 bg-gradient-to-b from-brand-green/10 via-brand-green/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                  <CardContent className={`${index === 1 ? "p-9" : "p-8"}`}>
                    <p className={`${index === 1 ? "text-xl text-foreground" : "text-lg text-foreground-secondary"} leading-relaxed font-medium`}>
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-green/20 bg-brand-green/10 text-brand-green font-bold text-lg shadow-glow-green-sm">
                        {testimonial.author.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-foreground-muted">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </AmbientSection>

      <PricingSection />

      {/* Trust Section */}
      <AmbientSection className="py-24" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="mt-4 text-foreground-muted">
              Your data is protected with industry-leading security measures.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { icon: Lock, label: "End-to-End Encryption" },
              { icon: Shield, label: "Role-Based Access Controls" },
              { icon: Globe, label: "Kenya Data Residency" },
              { icon: Clock, label: "99.9% Uptime SLA" },
            ].map((item, index) => (
              <div 
                key={item.label} 
                className="group flex flex-col items-center gap-4 text-center"
                data-parallax={0.05 + index * 0.02}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-border transition-all duration-500 group-hover:border-brand-green/30 group-hover:bg-brand-green/10">
                  <item.icon className="h-8 w-8 text-foreground-muted transition-colors duration-500 group-hover:text-brand-green" />
                </div>
                <span className="text-sm font-medium text-foreground-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </AmbientSection>

      {/* CTA Section */}
      <AmbientSection className="py-24" tone="gold" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-brand-green/30 bg-gradient-to-br from-brand-green/10 via-surface to-surface">
            <CardContent className="relative p-12 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Ready to Simplify Your{" "}
                <span className="text-brand-green">Compliance Journey</span>?
              </h2>
              <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
                Join hundreds of Kenyan fintech companies using SheriaBot to navigate regulatory requirements.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="group w-full sm:w-auto bg-brand-green text-foreground-on-green hover:bg-brand-green-hover rounded-xl shadow-glow-green hover:shadow-glow-green transition-all duration-300 hover:scale-105 px-8 h-12 font-semibold"
                >
                  <Link href="/register">
                    Run Your First Compliance Query
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto rounded-xl border-border bg-transparent hover:bg-brand-green/10 hover:border-brand-green/30 hover:text-brand-green transition-all duration-300 px-8 h-12"
                >
                  <Link href="/contact">Talk to Sales</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AmbientSection>
    </div>
  )
}
