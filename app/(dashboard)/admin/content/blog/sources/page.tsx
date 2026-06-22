"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Search, MoreVertical, Database, CheckCircle2,
  Trash2, ChevronLeft, ChevronRight, Plus, Eye, Activity, ShieldCheck, AlertTriangle, Play
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
    name: "", description: "", jurisdiction: "KE" as any, authorityType: "CENTRAL_BANK" as any,
    sourceType: "OFFICIAL" as any, monitoringMethod: "MANUAL" as any, baseUrl: "", feedUrl: "", notes: ""
  })

  const [verifyTarget, setVerifyTarget] = useState<{ id: string; name: string } | null>(null)
  const [verifyNotes, setVerifyNotes] = useState("")

  const utils = trpc.useUtils()

  const { data, isLoading, isError } = trpc.blogAutomation.adminListMonitors.useQuery({
    jurisdiction: jurisdictionFilter !== "all" ? (jurisdictionFilter as any) : undefined,
    search: search || undefined,
    page,
    limit: 20,
  })

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
        name: "", description: "", jurisdiction: "KE", authorityType: "CENTRAL_BANK",
        sourceType: "OFFICIAL", monitoringMethod: "MANUAL", baseUrl: "", feedUrl: "", notes: ""
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
    },
    onError: (err: any) => toast.error(err.message),
  })

  const totalPages = data ? Math.ceil(data.pagination.total / 20) : 1

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Source Monitor Registry</h1>
          <p className="text-sm text-gray-500 mt-1">Manage approved multi-jurisdiction regulatory sources.</p>
        </div>
        <Button className="bg-secondary hover:bg-[#007a50] text-white gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Monitor
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Activity className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 font-semibold">Phase 3 Automation Notice</AlertTitle>
        <AlertDescription className="text-blue-700">
          This registry only stores approved sources. Automated source discovery, fetching, scoring, and drafting will be implemented in a later sprint.
        </AlertDescription>
      </Alert>

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
            
            <div className="space-y-1.5 col-span-2">
              <Label>Feed/API URL (Optional)</Label>
              <Input
                placeholder="https://www.centralbank.go.ke/rss"
                value={createForm.feedUrl}
                onChange={(e) => setCreateForm((f) => ({ ...f, feedUrl: e.target.value }))}
              />
            </div>

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
              onClick={() => createMutation.mutate({
                name: createForm.name.trim(),
                baseUrl: createForm.baseUrl.trim(),
                jurisdiction: createForm.jurisdiction,
                authorityType: createForm.authorityType,
                sourceType: createForm.sourceType,
                monitoringMethod: createForm.monitoringMethod,
                feedUrl: createForm.feedUrl.trim() || undefined,
                notes: createForm.notes.trim() || undefined,
              })}
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
