'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, CheckCircle } from 'lucide-react'

export function HeroSection() {
  const trustPoints = [
    { icon: '✓', label: 'Statutory Precision' },
    { icon: '✓', label: 'Primary Source Verified' },
    { icon: '✓', label: 'In-Country Data Sovereignty' },
  ]

  const sources = [
    { name: 'Central Bank of Kenya Act (Cap 491)', verified: true },
    { name: 'Kenya Gazette Vol. CXXIV', verified: true },
  ]

  return (
    <section className="relative pt-32 pb-16 bg-white overflow-hidden">
      {/* Grid texture background (subtle) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #00875A 1px, transparent 1px), linear-gradient(0deg, #00875A 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Dark Slate Copy Container */}
          <div className="rounded-2xl bg-[#09090B] p-8 sm:p-12 text-white">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00875A]/15 border border-[#00875A]/30 mb-6">
              <Shield size={16} className="text-[#00875A]" />
              <span className="text-xs font-semibold text-[#00875A]">
                Built for African FinTechs
              </span>
            </div>

            {/* H1 with Emerald Highlight */}
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Turn regulatory updates into{' '}
              <span className="text-[#00875A]">action.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              SheriaBot monitors statutes, curates trusted insights, and helps compliance teams act with confidence—grounded strictly in primary African legislation.
            </p>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                asChild
                className="bg-[#00875A] hover:bg-[#006844] text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2"
              >
                <Link href="/demo">
                  Book a personalized demo
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg"
              >
                <Link href="/platform">Explore the platform</Link>
              </Button>
            </div>

            {/* Micro-trust signals */}
            <div className="space-y-3">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-[#00875A]" />
                  <span className="text-sm font-medium text-white/80">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Product Proof Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#F8FAFC] border-b border-zinc-200 px-6 py-4">
              <h3 className="text-sm font-semibold text-zinc-900">
                Sample Query
              </h3>
            </div>

            {/* Query Box */}
            <div className="p-6 space-y-6">
              {/* User Query */}
              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                <p className="text-sm text-zinc-700 font-medium">
                  "What are the capital and data residency requirements for Digital Credit Providers under CBK?"
                </p>
              </div>

              {/* AI Response with Citations */}
              <div className="space-y-4">
                <p className="text-sm text-zinc-700 leading-relaxed">
                  <strong>Response:</strong> Digital Credit Providers must maintain minimum capital of KES 50M and store all customer data within Kenya.
                </p>

                {/* Citation Chips */}
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#00875A]/10 border border-[#00875A]/20 rounded text-xs font-mono text-[#006844]">
                    <CheckCircle size={12} className="text-[#00875A]" />
                    CBK DCP Regs 2022, Reg. 4
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#00875A]/10 border border-[#00875A]/20 rounded text-xs font-mono text-[#006844]">
                    <CheckCircle size={12} className="text-[#00875A]" />
                    Data Protection Act 2019, S.50
                  </div>
                </div>
              </div>

              {/* Verified Sources Strip */}
              <div className="border-t border-zinc-200 pt-4">
                <p className="text-xs font-semibold text-zinc-500 mb-3 uppercase">Verified Sources</p>
                <div className="space-y-2">
                  {sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-zinc-600"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                      {source.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
