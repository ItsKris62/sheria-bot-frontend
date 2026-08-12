"use client"

import { useMemo, useState } from "react"
import { Check } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  GlassCard,
  SectionShell,
} from "@/components/landing/redesign/kit"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  label: string
  owner: string
  due: string
  done: boolean
}

const initial: Item[] = [
  { id: "a", label: "Assign responsible owner", owner: "A. Wanjiru", due: "Complete", done: true },
  { id: "b", label: "Map personal data processing", owner: "Data team", due: "Complete", done: true },
  { id: "c", label: "Review data retention policy", owner: "Legal", due: "Due in 6 days", done: false },
  { id: "d", label: "Document breach-response procedure", owner: "Security", due: "Due in 12 days", done: false },
]

export function Checklists() {
  const [items, setItems] = useState(initial)
  const progress = useMemo(
    () => Math.round((items.filter((i) => i.done).length / items.length) * 100),
    [items],
  )

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    )
  }

  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="center">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow className="justify-center">Compliance checklists</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            Turn obligations into actions your team can track.
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-14">
        <GlassCard className="mx-auto max-w-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-muted/50">
                Regulatory category
              </p>
              <h3 className="mt-1 font-heading text-xl font-semibold text-foreground">
                Data Protection
              </h3>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-semibold text-brand-green">
                {progress}%
              </p>
              <p className="text-xs text-foreground-muted">complete</p>
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="mt-6 space-y-2.5">
            {items.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => toggle(i.id)}
                  className="flex w-full items-center gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-left transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                      i.done
                        ? "border-brand-green bg-brand-green text-primary-foreground"
                        : "border-white/20 bg-transparent",
                    )}
                  >
                    {i.done && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        i.done
                          ? "text-foreground-muted line-through"
                          : "text-foreground",
                      )}
                    >
                      {i.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-foreground-muted/70">
                      {i.owner}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      i.done
                        ? "bg-brand-green/12 text-brand-green"
                        : "bg-white/[0.06] text-foreground-muted",
                    )}
                  >
                    {i.due}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>
    </SectionShell>
  )
}
