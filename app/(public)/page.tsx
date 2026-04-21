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
      {/* Subtle grid background */}
      <div 
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

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
                className="group w-full sm:w-auto rounded-xl border-border-strong bg-transparent hover:bg-surface hover:border-brand-green/30 transition-all duration-300 px-8 h-12 text-base"
              >
                <Play className="h-4 w-4" />
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
                  <div className="text-2xl sm:text-3xl font-bold text-brand-green">{stat.value}</div>
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
                  <div className="absolute -top-4 left-8 flex h-8 items-center justify-center rounded-full bg-brand-green px-4 text-sm font-bold text-foreground-on-green">
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
      <section id="testimonials" className="py-24 sm:py-32 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-brand-green/30 text-brand-green bg-brand-green/5 px-4 py-1">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Trusted by Kenya&apos;s{" "}
              <span className="text-brand-green">Fintech Leaders</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.author} 
                className="group border-border bg-surface/50 backdrop-blur-sm hover:border-brand-green/30 transition-all duration-500"
                data-parallax={0.1 + index * 0.05}
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 text-brand-green">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-6 text-foreground-muted leading-relaxed text-lg italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green font-bold text-lg">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-foreground-muted">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative border-y border-border bg-surface/30 py-24 sm:py-32">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" data-parallax="0.3" />
        
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

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`group relative transition-all duration-500 ${
                  plan.popular 
                    ? "border-brand-green/50 bg-surface shadow-glow-green scale-105 z-10" 
                    : "border-border bg-surface/50 backdrop-blur-sm hover:border-brand-green/30"
                }`}
                data-parallax={0.1 + index * 0.03}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-green text-foreground-on-green shadow-glow-green-sm px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{plan.description}</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
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
