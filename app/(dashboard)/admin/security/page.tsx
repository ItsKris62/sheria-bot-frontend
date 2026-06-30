"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Shield, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Monitor, Globe, Clock, LogOut, Laptop, Loader2, Download, Search,
  Activity, FileText, RefreshCw, Lock, Eye,
} from "lucide-react"
import { trpc, getErrorMessage } from "@/lib/trpc"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LoginHistoryEntry {
  id: string
  userId: string | null
  email: string
  success: boolean
  ipAddress: string | null
  userAgent: string | null
  failureReason: string | null
  location: string | null
  createdAt: Date | string
}

interface SessionSummary {
  id: string
  userId: string
  device: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date | string
  expiresAt: Date | string
}

interface AuditLogEntry {
  id: string
  userId: string | null
  action: string
  entityType: string | null
  entityId: string | null
  metadata: unknown
  ipAddress: string | null
  createdAt: Date | string
}

const PAGE_SIZE = 50
const AUDIT_PAGE_SIZE = 25

function parseUA(ua: string | null): string {
  if (!ua) return "Unknown"
  if (ua.includes("Firefox")) return "Firefox"
  if (ua.includes("Edg")) return "Edge"
  if (ua.includes("Chrome")) return "Chrome"
  if (ua.includes("Safari")) return "Safari"
  if (ua.includes("curl")) return "curl"
  if (ua.includes("PostmanRuntime")) return "Postman"
  return ua.slice(0, 30)
}

function getActionColor(action: string): string {
  const a = action.toLowerCase()
  if (a.includes("delete") || a.includes("suspend") || a.includes("reject")) return "text-destructive bg-destructive/10"
  if (a.includes("create") || a.includes("approve") || a.includes("verify")) return "text-emerald-600 bg-emerald-500/10"
  if (a.includes("update") || a.includes("change") || a.includes("reset")) return "text-amber-600 bg-amber-500/10"
  if (a.includes("login") || a.includes("logout") || a.includes("sign")) return "text-blue-600 bg-blue-500/10"
  return "text-muted-foreground bg-muted"
}

// ─── Login History Tab ────────────────────────────────────────────────────────

function LoginHistoryTab() {
  const [page, setPage] = useState(1)
  const [emailFilter, setEmailFilter] = useState("")
  const [successFilter, setSuccessFilter] = useState<"all" | "success" | "failed">("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [appliedEmail, setAppliedEmail] = useState("")
  const [appliedSuccess, setAppliedSuccess] = useState<"all" | "success" | "failed">("all")
  const [appliedDateFrom, setAppliedDateFrom] = useState("")
  const [appliedDateTo, setAppliedDateTo] = useState("")

  const successBool =
    appliedSuccess === "success" ? true : appliedSuccess === "failed" ? false : undefined

  const { data, isLoading, refetch, isFetching } = trpc.admin.getLoginHistory.useQuery({
    email: appliedEmail || undefined,
    success: successBool,
    dateFrom: appliedDateFrom ? new Date(appliedDateFrom).toISOString() : undefined,
    dateTo: appliedDateTo ? new Date(appliedDateTo).toISOString() : undefined,
    page,
    limit: PAGE_SIZE,
  })

  const items: LoginHistoryEntry[] = (data?.items ?? []) as LoginHistoryEntry[]
  const total: number = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const failedCount = items.filter((i) => !i.success).length
  const successCount = items.filter((i) => i.success).length

  const ipFailMap: Record<string, number> = {}
  items.forEach((i) => {
    if (!i.success && i.ipAddress) {
      ipFailMap[i.ipAddress] = (ipFailMap[i.ipAddress] ?? 0) + 1
    }
  })
  const suspiciousIPs = Object.keys(ipFailMap).filter((ip) => ipFailMap[ip] >= 3)

  function applyFilters() {
    setAppliedEmail(emailFilter)
    setAppliedSuccess(successFilter)
    setAppliedDateFrom(dateFrom)
    setAppliedDateTo(dateTo)
    setPage(1)
  }

  function clearFilters() {
    setEmailFilter(""); setSuccessFilter("all"); setDateFrom(""); setDateTo("")
    setAppliedEmail(""); setAppliedSuccess("all"); setAppliedDateFrom(""); setAppliedDateTo("")
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Successful (page)</p>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "—" : successCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Failed (page)</p>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "—" : failedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Suspicious IPs</p>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "—" : suspiciousIPs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious IPs alert */}
      {suspiciousIPs.length > 0 && (
        <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
                  Suspicious activity detected
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                  IPs with 3+ failed attempts:{" "}
                  {suspiciousIPs.map((ip) => (
                    <span key={ip} className="font-mono font-medium mr-2">
                      {ip} ({ipFailMap[ip]} fails)
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Email</Label>
              <Input
                placeholder="Filter by email..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="h-9 text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") applyFilters() }}
              />
            </div>
            <div className="w-36">
              <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
              <Select value={successFilter} onValueChange={(v) => setSuccessFilter(v as "all" | "success" | "failed")}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 text-sm" />
            </div>
            <Button size="sm" className="h-9" onClick={applyFilters}>Apply</Button>
            <Button size="sm" variant="ghost" className="h-9" onClick={clearFilters}>Clear</Button>
            <Button size="sm" variant="outline" className="h-9 gap-2" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login history table */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-primary" />
              Login History
            </CardTitle>
            <span className="text-sm text-muted-foreground">{isLoading ? "—" : `${total} records`}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    <Globe className="h-3.5 w-3.5 inline mr-1" />IP Address
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    <Monitor className="h-3.5 w-3.5 inline mr-1" />Browser
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Clock className="h-3.5 w-3.5 inline mr-1" />Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/30">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No login records found
                    </td>
                  </tr>
                ) : (
                  items.map((entry) => {
                    const isSuspicious = !entry.success && entry.ipAddress && ipFailMap[entry.ipAddress] >= 3
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${isSuspicious ? "bg-red-50/30 dark:bg-red-900/5" : ""}`}
                      >
                        <td className="px-4 py-3">
                          {entry.success ? (
                            <Badge className="bg-primary/10 text-primary font-medium border-0">
                              <CheckCircle className="h-3 w-3 mr-1" />Success
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive font-medium border-0">
                              <XCircle className="h-3 w-3 mr-1" />Failed
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{entry.email}</span>
                          {isSuspicious && <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 inline ml-1" />}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="font-mono text-xs text-muted-foreground">{entry.ipAddress ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                          {parseUA(entry.userAgent)}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                          {entry.failureReason ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(entry.createdAt), "dd MMM yyyy HH:mm")}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {total > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages} — {total} total</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Session Management Tab ───────────────────────────────────────────────────

function SessionManagementTab() {
  const [userIdInput, setUserIdInput] = useState("")
  const [lookedUpUserId, setLookedUpUserId] = useState("")
  const [showConfirmSignOut, setShowConfirmSignOut] = useState(false)

  const sessionQuery = trpc.admin.listUserActiveSessions.useQuery(
    { userId: lookedUpUserId },
    { enabled: !!lookedUpUserId }
  )
  const sessions: SessionSummary[] = (sessionQuery.data ?? []) as SessionSummary[]

  const signOutMutation = trpc.admin.signOutUserEverywhere.useMutation({
    onSuccess: () => {
      setShowConfirmSignOut(false)
      toast.success("User signed out from all devices")
      setLookedUpUserId("")
      setUserIdInput("")
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Laptop className="h-5 w-5 text-primary" />
            User Session Management
          </CardTitle>
          <CardDescription>
            Look up active sessions for any user and force sign-out from all devices if needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Enter user ID..."
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                className="h-9 text-sm pl-9"
                onKeyDown={(e) => { if (e.key === "Enter" && userIdInput.trim()) setLookedUpUserId(userIdInput.trim()) }}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-9"
              onClick={() => setLookedUpUserId(userIdInput.trim())}
              disabled={!userIdInput.trim()}
            >
              Look Up
            </Button>
          </div>

          {lookedUpUserId && (
            <>
              {sessionQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <Lock className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No active sessions found for this user</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Device</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">IP Address</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Created</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Expires</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {sessions.map((s) => (
                          <tr key={s.id} className="hover:bg-muted/20">
                            <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.device ?? parseUA(s.userAgent)}</td>
                            <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground hidden md:table-cell">{s.ipAddress ?? "—"}</td>
                            <td className="px-4 py-2.5 text-xs text-muted-foreground">{format(new Date(s.createdAt), "dd MMM yyyy HH:mm")}</td>
                            <td className="px-4 py-2.5 text-xs text-muted-foreground hidden lg:table-cell">{format(new Date(s.expiresAt), "dd MMM yyyy HH:mm")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">
                      {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
                    </p>
                    <AlertDialog open={showConfirmSignOut} onOpenChange={setShowConfirmSignOut}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-2" disabled={signOutMutation.isPending}>
                          <LogOut className="h-4 w-4" />
                          Sign out from all devices
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sign out user everywhere?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will immediately revoke all active sessions and tokens for this user.
                            They will be signed out from every device. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => signOutMutation.mutate({ userId: lookedUpUserId })}
                            disabled={signOutMutation.isPending}
                          >
                            {signOutMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Sign Out Everywhere
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Audit Log Tab ────────────────────────────────────────────────────────────

function AuditLogTab() {
  const [page, setPage] = useState(1)
  const [userIdFilter, setUserIdFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [entityTypeFilter, setEntityTypeFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [applied, setApplied] = useState({
    userId: "", action: "", entityType: "", dateFrom: "", dateTo: "",
  })

  const exportMutation = trpc.admin.exportAuditLogs.useMutation({
    onSuccess: (data) => {
      const d = data as { url?: string }
      if (d?.url) window.open(d.url, "_blank")
      toast.success("Audit log export ready")
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const { data, isLoading, isFetching, refetch } = trpc.admin.getLogs.useQuery({
    page,
    limit: AUDIT_PAGE_SIZE,
    userId: applied.userId || undefined,
    action: applied.action || undefined,
    entityType: applied.entityType || undefined,
    dateFrom: applied.dateFrom ? new Date(applied.dateFrom).toISOString() : undefined,
    dateTo: applied.dateTo ? new Date(applied.dateTo).toISOString() : undefined,
  })

  const items: AuditLogEntry[] = ((data as { items?: AuditLogEntry[] })?.items ?? [])
  const total: number = (data as { total?: number })?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / AUDIT_PAGE_SIZE))

  function applyFilters() {
    setApplied({ userId: userIdFilter, action: actionFilter, entityType: entityTypeFilter, dateFrom, dateTo })
    setPage(1)
  }

  function clearFilters() {
    setUserIdFilter(""); setActionFilter(""); setEntityTypeFilter(""); setDateFrom(""); setDateTo("")
    setApplied({ userId: "", action: "", entityType: "", dateFrom: "", dateTo: "" })
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[160px] flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">User ID</Label>
              <Input placeholder="Filter by user ID..." value={userIdFilter} onChange={(e) => setUserIdFilter(e.target.value)} className="h-9 text-sm" onKeyDown={(e) => { if (e.key === "Enter") applyFilters() }} />
            </div>
            <div className="min-w-[160px] flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Action</Label>
              <Input placeholder="e.g. USER_APPROVED" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="h-9 text-sm" onKeyDown={(e) => { if (e.key === "Enter") applyFilters() }} />
            </div>
            <div className="min-w-[140px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Entity Type</Label>
              <Input placeholder="e.g. User, Org" value={entityTypeFilter} onChange={(e) => setEntityTypeFilter(e.target.value)} className="h-9 text-sm" onKeyDown={(e) => { if (e.key === "Enter") applyFilters() }} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 text-sm" />
            </div>
            <Button size="sm" className="h-9" onClick={applyFilters}>Apply</Button>
            <Button size="sm" variant="ghost" className="h-9" onClick={clearFilters}>Clear</Button>
            <Button size="sm" variant="outline" className="h-9 gap-2" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export buttons */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{isLoading ? "Loading..." : `${total} audit log entries`}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={exportMutation.isPending}
            onClick={() => exportMutation.mutate({
              format: "csv",
              userId: applied.userId || undefined,
              action: applied.action || undefined,
              entityType: applied.entityType || undefined,
              dateFrom: applied.dateFrom ? new Date(applied.dateFrom).toISOString() : undefined,
              dateTo: applied.dateTo ? new Date(applied.dateTo).toISOString() : undefined,
            })}
          >
            {exportMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={exportMutation.isPending}
            onClick={() => exportMutation.mutate({
              format: "docx",
              userId: applied.userId || undefined,
              action: applied.action || undefined,
              entityType: applied.entityType || undefined,
              dateFrom: applied.dateFrom ? new Date(applied.dateFrom).toISOString() : undefined,
              dateTo: applied.dateTo ? new Date(applied.dateTo).toISOString() : undefined,
            })}
          >
            {exportMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Export DOCX
          </Button>
        </div>
      </div>

      {/* Audit log table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">User ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Entity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">IP Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/30">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No audit log entries found
                    </td>
                  </tr>
                ) : (
                  items.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getActionColor(entry.action)}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px] block">
                          {entry.userId ?? "System"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {entry.entityType ? (
                          <span>{entry.entityType}{entry.entityId ? ` · ${entry.entityId.slice(0, 8)}…` : ""}</span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">{entry.ipAddress ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(entry.createdAt), "dd MMM yyyy HH:mm")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {total > AUDIT_PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages} — {total} total</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const { data: summary, isLoading: summaryLoading } = trpc.admin.getSecuritySummary.useQuery()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Security & Auditing
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor authentication activity, manage user sessions, and review the full audit trail.
        </p>
      </div>

      {summary?.warnings?.length ? (
        <div className="space-y-3">
          {summary.warnings.map((w: { id: string; title: string; message: string }) => (
            <div key={w.id} className="rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">{w.title}</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">{w.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Security overview cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Security Status</p>
                {summaryLoading ? (
                  <Skeleton className="h-6 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-bold text-foreground capitalize">
                    {summary?.overallStatus ?? "Unknown"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Audit Logging</p>
                {summaryLoading ? (
                  <Skeleton className="h-6 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-bold text-foreground">
                    {summary?.audit?.auditLoggingAvailable ? "Active" : "Unavailable"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Session Tracking</p>
                {summaryLoading ? (
                  <Skeleton className="h-6 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-bold text-foreground">
                    {summary?.sessions?.activeSessions !== undefined ? "Enabled" : "Unavailable"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="login-history" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1">
          <TabsTrigger value="login-history" className="gap-2">
            <Shield className="h-4 w-4" />
            Login History
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Laptop className="h-4 w-4" />
            Session Management
          </TabsTrigger>
          <TabsTrigger value="audit-log" className="gap-2">
            <FileText className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login-history">
          <LoginHistoryTab />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionManagementTab />
        </TabsContent>

        <TabsContent value="audit-log">
          <AuditLogTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
