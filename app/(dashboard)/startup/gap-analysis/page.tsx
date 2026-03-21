"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { trpc } from "@/lib/trpc"
import { FeatureGate } from "@/components/plan/feature-gate"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  buildGapAnalysisReportHtml,
  type GapAnalysisReportResult,
} from "@/lib/utils/buildGapAnalysisReportHtml"
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Download,
  Upload,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Shield,
  BarChart3,
  Lock,
} from "lucide-react"
import { LoadingScreen } from "@/components/loading-screen"

// ─── Constants ────────────────────────────────────────────────────────────────

const FOCUS_AREAS = [
  "Data handling and privacy",
  "Financial reporting",
  "Risk management",
  "Customer onboarding (KYC)",
  "Technology and security",
  "Governance and oversight",
  "Complaints handling",
  "AML/CFT controls",
]

const ANALYSIS_DEPTHS = [
  { value: "quick", label: "Quick Scan", description: "Critical gaps only, ~30 seconds" },
  { value: "standard", label: "Standard Analysis", description: "All severity levels, ~60 seconds" },
  { value: "deep", label: "Deep Analysis", description: "Comprehensive, ~90 seconds" },
]

const SEVERITY_CONFIG = {
  CRITICAL: { label: "Critical", bg: "bg-destructive/5", border: "border-l-destructive", badge: "bg-destructive/10 text-destructive border-destructive/20" },
  HIGH: { label: "High", bg: "bg-orange-50/50 dark:bg-orange-900/10", border: "border-l-orange-500", badge: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400" },
  MEDIUM: { label: "Medium", bg: "bg-yellow-50/50 dark:bg-yellow-900/10", border: "border-l-yellow-500", badge: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400" },
  LOW: { label: "Low", bg: "bg-primary/5", border: "border-l-primary", badge: "bg-primary/10 text-primary border-primary/20" },
}

const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain"]
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const STATUS_LABELS: Record<string, { label: string; description: string }> = {
  UPLOADING:  { label: "Uploading document",              description: "Transferring your file to secure storage..." },
  QUEUED:     { label: "Queued for analysis",             description: "Your analysis is queued and will start shortly..." },
  EXTRACTING: { label: "Extracting text",                 description: "Reading and parsing your policy document..." },
  ANALYZING:  { label: "Analysing against frameworks",    description: "Comparing your policies against Kenyan regulatory requirements..." },
  COMPLETING: { label: "Finalising results",              description: "Compiling your gap analysis report..." },
  COMPLETED:  { label: "Analysis complete",               description: "Your gap analysis is ready to view." },
  FAILED:     { label: "Analysis failed",                 description: "An error occurred during analysis." },
}

function getScoreColor(score: number) {
  if (score >= 91) return { ring: "border-secondary", text: "text-secondary", bg: "bg-secondary/10" }
  if (score >= 71) return { ring: "border-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" }
  if (score >= 41) return { ring: "border-orange-500", text: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" }
  return { ring: "border-destructive", text: "text-destructive", bg: "bg-destructive/10" }
}

function getScoreLabel(score: number) {
  if (score >= 91) return "Excellent"
  if (score >= 71) return "Good"
  if (score >= 41) return "Needs Work"
  return "Critical Risk"
}

// ─── File Upload Section ─────────────────────────────────────────────────────

function FileUploadSection({
  file,
  onFile,
  onRemove,
}: {
  file: File | null
  onFile: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const validateAndSetFile = (f: File) => {
    if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext))) {
      toast({ title: "Unsupported file type", description: "Upload a PDF, DOCX, DOC, or TXT file.", variant: "destructive" })
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" })
      return
    }
    onFile(f)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragActive(false)
      const f = e.dataTransfer.files[0]
      if (f) validateAndSetFile(f)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-secondary/50 bg-secondary/5 p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-secondary shrink-0" />
          <div>
            <p className="font-medium text-foreground text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · {file.type.split("/").pop()?.toUpperCase()}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg border-2 border-dashed transition-colors ${
        dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
      } cursor-pointer`}
      onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="py-10 text-center">
        <Upload className={`h-8 w-8 mx-auto mb-3 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm font-medium text-foreground">Drop your policy document here</p>
        <p className="text-xs text-muted-foreground mt-1">or <span className="text-primary underline">browse files</span></p>
        <p className="text-xs text-muted-foreground mt-3">PDF, DOCX, DOC, TXT · Max 10MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ALLOWED_EXTENSIONS.join(",")}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) validateAndSetFile(f) }}
      />
    </div>
  )
}

// ─── Score Gauge ─────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const { ring, text, bg } = getScoreColor(score)
  return (
    <div className={`h-28 w-28 rounded-full border-8 ${ring} flex flex-col items-center justify-center ${bg}`}>
      <p className={`text-2xl font-bold ${text}`}>{score}</p>
      <p className={`text-xs font-medium ${text}`}>{getScoreLabel(score)}</p>
    </div>
  )
}

// ─── Analysis Results View ────────────────────────────────────────────────────

type GapResult = {
  id: string
  title: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  regulatoryBasis: string
  description: string
  policyCurrentState: string
  recommendation: string
  effort: string
  priority: number
}

type FrameworkResult = {
  id: string
  name: string
  score: number
  summary: string
  gaps: GapResult[]
  strengths: string[]
}

type ActionPlanItem = {
  priority: number
  action: string
  framework: string
  deadline: string
  effort: string
  resources: string[]
}

type AnalysisResultData = {
  overallScore: number
  executiveSummary: string
  frameworks: FrameworkResult[]
  crossCuttingStrengths: string[]
  actionPlan: ActionPlanItem[]
  metadata: {
    documentName: string
    analysisDepth: string
    frameworksAnalysed: string[]
    totalGaps: number
    criticalGaps: number
    highGaps: number
    analysisDate: string
  }
}

function AnalysisResultsView({
  analysisId,
  documentName,
  onBack,
}: {
  analysisId: string
  documentName: string
  onBack: () => void
}) {
  const { data, isLoading, error } = trpc.compliance.getGapAnalysisResult.useQuery({ id: analysisId })
  const [expandedGaps, setExpandedGaps] = useState<Record<string, boolean>>({})

  const logExportMutation = trpc.compliance.logExport.useMutation()
  const exportDocxMutation = trpc.compliance.exportDocx.useMutation({
    onSuccess: (res) => {
      // Trigger download via temporary anchor
      const a = document.createElement("a")
      a.href = res.downloadUrl
      a.download = res.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast({ title: "Report ready", description: "Your Word document download has started." })
    },
    onError: (err) => {
      toast({
        title: "Export failed",
        description: err.message.includes("FORBIDDEN")
          ? "DOCX export is available on Business and Enterprise plans. Please upgrade."
          : err.message || "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium">Failed to load analysis</p>
          <p className="text-sm text-muted-foreground mt-1">{error?.message ?? "Unknown error"}</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={onBack}>← Back</Button>
        </CardContent>
      </Card>
    )
  }

  if (data.status === "ANALYZING" || data.status === "UPLOADING") {
    return <LoadingScreen fullScreen={false} size="sm" message="Analysis in progress..." />
  }

  if (data.status === "FAILED") {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 text-center">
          <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium">Analysis failed</p>
          <p className="text-sm text-muted-foreground mt-1">{data.errorMessage ?? "An unexpected error occurred"}</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={onBack}>← Run New Analysis</Button>
        </CardContent>
      </Card>
    )
  }

  const results = data.results as AnalysisResultData | null
  if (!results) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">No results available.</CardContent>
      </Card>
    )
  }

  const { overallScore, executiveSummary, frameworks, crossCuttingStrengths, actionPlan, metadata } = results
  const scoreConfig = getScoreColor(overallScore)
  const allGaps = frameworks.flatMap((f) => f.gaps.map((g) => ({ ...g, frameworkName: f.name })))
  const sortedGaps = [...allGaps].sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
  })

  function handleExportPdf() {
    const html = buildGapAnalysisReportHtml({
      analysisId,
      organizationName: data.organizationName ?? undefined,
      userName: data.userName ?? undefined,
      documentName: data.documentName,
      createdAt: data.createdAt,
      analysisDepth: data.analysisDepth ?? "standard",
      ragGrounded: data.ragGrounded ?? false,
      chunksProcessed: data.chunksProcessed ?? 0,
      regulatoryFrameworks: data.regulatoryFrameworks ?? [],
      result: results as unknown as GapAnalysisReportResult,
    })
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({ title: "Pop-up blocked", description: "Please allow pop-ups for this site and try again.", variant: "destructive" })
      return
    }
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
    logExportMutation.mutate({ analysisId, format: "pdf" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground">
            ← Back to Gap Analysis
          </Button>
          <h2 className="text-xl font-bold text-foreground">Gap Analysis Results</h2>
          <p className="text-sm text-muted-foreground mt-1">{data.documentName} · {new Date(data.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPdf}>
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => exportDocxMutation.mutate({ analysisId })}
              disabled={exportDocxMutation.isPending}
            >
              {exportDocxMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              Export as Word (DOCX)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* RAG grounding warning — shown when Pinecone was unavailable during generation */}
      {data.ragGrounded === false && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm dark:border-yellow-800/50 dark:bg-yellow-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
          <p className="text-yellow-800 dark:text-yellow-300">
            <span className="font-semibold">Limited regulatory grounding.</span> This analysis was generated without access to the SheriaBot regulatory document database. Results are based on AI training knowledge only and may not reflect the latest Kenyan regulations or recent amendments. Consider re-running the analysis when the service is available.
          </p>
        </div>
      )}

      {/* Executive Summary Card */}
      <Card className={`border-2 ${scoreConfig.ring}`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <ScoreGauge score={overallScore} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground text-lg">Overall Compliance Score</h3>
                <Badge variant="outline" className={scoreConfig.bg + " " + scoreConfig.text + " border-current"}>
                  {getScoreLabel(overallScore)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{executiveSummary}</p>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">{metadata.criticalGaps}</p>
                  <p className="text-xs text-muted-foreground">Critical Gaps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{metadata.highGaps}</p>
                  <p className="text-xs text-muted-foreground">High Gaps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{metadata.totalGaps}</p>
                  <p className="text-xs text-muted-foreground">Total Gaps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{crossCuttingStrengths.length}</p>
                  <p className="text-xs text-muted-foreground">Strengths</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed results */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Framework Overview</TabsTrigger>
          <TabsTrigger value="gaps">
            Gaps ({metadata.totalGaps})
          </TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="action">Action Plan</TabsTrigger>
        </TabsList>

        {/* Framework Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {frameworks.map((fw) => {
              const fwConfig = getScoreColor(fw.score)
              return (
                <Card key={fw.id} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-semibold">{fw.name}</CardTitle>
                      <Badge variant="outline" className={`${fwConfig.bg} ${fwConfig.text} border-current text-xs`}>
                        {fw.score}/100
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{fw.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Progress value={fw.score} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{fw.gaps.length} gaps</span>
                      <span>{fw.strengths.length} strengths</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Gaps Detail */}
        <TabsContent value="gaps" className="space-y-3 mt-4">
          {sortedGaps.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="text-secondary font-medium">No gaps identified!</p>
              </CardContent>
            </Card>
          ) : (
            sortedGaps.map((gap) => {
              const sc = SEVERITY_CONFIG[gap.severity] ?? SEVERITY_CONFIG.LOW
              const isExpanded = expandedGaps[gap.id]
              return (
                <div key={gap.id} className={`rounded-lg border border-l-4 p-4 ${sc.bg} ${sc.border}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <p className="font-medium text-foreground text-sm">{gap.title}</p>
                        <Badge variant="outline" className={`text-xs shrink-0 ${sc.badge}`}>{sc.label}</Badge>
                        <Badge variant="outline" className="text-xs shrink-0 bg-muted">{gap.frameworkName}</Badge>
                      </div>
                      <p className="text-xs text-primary font-medium mt-1">📋 {gap.regulatoryBasis}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{gap.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedGaps((prev) => ({ ...prev, [gap.id]: !prev[gap.id] }))}
                      className="text-muted-foreground shrink-0"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-border/30 pt-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground text-xs mb-1">Current State in Policy</p>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">&ldquo;{gap.policyCurrentState}&rdquo;</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-xs mb-1">Recommendation</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{gap.recommendation}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Effort: {gap.effort}</Badge>
                        <Badge variant="outline" className="text-xs">Priority #{gap.priority}</Badge>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </TabsContent>

        {/* Strengths */}
        <TabsContent value="strengths" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                Cross-Cutting Strengths
              </CardTitle>
              <CardDescription>Areas where your policy demonstrates strong compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {crossCuttingStrengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                    <span className="text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {frameworks.map((fw) =>
            fw.strengths.length > 0 ? (
              <Card key={fw.id} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{fw.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {fw.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-secondary">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null
          )}
        </TabsContent>

        {/* Action Plan */}
        <TabsContent value="action" className="space-y-3 mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Prioritised Action Plan
              </CardTitle>
              <CardDescription>Address these items to improve your compliance score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {actionPlan.map((item) => (
                <div key={item.priority} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{item.priority}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground text-sm">{item.action}</p>
                      <div className="flex gap-1 shrink-0">
                        <Badge variant="outline" className="text-xs">{item.effort} effort</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-muted">{item.framework}</Badge>
                      <Badge variant="outline" className="text-xs text-warning border-warning/30">⏰ {item.deadline}</Badge>
                    </div>
                    {item.resources?.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {item.resources.map((r, i) => (
                          <li key={i} className="text-xs text-muted-foreground">→ {r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Analysis Progress View ───────────────────────────────────────────────────

function AnalysisProgressView({
  documentName,
  frameworks,
  progress,
  status,
  errorMessage,
  startedAt,
  onBack,
  onRetry,
}: {
  documentName: string
  frameworks: string[]
  progress: number
  status: string
  errorMessage?: string | null
  startedAt: number | null
  onBack: () => void
  onRetry: () => void
}) {
  const [elapsed, setElapsed] = useState(0)
  const isFailed = status === "FAILED"
  const statusInfo = STATUS_LABELS[status] ?? { label: status, description: "" }

  useEffect(() => {
    if (isFailed || status === "COMPLETED") return
    const start = startedAt ?? Date.now()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isFailed, status, startedAt])

  const formatElapsed = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`

  return (
    <FeatureGate feature="gapAnalysis">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
            {'\u2190'} Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Policy Gap Analysis</h1>
            <p className="text-muted-foreground mt-1 text-sm truncate max-w-sm">{documentName}</p>
          </div>
        </div>

        <Card className="border-border/50">
          <CardContent className="pt-10 pb-10">
            <div className="max-w-md mx-auto text-center space-y-6">
              {isFailed ? (
                <XCircle className="h-12 w-12 text-destructive mx-auto" />
              ) : (
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              )}

              <div>
                <h2 className={`text-xl font-semibold ${isFailed ? "text-destructive" : "text-foreground"}`}>
                  {statusInfo.label}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isFailed ? (errorMessage ?? statusInfo.description) : statusInfo.description}
                </p>
              </div>

              {!isFailed && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progress}%</span>
                      {startedAt && <span>Elapsed: {formatElapsed(elapsed)}</span>}
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {frameworks.length > 0 && (
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-left">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Analysing against:</p>
                      <div className="flex flex-wrap gap-1">
                        {frameworks.map((fw) => (
                          <span key={fw} className="text-xs rounded border border-border bg-background px-2 py-0.5 text-foreground">
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Deep analyses can take up to 3 minutes. Please keep this page open.
                  </p>
                </>
              )}

              {isFailed && (
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={onBack}>Back</Button>
                  <Button onClick={onRetry} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  )
}

// ─── Analysis History Item ────────────────────────────────────────────────────

function AnalysisHistoryItem({
  analysis,
  onView,
  onDelete,
}: {
  analysis: {
    id: string
    documentName: string
    documentType: string
    overallScore: number | null
    status: string
    analysisDepth: string
    createdAt: Date
    progress?: number
  }
  onView: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const scoreConfig = analysis.overallScore != null ? getScoreColor(analysis.overallScore) : null
  const isInProgress = analysis.status !== "COMPLETED" && analysis.status !== "FAILED"

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        {isInProgress ? (
          <Loader2 className="h-8 w-8 text-primary animate-spin shrink-0" />
        ) : (
          <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
        )}
        <div>
          <p className="font-medium text-foreground text-sm">{analysis.documentName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {analysis.analysisDepth} · {new Date(analysis.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}
          </p>
          <Badge
            variant="outline"
            className={`text-xs mt-1 ${
              analysis.status === "COMPLETED" ? "border-secondary text-secondary" :
              analysis.status === "FAILED" ? "border-destructive text-destructive" :
              "border-primary text-primary"
            }`}
          >
            {STATUS_LABELS[analysis.status]?.label ?? analysis.status}
          </Badge>
          {isInProgress && typeof analysis.progress === "number" && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1 w-24 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${analysis.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{analysis.progress}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {analysis.overallScore != null && scoreConfig && (
          <div className={`h-12 w-12 rounded-full border-4 ${scoreConfig.ring} flex items-center justify-center ${scoreConfig.bg}`}>
            <span className={`text-xs font-bold ${scoreConfig.text}`}>{analysis.overallScore}</span>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={() => onView(analysis.id, analysis.documentName)}
          disabled={analysis.status !== "COMPLETED"}
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(analysis.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function GapAnalysisPage() {
  const [activeView, setActiveView] = useState<{ id: string; name: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [analysisDepth, setAnalysisDepth] = useState<"quick" | "standard" | "deep">("standard")
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([])
  const [consentChecked, setConsentChecked] = useState(false)

  // Async polling state
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null)
  const [isAwaitingResult, setIsAwaitingResult] = useState(false)
  const [analysisStartedAt, setAnalysisStartedAt] = useState<number | null>(null)
  const [pendingDocName, setPendingDocName] = useState<string>("")
  const [pendingFrameworks, setPendingFrameworks] = useState<string[]>([])
  const hasCheckedResumption = useRef(false)

  const utils = trpc.useUtils()

  const { data: analyses, isLoading: listLoading, error: listError } = trpc.compliance.getGapAnalysis.useQuery(undefined)
  const { data: frameworksData, isLoading: frameworksLoading } = trpc.compliance.getFrameworks.useQuery()

  // Polling query — active only while isAwaitingResult
  const pollingQuery = trpc.compliance.getGapAnalysisResult.useQuery(
    { id: activeAnalysisId! },
    {
      enabled: isAwaitingResult && activeAnalysisId !== null,
      refetchInterval: (query) => {
        const status = (query.state.data as any)?.status as string | undefined
        if (status === "COMPLETED" || status === "FAILED") return false
        return 3000
      },
    }
  )

  // Transition to results view on COMPLETED
  useEffect(() => {
    if (!isAwaitingResult || !pollingQuery.data) return
    const d = pollingQuery.data as any
    if (d.status === "COMPLETED") {
      setIsAwaitingResult(false)
      setActiveView({ id: d.id, name: d.documentName })
      utils.compliance.getGapAnalysis.invalidate()
      resetForm()
      toast({ title: "Analysis complete", description: `Overall score: ${d.overallScore ?? "N/A"}/100` })
    }
    // FAILED: stay on progress view — AnalysisProgressView renders the error + retry UI
  }, [(pollingQuery.data as any)?.status, isAwaitingResult]) // eslint-disable-line react-hooks/exhaustive-deps

  // Page-refresh resumption — detect in-progress analyses on first load
  useEffect(() => {
    if (hasCheckedResumption.current || isAwaitingResult || activeView || !analyses) return
    hasCheckedResumption.current = true
    const arr = Array.isArray(analyses) ? analyses : []
    const inProgress = arr.find((a: any) => a.status !== "COMPLETED" && a.status !== "FAILED")
    if (inProgress) {
      setActiveAnalysisId(inProgress.id)
      setPendingDocName(inProgress.documentName)
      setPendingFrameworks([])
      setIsAwaitingResult(true)
    }
  }, [analyses, isAwaitingResult, activeView])

  const runMutation = trpc.compliance.runGapAnalysis.useMutation({
    onSuccess: (data) => {
      const d = data as any
      setActiveAnalysisId(d.id)
      setIsAwaitingResult(true)
      setAnalysisStartedAt(Date.now())
      setPendingDocName(selectedFile?.name ?? "")
      setPendingFrameworks([...selectedFrameworks])
      utils.compliance.getGapAnalysis.invalidate()
      toast({ title: "Analysis queued", description: "Your document is being processed. This may take 1\u20133 minutes." })
    },
    onError: (err) => {
      toast({
        title: "Analysis failed",
        description: err.message || "Failed to run gap analysis. Please try again.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = trpc.compliance.deleteGapAnalysis.useMutation({
    onSuccess: () => {
      toast({ title: "Analysis deleted" })
      utils.compliance.getGapAnalysis.invalidate()
    },
    onError: (err) => {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" })
    },
  })

  const resetForm = () => {
    setSelectedFile(null)
    setSelectedFrameworks([])
    setAnalysisDepth("standard")
    setSelectedFocusAreas([])
    setConsentChecked(false)
  }

  const handleRunAnalysis = async () => {
    if (!selectedFile || selectedFrameworks.length === 0) return

    // Convert file to base64
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1]
      const ext = selectedFile.name.split(".").pop()?.toLowerCase() ?? "pdf"

      runMutation.mutate({
        fileName: selectedFile.name,
        fileType: ext as "pdf" | "docx" | "doc" | "txt",
        fileContent: base64,
        regulatoryFrameworks: selectedFrameworks,
        analysisDepth,
        focusAreas: selectedFocusAreas.length > 0 ? selectedFocusAreas : undefined,
      })
    }
    reader.onerror = () => {
      toast({ title: "File read error", description: "Could not read the file. Please try again.", variant: "destructive" })
    }
    reader.readAsDataURL(selectedFile)
  }

  const canRun = selectedFile !== null && selectedFrameworks.length > 0 && consentChecked && !runMutation.isPending && !isAwaitingResult

  // Show async progress view
  if (isAwaitingResult && activeAnalysisId) {
    const pd = pollingQuery.data as any
    return (
      <AnalysisProgressView
        documentName={pd?.documentName ?? pendingDocName}
        frameworks={pendingFrameworks}
        progress={pd?.progress ?? 5}
        status={pd?.status ?? "QUEUED"}
        errorMessage={pd?.errorMessage}
        startedAt={analysisStartedAt}
        onBack={() => {
          setIsAwaitingResult(false)
          setActiveAnalysisId(null)
        }}
        onRetry={() => {
          setIsAwaitingResult(false)
          setActiveAnalysisId(null)
        }}
      />
    )
  }

  // Show result view
  if (activeView) {
    return (
      <div className="space-y-6">
        <AnalysisResultsView
          analysisId={activeView.id}
          documentName={activeView.name}
          onBack={() => setActiveView(null)}
        />
      </div>
    )
  }

  const analysisHistory = Array.isArray(analyses) ? analyses : []

  return (
    <FeatureGate feature="gapAnalysis">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Policy Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Upload your policy documents and compare them against Kenyan regulatory requirements using AI.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => utils.compliance.getGapAnalysis.invalidate()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Upload + Config Panel */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Upload */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-5 w-5 text-primary" />
              Upload Policy Document
            </CardTitle>
            <CardDescription>
              Upload your internal compliance policy, procedure, or framework document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadSection
              file={selectedFile}
              onFile={setSelectedFile}
              onRemove={() => setSelectedFile(null)}
            />
          </CardContent>
        </Card>

        {/* Right: Config */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-primary" />
              Analysis Configuration
            </CardTitle>
            <CardDescription>Choose which regulatory frameworks to compare against.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Frameworks */}
            <div className="space-y-2">
              <Label>Regulatory Frameworks <span className="text-destructive">*</span></Label>
              {frameworksLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              ) : frameworksData && frameworksData.length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(
                    frameworksData.reduce<Record<string, typeof frameworksData>>((acc, fw) => {
                      if (!acc[fw.category]) acc[fw.category] = []
                      acc[fw.category].push(fw)
                      return acc
                    }, {})
                  ).map(([category, fws]) => (
                    <div key={category}>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">{category}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {fws.map((fw) => {
                          const isSelected = selectedFrameworks.includes(fw.slug)
                          if (fw.locked) {
                            return (
                              <div
                                key={fw.slug}
                                title={`Upgrade to ${fw.tier.charAt(0) + fw.tier.slice(1).toLowerCase()} to access`}
                                className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground cursor-not-allowed select-none"
                              >
                                <Lock className="h-3 w-3 shrink-0" />
                                {fw.name}
                              </div>
                            )
                          }
                          return (
                            <button
                              key={fw.slug}
                              type="button"
                              onClick={() =>
                                setSelectedFrameworks((prev) =>
                                  prev.includes(fw.slug) ? prev.filter((s) => s !== fw.slug) : [...prev, fw.slug]
                                )
                              }
                              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground hover:bg-muted"
                              }`}
                            >
                              {fw.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No frameworks available.</p>
              )}
              {selectedFrameworks.length === 0 && !frameworksLoading && (
                <p className="text-xs text-muted-foreground">Select at least one framework to analyse against</p>
              )}
            </div>

            {/* Analysis Depth */}
            <div className="space-y-2">
              <Label>Analysis Depth</Label>
              <div className="grid grid-cols-3 gap-2">
                {ANALYSIS_DEPTHS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setAnalysisDepth(d.value as "quick" | "standard" | "deep")}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      analysisDepth === d.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{d.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div className="space-y-2">
              <Label>Focus Areas <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() =>
                      setSelectedFocusAreas((prev) =>
                        prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
                      )
                    }
                    className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                      selectedFocusAreas.includes(area)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-border data processing consent */}
      <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer"
          />
          <span className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            I understand that my document will be processed using AI services hosted outside Kenya,
            in accordance with SheriaBot&apos;s Privacy Policy and the Data Protection Act 2019.
          </span>
        </label>
      </div>

      {/* Run Analysis Button */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          {runMutation.isPending ? (
            <div className="flex items-center justify-center gap-3 py-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading document...</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                {!canRun && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    {!selectedFile
                      ? "Upload a document to continue"
                      : selectedFrameworks.length === 0
                      ? "Select at least one regulatory framework"
                      : "Confirm the data processing consent above to continue"}
                  </div>
                )}
                {canRun && (
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <CheckCircle2 className="h-4 w-4" />
                    Ready — {selectedFile?.name} against {selectedFrameworks.length} framework{selectedFrameworks.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <Button
                onClick={handleRunAnalysis}
                disabled={!canRun}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Run Gap Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis History */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Analysis History</h2>

        {listLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        )}

        {!listLoading && listError && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{listError.message}</p>
            </CardContent>
          </Card>
        )}

        {!listLoading && !listError && analysisHistory.length === 0 && (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">No analyses yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a policy document and run your first gap analysis above.
              </p>
            </CardContent>
          </Card>
        )}

        {!listLoading && !listError && analysisHistory.length > 0 && (
          <div className="space-y-3">
            {analysisHistory.map((analysis: {
              id: string
              documentName: string
              documentType: string
              overallScore: number | null
              status: string
              analysisDepth: string
              createdAt: Date
              progress?: number
            }) => (
              <AnalysisHistoryItem
                key={analysis.id}
                analysis={analysis}
                onView={(id, name) => setActiveView({ id, name })}
                onDelete={(id) => {
                  if (confirm("Delete this analysis? This cannot be undone.")) {
                    deleteMutation.mutate({ id })
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This gap analysis is AI-generated guidance grounded in Kenyan regulations.
              It is intended as a starting point and should be reviewed by a qualified compliance officer or legal counsel before taking action.
              SheriaBot does not provide legal advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </FeatureGate>
  )
}
