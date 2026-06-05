"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ComplianceFeedback } from "@/components/compliance/compliance-feedback"
import { getErrorMessage } from "@/lib/trpc"
import {
  useEnterprisePolicy,
  useEnterprisePolicyStatus,
} from "@/hooks/use-enterprise-policies"
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
} from "lucide-react"

type GeneratedPolicySection = {
  id: string
  title: string
  contentMarkdown?: string
  status?: string
  wordCount?: number
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
    actName: string
    section: string
    textSnippet: string
    verified: boolean
  }>
}

function sectionList(value: unknown): GeneratedPolicySection[] {
  return Array.isArray(value) ? (value as GeneratedPolicySection[]) : []
}

function buildDisplayContent(policy: GeneratedPolicyRecord, sections: GeneratedPolicySection[]) {
  const body = sections
    .map((section) => section.contentMarkdown ? `## ${section.title}\n\n${section.contentMarkdown}` : null)
    .filter(Boolean)
    .join("\n\n")

  return [
    policy.executiveSummary ? `## Executive Summary\n\n${policy.executiveSummary}` : null,
    body || null,
  ].filter(Boolean).join("\n\n")
}

function PolicyViewerContent() {
  const params = useParams()
  const policyId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? ""

  const { data, isLoading, isError, error } = useEnterprisePolicy(policyId)
  const { data: statusData } = useEnterprisePolicyStatus(policyId, !!data && data.status !== "COMPLETED" && data.status !== "FAILED")
  const policy = data as GeneratedPolicyRecord | undefined
  const sections = sectionList(policy?.sections)
  const content = policy ? buildDisplayContent(policy, sections) : ""
  const status = statusData?.status ?? policy?.status ?? "INITIALIZING"
  const progress = statusData?.progress ?? policy?.progress ?? 0
  const isComplete = status === "COMPLETED"
  const isFailed = status === "FAILED"
  const isGenerating = !isComplete && !isFailed && status !== "ARCHIVED"

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
            <span>{new Date(policy.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="bg-transparent" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export coming soon
          </Button>
        </div>
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
              {isComplete ? "Generation is complete and ready for review." : "Generation is running. This page refreshes status automatically."}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Policy Draft
            </CardTitle>
            <CardDescription>
              Read-only generated content. Rich editing and completed export are separate future workflow items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {content ? (
              <ComplianceFeedback content={content} variant="report" collapsible />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No generated policy content is available yet.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Legal Citations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {policy.citations && policy.citations.length > 0 ? policy.citations.map((citation) => (
                <div key={citation.id} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-sm font-medium text-foreground">{citation.actName}</p>
                  {citation.section ? <p className="mt-1 text-xs text-primary">{citation.section}</p> : null}
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{citation.textSnippet}</p>
                  {citation.verified ? <Badge variant="outline" className="mt-2">Verified</Badge> : null}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No citation records are attached to this policy yet.</p>
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
