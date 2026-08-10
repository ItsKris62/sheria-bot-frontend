"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AmbientSection } from "@/components/landing/ambient-section"
import { HomeHero } from "@/components/landing/home-hero"
import { ComplianceEvidenceSection } from "@/components/landing/compliance-evidence-section"
import {
  AFRICA_CAPITAL_MARKERS,
  AFRICA_COUNTRY_PATHS,
  AFRICA_HIGHLIGHT_COUNTRIES,
  AFRICA_LIVE_COUNTRY,
} from "@/lib/landing-africa-map"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  ArrowRight,
  BookOpen,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileDown,
  Sparkles,
  Quote,
} from "lucide-react"

/* ──────────────────────────────────────────────────────────
   Data: Feature modals (preserved from original)
   ────────────────────────────────────────────────────────── */

const modalData = {
  "zero-hallucinations": {
    title: "Zero Hallucinations. Just Law.",
    body: "AI is only useful if you can trust it. Every time SheriaBot answers a compliance question, it provides direct, clickable citations mapping back to the exact section, act, and year of the Kenya Gazette. Verify everything instantly.",
    cta: "See How It Works",
    href: "/pricing",
  },
  "gap-analysis": {
    title: "Automated Legal Gap Analysis",
    body: "Upload your existing Terms of Service or Privacy Policy. Our agentic RAG system acts like a senior compliance officer, cross-referencing your documents against Kenyan law and highlighting exact clauses that leave you legally exposed.",
    cta: "Audit Your Documents",
    href: "/register",
  },
  "tailored-checklists": {
    title: "Instantly Generate Compliant Checklists",
    body: "Stop paying massive retainer fees for standard compliance documents. SheriaBot asks you a few simple questions about your business model and instantly generates tailored compliance checklists that strictly adhere to the latest CBK and ODPC guidelines.",
    cta: "Start Generating Checklists",
    href: "/register",
  },
  "audit-exports": {
    title: "Export Audit-Ready Reports",
    body: "Turn your compliance analysis outputs into shareable, professional reports. Export cited answers, gap analysis results, and checklists as DOCX or PDF documents ready for board review, investor due diligence, or regulatory submission.",
    cta: "Start Your Trial",
    href: "/register",
  },
}

/* ──────────────────────────────────────────────────────────
   Data: Feature cards
   ────────────────────────────────────────────────────────── */

const features = [
  {
    id: "zero-hallucinations",
    icon: BookOpen,
    title: "Zero Hallucinations.",
    description:
      "Every SheriaBot answer comes with cited regulatory sources and source context. No generic AI guesses — just verifiable Kenyan law, mapped to the exact act, section, and year.",
    badge: "Cited Sources",
    size: "large" as const,
  },
  {
    id: "gap-analysis",
    icon: Upload,
    title: "Instant Gap Analysis.",
    description:
      "Upload a policy document and instantly identify missing regulatory obligations. Get a compliance score, red/green status indicators, and a prioritized gap count.",
    size: "medium" as const,
  },
  {
    id: "tailored-checklists",
    icon: FileText,
    title: "Tailored Checklists.",
    description:
      "Generate compliance requirements based on your product type, growth stage, and services offered. From Digital Credit Provider to PSP — each checklist maps to your reality.",
    size: "medium" as const,
  },
  {
    id: "audit-exports",
    icon: FileDown,
    title: "Audit-Ready Exports.",
    description:
      "Turn analysis outputs into shareable compliance reports. Export cited answers, gap results, and checklists as professional DOCX or PDF documents for board review or regulatory submission.",
    size: "medium" as const,
  },
]

/* ──────────────────────────────────────────────────────────
   Data: Regulatory frameworks
   ────────────────────────────────────────────────────────── */

const regulatoryFrameworks = [
  { name: "CBK Prudential Guidelines", icon: "§" },
  { name: "Data Protection Act (2019)", icon: "🛡" },
  { name: "NPS Act & Regulations", icon: "⚖" },
  { name: "Proceeds of Crime & AML Act", icon: "🔍" },
]

/* ──────────────────────────────────────────────────────────
   Data: Pan-African roadmap
   ────────────────────────────────────────────────────────── */

const roadmapMarkets = [
  {
    name: "Nairobi (Kenya)",
    status: "Live Pilot",
    capital: "Nairobi",
    live: true,
  },
  {
    name: "Nigeria",
    status: "Pending rollout",
    capital: "Abuja",
    live: false,
  },
  {
    name: "Rwanda",
    status: "Pending rollout",
    capital: "Kigali",
    live: false,
  },
  {
    name: "Malawi",
    status: "Pending rollout",
    capital: "Lilongwe",
    live: false,
  },
]

/* ──────────────────────────────────────────────────────────
   Interaction helpers (preserved from original)
   ────────────────────────────────────────────────────────── */

function useParallax() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (!ref.current) return
      const elements = ref.current.querySelectorAll("[data-parallax]")
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const speed = Number.parseFloat(el.getAttribute("data-parallax") || "0.5")
        const yPos = (window.innerHeight - rect.top) * speed * 0.1
        const element = el as HTMLElement

        if (element.hasAttribute("data-ambient-layer")) {
          element.style.setProperty("--parallax-y", `${yPos}px`)
        } else {
          element.style.transform = `translateY(${yPos}px)`
        }
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!ref.current || event.pointerType === "touch") return

      const target = event.target as Element | null
      const section = target?.closest("[data-ambient-section]") as HTMLElement | null
      if (!section) return

      const rect = section.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      const driftX = (x - 50) / 50
      const driftY = (y - 50) / 50

      section.style.setProperty("--mouse-x", `${x}%`)
      section.style.setProperty("--mouse-y", `${y}%`)
      section.style.setProperty("--drift-x", driftX.toFixed(3))
      section.style.setProperty("--drift-y", driftY.toFixed(3))
      section.style.setProperty("--drift-x-px", `${(driftX * 8).toFixed(2)}px`)
      section.style.setProperty("--drift-y-px", `${(driftY * 6).toFixed(2)}px`)
      section.style.setProperty("--drift-x-px-inverse", `${(driftX * -5).toFixed(2)}px`)
      section.style.setProperty("--drift-y-px-inverse", `${(driftY * -4).toFixed(2)}px`)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [])

  return ref
}


/* ──────────────────────────────────────────────────────────
   Feature card visual snippets
   ────────────────────────────────────────────────────────── */

function CitationSnippet() {
  return (
    <div className="mt-4 rounded-lg border border-[#1D2925] bg-[#050706] p-3">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[#1ED760]" />
        <span className="text-[11px] font-semibold text-[#F5F7F6]">AI Response</span>
      </div>
      <p className="mb-2 text-[11px] leading-4 text-[#B8C0BC]">
        Digital credit providers must verify customer identity before loan disbursement...
      </p>
      <div className="flex flex-wrap gap-1.5">
        {["Data Protection Act, S.30", "CBK/PG/08"].map((c) => (
          <span key={c} className="inline-flex items-center gap-1 rounded border border-[#C6A15B]/20 bg-[#C6A15B]/8 px-1.5 py-0.5 text-[9px] font-semibold text-[#D8B76E]">
            <BookOpen className="h-2.5 w-2.5" />
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

function GapAnalysisSnippet() {
  return (
    <div className="mt-4 rounded-lg border border-[#1D2925] bg-[#050706] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="h-3.5 w-3.5 text-[#1ED760]" />
          <span className="text-[11px] font-semibold text-[#F5F7F6]">privacy-policy.pdf</span>
        </div>
        <span className="rounded-full bg-[#F59E0B]/10 px-2 py-0.5 text-[9px] font-bold text-[#F59E0B]">
          72% compliant
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          { text: "Data retention clause", ok: true },
          { text: "Consent mechanism", ok: true },
          { text: "Cross-border transfer notice", ok: false },
          { text: "Data breach notification procedure", ok: false },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-[10px]">
            {item.ok ? (
              <CheckCircle2 className="h-3 w-3 text-[#1ED760]" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-[#EF4444]" />
            )}
            <span className={item.ok ? "text-[#B8C0BC]" : "text-[#EF4444]"}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChecklistSnippet() {
  return (
    <div className="mt-4 rounded-lg border border-[#1D2925] bg-[#050706] p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-md border border-[#1ED760]/20 bg-[#1ED760]/10 px-2 py-1 text-[10px] font-semibold text-[#1ED760]">
          Digital Credit Provider
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          "Customer identity verification",
          "Loan agreement disclosures",
          "Interest rate caps compliance",
          "CBK quarterly reporting",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-[10px]">
            <CheckCircle2 className="h-3 w-3 text-[#1ED760]" />
            <span className="text-[#B8C0BC]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExportSnippet() {
  return (
    <div className="mt-4 rounded-lg border border-[#1D2925] bg-[#050706] p-3">
      <div className="mb-2 text-[11px] font-semibold text-[#F5F7F6]">Export options</div>
      <div className="space-y-1.5">
        {["PDF Compliance Report", "DOCX Gap Analysis", "CSV Checklist"].map((item) => (
          <div key={item} className="flex items-center justify-between rounded-md bg-[#0D1411] px-2.5 py-2 text-[10px]">
            <span className="text-[#B8C0BC]">{item}</span>
            <FileDown className="h-3 w-3 text-[#D8B76E]" />
          </div>
        ))}
      </div>
    </div>
  )
}

const featureSnippets: Record<string, () => ReactNode> = {
  "zero-hallucinations": CitationSnippet,
  "gap-analysis": GapAnalysisSnippet,
  "tailored-checklists": ChecklistSnippet,
  "audit-exports": ExportSnippet,
}

/* ──────────────────────────────────────────────────────────
   Pan-African map (CSS/SVG)
   ────────────────────────────────────────────────────────── */

function AfricaMap() {
  const liveMarker = AFRICA_CAPITAL_MARKERS.find((marker) => marker.live)
  const pendingMarkers = AFRICA_CAPITAL_MARKERS.filter((marker) => !marker.live)

  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#1D2925] bg-[#050706]/80 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(245,247,246,0.05)] sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_44%,rgba(30,215,96,0.16),transparent_36%),radial-gradient(circle_at_37%_43%,rgba(198,161,91,0.12),transparent_24%)]"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 620 620"
        className="relative h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Map of Africa showing SheriaBot expansion roadmap"
        role="img"
      >
        <defs>
          <linearGradient id="africa-land" x1="150" y1="80" x2="470" y2="560" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#14251D" />
            <stop offset="0.52" stopColor="#0C1712" />
            <stop offset="1" stopColor="#07100C" />
          </linearGradient>
          <radialGradient id="africa-core" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(380 305) rotate(90) scale(225 180)">
            <stop stopColor="#1ED760" stopOpacity="0.16" />
            <stop offset="1" stopColor="#1ED760" stopOpacity="0" />
          </radialGradient>
          <filter id="pin-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="620" height="620" rx="34" fill="transparent" />

        <g filter="url(#pin-glow)" opacity="0.45">
          {AFRICA_COUNTRY_PATHS.map((country) => (
            <path key={`${country.iso}-glow`} d={country.d} fill="#1ED760" fillOpacity="0.035" />
          ))}
        </g>

        <g>
          {AFRICA_COUNTRY_PATHS.map((country) => {
            const isLive = country.name === AFRICA_LIVE_COUNTRY
            const isHighlighted = AFRICA_HIGHLIGHT_COUNTRIES.has(country.name)

            return (
              <path
                key={country.iso}
                d={country.d}
                fill={isLive ? "#1ED760" : isHighlighted ? "#C6A15B" : "url(#africa-land)"}
                fillOpacity={isLive ? "0.3" : isHighlighted ? "0.2" : "0.86"}
                stroke={isLive ? "#1ED760" : isHighlighted ? "#D8B76E" : "#1ED760"}
                strokeOpacity={isLive ? "0.8" : isHighlighted ? "0.58" : "0.16"}
                strokeWidth={isHighlighted ? "1.1" : "0.55"}
              />
            )
          })}
        </g>

        <g opacity="0.92">
          {AFRICA_COUNTRY_PATHS.map((country) => (
            <path key={`${country.iso}-core`} d={country.d} fill="url(#africa-core)" />
          ))}
        </g>

        {/* Connection lines */}
        {liveMarker &&
          pendingMarkers.map((marker) => (
            <path
              key={`${marker.country}-route`}
              d={`M ${liveMarker.x} ${liveMarker.y} Q ${(liveMarker.x + marker.x) / 2} ${Math.min(liveMarker.y, marker.y) - 34} ${marker.x} ${marker.y}`}
              stroke="#7F8A85"
              strokeDasharray="6 9"
              strokeLinecap="round"
              strokeOpacity="0.3"
              strokeWidth="1.4"
            />
          ))}

        {/* Capital pins */}
        {AFRICA_CAPITAL_MARKERS.map((marker) => (
          <g key={marker.country}>
            <line
              x1={marker.x}
              y1={marker.y}
              x2={marker.labelX}
              y2={marker.labelY}
              stroke={marker.live ? "#1ED760" : "#7F8A85"}
              strokeOpacity={marker.live ? "0.58" : "0.36"}
              strokeWidth="1"
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r={marker.live ? "17" : "12"}
              fill={marker.live ? "#1ED760" : "#C6A15B"}
              opacity={marker.live ? "0.16" : "0.1"}
              filter="url(#pin-glow)"
            />
            {marker.live && (
              <circle
                cx={marker.x}
                cy={marker.y}
                r="22"
                stroke="#1ED760"
                strokeOpacity="0.2"
                className="animate-pulse"
              />
            )}
            <circle
              cx={marker.x}
              cy={marker.y}
              r={marker.live ? "7" : "5.5"}
              fill={marker.live ? "#1ED760" : "#D8B76E"}
              stroke="#050706"
              strokeWidth="3"
            />
            <text
              x={marker.labelX}
              y={marker.labelY}
              fill={marker.live ? "#1ED760" : "#D8B76E"}
              fontSize="14"
              fontWeight="700"
              textAnchor={marker.labelX < marker.x ? "end" : "start"}
            >
              {marker.capital}
            </text>
            <text
              x={marker.labelX}
              y={marker.labelY + 16}
              fill="#7F8A85"
              fontSize="10"
              textAnchor={marker.labelX < marker.x ? "end" : "start"}
            >
              {marker.country}
            </text>
          </g>
        ))}
      </svg>

      <div className="relative mt-3 flex flex-col gap-1 border-t border-[#1D2925] pt-4 text-xs text-[#7F8A85] sm:flex-row sm:items-center sm:justify-between">
        <span>Highlighted countries: Kenya, Nigeria, Rwanda, Malawi</span>
        <span className="font-semibold text-[#1ED760]">Capital pins</span>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Main Landing Page
   ────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const parallaxRef = useParallax()
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <div ref={parallaxRef} className="relative overflow-hidden">
      {/* ════════════════════════════════════════════════════
          1. HERO SECTION
          ════════════════════════════════════════════════════ */}
      <HomeHero />

      {/* ════════════════════════════════════════════════════
          2. HONEST AUTHORITY STRIP
          ════════════════════════════════════════════════════ */}
      <AmbientSection className="border-y border-border py-14 sm:py-16" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-foreground-muted mb-8 tracking-wide">
            Engineered to navigate Kenya&apos;s critical frameworks:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {regulatoryFrameworks.map((framework) => (
              <div
                key={framework.name}
                className="group flex items-center gap-2.5 rounded-full border border-[#1D2925] bg-[#080D0B]/80 px-4 py-2.5 text-sm font-medium text-[#B8C0BC] transition-all duration-300 hover:border-brand-green/30 hover:text-[#F5F7F6]"
              >
                <span className="text-base" aria-hidden="true">{framework.icon}</span>
                {framework.name}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-foreground-muted/60 mt-6">
            SheriaBot is not affiliated with or endorsed by the listed regulators.
          </p>
        </div>
      </AmbientSection>

      {/* ════════════════════════════════════════════════════
          3. COMPLIANCE EVIDENCE SECTION (Product workflow)
          ════════════════════════════════════════════════════ */}
      <ComplianceEvidenceSection />

      {/* ════════════════════════════════════════════════════
          4. FEATURES — BENTO GRID
          ════════════════════════════════════════════════════ */}
      <AmbientSection id="features" className="py-24 sm:py-32 scroll-mt-20" density="quiet">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-6 border-brand-green/30 text-brand-green bg-brand-green/5 px-4 py-1">
              Product
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Turn a week of compliance work{" "}
              <span className="text-brand-green">into a guided workflow.</span>
            </h2>
            <p className="mt-6 text-lg text-foreground-muted">
              How Sheria<span className="text-brand-green">Bot</span> lightens your workload:
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, index) => {
              const SnippetComponent = featureSnippets[feature.id]
              return (
                <Card 
                  key={feature.title} 
                  className={`group relative overflow-hidden rounded-2xl border-border bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,135,90,0.15)] hover:bg-surface ${
                    feature.size === "large" ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
                  }`}
                  data-parallax={0.05 + index * 0.02}
                >
                  <CardContent className="p-8 flex flex-col h-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500 transition-all duration-300">
                          <feature.icon className="h-6 w-6" strokeWidth={1.75} />
                        </div>
                        {feature.badge && (
                          <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            {feature.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-6 text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-3 text-foreground-muted leading-relaxed text-sm">{feature.description}</p>

                      {/* Visual snippet */}
                      {SnippetComponent && <SnippetComponent />}
                    </div>

                    <button
                      onClick={() => setActiveModal(feature.id)}
                      className="mt-6 flex items-center text-sm text-brand-green opacity-100 md:opacity-0 transition-all duration-300 group-hover:opacity-100 focus:outline-none focus-visible:opacity-100"
                    >
                      <span>Learn more</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </CardContent>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-green/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Card>
              )
            })}
          </div>
        </div>
      </AmbientSection>

      {/* ════════════════════════════════════════════════════
          5. FOUNDER'S LETTER
          ════════════════════════════════════════════════════ */}
      <AmbientSection id="founder" className="py-24 sm:py-32 scroll-mt-20" density="quiet" tone="gold">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="relative rounded-3xl border border-[#C6A15B]/20 bg-gradient-to-br from-[#0D1411] via-[#080D0B] to-[#050706] p-8 sm:p-12 shadow-elevated">
              {/* Decorative quote mark */}
              <Quote
                className="absolute right-8 top-8 h-16 w-16 text-[#C6A15B]/10 sm:h-20 sm:w-20"
                aria-hidden="true"
              />

              <div className="relative">
                <Badge variant="outline" className="mb-6 border-[#C6A15B]/25 text-[#D8B76E] bg-[#C6A15B]/5 px-3 py-1 text-xs">
                  From the Founder
                </Badge>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F7F6] tracking-tight">
                  Why we built SheriaBot.
                </h2>

                <div className="mt-8 space-y-5 text-[15px] leading-7 text-[#B8C0BC]">
                  <p>
                    We watched brilliant Kenyan fintechs burn months of runway and hundreds of thousands of shillings just trying to interpret CBK and ODPC guidelines. The regulatory lag was killing innovation.
                  </p>
                  <p>
                    I built SheriaBot because compliance shouldn&apos;t be a black box that only expensive lawyers can unlock. We read the gazettes so your engineers don&apos;t have to.
                  </p>
                </div>

                {/* Founder sign-off */}
                <div className="mt-10 flex items-center gap-4 border-t border-[#1D2925] pt-8">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C6A15B]/25 shadow-[0_0_20px_rgba(198,161,91,0.15)] overflow-hidden bg-[#C6A15B]/10">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_R2_ASSETS_URL}/avatars/founder/Christopher_rateng-Passport-Photo.jpg`}
                      alt="Christopher Rateng"
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F5F7F6]">Christopher Rateng</p>
                    <p className="text-sm text-[#7F8A85]">Founder &amp; CEO</p>
                  </div>
                  {/* Signature-style flourish */}
                  <div className="ml-auto hidden sm:block">
                    <span className="font-caveat text-xl text-[#C6A15B]/40 select-none">— CR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AmbientSection>

      {/* ════════════════════════════════════════════════════
          6. PAN-AFRICAN VISION
          ════════════════════════════════════════════════════ */}
      <AmbientSection id="vision" className="border-t border-border py-24 sm:py-32 scroll-mt-20" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="outline" className="mb-6 border-brand-green/30 text-brand-green bg-brand-green/5 px-4 py-1">
                Vision
              </Badge>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
                Anchored in Kenya.{" "}
                <span className="text-brand-green">Engineered for Africa.</span>
              </h2>
              <p className="mt-6 text-lg text-foreground-muted leading-relaxed">
                We&apos;re starting where we know the regulatory landscape best. Our roadmap extends SheriaBot&apos;s coverage across key African fintech markets.
              </p>

              {/* Roadmap cards */}
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {roadmapMarkets.map((market) => (
                  <div
                    key={market.name}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 ${
                      market.live
                        ? "border-brand-green/30 bg-brand-green/5"
                        : "border-[#1D2925] bg-[#080D0B]/50"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          market.live ? "bg-[#1ED760] shadow-[0_0_8px_rgba(30,215,96,0.6)]" : "bg-[#D8B76E]/70"
                        }`}
                      />
                      {market.live && (
                        <div className="absolute inset-0 animate-ping rounded-full bg-[#1ED760]/40" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${market.live ? "text-[#1ED760]" : "text-[#B8C0BC]"}`}>
                        {market.name}
                      </p>
                      <p className={`text-xs ${market.live ? "text-[#1ED760]/70" : "text-[#7F8A85]"}`}>
                        {market.status} · {market.capital} pinned
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Africa map */}
            <div className="flex items-center justify-center">
              <AfricaMap />
            </div>
          </div>
        </div>
      </AmbientSection>

      {/* ════════════════════════════════════════════════════
          7. FINAL CTA
          ════════════════════════════════════════════════════ */}
      <AmbientSection className="py-24" tone="gold" density="quiet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-brand-green/30 bg-gradient-to-br from-brand-green/10 via-surface to-surface">
            <CardContent className="relative p-12 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Ready to pilot compliance automation{" "}
                <span className="text-brand-green">built for Kenya&apos;s regulatory reality</span>?
              </h2>
              <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
                Get cited answers, actionable checklists, and automated gap analyses designed for Kenyan fintechs, PSPs, and compliance teams.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="group w-full sm:w-auto bg-brand-green text-foreground-on-green hover:bg-brand-green-hover rounded-xl shadow-glow-green hover:shadow-glow-green transition-all duration-300 hover:scale-105 px-8 h-12 font-semibold"
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
                  className="w-full sm:w-auto rounded-xl border-border bg-transparent hover:bg-brand-green/10 hover:border-brand-green/30 hover:text-brand-green transition-all duration-300 px-8 h-12"
                >
                  <Link href="/contact">Talk to the Founder</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AmbientSection>

      {/* ════════════════════════════════════════════════════
          Feature Relief Modal (preserved from original)
          ════════════════════════════════════════════════════ */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-green-500/20 bg-slate-800 p-8 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground hover:bg-white/5 hover:text-white transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="mt-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {modalData[activeModal as keyof typeof modalData]?.title}
              </h3>
              <p className="mt-4 text-slate-300 leading-relaxed text-sm">
                {modalData[activeModal as keyof typeof modalData]?.body}
              </p>
            </div>

            {/* Footer / CTA */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <Link 
                href={modalData[activeModal as keyof typeof modalData]?.href ?? "/register"} 
                onClick={() => setActiveModal(null)}
                className="bg-brand-green hover:bg-brand-green-hover text-foreground-on-green rounded-lg px-6 py-2 text-sm font-semibold transition-colors duration-200 inline-flex items-center"
              >
                {modalData[activeModal as keyof typeof modalData]?.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
