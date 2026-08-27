import React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DEFAULT_JURISDICTION,
  isQueryableJurisdictionCode,
  jurisdictionLabel,
  type JurisdictionCapability,
  type JurisdictionCode,
  type QueryableJurisdictionCode,
} from "@/lib/jurisdictions"
import type { SuggestionItem } from "./compliance-query-types"

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
  const resolvedCode = (code === "RW" || code === "MW" || code === "NG" || code === "KE")
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
        "gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] text-emerald-300",
        className,
      )}
    >
      <span aria-hidden="true">{resolvedCode ?? "UNK"}</span>
      {showLabel || !resolvedCode ? <span className="font-sans normal-case text-foreground">{label}</span> : null}
      {legacy ? <span className="font-sans normal-case text-muted-foreground">Legacy default</span> : null}
    </Badge>
  )
}

import { MultiSelect, type Option } from "@/components/ui/multi-select"

export function JurisdictionContextBar({
  capabilities,
  selectedJurisdictions,
  disabled,
  comparisonAllowed = true,
  onJurisdictionChange,
}: {
  capabilities: JurisdictionCapability[]
  selectedJurisdictions: QueryableJurisdictionCode[]
  disabled?: boolean
  comparisonAllowed?: boolean
  onJurisdictionChange: (values: QueryableJurisdictionCode[]) => void
}) {
  const selectedLabels = selectedJurisdictions
    .map(code => capabilities.find(c => c.code === code)?.name ?? jurisdictionLabel(code))
    .join(", ");

  const options: Option[] = capabilities
    .filter(c => c.queryEnabled && c.corpusReady && isQueryableJurisdictionCode(c.code))
    .map(c => ({ label: c.name, value: c.code }));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Ask SheriaBot about {selectedLabels || "all"} law</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {comparisonAllowed
              ? "Select up to 4 jurisdictions to compare regulatory requirements."
              : "Your current plan is limited to one jurisdiction."}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 sm:w-[260px]">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Jurisdictions
        </label>
        <MultiSelect
          options={options}
          selected={selectedJurisdictions}
          disabled={disabled}
          placeholder="Select jurisdictions..."
          onChange={(values) => {
            const max = comparisonAllowed ? 4 : 1
            if (values.length <= max) {
              onJurisdictionChange(values as QueryableJurisdictionCode[])
            }
          }}
        />
        {disabled ? (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden="true" />
            {comparisonAllowed ? "Locked while SheriaBot is answering." : "Jurisdiction access is plan-limited."}
          </p>
        ) : null}
      </div>
    </div>
  )
}



const REGIONAL_SUGGESTIONS: Record<QueryableJurisdictionCode, SuggestionItem[]> = {
  KE: [
    { id: "regional-ke-licensing", text: "What licensing requirements apply to payment service providers in Kenya?", relatedArea: "Licensing" },
    { id: "regional-ke-data", text: "What data protection obligations apply to fintech companies in Kenya?", relatedArea: "Data Protection" },
    { id: "regional-ke-aml", text: "What AML and KYC requirements apply to Kenyan fintechs?", relatedArea: "AML / KYC" },
    { id: "regional-ke-cyber", text: "What cybersecurity obligations apply to payment service providers in Kenya?", relatedArea: "Cybersecurity" },
  ],
  RW: [
    { id: "regional-rw-licensing", text: "What licensing requirements apply to payment service providers in Rwanda?", relatedArea: "Licensing" },
    { id: "regional-rw-data", text: "What data protection obligations apply to fintech companies in Rwanda?", relatedArea: "Data Protection" },
    { id: "regional-rw-aml", text: "What AML and KYC requirements apply to financial technology businesses in Rwanda?", relatedArea: "AML / KYC" },
    { id: "regional-rw-cyber", text: "What cybersecurity obligations apply to payment service providers in Rwanda?", relatedArea: "Cybersecurity" },
  ],
  MW: [
    { id: "regional-mw-licensing", text: "What licensing requirements apply to payment service providers in Malawi?", relatedArea: "Licensing" },
    { id: "regional-mw-data", text: "What data protection obligations apply to fintech companies in Malawi?", relatedArea: "Data Protection" },
    { id: "regional-mw-aml", text: "What AML and KYC obligations apply to financial service providers in Malawi?", relatedArea: "AML / KYC" },
    { id: "regional-mw-cyber", text: "What cybersecurity requirements apply to regulated financial institutions in Malawi?", relatedArea: "Cybersecurity" },
  ],
}

export function getRegionalQuerySuggestions(jurisdiction: QueryableJurisdictionCode): SuggestionItem[] {
  return REGIONAL_SUGGESTIONS[jurisdiction]
}

export function RegionalQuerySuggestions({
  jurisdiction,
  onSelect,
  centered = false,
}: {
  jurisdiction: QueryableJurisdictionCode
  onSelect: (suggestionText: string, suggestionId: string) => void
  centered?: boolean
}) {
  const suggestions = getRegionalQuerySuggestions(jurisdiction)
  const label = jurisdictionLabel(jurisdiction)

  return (
    <div className="w-full">
      <p
        className={cn(
          "mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80",
          centered && "justify-center",
        )}
      >
        <Sparkles className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
        Suggested for {label}
      </p>
      <div className={cn("flex flex-wrap gap-2", centered && "justify-center")}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onSelect(suggestion.text, suggestion.id)}
            className="min-h-[40px] max-w-full rounded-full border border-border/70 bg-card/90 px-4 py-2 text-left text-xs font-medium text-foreground transition-all duration-150 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <span className="block truncate">{suggestion.relatedArea ?? suggestion.text}</span>
            <span className="sr-only">: {suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
