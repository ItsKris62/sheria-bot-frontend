import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ChevronRight, History } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AllQueriesDialog } from "@/components/compliance/all-queries-dialog"

export interface HistoryItem {
  id: string
  query: string
  createdAt: string
}

export interface ComplianceQueryHistoryProps {
  queries?: HistoryItem[]
  showAllQueries: boolean
  onShowAllQueriesChange: (open: boolean) => void
}

export function ComplianceQueryHistory({
  queries,
  showAllQueries,
  onShowAllQueriesChange,
}: ComplianceQueryHistoryProps) {
  const hasQueries = queries && queries.length > 0

  return (
    <>
      <Card className="border-border/60 bg-card/90 shadow-xs transition-all duration-200 hover:border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <CardTitle className="text-base font-semibold text-foreground">Recent Queries</CardTitle>
          </div>
          <CardDescription className="text-xs">Your previous regulatory inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {hasQueries ? (
              <>
                {queries.map((item) => (
                  <Link
                    key={item.id}
                    href={`/startup/compliance-query/${item.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-all duration-150 hover:border-emerald-500/30 hover:bg-muted/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate group-hover:text-emerald-300 transition-colors">
                        {item.query}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-emerald-400 motion-safe:group-hover:translate-x-0.5 transition-all duration-150" />
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 mt-1 transition-colors duration-150"
                  onClick={() => onShowAllQueriesChange(true)}
                >
                  View all queries
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                No recent queries found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <AllQueriesDialog
        open={showAllQueries}
        onOpenChange={onShowAllQueriesChange}
      />
    </>
  )
}
