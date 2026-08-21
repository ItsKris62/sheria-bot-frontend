import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Sparkles } from "lucide-react"
import { ComplianceQueryHistory, type HistoryItem } from "./compliance-query-history"
import type { SuggestionSource } from "./compliance-query-types"
import { RegionalQuerySuggestions } from "./jurisdiction-context"
import { jurisdictionLabel, type QueryableJurisdictionCode } from "@/lib/jurisdictions"

export interface ComplianceQuerySidebarProps {
  selectedJurisdiction: QueryableJurisdictionCode
  onSuggestionSelect: (
    suggestionText: string,
    suggestionId?: string,
    surface?: SuggestionSource,
  ) => void
  historyQueries?: HistoryItem[]
  showAllQueries: boolean
  onShowAllQueriesChange: (open: boolean) => void
}

export function ComplianceQuerySidebar({
  selectedJurisdiction,
  onSuggestionSelect,
  historyQueries,
  showAllQueries,
  onShowAllQueriesChange,
}: ComplianceQuerySidebarProps) {
  const country = jurisdictionLabel(selectedJurisdiction)

  return (
    <div className="space-y-5">
      {/* 1. Recent Queries Rail */}
      <ComplianceQueryHistory
        queries={historyQueries}
        showAllQueries={showAllQueries}
        onShowAllQueriesChange={onShowAllQueriesChange}
      />

      {/* 2. Suggested Queries Rail */}
      <Card className="border-border/60 bg-card/90 shadow-xs transition-all duration-200 hover:border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <CardTitle className="text-base font-semibold text-foreground">Suggested for {country}</CardTitle>
          </div>
          <CardDescription className="text-xs">Curated compliance questions</CardDescription>
        </CardHeader>
        <CardContent>
          <RegionalQuerySuggestions
            jurisdiction={selectedJurisdiction}
            onSelect={(text, id) => onSuggestionSelect(text, id, "sidebar")}
          />
        </CardContent>
      </Card>

      {/* 3. Legal Corpus Coverage Info */}
      <Card className="border-border/60 bg-card/90 shadow-xs transition-all duration-200 hover:border-border/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Legal Corpus Coverage</p>
              <p className="text-[10px] text-muted-foreground">{country} regulatory material</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground/90 leading-relaxed">
            Answers are grounded in indexed regulatory material for the selected jurisdiction and
            cite sources when the evidence is strong enough.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
