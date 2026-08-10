import Image from "next/image"
import { BookOpen, FileText, Search, Send } from "lucide-react"

const HERO_PORTRAIT_SRC = "/branding/sheriabot-hero-portrait.webp"

const suggestedQuestions = [
  "KYC obligations",
  "Data protection",
  "AML controls",
]

const sourceSteps = [
  { label: "Question", detail: "Plain-language search" },
  { label: "Sources", detail: "Regulatory material checked" },
  { label: "Answer", detail: "Evidence stays attached" },
]

function VisualAtmosphere() {
  return (
    <>
      <div className="hero-glow-breathe pointer-events-none absolute -inset-x-8 -inset-y-10 rounded-[48px] bg-[radial-gradient(circle_at_78%_24%,rgba(34,197,94,0.22),transparent_38%),radial-gradient(circle_at_22%_76%,rgba(245,158,11,0.10),transparent_32%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-x-10 bottom-2 h-16 rounded-[100%] bg-black/75 blur-2xl" />
    </>
  )
}

function HeroPortrait() {
  return (
    <div
      className="hero-reveal hero-delay-4 absolute bottom-0 right-[-0.5rem] z-10 hidden h-[560px] w-[398px] xl:block"
      data-hero-portrait
    >
      <div className="absolute inset-x-3 top-20 h-48 rounded-full bg-green-500/12 blur-3xl lg:top-24" />
      <div className="absolute inset-x-8 bottom-0 h-32 rounded-t-full bg-black/60 blur-2xl" />
      <Image
        src={HERO_PORTRAIT_SRC}
        alt=""
        fill
        priority
        sizes="398px"
        className="object-contain object-bottom drop-shadow-[0_30px_48px_rgba(0,0,0,0.60)] [mask-image:linear-gradient(to_bottom,black_0%,black_86%,rgba(0,0,0,0.82)_94%,transparent_100%)]"
      />
    </div>
  )
}

function SearchSurface() {
  return (
    <div className="hero-float-slow rounded-3xl border border-white/10 bg-[#060908]/88 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.58),0_0_0_1px_rgba(34,197,94,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_22px_rgba(34,197,94,0.12)]">
          <Search className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Ask SheriaBot</p>
          <p className="text-xs text-zinc-400">Search regulatory requirements with sources attached</p>
        </div>
      </div>

      <div className="group mt-4 flex min-h-[58px] items-center gap-3 rounded-2xl border border-green-500/25 bg-black/55 px-3.5 py-3 shadow-[0_0_24px_rgba(34,197,94,0.10)] transition-all duration-300 hover:border-green-500/45 hover:shadow-[0_0_32px_rgba(34,197,94,0.16)]">
        <p className="min-w-0 flex-1 text-left text-sm leading-6 text-zinc-100">
          What KYC obligations apply before onboarding customers?
        </p>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500 text-black shadow-[0_12px_28px_rgba(34,197,94,0.25)] transition-transform duration-300 motion-safe:group-hover:translate-x-0.5">
          <Send className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestedQuestions.map((question) => (
          <span
            key={question}
            className="rounded-full border border-border/70 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-zinc-300"
          >
            {question}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/18 bg-amber-500/[0.055] px-3 py-2 text-[11px] font-medium text-amber-300 sm:hidden">
        <BookOpen className="h-3.5 w-3.5" />
        Source trail appears with the answer
      </div>

      <div className="mt-5 hidden rounded-2xl border border-amber-500/18 bg-amber-500/[0.055] p-3.5 sm:block">
        <div className="mb-3 flex items-center gap-2 text-amber-300">
          <BookOpen className="h-4 w-4" />
          <p className="text-sm font-semibold text-zinc-100">Source trail preview</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {sourceSteps.map((step) => (
            <div key={step.label} className="rounded-xl border border-white/10 bg-black/28 p-2.5">
              <p className="text-xs font-semibold text-zinc-100">{step.label}</p>
              <p className="mt-1 text-[10px] leading-4 text-zinc-500">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EvidencePill() {
  return (
    <div className="hero-float-slow hero-float-late hidden items-center gap-2 rounded-full border border-green-500/25 bg-[#0A0A0A]/78 px-3 py-2 text-[11px] font-medium text-green-400 shadow-[0_18px_50px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md md:inline-flex">
      <FileText className="h-3.5 w-3.5" />
      Sources attached
    </div>
  )
}

export function HeroVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-[620px] lg:max-w-none"
      aria-hidden="true"
      data-hero-visual
    >
      <VisualAtmosphere />

      <div
        className="hero-reveal hero-delay-3 relative min-h-[390px] overflow-hidden rounded-3xl border border-[#1F2937] bg-[#020403]/95 shadow-[0_48px_140px_rgba(0,0,0,0.72),0_18px_56px_rgba(34,197,94,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[540px] lg:min-h-[620px]"
        data-hero-stage
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(34,197,94,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_42%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:58px_58px]" />

        <HeroPortrait />

        <div className="hero-reveal hero-delay-5 absolute left-4 right-4 top-8 z-30 sm:bottom-8 sm:left-7 sm:right-auto sm:top-auto sm:w-[420px] lg:bottom-10 lg:left-8 xl:w-[330px]">
          <SearchSurface />
        </div>

        <div className="hero-reveal hero-delay-7 absolute bottom-9 right-8 z-30">
          <EvidencePill />
        </div>
      </div>
    </div>
  )
}
