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
import { Loader2, Megaphone, Plus, Send, ChevronLeft, ChevronRight, X } from "lucide-react"

// --- Constants ----------------------------------------------------------------

const REGULATORY_BODIES = ["CBK", "CMA", "ODPC", "CA", "GAZETTE"] as const
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
  regulatoryBody: string
  category: string
  severity: string
  isActive: boolean
  publishedAt: string | Date
  createdAt: string | Date
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
  regulatoryBody: "" as RegulatoryBody | "",
  category: "" as AlertCategory | "",
  severity: "MEDIUM" as AlertSeverity,
  effectiveDate: "",
  expiresAt: "",
}

// --- Page ---------------------------------------------------------------------

export default function AdminAlertsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [page, setPage] = useState(1)

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin-alert-draft")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && Object.keys(parsed).length > 0) {
          setForm(parsed)
          setShowForm(true)
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, [])

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

  const createMutation = trpc.alert.create.useMutation({
    onSuccess: () => {
      toast.success("Alert saved as draft")
      setForm(EMPTY_FORM)
      setErrors({})
      setShowForm(false)
      utils.alert.getAdminAlerts.invalidate()
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to create alert")
    },
  })

  const publishMutation = trpc.alert.publish.useMutation({
    onSuccess: () => {
      toast.success("Alert published and notifications dispatched")
      utils.alert.getAdminAlerts.invalidate()
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to publish alert")
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

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regulatory Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and publish regulatory updates to subscribers.
          </p>
        </div>
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
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
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

            {/* Row: regulatory body + category + severity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        </Card>
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Megaphone className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Failed to load alerts</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Megaphone className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No alerts yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Create your first alert above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {alerts.map((alert) => {
              const sev = (alert.severity ?? "MEDIUM") as AlertSeverity
              const severityClass = SEVERITY_STYLES[sev] ?? SEVERITY_STYLES.MEDIUM
              return (
                <Card key={alert.id} className="transition-colors hover:bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${severityClass}`}>
                            {sev}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                            {alert.regulatoryBody}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {alert.category.replace(/_/g, " ")}
                          </span>
                          <Badge
                            variant="outline"
                            className={alert.isActive
                              ? "text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                              : "text-[10px] border-border text-muted-foreground"
                            }
                          >
                            {alert.isActive ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground leading-snug truncate">
                          {alert.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {alert.summary}
                        </p>
                      </div>

                      {!alert.isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => publishMutation.mutate({ alertId: alert.id })}
                          disabled={publishMutation.isPending}
                        >
                          {publishMutation.isPending && publishMutation.variables?.alertId === alert.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          Publish
                        </Button>
                      )}
                    </div>
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
    </div>
  )
}
