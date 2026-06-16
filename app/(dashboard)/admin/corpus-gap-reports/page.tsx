"use client"

import { useState } from "react"
import { AlertCircle, ChevronLeft, ChevronRight, FileQuestion, Loader2, Pencil, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { getErrorMessage, trpc } from "@/lib/trpc"

type CorpusGapReportStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "INGESTED"
  | "REJECTED"
  | "DUPLICATE"

type CorpusGapJurisdiction =
  | "KENYA"
  | "MALAWI"
  | "NIGERIA"
  | "RWANDA"
  | "OTHER"

type CorpusGapDocumentType =
  | "LEGISLATION"
  | "REGULATION"
  | "CIRCULAR"
  | "GUIDELINE"
  | "POLICY"
  | "STANDARD"
  | "OTHER"

type SelectFilter<TValue extends string> = TValue | "all"

type AdminReport = {
  id: string
  documentName: string
  issuingAuthority: string
  jurisdiction: CorpusGapJurisdiction
  documentType: CorpusGapDocumentType
  status: CorpusGapReportStatus
  adminNotes: string | null
  createdAt: Date | string
  resolvedAt: Date | string | null
  reportedByUser: {
    email: string
  }
  organization: {
    name: string
  }
}

type StatusMeta = {
  label: string
  className: string
}

const PAGE_SIZE = 20

const STATUS_OPTIONS: Array<{ value: CorpusGapReportStatus; label: string }> = [
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "INGESTED", label: "Ingested" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DUPLICATE", label: "Duplicate" },
]

const JURISDICTION_OPTIONS: Array<{ value: CorpusGapJurisdiction; label: string }> = [
  { value: "KENYA", label: "Kenya" },
  { value: "MALAWI", label: "Malawi" },
  { value: "NIGERIA", label: "Nigeria" },
  { value: "RWANDA", label: "Rwanda" },
  { value: "OTHER", label: "Other" },
]

const DOCUMENT_TYPE_OPTIONS: Array<{ value: CorpusGapDocumentType; label: string }> = [
  { value: "LEGISLATION", label: "Legislation" },
  { value: "REGULATION", label: "Regulation" },
  { value: "CIRCULAR", label: "Circular" },
  { value: "GUIDELINE", label: "Guideline" },
  { value: "POLICY", label: "Policy" },
  { value: "STANDARD", label: "Standard" },
  { value: "OTHER", label: "Other" },
]

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

function formatDate(value: Date | string | null): string {
  if (!value) return "-"

  return new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function labelFromValue(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}

function StatusBadge({ status }: { status: CorpusGapReportStatus }) {
  const meta = STATUS_META[status]

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", meta.className)}>
      {meta.label}
    </Badge>
  )
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 11 }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full max-w-36" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export default function AdminCorpusGapReportsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<SelectFilter<CorpusGapReportStatus>>("all")
  const [jurisdictionFilter, setJurisdictionFilter] = useState<SelectFilter<CorpusGapJurisdiction>>("all")
  const [documentTypeFilter, setDocumentTypeFilter] = useState<SelectFilter<CorpusGapDocumentType>>("all")
  const [updateTarget, setUpdateTarget] = useState<AdminReport | null>(null)
  const [updateStatus, setUpdateStatus] = useState<CorpusGapReportStatus>("PENDING")
  const [adminNotes, setAdminNotes] = useState("")

  const utils = trpc.useUtils()

  const reportsQuery = trpc.corpusGapReport.adminListReports.useQuery({
    page,
    limit: PAGE_SIZE,
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(jurisdictionFilter !== "all" ? { jurisdiction: jurisdictionFilter } : {}),
    ...(documentTypeFilter !== "all" ? { documentType: documentTypeFilter } : {}),
  })

  const updateStatusMutation = trpc.corpusGapReport.adminUpdateStatus.useMutation({
    onSuccess: () => {
      toast.success("Corpus gap report updated")
      setUpdateTarget(null)
      void utils.corpusGapReport.adminListReports.invalidate()
    },
    onError: (error) => {
      toast.error("Update failed", { description: getErrorMessage(error) })
    },
  })

  const reports: AdminReport[] = (reportsQuery.data?.reports ?? []).map((report) => ({
    id: report.id,
    documentName: report.documentName,
    issuingAuthority: report.issuingAuthority,
    jurisdiction: report.jurisdiction,
    documentType: report.documentType,
    status: report.status,
    adminNotes: report.adminNotes,
    createdAt: report.createdAt,
    resolvedAt: report.resolvedAt,
    reportedByUser: {
      email: report.reportedByUser.email,
    },
    organization: {
      name: report.organization.name,
    },
  }))
  const pagination = reportsQuery.data?.pagination
  const totalPages = pagination?.pages ?? 1
  const hasReports = reports.length > 0

  function resetFilters() {
    setStatusFilter("all")
    setJurisdictionFilter("all")
    setDocumentTypeFilter("all")
    setPage(1)
  }

  function openUpdateDialog(report: AdminReport) {
    setUpdateTarget(report)
    setUpdateStatus(report.status)
    setAdminNotes(report.adminNotes ?? "")
  }

  function submitStatusUpdate() {
    if (!updateTarget) return

    updateStatusMutation.mutate({
      reportId: updateTarget.id,
      status: updateStatus,
      adminNotes: adminNotes.trim() || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Corpus Gap Reports</h1>
          <p className="mt-1 text-muted-foreground">Review missing corpus document reports across organizations.</p>
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

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                Reports
              </CardTitle>
              <CardDescription>
                {reportsQuery.isLoading ? "Loading reports..." : `${pagination?.total ?? 0} reports`}
              </CardDescription>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as SelectFilter<CorpusGapReportStatus>)
                  setPage(1)
                }}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={jurisdictionFilter}
                onValueChange={(value) => {
                  setJurisdictionFilter(value as SelectFilter<CorpusGapJurisdiction>)
                  setPage(1)
                }}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Jurisdictions</SelectItem>
                    {JURISDICTION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={documentTypeFilter}
                onValueChange={(value) => {
                  setDocumentTypeFilter(value as SelectFilter<CorpusGapDocumentType>)
                  setPage(1)
                }}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Document Types</SelectItem>
                    {DOCUMENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
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
                    <TableHead>Issuing Authority</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reporter Email</TableHead>
                    <TableHead>Organization Name</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Resolved Date</TableHead>
                    <TableHead>Admin Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsQuery.isLoading ? (
                    <LoadingRows />
                  ) : hasReports ? (
                    reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="min-w-52 font-medium text-foreground">
                          {report.documentName}
                        </TableCell>
                        <TableCell className="min-w-40">{report.issuingAuthority}</TableCell>
                        <TableCell>{labelFromValue(report.jurisdiction)}</TableCell>
                        <TableCell>{labelFromValue(report.documentType)}</TableCell>
                        <TableCell>
                          <StatusBadge status={report.status} />
                        </TableCell>
                        <TableCell className="min-w-48">{report.reportedByUser.email}</TableCell>
                        <TableCell className="min-w-44">{report.organization.name}</TableCell>
                        <TableCell>{formatDate(report.createdAt)}</TableCell>
                        <TableCell>{formatDate(report.resolvedAt)}</TableCell>
                        <TableCell className="max-w-64">
                          <span className="line-clamp-2 text-sm text-muted-foreground">
                            {report.adminNotes || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdateDialog(report)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11}>
                        <div className="flex min-h-44 flex-col items-center justify-center gap-3 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                            <FileQuestion className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-foreground">No corpus gap reports found</p>
                            <p className="max-w-sm text-sm text-muted-foreground">
                              New user submissions will appear here for admin review.
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
                    Page {pagination.page} of {totalPages} - {pagination.total} reports
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page <= 1 || reportsQuery.isFetching}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page >= totalPages || reportsQuery.isFetching}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={updateTarget !== null} onOpenChange={(open) => { if (!open) setUpdateTarget(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              {updateTarget ? updateTarget.documentName : "Corpus gap report"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="corpus-gap-report-status">Status</Label>
              <Select
                value={updateStatus}
                onValueChange={(value) => setUpdateStatus(value as CorpusGapReportStatus)}
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger id="corpus-gap-report-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="corpus-gap-admin-notes">Admin Notes</Label>
              <Textarea
                id="corpus-gap-admin-notes"
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                disabled={updateStatusMutation.isPending}
                maxLength={2000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setUpdateTarget(null)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitStatusUpdate}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
