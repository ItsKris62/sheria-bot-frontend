"use client"

import { useState } from "react"
import { AlertCircle, FileQuestion, Loader2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getErrorMessage, trpc } from "@/lib/trpc"

type CorpusGapReportStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "INGESTED"
  | "REJECTED"
  | "DUPLICATE"

type StatusMeta = {
  label: string
  className: string
}

const PAGE_SIZE = 20

const STATUS_META: Record<CorpusGapReportStatus, StatusMeta> = {
  PENDING: {
    label: "Pending",
    className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  },
  UNDER_REVIEW: {
    label: "Under review",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  INGESTED: {
    label: "Ingested",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  DUPLICATE: {
    label: "Duplicate",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
}

function formatReportDate(value: Date | string | null): string {
  if (!value) return "-"

  return new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function StatusBadge({ status }: { status: CorpusGapReportStatus }) {
  const meta = STATUS_META[status]

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", meta.className)}>
      {meta.label}
    </Badge>
  )
}

function ReportsLoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-44" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function CorpusReportsSettingsPage() {
  const [page, setPage] = useState(1)

  const reportsQuery = trpc.corpusGapReport.listMyReports.useQuery({
    page,
    limit: PAGE_SIZE,
  })

  const reports = reportsQuery.data?.reports ?? []
  const pagination = reportsQuery.data?.pagination
  const pageCount = pagination?.pages ?? 1
  const hasReports = reports.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Corpus Reports</h1>
        <p className="mt-1 text-muted-foreground">Track missing document reports submitted by your organization.</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                My Reports
              </CardTitle>
              <CardDescription>Submitted corpus gap reports and review status</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void reportsQuery.refetch()}
              disabled={reportsQuery.isFetching}
            >
              {reportsQuery.isFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reportsQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>{getErrorMessage(reportsQuery.error)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void reportsQuery.refetch()}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-col gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Resolved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsQuery.isLoading ? (
                    <ReportsLoadingRows />
                  ) : hasReports ? (
                    reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium text-foreground">
                          {report.documentName}
                        </TableCell>
                        <TableCell>{report.jurisdiction.replace(/_/g, " ")}</TableCell>
                        <TableCell>
                          <StatusBadge status={report.status as CorpusGapReportStatus} />
                        </TableCell>
                        <TableCell>{formatReportDate(report.createdAt)}</TableCell>
                        <TableCell>{formatReportDate(report.resolvedAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                            <FileQuestion className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-foreground">No corpus reports yet</p>
                            <p className="max-w-sm text-sm text-muted-foreground">
                              Reports you submit from compliance sources or the sidebar will appear here.
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {pagination && pagination.total > PAGE_SIZE ? (
                <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pageCount}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page <= 1 || reportsQuery.isFetching}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                      disabled={page >= pageCount || reportsQuery.isFetching}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
