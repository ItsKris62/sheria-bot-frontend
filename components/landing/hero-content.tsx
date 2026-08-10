import Link from "next/link"
import { ArrowRight, ChevronRight, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroContent() {
  return (
    <div className="flex max-w-3xl flex-col items-center text-center lg:items-start lg:text-left">
      <div className="hero-reveal inline-flex items-center rounded-full border border-brand-green/25 bg-brand-green/10 px-3 py-1 text-xs font-semibold tracking-normal text-brand-green">
        Evidence-led regulatory intelligence
      </div>

      <h1 className="hero-reveal hero-delay-1 mt-6 max-w-[11ch] text-5xl font-bold leading-[0.94] tracking-normal text-foreground text-balance sm:max-w-[12ch] sm:text-6xl lg:text-[4.75rem] xl:text-[5.35rem]">
        <span className="block">Know the regulation.</span>
        {" "}
        <span className="mt-2 block">
          Show the{" "}
          <span className="relative inline-block text-brand-green">
            evidence.
            <span
              className="absolute -inset-x-1 bottom-2 -z-10 h-3 rounded-full bg-brand-green/10 blur-md sm:bottom-3 sm:h-4"
              aria-hidden="true"
            />
          </span>
        </span>
      </h1>

      <p className="hero-reveal hero-delay-2 mt-7 max-w-2xl text-base leading-7 text-foreground-muted text-balance sm:text-lg lg:text-xl lg:leading-8">
        SheriaBot turns complex regulatory material into clear, source-backed answers
        your compliance team can verify and act on.
      </p>

      <div className="hero-reveal hero-delay-3 mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center lg:mt-10">
        <Button
          size="lg"
          asChild
          className="group h-12 rounded-xl bg-brand-green px-8 text-base font-semibold text-foreground-on-green shadow-glow-green transition-all duration-300 hover:bg-brand-green-hover hover:shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_12px_32px_-4px_rgba(34,197,94,0.42)] focus-visible:ring-brand-green/50 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
        >
          <Link href="/register">
            Join the Closed Pilot
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>

        <Button
          size="lg"
          variant="outline"
          asChild
          className="group h-12 rounded-xl border-border-strong bg-transparent px-8 text-base text-foreground transition-all duration-300 hover:border-brand-green hover:bg-brand-green/10 hover:text-brand-green focus-visible:ring-brand-green/50 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
        >
          <Link href="/pricing">
            View Pricing
            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <p className="hero-reveal hero-delay-4 mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-green/85">
        <FileText className="h-4 w-4" aria-hidden="true" />
        Source trail included. No credit card needed.
      </p>
    </div>
  )
}
