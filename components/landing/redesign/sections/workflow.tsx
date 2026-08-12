"use client"

import { MessageSquare, Search, ShieldCheck, ScanLine, FileText, LayoutDashboard } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  SectionShell,
} from "@/components/landing/redesign/kit"

const steps = [
  {
    icon: MessageSquare,
    tag: "Ask",
    body: "“What regulatory requirements should we review before launch?”",
    quote: true,
  },
  {
    icon: Search,
    tag: "Research",
    body: "SheriaBot identifies the relevant regulatory materials.",
  },
  {
    icon: ShieldCheck,
    tag: "Verify",
    body: "The compliance team reviews the supporting evidence.",
  },
  {
    icon: ScanLine,
    tag: "Assess",
    body: "Existing documentation is checked for gaps.",
  },
  {
    icon: FileText,
    tag: "Prepare",
    body: "Required policies and checklists are created.",
  },
  {
    icon: LayoutDashboard,
    tag: "Track",
    body: "Compliance work becomes visible in the organization's workspace.",
  },
]

export function Workflow() {
  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="center">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">A real workflow</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            From question to compliance action.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
            A fintech wants to launch a new digital financial product. Here is
            how the work moves.
          </p>
        </Reveal>
      </div>

      <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <StaggerItem key={s.tag}>
            <div className="relative h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand-green/20 hover:bg-white/[0.045]">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/12 text-brand-green">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-2xl font-semibold text-white/[0.06]">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-green/80">
                {s.tag}
              </p>
              <p
                className={
                  s.quote
                    ? "mt-2 text-base italic leading-relaxed text-foreground"
                    : "mt-2 leading-relaxed text-foreground-muted"
                }
              >
                {s.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  )
}
