'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SolutionStepper() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      number: 1,
      title: 'Monitor',
      description: 'Automated scanning of official regulatory gazettes and statutory updates.',
    },
    {
      number: 2,
      title: 'Analyze',
      description: 'Extracting binding obligations vs recommendations with precision.',
    },
    {
      number: 3,
      title: 'Guide',
      description: 'Actionable roadmaps vetted against primary law.',
    },
    {
      number: 4,
      title: 'Act',
      description: 'Internal policy gap audits and compliance task assignment.',
    },
    {
      number: 5,
      title: 'Prove',
      description: 'Exportable, timestamped audit defense trails.',
    },
  ]

  return (
    <section className="py-20 bg-[#F8FAFC] border-y border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-950 mb-4">
            From Update to Action. All in One Place.
          </h2>
        </div>

        {/* Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <button
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'relative flex flex-col items-center p-6 rounded-xl transition-all cursor-pointer',
                  activeStep === idx
                    ? 'bg-white border-2 border-[#00875A] shadow-lg'
                    : 'bg-white border border-zinc-200 hover:border-[#00875A]/50 hover:bg-[#00875A]/5'
                )}
              >
                {/* Step Number */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3 transition-all',
                    activeStep === idx
                      ? 'bg-[#00875A] text-white'
                      : 'bg-zinc-200 text-zinc-700'
                  )}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    'text-sm font-semibold mb-2 transition-colors',
                    activeStep === idx ? 'text-[#00875A]' : 'text-zinc-700'
                  )}
                >
                  {step.title}
                </h3>

                {/* Description (visible on active only) */}
                {activeStep === idx && (
                  <p className="text-xs text-zinc-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                )}
              </button>

              {/* Arrow between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight
                    size={20}
                    className={cn(
                      'transition-colors',
                      activeStep >= idx ? 'text-[#00875A]' : 'text-zinc-300'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Description Box (Mobile) */}
        <div className="mt-8 md:hidden bg-[#00875A]/10 border border-[#00875A]/30 rounded-lg p-6">
          <p className="text-sm text-zinc-700 leading-relaxed">
            {steps[activeStep].description}
          </p>
        </div>
      </div>
    </section>
  )
}
