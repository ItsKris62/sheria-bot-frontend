"use client"

import { useState, useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Loader2, 
  Megaphone, 
  Plus, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  Cpu 
} from "lucide-react"
import { AdminEmptyState, AdminErrorState, AdminPageHeader } from "@/components/admin/portal"
import { PortalSurface } from "@/components/portal"
import { AUDITED_JURISDICTIONS, jurisdictionLabel, type AuditedJurisdictionCode } from "@/lib/jurisdictions"

// --- Constants ----------------------------------------------------------------

const REGULATORY_BODIES = ["CBK", "CMA", "ODPC", "CA", "GAZETTE", "BNR", "RURA", "RISA", "RWANDA_GAZETTE", "RBM", "MACRA", "MALAWI_GAZETTE"] as const
const ALERT_CATEGORIES = [
  "PRUDENTIAL",
  "DATA_PROTECTION",
  "AML_CFT",
  "LICENSING",
  "CAPITAL_MARKETS",
  "GENERAL",
] as const
const ALERT_SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const

type RegulatoryBody = (typeof REGULATORY_BODIES)[number]
type AlertCategory = (typeof ALERT_CATEGORIES)[number]
type AlertSeverity = (typeof ALERT_SEVERITIES)[number]

// --- Validation ---------------------------------------------------------------

const createAlertSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(500),
  body: z.string().min(20, "Body must be at least 20 characters"),
  sourceUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  jurisdictionCode: z.enum(["KE", "RW", "MW"], { required_error: "Select a country" }),
  regulatoryBody: z.enum(REGULATORY_BODIES, { required_error: "Select a regulatory body" }),
  category: z.enum(ALERT_CATEGORIES, { required_error: "Select a category" }),
  severity: z.enum(ALERT_SEVERITIES),
  effectiveDate: z.string().optional(),
  expiresAt: z.string().optional(),
})

type FormErrors = Partial<Record<keyof z.infer<typeof createAlertSchema>, string>>

// --- Local types --------------------------------------------------------------

interface AdminAlert {
  id: string
  title: string
  summary: string
  body?: string
  sourceUrl?: string | null
  jurisdictionCode: string
  regulatoryBody: string
  category: string
  severity: string
  isActive: boolean
  publishedAt: string | Date
  createdAt: string | Date
  effectiveDate?: string | Date | null
  expiresAt?: string | Date | null
  automationDraftKey?: string | null
  primaryRegulatorySourceItem?: {
    id: string
    title: string
    officialTitle?: string | null
    summary: string
    informationType: string
    regulatoryStage: string
    verificationState: string
    materiality: string
    publicationDate?: string | Date | null
    effectiveDate?: string | Date | null
    complianceDeadline?: string | Date | null
    consultationDeadline?: string | Date | null
    source?: {
      sourceKey: string
      name: string
      authorityType: string
      sourceType: string
      baseUrl: string
    } | null
    evidenceLinks?: Array<{
      id: string
      role: string
      isPrimary: boolean
      snapshot?: {
        id: string
        canonicalUrl: string
        retrievedAt: string | Date
        contentHash: string
      } | null
    }>
  } | null
}

// --- Severity styles ----------------------------------------------------------

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  CRITICAL: "bg-red-500/10 text-red-600 border border-red-500/20",
  HIGH:     "bg-orange-500/10 text-orange-600 border border-orange-500/20",
  MEDIUM:   "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
  LOW:      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
}

// --- Empty form ---------------------------------------------------------------

const EMPTY_FORM = {
  title: "",
  summary: "",
  body: "",
  sourceUrl: "",
  jurisdictionCode: "KE" as AuditedJurisdictionCode,
  regulatoryBody: "" as RegulatoryBody | "",
  category: "" as AlertCategory | "",
  severity: "MEDIUM" as AlertSeverity,
  effectiveDate: "",
  expiresAt: "",
}

function readSavedDraft() {
  if (typeof window === "undefined") {
    return { form: EMPTY_FORM, showForm: false }
  }

  try {
    const saved = localStorage.getItem("admin-alert-draft")
    if (!saved) return { form: EMPTY_FORM, showForm: false }

    const parsed = createAlertSchema.partial().safeParse(JSON.parse(saved))
    if (!parsed.success || Object.keys(parsed.data).length === 0) {
      return { form: EMPTY_FORM, showForm: false }
    }

    return {
      form: { ...EMPTY_FORM, ...parsed.data },
      showForm: true,
    }
  } catch {
    return { form: EMPTY_FORM, showForm: false }
  }
}

// --- Page ---------------------------------------------------------------------

export default function AdminAlertsPage() {
  const [form, setForm] = useState(() => readSavedDraft().form)
  const [showForm, setShowForm] = useState(() => readSavedDraft().showForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [page, setPage] = useState(1)
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)

  // Edit draft dialog state
  const [editingAlert, setEditingAlert] = useState<AdminAlert | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    summary: "",
    body: "",
    category: "GENERAL" as AlertCategory,
    severity: "MEDIUM" as AlertSeverity,
    sourceUrl: "",
    effectiveDate: "",
    expiresAt: "",
  })

  // Save draft on form changes
  useEffect(() => {
    if (form === EMPTY_FORM) {
      localStorage.removeItem("admin-alert-draft")
    } else {
      localStorage.setItem("admin-alert-draft", JSON.stringify(form))
    }
  }, [form])

  const utils = trpc.useUtils()

  const { data, isLoading, isError } = trpc.alert.getAdminAlerts.useQuery({ page, limit: 20 })
  const alerts = ((data as { alerts?: unknown[] } | undefined)?.alerts ?? []) as AdminAlert[]
  const total = (data as { total?: number } | undefined)?.total ?? 0
  const totalPages = Math.ceil(total / 20) || 1

  const { data: budgetStatus } = trpc.alert.getAIBudgetStatus.useQuery(undefined, {
    refetchInterval: 30000,
  })

  const createMutation = trpc.alert.create.useMutation({
    onSuccess: () => {
      toast.success("Alert saved as draft")
      setForm(EMPTY_FORM)
      setErrors({})
      setShowForm(false)
      utils.alert.getAdminAlerts.invalidate()
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to create alert")
    },
  })

  const publishMutation = trpc.alert.publish.useMutation({
    onSuccess: () => {
      toast.success("Alert published and notifications dispatched")
      utils.alert.getAdminAlerts.invalidate()
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to publish alert")
    },
  })

  const updateDraftMutation = trpc.alert.updateDraft.useMutation({
    onSuccess: () => {
      toast.success("Alert draft updated successfully")
      setEditingAlert(null)
      utils.alert.getAdminAlerts.invalidate()
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to update alert draft")
    },
  })

  const rejectDraftMutation = trpc.alert.rejectDraft.useMutation({
    onSuccess: () => {
      toast.success("Alert draft rejected and archived")
      utils.alert.getAdminAlerts.invalidate()
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to reject alert draft")
    },
  })

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function handleSubmit() {
    const payload = {
      ...form,
      sourceUrl: form.sourceUrl || undefined,
      effectiveDate: form.effectiveDate
        ? new Date(form.effectiveDate).toISOString()
        : undefined,
      expiresAt: form.expiresAt
        ? new Date(form.expiresAt).toISOString()
        : undefined,
    }

    const result = createAlertSchema.safeParse(payload)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormErrors
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    createMutation.mutate(result.data)
  }

  function openEditModal(alert: AdminAlert) {
    setEditingAlert(alert)
    setEditForm({
      title: alert.title,
      summary: alert.summary,
      body: alert.body || "",
      category: (alert.category as AlertCategory) || "GENERAL",
      severity: (alert.severity as AlertSeverity) || "MEDIUM",
      sourceUrl: alert.sourceUrl || "",
      effectiveDate: alert.effectiveDate ? new Date(alert.effectiveDate).toISOString().slice(0, 16) : "",
      expiresAt: alert.expiresAt ? new Date(alert.expiresAt).toISOString().slice(0, 16) : "",
    })
  }

  function handleSaveEdit() {
    if (!editingAlert) return
    updateDraftMutation.mutate({
      alertId: editingAlert.id,
      title: editForm.title,
      summary: editForm.summary,
      body: editForm.body,
      category: editForm.category,
      severity: editForm.severity,
      sourceUrl: editForm.sourceUrl || undefined,
      effectiveDate: editForm.effectiveDate ? new Date(editForm.effectiveDate).toISOString() : undefined,
      expiresAt: editForm.expiresAt ? new Date(editForm.expiresAt).toISOString() : undefined,
    })
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-8">
      {/* Page header */}
      <AdminPageHeader
        title="Regulatory Alerts & Governance"
        description="Review, edit, reject, and publish regulatory intelligence updates with global AI budget governance."
        icon={Megaphone}
        action={
        <Button
          onClick={() => setShowForm((v) => !v)}
          variant={showForm ? "outline" : "default"}
          size="sm"
          className="gap-2"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              New Alert
            </>
          )}
        </Button>
        }
      />

      {/* Global AI Budget Governance Card */}
      {budgetStatus && (
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-sm font-semibold">
                  Global Monthly AI Budget Governance (Period: {budgetStatus.period})
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-mono border-emerald-500/40 text-emerald-500">
                Cap: ${budgetStatus.budgetUsd.toFixed(2)} / month
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-md border border-border/40 bg-muted/20 p-2.5">
                <div className="text-[11px] text-muted-foreground font-medium">Spent Spend</div>
                <div className="text-base font-bold text-foreground font-mono mt-0.5">
                  ${budgetStatus.spentUsd.toFixed(2)}
                </div>
              </div>
              <div className="rounded-md border border-border/40 bg-muted/20 p-2.5">
                <div className="text-[11px] text-muted-foreground font-medium">Active Reserved</div>
                <div className="text-base font-bold text-amber-500 font-mono mt-0.5">
                  ${budgetStatus.reservedUsd.toFixed(2)}
                </div>
              </div>
              <div className="rounded-md border border-border/40 bg-muted/20 p-2.5">
                <div className="text-[11px] text-muted-foreground font-medium">Remaining Budget</div>
                <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">
                  ${budgetStatus.remainingUsd.toFixed(2)}
                </div>
              </div>
              <div className="rounded-md border border-border/40 bg-muted/20 p-2.5">
                <div className="text-[11px] text-muted-foreground font-medium">Utilization</div>
                <div className="text-base font-bold text-foreground font-mono mt-0.5">
                  {budgetStatus.percentUsed.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Provider spend breakdown telemetry */}
            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground flex-wrap">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-blue-500" />
                Provider Telemetry:
              </span>
              <Badge variant="secondary" className="text-[11px] font-mono">
                Anthropic: ${budgetStatus.providers.anthropic.toFixed(2)}
              </Badge>
              <Badge variant="secondary" className="text-[11px] font-mono">
                OpenAI: ${budgetStatus.providers.openai.toFixed(2)}
              </Badge>
              <Badge variant="secondary" className="text-[11px] font-mono">
                Gemini: ${budgetStatus.providers.gemini.toFixed(2)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create form */}
      {showForm && (
        <PortalSurface>
          <CardHeader>
            <CardTitle className="text-base">New Regulatory Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="alert-title">Title</Label>
              <Input
                id="alert-title"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. CBK Issues New Capital Adequacy Requirements"
                maxLength={200}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <Label htmlFor="alert-summary">Summary <span className="text-muted-foreground text-[11px]">(max 500 chars)</span></Label>
              <Textarea
                id="alert-summary"
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                placeholder="Brief overview shown in notification previews..."
                rows={2}
                maxLength={500}
              />
              {errors.summary && <p className="text-xs text-destructive">{errors.summary}</p>}
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <Label htmlFor="alert-body">Full Details</Label>
              <Textarea
                id="alert-body"
                value={form.body}
                onChange={(e) => setField("body", e.target.value)}
                placeholder="Full regulatory alert text..."
                rows={6}
              />
              {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
            </div>

            {/* Row: jurisdiction + regulatory body + category + severity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Select
                  value={form.jurisdictionCode}
                  onValueChange={(v) => setField("jurisdictionCode", v as AuditedJurisdictionCode)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDITED_JURISDICTIONS.map((item) => (
                      <SelectItem key={item.code} value={item.code}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jurisdictionCode && <p className="text-xs text-destructive">{errors.jurisdictionCode}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Regulatory Body</Label>
                <Select
                  value={form.regulatoryBody}
                  onValueChange={(v) => setField("regulatoryBody", v as RegulatoryBody)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select body" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGULATORY_BODIES.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.regulatoryBody && <p className="text-xs text-destructive">{errors.regulatoryBody}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setField("category", v as AlertCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALERT_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Severity</Label>
                <Select
                  value={form.severity}
                  onValueChange={(v) => setField("severity", v as AlertSeverity)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALERT_SEVERITIES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: effectiveDate + expiresAt + sourceUrl */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="alert-effective">Effective Date <span className="text-muted-foreground text-[11px]">(optional)</span></Label>
                <Input
                  id="alert-effective"
                  type="datetime-local"
                  value={form.effectiveDate}
                  onChange={(e) => setField("effectiveDate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="alert-expires">Expires At <span className="text-muted-foreground text-[11px]">(optional)</span></Label>
                <Input
                  id="alert-expires"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setField("expiresAt", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="alert-source">Source URL <span className="text-muted-foreground text-[11px]">(optional)</span></Label>
                <Input
                  id="alert-source"
                  type="url"
                  value={form.sourceUrl}
                  onChange={(e) => setField("sourceUrl", e.target.value)}
                  placeholder="https://..."
                />
                {errors.sourceUrl && <p className="text-xs text-destructive">{errors.sourceUrl}</p>}
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}) }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="gap-2"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </PortalSurface>
      )}

      {/* Alert list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            All Alerts {total > 0 && <span className="normal-case">({total})</span>}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading alerts...
          </div>
        ) : isError ? (
          <AdminErrorState
            title="Failed to load alerts"
            description="Regulatory alert data is temporarily unavailable."
          />
        ) : alerts.length === 0 ? (
          <AdminEmptyState
            title="No alerts yet"
            description="Create your first alert above."
            icon={Megaphone}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => {
              const sev = (alert.severity ?? "MEDIUM") as AlertSeverity
              const severityClass = SEVERITY_STYLES[sev] ?? SEVERITY_STYLES.MEDIUM
              const isExpanded = expandedAlertId === alert.id
              const sourceItem = alert.primaryRegulatorySourceItem
              const primaryEvidence = sourceItem?.evidenceLinks?.find((e) => e.isPrimary) ?? sourceItem?.evidenceLinks?.[0]
              const sourceUrl = alert.sourceUrl || primaryEvidence?.snapshot?.canonicalUrl || sourceItem?.source?.baseUrl

              return (
                <Card key={alert.id} className="transition-colors border-border/80">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${severityClass}`}>
                            {sev}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                            {jurisdictionLabel(alert.jurisdictionCode)} - {alert.regulatoryBody}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {alert.category.replace(/_/g, " ")}
                          </span>
                          <Badge
                            variant="outline"
                            className={alert.isActive
                              ? "text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                              : "text-[10px] border-amber-500/30 text-amber-600 bg-amber-500/5"
                            }
                          >
                            {alert.isActive ? "Published" : "Draft (Inactive)"}
                          </Badge>
                          {alert.automationDraftKey && (
                            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600 bg-blue-500/5">
                              Automation Prepared
                            </Badge>
                          )}
                          {sourceItem?.verificationState && (
                            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-600 bg-purple-500/5">
                              {sourceItem.verificationState}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {alert.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {alert.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              Hide Review
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              Review Provenance
                            </>
                          )}
                        </Button>

                        {!alert.isActive && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs"
                              onClick={() => openEditModal(alert)}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit Copy
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                if (confirm("Reject and archive this draft alert? This action prevents publication.")) {
                                  rejectDraftMutation.mutate({ alertId: alert.id, reason: "Rejected during admin review" })
                                }
                              }}
                              disabled={rejectDraftMutation.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Reject
                            </Button>

                            <Button
                              size="sm"
                              variant="default"
                              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => publishMutation.mutate({ alertId: alert.id })}
                              disabled={publishMutation.isPending}
                            >
                              {publishMutation.isPending && publishMutation.variables?.alertId === alert.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              Publish Alert
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expandable Review & Provenance Drawer */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-4 rounded-md bg-muted/20 p-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Column 1: Trusted Source Evidence */}
                          <div className="space-y-2.5 rounded-md border border-border/60 bg-background/60 p-3">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                              <span>1. Trusted Source Evidence</span>
                            </div>
                            <div className="space-y-1.5 text-muted-foreground">
                              <div><strong className="text-foreground">Regulator:</strong> {alert.regulatoryBody}</div>
                              <div><strong className="text-foreground">Jurisdiction:</strong> {jurisdictionLabel(alert.jurisdictionCode)} ({alert.jurisdictionCode})</div>
                              <div><strong className="text-foreground">Authority:</strong> {sourceItem?.source?.authorityType || "PRIMARY_REGULATOR"}</div>
                              <div><strong className="text-foreground">Source Key:</strong> {sourceItem?.source?.sourceKey || "Manual / Unlinked"}</div>
                              {sourceUrl && (
                                <div className="pt-1">
                                  <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Open Official Source URL
                                  </a>
                                </div>
                              )}
                              {primaryEvidence?.snapshot?.retrievedAt && (
                                <div>
                                  <strong className="text-foreground">Retrieved At:</strong> {new Date(primaryEvidence.snapshot.retrievedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Column 2: SheriaBot AI Interpretation */}
                          <div className="space-y-2.5 rounded-md border border-border/60 bg-background/60 p-3">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                              <FileText className="h-3.5 w-3.5 text-purple-500" />
                              <span>2. AI Interpretation & Staging</span>
                            </div>
                            <div className="space-y-1.5 text-muted-foreground">
                              <div><strong className="text-foreground">Info Type:</strong> {sourceItem?.informationType || alert.category}</div>
                              <div><strong className="text-foreground">Stage:</strong> {sourceItem?.regulatoryStage || "ENACTED"}</div>
                              <div><strong className="text-foreground">Materiality:</strong> {sourceItem?.materiality || alert.severity}</div>
                              <div><strong className="text-foreground">Verification:</strong> {sourceItem?.verificationState || "REQUIRES_REVIEW"}</div>
                              <div><strong className="text-foreground">Effective Date:</strong> {alert.effectiveDate ? new Date(alert.effectiveDate).toLocaleDateString() : (sourceItem?.effectiveDate ? new Date(sourceItem.effectiveDate).toLocaleDateString() : "Not specified")}</div>
                              <div><strong className="text-foreground">Compliance Deadline:</strong> {sourceItem?.complianceDeadline ? new Date(sourceItem.complianceDeadline).toLocaleDateString() : "None"}</div>
                            </div>
                          </div>

                          {/* Column 3: Human Review & Publication Decision */}
                          <div className="space-y-2.5 rounded-md border border-border/60 bg-background/60 p-3">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs pb-1 border-b border-border/40">
                              <Megaphone className="h-3.5 w-3.5 text-emerald-500" />
                              <span>3. Human Publication Decision</span>
                            </div>
                            <div className="space-y-2 text-muted-foreground">
                              <p>
                                Machine automation drafts remain completely <strong className="text-foreground">inactive (0 subscriber emails / 0 SSE broadcasts)</strong> until an authorized administrator verifies the evidence and explicitly clicks Publish.
                              </p>
                              <div>
                                <strong className="text-foreground">Status:</strong> {alert.isActive ? `Published on ${new Date(alert.publishedAt).toLocaleString()}` : "Pending Admin Review"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Full Alert Body Preview */}
                        <div className="rounded-md border border-border/60 bg-background/60 p-3 space-y-1.5">
                          <span className="font-semibold text-foreground">Alert Body Details:</span>
                          <div className="text-muted-foreground whitespace-pre-wrap font-mono text-[11px] leading-relaxed bg-muted/40 p-2.5 rounded border border-border/40">
                            {alert.body || alert.summary}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit Draft Dialog */}
      <Dialog open={editingAlert !== null} onOpenChange={(open) => { if (!open) setEditingAlert(null) }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer Alert Copy (Draft)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-summary">Summary</Label>
              <Textarea
                id="edit-summary"
                rows={2}
                value={editForm.summary}
                onChange={(e) => setEditForm((prev) => ({ ...prev, summary: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-body">Full Alert Body</Label>
              <Textarea
                id="edit-body"
                rows={8}
                value={editForm.body}
                onChange={(e) => setEditForm((prev) => ({ ...prev, body: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(v) => setEditForm((prev) => ({ ...prev, category: v as AlertCategory }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALERT_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Severity</Label>
                <Select
                  value={editForm.severity}
                  onValueChange={(v) => setEditForm((prev) => ({ ...prev, severity: v as AlertSeverity }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALERT_SEVERITIES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-sourceUrl">Source URL</Label>
              <Input
                id="edit-sourceUrl"
                value={editForm.sourceUrl}
                onChange={(e) => setEditForm((prev) => ({ ...prev, sourceUrl: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingAlert(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={updateDraftMutation.isPending}>
              {updateDraftMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
