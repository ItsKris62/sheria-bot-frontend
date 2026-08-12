"use client"

import Link from "next/link"
import { FileText, AlertOctagon, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Eyebrow,
  Reveal,
  GlassCard,
  SectionShell,
} from "@/components/landing/redesign/kit"

const frameworks = ["Data Protection", "AML / KYC", "Consumer Protection", "Cybersecurity"]

const findings = [
  {
    tone: "critical",
    icon: AlertOctagon,
    label: "Critical gap",
    body: "Missing documented escalation process",
  },
  {
    tone: "review",
    icon: AlertCircle,
    label: "Needs review",
    body: "Retention requirements require additional clarification",
  },
  {
    tone: "covered",
    icon: CheckCircle2,
    label: "Covered",
    body: "Access-control responsibilities documented",
  },
]

const toneStyles: Record<string, string> = {
  critical: "border-destructive/25 bg-destructive/[0.07] text-destructive",
  review: "border-warning/25 bg-warning/[0.07] text-warning",
  covered: "border-brand-green/25 bg-brand-green/[0.07] text-brand-green",
}

export function GapAnalysis() {
  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="none">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>Gap analysis</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
              Find the gaps before they become problems.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground-muted">
              Upload an existing compliance policy and SheriaBot reviews it
              against the regulatory frameworks you select — highlighting what is
              covered and what still needs attention.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Button
              asChild
              variant="outline"
              className="mt-8 h-11 rounded-xl border-white/15 bg-white/[0.03] px-5 font-medium text-foreground hover:border-brand-green/30 hover:bg-white/[0.06]"
            >
              <Link href="/register" className="flex items-center gap-2">
                Explore gap analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <GlassCard className="p-6 sm:p-7">
            {/* uploaded doc */}
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-background/50 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/12 text-brand-green">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Data Protection Policy.pdf
                </p>
                <p className="text-xs text-foreground-muted">Analyzing against 4 frameworks</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {frameworks.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-foreground-muted"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* findings */}
            <div className="mt-5 space-y-2.5">
              {findings.map((f) => (
                <div
                  key={f.label}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${toneStyles[f.tone]}`}
                  >
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.label}</p>
                    <p className="text-xs text-foreground-muted">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* readiness */}
            <div className="mt-5 rounded-xl border border-white/[0.08] bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Overall readiness
                </p>
                <p className="font-mono text-sm text-brand-green">72%</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-brand-green" />
              </div>
              <p className="mt-2 text-[11px] leading-snug text-foreground-muted/60">
                A product assessment to guide review — not an official regulatory
                certification.
              </p>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </SectionShell>
  )
}
