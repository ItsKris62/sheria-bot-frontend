"use client"

import { MessageSquare, BookOpen, ShieldCheck, ScanLine, ListChecks } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  SectionShell,
} from "@/components/landing/redesign/kit"

const capabilities = [
  {
    icon: MessageSquare,
    title: "Ask",
    body: "Ask regulatory and compliance questions using natural language.",
  },
  {
    icon: BookOpen,
    title: "Understand",
    body: "Receive structured explanations grounded in relevant regulatory material.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    body: "Inspect supporting sources and regulatory evidence behind every answer.",
  },
  {
    icon: ScanLine,
    title: "Assess",
    body: "Evaluate policies, documents and compliance posture for potential gaps.",
  },
  {
    icon: ListChecks,
    title: "Act",
    body: "Turn regulatory intelligence into checklists, policies and compliance tasks.",
  },
]

export function Solution() {
  return (
    <SectionShell id="product" className="py-24 sm:py-32" atmosphere="top">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>The SheriaBot solution</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            One regulatory intelligence workspace.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
            SheriaBot brings regulatory research, evidence, compliance analysis
            and action into one connected workflow.
          </p>
        </Reveal>
      </div>

      <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.map((c, i) => (
          <StaggerItem key={c.title} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
            <div className="group relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand-green/25 hover:bg-white/[0.045]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-background/60 text-brand-green transition-all duration-500 group-hover:border-brand-green/40 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                <c.icon className="h-5 w-5" />
              </span>
              <div className="mt-5 flex items-center gap-2">
                <span className="font-mono text-[11px] text-foreground-muted/40">
                  0{i + 1}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {c.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {c.body}
              </p>
              {i < capabilities.length - 1 && (
                <span className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-4 -translate-y-1/2 translate-x-full bg-gradient-to-r from-brand-green/40 to-transparent lg:block" />
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  )
}
