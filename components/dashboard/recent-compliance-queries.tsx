import * as React from "react"
import Link from "next/link"
import { PortalSurface, PortalSectionHeader, PortalSkeleton } from "@/components/portal"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, AlertCircle, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AllQueriesDialog } from "@/components/compliance/all-queries-dialog"
import type { QueryItem } from "./dashboard-types"

export interface RecentComplianceQueriesProps {
  queries?: QueryItem[]
  isLoading?: boolean
  isError?: boolean
}

export function RecentComplianceQueries({ queries = [], isLoading, isError }: RecentComplianceQueriesProps) {
  const [showAllQueries, setShowAllQueries] = React.useState(false)

  return (
    <>
      <PortalSurface variant="raised" className="p-6">
        <PortalSectionHeader
          title="Recent Queries"
          description="Your recent compliance questions"
          icon={Clock}
          action={
            <div className="flex items-center gap-1">
              {queries.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllQueries(true)}
                  className="text-xs text-[var(--portal-text-secondary)] hover:text-white"
                >
                  View all
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs text-[var(--portal-accent)] hover:text-[var(--portal-accent)]/80"
              >
                <Link href="/startup/compliance-query">
                  <Plus className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  New query
                </Link>
              </Button>
            </div>
          }
        />

        <div className="mt-4 space-y-3">
          {isLoading ? (
            <>
              <PortalSkeleton variant="card" className="h-16" />
              <PortalSkeleton variant="card" className="h-16" />
              <PortalSkeleton variant="card" className="h-16" />
            </>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <AlertCircle className="h-6 w-6 text-red-400" aria-hidden="true" />
              <p className="text-sm text-[var(--portal-text-secondary)]">Could not load recent compliance queries.</p>
            </div>
          ) : queries.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-[var(--portal-text-muted)]">No queries yet. Ask your first question!</p>
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href="/startup/compliance-query">Ask Compliance Question</Link>
              </Button>
            </div>
          ) : (
            queries.map((item) => (
              <Link
                key={item.id}
                href={`/startup/compliance-query/${item.id}`}
                className="flex items-center gap-3.5 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-surface-solid)] p-3.5 transition-colors hover:border-[var(--portal-border-strong)] hover:bg-[var(--portal-surface-hover)]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--portal-accent-muted)] text-[var(--portal-accent)]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--portal-text-primary)] truncate">
                    {item.query}
                  </p>
                  <p className="text-[11px] text-[var(--portal-text-muted)] mt-0.5">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--portal-text-muted)]" aria-hidden="true" />
              </Link>
            ))
          )}
        </div>
      </PortalSurface>

      <AllQueriesDialog open={showAllQueries} onOpenChange={setShowAllQueries} />
    </>
  )
}
