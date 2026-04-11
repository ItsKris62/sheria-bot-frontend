"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, User, Settings, FileText, Shield, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Download } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

type TypeConfigEntry = { label: string; icon: React.ElementType; color: string }
const typeConfig: Record<string, TypeConfigEntry> = {
  QUERY:     { label: "Query",    icon: Activity, color: "bg-blue-100 text-blue-700" },
  SETTINGS:  { label: "Settings", icon: Settings, color: "bg-yellow-100 text-yellow-700" },
  DOCUMENT:  { label: "Document", icon: FileText,  color: "bg-gray-100 text-gray-600" },
  AUTH:      { label: "Auth",     icon: Shield,    color: "bg-purple-100 text-purple-700" },
  POLICY:    { label: "Policy",   icon: FileText,  color: "bg-gray-100 text-gray-600" },
  USER:      { label: "User",     icon: User,      color: "bg-emerald-100 text-emerald-700" },
  ORGANIZATION: { label: "Org",  icon: Activity,  color: "bg-indigo-100 text-indigo-700" },
}
function getConfig(entityType?: string | null): TypeConfigEntry {
  return typeConfig[(entityType ?? "").toUpperCase()] ?? { label: entityType ?? "Other", icon: Activity, color: "bg-gray-100 text-gray-600" }
}

interface LogEntry {
  id: string
  action: string
  entityType: string | null
  entityId: string | null
  userId: string | null
  ipAddress: string | null
  metadata: unknown
  createdAt: Date
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [entityTypeFilter, setEntityTypeFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("")
  const [userIdFilter, setUserIdFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const limit = 200

  const { data, isLoading } = trpc.admin.getLogs.useQuery({
    page,
    limit,
    ...(entityTypeFilter !== "all" ? { entityType: entityTypeFilter } : {}),
    ...(actionFilter ? { action: actionFilter } : {}),
    ...(userIdFilter ? { userId: userIdFilter } : {}),
    ...(dateFrom ? { dateFrom: new Date(dateFrom).toISOString() } : {}),
    ...(dateTo ? { dateTo: new Date(dateTo).toISOString() } : {}),
  })

  const exportMutation = trpc.admin.exportAuditLogs.useMutation({
    onSuccess: (result) => {
      const a = document.createElement("a")
      a.href = result.url
      a.click()
    },
    onError: (err) => toast.error(err.message),
  })

  const logs: LogEntry[] = (data as { items?: LogEntry[] })?.items ?? []
  const total: number = (data as { total?: number })?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  function triggerExport(format: "csv" | "docx") {
    exportMutation.mutate({
      format,
      ...(entityTypeFilter !== "all" ? { entityType: entityTypeFilter } : {}),
      ...(actionFilter ? { action: actionFilter } : {}),
      ...(userIdFilter ? { userId: userIdFilter } : {}),
      ...(dateFrom ? { dateFrom: new Date(dateFrom) } : {}),
      ...(dateTo ? { dateTo: new Date(dateTo) } : {}),
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-gray-500 mt-1">Track all system activity and administrative actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerExport("csv")}
            disabled={exportMutation.isPending}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerExport("docx")}
            disabled={exportMutation.isPending}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export DOCX
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity Log</CardTitle>
          <CardDescription>{isLoading ? "Loading..." : `${total.toLocaleString()} entries`}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <Select value={entityTypeFilter} onValueChange={(v) => { setEntityTypeFilter(v); setPage(1) }}>
              <SelectTrigger><SelectValue placeholder="Entity Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Organization">Organization</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Action filter..."
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
            />
            <Input
              placeholder="User ID filter..."
              value={userIdFilter}
              onChange={(e) => { setUserIdFilter(e.target.value); setPage(1) }}
            />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="text-sm"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="text-sm"
            />
          </div>

          {/* Entries */}
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                  <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32" /></div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))
            ) : logs.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">No audit logs found for the selected filters</p>
            ) : (
              logs.map((log) => {
                const config = getConfig(log.entityType)
                const Icon = config.icon
                const isExpanded = expandedId === log.id
                const hasMetadata = log.metadata && typeof log.metadata === "object" && Object.keys(log.metadata as object).length > 0
                return (
                  <div key={log.id} className="rounded-lg border border-gray-100 overflow-hidden">
                    <div
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => hasMetadata && setExpandedId(isExpanded ? null : log.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-md flex-shrink-0 ${config.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{log.action}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 flex-wrap">
                            <span>{log.userId ?? "System"}</span>
                            {log.entityId && <span className="font-mono">{log.entityId.slice(0, 8)}</span>}
                            {log.ipAddress && <span>· {log.ipAddress}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <Badge className={`${config.color} border-0 text-xs`}>{config.label}</Badge>
                        <p className="text-xs text-gray-400 hidden lg:block">
                          {new Date(log.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                        </p>
                        {hasMetadata && (
                          isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                            : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {isExpanded && hasMetadata && (
                      <div className="px-4 pb-3 border-t border-gray-100 bg-gray-50">
                        <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-48 whitespace-pre-wrap break-words">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Page {page} of {totalPages} ({total.toLocaleString()} total)</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
