"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, Search, ShieldCheck, Check, Sparkles, Scale, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/landing/redesign/kit"

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative z-10 w-full overflow-hidden">
      {/* ──────────────────────────────────────────────────────────
          1. Hero Canvas: Stark White (#FFFFFF) with #09090B Typography
          ────────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-white pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        {/* Subtle grid pattern for executive texture on white */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#09090B 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Eyebrow Pill */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#09090B] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              Regulatory Intelligence for African FinTech
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={0.06}>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-[#09090B] text-balance sm:text-6xl lg:text-7xl leading-[1.08]">
              Know what the regulation says.
              <span className="block text-zinc-500 font-semibold mt-1">
                Know what your business needs to do.
              </span>
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl font-normal leading-relaxed text-zinc-700">
              SheriaBot turns complex African financial regulations, circulars, and statutes into instant, evidence-backed answers with primary legal citations your examiners, auditors, and board can verify.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-xl bg-[#00875A] px-7 text-base font-semibold text-white shadow-[0_10px_25px_-5px_rgba(0,135,90,0.35)] transition-all duration-300 hover:bg-[#00875A]/90 hover:shadow-[0_12px_30px_-5px_rgba(0,135,90,0.45)] focus-visible:ring-2 focus-visible:ring-[#00875A]"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Ask SheriaBot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-zinc-300 bg-white px-6 text-base font-medium text-[#09090B] shadow-sm transition-all duration-300 hover:border-zinc-400 hover:bg-zinc-50"
              >
                <Link href="#product">Explore the platform</Link>
              </Button>
            </div>
          </Reveal>

          {/* Authority cues on white canvas */}
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-600 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-zinc-700" />
                Central Bank of Kenya (CBK)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-zinc-700" />
                Office of Data Protection Commissioner (ODPC)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-zinc-700" />
                Bank of Ghana (BOG) &amp; CMA
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. Transition Gradient Ramp & High-Fidelity Regulatory Inspector
             (bg-gradient-to-b from-white via-zinc-900 to-[#09090B])
          ────────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-gradient-to-b from-white via-zinc-900 to-[#09090B] pt-4 pb-20 sm:pb-28 lg:pb-36">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30, scale: 0.98 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-[#09090B]/95 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-2xl"
          >
            {/* Top highlight bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Inspector Window Chrome Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-3 sm:px-6">
              {/* Window dots & title */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#EF4444]/80 border border-[#EF4444]/30" />
                  <span className="h-3 w-3 rounded-full bg-[#F59E0B]/80 border border-[#F59E0B]/30" />
                  <span className="h-3 w-3 rounded-full bg-[#10B981]/80 border border-[#10B981]/30" />
                </div>
                <div className="hidden sm:block h-3.5 w-px bg-zinc-800" />
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                  <Scale className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-semibold text-white">Regulatory Inspector</span>
                  <span className="text-zinc-500">/</span>
                  <span className="text-zinc-400">Kenya Primary Corpus v2026.4</span>
                </div>
              </div>

              {/* Verified Status Chip (Brand Accent #00875A) */}
              <div className="flex items-center gap-2 rounded-full border border-[#00875A]/40 bg-[#00875A]/15 px-3 py-1 text-xs font-semibold text-[#00875A]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00875A] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00875A]" />
                </span>
                Verified Status: Grounded Law
              </div>
            </div>

            {/* Inspector Body */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Query Input Bar */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 sm:p-4 shadow-inner">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start sm:items-center gap-3 flex-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        Fintech Compliance Query
                      </p>
                      <p className="text-sm sm:text-base font-medium text-white">
                        Can a Digital Credit Provider (DCP) access customer phone contact lists for credit scoring or debt collection in Kenya?
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0">
                    <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                      Jurisdiction: Kenya (KE)
                    </span>
                    <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-zinc-400" />
                      Analysis: Real-Time
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Workspace: 2-Column Split (Findings + Boardroom Visual Context) */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
                {/* Column 1: Statutory Findings & Mandatory Citations */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  {/* Synthesis Label */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-zinc-400" />
                      Statutory Analysis &amp; Citations
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Confidence: 99.8% Grounded
                    </span>
                  </div>

                  {/* Finding 1: CBK Licensing Mandate */}
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition-all hover:border-zinc-700">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-semibold text-white">
                        1. Mandatory Licensing &amp; Supervisory Governance
                      </span>
                      {/* Verified Citation Badge #1 */}
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#00875A]/30 bg-[#00875A]/15 px-2.5 py-1 text-xs font-mono font-semibold text-[#00875A]">
                        <Check className="h-3 w-3" />
                        [CBK DCP Regs 2022, Reg. 4]
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                      Regulation 4(1) stipulates that no entity may conduct digital credit business without a valid license from the Central Bank of Kenya. Directors and significant shareholders must satisfy fit-and-proper vetting under the First Schedule before processing loan applications.
                    </p>
                  </div>

                  {/* Finding 2: Data Protection & Contact Scraping Prohibition */}
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition-all hover:border-zinc-700">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-semibold text-white">
                        2. Contact Harvesting &amp; Debt Harassment Prohibition
                      </span>
                      {/* Verified Citation Badge #2 */}
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#00875A]/30 bg-[#00875A]/15 px-2.5 py-1 text-xs font-mono font-semibold text-[#00875A]">
                        <Check className="h-3 w-3" />
                        [Data Protection Act 2019, S.50]
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                      Section 50 strictly prohibits unlawful processing and transmission of personal data. Scraping user address books, contacting third-party guarantors without prior consent, or using contact lists for recovery constitutes an actionable breach enforceable by the Office of the Data Protection Commissioner (ODPC).
                    </p>
                  </div>

                  {/* Compliance Actions Checklist */}
                  <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-3.5">
                    <p className="text-xs font-semibold text-zinc-300 mb-2">
                      Mandatory Next Steps for Compliance Committee:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-zinc-300" />
                        File CBK/DCP/01 License dossier
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-zinc-300" />
                        Register as Data Controller with ODPC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Nairobi Boardroom Reflection Executive Visual */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                    <Image
                      src="/images/landing/Nairobi Boardroom Reflection.png"
                      alt="Nairobi Boardroom Reflection — General Counsel reviewing African fintech regulation"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                      className="object-cover object-center"
                    />

                    {/* Gradient vignette for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Bottom overlay badge */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-lg border border-white/10 bg-black/60 p-3 backdrop-blur-md">
                        <div className="flex items-center justify-between text-xs text-zinc-300">
                          <span className="font-semibold text-white">
                            Executive Review Session
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            Nairobi Financial Centre
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug text-zinc-400">
                          Boardroom legal review with primary law cross-referenced across Central Bank directives &amp; Kenyan statutes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
