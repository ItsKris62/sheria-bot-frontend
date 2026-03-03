"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
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
  AlertCircle,
  Clock,
  Trash2,
  RefreshCw,
  AlertTriangle,
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

const PRIORITY_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
  CRITICAL: { label: "Critical", color: "text-destructive", badge: "bg-destructive/10 text-destructive border-destructive/20" },
  HIGH: { label: "High", color: "text-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400" },
  MEDIUM: { label: "Medium", color: "text-yellow-600", badge: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400" },
  LOW: { label: "Low", color: "text-primary", badge: "bg-primary/10 text-primary border-primary/20" },
}

const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: "border-border/50",
  IN_PROGRESS: "border-blue-300 bg-blue-50/30 dark:bg-blue-900/10",
  COMPLETED: "border-secondary/50 bg-secondary/5",
}

// ─── Multi-Select Component ────────────────────────────────────────────────

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

// ─── Generate Checklist Dialog ─────────────────────────────────────────────

function GenerateChecklistDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [productType, setProductType] = useState("")
  const [businessStage, setBusinessStage] = useState("")
  const [targetSegments, setTargetSegments] = useState<string[]>([])
  const [servicesOffered, setServicesOffered] = useState<string[]>([])
  const [additionalConcerns, setAdditionalConcerns] = useState("")

  const generateMutation = trpc.compliance.generateChecklist.useMutation({
    onSuccess: () => {
      toast({
        title: "Checklist generated",
        description: "Your compliance checklist is ready. Review and track your progress below.",
      })
      setOpen(false)
      resetForm()
      onSuccess()
    },
    onError: (err) => {
      toast({
        title: "Generation failed",
        description: err.message || "Failed to generate checklist. Please try again.",
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
    if (!canGenerate) return
    generateMutation.mutate({
      productType,
      businessStage,
      targetSegments,
      servicesOffered,
      additionalConcerns: additionalConcerns.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
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
            <Label>Fintech Product / Service Type <span className="text-destructive">*</span></Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Business Stage */}
          <div className="space-y-2">
            <Label>Business Stage <span className="text-destructive">*</span></Label>
            <Select value={businessStage} onValueChange={setBusinessStage}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current stage" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Segments */}
          <div className="space-y-2">
            <Label>Target Customer Segments <span className="text-destructive">*</span></Label>
            <MultiSelect
              options={TARGET_SEGMENTS}
              selected={targetSegments}
              onChange={setTargetSegments}
              placeholder="Select all that apply"
            />
          </div>

          {/* Services Offered */}
          <div className="space-y-2">
            <Label>Services Offered <span className="text-destructive">*</span></Label>
            <MultiSelect
              options={SERVICES_OFFERED}
              selected={servicesOffered}
              onChange={setServicesOffered}
              placeholder="Select all applicable services"
            />
          </div>

          {/* Additional Concerns */}
          <div className="space-y-2">
            <Label>Specific Compliance Concerns <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              placeholder="e.g. We plan to launch a mobile lending product targeting informal traders in rural counties..."
              value={additionalConcerns}
              onChange={(e) => setAdditionalConcerns(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">{additionalConcerns.length}/1000</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Our AI retrieves relevant passages from Kenyan regulatory documents (CBK, DPA, POCAMLA, etc.)
                to ground your checklist in actual law — not generic guidance.
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
                Generating checklist — this may take 30–60 seconds...
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

// ─── Checklist Card (Summary) ──────────────────────────────────────────────

function ChecklistCard({
  checklist,
  onSelect,
  onDelete,
}: {
  checklist: {
    id: string
    title: string
    productType: string | null
    businessStage: string | null
    progress: number
    status: string
    totalItems: number
    criticalItems: number
    createdAt: Date
  }
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  const statusIcon = checklist.status === "COMPLETED" && checklist.progress === 100
    ? <CheckCircle2 className="h-5 w-5 text-secondary" />
    : checklist.status === "GENERATING"
    ? <Loader2 className="h-5 w-5 text-primary animate-spin" />
    : <Clock className="h-5 w-5 text-warning" />

  return (
    <Card className="border-border/50 bg-card transition-shadow hover:shadow-lg cursor-pointer" onClick={() => onSelect(checklist.id)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="text-xs">{checklist.productType ?? "Compliance"}</Badge>
          {statusIcon}
        </div>
        <CardTitle className="mt-2 text-foreground text-base leading-tight">{checklist.title}</CardTitle>
        <CardDescription className="text-xs">
          {new Date(checklist.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{checklist.totalItems} items</span>
            <span className="font-medium text-foreground">{checklist.progress}%</span>
          </div>
          <Progress value={checklist.progress} className="h-2" />
          {checklist.criticalItems > 0 && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {checklist.criticalItems} critical item{checklist.criticalItems > 1 ? "s" : ""} remaining
            </p>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={(e) => { e.stopPropagation(); onSelect(checklist.id) }}
            >
              View Checklist
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => { e.stopPropagation(); onDelete(checklist.id) }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Active Checklist Detail View ─────────────────────────────────────────

type ItemStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"

function ChecklistDetailView({
  checklistId,
  onBack,
}: {
  checklistId: string
  onBack: () => void
}) {
  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.compliance.getChecklist.useQuery({ id: checklistId })
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const updateProgressMutation = trpc.compliance.updateChecklistProgress.useMutation({
    onSuccess: () => {
      utils.compliance.getChecklist.invalidate({ id: checklistId })
      utils.compliance.getUserChecklists.invalidate()
    },
    onError: (err) => {
      toast({ title: "Failed to save progress", description: err.message, variant: "destructive" })
    },
  })

  const handleItemToggle = useCallback(
    (itemId: string, currentStatus: ItemStatus) => {
      if (!data) return
      const itemProgress = { ...((data.itemProgress as Record<string, string>) ?? {}) }
      itemProgress[itemId] = currentStatus === "COMPLETED" ? "NOT_STARTED" : "COMPLETED"
      updateProgressMutation.mutate({ checklistId, itemProgress })
    },
    [data, checklistId, updateProgressMutation]
  )

  const handleItemStatusChange = useCallback(
    (itemId: string, status: ItemStatus) => {
      if (!data) return
      const itemProgress = { ...((data.itemProgress as Record<string, string>) ?? {}) }
      itemProgress[itemId] = status
      updateProgressMutation.mutate({ checklistId, itemProgress })
    },
    [data, checklistId, updateProgressMutation]
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
          <Button variant="outline" className="mt-4 bg-transparent" onClick={onBack}>← Back</Button>
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
    metadata: { totalItems: number; criticalItems: number; highItems: number; estimatedCompletionDays: number }
  } | null

  const itemProgress = (data.itemProgress as Record<string, string>) ?? {}

  const completedItems = Object.values(itemProgress).filter((v) => v === "COMPLETED").length
  const totalItems = data.checklistData ? checklistData?.metadata.totalItems ?? 0 : 0
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground">
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
          onClick={() => toast({ title: "Export PDF", description: "Coming soon — PDF export is in development." })}
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Progress Summary */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">Overall Progress</p>
              <p className="text-3xl font-bold text-primary">{progressPct}%</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-foreground font-medium">{completedItems} / {totalItems} completed</p>
              {checklistData?.metadata.criticalItems != null && checklistData.metadata.criticalItems > 0 && (
                <p className="text-destructive text-xs mt-1">
                  {checklistData.metadata.criticalItems - Object.values(itemProgress).filter((v, i) => {
                    const criticalIds = (checklistData?.categories ?? []).flatMap(c => c.items.filter(it => it.priority === "CRITICAL").map(it => it.id))
                    return criticalIds.includes(Object.keys(itemProgress)[i]) && v === "COMPLETED"
                  }).length} critical items pending
                </p>
              )}
              {checklistData?.metadata.estimatedCompletionDays && (
                <p className="text-xs text-muted-foreground">~{checklistData.metadata.estimatedCompletionDays} days to compliance</p>
              )}
            </div>
          </div>
          <Progress value={progressPct} className="h-3" />
        </CardContent>
      </Card>

      {/* Categories */}
      {!checklistData ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-muted-foreground text-sm">Checklist is still generating...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {checklistData.categories.map((category) => {
            const catItems = category.items
            const catCompleted = catItems.filter((i) => itemProgress[i.id] === "COMPLETED").length
            const catProgress = catItems.length > 0 ? Math.round((catCompleted / catItems.length) * 100) : 0
            const isOpen = openCategories[category.id] !== false // default open

            return (
              <Collapsible
                key={category.id}
                open={isOpen}
                onOpenChange={(open) => setOpenCategories((prev) => ({ ...prev, [category.id]: open }))}
              >
                <Card className="border-border/50 bg-card">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                          <div>
                            <CardTitle className="text-base font-semibold">{category.name}</CardTitle>
                            <CardDescription className="text-xs mt-0.5">{category.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm text-muted-foreground">{catCompleted}/{catItems.length}</span>
                          <div className="w-20">
                            <Progress value={catProgress} className="h-1.5" />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">{catProgress}%</span>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {catItems.map((item) => {
                        const status = (itemProgress[item.id] ?? "NOT_STARTED") as ItemStatus
                        const pc = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.LOW
                        const isExpanded = expandedItems[item.id]

                        return (
                          <div
                            key={item.id}
                            className={`rounded-lg border p-4 transition-colors ${STATUS_COLORS[status] ?? STATUS_COLORS.NOT_STARTED}`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={status === "COMPLETED"}
                                onCheckedChange={() => handleItemToggle(item.id, status)}
                                className="mt-0.5 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <label
                                    htmlFor={`item-${item.id}`}
                                    className={`font-medium cursor-pointer leading-tight ${
                                      status === "COMPLETED" ? "text-muted-foreground line-through" : "text-foreground"
                                    }`}
                                  >
                                    {item.title}
                                  </label>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Badge variant="outline" className={`text-xs ${pc.badge}`}>
                                      {pc.label}
                                    </Badge>
                                  </div>
                                </div>

                                <p className="text-xs text-muted-foreground mt-1 font-medium">
                                  📋 {item.regulatoryBasis}
                                </p>

                                {/* Status selector */}
                                <div className="flex items-center gap-2 mt-2">
                                  <Select
                                    value={status}
                                    onValueChange={(val) => handleItemStatusChange(item.id, val as ItemStatus)}
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
                                    onClick={() => setExpandedItems((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                                    className="text-xs text-primary hover:underline"
                                  >
                                    {isExpanded ? "Hide details" : "View details"}
                                  </button>
                                </div>

                                {isExpanded && (
                                  <div className="mt-3 space-y-3 text-sm border-t border-border/30 pt-3">
                                    <div>
                                      <p className="font-medium text-foreground mb-1">Description</p>
                                      <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                                    </div>
                                    {item.actionItems?.length > 0 && (
                                      <div>
                                        <p className="font-medium text-foreground mb-1">Action Items</p>
                                        <ul className="space-y-1">
                                          {item.actionItems.map((action, i) => (
                                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                              <span className="text-primary shrink-0">•</span>
                                              {action}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                      {item.deadline && (
                                        <div className="rounded bg-muted/50 p-2">
                                          <p className="text-xs font-medium text-foreground">⏰ Deadline</p>
                                          <p className="text-xs text-muted-foreground mt-0.5">{item.deadline}</p>
                                        </div>
                                      )}
                                      {item.penalty && (
                                        <div className="rounded bg-destructive/5 border border-destructive/10 p-2">
                                          <p className="text-xs font-medium text-destructive">⚠️ Penalty</p>
                                          <p className="text-xs text-muted-foreground mt-0.5">{item.penalty}</p>
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

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function ChecklistsPage() {
  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(null)
  const utils = trpc.useUtils()

  const { data: checklists, isLoading, error, refetch } = trpc.compliance.getUserChecklists.useQuery()

  const deleteMutation = trpc.compliance.deleteChecklist.useMutation({
    onSuccess: () => {
      toast({ title: "Checklist deleted" })
      utils.compliance.getUserChecklists.invalidate()
      if (activeChecklistId) setActiveChecklistId(null)
    },
    onError: (err) => {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("Delete this checklist? This action cannot be undone.")) {
      deleteMutation.mutate({ id })
    }
  }

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
            AI-generated checklists grounded in actual Kenyan regulations — cite laws, track progress.
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
          <GenerateChecklistDialog onSuccess={() => utils.compliance.getUserChecklists.invalidate()} />
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
            <Button variant="outline" className="mt-4 bg-transparent" onClick={() => refetch()}>
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
              Kenyan regulations from CBK, DPA, POCAMLA and more to build a checklist specific to your fintech.
            </p>
            <GenerateChecklistDialog onSuccess={() => utils.compliance.getUserChecklists.invalidate()} />
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
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">Fully Completed</p>
                <p className="text-2xl font-bold text-secondary">
                  {checklists.filter((c) => c.progress === 100).length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">Critical Items Pending</p>
                <p className="text-2xl font-bold text-destructive">
                  {checklists.reduce((acc, c) => acc + c.criticalItems, 0)}
                </p>
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

          {/* Info box */}
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> These checklists are AI-generated guidance grounded in Kenyan regulations.
                  They are intended as a starting point and should be reviewed by a qualified compliance officer or legal counsel.
                  SheriaBot does not provide legal advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
