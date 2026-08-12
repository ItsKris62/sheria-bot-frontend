"use client"

import Image from "next/image"
import {
  Eyebrow,
  Reveal,
  Stagger,
  StaggerItem,
  SectionShell,
} from "@/components/landing/redesign/kit"

const personas = [
  {
    role: "Fintech Founder",
    body: "Understand regulatory obligations before launching new products.",
    img: "/images/landing/persona-founder.png",
  },
  {
    role: "Compliance Officer",
    body: "Research requirements, assess gaps and organize evidence.",
    img: "/images/landing/persona-compliance.png",
  },
  {
    role: "Risk & Legal Teams",
    body: "Investigate regulatory questions without starting from zero.",
    img: "/images/landing/persona-risk.png",
  },
  {
    role: "Product & Operations",
    body: "Understand how regulatory requirements affect implementation.",
    img: "/images/landing/persona-product.png",
  },
]

export function Personas() {
  return (
    <SectionShell id="solutions" className="py-24 sm:py-32" atmosphere="none">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>Who SheriaBot is for</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            Built for the people who carry the regulatory weight.
          </h2>
        </Reveal>
      </div>

      <Stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p) => (
          <StaggerItem key={p.role}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.role}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {p.role}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  )
}
