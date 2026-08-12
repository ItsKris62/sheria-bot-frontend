"use client"

import { FileText, ArrowRight, FileDown } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  GlassCard,
  SectionShell,
} from "@/components/landing/redesign/kit"

const flow = ["Regulatory requirement", "Policy workspace", "Reviewable draft", "DOCX export"]

const categories = [
  "Data Protection",
  "Information Security",
  "AML / KYC",
  "Incident Response",
  "Consumer Protection",
]

export function Policies() {
  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="none">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* preview */}
        <Reveal className="order-2 lg:order-1">
          <GlassCard className="p-6 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground-muted">
              {flow.map((f, i) => (
                <span key={f} className="flex items-center gap-2">
                  <span className={i === flow.length - 1 ? "text-brand-green" : ""}>
                    {f}
                  </span>
                  {i < flow.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-foreground-muted/40" />
                  )}
                </span>
              ))}
            </div>

            {/* mock document */}
            <div className="rounded-xl border border-white/[0.08] bg-background/60 p-5">
              <div className="flex items-center gap-2 border-b border-white/[0.07] pb-3">
                <FileText className="h-4 w-4 text-brand-green" />
                <span className="text-sm font-medium text-foreground">
                  Data Protection Policy — Draft
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-2.5 w-1/3 rounded bg-white/15" />
                <div className="h-2 w-full rounded bg-white/[0.07]" />
                <div className="h-2 w-[92%] rounded bg-white/[0.07]" />
                <div className="h-2 w-[80%] rounded bg-white/[0.07]" />
                <div className="mt-4 h-2.5 w-1/4 rounded bg-white/15" />
                <div className="h-2 w-full rounded bg-white/[0.07]" />
                <div className="h-2 w-[88%] rounded bg-white/[0.07]" />
              </div>
              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-brand-green/30 bg-brand-green/10 py-2.5 text-sm font-medium text-brand-green transition-colors hover:bg-brand-green/15"
              >
                <FileDown className="h-4 w-4" />
                Export as DOCX
              </button>
            </div>
          </GlassCard>
        </Reveal>

        {/* copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>Policies</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
              From regulatory requirements to working policies.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground-muted">
              Compliance teams often understand their obligation but still need
              operational documentation. SheriaBot helps you generate structured
              policy drafts for internal review.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-foreground-muted"
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  )
}
