"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import {
  Mail,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "General Inquiries",
    value: "hello@sheriabot.com",
    href: "mailto:hello@sheriabot.com",
    description: "Product questions, support, and everything else",
  },
  {
    icon: Briefcase,
    label: "Sales & Partnerships",
    value: "sales@sheriabot.com",
    href: "mailto:sales@sheriabot.com",
    description: "Enterprise plans, integrations, and strategic partnerships",
  },
  {
    icon: Mail,
    label: "Careers",
    value: "careers@sheriabot.com",
    href: "mailto:careers@sheriabot.com",
    description: "Open roles and general applications",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nairobi, Kenya",
    href: "#",
    description: "Building Kenya's compliance infrastructure",
  },
]

const faqs = [
  {
    question: "What industries does SheriaBot support?",
    answer:
      "SheriaBot is purpose-built for Kenya's financial services sector — digital lenders, payment processors, mobile money operators, microfinance institutions, investment platforms, and insurance fintechs. We cover the full regulatory stack: CBK licensing requirements, ODPC data protection obligations, CMA capital markets rules, and international frameworks like ISO 27001 and PCI-DSS that apply to Kenyan operators.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. All plans include a 14-day free trial with no credit card required. You get full access to compliance queries, checklist generation, and gap analysis during the trial so you can evaluate SheriaBot against your actual regulatory obligations — not a sandbox of dummy data.",
  },
  {
    question: "How does SheriaBot stay current with regulatory changes?",
    answer:
      "Our regulatory intelligence pipeline monitors official sources including the CBK website, Kenya Gazette, ODPC publications, CMA notices, and the National Council for Law Reporting. When new guidance is issued — whether a circular, a statutory instrument, or an enforcement notice — our team reviews and ingests it into the knowledge base within 48 hours. Users receive alerts for changes relevant to their compliance profile.",
  },
  {
    question: "Can SheriaBot integrate with our existing compliance tools?",
    answer:
      "We offer a REST API and webhook support for teams that want to embed SheriaBot's regulatory intelligence into existing GRC platforms, ITSM workflows, or internal compliance dashboards. Enterprise plans include dedicated integration support and custom data exports. Contact our sales team to discuss your specific stack.",
  },
]

const roleOptions = [
  "Fintech Startup",
  "Enterprise",
  "Regulatory Body",
  "Investor",
  "Other",
]

type FormFields = {
  name: string
  email: string
  company: string
  role: string
  subject: string
  message: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

const emptyForm: FormFields = {
  name: "",
  email: "",
  company: "",
  role: "",
  subject: "",
  message: "",
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactPage() {
  const [fields, setFields] = useState<FormFields>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {}
    if (!fields.name.trim()) newErrors.name = "Full name is required."
    if (!fields.email.trim()) {
      newErrors.email = "Email address is required."
    } else if (!validateEmail(fields.email)) {
      newErrors.email = "Please enter a valid email address."
    }
    if (!fields.message.trim()) newErrors.message = "Message is required."
    return newErrors
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    // Simulate submission delay — no actual API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours.",
      })
    }, 1200)
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Contact
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Let&apos;s Talk{" "}
              <span className="text-primary">Compliance</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Whether you&apos;re a fintech startup navigating your first CBK licence, an enterprise tightening
              your ODPC posture, or a regulatory body exploring AI tools — we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="mt-6 text-2xl font-bold text-foreground">Message Received</h3>
                      <p className="mt-3 max-w-sm text-muted-foreground">
                        Thank you for reaching out. We&apos;ll review your message and get back to you
                        within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-8 bg-transparent"
                        onClick={() => {
                          setFields(emptyForm)
                          setErrors({})
                          setSubmitted(false)
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Full Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Wanjiku Muthoni"
                            value={fields.name}
                            onChange={handleChange}
                            className={errors.name ? "border-destructive" : ""}
                          />
                          {errors.name && (
                            <p className="text-xs text-destructive">{errors.name}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="wanjiku@yourfintech.co.ke"
                            value={fields.email}
                            onChange={handleChange}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                          )}
                        </div>

                        {/* Company */}
                        <div className="space-y-2">
                          <Label htmlFor="company">Company / Organisation</Label>
                          <Input
                            id="company"
                            name="company"
                            placeholder="Acme Fintech Ltd"
                            value={fields.company}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Role dropdown */}
                        <div className="space-y-2">
                          <Label htmlFor="role">I represent a</Label>
                          <select
                            id="role"
                            name="role"
                            value={fields.role}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select…</option>
                            {roleOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="e.g. Enterprise plan enquiry / Integration question"
                          value={fields.subject}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">
                          Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us what you're working on and how we can help…"
                          rows={5}
                          value={fields.message}
                          onChange={handleChange}
                          className={errors.message ? "border-destructive" : ""}
                        />
                        {errors.message && (
                          <p className="text-xs text-destructive">{errors.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <Card
                  key={item.label}
                  className="border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        {item.href !== "#" ? (
                          <a
                            href={item.href}
                            className="mt-0.5 text-sm text-primary underline-offset-4 hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm text-primary">{item.value}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Common Questions
              </h2>
              <p className="mt-4 text-muted-foreground">
                Quick answers before you reach out — though we&apos;re always happy to go deeper.
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-12 w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join over 100 fintechs already using SheriaBot to navigate Kenya&apos;s regulatory
                landscape — no compliance team required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <a href="/pricing">View Pricing</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
