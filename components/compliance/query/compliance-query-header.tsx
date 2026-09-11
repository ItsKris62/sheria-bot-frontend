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

      <div className="flex items-center gap-2.5 self-start sm:self-auto rounded-full border border-green-500/30 bg-green-500/10 px-3.5 py-1.5 text-xs sm:text-sm text-green-400 transition-all duration-150 hover:border-green-500/50 hover:bg-green-500/15 shadow-xs">
        <span className="font-semibold text-green-400">Verified Legal Corpus</span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground text-xs sm:text-sm">Kenya, Rwanda, Malawi</span>
      </div>
    </div>
  )
}
