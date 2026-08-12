"use client"

import { Bell, Eye, Tags, Gauge, Users, BookOpen } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  SectionShell,
} from "@/components/landing/redesign/kit"

const steps = [
  { icon: Bell, title: "New regulatory notice detected", note: "A circular or amendment enters the pipeline." },
  { icon: Eye, title: "Reviewed", note: "The change is read and summarised in context." },
  { icon: Tags, title: "Categorized", note: "Mapped to the relevant regulatory domains." },
  { icon: Gauge, title: "Compliance impact assessed", note: "Potential effect on obligations is evaluated." },
  { icon: Users, title: "Relevant teams notified", note: "The right people see what changed and why." },
  { icon: BookOpen, title: "Knowledge base updated", note: "The change stays connected to ongoing work." },
]

export function RegChange() {
  return (
    <SectionShell id="intelligence" className="py-24 sm:py-32" atmosphere="left">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>Regulatory intelligence</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            Regulation doesn&apos;t stand still.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
            SheriaBot is designed to help teams keep regulatory intelligence
            connected to their ongoing compliance work.
          </p>
        </Reveal>
      </div>

      <Stagger className="relative mt-14 pl-2" stagger={0.12}>
        {/* vertical rail */}
        <span
          aria-hidden
          className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-green/50 via-white/10 to-transparent"
        />
        <div className="space-y-4">
          {steps.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="relative flex items-start gap-5">
                <span className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-background/80 text-brand-green backdrop-blur-xl">
                  <s.icon className="h-5 w-5" />
                </span>
                <div className="flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-500 hover:border-white/[0.14] hover:bg-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-foreground-muted/40">
                      0{i + 1}
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
                    {s.note}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </SectionShell>
  )
}
