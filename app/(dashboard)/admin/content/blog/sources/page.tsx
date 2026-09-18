"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search, MoreVertical, Database, CheckCircle2,
  Trash2, ChevronLeft, ChevronRight, Plus, Eye, Activity, ShieldCheck, AlertTriangle, Play,
  History, Sparkles, Layers, FileText, Radio, Clock
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  NEEDS_VERIFICATION: "bg-yellow-100 text-yellow-700",
  FAILING: "bg-red-100 text-red-700",
}

const JURISDICTIONS = ["KE", "MW", "RW", "NG", "REGIONAL", "GLOBAL"] as const
const AUTHORITY_TYPES = [
  "CENTRAL_BANK", "DATA_PROTECTION", "AML_CFT", "COMMUNICATIONS", "SECURITIES",
  "CONSUMER_PROTECTION", "COMPETITION", "GAZETTE", "LEGAL_DATABASE",
  "INTERNATIONAL_STANDARD", "DEVELOPMENT_FINANCE", "INDUSTRY_BODY", "INTERNAL", "OTHER"
] as const
const SOURCE_TYPES = ["OFFICIAL", "THIRD_PARTY", "INTERNAL", "MEDIA", "INTERNATIONAL_STANDARD"] as const
const MONITORING_METHODS = ["RSS", "HTML_LISTING", "API", "MANUAL"] as const

type MonitorItem = {
  id: string
  name: string
  jurisdiction: string
  authorityType: string
  sourceType: string
  monitoringMethod: string
  status: string
  isActive: boolean
  verificationStatus: string
  lastCheckedAt: string | null
  lastRunStatus: string
  failureCount: number
  baseUrl: string
}

export default function BlogSourcesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("all")
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    jurisdiction: "KE" as any,
    authorityType: "CENTRAL_BANK" as any,
    sourceType: "OFFICIAL" as any,
    monitoringMethod: "MANUAL" as any,
    baseUrl: "",
    feedUrl: "",
    notes: "",
    // API-specific configurations
    apiEndpoint: "",
    apiItemsPath: "data",
    apiFieldTitle: "title",
    apiFieldUrl: "url",
    apiFieldPubDate: "publicationDate",
    apiFieldContent: "content",
    apiHeaders: "",
  })

  const [verifyTarget, setVerifyTarget] = useState<{ id: string; name: string } | null>(null)
  const [verifyNotes, setVerifyNotes] = useState("")

  // Run History Drawer State
  const [historyTarget, setHistoryTarget] = useState<MonitorItem | null>(null)

  const utils = trpc.useUtils()

  const { data, isLoading, isError } = trpc.blogAutomation.adminListMonitors.useQuery({
    jurisdiction: jurisdictionFilter !== "all" ? (jurisdictionFilter as any) : undefined,
    search: search || undefined,
    page,
    limit: 20,
  })

  // Aggregated Telemetry Queries
  const { data: activeMonitorsData } = trpc.blogAutomation.adminListMonitors.useQuery({
    isActive: true,
    limit: 1,
  })
  const { data: sourceItemsData } = trpc.blogAutomation.adminListSourceItems.useQuery({
    limit: 1,
  })
  const { data: suggestionsData } = trpc.blogAutomation.adminListSuggestions.useQuery({
    status: 'PENDING_REVIEW',
    limit: 1,
  })

  // Selected Monitor Run History Query
  const { data: historyRunsData, isLoading: historyLoading } = trpc.blogAutomation.adminListDiscoveryRuns.useQuery(
    { monitorId: historyTarget?.id, limit: 20 },
    { enabled: !!historyTarget }
  )

  const deleteMutation = trpc.blogAutomation.adminDeleteMonitor.useMutation({
    onSuccess: () => { toast.success("Monitor deleted"); setDeleteTarget(null); void utils.blogAutomation.adminListMonitors.invalidate() },
    onError: (err: any) => toast.error(err.message),
  })

  const setStatusMutation = trpc.blogAutomation.adminSetMonitorStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); void utils.blogAutomation.adminListMonitors.invalidate() },
    onError: (err: any) => toast.error(err.message),
  })

  const verifyMutation = trpc.blogAutomation.adminVerifyMonitor.useMutation({
    onSuccess: () => { 
      toast.success("Monitor verified"); 
      setVerifyTarget(null); 
      setVerifyNotes("");
      void utils.blogAutomation.adminListMonitors.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  })

  const createMutation = trpc.blogAutomation.adminCreateMonitor.useMutation({
    onSuccess: () => {
      toast.success("Source Monitor created")
      setCreateOpen(false)
      setCreateForm({
        name: "",
        description: "",
        jurisdiction: "KE",
        authorityType: "CENTRAL_BANK",
        sourceType: "OFFICIAL",
        monitoringMethod: "MANUAL",
        baseUrl: "",
        feedUrl: "",
        notes: "",
        apiEndpoint: "",
        apiItemsPath: "data",
        apiFieldTitle: "title",
        apiFieldUrl: "url",
        apiFieldPubDate: "publicationDate",
        apiFieldContent: "content",
        apiHeaders: "",
      })
      void utils.blogAutomation.adminListMonitors.invalidate()
    },
    onError: (err: any) => toast.error(err.message),
  })

  const runMonitorMutation = trpc.blogAutomation.adminRunMonitorNow.useMutation({
    onSuccess: (data: any) => {
      if (data.status === 'SUCCESS' || data.status === 'PARTIAL_SUCCESS') {
        toast.success(`Discovery finished. Found: ${data.itemsFound}, New: ${data.itemsCreated}`);
      } else if (data.status === 'SKIPPED_LOCKED') {
        toast.error(`Monitor is currently locked (already running).`);
      } else {
        toast.error(`Discovery failed: ${data.errorMessage || 'Unknown error'}`);
      }
      void utils.blogAutomation.adminListMonitors.invalidate();
      void utils.blogAutomation.adminListDiscoveryRuns.invalidate();
      void utils.blogAutomation.adminListSourceItems.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  })

  const scoreBatchMutation = trpc.blogAutomation.adminScoreEligibleSourceItems.useMutation({
    onSuccess: (res: any) => {
      toast.success(`Batch scoring finished! Processed: ${res.processed}, Suggestions Created: ${res.suggestionsCreated}, Skipped: ${res.duplicatesSkipped + res.belowThreshold}`);
      void utils.blogAutomation.adminListMonitors.invalidate();
      void utils.blogAutomation.adminListSourceItems.invalidate();
      void utils.blogAutomation.adminListSuggestions.invalidate();
    },
    onError: (err: any) => toast.error(`Batch scoring failed: ${err.message}`),
  })

  const totalPages = data ? Math.ceil(data.pagination.total / 20) : 1

  return (
    <div className="p-6 space-y-6">
      {/* Header with Title & Operations Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Source Monitor Registry</h1>
          <p className="text-sm text-gray-500 mt-1">Manage approved multi-jurisdiction regulatory sources and live ingestion telemetry.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="gap-1.5 text-xs sm:text-sm"
            onClick={() => scoreBatchMutation.mutate({ limit: 50, minScore: 45 })}
            disabled={scoreBatchMutation.isPending}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            {scoreBatchMutation.isPending ? "Scoring..." : "Score Pending Items"}
          </Button>
          <Button
            variant="outline"
            className="gap-1.5 text-xs sm:text-sm"
            onClick={() => window.location.href = "/admin/content/blog/source-items"}
          >
            <Eye className="w-4 h-4 text-blue-600" /> Discovered Items
          </Button>
          <Button className="bg-secondary hover:bg-[#007a50] text-white gap-2 text-xs sm:text-sm" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" /> New Monitor
          </Button>
        </div>
      </div>

      {/* Real-time Automation Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Monitors</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {activeMonitorsData?.pagination.total ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {data?.pagination.total ?? 0} registered
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 inline" /> Automated Ingestion
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Discovered Items</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {sourceItemsData?.pagination.total ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">items staged</span>
              </div>
              <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Activity className="w-3 h-3 inline" /> Deduplicated Ingestion
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Suggestions</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {suggestionsData?.pagination.total ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">awaiting review</span>
              </div>
              <Link href="/admin/content/blog/suggestions" className="text-[11px] text-purple-600 font-medium hover:underline flex items-center gap-1">
                <Sparkles className="w-3 h-3 inline" /> Review Triage Queue &rarr;
              </Link>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Orchestrator Health</p>
              <div className="flex items-baseline gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold px-2 py-0.5 gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                n8n Daily Sweep Active (06:00 EAT)
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <Radio className="w-5 h-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4" /> Source Monitors ({data?.pagination.total ?? "—"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex gap-2 flex-1">
              <Input placeholder="Search sources..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))} className="max-w-xs" />
              <Button variant="outline" size="icon" onClick={() => { setSearch(searchInput); setPage(1) }}><Search className="w-4 h-4" /></Button>
            </div>
            <Select value={jurisdictionFilter} onValueChange={(v) => { setJurisdictionFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Jurisdiction" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jurisdictions</SelectItem>
                {JURISDICTIONS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">Failed to load source monitors.</div>
          ) : !data?.monitors.length ? (
            <div className="text-center py-12 text-gray-400">
              <Database className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No source monitors found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Name & URL</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Jurisdiction</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Authority Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Verified</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(data.monitors as MonitorItem[]).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{item.name}</span>
                          <span className="text-xs text-blue-600 truncate max-w-[200px]">{item.baseUrl}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{item.jurisdiction}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-500">{item.authorityType}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {item.status}
                        </span>
                        {item.isActive ? (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            ON
                          </span>
                        ) : (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                            OFF
                          </span>
                        )}
                        <div className="text-[10px] mt-1 text-muted-foreground flex gap-1">
                          {item.lastRunStatus} • {item.lastCheckedAt ? new Date(item.lastCheckedAt).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {item.verificationStatus === "VERIFIED" ? (
                           <ShieldCheck className="w-4 h-4 text-green-600" />
                        ) : (
                           <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.verificationStatus !== "VERIFIED" && (
                              <DropdownMenuItem onClick={() => setVerifyTarget({ id: item.id, name: item.name })}>
                                <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" /> Verify
                              </DropdownMenuItem>
                            )}
                            {item.verificationStatus === "VERIFIED" && !item.isActive && (
                              <DropdownMenuItem onClick={() => setStatusMutation.mutate({ id: item.id, status: "ACTIVE", isActive: true })}>
                                <Activity className="w-4 h-4 mr-2 text-green-600" /> Activate
                              </DropdownMenuItem>
                            )}
                            {item.isActive && (
                              <DropdownMenuItem onClick={() => setStatusMutation.mutate({ id: item.id, status: "INACTIVE", isActive: false })}>
                                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" /> Deactivate
                              </DropdownMenuItem>
                            )}
                            {item.isActive && item.verificationStatus === "VERIFIED" && item.monitoringMethod !== "MANUAL" && (
                              <DropdownMenuItem 
                                onClick={() => runMonitorMutation.mutate({ monitorId: item.id })}
                                disabled={runMonitorMutation.isPending}
                              >
                                <Play className="w-4 h-4 mr-2 text-green-600" /> {runMonitorMutation.isPending ? 'Running...' : 'Run Discovery Now'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setHistoryTarget(item)}>
                              <History className="w-4 h-4 mr-2 text-purple-600" /> View Run History
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `/admin/content/blog/source-items?monitorId=${item.id}`}>
                              <Eye className="w-4 h-4 mr-2 text-gray-600" /> View Items
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget({ id: item.id, name: item.name })}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data && data.pagination.total > 20 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DISCOVERY RUN HISTORY SHEET */}
      <Sheet open={!!historyTarget} onOpenChange={(open) => !open && setHistoryTarget(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              Run History: {historyTarget?.name}
            </SheetTitle>
            <SheetDescription>
              {historyTarget?.jurisdiction} • {historyTarget?.monitoringMethod} • Base: {historyTarget?.baseUrl}
            </SheetDescription>
          </SheetHeader>

          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Showing recent {historyRunsData?.runs.length ?? 0} discovery sweeps
              </span>
              {historyTarget?.isActive && historyTarget?.verificationStatus === "VERIFIED" && historyTarget?.monitoringMethod !== "MANUAL" && (
                <Button 
                  size="sm" 
                  className="bg-secondary hover:bg-[#007a50] text-white gap-1.5 h-8 text-xs"
                  onClick={() => historyTarget && runMonitorMutation.mutate({ monitorId: historyTarget.id })}
                  disabled={runMonitorMutation.isPending}
                >
                  <Play className="w-3.5 h-3.5" /> {runMonitorMutation.isPending ? 'Sweeping...' : 'Run Discovery Sweep'}
                </Button>
              )}
            </div>

            {historyLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : !historyRunsData?.runs.length ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No discovery runs recorded for this monitor yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyRunsData.runs.map((run: any) => (
                  <div key={run.id} className="border rounded-lg p-3.5 space-y-2 bg-card hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        run.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                        run.status === 'PARTIAL_SUCCESS' ? 'bg-blue-100 text-blue-800' :
                        run.status === 'RUNNING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        run.status === 'SKIPPED_LOCKED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {run.status}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(run.startedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs py-1.5 bg-muted/30 rounded border border-border/40">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Found</span>
                        <span className="font-semibold text-foreground">{run.itemsFound}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Created</span>
                        <span className="font-semibold text-emerald-600">+{run.itemsCreated}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Duplicates</span>
                        <span className="font-semibold text-muted-foreground">{run.duplicateCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Failed</span>
                        <span className={`font-semibold ${run.failureCount > 0 ? 'text-rose-600' : 'text-muted-foreground'}`}>{run.failureCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Triggered by: <strong className="text-foreground">{run.triggeredBy}</strong> {run.triggeredByUser ? `(${run.triggeredByUser.fullName})` : ''}</span>
                      {run.completedAt && (
                        <span>Duration: {Math.max(0, Math.round((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000))}s</span>
                      )}
                    </div>

                    {run.errorMessage && (
                      <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-2 mt-1">
                        {run.errorMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* CREATE DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Source Monitor</DialogTitle>
            <DialogDescription>Register a new regulatory source. It will default to inactive pending verification.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 col-span-2">
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g. Central Bank of Kenya"
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label>Base URL <span className="text-red-500">*</span></Label>
              <Input
                placeholder="https://www.centralbank.go.ke"
                value={createForm.baseUrl}
                onChange={(e) => setCreateForm((f) => ({ ...f, baseUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Jurisdiction <span className="text-red-500">*</span></Label>
              <Select value={createForm.jurisdiction} onValueChange={(v: any) => setCreateForm(f => ({ ...f, jurisdiction: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {JURISDICTIONS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Authority Type <span className="text-red-500">*</span></Label>
              <Select value={createForm.authorityType} onValueChange={(v: any) => setCreateForm(f => ({ ...f, authorityType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUTHORITY_TYPES.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Source Type <span className="text-red-500">*</span></Label>
              <Select value={createForm.sourceType} onValueChange={(v: any) => setCreateForm(f => ({ ...f, sourceType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOURCE_TYPES.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Monitoring Method <span className="text-red-500">*</span></Label>
              <Select value={createForm.monitoringMethod} onValueChange={(v: any) => setCreateForm(f => ({ ...f, monitoringMethod: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONITORING_METHODS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {createForm.monitoringMethod === "API" ? (
              <div className="col-span-2 space-y-3 p-3 bg-muted/40 rounded-lg border border-border/60">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    REST / JSON API Ingestion Config
                  </Label>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                    JSON API
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">API Endpoint URL</Label>
                  <Input
                    placeholder="https://api.centralbank.go.ke/v1/circulars"
                    value={createForm.apiEndpoint}
                    onChange={(e) => setCreateForm((f) => ({ ...f, apiEndpoint: e.target.value }))}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Endpoint that returns the list of regulatory publications. If empty, Base URL is used.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Response Items Path</Label>
                  <Input
                    placeholder="data (or items, results, data.records)"
                    value={createForm.apiItemsPath}
                    onChange={(e) => setCreateForm((f) => ({ ...f, apiItemsPath: e.target.value }))}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Dot-notation path to the array of records in the JSON response.
                  </p>
                </div>

                <div className="space-y-2 pt-1 border-t border-border/40">
                  <Label className="text-xs font-medium text-foreground">Record Field Mappings</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Title Key *</Label>
                      <Input
                        placeholder="title"
                        value={createForm.apiFieldTitle}
                        onChange={(e) => setCreateForm((f) => ({ ...f, apiFieldTitle: e.target.value }))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">URL Key *</Label>
                      <Input
                        placeholder="url"
                        value={createForm.apiFieldUrl}
                        onChange={(e) => setCreateForm((f) => ({ ...f, apiFieldUrl: e.target.value }))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Pub Date Key *</Label>
                      <Input
                        placeholder="publicationDate"
                        value={createForm.apiFieldPubDate}
                        onChange={(e) => setCreateForm((f) => ({ ...f, apiFieldPubDate: e.target.value }))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Content/Summary Key</Label>
                      <Input
                        placeholder="content"
                        value={createForm.apiFieldContent}
                        onChange={(e) => setCreateForm((f) => ({ ...f, apiFieldContent: e.target.value }))}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-border/40">
                  <Label className="text-xs">Custom HTTP Headers (Optional JSON)</Label>
                  <Textarea
                    placeholder='{"Authorization": "Bearer secret_token", "Accept": "application/json"}'
                    value={createForm.apiHeaders}
                    onChange={(e) => setCreateForm((f) => ({ ...f, apiHeaders: e.target.value }))}
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 col-span-2">
                <Label>Feed URL (Optional)</Label>
                <Input
                  placeholder="https://www.centralbank.go.ke/rss"
                  value={createForm.feedUrl}
                  onChange={(e) => setCreateForm((f) => ({ ...f, feedUrl: e.target.value }))}
                />
              </div>
            )}

            <div className="space-y-1.5 col-span-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Internal notes about parsing or monitoring this source"
                value={createForm.notes}
                onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              className="bg-secondary hover:bg-[#007a50]"
              disabled={!createForm.name.trim() || !createForm.baseUrl.trim() || createMutation.isPending}
              onClick={() => {
                let apiConfig: any = undefined;

                if (createForm.monitoringMethod === "API") {
                  let parsedHeaders: Record<string, string> | undefined = undefined;
                  if (createForm.apiHeaders.trim()) {
                    try {
                      const parsed = JSON.parse(createForm.apiHeaders.trim());
                      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
                        throw new Error("Headers must be a JSON key-value object");
                      }
                      parsedHeaders = parsed;
                    } catch (err: any) {
                      toast.error(`Invalid JSON headers: ${err.message}`);
                      return;
                    }
                  }

                  const endpoint = createForm.apiEndpoint.trim() || createForm.feedUrl.trim() || createForm.baseUrl.trim();
                  if (!endpoint) {
                    toast.error("Please provide a valid API endpoint or Base URL");
                    return;
                  }

                  apiConfig = {
                    endpoint,
                    headers: parsedHeaders,
                    itemsPath: createForm.apiItemsPath.trim() || "data",
                    fieldMapping: {
                      title: createForm.apiFieldTitle.trim() || "title",
                      url: createForm.apiFieldUrl.trim() || "url",
                      publicationDate: createForm.apiFieldPubDate.trim() || "publicationDate",
                      content: createForm.apiFieldContent.trim() || undefined,
                    },
                  };
                }

                createMutation.mutate({
                  name: createForm.name.trim(),
                  baseUrl: createForm.baseUrl.trim(),
                  jurisdiction: createForm.jurisdiction,
                  authorityType: createForm.authorityType,
                  sourceType: createForm.sourceType,
                  monitoringMethod: createForm.monitoringMethod,
                  feedUrl: createForm.feedUrl.trim() || (createForm.monitoringMethod === "API" ? createForm.apiEndpoint.trim() || undefined : undefined),
                  apiConfig,
                  notes: createForm.notes.trim() || undefined,
                });
              }}
            >
              {createMutation.isPending ? "Creating..." : "Register Source"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VERIFY DIALOG */}
      <Dialog open={!!verifyTarget} onOpenChange={() => setVerifyTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Source Monitor</DialogTitle>
            <DialogDescription>Mark &quot;{verifyTarget?.name}&quot; as verified. This confirms the URLs are legitimate and safe.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Verification Notes (Optional)</Label>
            <Textarea
              placeholder="e.g. Confirmed official URL via gov portal."
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyTarget(null)}>Cancel</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={() => verifyTarget && verifyMutation.mutate({ id: verifyTarget.id, notes: verifyNotes || undefined })}
            >
              Approve & Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Monitor</AlertDialogTitle>
            <AlertDialogDescription>This will soft-delete &quot;{deleteTarget?.name}&quot; from the registry.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
