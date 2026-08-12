"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  SectionShell,
} from "@/components/landing/redesign/kit"

const articles = [
  {
    category: "Regulatory Updates",
    title: "What a new circular actually changes for digital lenders",
    read: "6 min read",
    featured: true,
  },
  {
    category: "Data Protection",
    title: "Building a retention policy your team can defend",
    read: "5 min read",
  },
  {
    category: "Payments",
    title: "Handling customer data as a payment service provider",
    read: "7 min read",
  },
  {
    category: "Licensing",
    title: "Questions to answer before launching a new product",
    read: "4 min read",
  },
]

export function Knowledge() {
  return (
    <SectionShell className="py-24 sm:py-32" atmosphere="none">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Knowledge base</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
              Regulatory intelligence should remain understandable.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <Button
            asChild
            variant="outline"
            className="h-11 shrink-0 rounded-xl border-white/15 bg-white/[0.03] px-5 font-medium text-foreground hover:border-brand-green/30 hover:bg-white/[0.06]"
          >
            <Link href="/knowledge-base" className="flex items-center gap-2">
              Explore the Knowledge Base
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>

      <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {articles.map((a) => (
          <StaggerItem
            key={a.title}
            className={a.featured ? "md:col-span-3 lg:col-span-1 lg:row-span-1" : ""}
          >
            <Link
              href="/knowledge-base"
              className="group flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-brand-green/25 bg-brand-green/10 px-3 py-1 text-[11px] font-medium text-brand-green">
                  {a.category}
                </span>
                <ArrowUpRight className="h-4 w-4 text-foreground-muted/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-green" />
              </div>
              <h3 className="mt-8 font-heading text-xl font-semibold leading-snug text-foreground text-pretty">
                {a.title}
              </h3>
              <p className="mt-4 text-xs text-foreground-muted/70">{a.read}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  )
}
