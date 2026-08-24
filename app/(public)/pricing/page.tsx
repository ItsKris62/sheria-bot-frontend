import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, HelpCircle } from "lucide-react"

import { PricingSection } from "@/components/landing/pricing-section"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PLAN_COMPARISON_ROWS } from "@/lib/config/plans"
import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Pricing & Compliance Plans | SheriaBot",
  description:
    "Transparent compliance plans for fintech startups, growing businesses, and enterprise financial institutions in Kenya. 14-day free trial.",
  alternates: {
    canonical: absoluteUrl("/pricing"),
  },
  openGraph: {
    title: "Pricing & Compliance Plans | SheriaBot",
    description:
      "Transparent compliance plans for fintech startups, growing businesses, and enterprise financial institutions in Kenya. 14-day free trial.",
    url: absoluteUrl("/pricing"),
  },
}

const faqs = [
  {
    question: "Can I pay annually?",
    answer: "Yes. Annual pricing is available for Startup and Business and is shown by the billing selector above.",
  },
  {
    question: "Is there a free trial?",
    answer: "The current plan configuration includes a 14-day trial for Startup and Business.",
  },
  {
    question: "How many users are included?",
    answer: "Startup includes 1 seat, Business includes 6 total seats, and Enterprise is configured with unlimited seats.",
  },
  {
    question: "What are the usage limits?",
    answer: "Limits are shown directly in each plan's included capabilities and in the comparison table, including checklist generations, API calls, seats, and storage.",
  },
  {
    question: "What is included with Enterprise?",
    answer: "Enterprise includes the Business capabilities plus policy generation, legal corpus management, unlimited API access, custom integrations and SSO, on-premise deployment options, and a 99.9% uptime SLA guarantee.",
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col bg-[#050706]">
      <PricingSection />

      <section className="relative overflow-hidden border-b border-[#1D2925] bg-[#050706] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="mb-4 border-[#1D2925] bg-[#0D1411] text-[#B8C0BC]"
            >
              Compare Plans
            </Badge>
            <h2 className="text-3xl font-bold text-[#F5F7F6]">
              Compliance capability by plan
            </h2>
          </div>

          <div className="mt-12 overflow-x-auto rounded-[28px] border border-white/[0.08] bg-white/[0.035] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-[#1D2925]">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-[#B8C0BC]">
                    Feature
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-[#F5F7F6]">
                    Startup
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-[#1ED760]">
                    Business
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-[#D8B76E]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-[#1D2925]/70 last:border-b-0">
                    <td className="px-6 py-4 text-sm text-[#B8C0BC]">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-sm text-[#7F8A85]">
                      {row.startup}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-[#F5F7F6]">
                      {row.business}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-[#B8C0BC]">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#050706] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="mb-4 border-[#1D2925] bg-[#0D1411] text-[#B8C0BC]"
            >
              <HelpCircle className="mr-1 h-3 w-3" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold text-[#F5F7F6]">
              Questions before you start
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="rounded-[22px] border border-white/[0.08] bg-white/[0.035] px-5 backdrop-blur-xl transition-colors data-[state=open]:border-[#1ED760]/30 data-[state=open]:bg-[#1ED760]/[0.05]"
                >
                  <AccordionTrigger className="text-left font-semibold text-[#F5F7F6] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-7 text-[#B8C0BC]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1D2925] bg-[#080D0B] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden rounded-[30px] border-white/[0.1] bg-[radial-gradient(circle_at_top,rgba(30,215,96,0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_40px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <CardContent className="p-10 text-center sm:p-14">
              <h2 className="text-3xl font-bold text-[#F5F7F6]">
                Not sure which plan is right?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-[#B8C0BC]">
                Book a demo and we will map your compliance maturity, workflows, and
                rollout needs to the right plan.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="rounded-2xl bg-[#1ED760] font-bold text-[#06110A] hover:bg-[#33E875]"
                >
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-2xl border-[#27342F] bg-transparent text-[#F5F7F6] hover:border-[#1ED760]/50 hover:bg-[#122018]"
                >
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
