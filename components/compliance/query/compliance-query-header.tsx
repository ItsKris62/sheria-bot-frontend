import React from "react"
import { ShieldCheck } from "lucide-react"
import { ComplianceQueryMascotIcon } from "@/components/compliance/compliance-query-mascot-icon"

export interface ComplianceQueryHeaderProps {
  title?: string
  description?: string
}

export function ComplianceQueryHeader({
  title = "Compliance Query",
  description = "Ask regulatory questions and receive evidence-backed guidance from verified sources.",
}: ComplianceQueryHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5 motion-safe:animate-fade-slide-up">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-xs transition-colors duration-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/compliance-query-search-icon.png"
              alt="Compliance Query Icon"
              className="h-5 w-5 object-contain [image-rendering:pixelated]"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400 transition-all duration-150 hover:border-emerald-500/40 hover:bg-emerald-500/10">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="font-medium">Verified Legal Corpus</span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground">Kenya, Rwanda, Malawi</span>
      </div>
    </div>
  )
}
