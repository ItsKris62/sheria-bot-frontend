"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { DemoModal } from "@/components/landing/demo-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LogoMarquee, LogoMarqueeCompact } from "@/components/landing/logo-marquee"
import { REGULATOR_LOGOS } from "@/lib/constants/logos"
import {
  Scale,
  Shield,
  Zap,
  FileText,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Bell,
  Lock,
  Globe,
  Clock,
  ChevronRight,
  Play,
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI Policy Generator",
    description: "Generate comprehensive regulatory policies in minutes with AI-powered analysis of Kenya's legal corpus.",
  },
  {
    icon: BookOpen,
    title: "Legal Corpus Access",
    description: "Access a complete database of CBK guidelines, Data Protection Act, AML regulations, and more.",
  },
  {
    icon: Shield,
    title: "Compliance Checklists",
    description: "Auto-generated checklists tailored to your fintech product and regulatory requirements.",
  },
  {
    icon: Bell,
    title: "Regulatory Alerts",
    description: "Stay ahead with real-time notifications on regulatory changes affecting your business.",
  },
  {
    icon: FileText,
    title: "Gap Analysis",
    description: "Upload your policies and get instant AI-powered gap analysis against current regulations.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track compliance status, query history, and regulatory trends with visual analytics.",
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

const pricingPlans = [
  {
    name: "Startup",
    price: "KES 25,000",
    period: "/month",
    description: "Perfect for growing fintech startups",
    features: [
      "Unlimited compliance queries",
      "5 checklist generations/month",
      "Regulatory alerts",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Business",
    price: "KES 75,000",
    period: "/month",
    description: "For established fintech companies",
    features: [
      "Everything in Startup",
      "Unlimited checklist generations",
      "Gap analysis tool",
      "API access",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For regulators and large institutions",
    features: [
      "Everything in Business",
      "Policy generator",
      "Legal corpus management",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

function useParallax() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const elements = ref.current.querySelectorAll("[data-parallax]")
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const speed = Number.parseFloat(el.getAttribute("data-parallax") || "0.5")
        const yPos = (window.innerHeight - rect.top) * speed * 0.1
        ;(el as HTMLElement).style.transform = `translateY(${yPos}px)`
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return ref
}

export default function LandingPage() {
  const parallaxRef = useParallax()
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div ref={parallaxRef} className="relative overflow-hidden">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" data-parallax="0.2" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" data-parallax="0.3" />
        
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
              Navigate CBK regulations, AML requirements, and data protection laws with AI assistance. Generate policies, track compliance, and stay ahead of regulatory changes.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
              <Button
                size="lg"
                variant="outline"
                onClick={() => setDemoOpen(true)}
                className="group w-full sm:w-auto rounded-xl border-border-strong bg-transparent px-8 h-12 text-base text-foreground transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-foreground-on-green hover:shadow-glow-green focus-visible:ring-brand-green/50"
              >
                <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
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
      </section>

      {/* Logo Marquee Section */}
      <section className="relative py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground-muted mb-8 uppercase tracking-wider">
            Trusted by Kenya&apos;s leading regulators and financial institutions
          </p>
        </div>
        <LogoMarquee 
          logos={REGULATOR_LOGOS} 
          speed="slow" 
          pauseOnHover 
        />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 sm:py-32 scroll-mt-20">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
        
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
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative border-y border-border bg-surface/30 py-24 sm:py-32 scroll-mt-20">
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

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {[
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
            ].map((item, index) => (
              <div 
                key={item.step} 
                className="group relative"
                data-parallax={0.1 + index * 0.03}
              >
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(100%_-_1rem)] w-[calc(100%_-_2rem)] h-px bg-gradient-to-r from-brand-green/50 via-brand-green/20 to-transparent" />
                )}
                
                <div className="relative rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-brand-green/30">
                  {/* Step number */}
                  <div className="font-numeric absolute -top-4 left-8 flex h-8 items-center justify-center rounded-full bg-brand-green px-4 text-sm font-bold text-foreground-on-green">
                    {item.step}
                  </div>
                  
                  <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <item.icon className="h-7 w-7" />
                  </div>
                  
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-4 text-foreground-muted leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative overflow-hidden py-24 sm:py-32 scroll-mt-20">
        <div className="absolute inset-x-4 top-44 h-80 bg-[linear-gradient(115deg,transparent_0%,rgba(6,78,59,0.32)_18%,rgba(34,197,94,0.18)_48%,rgba(13,148,136,0.14)_68%,transparent_100%)] blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 bottom-10 h-40 bg-[linear-gradient(90deg,transparent_0%,rgba(17,24,39,0.82)_22%,rgba(6,78,59,0.38)_50%,rgba(17,24,39,0.82)_78%,transparent_100%)] blur-2xl pointer-events-none" />

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
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative overflow-hidden border-y border-border bg-surface/30 py-24 sm:py-32">
        <div className="absolute inset-x-6 top-44 h-72 bg-[linear-gradient(115deg,transparent_0%,rgba(6,78,59,0.12)_26%,rgba(34,197,94,0.08)_52%,rgba(13,148,136,0.08)_72%,transparent_100%)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[rgba(34,197,94,0.03)] rounded-full blur-[100px] pointer-events-none" data-parallax="0.3" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-brand-green/30 text-brand-green bg-brand-green/5 px-4 py-1">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Simple, Transparent{" "}
              <span className="text-brand-green">Pricing</span>
            </h2>
            <p className="mt-6 text-lg text-foreground-muted">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="relative mt-20 grid gap-6 lg:grid-cols-3 lg:items-center lg:gap-5">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name} 
                className="relative"
                data-parallax={0.1 + index * 0.03}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                    <Badge className="bg-brand-green text-foreground-on-green shadow-glow-green-sm px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <Card
                  className={`group relative overflow-hidden border border-white/10 border-l-white/20 border-t-white/25 bg-surface/55 shadow-elevated backdrop-blur-2xl transition-all duration-500 hover:border-brand-green/30 hover:bg-surface/70 ${
                    plan.popular
                      ? "z-10 bg-surface/75 shadow-glow-green-sm lg:-translate-y-5 lg:scale-[1.04]"
                      : "opacity-[0.86] lg:translate-y-7 lg:scale-[0.95] hover:opacity-100"
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/40 via-brand-green/25 to-transparent" />
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/30 via-brand-green/15 to-transparent" />
                  <div className="absolute inset-x-0 -top-px h-24 bg-gradient-to-b from-[rgba(34,197,94,0.07)] via-[rgba(34,197,94,0.025)] to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                  <CardContent className="relative z-10 p-8">
                    <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-sm text-foreground-muted">{plan.description}</p>
                    <div className="mt-6">
                      <span className="font-numeric text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-foreground-muted">{plan.period}</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-foreground-muted">
                          <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`mt-8 w-full rounded-xl ${
                      plan.popular 
                        ? "bg-brand-green text-foreground-on-green hover:bg-brand-green-hover shadow-glow-green-sm" 
                        : "bg-transparent border-border hover:bg-brand-green/10 hover:border-brand-green/30 hover:text-brand-green"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Compact logo strip in pricing */}
          <div className="mt-16 pt-8 border-t border-border">
            <LogoMarqueeCompact logos={REGULATOR_LOGOS} />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
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
              { icon: Shield, label: "SOC 2 Compliant" },
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
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-brand-green/30 bg-gradient-to-br from-brand-green/10 via-surface to-surface">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
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
                    Start Free Trial
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
      </section>
    </div>
  )
}
