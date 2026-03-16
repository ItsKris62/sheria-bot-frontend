"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from "@/hooks/use-toast"
import { trpc } from "@/lib/trpc"
import {
  ClipboardCheck,
  Plus,
  Download,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Trash2,
  RefreshCw,
  AlertTriangle,
  XCircle,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  MinusCircle,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const PRODUCT_TYPES = [
  "Mobile Money Operator",
  "Digital Lending / Credit Provider",
  "Payment Gateway / PSP",
  "Insurance Technology (InsurTech)",
  "Investment Platform",
  "Remittance Service",
  "Cryptocurrency / Digital Assets",
  "Buy Now Pay Later (BNPL)",
  "Savings and Investment App",
  "Neobank / Digital Bank",
  "Microfinance Institution",
  "SACCO Technology",
  "Other",
]

const BUSINESS_STAGES = [
  "Pre-launch / Licensing Phase",
  "Operational (less than 1 year)",
  "Operational (1–3 years)",
  "Scaling / Expanding Services",
]

const TARGET_SEGMENTS = [
  "Individual consumers (B2C)",
  "SMEs (B2B)",
  "Enterprise / Corporate",
  "Government / Public Sector",
]

const SERVICES_OFFERED = [
  "Account opening / KYC",
  "Payments processing",
  "Lending / Credit",
  "Savings / Deposits",
  "Insurance distribution",
  "Investment / Wealth management",
  "Foreign exchange",
  "Data processing / Analytics",
]

const PRIORITY_CONFIG: Record<string, { label: string; color: string; badge: string; dot: string }> = {
  CRITICAL: {
    label: "Critical",
    color: "text-red-600",
    badge: "bg-red-600 text-white border-transparent",
    dot: "bg-red-600",
  },
  HIGH: {
    label: "High",
    color: "text-orange-600",
    badge: "bg-orange-500 text-white border-transparent",
    dot: "bg-orange-500",
  },
  MEDIUM: {
    label: "Medium",
    color: "text-yellow-600",
    badge: "bg-yellow-500 text-white border-transparent",
    dot: "bg-yellow-500",
  },
  LOW: {
    label: "Low",
    color: "text-green-600",
    badge: "bg-green-600 text-white border-transparent",
    dot: "bg-green-600",
  },
}

// ─── Local Types ──────────────────────────────────────────────────────────────
// Backend uses path aliases not resolvable in frontend tsconfig → cast via these types.

type LegacyItemStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
type NormalizedItemStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "NOT_APPLICABLE"

type ChecklistItemLocal = {
  id: string
  category: string
  title: string
  description: string
  guidance: string | null
  regulatoryReference: string
  actionItems: string[]
  deadline: string | null
  penalty: string | null
  priority: string
  status: NormalizedItemStatus
  notes: string | null
  order: number
  completedAt: Date | null
  completedById: string | null
}

type ChecklistCategoryLocal = {
  name: string
  items: ChecklistItemLocal[]
  completedCount: number
  totalCount: number
  progress: number
}

type ChecklistDetailLocal = {
  id: string
  title: string
  productType: string | null
  businessStage: string | null
  progress: number
  completedItems: number
  totalItems: number
  status: string
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
  isNormalized: true
  categories: ChecklistCategoryLocal[]
}

type ChecklistStatusLocal = {
  checklistId: string
  status: string
  progress: number
  completedItems: number
  totalItems: number
  title: string
  createdAt: Date
  isNormalized: boolean
}

type ChecklistSummaryLocal = {
  id: string
  title: string
  productType: string | null
  businessStage: string | null
  progress: number
  completedItems: number
  totalItems: number
  criticalItems: number
  status: string
  createdAt: Date
  updatedAt: Date
  isNormalized: boolean
}

/** Polling budget: 80 polls × 3 s = 4 minutes */
const POLL_INTERVAL_MS  = 3_000
const POLL_TIMEOUT_MS   = 4 * 60 * 1_000 // 4 minutes

// ─── Multi-Select Component ───────────────────────────────────────────────────

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder: string
}) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              selected.includes(opt)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-muted-foreground">{placeholder}</p>
      )}
    </div>
  )
}

// ─── Generate Checklist Dialog ────────────────────────────────────────────────
// Fire-and-forget: submits async mutation, closes immediately, polls in detail view.

function GenerateChecklistDialog({
  onSuccess,
}: {
  onSuccess: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [productType, setProductType] = useState("")
  const [businessStage, setBusinessStage] = useState("")
  const [targetSegments, setTargetSegments] = useState<string[]>([])
  const [servicesOffered, setServicesOffered] = useState<string[]>([])
  const [additionalConcerns, setAdditionalConcerns] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateMutation = trpc.compliance.generateChecklistAsync.useMutation<any>({
    onSuccess: (data: { checklistId: string; status: string }) => {
      toast({
        title: "Generating your checklist",
        description:
          "Your checklist is being built in the background — progress will appear below.",
      })
      setOpen(false)
      resetForm()
      onSuccess(data.checklistId)
    },
    onError: (err: { message?: string }) => {
      toast({
        title: "Failed to start generation",
        description: err.message ?? "Please try again.",
        variant: "destructive",
      })
    },
  })

  const resetForm = () => {
    setProductType("")
    setBusinessStage("")
    setTargetSegments([])
    setServicesOffered([])
    setAdditionalConcerns("")
  }

  const canGenerate =
    productType && businessStage && targetSegments.length > 0 && servicesOffered.length > 0

  const handleGenerate = () => {
    if (!canGenerate || generateMutation.isPending) return
    generateMutation.mutate({
      productType,
      businessStage,
      targetSegments,
      servicesOffered,
      additionalConcerns: additionalConcerns.trim() || undefined,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (generateMutation.isPending) return
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Generate Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate AI Compliance Checklist
          </DialogTitle>
          <DialogDescription>
            Provide details about your fintech and we&apos;ll generate a comprehensive,
            regulation-grounded compliance checklist tailored to your business.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Product Type */}
          <div className="space-y-2">
            <Label>
              Fintech Product / Service Type{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={productType}
              onValueChange={setProductType}
              disabled={generateMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Business Stage */}
          <div className="space-y-2">
            <Label>
              Business Stage <span className="text-destructive">*</span>
            </Label>
            <Select
              value={businessStage}
              onValueChange={setBusinessStage}
              disabled={generateMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your current stage" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Segments */}
          <div className="space-y-2">
            <Label>
              Target Customer Segments <span className="text-destructive">*</span>
            </Label>
            <MultiSelect
              options={TARGET_SEGMENTS}
              selected={targetSegments}
              onChange={setTargetSegments}
              placeholder="Select all that apply"
            />
          </div>

          {/* Services Offered */}
          <div className="space-y-2">
            <Label>
              Services Offered <span className="text-destructive">*</span>
            </Label>
            <MultiSelect
              options={SERVICES_OFFERED}
              selected={servicesOffered}
              onChange={setServicesOffered}
              placeholder="Select all applicable services"
            />
          </div>

          {/* Additional Concerns */}
          <div className="space-y-2">
            <Label>
              Specific Compliance Concerns{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              placeholder="e.g. We plan to launch a mobile lending product targeting informal traders in rural counties..."
              value={additionalConcerns}
              onChange={(e) => setAdditionalConcerns(e.target.value)}
              rows={3}
              maxLength={1000}
              disabled={generateMutation.isPending}
            />
            <p className="text-xs text-muted-foreground text-right">
              {additionalConcerns.length}/1000
            </p>
          </div>

          {/* Info box */}
          <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Our AI retrieves relevant passages from Kenyan regulatory documents (CBK, DPA, POCAMLA,
                etc.) to ground your checklist in actual law — not generic guidance. Generation runs in
                the background and typically takes 1–3 minutes.
              </p>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || generateMutation.isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting generation...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Checklist
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Checklist Card (Summary) ─────────────────────────────────────────────────

function ChecklistCard({
  checklist,
  onSelect,
  onDelete,
}: {
  checklist: ChecklistSummaryLocal
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  const isFailed    = checklist.status === "FAILED"
  const isGenerating = checklist.status === "GENERATING"
  const isCompleted  = checklist.status === "COMPLETED"

  const statusIcon = isCompleted && checklist.progress === 100
    ? <CheckCircle2 className="h-5 w-5 text-green-600" />
    : isCompleted
    ? <TrendingUp className="h-5 w-5 text-primary" />
    : isGenerating
    ? <Loader2 className="h-5 w-5 text-primary animate-spin" />
    : isFailed
    ? <XCircle className="h-5 w-5 text-destructive" />
    : <Clock className="h-5 w-5 text-yellow-500" />

  return (
    <Card
      className={`border-border/50 bg-card transition-shadow hover:shadow-lg ${
        !isFailed ? "cursor-pointer" : ""
      }`}
      onClick={() => !isFailed && onSelect(checklist.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="text-xs">
            {checklist.productType ?? "Compliance"}
          </Badge>
          {statusIcon}
        </div>
        <CardTitle className="mt-2 text-foreground text-base leading-tight">
          {checklist.title}
        </CardTitle>
        <CardDescription className="text-xs">
          {new Date(checklist.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isFailed ? (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Generation failed — please delete and try again
            </p>
          ) : isGenerating ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating your checklist — click to view progress
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{checklist.totalItems} items</span>
                <span className="font-medium text-foreground">{checklist.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${checklist.progress}%` }}
                />
              </div>
              {checklist.criticalItems > 0 && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {checklist.criticalItems} critical item
                  {checklist.criticalItems > 1 ? "s" : ""} pending
                </p>
              )}
            </>
          )}
          <div className="flex gap-2">
            {!isFailed && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(checklist.id)
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    View Progress
                  </>
                ) : (
                  <>
                    View Checklist
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={`text-destructive hover:text-destructive hover:bg-destructive/10 ${
                !isFailed ? "" : "flex-1"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(checklist.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Item Status Icon ─────────────────────────────────────────────────────────

function NormalizedStatusIcon({ status }: { status: NormalizedItemStatus }) {
  if (status === "COMPLETED")      return <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
  if (status === "IN_PROGRESS")    return <Clock className="h-5 w-5 text-blue-500 shrink-0" />
  if (status === "NOT_APPLICABLE") return <MinusCircle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
  return <Circle className="h-5 w-5 text-muted-foreground/50 shrink-0" />
}

function LegacyStatusIcon({ status }: { status: string }) {
  if (status === "COMPLETED") return <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
  if (status === "IN_PROGRESS") return <Clock className="h-5 w-5 text-blue-500 shrink-0" />
  return <Circle className="h-5 w-5 text-muted-foreground/50 shrink-0" />
}

// ─── PDF Export (Legacy) ──────────────────────────────────────────────────────
// TODO: add a normalized-checklist PDF export when NormalizedChecklistDetailView
// is stable. For now, this function is used only for legacy (isNormalized=false) checklists.

function buildPrintHtml(data: {
  title: string
  productType: string | null
  businessStage: string | null
  createdAt: Date
  checklistData: {
    categories: Array<{
      id: string
      name: string
      description: string
      items: Array<{
        id: string
        title: string
        regulatoryBasis: string
        priority: string
        description: string
        actionItems: string[]
        deadline: string
        penalty: string
      }>
    }>
    metadata: {
      totalItems: number
      criticalItems: number
      highItems: number
      estimatedCompletionDays: number
    }
  }
  itemProgress: Record<string, string>
}): string {
  const { title, productType, businessStage, createdAt, checklistData, itemProgress } = data
  const { categories, metadata } = checklistData

  const completedItems  = Object.values(itemProgress).filter((v) => v === "COMPLETED").length
  const inProgressItems = Object.values(itemProgress).filter((v) => v === "IN_PROGRESS").length
  const mediumItems     = categories.flatMap((c) => c.items).filter((i) => i.priority === "MEDIUM").length
  const lowItems        = categories.flatMap((c) => c.items).filter((i) => i.priority === "LOW").length
  const progressPct     = metadata.totalItems > 0 ? Math.round((completedItems / metadata.totalItems) * 100) : 0
  const dateStr         = new Date(createdAt).toLocaleDateString("en-KE", { day: "2-digit", month: "long", year: "numeric" })

  const priorityBadge = (p: string) => {
    const colors: Record<string, string> = {
      CRITICAL: "background:#DC2626;color:#fff",
      HIGH:     "background:#EA580C;color:#fff",
      MEDIUM:   "background:#CA8A04;color:#fff",
      LOW:      "background:#16A34A;color:#fff",
    }
    return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;${colors[p] ?? colors.LOW}">${p}</span>`
  }

  const itemStatusBadge = (id: string) => {
    const s = itemProgress[id] ?? "NOT_STARTED"
    if (s === "COMPLETED")  return `<span style="color:#16A34A;font-weight:600">✓ Completed</span>`
    if (s === "IN_PROGRESS") return `<span style="color:#2563EB;font-weight:600">⟳ In Progress</span>`
    return `<span style="color:#6B7280">○ Not Started</span>`
  }

  const categoryRows = categories.map((cat) => {
    const catCompleted = cat.items.filter((i) => itemProgress[i.id] === "COMPLETED").length
    const itemsHtml = cat.items.map((item) => `
      <div style="margin:12px 0;padding:12px;border:1px solid #E5E7EB;border-radius:6px;page-break-inside:avoid">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
          <div>
            <span style="font-size:10px;color:#9CA3AF;font-family:monospace">${item.id}</span>
            <p style="font-weight:600;color:#1A2B4A;margin:2px 0;font-size:13px">${item.title}</p>
            <p style="font-size:11px;color:#6B7280;font-style:italic;margin:2px 0">📋 ${item.regulatoryBasis}</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;white-space:nowrap">
            ${priorityBadge(item.priority)}
            <span style="font-size:10px">${itemStatusBadge(item.id)}</span>
          </div>
        </div>
        <p style="font-size:12px;color:#4A5568;margin:6px 0;line-height:1.5">${item.description}</p>
        ${item.actionItems?.length ? `
          <div style="margin-top:8px">
            <p style="font-size:11px;font-weight:600;color:#1A2B4A;margin-bottom:4px">Action Items:</p>
            <ol style="margin:0;padding-left:16px">
              ${item.actionItems.map((a) => `<li style="font-size:11px;color:#4A5568;margin-bottom:2px">${a}</li>`).join("")}
            </ol>
          </div>
        ` : ""}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
          ${item.deadline ? `<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:4px;padding:6px"><p style="font-size:10px;font-weight:600;color:#166534">⏰ Deadline</p><p style="font-size:11px;color:#4A5568;margin-top:2px">${item.deadline}</p></div>` : ""}
          ${item.penalty ? `<div style="background:#FFF1F2;border:1px solid #FECDD3;border-radius:4px;padding:6px"><p style="font-size:10px;font-weight:600;color:#9F1239">⚠️ Penalty</p><p style="font-size:11px;color:#4A5568;margin-top:2px">${item.penalty}</p></div>` : ""}
        </div>
      </div>
    `).join("")

    return `
      <div style="margin:24px 0;page-break-inside:avoid">
        <div style="background:#1A2B4A;color:#fff;padding:10px 16px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;align-items:center">
          <div>
            <h3 style="margin:0;font-size:14px;font-weight:700">${cat.name}</h3>
            <p style="margin:2px 0 0;font-size:11px;opacity:0.8">${cat.description}</p>
          </div>
          <span style="font-size:12px;opacity:0.9">${catCompleted}/${cat.items.length} completed</span>
        </div>
        <div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 6px 6px;padding:12px">
          ${itemsHtml}
        </div>
      </div>
    `
  }).join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} — SheriaBot Compliance Checklist</title>
  <style>
    @media print {
      @page { margin: 15mm; size: A4; }
      .no-print { display: none !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1A2B4A; margin: 0; padding: 20px; font-size: 13px; line-height: 1.5; }
    h1, h2, h3 { margin: 0 0 8px; }
  </style>
</head>
<body>
  <div style="text-align:center;padding:40px 20px 32px;border-bottom:3px solid #1A2B4A;margin-bottom:32px">
    <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="background:#1A2B4A;color:#00875A;width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900">S</div>
      <span style="font-size:26px;font-weight:800;color:#1A2B4A;letter-spacing:-0.5px">SheriaBot</span>
    </div>
    <h1 style="font-size:22px;font-weight:700;color:#1A2B4A;margin:0 0 6px">Compliance Checklist Report</h1>
    <p style="font-size:16px;color:#00875A;font-weight:600;margin:0 0 20px">${title}</p>
    <div style="display:inline-grid;grid-template-columns:auto auto;gap:4px 24px;text-align:left;background:#F7F8FA;padding:16px 24px;border-radius:8px;font-size:12px">
      <span style="color:#6B7280">Generated on:</span><span style="font-weight:600">${dateStr}</span>
      <span style="color:#6B7280">Product Type:</span><span style="font-weight:600">${productType ?? "—"}</span>
      <span style="color:#6B7280">Business Stage:</span><span style="font-weight:600">${businessStage ?? "—"}</span>
    </div>
    <p style="margin-top:24px;font-size:11px;color:#9CA3AF">Generated by SheriaBot — AI-Powered Regulatory Compliance for Kenya&apos;s Fintech Sector</p>
  </div>
  <div style="margin-bottom:32px;page-break-after:always">
    <h2 style="font-size:16px;font-weight:700;color:#1A2B4A;margin-bottom:16px;border-bottom:2px solid #00875A;padding-bottom:6px">Executive Summary</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
      <div style="background:#F7F8FA;border-radius:8px;padding:14px;text-align:center">
        <p style="font-size:28px;font-weight:700;color:#1A2B4A;margin:0">${metadata.totalItems}</p>
        <p style="font-size:11px;color:#6B7280;margin:4px 0 0">Total Items</p>
      </div>
      <div style="background:#F7F8FA;border-radius:8px;padding:14px;text-align:center">
        <p style="font-size:28px;font-weight:700;color:#1A2B4A;margin:0">${progressPct}%</p>
        <p style="font-size:11px;color:#6B7280;margin:4px 0 0">${completedItems} of ${metadata.totalItems} completed</p>
      </div>
      <div style="background:#F7F8FA;border-radius:8px;padding:14px;text-align:center">
        <p style="font-size:28px;font-weight:700;color:#1A2B4A;margin:0">${metadata.estimatedCompletionDays}</p>
        <p style="font-size:11px;color:#6B7280;margin:4px 0 0">Est. Days to Compliance</p>
      </div>
    </div>
    ${inProgressItems > 0 ? `<p style="margin-top:12px;font-size:12px;color:#2563EB">⟳ ${inProgressItems} items currently in progress</p>` : ""}
  </div>
  <div>
    <h2 style="font-size:16px;font-weight:700;color:#1A2B4A;margin-bottom:16px;border-bottom:2px solid #00875A;padding-bottom:6px">Compliance Requirements</h2>
    ${categoryRows}
  </div>
  <div style="margin-top:40px;padding:20px;background:#F7F8FA;border-radius:8px;border-top:3px solid #D4A843;page-break-before:always">
    <h2 style="font-size:14px;font-weight:700;color:#1A2B4A;margin-bottom:10px">Disclaimer</h2>
    <p style="font-size:11px;color:#4A5568;line-height:1.6">
      This compliance checklist was generated by SheriaBot using AI-powered analysis of Kenyan financial regulations.
      While every effort has been made to ensure accuracy, this document should not be considered legal advice.
      Organizations should consult with qualified legal and compliance professionals to verify all requirements.
      Regulatory requirements may change; please verify against the latest versions of referenced legislation.
    </p>
    <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="background:#1A2B4A;color:#00875A;width:24px;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900">S</div>
        <span style="font-size:12px;font-weight:700;color:#1A2B4A">SheriaBot</span>
      </div>
      <p style="font-size:10px;color:#9CA3AF">Generated: ${new Date(createdAt).toISOString()}</p>
    </div>
  </div>
</body>
</html>`
}

function handleExportPdf(data: Parameters<typeof buildPrintHtml>[0]) {
  const html = buildPrintHtml(data)
  const printWindow = window.open("", "_blank", "width=900,height=700")
  if (!printWindow) {
    toast({
      title: "PDF export blocked",
      description: "Please allow pop-ups for this site to export PDF.",
      variant: "destructive",
    })
    return
  }
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => { printWindow.print() }, 500)
}

// ─── Normalized Checklist Detail View ────────────────────────────────────────

function NormalizedChecklistDetailView({
  checklistId,
  statusData,
  onBack,
}: {
  checklistId: string
  statusData: ChecklistStatusLocal
  onBack: () => void
}) {
  const utils = trpc.useUtils()
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems]   = useState<Record<string, boolean>>({})
  const [editingNotes, setEditingNotes]     = useState<Record<string, string>>({})

  const { data: rawDetail, isLoading } = trpc.compliance.getChecklistDetail.useQuery(
    { checklistId },
    { enabled: true }
  )
  const detailData = rawDetail as ChecklistDetailLocal | undefined

  const updateItemMutation = trpc.compliance.updateChecklistItem.useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMutate: async (variables: any) => {
      await utils.compliance.getChecklistDetail.cancel({ checklistId })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prev = utils.compliance.getChecklistDetail.getData({ checklistId } as any)
      // Optimistic update
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      utils.compliance.getChecklistDetail.setData({ checklistId } as any, (old: any) => {
        if (!old) return old
        return {
          ...old,
          categories: old.categories.map((cat: ChecklistCategoryLocal) => ({
            ...cat,
            items: cat.items.map((item: ChecklistItemLocal) =>
              item.id === variables.itemId
                ? { ...item, status: variables.status, notes: variables.notes ?? item.notes }
                : item
            ),
          })),
        }
      })
      return { prev }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      // Server response wins — apply authoritative server values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      utils.compliance.getChecklistDetail.setData({ checklistId } as any, (old: any) => {
        if (!old) return old
        return {
          ...old,
          progress:       data.checklist.progress,
          completedItems: data.checklist.completedItems,
          status:         data.checklist.status,
          completedAt:    data.checklist.completedAt,
          categories: old.categories.map((cat: ChecklistCategoryLocal) => ({
            ...cat,
            items: cat.items.map((item: ChecklistItemLocal) =>
              item.id === data.item.id
                ? { ...item, status: data.item.status, notes: data.item.notes, completedAt: data.item.completedAt }
                : item
            ),
          })),
        }
      })
      // Refresh list card progress
      utils.compliance.listChecklists.invalidate()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any, _variables: any, context: any) => {
      if (context?.prev) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        utils.compliance.getChecklistDetail.setData({ checklistId } as any, context.prev as any)
      } else {
        utils.compliance.getChecklistDetail.invalidate({ checklistId } as any)
      }
      toast({ title: "Failed to update item", description: err.message, variant: "destructive" })
    },
  })

  // Cycle: PENDING → IN_PROGRESS → COMPLETED → PENDING
  const cycleStatus = (current: NormalizedItemStatus): NormalizedItemStatus => {
    if (current === "PENDING"      || current === "NOT_APPLICABLE") return "IN_PROGRESS"
    if (current === "IN_PROGRESS") return "COMPLETED"
    return "PENDING"
  }

  const handleStatusCycle = useCallback(
    (itemId: string, current: NormalizedItemStatus) => {
      const next = cycleStatus(current)
      updateItemMutation.mutate({ checklistId, itemId, status: next })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checklistId, updateItemMutation]
  )

  const handleStatusSelect = useCallback(
    (itemId: string, status: NormalizedItemStatus, notes?: string) => {
      updateItemMutation.mutate({ checklistId, itemId, status, notes })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checklistId, updateItemMutation]
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!detailData) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium">Failed to load checklist detail</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={onBack}>
            ← Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  const progress = detailData.progress
  const completedCount  = detailData.completedItems
  const totalItems      = detailData.totalItems
  const isAllDone       = detailData.status === "COMPLETED"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2 text-muted-foreground"
          >
            ← Back to Checklists
          </Button>
          <h2 className="text-xl font-bold text-foreground">{detailData.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {detailData.productType} · {detailData.businessStage}
          </p>
        </div>
        {isAllDone && (
          <Badge className="bg-green-600 text-white border-transparent text-sm px-3 py-1">
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Fully Compliant
          </Badge>
        )}
      </div>

      {/* Progress Summary Card */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Overall Progress</p>
              <p className="text-4xl font-bold text-primary">{progress}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} of {totalItems} completed
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((priority) => {
                const allItems = detailData.categories.flatMap((c) => c.items)
                const count = allItems.filter((i) => i.priority === priority).length
                const dot = PRIORITY_CONFIG[priority]?.dot ?? "bg-muted"
                return (
                  <div key={priority} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${dot}`} />
                    <span className="text-muted-foreground capitalize">{priority.toLowerCase()}:</span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hint */}
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <ShieldCheck className="h-3 w-3" />
        Click the status icon to cycle: Pending → In Progress → Completed. Use the dropdown for
        &quot;Not Applicable&quot;.
      </p>

      {/* Categories */}
      <div className="space-y-4">
        {detailData.categories.map((category) => {
          const isOpen      = openCategories[category.name] !== false // default open
          const catProgress = category.progress

          return (
            <Collapsible
              key={category.name}
              open={isOpen}
              onOpenChange={(open) =>
                setOpenCategories((prev) => ({ ...prev, [category.name]: open }))
              }
            >
              <Card className="border-border/50 bg-card">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <div className="min-w-0">
                          <CardTitle className="text-base font-semibold truncate">
                            {category.name}
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              ({category.totalCount} item
                              {category.totalCount !== 1 ? "s" : ""})
                            </span>
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm text-muted-foreground">
                          {category.completedCount}/{category.totalCount}
                        </span>
                        <div className="w-20">
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-1.5 rounded-full bg-primary transition-all duration-300"
                              style={{ width: `${catProgress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium w-10 text-right">
                          {catProgress}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-3">
                    {category.items.map((item) => {
                      const pc         = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.LOW
                      const isExpanded = expandedItems[item.id]
                      const isNA       = item.status === "NOT_APPLICABLE"

                      const borderClass =
                        item.status === "COMPLETED"
                          ? "border-green-300 bg-green-50/30 dark:bg-green-900/10"
                          : item.status === "IN_PROGRESS"
                          ? "border-blue-300 bg-blue-50/30 dark:bg-blue-900/10"
                          : item.status === "NOT_APPLICABLE"
                          ? "border-border/30 opacity-60"
                          : "border-border/50"

                      return (
                        <div
                          key={item.id}
                          className={`rounded-lg border p-4 transition-colors ${borderClass}`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => handleStatusCycle(item.id, item.status)}
                              className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                              title={`Status: ${item.status}. Click to advance.`}
                            >
                              <NormalizedStatusIcon status={item.status} />
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p
                                    className={`font-semibold leading-tight mt-0.5 text-sm ${
                                      item.status === "COMPLETED"
                                        ? "text-muted-foreground line-through"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {item.title}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${pc.badge}`}
                                  >
                                    {pc.label}
                                  </Badge>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                <BookOpen className="h-3 w-3 shrink-0" />
                                {item.regulatoryReference}
                              </p>

                              {/* Guidance pill — shown when present */}
                              {item.guidance && (
                                <p className="text-xs text-primary/80 mt-1.5 bg-primary/5 rounded px-2 py-1 border border-primary/10">
                                  {item.guidance}
                                </p>
                              )}

                              {/* Status selector + expand toggle */}
                              <div className="flex items-center gap-3 mt-2">
                                <Select
                                  value={item.status}
                                  onValueChange={(val) =>
                                    handleStatusSelect(item.id, val as NormalizedItemStatus)
                                  }
                                >
                                  <SelectTrigger className="h-7 w-40 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
                                  </SelectContent>
                                </Select>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedItems((prev) => ({
                                      ...prev,
                                      [item.id]: !prev[item.id],
                                    }))
                                  }
                                  className="text-xs text-primary hover:underline"
                                >
                                  {isExpanded ? "Hide details ↑" : "View details ↓"}
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="mt-3 space-y-3 text-sm border-t border-border/30 pt-3">
                                  <div>
                                    <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wide">
                                      Description
                                    </p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>

                                  {item.actionItems?.length > 0 && (
                                    <div>
                                      <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wide">
                                        Action Items
                                      </p>
                                      <ol className="space-y-1 list-decimal list-inside">
                                        {item.actionItems.map((action, i) => (
                                          <li key={i} className="text-xs text-muted-foreground">
                                            {action}
                                          </li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-3">
                                    {item.deadline && (
                                      <div className="rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2">
                                        <p className="text-xs font-medium text-green-800 dark:text-green-400">
                                          ⏰ Deadline
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {item.deadline}
                                        </p>
                                      </div>
                                    )}
                                    {item.penalty && (
                                      <div className="rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2">
                                        <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                          ⚠️ Penalty
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {item.penalty}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Notes */}
                                  {!isNA && (
                                    <div>
                                      <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wide">
                                        Notes
                                      </p>
                                      <Textarea
                                        className="text-xs min-h-[56px]"
                                        placeholder="Add your internal notes..."
                                        value={editingNotes[item.id] ?? item.notes ?? ""}
                                        onChange={(e) =>
                                          setEditingNotes((prev) => ({
                                            ...prev,
                                            [item.id]: e.target.value,
                                          }))
                                        }
                                        onBlur={() => {
                                          const notes = editingNotes[item.id]
                                          if (notes !== undefined && notes !== (item.notes ?? "")) {
                                            handleStatusSelect(item.id, item.status, notes || undefined)
                                          }
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}

// ─── Legacy Checklist Detail View ─────────────────────────────────────────────
// Handles pre-March 2026 checklists stored as JSON blob + itemProgress map.

function LegacyChecklistDetailView({
  checklistId,
  onBack,
}: {
  checklistId: string
  onBack: () => void
}) {
  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.compliance.getChecklist.useQuery({ id: checklistId })
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems]   = useState<Record<string, boolean>>({})
  const [isExporting, setIsExporting]       = useState(false)
  const [localProgress, setLocalProgress]   = useState<Record<string, string> | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemProgress = localProgress ?? ((data?.itemProgress as Record<string, string>) ?? {})

  const updateProgressMutation = trpc.compliance.updateChecklistProgress.useMutation({
    onSuccess: () => {
      utils.compliance.getChecklist.invalidate({ id: checklistId })
      utils.compliance.listChecklists.invalidate()
      setLocalProgress(null)
    },
    onError: (err) => {
      setLocalProgress(null)
      toast({ title: "Failed to save progress", description: err.message, variant: "destructive" })
    },
  })

  const cycleStatus = (current: LegacyItemStatus): LegacyItemStatus => {
    if (current === "NOT_STARTED") return "IN_PROGRESS"
    if (current === "IN_PROGRESS") return "COMPLETED"
    return "NOT_STARTED"
  }

  const handleItemStatusCycle = useCallback(
    (itemId: string) => {
      if (!data) return
      const current = (itemProgress[itemId] ?? "NOT_STARTED") as LegacyItemStatus
      const next = cycleStatus(current)
      const updated = { ...(itemProgress as Record<string, LegacyItemStatus>), [itemId]: next }
      setLocalProgress(updated)
      updateProgressMutation.mutate({ checklistId, itemProgress: updated })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, checklistId, itemProgress, updateProgressMutation]
  )

  const handleItemStatusChange = useCallback(
    (itemId: string, status: LegacyItemStatus) => {
      if (!data) return
      const updated = { ...(itemProgress as Record<string, LegacyItemStatus>), [itemId]: status }
      setLocalProgress(updated)
      updateProgressMutation.mutate({ checklistId, itemProgress: updated })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, checklistId, itemProgress, updateProgressMutation]
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium">Failed to load checklist</p>
          <p className="text-sm text-muted-foreground mt-1">{error?.message ?? "Unknown error"}</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={onBack}>
            ← Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  const checklistData = data.checklistData as {
    categories: Array<{
      id: string
      name: string
      description: string
      items: Array<{
        id: string
        title: string
        regulatoryBasis: string
        priority: string
        description: string
        actionItems: string[]
        deadline: string
        penalty: string
      }>
    }>
    metadata: {
      totalItems: number
      criticalItems: number
      highItems: number
      estimatedCompletionDays: number
    }
  } | null

  const completedCount = Object.values(itemProgress).filter((v) => v === "COMPLETED").length
  const inProgressCount = Object.values(itemProgress).filter((v) => v === "IN_PROGRESS").length
  const totalItems = checklistData?.metadata.totalItems ?? 0
  const progressPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

  const handleExport = () => {
    if (!checklistData) return
    setIsExporting(true)
    try {
      handleExportPdf({
        title:         data.title,
        productType:   data.productType,
        businessStage: data.businessStage,
        createdAt:     data.createdAt,
        checklistData,
        itemProgress,
      })
    } finally {
      setTimeout(() => setIsExporting(false), 1000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2 text-muted-foreground"
          >
            ← Back to Checklists
          </Button>
          <h2 className="text-xl font-bold text-foreground">{data.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {data.productType} · {data.businessStage}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={handleExport}
          disabled={!checklistData || isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Opening PDF..." : "Export PDF"}
        </Button>
      </div>

      {/* Progress Summary */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Overall Progress</p>
              <p className="text-4xl font-bold text-primary">{progressPct}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} of {totalItems} completed
                {inProgressCount > 0 && ` · ${inProgressCount} in progress`}
              </p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {checklistData?.metadata.estimatedCompletionDays && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Estimated {checklistData.metadata.estimatedCompletionDays} days to full compliance
            </p>
          )}
        </CardContent>
      </Card>

      {!checklistData ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-muted-foreground text-sm">Checklist is still generating...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Click the status icon on each item to cycle: Not Started → In Progress → Completed
          </p>
          {checklistData.categories.map((category) => {
            const catItems      = category.items
            const catCompleted  = catItems.filter((i) => itemProgress[i.id] === "COMPLETED").length
            const catInProgress = catItems.filter((i) => itemProgress[i.id] === "IN_PROGRESS").length
            const catProgress   = catItems.length > 0 ? Math.round((catCompleted / catItems.length) * 100) : 0
            const isOpen        = openCategories[category.id] !== false

            return (
              <Collapsible
                key={category.id}
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenCategories((prev) => ({ ...prev, [category.id]: open }))
                }
              >
                <Card className="border-border/50 bg-card">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <div className="min-w-0">
                            <CardTitle className="text-base font-semibold truncate">
                              {category.name}
                              <span className="ml-2 text-xs font-normal text-muted-foreground">
                                ({catItems.length} item{catItems.length !== 1 ? "s" : ""})
                              </span>
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5 truncate">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm text-muted-foreground">
                            {catCompleted}/{catItems.length}
                            {catInProgress > 0 && (
                              <span className="text-blue-500 ml-1">
                                ({catInProgress} in progress)
                              </span>
                            )}
                          </span>
                          <div className="w-20">
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-1.5 rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${catProgress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium w-10 text-right">
                            {catProgress}%
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {catItems.map((item) => {
                        const status     = (itemProgress[item.id] ?? "NOT_STARTED") as LegacyItemStatus
                        const pc         = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.LOW
                        const isExpanded = expandedItems[item.id]

                        const borderClass =
                          status === "COMPLETED"
                            ? "border-green-300 bg-green-50/30 dark:bg-green-900/10"
                            : status === "IN_PROGRESS"
                            ? "border-blue-300 bg-blue-50/30 dark:bg-blue-900/10"
                            : "border-border/50"

                        return (
                          <div
                            key={item.id}
                            className={`rounded-lg border p-4 transition-colors ${borderClass}`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                onClick={() => handleItemStatusCycle(item.id)}
                                className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                                title={`Status: ${status}. Click to change.`}
                              >
                                <LegacyStatusIcon status={status} />
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {item.id}
                                    </span>
                                    <p
                                      className={`font-semibold leading-tight mt-0.5 ${
                                        status === "COMPLETED"
                                          ? "text-muted-foreground line-through"
                                          : "text-foreground"
                                      }`}
                                    >
                                      {item.title}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${pc.badge} shrink-0`}
                                  >
                                    {pc.label}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3 shrink-0" />
                                  {item.regulatoryBasis}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Select
                                    value={status}
                                    onValueChange={(val) =>
                                      handleItemStatusChange(item.id, val as LegacyItemStatus)
                                    }
                                  >
                                    <SelectTrigger className="h-7 w-36 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                      <SelectItem value="COMPLETED">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedItems((prev) => ({
                                        ...prev,
                                        [item.id]: !prev[item.id],
                                      }))
                                    }
                                    className="text-xs text-primary hover:underline"
                                  >
                                    {isExpanded ? "Hide details ↑" : "View details ↓"}
                                  </button>
                                </div>
                                {isExpanded && (
                                  <div className="mt-3 space-y-3 text-sm border-t border-border/30 pt-3">
                                    <div>
                                      <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wide">
                                        Description
                                      </p>
                                      <p className="text-muted-foreground text-xs leading-relaxed">
                                        {item.description}
                                      </p>
                                    </div>
                                    {item.actionItems?.length > 0 && (
                                      <div>
                                        <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wide">
                                          Action Items
                                        </p>
                                        <ol className="space-y-1 list-decimal list-inside">
                                          {item.actionItems.map((action, i) => (
                                            <li key={i} className="text-xs text-muted-foreground">
                                              {action}
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                      {item.deadline && (
                                        <div className="rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2">
                                          <p className="text-xs font-medium text-green-800 dark:text-green-400">
                                            ⏰ Deadline
                                          </p>
                                          <p className="text-xs text-muted-foreground mt-0.5">
                                            {item.deadline}
                                          </p>
                                        </div>
                                      )}
                                      {item.penalty && (
                                        <div className="rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2">
                                          <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                            ⚠️ Penalty
                                          </p>
                                          <p className="text-xs text-muted-foreground mt-0.5">
                                            {item.penalty}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Checklist Detail Router ──────────────────────────────────────────────────
// Polls status → routes to NormalizedChecklistDetailView or LegacyChecklistDetailView.

function ChecklistDetailView({
  checklistId,
  onBack,
}: {
  checklistId: string
  onBack: () => void
}) {
  const pollStartRef = useRef(Date.now())
  const [timedOut, setTimedOut] = useState(false)

  // Always poll status — determines isNormalized + GENERATING state.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawStatus, isLoading: statusLoading, error: statusError } =
    trpc.compliance.getChecklistStatus.useQuery(
      { checklistId },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetchInterval: (query: any) => {
          const d = query?.state?.data as ChecklistStatusLocal | undefined
          if (!d || d.status === "GENERATING") {
            if (Date.now() - pollStartRef.current > POLL_TIMEOUT_MS) return false
            return POLL_INTERVAL_MS
          }
          return false
        },
        refetchIntervalInBackground: false,
      }
    )

  const statusData = rawStatus as ChecklistStatusLocal | undefined

  // Set timeout flag after POLL_TIMEOUT_MS if still GENERATING
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!statusData || statusData.status === "GENERATING") {
        setTimedOut(true)
      }
    }, POLL_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Status error ──────────────────────────────────────────────────────────
  if (statusError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 text-muted-foreground">
          ← Back to Checklists
        </Button>
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">Could not load checklist</p>
            <p className="text-sm text-muted-foreground mt-1">{statusError.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Generating / polling state ────────────────────────────────────────────
  const isGenerating = statusLoading || !statusData || statusData.status === "GENERATING"
  const isFailed     = statusData?.status === "FAILED"

  if (isGenerating) {
    const elapsed = Math.floor((Date.now() - pollStartRef.current) / 1000)

    if (timedOut) {
      return (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2 text-muted-foreground"
          >
            ← Back to Checklists
          </Button>
          <Card className="border-yellow-500/50 bg-yellow-50/10">
            <CardContent className="pt-6 text-center space-y-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
              <p className="font-medium text-foreground">Generation is taking longer than expected</p>
              <p className="text-sm text-muted-foreground">
                The checklist generation timed out after 4 minutes. Please go back and check
                whether the checklist appeared, or delete it and try again.
              </p>
              <Button variant="outline" className="bg-transparent" onClick={onBack}>
                ← Back to Checklists
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 text-muted-foreground"
        >
          ← Back to Checklists
        </Button>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <div>
              <p className="font-semibold text-foreground text-lg">
                {statusData?.title ?? "Generating your checklist..."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI is retrieving Kenyan regulatory context and building your checklist.
                This typically takes 1–3 minutes.
              </p>
            </div>
            {statusData && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>⏱ {elapsed}s elapsed — checking every 3 seconds</p>
              </div>
            )}
            <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-primary animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Failed state ──────────────────────────────────────────────────────────
  if (isFailed) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 text-muted-foreground"
        >
          ← Back to Checklists
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 text-center space-y-3">
            <XCircle className="h-8 w-8 text-destructive mx-auto" />
            <p className="font-medium text-foreground">Checklist generation failed</p>
            <p className="text-sm text-muted-foreground">
              The AI could not complete generation. Please go back, delete this checklist, and
              try again.
            </p>
            <Button variant="outline" className="bg-transparent" onClick={onBack}>
              ← Back to Checklists
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Route by isNormalized ─────────────────────────────────────────────────
  if (statusData.isNormalized) {
    return (
      <NormalizedChecklistDetailView
        checklistId={checklistId}
        statusData={statusData}
        onBack={onBack}
      />
    )
  }

  return <LegacyChecklistDetailView checklistId={checklistId} onBack={onBack} />
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChecklistsPage() {
  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(null)
  const utils = trpc.useUtils()

  const { data: rawChecklists, isLoading, error, refetch } =
    trpc.compliance.listChecklists.useQuery(undefined, {
      // Auto-poll when any checklist is GENERATING — stops when all leave that state
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      refetchInterval: (query: any) => {
        const data = query?.state?.data as ChecklistSummaryLocal[] | undefined
        return data?.some((c) => c.status === "GENERATING") ? POLL_INTERVAL_MS : false
      },
      refetchIntervalInBackground: false,
    })

  const checklists = rawChecklists as ChecklistSummaryLocal[] | undefined

  const deleteMutation = trpc.compliance.deleteChecklist.useMutation({
    onSuccess: () => {
      toast({ title: "Checklist deleted" })
      utils.compliance.listChecklists.invalidate()
      if (activeChecklistId) setActiveChecklistId(null)
    },
    onError: (err) => {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("Delete this checklist?")) {
      deleteMutation.mutate({ id })
    }
  }

  const handleGenerateSuccess = (checklistId: string) => {
    utils.compliance.listChecklists.invalidate()
    setActiveChecklistId(checklistId)
  }

  // Precompute summary stats
  const completedChecklistCount  = checklists?.filter((c) => c.status === "COMPLETED").length ?? 0
  const generatingChecklistCount = checklists?.filter((c) => c.status === "GENERATING").length ?? 0
  const fullyDoneCount           = checklists?.filter((c) => c.progress === 100).length ?? 0
  const totalCriticalPending     = checklists?.reduce((acc, c) => acc + c.criticalItems, 0) ?? 0

  // Show detail view when a checklist is selected
  if (activeChecklistId) {
    return (
      <div className="flex flex-col gap-6">
        <ChecklistDetailView
          checklistId={activeChecklistId}
          onBack={() => setActiveChecklistId(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Checklists</h1>
          <p className="text-muted-foreground mt-1">
            AI-generated checklists grounded in actual Kenyan regulations — cite laws, track
            progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <GenerateChecklistDialog onSuccess={handleGenerateSuccess} />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">Failed to load checklists</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => refetch()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!checklists || checklists.length === 0) && (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="py-16 text-center">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No checklists yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Generate your first AI-powered compliance checklist. Our system retrieves relevant
              Kenyan regulations from CBK, DPA, POCAMLA and more to build a checklist specific to
              your fintech.
            </p>
            <GenerateChecklistDialog onSuccess={handleGenerateSuccess} />
          </CardContent>
        </Card>
      )}

      {/* Checklists Grid */}
      {!isLoading && !error && checklists && checklists.length > 0 && (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">Total Checklists</p>
                <p className="text-2xl font-bold text-foreground">{checklists.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedChecklistCount > 0 && `${completedChecklistCount} completed`}
                  {generatingChecklistCount > 0 && ` · ${generatingChecklistCount} generating`}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">Fully Compliant</p>
                <p className="text-2xl font-bold text-green-600">{fullyDoneCount}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">Critical Items Pending</p>
                <p className="text-2xl font-bold text-red-600">{totalCriticalPending}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {checklists.map((checklist) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                onSelect={setActiveChecklistId}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Disclaimer */}
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> These checklists are
                  AI-generated guidance grounded in Kenyan regulations. They are intended as a
                  starting point and should be reviewed by a qualified compliance officer or legal
                  counsel. SheriaBot does not provide legal advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
