'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Lock, Shield } from 'lucide-react'

export function TrustBand() {
  return (
    <section className="py-20 bg-[#09090B] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to turn regulatory chaos into audit-ready confidence?
          </h2>

          {/* Primary CTA */}
          <div className="flex justify-center mb-12">
            <Button
              asChild
              className="bg-[#00875A] hover:bg-[#006844] text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 text-lg"
            >
              <Link href="/demo">
                Book a Personalized Demo
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>

          {/* Trust Assurances */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-[#00875A]" />
                <span className="text-sm font-medium">SOC 2 Aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={20} className="text-[#00875A]" />
                <span className="text-sm font-medium">ISO 27001 Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={20} className="text-[#00875A]" />
                <span className="text-sm font-medium">KDPA Compliant</span>
              </div>
            </div>

            {/* Data Sovereignty Notice */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-sm leading-relaxed">
              <p className="text-white/80">
                <strong className="text-white">Data Sovereignty Notice:</strong> Compliant with Kenya Data Protection Act 2019 Principles. Your data stays yours; we never train public models on proprietary uploads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
