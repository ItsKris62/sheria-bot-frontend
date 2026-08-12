"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  AFRICA_COUNTRY_PATHS,
  AFRICA_HIGHLIGHT_COUNTRIES,
  AFRICA_LIVE_COUNTRY,
  AFRICA_CAPITAL_MARKERS,
} from "@/lib/landing-africa-map"
import {
  Eyebrow,
  Reveal,
  SectionShell,
} from "@/components/landing/redesign/kit"
import { cn } from "@/lib/utils"

type CountryKey = "Kenya" | "Nigeria" | "Rwanda" | "Malawi"

const detail: Record<
  CountryKey,
  { capital: string; status: string; regulators: string[]; note: string }
> = {
  Kenya: {
    capital: "Nairobi",
    status: "Live",
    regulators: ["CBK", "ODPC", "CA", "FRC", "CMA"],
    note: "Deepest regulatory coverage — SheriaBot originates here.",
  },
  Nigeria: {
    capital: "Abuja",
    status: "Expanding",
    regulators: ["Jurisdiction-specific regulatory intelligence"],
    note: "Regulatory sources and updates for the Nigerian market.",
  },
  Rwanda: {
    capital: "Kigali",
    status: "Expanding",
    regulators: ["Jurisdiction-specific regulatory intelligence"],
    note: "Regulatory sources and updates for the Rwandan market.",
  },
  Malawi: {
    capital: "Lilongwe",
    status: "Expanding",
    regulators: ["Jurisdiction-specific regulatory intelligence"],
    note: "Regulatory sources and updates for the Malawian market.",
  },
}

export function MultiCountry() {
  const [active, setActive] = useState<CountryKey>("Kenya")
  const d = detail[active]

  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="right">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>Multi-country coverage</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            Built for the regulatory realities of African fintech.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
            Companies expanding across Africa should not have to rebuild their
            regulatory research workflow for every market.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Map */}
        <Reveal>
          <div className="relative mx-auto w-full max-w-lg">
            <svg viewBox="0 0 620 620" className="h-auto w-full" role="img" aria-label="Map of Africa highlighting SheriaBot markets">
              <g>
                {AFRICA_COUNTRY_PATHS.map((c) => {
                  const highlight = AFRICA_HIGHLIGHT_COUNTRIES.has(c.name)
                  const isActive = c.name === active
                  return (
                    <path
                      key={c.iso}
                      d={c.d}
                      className={cn(
                        "transition-all duration-500",
                        highlight ? "cursor-pointer" : "",
                      )}
                      fill={
                        isActive
                          ? "rgba(34,197,94,0.28)"
                          : highlight
                            ? "rgba(34,197,94,0.12)"
                            : "rgba(255,255,255,0.03)"
                      }
                      stroke={
                        highlight ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.06)"
                      }
                      strokeWidth={highlight ? 0.8 : 0.5}
                      onClick={
                        highlight ? () => setActive(c.name as CountryKey) : undefined
                      }
                    />
                  )
                })}
              </g>
              {AFRICA_CAPITAL_MARKERS.map((m) => {
                const isActive = m.country === active
                const isLive = m.country === AFRICA_LIVE_COUNTRY
                return (
                  <g
                    key={m.country}
                    className="cursor-pointer"
                    onClick={() => setActive(m.country as CountryKey)}
                  >
                    {isActive && (
                      <circle cx={m.x} cy={m.y} r={10} fill="rgba(34,197,94,0.18)" />
                    )}
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r={isActive ? 4.5 : 3.5}
                      fill={isLive ? "#22C55E" : "rgba(34,197,94,0.7)"}
                      stroke="#050706"
                      strokeWidth={1.2}
                    />
                    <text
                      x={m.labelX}
                      y={m.labelY}
                      textAnchor={m.labelX < m.x ? "end" : "start"}
                      className="fill-foreground font-mono"
                      style={{ fontSize: 12, fontWeight: 500 }}
                    >
                      {m.country}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </Reveal>

        {/* Panel */}
        <Reveal delay={0.1}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(detail) as CountryKey[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300",
                    active === c
                      ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
                      : "border-white/10 bg-white/[0.03] text-foreground-muted hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground">
                    {active}
                  </h3>
                  <p className="text-sm text-foreground-muted">{d.capital}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    d.status === "Live"
                      ? "bg-brand-green/15 text-brand-green"
                      : "bg-white/[0.06] text-foreground-muted",
                  )}
                >
                  {d.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
                {d.note}
              </p>

              <div className="mt-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-muted/50">
                  {active === "Kenya" ? "Regulators" : "Coverage"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {d.regulators.map((r) => (
                    <span
                      key={r}
                      className="rounded-lg border border-white/10 bg-background/50 px-3 py-1 text-sm text-foreground"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
