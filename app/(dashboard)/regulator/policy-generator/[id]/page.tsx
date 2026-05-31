"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComplianceFeedback } from "@/components/compliance/compliance-feedback"
import { getErrorMessage } from "@/lib/trpc"
import { usePolicy, usePolicyActions } from "@/hooks/use-policies"
import { toast } from "sonner"
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react"

type PolicyRecord = {
  id: string
  title: string | null
  scenario: string
  content: string | null
  executiveSummary?: string | null
  analysis?: string | null
  status: string
  version: number
  regulatoryAreas: string[]
  createdAt: Date | string
  citations?: Array<{
    id: string
    actName: string
    section: string
    textSnippet: string
    verified: boolean
  }>
}

function buildDisplayContent(policy: PolicyRecord) {
  return [
    policy.executiveSummary ? `## Executive Summary\n\n${policy.executiveSummary}` : null,
    policy.analysis ? `## Regulatory Analysis\n\n${policy.analysis}` : null,
    policy.content,
  ].filter(Boolean).join("\n\n")
}

export default function PolicyViewerPage() {
  const params = useParams()
  const router = useRouter()
  const policyId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? ""
  const [copied, setCopied] = useState(false)
  const [refinementInstructions, setRefinementInstructions] = useState("")

  const { data, isLoading, isError, error } = usePolicy(policyId)
  const { exportPolicy, isExporting, refine, isRefining } = usePolicyActions()
  const policy = data as PolicyRecord | undefined
  const content = policy ? buildDisplayContent(policy) : ""
  const canUseContent = !!content.trim() && policy?.status === "COMPLETED"

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = async (format: "DOCX" | "PDF" | "MD") => {
    try {
      const result = await exportPolicy({ id: policyId, format })
      const link = document.createElement("a")
      link.href = result.downloadUrl
      link.download = result.filename ?? `SheriaBot_Policy.${format.toLowerCase()}`
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("Policy export ready", {
        description: `${result.filename ?? "Your policy"} is downloading.`,
      })
    } catch (err) {
      toast.error("Export failed", { description: getErrorMessage(err) })
    }
  }

  const handleRefine = async () => {
    const instructions = refinementInstructions.trim()
    if (instructions.length < 10) {
      toast.error("Add more detail", { description: "Refinement instructions must be at least 10 characters." })
      return
    }

    try {
      const result = await refine({ id: policyId, refinementInstructions: instructions })
      toast.success("Policy refined", { description: "A new policy version has been created." })
      setRefinementInstructions("")
      if (result.policyId) router.push(`/regulator/policy-generator/${result.policyId}`)
    } catch (err) {
      toast.error("Refinement failed", { description: getErrorMessage(err) })
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
          <h1 className="text-2xl font-bold text-foreground">{policy.title ?? "Untitled policy"}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant={policy.status === "COMPLETED" ? "outline" : "secondary"} className="border-secondary/50 text-secondary">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {policy.status.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline">Version {policy.version}</Badge>
            <span>{new Date(policy.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="bg-transparent" disabled={!content}>
            {copied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent" onClick={() => void handleExport("DOCX")} disabled={isExporting || !canUseContent}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            DOCX
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent" onClick={() => void handleExport("PDF")} disabled={isExporting || !canUseContent}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent" onClick={() => void handleExport("MD")} disabled={isExporting || !canUseContent}>
            <Download className="mr-2 h-4 w-4" />
            MD
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Scenario:</span> {policy.scenario}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Policy Document
            </CardTitle>
            {!canUseContent ? (
              <CardDescription>
                This policy is not ready for export or refinement until generation completes.
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            {content ? (
              <Tabs defaultValue="preview">
                <TabsList className="mb-4">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <ComplianceFeedback content={content} variant="report" collapsible />
                </TabsContent>
                <TabsContent value="markdown">
                  <pre className="max-h-[620px] overflow-auto rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                    {content}
                  </pre>
                </TabsContent>
              </Tabs>
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
                  {citation.section ? <p className="mt-1 text-xs text-primary">Section {citation.section}</p> : null}
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{citation.textSnippet}</p>
                  {citation.verified ? <Badge variant="outline" className="mt-2">Verified</Badge> : null}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No citation records are attached to this policy.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RefreshCw className="h-4 w-4 text-primary" />
                Refine Policy
              </CardTitle>
              <CardDescription>Create a new version using targeted instructions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={refinementInstructions}
                onChange={(event) => setRefinementInstructions(event.target.value)}
                placeholder="e.g. Add a section for incident reporting timelines and strengthen the board oversight obligations."
                className="min-h-[130px] bg-muted/50"
                maxLength={1000}
                disabled={!canUseContent || isRefining}
              />
              <Button className="w-full" onClick={() => void handleRefine()} disabled={!canUseContent || isRefining}>
                {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {isRefining ? "Refining..." : "Create Refined Version"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
