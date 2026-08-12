"use client"

import { ArrowDown, X, Check } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  GlassCard,
  SectionShell,
} from "@/components/landing/redesign/kit"

const without = [
  "Search multiple regulator websites",
  "Download regulatory PDFs",
  "Search hundreds of pages",
  "Interpret the requirements",
  "Compare internal policies",
  "Build tracking spreadsheets",
  "Track changes manually",
  "Repeat, every quarter",
]

const withUs = [
  { step: "Ask", note: "Pose the question in plain language" },
  { step: "Verify", note: "Inspect the supporting sources" },
  { step: "Understand", note: "See what the requirement means" },
  { step: "Act", note: "Turn it into checklists and policies" },
  { step: "Monitor", note: "Stay connected to regulatory change" },
]

export function OldWay() {
  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="center">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">The cost of the old way</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl">
            The traditional compliance workflow was not designed for the speed
            of fintech.
          </h2>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* Without */}
        <Reveal>
          <div className="h-full rounded-3xl border border-white/[0.07] bg-white/[0.015] p-7 sm:p-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-destructive/25 bg-destructive/10 text-destructive">
                <X className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Without SheriaBot
              </h3>
            </div>
            <ol className="mt-6 space-y-1">
              {without.map((item, i) => (
                <li key={item}>
                  <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground-muted">
                    <span className="font-mono text-[11px] text-foreground-muted/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </div>
                  {i < without.length - 1 && (
                    <ArrowDown className="ml-4 h-3.5 w-3.5 text-foreground-muted/25" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* With */}
        <Reveal delay={0.12}>
          <GlassCard glow className="h-full p-7 sm:p-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-green/30 bg-brand-green/10 text-brand-green">
                <Check className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                With SheriaBot
              </h3>
            </div>
            <Stagger className="mt-6 space-y-3" stagger={0.12}>
              {withUs.map((item, i) => (
                <StaggerItem key={item.step}>
                  <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/15 font-mono text-xs font-semibold text-brand-green">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-heading text-base font-semibold text-foreground">
                        {item.step}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        {item.note}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </GlassCard>
        </Reveal>
      </div>
    </SectionShell>
  )
}
