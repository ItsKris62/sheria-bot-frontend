"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AUDITED_JURISDICTIONS, jurisdictionLabel } from "@/lib/jurisdictions"

export interface JurisdictionSelectorProps {
  selectedJurisdiction: string | null
  homeJurisdiction: string | null
  enabledJurisdictions: string[]
  onSelectJurisdiction: (code: string) => void
  disabled?: boolean
}

export function JurisdictionSelector({
  selectedJurisdiction,
  homeJurisdiction,
  enabledJurisdictions,
  onSelectJurisdiction,
  disabled = false,
}: JurisdictionSelectorProps) {
  // Compute all available jurisdictions for this organization
  const availableCodes = React.useMemo(() => {
    const set = new Set<string>()
    if (homeJurisdiction) set.add(homeJurisdiction.toUpperCase())
    for (const code of enabledJurisdictions) {
      set.add(code.toUpperCase())
    }
    return Array.from(set)
  }, [homeJurisdiction, enabledJurisdictions])

  const currentValue = selectedJurisdiction?.toUpperCase() ?? homeJurisdiction?.toUpperCase() ?? "KE"

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Globe className="size-3.5" />
        <span className="hidden sm:inline">Jurisdiction:</span>
      </div>

      <Select
        value={currentValue}
        onValueChange={(val) => onSelectJurisdiction(val)}
        disabled={disabled || availableCodes.length <= 1}
      >
        <SelectTrigger className="h-8 w-[140px] text-xs font-semibold bg-background">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent align="end">
          {availableCodes.map((code) => {
            const isHome = code === homeJurisdiction?.toUpperCase()
            const label = jurisdictionLabel(code)

            return (
              <SelectItem key={code} value={code} className="text-xs">
                <span className="font-medium">{label}</span>{" "}
                <span className="text-[10px] text-muted-foreground font-mono">({code})</span>
                {isHome && (
                  <span className="ml-1.5 rounded bg-primary/10 px-1 py-0.2 text-[9px] font-semibold text-primary">
                    Primary
                  </span>
                )}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
