"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, User, Settings, FileText, Shield, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Download } from "lucide-react"
import { trpc, getErrorMessage } from "@/lib/trpc"
import { toast } from "sonner"
import {
  AdminDataPanel,
  AdminEmptyState,
  AdminFilterBar,
  AdminPageHeader,
} from "@/components/admin/portal"
import { PortalSurface } from "@/components/portal"

type TypeConfigEntry = { label: string; icon: React.ElementType; color: string }
const typeConfig: Record<string, TypeConfigEntry> = {
  QUERY:     { label: "Query",    icon: Activity, color: "bg-blue-100 text-blue-700" },
  SETTINGS:  { label: "Settings", icon: Settings, color: "bg-yellow-100 text-yellow-700" },
  SYSTEM:    { label: "System",   icon: Settings, color: "bg-yellow-100 text-yellow-700" },
  DOCUMENT:  { label: "Document", icon: FileText,  color: "bg-gray-100 text-gray-600" },
  LEGALDOCUMENT: { label: "Legal Doc", icon: FileText, color: "bg-gray-100 text-gray-600" },
  AUTH:      { label: "Auth",     icon: Shield,    color: "bg-purple-100 text-purple-700" },
  POLICY:    { label: "Policy",   icon: FileText,  color: "bg-gray-100 text-gray-600" },
  USER:      { label: "User",     icon: User,      color: "bg-emerald-100 text-emerald-700" },
  ORGANIZATION: { label: "Org",  icon: Activity,  color: "bg-indigo-100 text-indigo-700" },
  GAPANALYSIS: { label: "Gap Analysis", icon: Activity, color: "bg-teal-100 text-teal-700" },
  CHECKLIST: { label: "Checklist", icon: FileText, color: "bg-orange-100 text-orange-700" },
  CONTACT:   { label: "Contact",  icon: User,      color: "bg-pink-100 text-pink-700" },
  FEATUREFLAG: { label: "Feature", icon: Settings, color: "bg-rose-100 text-rose-700" },
  INVITATION: { label: "Invitation", icon: User, color: "bg-cyan-100 text-cyan-700" },
  RESOURCE:  { label: "Resource", icon: FileText, color: "bg-blue-100 text-blue-700" },
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
  actorName: string | null
  actorEmail: string | null
  actorOrganization: string | null
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  ipAddress: string | null
  metadata: unknown
  createdAt: string
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [entityTypeFilter, setEntityTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("")
  const [userIdFilter, setUserIdFilter] = useState("")
  const [searchFilter, setSearchFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const limit = 200

  const { data, isLoading } = trpc.admin.getLogs.useQuery({
    page,
    limit,
    ...(entityTypeFilter !== "all" ? { entityType: entityTypeFilter } : {}),
    ...(severityFilter !== "all" ? { severity: severityFilter as "LOW" | "MEDIUM" | "HIGH" | "INFO" } : {}),
    ...(actionFilter ? { action: actionFilter } : {}),
    ...(userIdFilter ? { userId: userIdFilter } : {}),
    ...(searchFilter ? { search: searchFilter } : {}),
    ...(dateFrom ? { dateFrom: new Date(`${dateFrom}T00:00:00.000Z`).toISOString() } : {}),
    ...(dateTo ? { dateTo: new Date(`${dateTo}T23:59:59.999Z`).toISOString() } : {}),
  })

  const exportMutation = trpc.admin.exportAuditLogs.useMutation({
    onSuccess: (result, variables) => {
      const dateStr = new Date().toISOString().split("T")[0]
      const a = document.createElement("a")
      a.href = result.url
      a.download = `sheriabot-audit-log-${dateStr}.${variables.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success("Audit log exported successfully.")
    },
    onError: (err) => toast.error(getErrorMessage(err) ?? "Export failed. Please try again."),
  })

  const logs: LogEntry[] = (data as unknown as { items?: LogEntry[] })?.items ?? []
  const total: number = (data as { total?: number })?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  function triggerExport(format: "csv" | "docx") {
    exportMutation.mutate({
      format,
      ...(entityTypeFilter !== "all" ? { entityType: entityTypeFilter } : {}),
      ...(severityFilter !== "all" ? { severity: severityFilter as "LOW" | "MEDIUM" | "HIGH" | "INFO" } : {}),
      ...(actionFilter ? { action: actionFilter } : {}),
      ...(userIdFilter ? { userId: userIdFilter } : {}),
      ...(searchFilter ? { search: searchFilter } : {}),
      // Zod schema expects ISO datetime strings, not Date objects
      ...(dateFrom ? { dateFrom: new Date(`${dateFrom}T00:00:00.000Z`).toISOString() } : {}),
      ...(dateTo ? { dateTo: new Date(`${dateTo}T23:59:59.999Z`).toISOString() } : {}),
    })
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-8">
      <AdminPageHeader
        title="Audit Logs"
        description="Track all system activity and administrative actions."
        icon={Activity}
        action={
        <div className="flex flex-wrap items-center gap-2">
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
        }
      />

      <AdminDataPanel
        title="Activity Log"
        description={isLoading ? "Loading..." : `${total.toLocaleString()} entries`}
      >
          {/* Filters */}
          <AdminFilterBar className="mb-4">
            <div className="min-w-0 lg:w-[220px]">
              <label htmlFor="audit-log-search" className="sr-only">Search audit logs</label>
              <Input
                id="audit-log-search"
                placeholder="Search logs..."
                value={searchFilter}
                onChange={(e) => { setSearchFilter(e.target.value); setPage(1) }}
              />
            </div>
            <Select value={entityTypeFilter} onValueChange={(v) => { setEntityTypeFilter(v); setPage(1) }}>
              <SelectTrigger aria-label="Filter audit logs by entity type"><SelectValue placeholder="Entity Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Organization">Organization</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="LegalDocument">Legal Document</SelectItem>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="GapAnalysis">Gap Analysis</SelectItem>
                <SelectItem value="Checklist">Checklist</SelectItem>
                <SelectItem value="Contact">Contact</SelectItem>
                <SelectItem value="FeatureFlag">Feature Flag</SelectItem>
                <SelectItem value="Invitation">Invitation</SelectItem>
                <SelectItem value="Resource">Resource</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(1) }}>
              <SelectTrigger aria-label="Filter audit logs by severity"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
              </SelectContent>
            </Select>
            <div className="min-w-0 lg:w-[180px]">
              <label htmlFor="audit-action-filter" className="sr-only">Filter audit logs by action</label>
            <Input
              id="audit-action-filter"
              placeholder="Action filter..."
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
            />
            </div>
            <div className="min-w-0 lg:w-[180px]">
              <label htmlFor="audit-user-filter" className="sr-only">Filter audit logs by user ID</label>
            <Input
              id="audit-user-filter"
              placeholder="User ID filter..."
              value={userIdFilter}
              onChange={(e) => { setUserIdFilter(e.target.value); setPage(1) }}
            />
            </div>
            <div>
              <label htmlFor="audit-date-from" className="sr-only">Audit log date from</label>
            <Input
              id="audit-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="text-sm"
            />
            </div>
            <div>
              <label htmlFor="audit-date-to" className="sr-only">Audit log date to</label>
            <Input
              id="audit-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="text-sm"
            />
            </div>
          </AdminFilterBar>

          {/* Entries */}
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <PortalSurface key={i} variant="solid" className="flex items-center gap-4 p-3">
                  <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32" /></div>
                  <Skeleton className="h-5 w-16" />
                </PortalSurface>
              ))
            ) : logs.length === 0 ? (
              <AdminEmptyState
                title="No audit events were found for the selected period"
                description="Adjust the filters or date range to broaden the audit trail view."
                icon={Activity}
              />
            ) : (
              logs.map((log) => {
                const config = getConfig(log.entityType)
                const Icon = config.icon
                const isExpanded = expandedId === log.id
                const hasMetadata = !!log.metadata && typeof log.metadata === "object" && Object.keys(log.metadata as object).length > 0
                return (
                  <PortalSurface key={log.id} variant="solid" className="overflow-hidden">
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center justify-between p-3 text-left hover:bg-[var(--portal-surface-hover)] disabled:cursor-default"
                      onClick={() => hasMetadata && setExpandedId(isExpanded ? null : log.id)}
                      disabled={!hasMetadata}
                      aria-expanded={hasMetadata ? isExpanded : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-md flex-shrink-0 ${config.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="break-words text-sm font-medium text-[var(--portal-text-primary)]">{log.action}</p>
                            {log.severity === 'HIGH' && <Badge variant="destructive" className="text-[10px] h-4 px-1.5">HIGH</Badge>}
                            {log.severity === 'MEDIUM' && <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-amber-600 border-amber-200 bg-amber-50">MED</Badge>}
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--portal-text-secondary)]">
                            <span className="break-all">{log.actorName ? `${log.actorName} (${log.actorEmail})` : (log.userId ?? "System")}</span>
                            {log.actorOrganization && <span className="rounded bg-[var(--portal-surface)] px-1 font-mono">{log.actorOrganization}</span>}
                            {log.entityId && <span className="font-mono">{log.entityId.slice(0, 8)}</span>}
                            {log.ipAddress && <span>- {log.ipAddress}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <Badge className={`${config.color} border-0 text-xs`}>{config.label}</Badge>
                        <p className="hidden text-xs text-[var(--portal-text-muted)] lg:block">
                          {new Date(log.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                        </p>
                        {hasMetadata && (
                          isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-[var(--portal-text-muted)]" />
                            : <ChevronDown className="w-3.5 h-3.5 text-[var(--portal-text-muted)]" />
                        )}
                      </div>
                    </button>
                    {isExpanded && hasMetadata && (
                      <div className="border-t border-[var(--portal-border)] bg-[var(--portal-surface)] px-4 pb-3">
                        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs text-[var(--portal-text-secondary)]">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                    </PortalSurface>
                  )
                })
            )}
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-[var(--portal-text-secondary)]">Page {page} of {totalPages} ({total.toLocaleString()} total)</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
      </AdminDataPanel>
    </div>
  )
}
