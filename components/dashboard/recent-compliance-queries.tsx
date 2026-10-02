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

export function RecentComplianceQueries({
  queries = [],
  isLoading,
  isError,
}: RecentComplianceQueriesProps) {
  const [showAllQueries, setShowAllQueries] = React.useState(false)

  return (
    <>
      <PortalSurface variant="raised" className="p-6">
        <PortalSectionHeader
          title="Recent Queries"
          description="Your recent compliance research and answers"
          icon={Clock}
          action={
            <div className="flex items-center gap-1.5">
              {queries.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllQueries(true)}
                  className="text-xs text-[var(--portal-text-secondary,#53615A)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] hover:text-[var(--portal-text-primary,#101814)] transition-colors"
                >
                  View all
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs font-medium text-[var(--portal-accent,#0A5C36)] hover:bg-[var(--portal-accent-muted,#E8F5EE)] hover:text-[var(--portal-accent,#0A5C36)] transition-colors"
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
              <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
              <p className="text-sm text-[var(--portal-text-secondary,#53615A)]">
                Could not load recent compliance queries.
              </p>
            </div>
          ) : queries.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-[var(--portal-text-muted,#64766D)]">
                No queries yet. Ask your first question!
              </p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] text-[var(--portal-text-primary,#101814)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] transition-colors"
              >
                <Link href="/startup/compliance-query">Ask Compliance Question</Link>
              </Button>
            </div>
          ) : (
            queries.map((item) => (
              <Link
                key={item.id}
                href={`/startup/compliance-query/${item.id}`}
                className="group flex items-center justify-between gap-3.5 rounded-lg border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface,#FFFFFF)] p-3.5 transition-colors hover:border-[var(--portal-border-strong,#B8C7C0)] hover:bg-[var(--portal-surface-hover,#F0F4F2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-focus,#0A5C36)]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--portal-border,#E2E8E5)] bg-[var(--portal-surface-hover,#F0F4F2)] text-[var(--portal-accent,#0A5C36)]">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--portal-text-primary,#101814)] group-hover:text-[var(--portal-accent,#0A5C36)]">
                      {item.query}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-[var(--portal-text-muted,#64766D)]">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <ArrowRight
                  className="h-4 w-4 shrink-0 text-[var(--portal-text-muted,#64766D)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--portal-accent,#0A5C36)]"
                  aria-hidden="true"
                />
              </Link>
            ))
          )}
        </div>
      </PortalSurface>

      <AllQueriesDialog open={showAllQueries} onOpenChange={setShowAllQueries} />
    </>
  )
}
