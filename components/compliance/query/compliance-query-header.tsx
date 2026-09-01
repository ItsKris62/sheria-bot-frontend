import React from "react"

export interface ComplianceQueryHeaderProps {
  title?: string
  description?: string
}

export function ComplianceQueryHeader({
  title = "Compliance Query",
  description = "Ask regulatory questions and receive evidence-backed guidance from verified sources.",
}: ComplianceQueryHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5 motion-safe:animate-fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs sm:text-sm text-emerald-300 transition-all duration-150 hover:border-emerald-500/50 hover:bg-emerald-500/15 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/compliance-query-badge-icon.png"
          alt=""
          aria-hidden="true"
          className="h-4.5 w-4.5 shrink-0 object-contain"
          onError={(e) => {
            // Graceful fallback if image is unavailable
            e.currentTarget.style.display = "none"
          }}
        />
        <span className="font-semibold text-emerald-300">Verified Legal Corpus</span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground text-xs sm:text-sm">Kenya, Rwanda, Malawi</span>
      </div>
    </div>
  )
}
