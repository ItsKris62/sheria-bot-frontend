'use client'

import React from 'react'
import { CheckCircle, BarChart3, Lock } from 'lucide-react'

export function CapabilitiesBentoGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-950 mb-4">
            Core Capabilities
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Purpose-built for regulatory intelligence with verified sources and audit-ready documentation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cited & Verified */}
          <div className="md:col-span-1 bg-white border border-zinc-200 rounded-2xl p-7 shadow-xs hover:shadow-sm hover:border-[#00875A]/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle
                size={24}
                className="text-[#00875A]"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold text-zinc-900">
                Cited, Trusted, Verifiable.
              </h3>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              Direct statutory grounding with section-level references. Every response traces back to primary law.
            </p>

            {/* Status Badge */}
            <div className="bg-[#00875A]/10 border border-[#00875A]/20 rounded-lg p-3 text-xs text-[#006844] font-medium">
              ✓ Verified with Post-Hoc Validation
            </div>
          </div>

          {/* Card 2: Automated Gap Analysis */}
          <div className="md:col-span-1 bg-white border border-zinc-200 rounded-2xl p-7 shadow-xs hover:shadow-sm hover:border-[#00875A]/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3
                size={24}
                className="text-[#00875A]"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold text-zinc-900">
                Automated Legal Gap Analysis.
              </h3>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              Upload company policies to instantly spot omitted statutory clauses and compliance gaps.
            </p>

            {/* Score Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
                <span>Compliance Score</span>
                <span className="text-[#00875A]">92%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00875A] rounded-full"
                  style={{ width: '92%' }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Audit Trails */}
          <div className="md:col-span-1 bg-white border border-zinc-200 rounded-2xl p-7 shadow-xs hover:shadow-sm hover:border-[#00875A]/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={24} className="text-[#00875A]" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-zinc-900">
                Audit Trails & Exports.
              </h3>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              Immutable compliance logs exportable to PDF/DOCX inspection packs for regulatory audits.
            </p>

            {/* Export Options */}
            <div className="space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                Timestamped Evidence Trail
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
                Multi-Format Export (PDF/DOCX)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
