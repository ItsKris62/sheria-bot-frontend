"use client"

import { useState } from "react"
import Link from "next/link"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Megaphone, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

// --- Types --------------------------------------------------------------------

type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
type RegulatoryBody = "CBK" | "CMA" | "ODPC" | "CA" | "GAZETTE"

interface AlertItem {
  id: string
  title: string
  summary: string
  regulatoryBody: string
  severity: string
  publishedAt: string | Date
  isRead: boolean
  notificationId: string | null
}

// --- Constants ----------------------------------------------------------------

const SEVERITY_CONFIG: Record<AlertSeverity, { pillCls: string; dotCls: string }> = {
  CRITICAL: { pillCls: "bg-red-500/10 text-red-600 border border-red-500/20",    dotCls: "bg-red-500" },
  HIGH:     { pillCls: "bg-orange-500/10 text-orange-600 border border-orange-500/20", dotCls: "bg-orange-500" },
  MEDIUM:   { pillCls: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20", dotCls: "bg-yellow-500" },
  LOW:      { pillCls: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20", dotCls: "bg-emerald-500" },
}

const REGULATORY_BODIES: RegulatoryBody[] = ["CBK", "CMA", "ODPC", "CA", "GAZETTE"]
const SEVERITIES: AlertSeverity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"]

function relativeTime(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// --- Page ---------------------------------------------------------------------

export default function AlertsPage() {
  const [page, setPage] = useState(1)
  const [severity, setSeverity] = useState<AlertSeverity | "ALL">("ALL")
  const [regulatoryBody, setRegulatoryBody] = useState<RegulatoryBody | "ALL">("ALL")
  const [unreadOnly, setUnreadOnly] = useState(false)

  const { data, isLoading, isFetching } = trpc.alert.getAlerts.useQuery({
    page,
    limit: 20,
    severity: severity === "ALL" ? undefined : severity,
    regulatoryBody: regulatoryBody === "ALL" ? undefined : regulatoryBody,
    unreadOnly: unreadOnly || undefined,
  })

  const alerts = ((data as { alerts?: unknown[] } | undefined)?.alerts ?? []) as AlertItem[]
  const total = (data as { total?: number } | undefined)?.total ?? 0
  const totalPages = (data as { totalPages?: number } | undefined)?.totalPages ?? 1

  function handleFilterChange() {
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regulatory Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay informed about the latest regulatory updates from CBK, CMA, ODPC, and other bodies.
          </p>
        </div>
        {total > 0 && (
          <Badge variant="secondary">{total} alerts</Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={regulatoryBody}
          onValueChange={(v) => { setRegulatoryBody(v as RegulatoryBody | "ALL"); handleFilterChange() }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All bodies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All bodies</SelectItem>
            {REGULATORY_BODIES.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={severity}
          onValueChange={(v) => { setSeverity(v as AlertSeverity | "ALL"); handleFilterChange() }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All severities</SelectItem>
            {SEVERITIES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={() => { setUnreadOnly(!unreadOnly); handleFilterChange() }}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] ${
            unreadOnly
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread only
        </button>
      </div>

      {/* Alert list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Megaphone className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No alerts found</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {unreadOnly ? "All caught up!" : "No regulatory alerts match your filters."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {isFetching && (
            <div className="flex justify-end">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {alerts.map((alert) => {
            const sev = (alert.severity ?? "MEDIUM") as AlertSeverity
            const cfg = SEVERITY_CONFIG[sev] ?? SEVERITY_CONFIG.MEDIUM
            return (
              <Link key={alert.id} href={`/dashboard/alerts/${alert.id}`}>
                <Card className={`transition-colors hover:bg-muted/40 cursor-pointer ${!alert.isRead ? "border-primary/30 bg-primary/5" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${cfg.pillCls}`}>
                            {sev}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                            {alert.regulatoryBody}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {relativeTime(alert.publishedAt)}
                          </span>
                        </div>
                        <p className={`text-sm font-medium leading-snug ${!alert.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                          {alert.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {alert.summary}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        {!alert.isRead && (
                          <span className={`h-2 w-2 rounded-full ${cfg.dotCls}`} />
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isFetching}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
