"use client"

import Image from "next/image"
import { Search, Compass, AlertTriangle, Network } from "lucide-react"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  SectionShell,
} from "@/components/landing/redesign/kit"

const pains = [
  {
    n: "01",
    icon: Search,
    title: "Regulation is fragmented",
    body: "Teams spend hours searching regulator websites, PDFs, circulars and legal documents just to locate what applies to them.",
  },
  {
    n: "02",
    icon: Compass,
    title: "Interpretation is difficult",
    body: "Finding the document is only the first step. Teams still need to determine what a requirement means operationally.",
  },
  {
    n: "03",
    icon: AlertTriangle,
    title: "Regulatory change creates uncertainty",
    body: "A new circular, regulation or amendment can quietly change an organization's obligations overnight.",
  },
  {
    n: "04",
    icon: Network,
    title: "Compliance knowledge does not scale",
    body: "Critical context lives in email threads, spreadsheets, outside consultants and the heads of individual employees.",
  },
]

export function Problem() {
  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="none">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Left: editorial heading + image */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>The regulatory reality</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
              Compliance teams don&apos;t have an information problem.
              <span className="block text-brand-green">
                They have a clarity problem.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground-muted">
              Regulatory obligations are scattered across legislation,
              regulations, circulars, guidelines, notices and regulator
              websites rarely in the order a team actually needs them.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="relative mt-10 aspect-[16/11] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/landing/problem-fragmented-research.png"
                alt="A risk analyst surrounded by scattered regulatory documents late at night"
                fill
                sizes="(max-width: 1024px) 90vw, 44vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* Right: pain points */}
        <Stagger className="flex flex-col gap-4">
          {pains.map((p) => (
            <StaggerItem key={p.n}>
              <div className="group relative flex gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 hover:border-white/[0.14] hover:bg-white/[0.04] sm:p-7">
                <div className="flex flex-col items-center gap-3">
                  <span className="font-mono text-xs text-foreground-muted/50">
                    {p.n}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-background/60 text-foreground-muted transition-colors duration-500 group-hover:border-brand-green/30 group-hover:text-brand-green">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <span className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-foreground-muted">
                    {p.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  )
}
