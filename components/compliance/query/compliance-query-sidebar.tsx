import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen } from "lucide-react"
import { ComplianceQueryHistory, type HistoryItem } from "./compliance-query-history"
import type { SuggestionItem, SuggestionSource } from "./compliance-query-types"

export interface ComplianceQuerySidebarProps {
  suggestions: SuggestionItem[]
  suggestedQueriesLoading: boolean
  suggestedQueriesError: boolean
  onRetrySuggestions: () => void
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
  suggestions,
  suggestedQueriesLoading,
  suggestedQueriesError,
  onRetrySuggestions,
  onSuggestionSelect,
  historyQueries,
  showAllQueries,
  onShowAllQueriesChange,
}: ComplianceQuerySidebarProps) {
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
          <CardTitle className="text-base font-semibold text-foreground">Suggested Queries</CardTitle>
          <CardDescription className="text-xs">Personalised compliance questions</CardDescription>
        </CardHeader>
        <CardContent>
          {suggestedQueriesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 w-full animate-pulse rounded-xl bg-muted/40"
                />
              ))}
            </div>
          ) : suggestedQueriesError ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
              <p className="text-xs text-muted-foreground">
                Could not load suggestions
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-border/60 hover:bg-muted transition-colors duration-150"
                onClick={onRetrySuggestions}
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSuggestionSelect(s.text, s.id, "sidebar")}
                  className="group flex w-full items-start gap-2.5 rounded-xl border border-border/50 bg-background/50 p-3 text-left transition-all duration-150 hover:border-green-500/30 hover:bg-muted/40 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                >
                  <Search className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground group-hover:text-green-400 transition-colors" />
                  <span className="line-clamp-2 text-xs font-medium text-foreground group-hover:text-green-300 transition-colors leading-relaxed">
                    {s.text}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Legal Corpus Coverage Info */}
      <Card className="border-border/60 bg-card/90 shadow-xs transition-all duration-200 hover:border-border/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-green-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Legal Corpus Coverage</p>
              <p className="text-[10px] text-muted-foreground">Kenyan Fintech Legislation</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground/90 leading-relaxed">
            Our AI is trained on CBK guidelines, Data Protection Act, National Payment System Act,
            and other published regulatory frameworks.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
