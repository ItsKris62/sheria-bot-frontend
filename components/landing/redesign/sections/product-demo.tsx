"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Sparkles,
  FileText,
  ListChecks,
  Bookmark,
  Scale,
  ScanLine,
  ArrowUp,
} from "lucide-react"
import {
  Eyebrow,
  Reveal,
  LiquidGlassCard,
  SectionShell,
} from "@/components/landing/redesign/kit"
import { cn } from "@/lib/utils"

const TABS = ["Answer", "Sources", "Actions"] as const
type Tab = (typeof TABS)[number]

const answer = [
  "A payment service provider handling customer data should treat personal data as a regulated asset from day one.",
  "Establish a lawful basis for processing, minimise what you collect, and document how long each category is retained.",
  "Define access controls, breach-response procedures and a clear escalation path — and keep evidence of each decision.",
]

const sources = [
  { name: "Data Protection Act", section: "Part IV — Principles of data protection" },
  { name: "ODPC Guidance Note", section: "Data controllers & processors" },
  { name: "NPS Regulations", section: "Customer information safeguards" },
]

const actions = [
  { icon: ListChecks, label: "Generate checklist" },
  { icon: Bookmark, label: "Save query" },
  { icon: Scale, label: "Review related regulations" },
  { icon: ScanLine, label: "Run gap analysis" },
]

export function ProductDemo() {
  const [tab, setTab] = useState<Tab>("Answer")
  const reduce = useReducedMotion()

  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="right">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">Product demonstration</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            Ask the regulation. See the evidence.
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-14">
        <LiquidGlassCard className="mx-auto max-w-3xl p-5 sm:p-7">
          {/* query */}
          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-background/50 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            <p className="text-sm leading-snug text-foreground sm:text-base">
              What should a payment service provider consider when handling
              customer data?
            </p>
          </div>

          {/* tabs */}
          <div
            role="tablist"
            aria-label="Response detail"
            className="mt-5 flex gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1"
          >
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300",
                  tab === t
                    ? "text-primary-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {tab === t && (
                  <motion.span
                    layoutId="demo-tab"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </div>

          {/* panel */}
          <div className="mt-5 min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {tab === "Answer" && (
                  <div className="space-y-3">
                    {answer.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * i, duration: 0.4 }}
                        className="leading-relaxed text-foreground-muted"
                      >
                        {line}
                      </motion.p>
                    ))}
                    <p className="pt-1 text-xs text-foreground-muted/60">
                      SheriaBot supports compliance research — it does not
                      replace professional legal advice.
                    </p>
                  </div>
                )}

                {tab === "Sources" && (
                  <ul className="space-y-3">
                    {sources.map((s, i) => (
                      <motion.li
                        key={s.name}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.07 * i, duration: 0.4 }}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
                      >
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {s.name}
                          </p>
                          <p className="text-xs text-foreground-muted">
                            {s.section}
                          </p>
                        </div>
                        <span className="ml-auto rounded-full border border-brand-green/25 bg-brand-green/10 px-2 py-0.5 text-[10px] font-medium text-brand-green">
                          Verified
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {tab === "Actions" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {actions.map((a, i) => (
                      <motion.button
                        key={a.label}
                        type="button"
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * i, duration: 0.4 }}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition-all duration-300 hover:border-brand-green/25 hover:bg-white/[0.05]"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/12 text-brand-green">
                          <a.icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {a.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* footer input hint */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-background/40 px-4 py-3">
            <span className="text-sm text-foreground-muted/60">
              Ask a follow-up compliance question…
            </span>
            <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ArrowUp className="h-4 w-4" />
            </span>
          </div>
        </LiquidGlassCard>
      </Reveal>
    </SectionShell>
  )
}
