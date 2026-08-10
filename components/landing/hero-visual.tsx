import Image from "next/image"
import { BookOpen, CheckCircle2, FileText, Scale, Search, ShieldCheck } from "lucide-react"

const HERO_PORTRAIT_SRC = "/branding/sheriabot-hero-portrait.webp"

const answerLines = [
  "Relevant obligations are summarized in plain language.",
  "Supporting sources remain attached for review.",
  "Critical decisions should still be verified.",
]

const evidenceRows = [
  { title: "Official regulation", detail: "Source on file" },
  { title: "CBK guidance", detail: "Supporting context" },
  { title: "Data protection law", detail: "Referenced source" },
]

function VisualAtmosphere() {
  return (
    <>
      <div className="hero-glow-breathe pointer-events-none absolute -inset-x-8 -inset-y-10 rounded-[48px] bg-[radial-gradient(circle_at_70%_26%,rgba(34,197,94,0.20),transparent_38%),radial-gradient(circle_at_20%_78%,rgba(245,158,11,0.10),transparent_30%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-x-10 bottom-2 h-16 rounded-[100%] bg-black/75 blur-2xl" />
    </>
  )
}

function HeroPortrait() {
  return (
    <div
      className="hero-reveal hero-delay-4 absolute right-[-4.75rem] top-[5.25rem] z-10 h-[356px] w-[252px] sm:bottom-0 sm:right-0 sm:top-auto sm:h-[455px] sm:w-[318px] md:right-8 md:h-[480px] md:w-[340px] lg:right-7 lg:h-[560px] lg:w-[398px] xl:right-10"
      data-hero-portrait
    >
      <div className="absolute inset-x-4 top-16 h-44 rounded-full bg-green-500/12 blur-3xl sm:top-20 lg:top-24" />
      <div className="absolute inset-x-6 bottom-0 h-32 rounded-t-full bg-black/55 blur-2xl" />
      <Image
        src={HERO_PORTRAIT_SRC}
        alt=""
        fill
        priority
        sizes="(max-width: 640px) 240px, (max-width: 1024px) 340px, 398px"
        className="object-contain object-bottom drop-shadow-[0_28px_46px_rgba(0,0,0,0.58)] [mask-image:linear-gradient(to_bottom,black_0%,black_86%,rgba(0,0,0,0.82)_94%,transparent_100%)]"
      />
    </div>
  )
}

function QueryCard() {
  return (
    <div className="hero-float-slow rounded-2xl border border-white/10 bg-[#0A0A0A]/82 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md sm:p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-green-400">
          <Search className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Ask SheriaBot</p>
          <p className="text-[11px] text-zinc-400">Compliance Query</p>
        </div>
      </div>
      <div className="rounded-xl border border-border/70 bg-background/90 px-3.5 py-3 text-xs leading-5 text-zinc-200 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
        What KYC obligations apply before onboarding customers?
      </div>
    </div>
  )
}

function AnswerCard() {
  return (
    <div className="hero-float-slow hero-float-offset rounded-2xl border border-white/10 bg-[#020403]/96 p-3 shadow-[0_32px_90px_rgba(0,0,0,0.66),0_0_0_1px_rgba(34,197,94,0.05),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border/40 pb-2 sm:mb-4 sm:pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400 sm:h-8 sm:w-8">
            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Evidence-backed answer</p>
            <p className="text-[10px] text-zinc-500">Regulatory Intelligence</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-green-500/30 bg-green-500/10 px-2 py-1 text-[10px] font-medium text-green-400 sm:inline-flex">
          Sources attached
        </span>
      </div>

      <div className="space-y-2 sm:space-y-2.5">
        {answerLines.map((line) => (
          <div key={line} className="flex items-start gap-2.5 text-[11px] leading-4 text-zinc-300 sm:text-xs sm:leading-5">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EvidenceCard() {
  return (
    <div className="hero-float-slow hero-float-late rounded-2xl border border-amber-500/20 bg-[#0A0A0A]/84 p-4 shadow-[0_26px_74px_rgba(0,0,0,0.50),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md">
      <div className="mb-3 flex items-center gap-2">
        <Scale className="h-4 w-4 text-amber-400" />
        <p className="text-sm font-semibold text-white">Source trail</p>
      </div>
      <div className="space-y-2.5">
        {evidenceRows.map((source) => (
          <div
            key={source.title}
            className="flex items-start gap-2.5 rounded-xl border border-amber-500/15 bg-amber-500/[0.06] p-2.5"
          >
            <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-100">{source.title}</p>
              <p className="text-[10px] text-zinc-500">{source.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EvidencePill() {
  return (
    <div className="hero-float-slow hero-float-late inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-[#0A0A0A]/78 px-3 py-2 text-[11px] font-medium text-green-400 shadow-[0_18px_50px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
      <FileText className="h-3.5 w-3.5" />
      Cited evidence
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
        className="hero-reveal hero-delay-3 relative min-h-[440px] overflow-hidden rounded-2xl border border-[#1F2937] bg-[#020403]/95 shadow-[0_48px_140px_rgba(0,0,0,0.72),0_18px_56px_rgba(34,197,94,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[540px] lg:min-h-[620px]"
        data-hero-stage
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(34,197,94,0.17),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_38%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:54px_54px]" />

        <HeroPortrait />

        <div className="absolute left-4 right-4 top-5 z-20 flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-md border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] text-zinc-500">
            app.sheriabot.com/startup/compliance-query
          </div>
        </div>

        <div className="hero-reveal hero-delay-5 absolute left-4 top-24 z-30 w-[68%] max-w-[360px] sm:left-7 sm:w-[360px] lg:left-8 lg:top-28">
          <QueryCard />
        </div>

        <div className="hero-reveal hero-delay-6 absolute bottom-8 left-4 right-4 z-40 sm:left-auto sm:right-7 sm:w-[390px] lg:right-8 lg:bottom-10 lg:w-[420px]">
          <AnswerCard />
        </div>

        <div className="hero-reveal hero-delay-7 absolute bottom-9 left-8 z-30 hidden w-[300px] lg:block">
          <EvidenceCard />
        </div>

        <div className="hero-reveal hero-delay-7 absolute right-6 top-[230px] z-30 hidden sm:block lg:hidden">
          <EvidencePill />
        </div>
      </div>
    </div>
  )
}
