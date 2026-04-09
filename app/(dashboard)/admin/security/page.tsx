"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Shield, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Monitor, Globe, Clock,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { format } from "date-fns"

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

const PAGE_SIZE = 50

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

export default function SecurityPage() {
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

  const { data, isLoading } = trpc.admin.getLoginHistory.useQuery({
    email: appliedEmail || undefined,
    success: successBool,
    dateFrom: appliedDateFrom ? new Date(appliedDateFrom).toISOString() : undefined,
    dateTo: appliedDateTo ? new Date(appliedDateTo).toISOString() : undefined,
    page,
    limit: PAGE_SIZE,
  })

  // Stats derived from current page data for the summary cards
  const items: LoginHistoryEntry[] = (data?.items ?? []) as LoginHistoryEntry[]
  const total: number = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const failedCount = items.filter((i) => !i.success).length
  const successCount = items.filter((i) => i.success).length

  // Suspicious: same IP with 3+ failed attempts in current result set
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
    setEmailFilter("")
    setSuccessFilter("all")
    setDateFrom("")
    setDateTo("")
    setAppliedEmail("")
    setAppliedSuccess("all")
    setAppliedDateFrom("")
    setAppliedDateTo("")
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Security</h1>
        <p className="text-muted-foreground mt-1">Login history, failed authentication attempts, and suspicious activity</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
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

        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
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

        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Suspicious IPs (page)</p>
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
                  IPs with 3+ failed attempts in current view:{" "}
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
      <Card className="border-border/50 bg-card/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input
                placeholder="Filter by email..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="h-9 text-sm bg-muted/50"
                onKeyDown={(e) => { if (e.key === "Enter") applyFilters() }}
              />
            </div>
            <div className="w-36">
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <Select value={successFilter} onValueChange={(v) => setSuccessFilter(v as "all" | "success" | "failed")}>
                <SelectTrigger className="h-9 text-sm bg-muted/50">
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
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 text-sm bg-muted/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 text-sm bg-muted/50"
              />
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/80 text-white h-9" onClick={applyFilters}>
              Apply
            </Button>
            <Button size="sm" variant="ghost" className="h-9" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login history table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Globe className="h-3.5 w-3.5 inline mr-1" />IP Address
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Monitor className="h-3.5 w-3.5 inline mr-1" />Browser
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reason</th>
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
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
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
                        className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${
                          isSuspicious ? "bg-red-50/30 dark:bg-red-900/5" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          {entry.success ? (
                            <Badge className="bg-primary/10 text-primary font-medium">
                              <CheckCircle className="h-3 w-3 mr-1" />Success
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive font-medium">
                              <XCircle className="h-3 w-3 mr-1" />Failed
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{entry.email}</span>
                          {isSuspicious && (
                            <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 inline ml-1" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-muted-foreground">
                            {entry.ipAddress ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {parseUA(entry.userAgent)}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
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

          {/* Pagination */}
          {total > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages} &mdash; {total} total
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
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
