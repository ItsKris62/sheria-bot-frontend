import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DEFAULT_JURISDICTION,
  jurisdictionLabel,
  type JurisdictionCode,
} from "@/lib/jurisdictions"

export function JurisdictionBadge({
  code,
  showLabel = false,
  legacy = false,
  className,
}: {
  code: JurisdictionCode | string | null | undefined
  showLabel?: boolean
  legacy?: boolean
  className?: string
}) {
  const resolvedCode = code === "RW" || code === "MW" || code === "NG" || code === "KE"
    ? code
    : legacy
      ? DEFAULT_JURISDICTION
      : null
  const label = resolvedCode ? jurisdictionLabel(resolvedCode) : "Unknown jurisdiction"

  return (
    <Badge
      variant="outline"
      aria-label={legacy ? `${label}, legacy default jurisdiction` : `${label} jurisdiction`}
      className={cn(
        "gap-1.5 border-green-500/30 bg-green-500/10 font-mono text-[10px] text-green-400",
        className,
      )}
    >
      <span aria-hidden="true">{resolvedCode ?? "UNK"}</span>
      {showLabel || !resolvedCode ? <span className="font-sans normal-case text-foreground">{label}</span> : null}
      {legacy ? <span className="font-sans normal-case text-muted-foreground">Legacy default</span> : null}
    </Badge>
  )
}
