"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getErrorMessage } from "@/lib/trpc"
import {
  useEnterprisePolicy,
  useEnterprisePolicyActions,
  useEnterprisePolicyStatus,
  useEnterprisePolicyVersionHistory,
} from "@/hooks/use-enterprise-policies"
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  History,
  Loader2,
  Pencil,
  Save,
  X,
} from "lucide-react"

type SectionStatus = "DRAFT" | "REVIEWED" | "APPROVED" | "NEEDS_REVISION"

type GeneratedPolicySection = {
  id: string
  title: string
  content?: unknown
  contentMarkdown?: string
  status?: string
  wordCount?: number
  editedAt?: string
  editedByUserId?: string
}

type GeneratedPolicyRecord = {
  id: string
  title: string
  description?: string | null
  policyType: string
  status: string
  progress: number
  version: number
  regulatoryFrameworks: string[]
  jurisdiction: string
  createdAt: Date | string
  completedAt?: Date | string | null
  executiveSummary?: string | null
  reviewNotes?: string | null
  sections?: unknown
  errorMessage?: string | null
  citations?: Array<{
    id: string
    sectionId: string
    actName: string
    section: string
    textSnippet: string
    verified: boolean
    citationVerified?: boolean | null
    confidence?: string
  }>
}

const SECTION_STATUSES: Array<{ value: SectionStatus; label: string }> = [
  { value: "DRAFT", label: "Draft" },
  { value: "REVIEWED", label: "Reviewed" },
  { value: "APPROVED", label: "Approved" },
  { value: "NEEDS_REVISION", label: "Needs revision" },
]

function sectionList(value: unknown): GeneratedPolicySection[] {
  return Array.isArray(value) ? (value as GeneratedPolicySection[]) : []
}

function readableStatus(value?: string) {
  return (value ?? "DRAFT").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

function sectionMarkdown(section?: GeneratedPolicySection) {
  if (!section) return ""
  if (section.contentMarkdown) return section.contentMarkdown
  if (typeof section.content === "string") return section.content
  return ""
}

function PolicyViewerContent() {
  const params = useParams()
  const policyId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? ""

  const { data, isLoading, isError, error } = useEnterprisePolicy(policyId)
  const policy = data as GeneratedPolicyRecord | undefined
  const sections = useMemo(() => sectionList(policy?.sections), [policy?.sections])
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const activeSection = sections.find((section) => section.id === (activeSectionId ?? sections[0]?.id)) ?? sections[0]
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [draftContent, setDraftContent] = useState("")

  const { data: statusData } = useEnterprisePolicyStatus(policyId, !!data && data.status !== "COMPLETED" && data.status !== "FAILED")
  const { data: history = [] } = useEnterprisePolicyVersionHistory(policyId, !!policyId)
  const {
    exportPolicy,
    isExporting,
    updateSectionContent,
    isUpdatingSectionContent,
    updateSectionStatus,
    isUpdatingSectionStatus,
  } = useEnterprisePolicyActions()

  const status = statusData?.status ?? policy?.status ?? "INITIALIZING"
  const progress = statusData?.progress ?? policy?.progress ?? 0
  const isComplete = status === "COMPLETED"
  const isFailed = status === "FAILED"
  const isGenerating = !isComplete && !isFailed && status !== "ARCHIVED"
  const canEdit = isComplete
  const canExport = isComplete && sections.length > 0
  const activeCitations = (policy?.citations ?? []).filter((citation) => citation.sectionId === activeSection?.id)
  const isDirty = editingSectionId === activeSection?.id && draftContent !== sectionMarkdown(activeSection)

  async function handleExportDocx() {
    try {
      const result = await exportPolicy({ policyId, format: "DOCX" })
      const link = document.createElement("a")
      link.href = result.downloadUrl
      link.download = result.filename
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("DOCX export is ready")
    } catch (err) {
      toast.error("Export failed", { description: getErrorMessage(err) })
    }
  }

  function startEditing(section: GeneratedPolicySection) {
    setEditingSectionId(section.id)
    setDraftContent(sectionMarkdown(section))
  }

  function cancelEditing() {
    setEditingSectionId(null)
    setDraftContent("")
  }

  async function saveSection() {
    if (!activeSection) return
    try {
      await updateSectionContent({
        policyId,
        sectionId: activeSection.id,
        content: draftContent,
        contentMarkdown: draftContent,
      })
      toast.success("Section saved")
      cancelEditing()
    } catch (err) {
      toast.error("Section save failed", { description: getErrorMessage(err) })
    }
  }

  async function saveSectionStatus(nextStatus: SectionStatus) {
    if (!activeSection) return
    try {
      await updateSectionStatus({ policyId, sectionId: activeSection.id, status: nextStatus })
      toast.success("Section status updated")
    } catch (err) {
      toast.error("Status update failed", { description: getErrorMessage(err) })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-[420px] w-full rounded-lg" />
      </div>
    )
  }

  if (isError || !policy) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/regulator/policy-generator/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/regulator/policy-generator/history" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{policy.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant={isComplete ? "outline" : "secondary"} className={isFailed ? "border-destructive/50 text-destructive" : "border-secondary/50 text-secondary"}>
              {isGenerating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : isFailed ? <AlertCircle className="mr-1 h-3 w-3" /> : <CheckCircle2 className="mr-1 h-3 w-3" />}
              {status.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline">Version {policy.version}</Badge>
            <Badge variant="outline">{policy.policyType.replace(/_/g, " ")}</Badge>
            <Badge variant="outline">{policy.jurisdiction}</Badge>
            <span>{new Date(policy.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-transparent" disabled={!canExport || isExporting} onClick={handleExportDocx}>
          {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {isExporting ? "Exporting..." : "Export DOCX"}
        </Button>
      </div>

      <Card className="border-border/50 bg-muted/30">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">{statusData?.currentStage ?? status.replace(/_/g, " ")}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
          {isFailed ? (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {statusData?.errorMessage ?? policy.errorMessage ?? "Policy generation failed."}
            </p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {isComplete ? "Generation is complete and ready for review, editing, and DOCX export." : "Generation is running. This page refreshes status automatically."}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[260px_1fr_340px]">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.length ? sections.map((section) => {
              const active = section.id === activeSection?.id
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${active ? "border-primary bg-primary/10 text-foreground" : "border-border/50 bg-background text-muted-foreground hover:text-foreground"}`}
                  onClick={() => {
                    if (!isDirty || window.confirm("Discard unsaved section changes?")) {
                      setActiveSectionId(section.id)
                      cancelEditing()
                    }
                  }}
                >
                  <span className="line-clamp-2 font-medium">{section.title}</span>
                  <span className="mt-1 block text-xs">{readableStatus(section.status)}</span>
                </button>
              )
            }) : (
              <p className="text-sm text-muted-foreground">No generated sections are available yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {policy.executiveSummary ?? "No executive summary was generated for this policy."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{activeSection?.title ?? "Policy Section"}</CardTitle>
                <CardDescription>
                  {activeSection?.editedAt ? `Last edited ${new Date(activeSection.editedAt).toLocaleString("en-KE")}` : "Generated section content"}
                </CardDescription>
              </div>
              {activeSection ? (
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={(activeSection.status ?? "DRAFT") as SectionStatus}
                    onValueChange={(value) => saveSectionStatus(value as SectionStatus)}
                    disabled={!canEdit || isUpdatingSectionStatus}
                  >
                    <SelectTrigger className="h-9 w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTION_STATUSES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {editingSectionId === activeSection.id ? (
                    <>
                      <Button size="sm" variant="outline" onClick={cancelEditing} disabled={isUpdatingSectionContent}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveSection} disabled={!isDirty || isUpdatingSectionContent}>
                        {isUpdatingSectionContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => startEditing(activeSection)} disabled={!canEdit}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              ) : null}
            </CardHeader>
            <CardContent>
              {activeSection ? (
                editingSectionId === activeSection.id ? (
                  <Textarea
                    value={draftContent}
                    onChange={(event) => setDraftContent(event.target.value)}
                    className="min-h-[360px] resize-y font-mono text-sm leading-6"
                  />
                ) : (
                  <div className="whitespace-pre-wrap rounded-md border border-border/50 bg-muted/20 p-4 text-sm leading-7 text-foreground">
                    {sectionMarkdown(activeSection) || "No content recorded for this section."}
                  </div>
                )
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">No generated policy content is available yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Section Citations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCitations.length > 0 ? activeCitations.map((citation) => (
                <div key={citation.id} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-sm font-medium text-foreground">{citation.actName}</p>
                  {citation.section ? <p className="mt-1 text-xs text-primary">{citation.section}</p> : null}
                  <p className="mt-1 line-clamp-4 text-xs text-muted-foreground">{citation.textSnippet}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {citation.confidence ? <Badge variant="outline">{readableStatus(citation.confidence)}</Badge> : null}
                    {citation.verified || citation.citationVerified ? <Badge variant="outline">Verified</Badge> : null}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No citations recorded for this section.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Review Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {policy.reviewNotes ? (
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{policy.reviewNotes}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No review notes are available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4 text-primary" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.length ? history.map((item) => (
                <div key={item.id} className="rounded-md border border-border/50 p-3 text-sm">
                  <p className="font-medium text-foreground">{item.sectionTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    v{item.version} by {item.editedByName} on {new Date(item.createdAt).toLocaleString("en-KE")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {readableStatus(item.previousStatus ?? "DRAFT")} to {readableStatus(item.newStatus ?? "DRAFT")}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No section edits have been recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PolicyViewerPage() {
  return (
    <FeatureGate
      feature="policyGeneration"
      fallback={(
        <LockedFeatureCard
          feature="policyGeneration"
          requiredPlan="ENTERPRISE"
          title="AI Policy Generator is available on Enterprise plans."
          description="Generate structured compliance policies grounded in SheriaBot's legal corpus, with citations and review support."
        />
      )}
    >
      <PolicyViewerContent />
    </FeatureGate>
  )
}
