import type { Metadata } from "next"
import { InstitutionalHeader } from "@/components/landing/institutional/header"
import { HeroSection } from "@/components/landing/institutional/hero"
import { AuthorityStrip } from "@/components/landing/institutional/authority-strip"
import { ChallengeSection } from "@/components/landing/institutional/challenge-section"
import { SolutionStepper } from "@/components/landing/institutional/solution-stepper"
import { CapabilitiesBentoGrid } from "@/components/landing/institutional/capabilities-grid"
import { CoverageMatrix } from "@/components/landing/institutional/coverage-matrix"
import { TrustBand } from "@/components/landing/institutional/trust-band"
import { InstitutionalFooter } from "@/components/landing/institutional/footer"
import { MultiCountry } from "@/components/landing/redesign/sections/multi-country"

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
    <div className="relative isolate bg-white text-zinc-950">
      <InstitutionalHeader />
      <HeroSection />
      <AuthorityStrip />
      <ChallengeSection />
      <SolutionStepper />
      <CapabilitiesBentoGrid />
      <CoverageMatrix />
      <MultiCountry />
      <TrustBand />
      <InstitutionalFooter />
    </div>
  )
}
