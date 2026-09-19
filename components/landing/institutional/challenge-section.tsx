'use client'

import React from 'react'
import {
  AlertTriangle,
  AlertCircle,
  Layers,
  Clock,
} from 'lucide-react'

export function ChallengeSection() {
  const challenges = [
    {
      icon: AlertTriangle,
      title: 'Information Overload',
      description:
        'Scattered gazettes and circulars; constant risk of statutory default.',
    },
    {
      icon: AlertCircle,
      title: 'Source Uncertainty',
      description:
        'Generic AI hallucinations creating severe boardroom and legal exposure.',
    },
    {
      icon: Layers,
      title: 'Siloed Workflows',
      description:
        'Disconnected legal memos, email threads, and manual spreadsheets.',
    },
    {
      icon: Clock,
      title: 'Audit Pressure',
      description:
        'Weeks of scramble to assemble audit-ready evidentiary proof for regulators.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-950 mb-4">
            Fragmented Work. Rising Risk.
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Africa's digital economy processes trillions in transactions, but regulators take 6–18 months to issue clear frameworks. Compliance teams burn 40+ hours a month, risking multi-million shilling penalties.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {challenges.map((challenge, idx) => {
            const Icon = challenge.icon
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 p-6 rounded-xl shadow-xs hover:shadow-sm hover:border-[#00875A]/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon
                      size={24}
                      className="text-[#00875A]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
