"use client"

import { Check, X, Minus } from "lucide-react"
import { Eyebrow, Reveal, SectionShell, GlassCard } from "../kit"
import { cn } from "@/lib/utils"

type Cell = "yes" | "no" | "partial"

const COLUMNS = ["Sheria", "General AI chatbots", "Manual research"]

const ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: "Answers cited to primary African regulation", cells: ["yes", "no", "yes"] },
  { label: "Point-in-time / historical versions of the law", cells: ["yes", "no", "partial"] },
  { label: "Abstains when no source supports the answer", cells: ["yes", "no", "yes"] },
  { label: "Multi-country coverage in one workspace", cells: ["yes", "partial", "no"] },
  { label: "Turns findings into policies & checklists", cells: ["yes", "partial", "no"] },
  { label: "Alerts you when a rule changes", cells: ["yes", "no", "no"] },
  { label: "Audit-ready trail for examiners", cells: ["yes", "no", "partial"] },
  { label: "Minutes, not days, per question", cells: ["yes", "yes", "no"] },
]

function CellMark({ v }: { v: Cell }) {
  if (v === "yes")
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-green/15 text-brand-green ring-1 ring-brand-green/30">
        <Check className="h-4 w-4" strokeWidth={2.4} />
      </span>
    )
  if (v === "partial")
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/10 text-amber-300/90 ring-1 ring-amber-300/25">
        <Minus className="h-4 w-4" strokeWidth={2.4} />
      </span>
    )
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04] text-white/25 ring-1 ring-white/10">
      <X className="h-4 w-4" strokeWidth={2.2} />
    </span>
  )
}

export function ComparisonSection() {
  return (
    <SectionShell id="comparison" atmosphere="right" className="py-24 sm:py-28">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow>17 — Why Sheria</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-balance font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            The difference is where the answer comes from.
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-12">
        <GlassCard className="overflow-hidden">
          {/* header row */}
          <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] items-end gap-2 border-b border-white/10 px-5 py-5 sm:px-7">
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">
              Capability
            </span>
            {COLUMNS.map((c, i) => (
              <span
                key={c}
                className={cn(
                  "text-center text-xs font-semibold sm:text-sm",
                  i === 0 ? "text-brand-green" : "text-white/50",
                )}
              >
                {c}
              </span>
            ))}
          </div>

          {/* body */}
          <div className="divide-y divide-white/[0.06]">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1.6fr_repeat(3,1fr)] items-center gap-2 px-5 py-4 transition-colors hover:bg-white/[0.03] sm:px-7"
              >
                <span className="text-sm text-pretty text-white/75">{row.label}</span>
                {row.cells.map((cell, i) => (
                  <div key={i} className="flex justify-center">
                    <CellMark v={cell} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>
    </SectionShell>
  )
}
