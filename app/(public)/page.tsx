import type { Metadata } from "next"
import { Hero } from "@/components/landing/redesign/sections/hero"
import { Problem } from "@/components/landing/redesign/sections/problem"
import { OldWay } from "@/components/landing/redesign/sections/old-way"
import { Solution } from "@/components/landing/redesign/sections/solution"
import { ProductDemo } from "@/components/landing/redesign/sections/product-demo"
import { Evidence } from "@/components/landing/redesign/sections/evidence"
import { GapAnalysis } from "@/components/landing/redesign/sections/gap-analysis"
import { Policies } from "@/components/landing/redesign/sections/policies"
import { Checklists } from "@/components/landing/redesign/sections/checklists"
import { RegChange } from "@/components/landing/redesign/sections/reg-change"
import { MultiCountry } from "@/components/landing/redesign/sections/multi-country"
import { Personas } from "@/components/landing/redesign/sections/personas"
import { Workflow } from "@/components/landing/redesign/sections/workflow"
import { Knowledge } from "@/components/landing/redesign/sections/knowledge"
import { TrustSection } from "@/components/landing/redesign/sections/trust"
import { ComparisonSection } from "@/components/landing/redesign/sections/comparison"
import { FinalCta } from "@/components/landing/redesign/sections/final-cta"

import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "SheriaBot — AI Regulatory Intelligence for African FinTech",
  description:
    "Ask any African regulatory question and get an answer cited to primary law — with gap analysis, policies, checklists and change alerts your examiners can actually follow.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "SheriaBot — AI Regulatory Intelligence for African FinTech",
    description:
      "Answers grounded in primary African regulation. Turn compliance research from days into minutes.",
    url: absoluteUrl("/"),
    type: "website",
  },
}

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-background text-foreground">
      {/* fixed ambient field behind the whole narrative */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 700px at 15% -5%, rgba(34,197,94,0.08), transparent 60%), radial-gradient(1000px 800px at 100% 20%, rgba(34,197,94,0.05), transparent 60%)",
          }}
        />
        {/* subtle grain / vignette to keep the black from feeling flat */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* 01 */}
      <Hero />
      {/* 02 */}
      <Problem />
      {/* 03 */}
      <OldWay />
      {/* 04 */}
      <Solution />
      {/* 05 */}
      <ProductDemo />
      {/* 06 */}
      <Evidence />
      {/* 07 */}
      <GapAnalysis />
      {/* 08 */}
      <Policies />
      {/* 09 */}
      <Checklists />
      {/* 10 */}
      <RegChange />
      {/* 11 */}
      <MultiCountry />
      {/* 12 */}
      <Personas />
      {/* 13 */}
      <Workflow />
      {/* 14 */}
      <Knowledge />
      {/* 15 */}
      <TrustSection />
      {/* 17 */}
      <ComparisonSection />
      {/* 18 */}
      <FinalCta />
    </div>
  )
}
