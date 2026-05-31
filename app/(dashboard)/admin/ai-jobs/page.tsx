"use client"

import { useState } from "react"
import { Activity, AlertTriangle, CheckCircle2, Clock, Loader2, RefreshCw, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/lib/trpc"

const statuses = ["all", "QUEUED", "RUNNING", "RETRYING", "COMPLETED", "DEAD_LETTERED"] as const
type StatusFilter = (typeof statuses)[number]

type AiJobEvent = {
  type: string
  message: string | null
  progress: number | null
  createdAt: string | Date
}

type AiJob = {
  id: string
  type: string
  status: string
  targetEntityType: string
  targetEntityId: string
  progress: number
  attempts: number
  maxAttempts: number
  lastError: string | null
  updatedAt: string | Date
  events: AiJobEvent[]
}

function statusClass(status: string) {
  if (status === "COMPLETED") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
  if (status === "RUNNING") return "bg-blue-500/10 text-blue-700 border-blue-500/20"
  if (status === "RETRYING") return "bg-amber-500/10 text-amber-700 border-amber-500/20"
  if (status === "DEAD_LETTERED") return "bg-destructive/10 text-destructive border-destructive/20"
  return "bg-muted text-muted-foreground border-border"
}

function statusIcon(status: string) {
  if (status === "COMPLETED") return CheckCircle2
  if (status === "RUNNING") return Loader2
  if (status === "RETRYING") return RotateCcw
  if (status === "DEAD_LETTERED") return AlertTriangle
  return Clock
}

function fmtDate(value: string | Date | null | undefined) {
  if (!value) return "-"
  return new Date(value).toLocaleString()
}

export default function AdminAIJobsPage() {
  const [status, setStatus] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)
  const limit = 25

  const jobsQuery = trpc.admin.listAIJobs.useQuery(
    {
      status: status === "all" ? undefined : status,
      page,
      limit,
    },
    {
      refetchInterval: status === "COMPLETED" ? false : 5000,
    }
  )

  const jobs: AiJob[] = jobsQuery.data?.jobs ?? []
  const pagination = jobsQuery.data?.pagination

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Durable generation queue status and recent progress events</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(value) => { setStatus(value as StatusFilter); setPage(1) }}>
            <SelectTrigger className="h-9 w-44 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "all" ? "All statuses" : item.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => void jobsQuery.refetch()} disabled={jobsQuery.isFetching}>
            <RefreshCw className={jobsQuery.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            <span className="sr-only">Refresh jobs</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["RUNNING", "RETRYING", "DEAD_LETTERED", "COMPLETED"].map((item) => {
          const count = jobs.filter((job) => job.status === item).length
          const Icon = statusIcon(item)
          return (
            <Card key={item} className="border-border/50 bg-card/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">{item.replace("_", " ")}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{count}</p>
                </div>
                <Icon className={item === "RUNNING" ? "h-5 w-5 animate-spin text-blue-600" : "h-5 w-5 text-muted-foreground"} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobsQuery.isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-border/50 p-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No AI jobs match this filter.
            </div>
          ) : (
            jobs.map((job) => {
              const Icon = statusIcon(job.status)
              return (
                <div key={job.id} className="rounded-lg border border-border/50 bg-background/40 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={statusClass(job.status)}>
                          <Icon className={job.status === "RUNNING" ? "mr-1 h-3 w-3 animate-spin" : "mr-1 h-3 w-3"} />
                          {job.status.replace("_", " ")}
                        </Badge>
                        <span className="text-sm font-semibold text-foreground">{job.type.replace(/_/g, " ")}</span>
                      </div>
                      <p className="break-all text-xs text-muted-foreground">
                        {job.targetEntityType} · {job.targetEntityId}
                      </p>
                      {job.lastError && (
                        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{job.lastError}</p>
                      )}
                    </div>
                    <div className="grid min-w-56 grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Progress</span><span className="text-right font-medium text-foreground">{job.progress}%</span>
                      <span>Attempts</span><span className="text-right font-medium text-foreground">{job.attempts}/{job.maxAttempts}</span>
                      <span>Updated</span><span className="text-right font-medium text-foreground">{fmtDate(job.updatedAt)}</span>
                    </div>
                  </div>
                  {job.events.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
                      {job.events.map((event) => (
                        <div key={`${job.id}-${event.type}-${event.createdAt}`} className="flex items-start justify-between gap-3 text-xs">
                          <span className="text-muted-foreground">{event.type}: {event.message ?? "No message"}</span>
                          <span className="shrink-0 text-muted-foreground">{fmtDate(event.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.pages}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
