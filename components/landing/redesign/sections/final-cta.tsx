"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Reveal, Eyebrow } from "../kit"

export function FinalCta() {
  return (
    <section id="get-started" className="relative overflow-hidden py-28 sm:py-36">
      {/* editorial backdrop */}
      <div className="absolute inset-0">
        <Image
          src="/images/landing/cta-team.png"
          alt="A team of African fintech professionals collaborating in a modern office"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 500px at 50% 110%, rgba(34,197,94,0.18), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <Eyebrow className="justify-center">18 — Get started</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-6 max-w-2xl text-balance font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Stop reading the law. Start acting on it.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/60">
            Give your team a regulatory research assistant that answers with citations, keeps pace with
            change, and turns compliance from a bottleneck into an advantage.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-green px-7 text-sm font-semibold text-black shadow-[0_10px_40px_-8px_rgba(34,197,94,0.65)] transition-all hover:shadow-[0_14px_50px_-8px_rgba(34,197,94,0.85)]"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-medium text-white/80 backdrop-blur-xl transition-colors hover:border-white/25 hover:text-white"
            >
              Talk to our team
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-6 text-xs text-white/40">
            No card required · Kenya, Nigeria &amp; South Africa live · SOC 2-aligned controls
          </p>
        </Reveal>
      </div>
    </section>
  )
}
