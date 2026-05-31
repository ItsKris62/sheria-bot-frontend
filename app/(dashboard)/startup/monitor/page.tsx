"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/lib/trpc"
import { AlertTriangle, Bell, CheckCircle2, Clock, ExternalLink, FileText, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type AlertItem = {
  id: string
  title: string
  summary: string
  sourceUrl: string | null
  regulatoryBody: string
  category: string
  severity: string
  publishedAt: Date | string | null
  isRead: boolean
  notificationId: string | null
}

const severityClasses: Record<string, string> = {
  CRITICAL: "bg-destructive/10 text-destructive",
  HIGH: "bg-destructive/10 text-destructive",
  MEDIUM: "bg-warning/10 text-warning",
  LOW: "bg-muted text-muted-foreground",
}

export default function MonitorPage() {
  const utils = trpc.useUtils()
  const { data, isLoading, isError, refetch, isFetching } = trpc.alert.getAlerts.useQuery({
    page: 1,
    limit: 25,
  })
  const markAllMutation = trpc.alert.markAllAsRead.useMutation({
    onSuccess: () => {
      void utils.alert.getAlerts.invalidate()
      void utils.alert.getUnreadCount.invalidate()
    },
  })

  const alerts: AlertItem[] = Array.isArray(data?.alerts) ? (data.alerts as AlertItem[]) : []
  const unreadCount = alerts.filter((item) => !item.isRead).length
  const highImpactCount = alerts.filter((item) => item.severity === "HIGH" || item.severity === "CRITICAL").length
  const categories = new Set(alerts.map((item) => item.category).filter(Boolean))
  const bodies = new Set(alerts.map((item) => item.regulatoryBody).filter(Boolean))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regulatory Monitor</h1>
          <p className="text-muted-foreground mt-1">Live regulatory alerts published to your workspace</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {unreadCount > 0 ? (
            <Button variant="outline" onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Updates</p>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Impact</p>
                <p className="text-2xl font-bold text-foreground">{highImpactCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-foreground">{categories.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Regulators</p>
                <p className="text-2xl font-bold text-foreground">{bodies.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Latest regulatory changes and announcements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
            </>
          ) : isError ? (
            <div className="py-12 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-destructive/60" />
              <p className="mt-3 text-sm text-muted-foreground">Could not load regulatory alerts.</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">No active alerts in your current plan window.</p>
            </div>
          ) : alerts.map((alert) => (
            <Link
              key={alert.id}
              href={alert.sourceUrl || `/dashboard/alerts/${alert.id}`}
              target={alert.sourceUrl ? "_blank" : undefined}
              className={`block rounded-lg p-4 transition-colors hover:bg-muted/50 ${
                alert.isRead ? "bg-muted/30" : "border-l-4 border-l-primary bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {!alert.isRead ? <div className="h-2 w-2 rounded-full bg-primary" /> : null}
                    <h3 className="font-medium text-foreground">{alert.title}</h3>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{alert.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{alert.regulatoryBody}</span>
                    {alert.publishedAt ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(alert.publishedAt), { addSuffix: true })}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={severityClasses[alert.severity] ?? severityClasses.LOW}>
                    {alert.severity.toLowerCase()} impact
                  </Badge>
                  <Badge variant="outline">{alert.category.replace(/_/g, " ")}</Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                Read Full Update <ExternalLink className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
