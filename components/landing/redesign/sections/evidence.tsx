"use client"

import { MessageSquareQuote, FileText, Highlighter, ListChecks } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  SectionShell,
} from "@/components/landing/redesign/kit"

const chain = [
  {
    icon: MessageSquareQuote,
    label: "Regulatory answer",
    body: "A structured, plain-language response to the compliance question.",
  },
  {
    icon: FileText,
    label: "Source document",
    body: "The regulatory material the answer draws from, kept visible.",
  },
  {
    icon: Highlighter,
    label: "Relevant section",
    body: "The specific passage that supports the response.",
  },
  {
    icon: ListChecks,
    label: "Compliance action",
    body: "The obligation translated into something the team can do.",
  },
]

const labels = [
  "Evidence-backed",
  "Source-aware",
  "Regulatory document references",
  "Human-review friendly",
]

export function Evidence() {
  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="left">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>Evidence-led by design</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            Answers are more useful when you can inspect the evidence.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
            Regulatory guidance should not become a black box. SheriaBot keeps
            supporting sources visible so teams can inspect where important
            information comes from.
          </p>
        </Reveal>
      </div>

      {/* connected chain */}
      <Stagger className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-4" stagger={0.14}>
        {chain.map((c, i) => (
          <StaggerItem key={c.label} className="relative">
            <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/12 text-brand-green">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground-muted/50">
                Step 0{i + 1}
              </p>
              <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
                {c.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {c.body}
              </p>
            </div>
            {i < chain.length - 1 && (
              <>
                {/* horizontal connector (desktop) */}
                <span className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-4 -translate-y-1/2 translate-x-full items-center bg-gradient-to-r from-brand-green/50 to-transparent md:block" />
                {/* vertical connector (mobile) */}
                <span className="pointer-events-none absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 translate-y-full bg-gradient-to-b from-brand-green/50 to-transparent md:hidden" />
              </>
            )}
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {labels.map((l) => (
            <span
              key={l}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-foreground-muted"
            >
              {l}
            </span>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  )
}
