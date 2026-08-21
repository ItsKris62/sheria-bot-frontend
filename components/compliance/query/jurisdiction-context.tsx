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

export function JurisdictionSelector({
  capabilities,
  value,
  disabled,
  onChange,
}: {
  capabilities: JurisdictionCapability[]
  value: QueryableJurisdictionCode
  disabled?: boolean
  onChange: (value: QueryableJurisdictionCode) => void
}) {
  const selected = capabilities.find((item) => item.code === value)
  const enabledCapabilities = capabilities.filter((item) => item.queryEnabled)
  const disabledCapabilities = capabilities.filter((item) => !item.queryEnabled)
  const renderCapability = (item: JurisdictionCapability) => {
    const isDisabled = !item.queryEnabled
    const statusText = item.status === "COMING_SOON" ? "Coming Soon" : item.status === "DISABLED" ? "Unavailable" : null

    return (
      <SelectItem
        key={item.code}
        value={item.code}
        disabled={isDisabled}
        aria-label={statusText ? `${item.name}, ${statusText}` : item.name}
        className="min-h-[44px]"
      >
        <span className="flex w-full min-w-0 items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            <span className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px]">
              {item.code}
            </span>
            <span className="truncate">{item.name}</span>
          </span>
          {statusText ? (
            <span className="shrink-0 text-[10px] text-muted-foreground">{statusText}</span>
          ) : null}
        </span>
      </SelectItem>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Jurisdiction
      </label>
      <Select
        value={value}
        disabled={disabled || capabilities.length === 0}
        onValueChange={(nextValue) => {
          if (nextValue === "KE" || nextValue === "RW" || nextValue === "MW") {
            onChange(nextValue)
          }
        }}
      >
        <SelectTrigger
          aria-label="Select compliance query jurisdiction"
          className="min-h-[44px] w-full rounded-lg border-border/70 bg-background/85 px-3 shadow-[0_0_15px_rgba(16,185,129,0.04)] transition-all duration-150 focus:ring-emerald-500/40 sm:w-[260px]"
        >
          <SelectValue>
            <span className="flex min-w-0 items-center gap-2">
              <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                {value}
              </span>
              <span className="truncate">{selected?.name ?? jurisdictionLabel(value)}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[min(320px,calc(100vh-120px))] border-border/70 bg-popover/95">
          {enabledCapabilities.map(renderCapability)}
          {disabledCapabilities.length > 0 ? (
            <SelectSeparator className="bg-border/60" />
          ) : null}
          {disabledCapabilities.map(renderCapability)}
        </SelectContent>
      </Select>
      {disabled ? (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" aria-hidden="true" />
          Locked while SheriaBot is answering.
        </p>
      ) : null}
    </div>
  )
}

export function JurisdictionContextBar({
  capabilities,
  selectedJurisdiction,
  disabled,
  onJurisdictionChange,
}: {
  capabilities: JurisdictionCapability[]
  selectedJurisdiction: QueryableJurisdictionCode
  disabled?: boolean
  onJurisdictionChange: (value: QueryableJurisdictionCode) => void
}) {
  const selected = capabilities.find((item) => item.code === selectedJurisdiction)
  const label = selected?.name ?? jurisdictionLabel(selectedJurisdiction)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Ask SheriaBot about {label} law</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            New Compliance Query requests are scoped to one selected jurisdiction.
          </p>
        </div>
      </div>
      <JurisdictionSelector
        capabilities={capabilities}
        value={selectedJurisdiction}
        disabled={disabled}
        onChange={onJurisdictionChange}
      />
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
