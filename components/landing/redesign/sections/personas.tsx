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
    role: "Founder & Lead Developer",
    body: "Building SheriaBot to solve regulatory bottlenecks for African fintechs.",
    img: "https://pub-724936356a15494f9ce61480c5225e6f.r2.dev/branding/Christopher_rateng-Passport-Photo.jpg",
  }
]

export function Personas() {
  return (
    <SectionShell id="solutions" className="py-24 sm:py-32" atmosphere="none">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>MEET THE FOUNDER</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl">
            Built by a developer who carries the regulatory weight.
          </h2>
        </Reveal>
      </div>

      <Stagger className="mt-14 grid grid-cols-1 gap-5">
        {personas.map((p) => (
          <StaggerItem key={p.role}>
            <div className="group relative mx-auto max-w-xs h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.role}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
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
