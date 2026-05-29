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
  X,
} from "lucide-react"

const modalData = {
  "draft-policies": {
    title: "Instantly Generate Compliant Policies",
    body: "Stop paying massive retainer fees for standard compliance documents. SheriaBot asks you a few simple questions about your business model and instantly generates AML/CFT, KYC, and Data Privacy policies that strictly adhere to the latest CBK and ODPC guidelines.",
    cta: "Start Drafting Now",
    href: "/register",
  },
  "spot-blindspots": {
    title: "Automated Legal Gap Analysis",
    body: "Upload your existing Terms of Service or Privacy Policy. Our agentic RAG system acts like a senior compliance officer, cross-referencing your documents against Kenyan law and highlighting exact clauses that leave you legally exposed.",
    cta: "Audit Your Documents",
    href: "/register",
  },
  "verifiable-citations": {
    title: "Zero Hallucinations. Just Law.",
    body: "AI is only useful if you can trust it. Every time SheriaBot answers a compliance question, it provides direct, clickable citations mapping back to the exact section, act, and year of the Kenya Gazette. Verify everything instantly.",
    cta: "See How It Works",
    href: "/pricing",
  },
}

const features = [
  {
    id: "draft-policies",
    icon: FileText,
    title: "Draft Policies in Minutes, Not Months",
    description: "Free your team from staring at blank pages. We help you generate legally sound AML/KYC frameworks tailored to Kenyan law instantly, so you can launch faster.",
    badge: "⚡ Saves ~15 hrs/month",
  },
  {
    id: "spot-blindspots",
    icon: Shield,
    title: "Spot Your Compliance Blind Spots",
    description: "Sleep soundly knowing you’re covered. Upload your documents, and we’ll instantly flag where you fall short of the DPA or CBK guidelines before an audit does.",
  },
  {
    id: "verifiable-citations",
    icon: BookOpen,
    title: "Answers You Can Take to the Boardroom",
    description: "Never second-guess the AI. Every answer comes with direct, verifiable citations from actual Kenyan gazettes and acts, giving you absolute confidence.",
    interactive: true,
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
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <div ref={parallaxRef} className="relative overflow-hidden">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Hero Section */}
      <AmbientSection className="relative flex flex-col items-center pt-24 pb-0 overflow-hidden min-h-[95vh]" density="normal">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-between">
          <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-green/20 bg-brand-green/5 text-brand-green text-xs font-semibold mb-6 animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
              <span>RegTech for Kenya Fintech</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] animate-fade-up">
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
            <p className="mt-8 text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed text-balance animate-fade-up stagger-1">
              <span className="block font-medium text-foreground mb-3">Kenyan fintech compliance, answered with legal citations.</span>
              <span className="block text-base sm:text-lg">Ask questions about CBK, AML, KYC, Data Protection, and payment regulations. Get source-backed answers, generate checklists, and prepare audit-ready documents in minutes.</span>
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-2 w-full sm:w-auto">
              <div className="relative inline-flex items-center w-full sm:w-auto justify-center">
                <Button 
                  size="lg" 
                  asChild 
                  className="group w-full sm:w-auto bg-brand-green text-foreground-on-green hover:bg-brand-green-hover rounded-xl shadow-glow-green hover:shadow-glow-green transition-all duration-300 px-8 h-12 text-base font-semibold"
                >
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                {/* Handwritten text & arrow pointing to CTA */}
                <div className="hidden lg:flex items-center absolute left-full ml-4 top-1/2 -translate-y-1/2 select-none pointer-events-none whitespace-nowrap">
                  <svg 
                    className="w-12 h-12 text-emerald-400/80 -rotate-12 transform -translate-x-2 translate-y-[-10px]" 
                    viewBox="0 0 50 30" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M45 5C35 15 15 15 8 22M8 22C12 21 16 22 18 24M8 22C9 18 8 14 6 12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span 
                    className="font-caveat text-emerald-400 text-2xl font-medium tracking-wide -rotate-3 translate-y-[-12px]"
                  >
                    No credit card needed!
                  </span>
                </div>
              </div>

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
          </div>

          {/* Product Dashboard Mockup peeking from the bottom */}
          <div className="relative mt-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 translate-y-12 sm:translate-y-16 animate-scale-in stagger-3">
            {/* Floating Citation Badge */}
            <div className="absolute -top-6 right-8 sm:right-24 z-20 animate-[float_3s_ease-in-out_infinite] bg-slate-950/95 border border-emerald-500/30 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-glow-green">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-mono text-[10px] sm:text-xs text-emerald-400 font-semibold tracking-wide">
                [Data Protection Act, S.30]
              </span>
            </div>

            {/* Dashboard Container (glassmorphism) */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-white/5 backdrop-blur-xl border-t border-x border-white/10 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* App Chrome (Top Bar) */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/20">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-1 text-[10px] text-slate-400 w-1/3 sm:w-1/2 justify-center">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span className="truncate">sheriabot.ai/dashboard/compliance</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Dashboard Workspace */}
              <div className="flex flex-grow overflow-hidden">
                {/* Sidebar */}
                <div className="hidden sm:flex flex-col w-48 border-r border-white/5 bg-slate-950/10 p-4 gap-4">
                  <div className="flex items-center gap-2 px-2">
                    <div className="h-6 w-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Scale className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs tracking-wide text-white">Sheria<span className="text-emerald-400">Bot</span></span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Consult</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white text-xs transition-colors duration-200">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Policy Builder</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white text-xs transition-colors duration-200">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Gap Analysis</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white text-xs transition-colors duration-200">
                      <Bell className="w-3.5 h-3.5" />
                      <span>Gazette Alerts</span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 px-2 text-[10px] text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>CBK Sandbox Active</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow p-4 sm:p-6 overflow-hidden flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                      <h4 className="text-xs sm:text-sm font-semibold text-white">Regulatory Sandbox Consultation</h4>
                      <p className="text-[10px] text-slate-400">Ask compliance questions backed by Kenyan Gazettes</p>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>98.4% Compliance Score</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 flex-grow overflow-y-auto pr-1">
                    {/* User Query */}
                    <div className="flex items-start gap-2.5 max-w-[85%] self-end">
                      <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2 text-[10px] sm:text-xs leading-normal shadow-sm">
                        Does our peer-to-peer micro-lending app need a CBK Payment Service Provider (PSP) license, or does the Digital Credit Providers (DCP) regulations apply?
                      </div>
                      <div className="h-6 w-6 rounded-full bg-emerald-700/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                        U
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                        SB
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3.5 text-[10px] sm:text-xs leading-relaxed text-slate-200">
                          <span className="font-semibold text-emerald-400 block mb-1">SheriaBot Analysis:</span>
                          Since you facilitate peer-to-peer loans directly, you fall under the <span className="text-white font-medium">CBK Digital Credit Providers (DCP) Regulations, 2022</span>. However, if your platform also holds customer funds, processes retail payments or settlement transactions, you must separately obtain a <span className="text-white font-medium">Payment Service Provider (PSP) license</span> under Sec. 12 of the National Payment System Act.
                        </div>
                        
                        {/* Citation block */}
                        <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-3 flex flex-col gap-1.5 shadow-glow-green-sm">
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold font-mono">
                            <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>CBK Digital Credit Providers Regulations, Sec. 4(1)</span>
                          </div>
                          <p className="text-slate-400 text-[9px] sm:text-[10px] leading-relaxed">
                            "No person shall carry on digital credit business in Kenya unless that person is licensed under these Regulations..."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AmbientSection>

      {/* Logo Marquee Section */}
      <AmbientSection className="border-y border-border py-16" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8 mb-16 animate-fade-in">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="group relative rounded-xl border border-border bg-surface/50 p-4 transition-all duration-300 hover:border-brand-green/30 hover:bg-surface text-center"
              >
                <div className="font-numeric text-2xl sm:text-3xl font-bold text-brand-green">{stat.value}</div>
                <div className="mt-1 text-xs sm:text-sm text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm font-medium text-foreground-muted mb-2 uppercase tracking-wider">
            Built around Kenya&apos;s key regulatory frameworks
          </p>
          <p className="text-center text-xs text-foreground-muted/60 mb-8">
            SheriaBot is not affiliated with or endorsed by the listed regulators.
          </p>
        </div>
        <LogoMarquee 
          logos={REGULATOR_LOGOS as any}
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
              Relief
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Everything You Need for{" "}
              <span className="text-brand-green">Regulatory Compliance</span>
            </h2>
            <p className="mt-6 text-lg text-foreground-muted">
              How Sheria<span className="text-brand-green">Bot</span> lightens your workload:
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group relative overflow-hidden rounded-2xl border-border bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,135,90,0.15)] hover:bg-surface"
                data-parallax={0.05 + index * 0.02}
              >
                <CardContent className="p-8 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all duration-300">
                        <feature.icon className="h-6 w-6" strokeWidth={1.75} />
                      </div>
                      {feature.badge && (
                        <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-emerald-950/30 text-emerald-400 border border-emerald-500/20">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-3 text-foreground-muted leading-relaxed text-sm">{feature.description}</p>
                  </div>

                  {/* Micro-UI interaction for Citations Card */}
                  {feature.interactive && (
                    <button
                      onClick={() => setActiveModal(feature.id)}
                      className="mt-6 relative h-8 w-full text-left overflow-hidden focus:outline-none group/btn"
                    >
                      <div className="absolute inset-0 flex items-center transition-all duration-300 group-hover/btn:-translate-y-full group-hover/btn:opacity-0 opacity-100">
                        <div className="flex items-center text-sm text-brand-green">
                          <span>Learn more</span>
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center opacity-0 translate-y-2 transition-all duration-300 group-hover/btn:translate-y-0 group-hover/btn:opacity-100">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          [Data Protection Act, S.30]
                        </span>
                      </div>
                    </button>
                  )}

                  {!feature.interactive && (
                    <button
                      onClick={() => setActiveModal(feature.id)}
                      className="mt-6 flex items-center text-sm text-brand-green opacity-100 md:opacity-0 transition-all duration-300 group-hover:opacity-100 focus:outline-none"
                    >
                      <span>Learn more</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </CardContent>
                {/* Hover glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-green/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

      {/* Feature Relief Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-800 p-8 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground hover:bg-white/5 hover:text-white transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="mt-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {modalData[activeModal as keyof typeof modalData]?.title}
              </h3>
              <p className="mt-4 text-slate-300 leading-relaxed text-sm">
                {modalData[activeModal as keyof typeof modalData]?.body}
              </p>
            </div>

            {/* Footer / CTA */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <Link 
                href={modalData[activeModal as keyof typeof modalData]?.href} 
                onClick={() => setActiveModal(null)}
                className="bg-[#00875A] hover:bg-emerald-600 text-white rounded-lg px-6 py-2 text-sm font-semibold transition-colors duration-200 inline-flex items-center"
              >
                {modalData[activeModal as keyof typeof modalData]?.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
