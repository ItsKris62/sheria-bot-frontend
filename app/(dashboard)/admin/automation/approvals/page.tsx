"use client"

/**
 * Admin Automation Approvals Page
 *
 * Lists AutomationApproval rows created by n8n workflows (content publish,
 * newsletter, sales outreach) awaiting a human decision. Approve/reject calls
 * agents.automation.recordApprovalDecision, which signs and POSTs the
 * decision back to n8n's callback URL - this page is the thing that was
 * missing to make that round-trip actually happen; without it, every
 * approval would sit 'pending' until n8n's 30-minute poll times out and
 * treats the timeout as a silent decline.
 */

import { useState } from "react"
import { toast } from "sonner"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ClipboardCheck,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

type ApprovalStatus = "pending" | "approved" | "rejected"

interface ApprovalRow {
  id: string
  department: string
  workflow: string
  kind: string
  summary: string
  metadata: Record<string, unknown> | null
  status: ApprovalStatus
  createdAt: string
  decidedBy: string | null
  decidedAt: string | null
  callbackError: string | null
  callbackDeliveredAt: string | null
}

const ALL_VALUE = "__all__"
const PAGE_SIZE = 20

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Compact "key: value, key: value" preview - never a raw JSON dump. */
function formatMetadataPreview(metadata: Record<string, unknown> | null): string {
  if (!metadata || Object.keys(metadata).length === 0) return "—"
  const parts = Object.entries(metadata).map(([key, value]) => `${key}: ${String(value)}`)
  const joined = parts.join(", ")
  return joined.length > 80 ? `${joined.slice(0, 77)}...` : joined
}

function formatMetadataFull(metadata: Record<string, unknown> | null): string {
  if (!metadata || Object.keys(metadata).length === 0) return "No metadata."
  return Object.entries(metadata).map(([key, value]) => `${key}: ${String(value)}`).join("\n")
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === "approved")
    return <Badge className="bg-emerald-500/10 text-emerald-600 border-0">Approved</Badge>
  if (status === "rejected")
    return <Badge className="bg-destructive/10 text-destructive border-0">Rejected</Badge>
  return (
    <Badge className="bg-amber-500/10 text-amber-600 border-0 gap-1">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  )
}

// ─── Row ────────────────────────────────────────────────────────────────────

function ApprovalRowActions({ row, onDecided }: { row: ApprovalRow; onDecided: () => void }) {
  const utils = trpc.useUtils()
  const [confirm, setConfirm] = useState<"approved" | "rejected" | null>(null)

  const decideMutation = trpc.agents.automation.recordApprovalDecision.useMutation({
    onSuccess: (result) => {
      toast.success(`Approval ${result.status}.`)
      setConfirm(null)
      void utils.agents.automation.listApprovals.invalidate()
      onDecided()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
      setConfirm(null)
    },
  })

  if (row.status !== "pending") {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-emerald-600 hover:text-emerald-600 border-emerald-600/30"
          disabled={decideMutation.isPending}
          onClick={() => setConfirm("approved")}
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-destructive hover:text-destructive"
          disabled={decideMutation.isPending}
          onClick={() => setConfirm("rejected")}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </Button>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "approved" ? "Approve this workflow?" : "Reject this workflow?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "approved"
                ? `This signs and sends an approval decision back to n8n for "${row.workflow}" (${row.kind}). Whatever action n8n takes next (publish, send, outreach) will proceed.`
                : `This signs and sends a rejection back to n8n for "${row.workflow}" (${row.kind}). n8n will not proceed with this action.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={decideMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={decideMutation.isPending}
              className={confirm === "rejected" ? "bg-destructive hover:bg-destructive/90" : ""}
              onClick={() => confirm && decideMutation.mutate({ approvalId: row.id, decision: confirm })}
            >
              {decideMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {confirm === "approved" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function ApprovalTableRow({ row, onDecided }: { row: ApprovalRow; onDecided: () => void }) {
  return (
    <tr className="hover:bg-muted/20 transition-colors align-top">
      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fmtDateTime(row.createdAt)}</td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="font-mono text-xs">{row.department}</Badge>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{row.workflow}</td>
      <td className="px-4 py-3 text-muted-foreground">{row.kind}</td>
      <td className="px-4 py-3 max-w-[280px]">
        <p className="truncate" title={row.summary}>{row.summary}</p>
      </td>
      <td className="px-4 py-3 max-w-[220px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="truncate text-xs text-muted-foreground font-mono cursor-default">
              {formatMetadataPreview(row.metadata)}
            </p>
          </TooltipTrigger>
          <TooltipContent className="whitespace-pre-line max-w-xs">
            {formatMetadataFull(row.metadata)}
          </TooltipContent>
        </Tooltip>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={row.status} />
        {row.callbackError && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="mt-1 flex items-center gap-1 text-xs text-destructive cursor-default">
                <AlertTriangle className="h-3 w-3" />
                Callback failed
              </span>
            </TooltipTrigger>
            <TooltipContent>{row.callbackError}</TooltipContent>
          </Tooltip>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
        {row.status === "pending" ? (
          "—"
        ) : (
          <div className="text-xs">
            <div>{row.decidedBy ?? "—"}</div>
            <div>{fmtDateTime(row.decidedAt)}</div>
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <ApprovalRowActions row={row} onDecided={onDecided} />
      </td>
    </tr>
  )
}

function ApprovalRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48 flex-1" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AutomationApprovalsPage() {
  const [page, setPage] = useState(1)
  const [department, setDepartment] = useState<string>(ALL_VALUE)
  const [workflow, setWorkflow] = useState<string>(ALL_VALUE)
  const [status, setStatus] = useState<string>(ALL_VALUE)

  const { data, isLoading, isFetching } = trpc.agents.automation.listApprovals.useQuery({
    page,
    limit: PAGE_SIZE,
    department: department === ALL_VALUE ? undefined : department,
    workflow: workflow === ALL_VALUE ? undefined : workflow,
    status: status === ALL_VALUE ? undefined : (status as ApprovalStatus),
  })

  const rows = (data?.rows ?? []) as ApprovalRow[]
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pendingCount = rows.filter((r) => r.status === "pending").length

  // Filter option lists are derived from the current page's data rather than
  // a dedicated backend endpoint - departments/workflows are a small, slow-
  // changing set (one per n8n workflow), so this is good enough without
  // adding a distinct-values query the brief didn't ask for.
  const departmentOptions = Array.from(new Set(rows.map((r) => r.department))).sort()
  const workflowOptions = Array.from(new Set(rows.map((r) => r.workflow))).sort()

  function resetToFirstPage() {
    setPage(1)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            Automation Approvals
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            n8n workflows waiting on a decision before they publish, send, or reach out to a customer.
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-amber-500/10 text-amber-600 border-0 gap-1.5 text-sm px-3 py-1.5">
            <Clock className="h-3.5 w-3.5" />
            {pendingCount} pending on this page
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Filter by exact department, workflow, or decision status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select value={department} onValueChange={(v) => { setDepartment(v); resetToFirstPage() }}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All departments</SelectItem>
                {departmentOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={workflow} onValueChange={(v) => { setWorkflow(v); resetToFirstPage() }}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Workflow" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All workflows</SelectItem>
                {workflowOptions.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(v) => { setStatus(v); resetToFirstPage() }}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Approvals</CardTitle>
          <CardDescription>Most recent first.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => <ApprovalRowSkeleton key={i} />)}
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <ClipboardCheck className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No approvals match these filters</p>
              <p className="text-sm mt-1">Approvals created by n8n workflows will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-medium">Created</th>
                    <th className="text-left px-4 py-3 font-medium">Department</th>
                    <th className="text-left px-4 py-3 font-medium">Workflow</th>
                    <th className="text-left px-4 py-3 font-medium">Kind</th>
                    <th className="text-left px-4 py-3 font-medium">Summary</th>
                    <th className="text-left px-4 py-3 font-medium">Metadata</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Decided</th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row) => (
                    <ApprovalTableRow key={row.id} row={row} onDecided={resetToFirstPage} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
