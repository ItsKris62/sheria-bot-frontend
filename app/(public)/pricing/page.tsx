import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Building2,
  Scale,
  HelpCircle,
  Shield,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  PUBLIC_PRICING_PLANS,
  PLAN_COMPARISON_ROWS,
  formatPrice,
  getAnnualSavings,
  type PlanId,
} from "@/lib/config/plans"

// ── Icon map for plan cards ─────────────────────────────────────────────────

const PLAN_ICONS: Record<PlanId, React.ComponentType<{ className?: string }>> = {
  REGULATOR: Shield,
  STARTUP: Zap,
  BUSINESS: Building2,
  ENTERPRISE: Scale,
}

// ── Register CTA links per plan ─────────────────────────────────────────────

const PLAN_CTA_LINKS: Record<PlanId, string> = {
  REGULATOR: '/register',
  STARTUP: '/register?plan=startup',
  BUSINESS: '/register?plan=business',
  ENTERPRISE: '/contact?subject=enterprise',
}

// ── FAQ data ─────────────────────────────────────────────────────────────────

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept M-Pesa, bank transfers, and major credit/debit cards. For Enterprise plans, we also offer invoicing with NET 30 terms.",
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. Downgrades take effect at the next billing period.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Startup and Business plans come with a 14-day free trial with full access to features. No credit card required to start.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "You can export all your data at any time. After cancellation, you retain full access during the 7-day grace period, then data is retained for 30 days before permanent deletion.",
  },
  {
    question: "Do you offer discounts for NGOs or government agencies?",
    answer: "Yes, we offer special pricing for non-profits, NGOs, and government regulatory bodies. Contact our sales team for details.",
  },
  {
    question: "What's included in the free trial?",
    answer: "The free trial includes full access to all features of the selected plan, allowing you to test compliance queries, checklist generation, and analytics.",
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Pricing
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Simple, Transparent{" "}
              <span className="text-primary">Pricing</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Start with a 14-day free trial. No credit card required.{" "}
              Choose the plan that fits your compliance needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {PUBLIC_PRICING_PLANS.map((plan) => {
              const Icon = PLAN_ICONS[plan.id]
              const ctaLink = PLAN_CTA_LINKS[plan.id]
              const annualSavings = getAnnualSavings(plan)
              const priceDisplay = formatPrice(plan.price.monthly, plan.price.currency)
              const annualDisplay = plan.price.yearly !== null
                ? `${formatPrice(plan.price.yearly, plan.price.currency)}/year${annualSavings ? ` (${annualSavings})` : ''}`
                : 'Contact us for volume pricing'

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    plan.popular
                      ? "border-primary/50 shadow-lg shadow-primary/10"
                      : "border-border/50"
                  }`}
                >
                  {plan.badge === 'Most Popular' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        plan.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{priceDisplay}</span>
                      {plan.price.monthly !== null && plan.price.monthly > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">{annualDisplay}</p>
                    </div>

                    <ul className="flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-2">
                          <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${
                            feature.included ? "text-secondary" : "text-muted-foreground/30"
                          }`} />
                          <span className={`text-sm ${
                            feature.included ? "text-muted-foreground" : "text-muted-foreground/50 line-through"
                          }`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`mt-8 w-full ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-transparent"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href={ctaLink}>
                        {plan.cta.type !== 'none' ? plan.cta.label : 'Get Started'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Compare Plans
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Feature Comparison
            </h2>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="pb-4 text-center font-medium text-foreground">Startup</th>
                  <th className="pb-4 text-center font-medium text-primary">Business</th>
                  <th className="pb-4 text-center font-medium text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-border/50">
                    <td className="py-4 text-sm text-muted-foreground">{row.feature}</td>
                    <td className="py-4 text-center text-sm text-muted-foreground">{row.startup}</td>
                    <td className="py-4 text-center text-sm font-medium text-foreground">{row.business}</td>
                    <td className="py-4 text-center text-sm text-muted-foreground">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="mr-1 h-3 w-3" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border border-border/50 bg-card/50 px-4"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Not Sure Which Plan is Right?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Book a demo with our team and we&apos;ll help you find the perfect fit
                for your compliance needs.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <Link href="/contact">Book a Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
