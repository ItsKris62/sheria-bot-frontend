"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { trpc } from "@/lib/trpc"
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
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const REGULATORY_FRAMEWORKS = [
  { id: "Data Protection Act 2019", label: "Data Protection Act 2019 (DPA)" },
  { id: "CBK Prudential Guidelines", label: "CBK Prudential Guidelines" },
  { id: "National Payment System Act 2011", label: "National Payment System Act 2011" },
  { id: "POCAMLA", label: "Proceeds of Crime & AML Act (POCAMLA)" },
  { id: "CBK Cybersecurity Guidelines", label: "CBK Cybersecurity Guidance Note" },
  { id: "Consumer Protection Guidelines", label: "Consumer Protection Guidelines" },
  { id: "Digital Credit Providers Regulations 2022", label: "Digital Credit Providers Regulations 2022" },
  { id: "Capital Markets Authority Act", label: "Capital Markets Authority Act" },
]

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

// ─── Multi-Select Component ─────────────────────────────────────────────────

function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: { id: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id])

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => toggle(opt.id)}
          className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
            selected.includes(opt.id)
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
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
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-medium text-foreground">Analysis in progress...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take 1–2 minutes depending on document size.</p>
        </CardContent>
      </Card>
    )
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
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={() => toast({ title: "Export", description: "PDF export coming soon." })}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

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
  }
  onView: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const scoreConfig = analysis.overallScore != null ? getScoreColor(analysis.overallScore) : null

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
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
            {analysis.status}
          </Badge>
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

  const utils = trpc.useUtils()

  const { data: analyses, isLoading: listLoading, error: listError } = trpc.compliance.getGapAnalysis.useQuery(undefined)

  const runMutation = trpc.compliance.runGapAnalysis.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Analysis complete",
        description: `Overall score: ${data.overallScore ?? "N/A"}/100`,
      })
      utils.compliance.getGapAnalysis.invalidate()
      setActiveView({ id: data.id, name: data.documentName })
      resetForm()
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

  const canRun = selectedFile !== null && selectedFrameworks.length > 0 && !runMutation.isPending

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
              <MultiSelect
                options={REGULATORY_FRAMEWORKS}
                selected={selectedFrameworks}
                onChange={setSelectedFrameworks}
              />
              {selectedFrameworks.length === 0 && (
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

      {/* Run Analysis Button */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          {runMutation.isPending ? (
            <div className="text-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="font-medium text-foreground">Analysing your document...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Uploading to secure storage, extracting text, and comparing against {selectedFrameworks.length} regulatory framework{selectedFrameworks.length > 1 ? "s" : ""}.
                This may take 1–2 minutes.
              </p>
              <Progress className="mt-4 max-w-xs mx-auto h-2" value={undefined} />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                {!canRun && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    {!selectedFile
                      ? "Upload a document to continue"
                      : "Select at least one regulatory framework"}
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
  )
}
