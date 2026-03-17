"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Contextual document map ──────────────────────────────────────────────────

const TOPIC_DOCUMENT_MAP: Record<string, string[]> = {
  "data protection": [
    "Reviewing the Data Protection Act, 2019...",
    "Checking ODPC compliance guidelines...",
  ],
  "mobile money": [
    "Scanning National Payment System Regulations...",
    "Reviewing CBK Mobile Money guidelines...",
  ],
  "mobile banking": [
    "Scanning National Payment System Regulations...",
    "Reviewing CBK Mobile Banking directives...",
  ],
  lending: [
    "Analyzing CBK Prudential Guidelines on Digital Credit...",
    "Checking Consumer Protection Act provisions...",
  ],
  "digital lending": [
    "Analyzing CBK Digital Credit Provider regulations...",
    "Reviewing fair lending disclosure requirements...",
  ],
  kyc: [
    "Reviewing AML/CFT guidelines (Financial Reporting Centre)...",
    "Scanning Proceeds of Crime Act provisions...",
  ],
  "know your customer": [
    "Reviewing AML/CFT guidelines (Financial Reporting Centre)...",
    "Scanning CBK KYC requirements...",
  ],
  aml: [
    "Reviewing Proceeds of Crime and Anti-Money Laundering Act...",
    "Scanning Financial Reporting Centre guidelines...",
  ],
  "anti-money laundering": [
    "Reviewing Proceeds of Crime and Anti-Money Laundering Act...",
    "Checking FATF compliance standards...",
  ],
  insurance: [
    "Checking IRA regulatory framework...",
    "Reviewing Insurance Act, Cap 487 provisions...",
  ],
  "capital markets": [
    "Scanning CMA regulations...",
    "Reviewing Capital Markets Act provisions...",
  ],
  payment: [
    "Reviewing National Payment System Act...",
    "Checking CBK Payment Service Provider guidelines...",
  ],
  cryptocurrency: [
    "Reviewing CBK Digital Asset guidance notices...",
    "Checking East African virtual asset regulations...",
  ],
  "digital assets": [
    "Reviewing CBK Digital Asset guidance notices...",
    "Checking East African virtual asset regulations...",
  ],
  reporting: [
    "Reviewing CBK statutory reporting requirements...",
    "Checking prudential returns guidelines...",
  ],
  license: [
    "Scanning CBK licensing framework...",
    "Reviewing regulatory approval procedures...",
  ],
  licensing: [
    "Scanning CBK licensing framework...",
    "Reviewing regulatory approval procedures...",
  ],
  "consumer protection": [
    "Reviewing Consumer Protection Act provisions...",
    "Checking CBK consumer protection guidelines...",
  ],
  privacy: [
    "Reviewing the Data Protection Act, 2019...",
    "Checking ODPC binding guidance on financial data...",
  ],
  fintech: [
    "Reviewing CBK FinTech regulatory sandbox framework...",
    "Scanning applicable prudential guidelines...",
  ],
  "microfinance": [
    "Reviewing Microfinance Act provisions...",
    "Checking CBK deposit-taking MFI guidelines...",
  ],
  sacco: [
    "Reviewing SACCO Societies Act...",
    "Checking SASRA prudential guidelines...",
  ],
}

// ─── Step generation ──────────────────────────────────────────────────────────

const GENERIC_STAGE3: string[] = [
  "Reviewing CBK prudential regulatory framework...",
  "Cross-referencing applicable Kenyan legislation...",
  "Analyzing compliance requirements...",
]

function getStepsForQuery(query: string): string[] {
  const q = query.toLowerCase()

  const stage1 = ["Reading your query..."]

  const stage2 = [
    "Searching regulatory database...",
    "Scanning relevant legislation...",
  ]

  // Collect at most 2 contextual document steps from matched keywords
  const stage3: string[] = []
  for (const [keyword, docs] of Object.entries(TOPIC_DOCUMENT_MAP)) {
    if (q.includes(keyword)) {
      for (const doc of docs) {
        if (!stage3.includes(doc)) stage3.push(doc)
        if (stage3.length >= 2) break
      }
    }
    if (stage3.length >= 2) break
  }

  const stage4 = [
    "Identifying applicable provisions...",
    "Compiling regulatory guidance...",
    "Formulating compliance recommendation...",
  ]

  return [
    ...stage1,
    ...stage2,
    ...(stage3.length > 0 ? stage3 : GENERIC_STAGE3.slice(0, 2)),
    ...stage4,
  ]
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ThinkingIndicatorProps {
  /** The user's query text — used for contextual document name injection */
  query: string
}

export function ThinkingIndicator({ query }: ThinkingIndicatorProps) {
  const steps = useMemo(() => getStepsForQuery(query), [query])
  const [currentStep, setCurrentStep] = useState(0)

  // Advance through steps on a timer. Uses setTimeout chain so each step
  // can have its own duration without fighting a fixed interval.
  useEffect(() => {
    if (currentStep >= steps.length - 1) return
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, 2200)
    return () => clearTimeout(timer)
  }, [currentStep, steps.length])

  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-muted px-4 py-4 max-w-[85%] min-w-[260px]">
        {/* SheriaBot header row */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">SheriaBot</span>
          <span className="ml-auto text-xs text-muted-foreground italic">Thinking…</span>
        </div>

        {/* Step list */}
        <div className="flex flex-col gap-2">
          {steps.map((step, index) => {
            if (index > currentStep) return null

            const isActive = index === currentStep
            const isDone = index < currentStep

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2.5 transition-opacity duration-500",
                  // New step fades + slides in when it first mounts
                  index === currentStep && "animate-in fade-in slide-in-from-bottom-1 duration-300",
                  // Completed steps dim smoothly
                  isDone && "opacity-40"
                )}
              >
                {/* Status icon */}
                <div className="shrink-0 flex h-4 w-4 items-center justify-center">
                  {isActive ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary/70" />
                  )}
                </div>

                {/* Step text — monospace for "AI reading" feel */}
                <span
                  className={cn(
                    "text-xs leading-relaxed font-mono",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
