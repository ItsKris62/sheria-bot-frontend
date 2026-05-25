"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Headphones,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"

type BillingCycle = "monthly" | "yearly"
type PlanTone = "startup" | "business" | "enterprise"

type PriceValue = number | "Custom"

interface PricingPlan {
  name: string
  tone: PlanTone
  label?: string
  description: string
  bestFor: string
  monthlyPrice: PriceValue
  yearlyPrice: PriceValue
  features: string[]
  cta: string
  href: string
}

const plans: PricingPlan[] = [
  {
    name: "Startup",
    tone: "startup",
    description:
      "For fintech teams preparing licensing, policies, and basic compliance workflows.",
    bestFor:
      "Replacing manual regulatory research and spreadsheet-based compliance tracking.",
    monthlyPrice: 4999,
    yearlyPrice: 49790,
    features: [
      "Unlimited compliance queries",
      "5 checklist generations/month",
      "Regulatory alerts",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Compliance Trial",
    href: "/register?plan=startup",
  },
  {
    name: "Business",
    tone: "business",
    label: "Recommended for Operating Fintechs",
    description:
      "For operating fintech teams managing recurring compliance tasks, checklists, reporting, and gap analysis.",
    bestFor:
      "Teams needing audit-ready workflows, recurring monitoring, and operational compliance visibility.",
    monthlyPrice: 44999,
    yearlyPrice: 448190,
    features: [
      "Everything in Startup",
      "Unlimited checklist generations",
      "Gap analysis workspace",
      "API access",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Run Business Compliance Trial",
    href: "/register?plan=business",
  },
  {
    name: "Enterprise",
    tone: "enterprise",
    description:
      "For regulated institutions needing governance, audit logs, legal review workflows, and custom integrations.",
    bestFor:
      "Organizations requiring institutional-grade compliance operations and oversight.",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    features: [
      "Everything in Business",
      "Dedicated compliance workspace",
      "Policy generation workflows",
      "Legal corpus management",
      "Role-based access controls",
      "Custom integrations",
      "Audit logs",
      "Priority onboarding",
    ],
    cta: "Book Enterprise Demo",
    href: "/contact?subject=enterprise",
  },
]

const trustSignals = [
  { icon: LockKeyhole, label: "Secure payments" },
  { icon: FileCheck2, label: "Audit-ready exports" },
  { icon: ShieldCheck, label: "Data protection controls" },
  { icon: Headphones, label: "Dedicated support" },
]

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPrefersReducedMotion(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)

    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  return prefersReducedMotion
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function AnimatedPrice({ value }: { value: PriceValue }) {
  const reducedMotion = usePrefersReducedMotion()
  const numericValue = typeof value === "number" ? value : null
  const [displayValue, setDisplayValue] = useState(numericValue ?? 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const displayValueRef = useRef(displayValue)

  useEffect(() => {
    displayValueRef.current = displayValue
  }, [displayValue])

  useEffect(() => {
    if (numericValue === null) {
      setIsTransitioning(false)
      return
    }

    if (reducedMotion) {
      setDisplayValue(numericValue)
      setIsTransitioning(false)
      return
    }

    let animationFrame = 0
    let transitionTimer = 0
    let startTime: number | null = null
    const startValue = displayValueRef.current
    const duration = 560

    setIsTransitioning(true)

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const nextValue = Math.round(startValue + (numericValue - startValue) * eased)

      displayValueRef.current = nextValue
      setDisplayValue(nextValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        displayValueRef.current = numericValue
        setDisplayValue(numericValue)
        transitionTimer = window.setTimeout(() => setIsTransitioning(false), 90)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.clearTimeout(transitionTimer)
    }
  }, [numericValue, reducedMotion])

  if (typeof value === "string") {
    return <span className="tracking-[-0.01em]">{value}</span>
  }

  return (
    <span
      className={`inline-flex items-baseline gap-2 transition duration-500 ease-out ${
        isTransitioning ? "opacity-80 blur-[0.25px]" : "opacity-100 blur-0"
      }`}
      aria-live="polite"
    >
      <span className="text-[0.42em] font-semibold uppercase tracking-[0.12em] text-[#7F8A85]">
        KES
      </span>
      <span>{displayValue.toLocaleString("en-KE")}</span>
    </span>
  )
}

function BillingToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle
  onChange: (cycle: BillingCycle) => void
}) {
  const isYearly = cycle === "yearly"

  return (
    <div className="relative [perspective:900px]">
      <div
        className="pointer-events-none absolute -inset-2 rounded-full bg-[#1ED760]/12 blur-2xl transition duration-700 ease-out"
        aria-hidden="true"
      />
      <div className="relative inline-grid h-16 w-[306px] grid-cols-2 items-center rounded-full border border-[#26352F] bg-[linear-gradient(180deg,#101A15_0%,#070B09_48%,#020403_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-12px_24px_rgba(0,0,0,0.36),0_22px_48px_rgba(0,0,0,0.34),0_7px_0_rgba(0,0,0,0.28)] sm:w-[360px]">
      <span
        className={`absolute left-2 top-2 h-12 w-[calc(50%-8px)] overflow-hidden rounded-full bg-[linear-gradient(145deg,#68FF99_0%,#1ED760_48%,#0FAE47_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-8px_16px_rgba(4,74,31,0.32),0_13px_26px_rgba(30,215,96,0.28),0_4px_0_rgba(6,58,27,0.52)] transition-[transform,box-shadow,background] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          isYearly
            ? "[transform:translate3d(100%,0,0)_rotateY(-7deg)]"
            : "[transform:translate3d(0,0,0)_rotateY(7deg)]"
        }`}
        aria-hidden="true"
      >
        <span className="absolute inset-x-3 top-1 h-3 rounded-full bg-white/38 blur-[1px]" />
        <span className="absolute inset-y-2 right-3 w-px bg-white/35" />
      </span>
      <button
        type="button"
        className={`relative z-10 h-12 rounded-full text-sm font-bold transition-[color,transform,text-shadow] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ED760]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050706] ${
          !isYearly
            ? "translate-y-[-1px] text-[#06110A] [text-shadow:0_1px_0_rgba(255,255,255,0.22)]"
            : "text-[#B8C0BC] hover:text-[#F5F7F6]"
        }`}
        onClick={() => onChange("monthly")}
        aria-pressed={!isYearly}
      >
        Monthly
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={isYearly}
        aria-label="Use yearly billing"
        className={`relative z-10 flex h-12 items-center justify-center gap-2 rounded-full text-sm font-bold transition-[color,transform,text-shadow] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ED760]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050706] ${
          isYearly
            ? "translate-y-[-1px] text-[#06110A] [text-shadow:0_1px_0_rgba(255,255,255,0.22)]"
            : "text-[#B8C0BC] hover:text-[#F5F7F6]"
        }`}
        onClick={() => onChange("yearly")}
      >
        Yearly
        <span
          className={`hidden rounded-full border px-2 py-0.5 text-[11px] font-extrabold shadow-sm transition-[background,border-color,color,transform] duration-500 sm:inline-flex ${
            isYearly
              ? "translate-y-0 border-[#06110A]/20 bg-[#06110A]/10 text-[#06110A]"
              : "translate-y-px border-[#26352F] bg-[#101814] text-[#8D9994]"
          }`}
        >
          Save 17%
        </span>
      </button>
      </div>
    </div>
  )
}

function getPlanPrice(plan: PricingPlan, cycle: BillingCycle) {
  return cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
}

function getCardClasses(tone: PlanTone) {
  if (tone === "business") {
    return "border-[#1ED760]/40 bg-[radial-gradient(circle_at_top,rgba(30,215,96,0.14),transparent_42%),linear-gradient(180deg,#12251B_0%,#07100C_100%)] shadow-[0_24px_90px_rgba(30,215,96,0.10),0_1px_0_rgba(255,255,255,0.06)_inset] lg:-translate-y-5 lg:scale-[1.04]"
  }

  if (tone === "enterprise") {
    return "border-[#C6A15B]/30 bg-[linear-gradient(180deg,rgba(198,161,91,0.08),transparent_35%),linear-gradient(180deg,#111411_0%,#070A09_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.28),0_1px_0_rgba(255,255,255,0.04)_inset]"
  }

  return "border-[#1D2925] bg-[linear-gradient(180deg,#0D1411_0%,#080D0B_100%)] shadow-[0_24px_70px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.04)_inset]"
}

function PricingCard({
  plan,
  cycle,
}: {
  plan: PricingPlan
  cycle: BillingCycle
}) {
  const isBusiness = plan.tone === "business"
  const isEnterprise = plan.tone === "enterprise"
  const price = getPlanPrice(plan, cycle)
  const cadence = typeof price === "number" ? (cycle === "yearly" ? "/year" : "/month") : ""

  return (
    <article
      className={`group relative flex h-full w-full max-w-[19rem] flex-col overflow-hidden rounded-[28px] border p-5 transition duration-500 ease-out hover:-translate-y-1 hover:border-[#1ED760]/45 hover:shadow-[0_30px_100px_rgba(0,0,0,0.34)] sm:max-w-none sm:p-9 ${getCardClasses(plan.tone)}`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {isBusiness && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_50%_0%,rgba(30,215,96,0.18),transparent_62%)] opacity-90 transition duration-500 group-hover:opacity-100" />
      )}

      <div className="relative z-10 flex min-h-9 items-start justify-end">
        {plan.label && (
          <span className="rounded-full border border-[#1ED760]/25 bg-[#1ED760]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#1ED760]">
            {plan.label}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-8">
        <h3 className="text-[28px] font-bold leading-tight text-[#F5F7F6] sm:text-[30px]">
          {plan.name}
        </h3>
        <p className="mt-4 text-[15px] leading-7 text-[#B8C0BC] sm:min-h-[84px]">
          {plan.description}
        </p>
      </div>

      <div className="relative z-10 mt-8 border-y border-[#1D2925]/80 py-7">
        <div className="flex flex-nowrap items-end gap-x-2 gap-y-1">
          <div
            className={`font-numeric text-[38px] font-extrabold leading-none tracking-[-0.02em] sm:text-[56px] ${
              isEnterprise ? "text-[#F5F7F6]" : "text-[#F5F7F6]"
            }`}
          >
            <AnimatedPrice value={price} />
          </div>
          {cadence && (
            <span className="pb-1.5 text-sm font-medium text-[#7F8A85]">
              {cadence}
            </span>
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-[#7F8A85]">
          {cycle === "yearly" && typeof price === "number"
            ? "Annual billing with two months of runway returned to your budget."
            : isEnterprise
              ? "Sales-led pricing for governed rollout, integrations, and oversight."
              : "Trial included. No credit card required. Cancel anytime."}
        </p>
      </div>

      <div className="relative z-10 mt-7">
        <p
          className={`text-xs font-bold uppercase tracking-[0.14em] ${
            isEnterprise ? "text-[#D8B76E]" : "text-[#1ED760]"
          }`}
        >
          Best for
        </p>
        <p className="mt-3 text-[15px] leading-7 text-[#B8C0BC]">{plan.bestFor}</p>
      </div>

      <ul className="relative z-10 mt-8 flex-1 space-y-4">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-[15px] leading-6 text-[#DDE3E0]">
            <CheckCircle2
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                isEnterprise ? "text-[#D8B76E]" : "text-[#1ED760]"
              }`}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={`relative z-10 mt-9 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 py-4 text-center text-sm font-bold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050706] ${
          isBusiness
            ? "bg-[#1ED760] text-[#06110A] shadow-[0_16px_44px_rgba(30,215,96,0.22)] hover:-translate-y-0.5 hover:bg-[#33E875] focus-visible:ring-[#1ED760]"
            : isEnterprise
              ? "border border-[#C6A15B]/34 bg-[#0B0D0C] text-[#F5F7F6] hover:-translate-y-0.5 hover:border-[#D8B76E]/70 hover:bg-[#14120C] focus-visible:ring-[#D8B76E]"
              : "border border-[#27342F] bg-[#101814] text-[#F5F7F6] hover:-translate-y-0.5 hover:border-[#1ED760]/50 hover:bg-[#122018] focus-visible:ring-[#1ED760]"
        }`}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
      </Link>
    </article>
  )
}

export function PricingSection({ showEnterpriseReassurance = true }: { showEnterpriseReassurance?: boolean }) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly")
  const activePriceNarrative = useMemo(
    () =>
      cycle === "yearly"
        ? "Yearly pricing selected. Startup and Business now show annual totals."
        : "Monthly pricing selected. Startup and Business now show monthly totals.",
    [cycle],
  )

  return (
    <section
      id="pricing"
      data-ambient-section
      className="relative overflow-hidden border-y border-[#1D2925] bg-[#050706] py-24 text-[#F5F7F6] sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-[background,transform] duration-700 ease-out"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x,50%) var(--mouse-y,-12%), rgba(30,215,96,0.12), transparent 34%), linear-gradient(180deg,#080D0B 0%,#050706 42%,#050706 100%)",
          transform:
            "translate3d(var(--drift-x-px,0px), calc(var(--parallax-y,0px) + var(--drift-y-px,0px)), 0)",
        }}
        data-parallax="0.035"
        data-ambient-layer
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1ED760]/35 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#1ED760]">
            Pricing
          </p>
          <h2 className="mx-auto mt-6 max-w-[22rem] text-balance text-[34px] font-bold leading-[1.08] tracking-[-0.01em] text-[#F5F7F6] sm:max-w-3xl sm:text-5xl lg:text-6xl">
            Simple, transparent <span className="block sm:inline">pricing</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[20rem] text-base leading-7 text-[#B8C0BC] sm:max-w-xl sm:text-lg sm:leading-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          <div className="mt-10 flex justify-center">
            <BillingToggle cycle={cycle} onChange={setCycle} />
          </div>
          <p className="sr-only" aria-live="polite">
            {activePriceNarrative}
          </p>
          <p className="mx-auto mt-4 max-w-[20rem] text-sm leading-6 text-[#7F8A85] sm:max-w-none">
            Built for fintech teams at every stage of compliance maturity.
          </p>
        </div>

        <div className="mt-20 grid justify-items-center gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-7">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} cycle={cycle} />
          ))}
        </div>

        <div className="mt-16 grid gap-3 rounded-[24px] border border-[#1D2925] bg-[#080D0B]/80 p-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustSignals.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold text-[#B8C0BC]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1D2925] bg-[#0D1411] text-[#1ED760]">
                <item.icon className="h-4 w-4" />
              </span>
              {item.label}
            </div>
          ))}
        </div>

        {showEnterpriseReassurance && (
          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="text-sm leading-7 text-[#7F8A85]">
              Enterprise deployments can include custom onboarding, legal workflow mapping,
              role-based access controls, and support for internal audit review.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
