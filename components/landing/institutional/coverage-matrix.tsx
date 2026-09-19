'use client'

import React from 'react'
import { CheckCircle, Clock } from 'lucide-react'

export function CoverageMatrix() {
  const jurisdictions = [
    {
      flag: '🇰🇪',
      name: 'Kenya',
      status: 'Live & Fully Operational',
      live: true,
      authorities: 'CBK, ODPC, CMA, FRC',
    },
    {
      flag: '🇷🇼',
      name: 'Rwanda',
      status: 'Active Regulatory Pilot',
      live: true,
      authorities: 'BNR, NCSA, RURA',
    },
    {
      flag: '🇳🇬',
      name: 'Nigeria',
      status: 'Corpus Expansion Q4',
      live: false,
      authorities: 'CBN, NDPC, SEC',
    },
    {
      flag: '🇲🇼',
      name: 'Malawi',
      status: 'Corpus Expansion Q4',
      live: false,
      authorities: 'RBM, MACRA',
    },
  ]

  return (
    <section className="py-20 bg-[#F8FAFC] border-y border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-950 mb-4">
            Pan-African Coverage
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Anchored in Kenya with regulatory intelligence expanding across the continent.
          </p>
        </div>

        {/* Jurisdiction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jurisdictions.map((jurisdiction, idx) => (
            <div
              key={idx}
              className={`relative p-6 rounded-xl border transition-all ${
                jurisdiction.live
                  ? 'bg-white border-zinc-200 hover:border-[#00875A]/30'
                  : 'bg-white/50 border-zinc-200'
              }`}
            >
              {/* Header with Flag and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{jurisdiction.flag}</span>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {jurisdiction.name}
                  </h3>
                </div>
                {jurisdiction.live ? (
                  <CheckCircle size={20} className="text-[#00875A]" />
                ) : (
                  <Clock size={20} className="text-zinc-400" />
                )}
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-xs font-medium ${
                  jurisdiction.live
                    ? 'bg-[#00875A]/10 text-[#006844]'
                    : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {jurisdiction.live ? '✓' : '◯'} {jurisdiction.status}
              </div>

              {/* Authorities */}
              <p className="text-xs text-zinc-600 leading-relaxed">
                <span className="font-semibold block text-zinc-700 mb-2">
                  Authorities
                </span>
                {jurisdiction.authorities}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
