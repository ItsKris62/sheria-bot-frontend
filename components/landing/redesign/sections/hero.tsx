"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow, Reveal } from "@/components/landing/redesign/kit"

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
        </div>
      </div>
    </section>
  )
}
