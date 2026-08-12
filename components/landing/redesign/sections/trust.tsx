"use client"

import { ShieldCheck, Lock, FileClock, ServerCog } from "lucide-react"
import { Eyebrow, Reveal, SectionShell, Stagger, StaggerItem, GlassCard } from "../kit"

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Grounded, not generated",
    body: "Every answer is chained to primary regulatory text. If a source cannot be cited, the assistant abstains instead of guessing.",
  },
  {
    icon: FileClock,
    title: "Point-in-time defensibility",
    body: "Each response is versioned against the law as it stood on the date you asked, so you can defend a decision made months ago.",
  },
  {
    icon: Lock,
    title: "Isolation by design",
    body: "Workspace data is tenant-isolated and encrypted in transit and at rest. Your policies and queries are never used to train shared models.",
  },
  {
    icon: ServerCog,
    title: "Audit-ready logs",
    body: "Who asked what, which sources answered, and when — captured as an immutable trail your examiners can actually follow.",
  },
]

export function TrustSection() {
  return (
    <SectionShell id="trust" atmosphere="center" className="py-24 sm:py-28">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow>16 — Trust &amp; governance</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-balance font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Built for the people who sign off on the risk.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/55">
            A regulatory assistant is only useful if you can stake your license on it. Sheria is engineered
            so that trust is verifiable, not assumed.
          </p>
        </Reveal>
      </div>

      <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <StaggerItem key={p.title}>
            <GlassCard interactive className="h-full p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-green/25 bg-brand-green/10 text-brand-green">
                <p.icon className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 text-lg font-medium text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  )
}
