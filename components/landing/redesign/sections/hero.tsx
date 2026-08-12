"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, ShieldCheck, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow, Reveal } from "@/components/landing/redesign/kit"

const sources = [
  { name: "Data Protection Act", ref: "Part IV — Data Processing" },
  { name: "CBK Prudential Guidelines", ref: "Digital Credit Providers" },
  { name: "NPS Regulations", ref: "Licensing & Authorisation" },
]

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 lg:pt-28 lg:pb-32">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 560px at 78% 8%, rgba(34,197,94,0.14), transparent 62%), radial-gradient(900px 500px at 10% 100%, rgba(34,197,94,0.06), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(680px 420px at 75% 12%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(680px 420px at 75% 12%, black, transparent 75%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8">
        {/* Left — narrative */}
        <div>
          <Reveal>
            <Eyebrow>Regulatory intelligence for African fintech</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.04] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              Know what the regulation says.
              <span className="block text-foreground-muted">
                Know what your business needs to do.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
              SheriaBot turns complex regulatory information into evidence-backed
              answers, compliance actions, policy guidance and ongoing regulatory
              intelligence for fintech teams operating across Africa.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-12 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[0_0_28px_rgba(34,197,94,0.28)] transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Ask SheriaBot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-6 text-base font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
              >
                <Link href="#product">Explore the platform</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-8 flex items-center gap-2 text-sm text-foreground-muted/80">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              Built for fintech, compliance, risk and regulatory teams.
            </p>
          </Reveal>
        </div>

        {/* Right — layered liquid glass product composition */}
        <div className="relative">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[26px] border border-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]"
          >
            <Image
              src="/images/landing/hero-compliance-officer.png"
              alt="Compliance professional reviewing a regulatory document"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </motion.div>

          {/* Floating query panel */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className={reduce ? "" : "animate-float"}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="absolute -left-4 top-8 w-[70%] max-w-xs rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] sm:-left-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted/70">
                Compliance query
              </p>
              <p className="mt-2 text-sm leading-snug text-foreground">
                What licensing obligations apply before launching a digital
                lending product?
              </p>
            </div>
          </motion.div>

          {/* Floating evidence panel */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            <div className="absolute -right-3 bottom-6 w-[76%] max-w-[19rem] rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] sm:-right-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-2.5 py-1 text-[10px] font-medium text-brand-green">
                  <ShieldCheck className="h-3 w-3" />
                  Source verified
                </span>
              </div>
              <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-foreground-muted/70">
                Based on applicable regulatory sources
              </p>
              <ul className="mt-2.5 space-y-2">
                {sources.map((s) => (
                  <li key={s.name} className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green/80" />
                    <span className="text-xs leading-tight text-foreground">
                      {s.name}
                      <span className="block text-[11px] text-foreground-muted/70">
                        {s.ref}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-2.5 text-[11px] text-foreground-muted/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-green" />
                Regulatory evidence attached
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
