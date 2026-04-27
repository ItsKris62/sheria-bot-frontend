"use client"

import { use } from "react"
import Link from "next/link"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ChevronLeft, ExternalLink, Calendar, Building2, Megaphone } from "lucide-react"

type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

const SEVERITY_CONFIG: Record<AlertSeverity, { pillCls: string; barCls: string; label: string }> = {
  CRITICAL: { pillCls: "bg-red-500/10 text-red-600 border border-red-500/20",    barCls: "bg-red-500",    label: "Critical - immediate action required" },
  HIGH:     { pillCls: "bg-orange-500/10 text-orange-600 border border-orange-500/20", barCls: "bg-orange-500", label: "High priority regulatory update" },
  MEDIUM:   { pillCls: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20", barCls: "bg-yellow-500", label: "Regulatory update" },
  LOW:      { pillCls: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20", barCls: "bg-emerald-500", label: "Informational update" },
}

interface AlertDetail {
  id: string
  title: string
  summary: string
  body: string
  regulatoryBody: string
  severity: string
  publishedAt: string | Date
  effectiveDate: string | Date | null
  sourceUrl: string | null
  isRead: boolean
}

function formatDate(d: string | Date | null): string {
  if (!d) return ""
  return new Date(d).toLocaleDateString("en-KE", {
    year: "numeric", month: "long", day: "numeric",
  })
}

export default function AlertDetailPage({ params }: { params: Promise<{ alertId: string }> }) {
  const { alertId } = use(params)

  const { data, isLoading, error } = trpc.alert.getById.useQuery({ alertId })
  const alert = data as AlertDetail | undefined

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading alert...
      </div>
    )
  }

  if (error || !alert) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Alert not found</p>
        <Button variant="ghost" size="sm" className="mt-4" asChild>
          <Link href="/dashboard/alerts">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to alerts
          </Link>
        </Button>
      </div>
    )
  }

  const sev = (alert.severity ?? "MEDIUM") as AlertSeverity
  const cfg = SEVERITY_CONFIG[sev] ?? SEVERITY_CONFIG.MEDIUM

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back nav */}
      <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
        <Link href="/dashboard/alerts">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to alerts
        </Link>
      </Button>

      <Card>
        {/* Severity colour bar */}
        <div className={`h-1 w-full rounded-t-xl ${cfg.barCls}`} />

        <CardContent className="p-6 space-y-5">
          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${cfg.pillCls}`}>
              {sev}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Building2 className="h-3 w-3" />
              {alert.regulatoryBody}
            </span>
            <span className="ml-auto text-xs text-muted-foreground">
              Published {formatDate(alert.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-foreground leading-snug">{alert.title}</h1>

          {/* Severity descriptor */}
          <p className="text-sm text-muted-foreground italic">{cfg.label}</p>

          {/* Effective date */}
          {alert.effectiveDate && (
            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Effective date: {formatDate(alert.effectiveDate)}
            </div>
          )}

          <Separator />

          {/* Summary */}
          <div>
            <Badge variant="outline" className="mb-2 text-xs">Summary</Badge>
            <p className="text-sm text-foreground leading-relaxed">{alert.summary}</p>
          </div>

          <Separator />

          {/* Full body */}
          <div>
            <Badge variant="outline" className="mb-2 text-xs">Full Details</Badge>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {alert.body}
            </p>
          </div>

          {/* Source link */}
          {alert.sourceUrl && (
            <>
              <Separator />
              <div>
                <a
                  href={alert.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View original source
                </a>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
