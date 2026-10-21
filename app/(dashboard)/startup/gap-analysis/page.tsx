"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MultiSelect, type Option } from "@/components/ui/multi-select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
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
  Globe,
  Search,
} from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { usePlan } from "@/lib/plan-context"
import { jurisdictionLabel, type JurisdictionCode } from "@/lib/jurisdictions"
import { trackEvent, trackFeatureUsage, recordAccountActivation } from "@/lib/analytics"
import { buildGapAnalysisInput, type GapAnalysisDepth } from "@/lib/gap-analysis-input"
import {
  gapAnalysisAcceptValue,
  gapAnalysisFileHelperText,
  getAvailableGapAnalysisDepths,
  selectGapAnalysisDepth,
  validateGapAnalysisFile,
  type GapAnalysisUploadContract,
  type GapAnalysisDepthAvailabilityContract,
} from "@/lib/gap-analysis-contract"
import {
  filterGapAnalysisFrameworks,
  formatGapAnalysisDepth,
  getComplianceAlignmentPresentation,
  getGapAnalysisRunRequirements,
  getPilotJurisdictionNotice,
  groupGapAnalysisFrameworks,
  isPilotJurisdictionEnabled,
  isPilotJurisdictionValidated,
  safeGapAnalysisFailureMessage,
  GAP_ANALYSIS_STATUS_LABELS,
  type GapAnalysisPilotAvailability,
} from "@/lib/gap-analysis-presentation"

const LoadingScreen = dynamic(
  () => import("@/components/loading-screen").then((module) => module.LoadingScreen),
  {
    loading: () => (
      <div className="flex min-h-48 flex-col items-center justify-center gap-4" role="status" aria-label="Loading analysis progress">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-4 w-44" />
      </div>
    ),
  },
)

// Local Types

type FrameworkOption = {
  slug: string
  name: string
  category: string
  description: string | null
  tier: string
  locked: boolean
  scope?: string
  jurisdictions?: string[]
  applicable?: boolean
  pilotEnabled?: boolean
  readiness?: string
}

// Constants

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

const SEVERITY_CONFIG = {
  CRITICAL: { label: "Critical", bg: "bg-red-950/30", border: "border-l-red-500", badge: "bg-red-50 text-red-800 border-red-300" },
  HIGH: { label: "High", bg: "bg-orange-950/30", border: "border-l-orange-500", badge: "bg-orange-50 text-orange-900 border-orange-300" },
  MEDIUM: { label: "Medium", bg: "bg-yellow-950/30", border: "border-l-yellow-500", badge: "bg-yellow-50 text-yellow-900 border-yellow-300" },
  LOW: { label: "Low", bg: "bg-emerald-950/30", border: "border-l-emerald-500", badge: "bg-emerald-50 text-emerald-900 border-emerald-300" },
}

const STATUS_LABELS = GAP_ANALYSIS_STATUS_LABELS

const VERIFIED_HELPER_TEXT =
  "Verified sources were matched to SheriaBot's legal corpus and accepted by the verification flow. This does not replace independent legal advice."

function getScoreColor(score: number) {
  if (score >= 91) return { ring: "border-secondary", text: "text-secondary", bg: "bg-secondary/10" }
  if (score >= 71) return { ring: "border-amber-700", text: "text-amber-900", bg: "bg-amber-50" }
  if (score >= 41) return { ring: "border-orange-700", text: "text-orange-900", bg: "bg-orange-50" }
  return { ring: "border-red-700", text: "text-red-800", bg: "bg-red-50" }
}

// File Upload Section

export function FileUploadSection({
  file,
  onFile,
  onRemove,
  uploadContract,
}: {
  file: File | null
  onFile: (file: File) => void
  onRemove: () => void
  uploadContract: GapAnalysisUploadContract | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const validateAndSetFile = (f: File) => {
    if (!uploadContract) {
      toast.error("Upload settings unavailable", { description: "Wait for your plan limits to load and try again." })
      return
    }
    const validationError = validateGapAnalysisFile(f, uploadContract)
    if (validationError) {
      toast.error("Document not supported", { description: validationError })
      return
    }
    onFile(f)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSetFile(f)
  }

  if (file) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-secondary/50 bg-secondary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <FileText className="h-8 w-8 text-secondary shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB - {file.type.split("/").pop()?.toUpperCase()}</p>
          </div>
        </div>
        <Button aria-label={`Remove ${file.name}`} variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div
        role="button"
        tabIndex={uploadContract ? 0 : -1}
        aria-disabled={!uploadContract}
        aria-describedby="gap-analysis-upload-help"
        className={`rounded-lg border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
        } cursor-pointer`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && uploadContract) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <div className="py-10 text-center">
          <Upload className={`h-8 w-8 mx-auto mb-3 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm font-medium text-foreground">Drop your policy document here</p>
          <p className="text-xs text-muted-foreground mt-1">or <span className="text-[#0A5C36] underline">browse files</span></p>
          <p id="gap-analysis-upload-help" className="text-xs text-muted-foreground mt-3">
            {uploadContract ? gapAnalysisFileHelperText(uploadContract) : "Loading upload limits..."}
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={uploadContract ? gapAnalysisAcceptValue(uploadContract.allowedFileTypes) : undefined}
        disabled={!uploadContract}
        aria-label="Upload policy document"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) validateAndSetFile(f) }}
      />
    </>
  )
}

// Score Gauge

export function ScoreGauge({ score, available = true }: { score: number; available?: boolean }) {
  if (!available) {
    return (
      <div
        className="h-28 w-28 rounded-full border-8 border-border flex flex-col items-center justify-center bg-muted/40"
        aria-label="Compliance Alignment not assessed"
      >
        <p className="text-2xl font-bold text-muted-foreground">—</p>
        <p className="text-[10px] font-medium text-muted-foreground text-center px-1 leading-tight mt-0.5">Compliance Alignment</p>
      </div>
    )
  }
  const { ring, text, bg } = getScoreColor(score)
  return (
    <div className={`h-28 w-28 rounded-full border-8 ${ring} flex flex-col items-center justify-center ${bg}`}>
      <p className={`text-2xl font-bold ${text}`}>{score}%</p>
      <p className={`text-[10px] font-medium ${text} text-center px-1 leading-tight mt-0.5`}>Compliance Alignment</p>
    </div>
  )
}

// Analysis Results View

type RegulatoryEvidenceItem = {
  evidenceId: string
  vectorId: string
  documentTitle: string
  section?: string
  excerpt: string
  jurisdiction: string
  frameworkSlug: string
  sourceAuthority?: string
}

type PolicyEvidenceItem = {
  policyEvidenceId: string
  chunkIndex?: number
  excerpt: string
  page?: number
  sectionHeading?: string
}

type FindingVerification = {
  verdict: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "UNSUPPORTED" | "NOT_VERIFIABLE"
  confidence?: number
  unsupportedClaims?: string[]
}

type FindingCoverage = {
  regulatoryEvidenceAvailable: boolean
  policySectionAssessed: boolean
  extractionComplete: boolean
}

type GapResult = {
  id: string
  title: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  regulatoryBasis: string
  citationVerified?: boolean
  verificationStatus?: "verified" | "unverified" | "not_checked"
  requirement?: string
  status?: string
  severityRationale?: string
  evidenceIds?: string[]
  policyEvidenceIds?: string[]
  regulatoryEvidence?: RegulatoryEvidenceItem[]
  policyEvidence?: PolicyEvidenceItem[]
  verification?: FindingVerification
  coverage?: FindingCoverage
  sourceDocumentTitle?: string
  sourceSection?: string
  sourceSnippet?: string
  authorityStatus?: string
  isBinding?: boolean
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
  complianceAlignmentScore?: number
  assessmentCoverageScore?: number
  assessmentCoverage?: number
  coverageStatus?: string
  scoringVersion?: string
  documentCoverage?: {
    totalChunks: number
    processedChunks: number
    failedChunks: number
    skippedChunks: number
    extractionComplete: boolean
  }
  frameworkCoverage?: Record<string, {
    frameworkSlug: string
    evidenceStatus: string
    assessedRequirementCount: number
    unassessedRequirementCount?: number
  }>
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
    scoringVersion?: string
    complianceAlignmentScore?: number
    assessmentCoverageScore?: number
    coverageStatus?: "COMPLETE" | "PARTIAL" | "INSUFFICIENT"
    frameworkCoverage?: Record<string, {
      frameworkSlug: string
      evidenceStatus: string
      assessedRequirementCount: number
      unassessedRequirementCount?: number
    }>
    documentCoverage?: {
      totalChunks: number
      processedChunks: number
      failedChunks: number
      skippedChunks: number
      extractionComplete: boolean
    }
    selectedBenchmarkDocuments?: Array<{
      id: string
      title: string
      documentType?: string | null
      regulatoryBody?: string | null
    }>
    executionProfileVersion?: string
    executionLimitations?: string[]
  }
}

function PilotFeedbackWidget({ analysisId }: { analysisId: string }) {
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [rating, setRating] = useState<"helpful" | "unhelpful" | null>(null)
  const [selectedChips, setSelectedChips] = useState<string[]>([])

  const chips = [
    "Accurate findings",
    "Clear recommendations",
    "Evidence quality",
    "Missed issue",
    "False positive",
    "Report quality",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent("gap_analysis_pilot_feedback", {
      analysis_id: analysisId,
      rating: rating ?? "unspecified",
      tags: selectedChips,
    })
    setFeedbackSent(true)
    toast.success("Feedback submitted", { description: "Thank you for helping calibrate the pilot!" })
  }

  if (feedbackSent) {
    return (
      <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-primary mx-auto mb-1" />
        Thank you for your pilot feedback. Your rating and structured feedback tags directly guide regulatory corpus calibration.
      </div>
    )
  }

  return (
    <Card className="border-border/60 bg-muted/10">
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-foreground">Pilot Feedback</p>
            <p className="text-[11px] text-muted-foreground">Help calibrate SheriaBot for your organization.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={rating === "helpful" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setRating("helpful")}
            >
              Useful
            </Button>
            <Button
              type="button"
              variant={rating === "unhelpful" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setRating("unhelpful")}
            >
              Needs work
            </Button>
          </div>
        </div>

        {rating && (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border/40">
            <p className="text-[11px] font-medium text-foreground">Select feedback tags that apply:</p>
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => {
                const active = selectedChips.includes(chip)
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setSelectedChips((prev) =>
                        prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
                      )
                    }
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {chip}
                  </button>
                )
              })}
            </div>
            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="h-7 text-xs">
                Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export function AnalysisResultsView({
  analysisId,
  documentName,
  onBack,
}: {
  analysisId: string
  documentName: string
  onBack: () => void
}) {
  const user = useAuthStore((state) => state.user)
  const { data, isLoading, error } = trpc.gapAnalysis.getGapAnalysisResult.useQuery(
    { id: analysisId },
    { enabled: !!user }
  )
  const [expandedGaps, setExpandedGaps] = useState<Record<string, boolean>>({})
  const [findingSeverity, setFindingSeverity] = useState("ALL")
  const [findingFramework, setFindingFramework] = useState("ALL")
  const [findingVerification, setFindingVerification] = useState("ALL")

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
      trackEvent("gap_analysis_export_generated", { type: "docx" })
      toast.success("Report ready", { description: "Your Word document download has started." })
    },
    onError: (err) => {
      toast.error("Export failed", {
        description: err.message.includes("FORBIDDEN")
          ? "DOCX export is available on Business and Enterprise plans. Please upgrade."
          : err.message || "Failed to generate report. Please try again.",
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
          <Button variant="outline" className="mt-4 bg-transparent" onClick={onBack}>Back</Button>
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
          <p className="text-sm text-muted-foreground mt-1">{safeGapAnalysisFailureMessage(data.errorMessage, (data as { failureClass?: string | null }).failureClass)}</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={onBack}>Back to analyses</Button>
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

  const analysisData = data as unknown as {
    organizationName: string | null
    userName: string | null
    documentName: string
    createdAt: string
    analysisDepth: string | null
    ragGrounded: boolean | null
    chunksProcessed: number | null
    regulatoryFrameworks: unknown
  }
  const regulatoryFrameworks = analysisData.regulatoryFrameworks as unknown
  const { overallScore, executiveSummary, frameworks, crossCuttingStrengths, actionPlan, metadata } = results
  const isV2 = metadata.scoringVersion === "v2.0-evidence-backed" || metadata.complianceAlignmentScore !== undefined || results.complianceAlignmentScore !== undefined
  const alignmentScore = metadata.complianceAlignmentScore ?? results.complianceAlignmentScore ?? overallScore
  const coverageScore = metadata.assessmentCoverageScore ?? results.assessmentCoverageScore ?? results.assessmentCoverage ?? 0
  const coverageStatus = metadata.coverageStatus ?? results.coverageStatus ?? "INSUFFICIENT"
  const documentCoverage = metadata.documentCoverage ?? results.documentCoverage
  const selectedBenchmarkDocuments = metadata.selectedBenchmarkDocuments ?? []
  const allGaps = frameworks.flatMap((f) => f.gaps.map((g) => ({ ...g, frameworkName: f.name })))
  const frameworkCoverage = metadata.frameworkCoverage ?? results.frameworkCoverage
  const assessedRequirementCount = frameworkCoverage
    ? Object.values(frameworkCoverage).reduce((total, item) => total + item.assessedRequirementCount, 0)
    : allGaps.length
  const alignmentPresentation = getComplianceAlignmentPresentation({
    score: alignmentScore,
    evidenceBacked: isV2,
    coverageStatus,
    assessedRequirementCount,
  })
  const scoreConfig = alignmentPresentation.available
    ? getScoreColor(alignmentScore)
    : { ring: "border-border", text: "text-muted-foreground", bg: "bg-muted/40" }

  const verifiedGapCount = allGaps.filter((gap) => gap.verification?.verdict === "SUPPORTED" || gap.verificationStatus === "verified").length
  const partialGapCount = allGaps.filter((gap) => gap.verification?.verdict === "PARTIALLY_SUPPORTED").length
  const unsupportedGapCount = allGaps.filter((gap) => gap.verification?.verdict === "UNSUPPORTED" || gap.verificationStatus === "unverified").length
  const limitationGapCount = allGaps.filter((gap) => gap.verification?.verdict === "NOT_VERIFIABLE").length
  const notCheckedGapCount = allGaps.length - verifiedGapCount - partialGapCount - unsupportedGapCount - limitationGapCount
  const sortedGaps = [...allGaps].filter((gap) => {
    const verification = gap.verification?.verdict ?? gap.verificationStatus ?? "NOT_CHECKED"
    return (findingSeverity === "ALL" || gap.severity === findingSeverity)
      && (findingFramework === "ALL" || gap.frameworkName === findingFramework)
      && (findingVerification === "ALL" || verification === findingVerification)
  }).sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
  })

  function gapVerificationBadge(gap: GapResult) {
    if (gap.verification?.verdict === "SUPPORTED" || gap.verificationStatus === "verified") {
      return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-900 border border-green-300">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </span>
      )
    }
    if (gap.verification?.verdict === "PARTIALLY_SUPPORTED") {
      return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-950 border border-amber-300">
          <AlertTriangle className="h-3 w-3" />
          Partially Verified
        </span>
      )
    }
    if (gap.verification?.verdict === "UNSUPPORTED") {
      return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-800 border border-red-300">
          <XCircle className="h-3 w-3" />
          Unsupported — excluded from score
        </span>
      )
    }
    if (gap.verification?.verdict === "NOT_VERIFIABLE") {
      return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
          <AlertCircle className="h-3 w-3" />
          Could not verify
        </span>
      )
    }
    if (gap.verificationStatus === "unverified") {
      return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-950 border border-amber-300">
          <AlertTriangle className="h-3 w-3" />
          Unverified
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
        <AlertCircle className="h-3 w-3" />
        Not checked
      </span>
    )
  }

  function handleExportPdf() {
    const html = buildGapAnalysisReportHtml({
      analysisId,
      organizationName: analysisData.organizationName ?? undefined,
      userName: analysisData.userName ?? undefined,
      documentName: analysisData.documentName,
      createdAt: analysisData.createdAt,
      analysisDepth: analysisData.analysisDepth ?? "standard",
      ragGrounded: analysisData.ragGrounded ?? false,
      chunksProcessed: analysisData.chunksProcessed ?? 0,
      regulatoryFrameworks: Array.isArray(regulatoryFrameworks)
        ? regulatoryFrameworks.filter((item): item is string => typeof item === "string")
        : [],
      jurisdictionCode: (data as any)?.jurisdictionCode,
      result: results as unknown as GapAnalysisReportResult,
    })
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("Pop-up blocked", { description: "Please allow pop-ups for this site and try again." })
      return
    }
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
    logExportMutation.mutate({ analysisId, format: "pdf" })
    trackEvent("gap_analysis_export_generated", { type: "pdf" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground">
            Back to Gap Analysis
          </Button>
          <h2 className="text-xl font-bold text-foreground">Gap Analysis Results</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {data.documentName} - {new Date(data.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}
            {" • "}
            {(data as any)?.jurisdictionCode ? `${jurisdictionLabel((data as any).jurisdictionCode)} (${(data as any).jurisdictionCode})` : "Jurisdiction not recorded for this legacy analysis"}
          </p>
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

      {/* Legal / AI Disclaimer Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm dark:border-amber-700/50 dark:bg-amber-900/20">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-amber-950">
          <span className="font-bold">DISCLAIMER:</span> This Gap Analysis Report was generated by SheriaBot AI for informational and internal auditing purposes only. It does not constitute formal legal advice. Organisations should consult with qualified legal counsel before making compliance decisions based on this report.
        </p>
      </div>

      {/* RAG grounding warning - shown when Pinecone was unavailable during generation */}
      {data.ragGrounded === false && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm dark:border-yellow-800/50 dark:bg-yellow-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
          <p className="text-yellow-800 dark:text-yellow-300">
              <span className="font-semibold">Limited regulatory grounding.</span> This saved analysis does not contain verified SheriaBot regulatory evidence and may not reflect the latest applicable regulations or amendments. Consider re-running the analysis when the service is available.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">Depth: {analysisData.analysisDepth ?? "standard"}</Badge>
        <Badge variant="outline">
          Engine: {metadata.executionProfileVersion ?? "legacy execution profile"}
        </Badge>
      </div>

      {(metadata.executionLimitations?.length ?? 0) > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800/50 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-semibold text-amber-950">Execution limitations</p>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-amber-950">
              {metadata.executionLimitations?.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Incomplete Document Extraction Warning */}
      {documentCoverage && (documentCoverage.failedChunks > 0 || documentCoverage.skippedChunks > 0) && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold text-red-800">Incomplete Document Extraction</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {documentCoverage.failedChunks} document chunk(s) failed and {documentCoverage.skippedChunks} were skipped during traversal.
              Findings reflect partial document coverage and do not certify complete compliance.
            </p>
          </div>
        </div>
      )}

      {selectedBenchmarkDocuments.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Benchmark Documents
            </CardTitle>
            <CardDescription>Legal corpus documents selected for this analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedBenchmarkDocuments.map((doc) => (
                <Badge key={doc.id} variant="outline" className="bg-muted/40">
                  {doc.title}
                  {doc.regulatoryBody ? ` - ${doc.regulatoryBody}` : ""}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-900 border-green-300">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {verifiedGapCount} verified
        </Badge>
        {partialGapCount > 0 && (
          <Badge variant="outline" className="bg-amber-50 text-amber-950 border-amber-300">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {partialGapCount} partially verified
          </Badge>
        )}
        <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
          <XCircle className="mr-1 h-3 w-3" />
          {unsupportedGapCount} unsupported
        </Badge>
        {limitationGapCount > 0 && (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            <AlertCircle className="mr-1 h-3 w-3" />
            {limitationGapCount} limitation
          </Badge>
        )}
        {notCheckedGapCount > 0 && (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <AlertCircle className="mr-1 h-3 w-3" />
            {notCheckedGapCount} not checked
          </Badge>
        )}
      </div>

      {/* Executive Summary Card */}
      <Card className={`border-2 ${scoreConfig.ring}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <ScoreGauge score={alignmentScore} available={alignmentPresentation.available} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-semibold text-foreground text-lg">
                  {isV2 ? "Compliance Alignment" : "Compliance Alignment (Legacy)"}
                </h3>
                <Badge variant="outline" className={scoreConfig.bg + " " + scoreConfig.text + " border-current"}>
                  {alignmentPresentation.label}
                </Badge>
                <Badge variant="outline" className="text-xs bg-muted">
                  {isV2 ? "Evidence-based v2" : "Legacy scoring"}
                </Badge>
              </div>

              {/* Document Processing */}
              <div className="mb-2 rounded-md border border-border/70 bg-muted/20 px-3 py-2">
                <p className="text-xs font-semibold text-foreground">Document Processing</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Document processed · {documentCoverage
                    ? `${documentCoverage.processedChunks} of ${documentCoverage.totalChunks} chunk${documentCoverage.totalChunks === 1 ? "" : "s"} successfully analyzed`
                    : `${(metadata as any)?.chunksProcessed ?? 1} of ${(metadata as any)?.chunksProcessed ?? 1} chunk(s) successfully analyzed`}
                </p>
              </div>

              {/* Assessment Coverage */}
              <div className="mb-3 rounded-md border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">Assessment Coverage · Partial</p>
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-950 border-amber-300">Partial</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {allGaps.length} evidence-backed obligation{allGaps.length === 1 ? "" : "s"} evaluated.
                  {coverageStatus === "UNKNOWN"
                    ? "Inventory completeness is unknown, so assessment coverage is not expressed as a percentage."
                    : "Coverage does not represent every possible requirement in the selected frameworks."}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{executiveSummary}</p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Alignment reflects the requirements assessed in this review. It is not an official legal certification of compliance.
              </p>
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
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted/50 sm:inline-flex sm:h-10 sm:w-auto">
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
                      <div className="text-right">
                        <Badge variant="outline" className={`${fwConfig.bg} ${fwConfig.text} border-current text-xs`}>
                          {fw.score}/100 alignment
                        </Badge>
                        {coverageStatus !== "COMPLETE" ? <p className="mt-1 text-[10px] text-muted-foreground">Partial coverage</p> : null}
                      </div>
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
          <div className="grid gap-2 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-3" aria-label="Filter findings">
            <Label className="sr-only" htmlFor="finding-severity">Severity</Label>
            <select id="finding-severity" value={findingSeverity} onChange={(event) => setFindingSeverity(event.target.value)} className="h-9 min-w-0 w-full max-w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="ALL">All severities</option><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
            </select>
            <Label className="sr-only" htmlFor="finding-framework">Framework</Label>
            <select id="finding-framework" value={findingFramework} onChange={(event) => setFindingFramework(event.target.value)} className="h-9 min-w-0 w-full max-w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="ALL">All frameworks</option>{frameworks.map((framework) => <option key={framework.id} value={framework.name}>{framework.name}</option>)}
            </select>
            <Label className="sr-only" htmlFor="finding-verification">Verification</Label>
            <select id="finding-verification" value={findingVerification} onChange={(event) => setFindingVerification(event.target.value)} className="h-9 min-w-0 w-full max-w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="ALL">All verification states</option><option value="SUPPORTED">Verified</option><option value="PARTIALLY_SUPPORTED">Partially verified</option><option value="UNSUPPORTED">Unsupported</option><option value="NOT_VERIFIABLE">Could not verify</option>
            </select>
          </div>
          {allGaps.length === 0 ? (
            <Card className="border border-border/60">
              <CardContent className="pt-6 pb-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="text-secondary font-medium">No Findings Identified</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  No reliable findings were produced from the authoritative evidence currently available.
                </p>
              </CardContent>
            </Card>
          ) : sortedGaps.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="text-secondary font-medium">No findings match these filters.</p>
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
                        <Badge variant="outline" className="max-w-full whitespace-normal break-words bg-muted text-left text-xs">{gap.frameworkName}</Badge>
                        {gap.status && (
                          <Badge variant="outline" className="text-[10px] shrink-0 bg-background">
                            {gap.status}
                          </Badge>
                        )}
                      </div>
                      {gap.requirement && gap.requirement !== gap.title && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="font-medium text-foreground">Requirement: </span>
                          {gap.requirement}
                        </p>
                      )}
                      <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-emerald-300">
                        <span>{gap.regulatoryBasis}</span>
                        {gapVerificationBadge(gap)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{gap.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedGaps((prev) => ({ ...prev, [gap.id]: !prev[gap.id] }))}
                      className="text-muted-foreground shrink-0"
                      aria-expanded={Boolean(isExpanded)}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} finding ${gap.title}`}
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-border/30 pt-3 text-sm">
                      {/* Customer Policy Evidence */}
                      <div>
                        <p className="font-medium text-foreground text-xs mb-1">Customer Policy Evidence</p>
                        {gap.policyEvidence && gap.policyEvidence.length > 0 ? (
                          <div className="space-y-1.5">
                            {gap.policyEvidence.map((pe, idx) => (
                              <div key={idx} className="rounded border border-border/40 bg-background/60 p-2 text-xs">
                                <p className="text-[10px] font-medium text-muted-foreground">{pe.sectionHeading ?? (pe.page ? `Page ${pe.page}` : "Policy excerpt")}</p>
                                <p className="italic text-foreground mt-0.5">&ldquo;{pe.excerpt}&rdquo;</p>
                              </div>
                            ))}
                          </div>
                        ) : gap.policyCurrentState ? (
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground leading-relaxed italic">&ldquo;{gap.policyCurrentState}&rdquo;</p>
                            <p className="text-[11px] text-muted-foreground/80 italic">No customer policy excerpt cited (absence assessed)</p>
                          </div>
                        ) : (
                          <p className="text-xs text-destructive italic">No matching clause identified in uploaded policy (Requirement absent from policy).</p>
                        )}
                      </div>

                      {/* Severity Rationale */}
                      {gap.severityRationale && (
                        <div className="rounded border border-border/30 bg-muted/20 p-2.5 text-xs">
                          <span className="font-semibold text-foreground text-xs">Severity Rationale: </span>
                          <span className="text-muted-foreground">{gap.severityRationale}</span>
                        </div>
                      )}

                      {/* Recommendation */}
                      <div>
                        <p className="font-medium text-foreground text-xs mb-1">Recommendation</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{gap.recommendation}</p>
                      </div>

                      {/* Regulatory Evidence Lineage */}
                      {gap.regulatoryEvidence && gap.regulatoryEvidence.length > 0 ? (
                        <div className="rounded-md border border-border/40 bg-background/60 p-3">
                          <p className="font-medium text-foreground text-xs mb-1">Regulatory Evidence (Corpus Lineage)</p>
                          <div className="space-y-2 mt-2">
                            {gap.regulatoryEvidence.map((re, idx) => (
                              <div key={idx} className="rounded border border-border/30 bg-muted/10 p-2.5 text-xs">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="font-semibold text-foreground">{re.documentTitle}</span>
                                  <div className="flex gap-1">
                                    {re.section && <Badge variant="outline" className="text-[10px]">§{re.section}</Badge>}
                                    <Badge variant="outline" className="text-[10px]">{re.jurisdiction}</Badge>
                                    <Badge variant="outline" className="text-[10px]">{re.frameworkSlug}</Badge>
                                  </div>
                                </div>
                                <p className="mt-1 text-muted-foreground leading-relaxed italic">&ldquo;{re.excerpt}&rdquo;</p>
                                <details className="mt-2 text-[10px] text-muted-foreground">
                                  <summary className="cursor-pointer font-medium">Advanced evidence details</summary>
                                  <p className="mt-1 font-mono break-all">Evidence ID: {re.evidenceId || re.vectorId}</p>
                                </details>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (gap.sourceDocumentTitle || gap.sourceSection || gap.sourceSnippet) ? (
                        <div className="rounded-md border border-border/40 bg-background/60 p-3">
                          <p className="font-medium text-foreground text-xs mb-1">Source Context</p>
                          <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                            {VERIFIED_HELPER_TEXT}
                          </p>
                          {gap.sourceDocumentTitle ? (
                            <p className="text-xs font-medium text-foreground">{gap.sourceDocumentTitle}</p>
                          ) : null}
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {gap.sourceSection ? (
                              <Badge variant="outline" className="text-[10px]">
                                {gap.sourceSection}
                              </Badge>
                            ) : null}
                            {gap.authorityStatus ? (
                              <Badge variant="outline" className="text-[10px]">
                                {gap.authorityStatus.replace(/_/g, " ")}
                                {gap.isBinding === false ? " / Non-binding" : ""}
                              </Badge>
                            ) : null}
                          </div>
                          {gap.sourceSnippet ? (
                            <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{gap.sourceSnippet}</p>
                          ) : null}
                        </div>
                      ) : (
                        <div className="rounded-md border border-border/40 bg-background/60 p-3">
                          <p className="font-medium text-foreground text-xs mb-1">Regulatory Evidence (Corpus Lineage)</p>
                          <p className="text-xs text-muted-foreground italic">No verified regulatory evidence attached</p>
                        </div>
                      )}

                      {/* Evidence Required Checklist */}
                      {(() => {
                        const evidence = (gap as Record<string, unknown>).evidenceRequired
                        if (!Array.isArray(evidence) || evidence.length === 0) return null
                        return (
                          <div>
                            <p className="font-medium text-foreground text-xs mb-1.5 flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-primary" />
                              Evidence Required
                            </p>
                            <ul className="space-y-1 ml-1">
                              {evidence.map((ev, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <span className="inline-block h-3.5 w-3.5 mt-0.5 shrink-0 rounded border border-border bg-background" />
                                  {String(ev)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })()}

                      {/* Responsible Role + Regulatory Deadline badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">Effort: {gap.effort}</Badge>
                        <Badge variant="outline" className="text-xs">Priority #{gap.priority}</Badge>
                        {(gap as Record<string, unknown>).responsibleRole ? (
                          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                            <Shield className="h-3 w-3 mr-1" />
                            {String((gap as Record<string, unknown>).responsibleRole)}
                          </Badge>
                        ) : null}
                        {(gap as Record<string, unknown>).regulatoryDeadline ? (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {String((gap as Record<string, unknown>).regulatoryDeadline)}
                          </Badge>
                        ) : null}
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
                        <span className="text-secondary">OK</span>
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
              <CardDescription>Address these items to improve your regulatory readiness score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {actionPlan.map((item) => {
                const itemAny = item as Record<string, unknown>
                const responsibleRole = typeof itemAny.responsibleRole === 'string' ? itemAny.responsibleRole : null
                const dependsOn = Array.isArray(itemAny.dependsOn) ? itemAny.dependsOn : []
                return (
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
                        <Badge variant="outline" className="text-xs text-warning border-warning/30">Due {item.deadline}</Badge>
                        {responsibleRole && (
                          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                            <Shield className="h-3 w-3 mr-1" />
                            {responsibleRole}
                          </Badge>
                        )}
                      </div>
                      {dependsOn.length > 0 && (
                        <div className="mt-2 flex items-start gap-1.5">
                          <span className="text-xs text-muted-foreground font-medium shrink-0">Depends on:</span>
                          <div className="flex flex-wrap gap-1">
                            {dependsOn.map((dep, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-muted/80 text-muted-foreground border-border">
                                {String(dep)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.resources?.length > 0 && (
                        <ul className="mt-2 space-y-0.5">
                          {item.resources.map((r, i) => (
                            <li key={i} className="text-xs text-muted-foreground">- {r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pilot Limitations & Feedback */}
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            <strong className="text-foreground">Pilot Notice:</strong> This analysis is AI-assisted compliance guidance grounded in SheriaBot&apos;s authoritative regulatory corpus. It does not constitute formal legal certification. Assessment Coverage reflects only the retrieved regulatory evidence. OCR is not currently supported for scanned documents.
          </p>
        </div>
        <PilotFeedbackWidget analysisId={analysisId} />
      </div>
    </div>
  )
}

// Analysis Progress View

export function AnalysisProgressView({
  documentName,
  frameworks,
  status,
  errorMessage,
  failureClass,
  jurisdictionCode,
  startedAt,
  analysisDepth,
  onBack,
  onRetry,
}: {
  documentName: string
  frameworks: string[]
  status: string
  errorMessage?: string | null
  failureClass?: string | null
  jurisdictionCode?: string | null
  startedAt: number | null
  analysisDepth: GapAnalysisDepth
  onBack: () => void
  onRetry: () => void
}) {
  const [elapsed, setElapsed] = useState(0)
  const isFailed = status === "FAILED" || status === "DEAD_LETTERED"
  const isCancelled = status === "CANCELLED"
  const statusInfo = STATUS_LABELS[status] ?? {
    label: status,
    description: "Processing policy analysis...",
  }
  const stages = [
    "Uploading document",
    "Preparing analysis",
    "Retrieving regulatory evidence",
    "Reviewing policy",
    "Verifying findings",
    "Finalizing results",
  ]

  useEffect(() => {
    if (isFailed || isCancelled || status === "COMPLETED") return
    const start = startedAt ?? Date.now()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isFailed, isCancelled, status, startedAt])

  const formatElapsed = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`

  return (
    <FeatureGate feature="gapAnalysis">
      <div className="space-y-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0 text-muted-foreground">
            {'\u2190'} Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground">Policy Gap Analysis</h1>
            <div className="mt-1 flex min-w-0 items-center gap-2">
              <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{documentName}</p>
              {jurisdictionCode && (
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {jurisdictionLabel(jurisdictionCode as JurisdictionCode)} ({jurisdictionCode})
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Card className="border-border/50">
          <CardContent className="pt-10 pb-10" aria-live="polite" aria-busy={!isFailed && !isCancelled && status !== "COMPLETED"}>
            <div className="max-w-md mx-auto text-center space-y-6">
              {isFailed ? (
                <XCircle className="h-12 w-12 text-destructive mx-auto" />
              ) : isCancelled ? (
                <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
              ) : (
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              )}

              <div>
                <h2 className={`text-xl font-semibold ${isFailed ? "text-destructive" : isCancelled ? "text-warning" : "text-foreground"}`}>
                  {isCancelled ? "Analysis Cancelled" : statusInfo.label}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isFailed
                    ? safeGapAnalysisFailureMessage(errorMessage, failureClass)
                    : isCancelled
                      ? "The analysis was cancelled before completion."
                      : statusInfo.description}
                </p>
              </div>

              {!isFailed && !isCancelled && (
                <>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current stage</span>
                      {startedAt && <span>Elapsed: {formatElapsed(elapsed)}</span>}
                    </div>
                    <ol className="grid gap-2 sm:grid-cols-2" aria-label="Analysis stages">
                      {stages.map((stage) => {
                        const isCurrent = stage === statusInfo.label
                        return (
                          <li key={stage} className={cn(
                            "flex items-center gap-2 rounded-md border px-3 py-2 text-xs",
                            isCurrent ? "border-primary bg-primary/5 font-medium text-foreground" : "border-border text-muted-foreground",
                          )} aria-current={isCurrent ? "step" : undefined}>
                            {isCurrent ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> : <span className="h-2 w-2 rounded-full bg-border" />}
                            {stage}
                          </li>
                        )
                      })}
                    </ol>
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

                  <p className="text-xs text-muted-foreground">Stage changes reflect worker signals; no precise completion percentage is implied. You may leave this page while analysis continues.</p>
                </>
              )}

              {(isFailed || isCancelled) && (
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={onBack}>Back to Form</Button>
                  <Button onClick={onRetry} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run New Analysis
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

// Analysis History Item

export function AnalysisHistoryItem({
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
    createdAt: Date | string
    progress?: number
    jurisdictionCode?: string | null
    results?: any
    regulatoryFrameworks?: unknown
    errorMessage?: string | null
  }
  onView: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const isV2 = analysis.results?.scoringVersion === "v2.0-evidence-backed" || analysis.results?.complianceAlignmentScore !== undefined
  const displayScore = (isV2 && analysis.results?.complianceAlignmentScore !== undefined)
    ? analysis.results.complianceAlignmentScore
    : analysis.overallScore
  const scoreConfig = displayScore != null ? getScoreColor(displayScore) : null
  const isInProgress = !["COMPLETED", "FAILED", "CANCELLED"].includes(analysis.status)
  const frameworkCount = Array.isArray(analysis.regulatoryFrameworks) ? analysis.regulatoryFrameworks.length : 0
  const coverageStatus = analysis.results?.metadata?.coverageStatus ?? analysis.results?.coverageStatus
  const coverageCount = analysis.results?.metadata?.frameworkCoverage
    ? Object.values(analysis.results.metadata.frameworkCoverage as Record<string, { assessedRequirementCount?: number }>)
      .reduce((total, item) => total + (item.assessedRequirementCount ?? 0), 0)
    : null
  const alignmentPresentation = displayScore != null ? getComplianceAlignmentPresentation({
    score: displayScore,
    evidenceBacked: isV2,
    coverageStatus,
    assessedRequirementCount: coverageCount,
  }) : null

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4 sm:items-center">
        {isInProgress ? (
          <Loader2 className="h-8 w-8 text-primary animate-spin shrink-0" />
        ) : (
          <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{analysis.documentName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatGapAnalysisDepth(analysis.analysisDepth)} · {frameworkCount || "Unknown"} framework{frameworkCount === 1 ? "" : "s"} · {new Date(analysis.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}
            {" • "}
            {analysis.jurisdictionCode ? `${jurisdictionLabel(analysis.jurisdictionCode)} (${analysis.jurisdictionCode})` : "Jurisdiction not recorded for this legacy analysis"}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            <Badge
              variant="outline"
              className={`text-xs ${
                analysis.status === "COMPLETED" ? "border-[#0A5C36] text-[#0A5C36]" :
                analysis.status === "FAILED" ? "border-[#B91C1C] text-[#B91C1C]" :
                "border-primary text-primary"
              }`}
            >
              {STATUS_LABELS[analysis.status]?.label ?? analysis.status}
            </Badge>
            {analysis.status === "COMPLETED" && (
              <Badge variant="outline" className="text-[10px] bg-muted/40">
                {isV2 ? "Evidence-based v2" : "Legacy scoring"}
              </Badge>
            )}
            {coverageStatus ? (
              <Badge variant="outline" className="text-[10px] bg-muted/40">
                Assessment Coverage: partial{coverageCount !== null ? ` · ${coverageCount} evaluated` : ""}
              </Badge>
            ) : null}
          </div>
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
          {analysis.status === "FAILED" ? <p className="mt-1 text-xs text-[#B91C1C]">{safeGapAnalysisFailureMessage(analysis.errorMessage)}</p> : null}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {displayScore != null && scoreConfig && alignmentPresentation && (
          <div className="flex flex-col items-center">
            <div className={`h-12 w-12 rounded-full border-4 ${alignmentPresentation.available ? scoreConfig.ring : "border-border"} flex items-center justify-center ${alignmentPresentation.available ? scoreConfig.bg : "bg-muted/40"}`}>
              <span className={`text-xs font-bold ${alignmentPresentation.available ? scoreConfig.text : "text-muted-foreground"}`}>
                {alignmentPresentation.available ? displayScore : "—"}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-center">
              {alignmentPresentation.available ? (isV2 ? "Compliance Alignment" : "Legacy scoring") : "Not assessed"}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={() => onView(analysis.id, analysis.documentName)}
            disabled={analysis.status !== "COMPLETED"}
            aria-label={`View ${analysis.documentName}`}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(analysis.id)}
            aria-label={`Delete ${analysis.documentName}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main Page

export default function GapAnalysisPage() {
  const user = useAuthStore((state) => state.user)
  const currentOrgId = useAuthStore((state) => state.user?.organizationId)
  const prevOrgIdRef = useRef(currentOrgId)
  const { homeJurisdictionCode, enabledJurisdictions, hasFeature, isPilotAccess } = usePlan()

  const entitledJurisdictions = useMemo(() => {
    const list = Array.from(
      new Set(
        [homeJurisdictionCode ?? "KE", ...(enabledJurisdictions ?? [])].filter(
          (code): code is JurisdictionCode => typeof code === "string" && ["KE", "RW", "MW", "NG"].includes(code)
        )
      )
    )
    return list.length > 0 ? list : (["KE"] as JurisdictionCode[])
  }, [homeJurisdictionCode, enabledJurisdictions])

  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionCode>(
    entitledJurisdictions[0] ?? "KE"
  )
  const activeJurisdiction = entitledJurisdictions.includes(selectedJurisdiction)
    ? selectedJurisdiction
    : (entitledJurisdictions[0] ?? "KE")

  const [activeView, setActiveView] = useState<{ id: string; name: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedBenchmarkDocumentIds, setSelectedBenchmarkDocumentIds] = useState<string[]>([])
  const [requestedAnalysisDepth, setRequestedAnalysisDepth] = useState<GapAnalysisDepth | null>(null)
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([])
  const [focusAreasOpen, setFocusAreasOpen] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [frameworkSearch, setFrameworkSearch] = useState("")
  const [historyStatus, setHistoryStatus] = useState("ALL")
  const [historyDepth, setHistoryDepth] = useState("ALL")
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; documentName: string } | null>(null)

  // Async polling state
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null)
  const [isAwaitingResult, setIsAwaitingResult] = useState(false)
  const [analysisStartedAt, setAnalysisStartedAt] = useState<number | null>(null)
  const [pendingDocName, setPendingDocName] = useState<string>("")
  const [pendingFrameworks, setPendingFrameworks] = useState<string[]>([])
  const [pendingAnalysisDepth, setPendingAnalysisDepth] = useState<GapAnalysisDepth>("quick")
  const hasCheckedResumption = useRef(false)
  const trackOpenedRef = useRef(false)

  useEffect(() => {
    if (trackOpenedRef.current) return
    trackOpenedRef.current = true
    trackEvent("gap_analysis_opened")
  }, [])

  const utils = trpc.useUtils()
  const invalidateGapAnalyses: () => void = useCallback(() => {
    void utils.gapAnalysis.getGapAnalyses.invalidate()
  }, [utils])

  const resetForm = useCallback(() => {
    setSelectedFile(null)
    setSelectedFrameworks([])
    setSelectedBenchmarkDocumentIds([])
    setRequestedAnalysisDepth(null)
    setSelectedFocusAreas([])
    setFocusAreasOpen(false)
    setConsentChecked(false)
  }, [])

  // Organization switch isolation: purge active view and reload caches immediately
  useEffect(() => {
    if (prevOrgIdRef.current !== currentOrgId) {
      prevOrgIdRef.current = currentOrgId
      setActiveView(null)
      setActiveAnalysisId(null)
      setIsAwaitingResult(false)
      resetForm()
      invalidateGapAnalyses()
      void utils.gapAnalysis.getFrameworks.invalidate()
      void utils.gapAnalysis.getGapAnalysisLimits.invalidate()
    }
  }, [currentOrgId, invalidateGapAnalyses, resetForm, utils])

  const { data: analyses, isLoading: listLoading, error: listError } = trpc.gapAnalysis.getGapAnalyses.useQuery(
    undefined,
    { enabled: !!user }
  )
  const { data: frameworksData, isLoading: frameworksLoading } = trpc.gapAnalysis.getFrameworks.useQuery(
    { jurisdiction: activeJurisdiction } as any,
    { enabled: !!user }
  )

  const applicableFrameworks = ((frameworksData ?? []) as FrameworkOption[]).filter((fw) => fw.applicable !== false)
  const applicableFrameworkSlugs = new Set(applicableFrameworks.map((framework) => framework.slug))
  const selectedFrameworksForRun = selectedFrameworks.filter((slug) => applicableFrameworkSlugs.has(slug))
  const { data: gapLimits } = trpc.gapAnalysis.getGapAnalysisLimits.useQuery(
    undefined,
    { enabled: !!user }
  )
  const pilotAvailability = (gapLimits as any)?.pilotAvailability as GapAnalysisPilotAvailability | undefined
  const activeJurisdictionAvailability = pilotAvailability?.jurisdictions?.[activeJurisdiction]
  const isJurisdictionPilotEnabled = isPilotJurisdictionEnabled(activeJurisdiction, activeJurisdictionAvailability)
  const isJurisdictionPilotValidated = isPilotJurisdictionValidated(activeJurisdiction, activeJurisdictionAvailability)
  const pilotJurisdictionNotice = getPilotJurisdictionNotice(activeJurisdiction, activeJurisdictionAvailability)
  const areSelectedFrameworksPilotEnabled = selectedFrameworksForRun.length > 0 && selectedFrameworksForRun.every((slug) => {
    const fw = applicableFrameworks.find((f) => f.slug === slug)
    return fw?.pilotEnabled !== false
  })
  const { data: benchmarkDocumentsData, isLoading: benchmarkDocumentsLoading } = trpc.document.listBenchmarkDocuments.useQuery(
    undefined,
    { enabled: !!user && gapLimits?.benchmarkDocuments === true }
  )
  const planAllowedAnalysisDepths = useMemo(
    () => (gapLimits?.allowedDepths ?? []) as GapAnalysisDepth[],
    [gapLimits?.allowedDepths],
  )
  const allowedAnalysisDepths = getAvailableGapAnalysisDepths(
    planAllowedAnalysisDepths,
    (gapLimits as { depthAvailability?: GapAnalysisDepthAvailabilityContract } | undefined)?.depthAvailability,
    activeJurisdiction,
    selectedFrameworksForRun,
  )
  const analysisDepthOptions = useMemo(
    () => (gapLimits?.depthOptions ?? []) as Array<{
      depth: GapAnalysisDepth
      units: number
      label: string
      description: string
      breadth: string
    }>,
    [gapLimits?.depthOptions],
  )
  const uploadContract: GapAnalysisUploadContract | null = gapLimits
    ? {
        maxFileSizeBytes: gapLimits.maxFileSizeBytes,
        allowedFileTypes: gapLimits.allowedFileTypes,
      }
    : null
  const analysisDepth = gapLimits
    ? selectGapAnalysisDepth(requestedAnalysisDepth, allowedAnalysisDepths)
    : null
  const authorizedBenchmarkDocumentIds = gapLimits?.benchmarkDocuments
    ? selectedBenchmarkDocumentIds
    : []

  // Polling query — active only while isAwaitingResult
  // The coordinated backend release exposes this minimal projection before
  // the frontend ships, so the generated contract remains authoritative.
  const pollingQuery = trpc.gapAnalysis.getGapAnalysisStatus.useQuery(
    { id: activeAnalysisId! },
    {
      enabled: !!user && isAwaitingResult && activeAnalysisId !== null,
      refetchInterval: (query: { state: { data?: { status?: string }; error?: unknown } }) => {
        if (query.state.error) return false
        const status = query.state.data?.status
        if (status === "COMPLETED" || status === "FAILED" || status === "CANCELLED" || status === "DEAD_LETTERED") return false
        return 3000
      },
    }
  )
  const pollingStatus = pollingQuery.data?.status
  const pollingId = pollingQuery.data?.id
  const pollingDocumentName = pollingQuery.data?.documentName
  const pollingOverallScore = pollingQuery.data?.overallScore
  const pollingErrorMessage = pollingQuery.data?.errorMessage
  const pollingFrameworkCount = pendingFrameworks.length

  // Transition to results view on COMPLETED
  useEffect(() => {
    if (!isAwaitingResult || !pollingStatus) return
    if (pollingStatus === "COMPLETED" && pollingId && pollingDocumentName) {
      queueMicrotask(() => {
        setIsAwaitingResult(false)
        setActiveView({ id: pollingId, name: pollingDocumentName })
        invalidateGapAnalyses()
        resetForm()
      })
      trackEvent("gap_analysis_completed", {
        framework_count: pollingFrameworkCount,
      })
      trackFeatureUsage({
        feature_name: "gap_analysis",
        status: "completed",
      })
      recordAccountActivation({
        first_feature: "gap_analysis",
      })
      toast.success("Analysis complete", { description: `Compliance Alignment: ${pollingOverallScore ?? "N/A"}/100` })
    }
    if (pollingStatus === "FAILED" || pollingStatus === "DEAD_LETTERED") {
      trackEvent("gap_analysis_failed", { reason: pollingErrorMessage || "unknown_polling_error" })
      trackFeatureUsage({
        feature_name: "gap_analysis",
        status: "failed",
      })
    }
    if (pollingStatus === "CANCELLED") {
      queueMicrotask(() => {
        setIsAwaitingResult(false)
        setActiveAnalysisId(null)
        invalidateGapAnalyses()
      })
      toast.info("Analysis cancelled")
    }
  }, [
    invalidateGapAnalyses,
    isAwaitingResult,
    pollingDocumentName,
    pollingErrorMessage,
    pollingFrameworkCount,
    pollingId,
    pollingOverallScore,
    pollingStatus,
    resetForm,
  ])

  // Page-refresh resumption — detect in-progress analyses on first load
  useEffect(() => {
    if (hasCheckedResumption.current || isAwaitingResult || activeView || !analyses) return
    hasCheckedResumption.current = true
    const inProgress = analyses.find(
      (a: { id: string; documentName: string; status: string }) => !["COMPLETED", "FAILED", "CANCELLED", "DEAD_LETTERED"].includes(a.status)
    )
    if (inProgress) {
      queueMicrotask(() => {
        setActiveAnalysisId(inProgress.id)
        setPendingDocName(inProgress.documentName)
        setPendingFrameworks([])
        setIsAwaitingResult(true)
      })
    }
  }, [analyses, isAwaitingResult, activeView])

  const runMutation = trpc.gapAnalysis.runGapAnalysis.useMutation({
    onSuccess: (data) => {
      // Correctly handle reused executions per contract
      if (data.reused) {
        if (data.status === "COMPLETED") {
          setActiveView({ id: data.id, name: data.documentName })
          setIsAwaitingResult(false)
          invalidateGapAnalyses()
          resetForm()
          toast.info("Existing identical analysis found", {
            description: "Viewing previously completed analysis result.",
          })
          return
        } else {
          setActiveAnalysisId(data.id)
          setIsAwaitingResult(true)
          setPendingDocName(data.documentName)
          setPendingFrameworks([...selectedFrameworksForRun])
          setPendingAnalysisDepth(analysisDepth ?? "quick")
          invalidateGapAnalyses()
          toast.info("Existing identical analysis in progress", {
            description: "Connected to active background execution.",
          })
          return
        }
      }

      setActiveAnalysisId(data.id)
      setIsAwaitingResult(true)
      setAnalysisStartedAt(new Date(data.createdAt).getTime())
      setPendingDocName(selectedFile?.name ?? data.documentName)
      setPendingFrameworks([...selectedFrameworksForRun])
      setPendingAnalysisDepth(analysisDepth ?? "quick")
      utils.gapAnalysis.getGapAnalyses.invalidate()
      toast.success("Analysis queued", { description: "Your document is being processed in the background." })
    },
    onError: (err) => {
      trackEvent("gap_analysis_failed", { reason: err.message || "mutation_error" })
      trackFeatureUsage({
        feature_name: "gap_analysis",
        status: "failed",
      })
      const userMessage = safeGapAnalysisFailureMessage(err.message)
      toast.error("Analysis failed", {
        description: userMessage,
      })
    },
  })

  const deleteMutation = trpc.gapAnalysis.deleteGapAnalysis.useMutation({
    onSuccess: () => {
      toast.success("Analysis deleted")
      utils.gapAnalysis.getGapAnalyses.invalidate()
    },
    onError: (err) => {
      toast.error("Failed to delete", { description: err.message })
    },
  })

  const handleRunAnalysis = async () => {
    if (!selectedFile || selectedFrameworksForRun.length === 0 || !analysisDepth) return
    if (selectedFile.size === 0) {
      toast.error("Document is empty", { description: "Please upload a valid, non-empty policy document." })
      return
    }
    if (!isJurisdictionPilotEnabled) {
      toast.error("Jurisdiction not pilot-enabled", {
        description: pilotJurisdictionNotice ?? `Gap Analysis is not enabled for ${jurisdictionLabel(activeJurisdiction)} during the pilot phase.`,
      })
      return
    }
    if (!areSelectedFrameworksPilotEnabled) {
      toast.error("Framework not pilot-enabled", {
        description: "One or more selected frameworks are not currently enabled for Gap Analysis pilot testing.",
      })
      return
    }

    // Convert file to base64
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1]
      const ext = selectedFile.name.split(".").pop()?.toLowerCase() ?? "pdf"

      trackEvent("gap_analysis_started", { 
        depth: analysisDepth,
        framework_count: selectedFrameworksForRun.length,
        file_type: ext
      })
      trackFeatureUsage({
        feature_name: "gap_analysis",
        status: "started",
      })

      runMutation.mutate(buildGapAnalysisInput({
        fileName: selectedFile.name,
        fileType: ext as "pdf" | "docx" | "txt",
        fileContent: base64,
        regulatoryFrameworks: selectedFrameworksForRun,
        benchmarkDocumentIds: authorizedBenchmarkDocumentIds,
        analysisDepth,
        focusAreas: selectedFocusAreas,
        jurisdiction: activeJurisdiction,
        processingConsentAcknowledged: consentChecked,
        consentVersion: gapLimits?.processingAcknowledgement.version,
      }))
    }
    reader.onerror = () => {
      toast.error("File read error", { description: "Could not read the file. Please try again." })
    }
    reader.readAsDataURL(selectedFile)
  }

  const isRegulator = user?.role === "REGULATOR"
  const isFeatureAllowed = hasFeature("gapAnalysis") || isPilotAccess
  const isLimitsDisabled = gapLimits !== undefined && gapLimits.enabled === false

  // Pilot Gate for unentitled users or regulators
  if (user && isRegulator) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[var(--portal-text-primary)]">Policy Gap Analysis</h1>
          <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">Regulatory Assessment Portal</p>
        </div>
        <Card className="border border-border/60 bg-card p-8 max-w-xl mx-auto text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg">Regulator Access Restriction</CardTitle>
          <CardDescription className="text-sm">
            Regulatory supervisory accounts cannot run gap analyses on client documents. Gap Analysis is designed for fintech and financial institution compliance teams.
          </CardDescription>
        </Card>
      </div>
    )
  }

  if (user && (isLimitsDisabled || !isFeatureAllowed)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[var(--portal-text-primary)]">Policy Gap Analysis</h1>
          <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">Pilot-Restricted Feature</p>
        </div>
        <Card className="border border-border/60 bg-card p-8 max-w-xl mx-auto text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg">Pilot Feature Access Required</CardTitle>
          <CardDescription className="text-sm max-w-md mx-auto">
            Policy Gap Analysis is currently enabled for authorized pilot organizations. If your organization is part of the pilot cohort, please contact your administrator or support to verify entitlement.
          </CardDescription>
          <div className="pt-2">
            <Button variant="outline" asChild>
              <a href="mailto:support@sheriabot.com?subject=Gap%20Analysis%20Pilot%20Access">Contact Pilot Support</a>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const canRun = selectedFile !== null
    && selectedFile.size > 0
    && isJurisdictionPilotEnabled
    && selectedFrameworksForRun.length > 0
    && areSelectedFrameworksPilotEnabled
    && analysisDepth !== null
    && allowedAnalysisDepths.includes(analysisDepth)
    && consentChecked
    && !runMutation.isPending
    && !isAwaitingResult

  // Show async progress view
  if (isAwaitingResult && activeAnalysisId) {
    const pd = pollingQuery.data
    return (
      <AnalysisProgressView
        documentName={pd?.documentName ?? pendingDocName}
        frameworks={pendingFrameworks}
        status={pd?.status ?? "QUEUED"}
        errorMessage={pd?.errorMessage}
        failureClass={(pd as any)?.failureClass}
        jurisdictionCode={activeJurisdiction}
        startedAt={analysisStartedAt}
        analysisDepth={pendingAnalysisDepth}
        onBack={() => {
          setIsAwaitingResult(false)
          setActiveAnalysisId(null)
        }}
        onRetry={() => {
          setIsAwaitingResult(false)
          setActiveAnalysisId(null)
          resetForm()
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

  const analysisHistory = ((analyses ?? []) as unknown) as Array<{
    id: string
    documentName: string
    documentType: string
    overallScore: number | null
    status: string
    analysisDepth: string
    createdAt: string
    progress: number
    jurisdictionCode: string | null
    results?: unknown
    regulatoryFrameworks?: unknown
    errorMessage?: string | null
  }>
  const filteredFrameworks = filterGapAnalysisFrameworks(applicableFrameworks, frameworkSearch)
  const groupedFrameworks = groupGapAnalysisFrameworks(filteredFrameworks)
  const selectedDepthLabel = analysisDepthOptions.find((d) => d.depth === analysisDepth)?.label ?? "Unavailable"
  const selectedDepthUnits = analysisDepthOptions.find((d) => d.depth === analysisDepth)?.units ?? 0
  const missingRunRequirements = getGapAnalysisRunRequirements({
    hasDocument: selectedFile !== null,
    frameworkCount: selectedFrameworksForRun.length,
    hasAllowedDepth: analysisDepth !== null && allowedAnalysisDepths.includes(analysisDepth),
    acknowledgementAccepted: consentChecked,
    jurisdictionPilotEnabled: isJurisdictionPilotEnabled,
    frameworksPilotEnabled: areSelectedFrameworksPilotEnabled,
  })
  const filteredHistory = analysisHistory.filter((analysis) =>
    (historyStatus === "ALL" || analysis.status === historyStatus)
      && (historyDepth === "ALL" || analysis.analysisDepth === historyDepth),
  )
  const legalDocumentOptions: Option[] = (benchmarkDocumentsData?.documents ?? []).map((doc: {
    id: string
    title: string
    source?: string | null
    frameworkSlug?: string | null
    documentType: string
    isGlobal: boolean
  }) => ({
    value: doc.id,
    label: doc.title,
    group: `${doc.isGlobal ? "SheriaBot Legal Corpus" : "Organization Documents"} - ${doc.source ?? doc.frameworkSlug ?? doc.documentType}`,
  }))

  return (
    <FeatureGate feature="gapAnalysis">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold tracking-tight text-[var(--portal-text-primary)]">Policy Gap Analysis</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--portal-text-secondary)]">
            Review internal policies against applicable regulatory requirements using evidence-backed analysis.
          </p>
        </div>
        <Button aria-label="Refresh gap analyses" variant="ghost" size="sm" onClick={() => utils.gapAnalysis.getGapAnalyses.invalidate()} className="shrink-0">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Configuration Panel — single-column unified layout */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">

        {/* ─── Left Column: Document Context + Target ─── */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* Section 1: Source Material — Document Context */}
          <Card className="portal-surface-raised">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-5 w-5 text-primary" />
                1. Policy Document
              </CardTitle>
              <CardDescription className="text-sm text-[var(--portal-text-secondary)]">
                Upload your internal compliance policy, procedure, or framework document.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadSection
                file={selectedFile}
                onFile={(file) => {
                  setSelectedFile(file)
                  trackEvent("gap_analysis_file_uploaded", { file_type: file.name.split('.').pop()?.toLowerCase() || "unknown" })
                }}
                onRemove={() => setSelectedFile(null)}
                uploadContract={uploadContract}
              />
            </CardContent>
          </Card>

          {/* Section 2: Target — Framework & Regional Focus */}
          <Card className="portal-surface-raised">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-primary" />
                2. Jurisdiction &amp; Regulatory Scope
              </CardTitle>
              <CardDescription className="text-sm text-[var(--portal-text-secondary)]">
                Choose one authorized jurisdiction and the applicable frameworks for this review.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Jurisdiction Selection or Read-only Display */}
              {entitledJurisdictions.length > 1 ? (
                <div className="space-y-1.5 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-canvas-subtle)] p-3">
                  <Label htmlFor="jurisdiction-select" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-primary" />
                    Jurisdiction
                  </Label>
                  <select
                    id="jurisdiction-select"
                    value={activeJurisdiction}
                    onChange={(e) => {
                      setSelectedJurisdiction(e.target.value as JurisdictionCode)
                      setSelectedFrameworks([])
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {entitledJurisdictions.map((code) => (
                      <option key={code} value={code}>
                        {jurisdictionLabel(code)} ({code})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[var(--portal-text-muted)]">
                    Your analysis uses regulatory material applicable to this jurisdiction. Run separate analyses for other countries.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-[var(--portal-border)] bg-[var(--portal-canvas-subtle)] px-3 py-2.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-[var(--portal-text-muted)]">Jurisdiction</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-primary" />
                      {jurisdictionLabel(activeJurisdiction)} ({activeJurisdiction})
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-[var(--portal-text-muted)]">
                    Read only
                  </Badge>
                </div>
              )}

              {pilotJurisdictionNotice && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-950">Pilot Corpus Validation In Progress</p>
                    <p className="mt-0.5 text-amber-900 leading-relaxed">{pilotJurisdictionNotice}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <Label htmlFor="framework-search">Regulatory frameworks</Label>
                    <p className="mt-1 text-xs text-[var(--portal-text-muted)]">
                      {applicableFrameworks.length} applicable · {selectedFrameworksForRun.length} selected
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="framework-search"
                      aria-label="Search regulatory frameworks"
                      value={frameworkSearch}
                      onChange={(event) => setFrameworkSearch(event.target.value)}
                      placeholder="Search name, regulator, category"
                      className="pl-9"
                    />
                  </div>
                </div>
                {selectedFrameworksForRun.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5" aria-label={`Selected frameworks (${selectedFrameworksForRun.length})`}>
                    {selectedFrameworksForRun.map((slug) => {
                      const framework = applicableFrameworks.find((item) => item.slug === slug)
                      return <Badge key={slug} variant="secondary" className="max-w-full whitespace-normal break-words text-left">{framework?.name ?? slug}</Badge>
                    })}
                  </div>
                ) : null}
              </div>

              {!isJurisdictionPilotEnabled ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Jurisdiction Not Pilot-Enabled</p>
                  <p className="text-xs mt-1 max-w-md mx-auto">
                    {pilotJurisdictionNotice || `Regulatory frameworks for ${jurisdictionLabel(activeJurisdiction)} are currently undergoing pilot validation.`}
                  </p>
                </div>
              ) : frameworksLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-3/4" />
                </div>
              ) : groupedFrameworks.length > 0 ? (
                <div className="space-y-5">
                  {groupedFrameworks.map(([category, fws]) => (
                    <details key={category} className="group space-y-2" open>
                      <summary className="cursor-pointer rounded-md py-1 text-xs font-medium uppercase tracking-wide text-[var(--portal-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {category} ({fws.length})
                      </summary>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {fws.map((fw: FrameworkOption) => {
                          const isSelected = selectedFrameworksForRun.includes(fw.slug)
                          if (fw.locked) {
                            return (
                              <div
                                key={fw.slug}
                                title={`Upgrade to ${fw.tier.charAt(0) + fw.tier.slice(1).toLowerCase()} to access`}
                                className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 text-left text-sm text-muted-foreground cursor-not-allowed select-none"
                              >
                                <span className="leading-snug">{fw.name}</span>
                                <Lock className="h-3.5 w-3.5 shrink-0" />
                              </div>
                            )
                          }
                          if (fw.pilotEnabled === false) {
                            return (
                              <div
                                key={fw.slug}
                                title="This framework is catalogued but not enabled for Gap Analysis pilot testing"
                                className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-muted/20 px-3 py-2 text-left text-sm text-muted-foreground cursor-not-allowed select-none border border-dashed border-border/50"
                              >
                                <span className="leading-snug">
                                  {fw.name}
                                  <span className="mt-0.5 block text-[10px] text-muted-foreground/80">Pilot validation pending</span>
                                </span>
                                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                  Pilot pending
                                </Badge>
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
                              aria-pressed={isSelected}
                              aria-describedby={fw.description ? `framework-${fw.slug}-description` : undefined}
                              className={cn(
                                "flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150",
                                isSelected
                                  ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
                                  : "bg-muted/30 text-foreground hover:bg-muted/60"
                              )}
                            >
                              <span className="leading-snug">
                                {fw.name}
                                {fw.description ? <span id={`framework-${fw.slug}-description`} className="mt-0.5 block text-[11px] font-normal opacity-80">{fw.description}</span> : null}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {fw.scope === "INTERNATIONAL" && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-500/30 text-blue-600 bg-blue-50/50">
                                    International
                                  </Badge>
                                )}
                                {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--portal-text-secondary)]">
                  {frameworkSearch ? "No frameworks match your search." : "No frameworks are applicable to this jurisdiction."}
                </p>
              )}
              {selectedFrameworksForRun.length === 0 && !frameworksLoading && (
                <p className="text-xs text-[var(--portal-text-muted)]">
                  Select at least one framework to analyse against.
                </p>
              )}

              {/* Subtle divider */}
              <div className="border-b border-[var(--portal-divider)]" />

              {/* Optional focus areas */}
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium text-foreground">Benchmark Documents <span className="text-xs font-normal text-[var(--portal-text-muted)]">(optional)</span></Label>
                  <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">Select the legal or regulatory documents SheriaBot should use as benchmarks for this analysis.</p>
                </div>
                {!gapLimits ? (
                  <div className="rounded-lg border border-[var(--portal-border)] bg-[var(--portal-canvas-subtle)] px-3 py-2 text-sm text-[var(--portal-text-secondary)]">
                    Loading benchmark access...
                  </div>
                ) : gapLimits.benchmarkDocuments ? (
                  <MultiSelect
                    options={legalDocumentOptions}
                    selected={selectedBenchmarkDocumentIds}
                    onChange={(next) => setSelectedBenchmarkDocumentIds(next.slice(0, 10))}
                    placeholder={benchmarkDocumentsLoading ? "Loading benchmark documents..." : "Select benchmark documents"}
                    emptyText="No benchmark documents available."
                    disabled={benchmarkDocumentsLoading || legalDocumentOptions.length === 0}
                    className="border-[var(--portal-border-strong)] bg-[var(--portal-surface)] text-left text-[var(--portal-text-primary)] hover:bg-[var(--portal-surface-hover)] hover:text-[var(--portal-text-primary)] disabled:bg-[var(--portal-surface-solid)]"
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-canvas-subtle)] px-3 py-2 text-sm text-[var(--portal-text-secondary)]">
                    <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Benchmark documents require the Business plan or higher.
                  </div>
                )}
                {gapLimits?.benchmarkDocuments && selectedBenchmarkDocumentIds.length > 0 ? (
                  <p className="text-xs text-[var(--portal-text-muted)]">
                    {selectedBenchmarkDocumentIds.length} benchmark document{selectedBenchmarkDocumentIds.length > 1 ? "s" : ""} selected.
                  </p>
                ) : null}
              </div>

              <div className="border-b border-[var(--portal-divider)]" />

              <div>
                <button
                  type="button"
                  onClick={() => setFocusAreasOpen(!focusAreasOpen)}
                  className="flex w-full items-center justify-between gap-3"
                >
                  <div>
                    <Label className="cursor-pointer text-sm font-medium text-foreground">Focus Areas <span className="text-xs font-normal text-[var(--portal-text-muted)]">(optional)</span></Label>
                    <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">Narrow the review to selected compliance topics. The default is all applicable areas.</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedFocusAreas.length > 0 && (
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        {selectedFocusAreas.length}
                      </Badge>
                    )}
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", focusAreasOpen && "rotate-180")} />
                  </div>
                </button>
                {focusAreasOpen && (
                  <div className="grid gap-2 pt-4 sm:grid-cols-2">
                    {FOCUS_AREAS.map((area) => {
                      const isSelected = selectedFocusAreas.includes(area)
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() =>
                            setSelectedFocusAreas((prev) =>
                              prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
                            )
                          }
                          className={cn(
                            "flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition-all duration-150",
                            isSelected
                              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                          )}
                        >
                          <span>{area}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Right Column: Parameters + CTA ─── */}
        <Card className="portal-surface-raised flex flex-col xl:sticky xl:top-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analysis Summary
            </CardTitle>
            <CardDescription className="text-sm text-[var(--portal-text-secondary)]">
              Review what will run and the usage required before you submit.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col space-y-6">
            {/* Analysis Depth — Segmented Control */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-foreground">3. Analysis Method</Label>
                <p className="mt-1 text-sm text-[var(--portal-text-secondary)]">Choose the review procedure before spending usage units.</p>
              </div>
              <div className="grid gap-2" role="radiogroup" aria-label="Analysis method">
                {analysisDepthOptions.map((d) => {
                  const isAllowed = allowedAnalysisDepths.includes(d.depth)
                  return (
                    <button
                      key={d.depth}
                      type="button"
                      onClick={() => setRequestedAnalysisDepth(d.depth)}
                      role="radio"
                      aria-checked={analysisDepth === d.depth}
                      aria-disabled={!isAllowed}
                      disabled={!isAllowed}
                      title={isAllowed ? undefined : d.depth === "deep" ? "Deep Analysis remains gated until this framework passes quality and runtime validation" : "Not available for the selected plan and frameworks"}
                      className={cn(
                        "rounded-md border px-3 py-3 text-left text-sm font-medium transition-colors",
                        analysisDepth === d.depth
                          ? "border-[var(--portal-accent-border)] bg-[var(--portal-surface)] text-[#0A5C36] shadow-[var(--portal-shadow-sm)]"
                          : isAllowed
                            ? "border-transparent text-[var(--portal-text-secondary)] hover:bg-[var(--portal-surface-hover)] hover:text-[var(--portal-text-primary)]"
                            : "cursor-not-allowed border-transparent text-[var(--portal-text-muted)] opacity-60"
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1">
                          {!isAllowed ? <Lock className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                          {d.label}
                        </span>
                        {d.depth === "standard" ? <Badge variant="secondary">Recommended</Badge> : null}
                      </span>
                      <span className="mt-1 block text-xs font-normal text-[var(--portal-text-secondary)]">{d.description}</span>
                      <span className="mt-1 block text-[10px] font-normal text-[var(--portal-text-muted)]">{d.units} unit{d.units === 1 ? "" : "s"} · {d.breadth}</span>
                      {!isAllowed ? <span className="sr-only"> Not available for the selected plan and frameworks.</span> : null}
                    </button>
                  )
                })}
              </div>
              {analysisDepth === null ? <p className="text-sm text-destructive">No analysis method is available on the current plan.</p> : null}
            </div>

            {/* Subtle divider */}
            <div className="border-b border-[var(--portal-divider)]" />

            {/* Scope Summary */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">4. Review &amp; Run</Label>
              <div className="overflow-hidden rounded-lg border border-[var(--portal-border)] bg-[var(--portal-canvas-subtle)] px-4">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--portal-divider)] py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Document</span>
                  <span className="max-w-[12rem] truncate text-sm font-medium text-foreground">{selectedFile?.name ?? "Not uploaded"}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[var(--portal-divider)] py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Jurisdiction</span>
                  <span className="text-sm font-medium text-foreground">
                    {jurisdictionLabel(activeJurisdiction)} ({activeJurisdiction})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[var(--portal-divider)] py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Frameworks</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedFrameworksForRun.length > 0 ? `${selectedFrameworksForRun.length} selected` : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[var(--portal-divider)] py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Depth</span>
                  <span className="text-sm font-medium text-foreground">{selectedDepthLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[var(--portal-divider)] py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Focus Areas</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedFocusAreas.length > 0 ? `${selectedFocusAreas.length} areas` : "All areas"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Benchmark Documents</span>
                  <span className="text-sm font-medium text-foreground">
                    {!gapLimits?.benchmarkDocuments
                      ? "Not available"
                      : selectedBenchmarkDocumentIds.length > 0
                        ? `${selectedBenchmarkDocumentIds.length} selected`
                        : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[var(--portal-divider)] py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Usage</span>
                  <span className="text-sm font-semibold text-foreground">{selectedDepthUnits} unit{selectedDepthUnits === 1 ? "" : "s"}</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-[var(--portal-text-secondary)]">Assessment approach</span>
                  <span className="text-right text-sm font-medium text-foreground">Evidence-backed v2</span>
                </div>
              </div>
            </div>

            {/* Spacer to push CTA to bottom */}
            <div className="flex-1" />

            {/* Subtle divider before CTA */}
            <div className="border-b border-[var(--portal-divider)]" />

            {/* Cross-border data processing consent — inline */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                aria-label="Acknowledge Gap Analysis document processing"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer"
              />
              <span className="text-sm leading-relaxed text-[var(--portal-text-secondary)]">
                {gapLimits?.processingAcknowledgement.text ?? "Loading the current processing acknowledgement..."}
              </span>
            </label>

            {/* Status messaging */}
            {!canRun && missingRunRequirements.length > 0 && (
              <div id="gap-analysis-run-requirements" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <p className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4 shrink-0" />Before you run</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {missingRunRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
                </ul>
              </div>
            )}
            {canRun && (
              <div className="flex min-w-0 items-center gap-2 text-sm text-secondary">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  Ready: {selectedFile?.name} against {selectedFrameworksForRun.length} framework{selectedFrameworksForRun.length > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* CTA — Run Analysis, anchored at bottom, full-width */}
            {runMutation.isPending ? (
              <div className="flex items-center justify-center gap-3 py-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Uploading document...</p>
              </div>
            ) : (
              <LoadingButton
                onClick={handleRunAnalysis}
                disabled={!canRun}
                aria-describedby={!canRun ? "gap-analysis-run-requirements" : undefined}
                loading={runMutation.isPending}
                loadingText="Uploading..."
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Run Gap Analysis
              </LoadingButton>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis History */}
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Analysis History</h2>
            <p className="text-sm text-muted-foreground">A record of active, completed, failed, and cancelled assessments.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Label className="sr-only" htmlFor="history-status">Filter history by status</Label>
            <select id="history-status" value={historyStatus} onChange={(event) => setHistoryStatus(event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="ALL">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="ANALYZING">Active</option>
            </select>
            <Label className="sr-only" htmlFor="history-depth">Filter history by depth</Label>
            <select id="history-depth" value={historyDepth} onChange={(event) => setHistoryDepth(event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="ALL">All methods</option>
              <option value="quick">Quick Scan</option>
              <option value="standard">Standard Analysis</option>
              <option value="deep">Deep Analysis</option>
            </select>
          </div>
        </div>

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

        {!listLoading && !listError && analysisHistory.length > 0 && filteredHistory.length === 0 && (
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No analyses match these filters.</CardContent></Card>
        )}

        {!listLoading && !listError && filteredHistory.length > 0 && (
          <div className="space-y-3">
            {filteredHistory.map((analysis: {
              id: string
              documentName: string
              documentType: string
              overallScore: number | null
              status: string
              analysisDepth: string
              createdAt: string
              progress: number
              jurisdictionCode?: string | null
              results?: unknown
              regulatoryFrameworks?: unknown
              errorMessage?: string | null
            }) => (
              <AnalysisHistoryItem
                key={analysis.id}
                analysis={analysis}
                onView={(id, name) => setActiveView({ id, name })}
                onDelete={(id) => setDeleteCandidate({ id, documentName: analysis.documentName })}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteCandidate !== null} onOpenChange={(open) => { if (!open) setDeleteCandidate(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete analysis?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {deleteCandidate?.documentName ?? "this analysis"} and its stored source/report artifacts? Content-free security and audit records may be retained where required.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep analysis</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteCandidate) deleteMutation.mutate({ id: deleteCandidate.id })
                setDeleteCandidate(null)
              }}
            >
              Delete analysis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disclaimer */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This gap analysis is AI-generated guidance grounded in the selected jurisdiction&apos;s regulations.
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
