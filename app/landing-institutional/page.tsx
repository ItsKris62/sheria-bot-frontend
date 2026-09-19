'use client'

import React from 'react'
import { InstitutionalHeader } from '@/components/landing/institutional/header'
import { HeroSection } from '@/components/landing/institutional/hero'
import { AuthorityStrip } from '@/components/landing/institutional/authority-strip'
import { ChallengeSection } from '@/components/landing/institutional/challenge-section'
import { SolutionStepper } from '@/components/landing/institutional/solution-stepper'
import { CapabilitiesBentoGrid } from '@/components/landing/institutional/capabilities-grid'
import { CoverageMatrix } from '@/components/landing/institutional/coverage-matrix'
import { TrustBand } from '@/components/landing/institutional/trust-band'
import { InstitutionalFooter } from '@/components/landing/institutional/footer'

export default function InstitutionalLanding() {
  return (
    <div className="relative isolate bg-white text-zinc-950">
      {/* Hero & Authority */}
      <InstitutionalHeader />
      <HeroSection />
      <AuthorityStrip />
      
      {/* The Problem & Solution Narrative */}
      <ChallengeSection />
      <SolutionStepper />
      
      {/* Product Proof & Capabilities */}
      <CapabilitiesBentoGrid />
      
      {/* Pan-African Reach */}
      <CoverageMatrix />
      
      {/* Trust & Data Sovereignty */}
      <TrustBand />
      
      {/* Footer */}
      <InstitutionalFooter />
    </div>
  )
}
