'use client'

import React from 'react'

export function AuthorityStrip() {
  const authorities = [
    { name: 'Central Bank of Kenya', short: 'CBK' },
    { name: 'Office of the Data Protection Commissioner', short: 'ODPC' },
    { name: 'Capital Markets Authority', short: 'CMA' },
    { name: 'Financial Reporting Centre', short: 'FRC' },
    { name: 'Kenya Revenue Authority', short: 'KRA' },
  ]

  return (
    <section className="bg-[#F8FAFC] border-y border-zinc-200 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold text-zinc-600 uppercase tracking-wider mb-8">
          Continuously Monitored Regulatory Frameworks & Authorities
        </h2>

        {/* Authorities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {authorities.map((auth, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-zinc-200 hover:border-[#00875A]/30 hover:bg-[#00875A]/5 transition-all"
            >
              <div className="text-xs font-bold text-zinc-900 mb-1">
                {auth.short}
              </div>
              <div className="text-xs text-zinc-600 text-center">
                {auth.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
