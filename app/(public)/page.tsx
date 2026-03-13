"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <div ref={parallaxRef} className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 sm:py-32">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" data-parallax="0.3" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} data-parallax="0.5" />
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }}
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">

            
            <h1 
              className="animate-fade-up opacity-0 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              Navigate Kenya&apos;s Fintech Regulations with{" "}
              <span className="relative">
                <span className="text-primary">Confidence</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 4 150 4 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p 
              className="animate-fade-up opacity-0 mt-8 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              SheriaBot uses advanced AI to help regulators generate policies and fintech companies 
              stay compliant with CBK guidelines, the Data Protection Act, AML/KYC requirements, and more.
            </p>
            
            <div 
              className="animate-fade-up opacity-0 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <Button 
                size="lg" 
                asChild 
                className="group w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 px-8"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="w-full sm:w-auto rounded-xl bg-transparent border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 px-8"
              >
                <Link href="/about">Learn How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div 
            className="animate-fade-up opacity-0 mt-24 grid grid-cols-2 gap-4 sm:grid-cols-4"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            {stats.map((stat, index) => (
              <Card 
                key={stat.label} 
                className="group border-border/30 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-primary/30 transition-all duration-500"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-primary transition-all duration-300 group-hover:scale-110">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative border-y border-border/50 bg-muted/20 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div data-parallax="0.2">
              <Badge variant="outline" className="mb-6 border-destructive/50 text-destructive bg-destructive/5">
                The Challenge
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Regulatory Compliance is Complex
              </h2>
              <ul className="mt-8 space-y-5">
                {[
                  "Kenya's fintech regulations are evolving rapidly with new CBK guidelines",
                  "Startups struggle to understand licensing requirements and compliance obligations",
                  "Regulators face overwhelming workloads creating policies for emerging technologies",
                  "Legal research across multiple Acts is time-consuming and error-prone",
                ].map((item, index) => (
                  <li key={item} className="flex items-start gap-4 animate-fade-up opacity-0" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}>
                    <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-destructive/80 shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-parallax="0.3">
              <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/5">
                Our Solution
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                AI-Powered Compliance Intelligence
              </h2>
              <ul className="mt-8 space-y-5">
                {[
                  "RAG-powered AI trained on Kenya's complete legal corpus",
                  "Instant policy generation with accurate legal citations",
                  "Automated compliance checklists tailored to your business",
                  "Real-time regulatory change monitoring and impact analysis",
                ].map((item, index) => (
                  <li key={item} className="flex items-start gap-4 animate-fade-up opacity-0" style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: "forwards" }}>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/5">
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Everything You Need for{" "}
              <span className="text-primary">Regulatory Compliance</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Comprehensive tools for regulators and fintech companies alike.
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group relative border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
                data-parallax={0.1 + (index % 3) * 0.05}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types / Solutions Section */}
      <section id="solutions" className="relative border-y border-border/50 bg-muted/20 py-24 sm:py-32 scroll-mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" data-parallax="0.2" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/5">
              Solutions
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Built for Kenya&apos;s{" "}
              <span className="text-primary">Fintech Ecosystem</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            <Card className="group border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-foreground">For Regulators</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Generate comprehensive policies, manage legal corpus, and collaborate with stakeholders.
                </p>
                <ul className="mt-8 space-y-4">
                  {["AI Policy Generator", "Legal Corpus Manager", "Compliance Frameworks", "Stakeholder Collaboration"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full rounded-xl bg-transparent hover:bg-primary/10 hover:text-primary" variant="outline" asChild>
                  <Link href="/solutions/regulators">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative border-primary/50 bg-card shadow-2xl shadow-primary/10 scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 px-4 py-1">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-foreground">For Startups</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Query compliance requirements, generate checklists, and track regulatory changes.
                </p>
                <ul className="mt-8 space-y-4">
                  {["Compliance Queries", "Checklist Generator", "Gap Analysis", "Regulatory Alerts"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary/20">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-foreground">For Enterprise</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Multi-organization management, custom integrations, and advanced analytics.
                </p>
                <ul className="mt-8 space-y-4">
                  {["Multi-Org Management", "API Access", "Custom Integrations", "Dedicated Support"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full rounded-xl bg-transparent hover:bg-primary/10 hover:text-primary" variant="outline" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 sm:py-32 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/5">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Trusted by Kenya&apos;s{" "}
              <span className="text-primary">Fintech Leaders</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.author} 
                className="group border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500"
                data-parallax={0.1 + index * 0.05}
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-6 text-muted-foreground leading-relaxed text-lg italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative border-y border-border/50 bg-muted/20 py-24 sm:py-32">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" data-parallax="0.3" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/5">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Simple, Transparent{" "}
              <span className="text-primary">Pricing</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`group relative transition-all duration-500 ${
                  plan.popular 
                    ? "border-primary/50 bg-card shadow-2xl shadow-primary/10 scale-105 z-10" 
                    : "border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30"
                }`}
                data-parallax={0.1 + index * 0.03}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`mt-8 w-full rounded-xl ${
                      plan.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" 
                        : "bg-transparent hover:bg-primary/10 hover:text-primary"
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
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="mt-4 text-muted-foreground">
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
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border/50 transition-all duration-500 group-hover:border-primary/30 group-hover:bg-primary/10">
                  <item.icon className="h-8 w-8 text-muted-foreground transition-colors duration-500 group-hover:text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="relative p-12 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                Ready to Simplify Your{" "}
                <span className="text-primary">Compliance Journey</span>?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of Kenyan fintech companies using SheriaBot to navigate regulatory requirements.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="group w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 px-8"
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
                  className="w-full sm:w-auto rounded-xl bg-transparent border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 px-8"
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
