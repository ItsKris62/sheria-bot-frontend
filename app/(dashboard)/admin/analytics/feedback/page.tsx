"use client"

import { useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { trpc } from "@/lib/trpc"

type FeedbackRange = "last7d" | "last30d" | "last90d"

type FeedbackRow = {
  queryId: string
  userId: string
  userEmail: string
  orgName: string | null
  rating: "up" | "down"
  createdAt: string
}

type FeedbackData = {
  aggregate: { totalVotes: number; upVotes: number; downVotes: number; upPct: number }
  rows: FeedbackRow[]
  pagination: { page: number; pageSize: number; totalRows: number; totalPages: number }
}

const PAGE_SIZE = 20

const RANGE_OPTIONS: Array<{ value: FeedbackRange; label: string }> = [
  { value: "last7d", label: "Last 7 days" },
  { value: "last30d", label: "Last 30 days" },
  { value: "last90d", label: "Last 90 days" },
]

export default function FeedbackPage() {
  const [range, setRange] = useState<FeedbackRange>("last30d")
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [range])

  const { data: rawData, isLoading, isError, refetch } = trpc.analytics.getFeedbackSummary.useQuery(
    { range, page, pageSize: PAGE_SIZE },
  )
  const data = rawData as FeedbackData | undefined

  const aggregate = data?.aggregate
  const rows = data?.rows ?? []
  const totalRows = data?.pagination.totalRows ?? 0
  const totalPages = data?.pagination.totalPages ?? 1
  const rangeFrom = totalRows === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeTo = Math.min(page * PAGE_SIZE, totalRows)

  const satisfactionClass =
    !aggregate || aggregate.totalVotes === 0
      ? "text-muted-foreground"
      : aggregate.upPct >= 70
        ? "text-primary"
        : aggregate.upPct >= 40
          ? "text-warning"
          : "text-destructive"

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <ThumbsUp className="h-6 w-6 text-primary" />
            Response Feedback
          </h1>
          <p className="mt-1 text-muted-foreground">
            User thumbs up / down on compliance query responses
          </p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as FeedbackRange)}>
          <SelectTrigger className="h-9 w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aggregate stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-green-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Total Votes</p>
                {isLoading
                  ? <Skeleton className="mt-2 h-8 w-24" />
                  : <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{aggregate?.totalVotes.toLocaleString() ?? "0"}</p>
                }
              </div>
              <div className="rounded-lg p-2 bg-primary/20">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-green-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Thumbs Up</p>
                {isLoading
                  ? <Skeleton className="mt-2 h-8 w-24" />
                  : <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{aggregate?.upVotes.toLocaleString() ?? "0"}</p>
                }
              </div>
              <div className="rounded-lg p-2 bg-primary/20">
                <ThumbsUp className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-green-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Thumbs Down</p>
                {isLoading
                  ? <Skeleton className="mt-2 h-8 w-24" />
                  : <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{aggregate?.downVotes.toLocaleString() ?? "0"}</p>
                }
              </div>
              <div className="rounded-lg p-2 bg-destructive/20">
                <ThumbsDown className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-green-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Satisfaction</p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-8 w-24" />
                ) : (
                  <>
                    <p className={`mt-1 text-2xl font-bold tabular-nums ${satisfactionClass}`}>
                      {aggregate && aggregate.totalVotes > 0 ? `${aggregate.upPct}%` : "--"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {aggregate && aggregate.totalVotes > 0 ? "of total votes" : "no votes yet"}
                    </p>
                  </>
                )}
              </div>
              <div className="rounded-lg p-2 bg-primary/20">
                <ThumbsUp className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Feedback</CardTitle>
          <CardDescription>User votes on compliance query responses, most recent first.</CardDescription>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <p className="text-sm">Failed to load feedback data.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                          No feedback in selected range
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row) => (
                        <TableRow key={`${row.queryId}-${row.userId}`}>
                          <TableCell className="font-medium">
                            {row.userEmail || (
                              <span className="text-muted-foreground">unknown</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {row.orgName ?? (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {row.rating === "up" ? (
                              <Badge className="bg-primary/10 text-primary gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                Up
                              </Badge>
                            ) : (
                              <Badge className="bg-destructive/10 text-destructive gap-1">
                                <ThumbsDown className="h-3 w-3" />
                                Down
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(row.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalRows > 0 && (
                <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {rangeFrom}--{rangeTo} of {totalRows.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((c) => Math.max(1, c - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
