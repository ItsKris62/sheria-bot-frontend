"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Clock,
  FileText,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  MessageSquare,
  BookOpen,
  Scale,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react"
import { ComplianceFeedback } from "@/components/compliance/compliance-feedback"
import { RelatedTopics } from "@/components/compliance/related-topics"
import { SourcesList } from "@/components/compliance/sources-list"
import type { CitationItem } from "@/hooks/use-compliance"
import {
  isRegulatoryArea,
  REGULATORY_AREA_NAMES,
  type RegulatoryArea,
} from "@/lib/compliance/compliance.types"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { toast } from "sonner"

// ---------------------------------------------------------------------------
// Full-page skeleton
// ---------------------------------------------------------------------------
function QueryDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Question card skeleton */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
          </Card>

          {/* Response card skeleton */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <div className="mt-6">
                <Separator className="my-6" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up card skeleton */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Skeleton className="h-6 w-44 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full rounded-md mb-4" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Skeleton className="h-5 w-40 mb-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full rounded-lg mb-2" />
              <Skeleton className="h-16 w-full rounded-lg mb-2" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-1" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-22 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-4">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
type FollowUpEntry = {
  id: string
  question: string
  answer: string | null
  citations: CitationItem[]
  isLoading: boolean
  createdAt?: Date | string
}

function FollowUpSourcesDisclosure({ citations }: { citations: CitationItem[] }) {
  const [open, setOpen] = useState(false)

  if (citations.length === 0) return null

  return (
    <div className="mt-4">
      <Button variant="outline" size="sm" onClick={() => setOpen((value) => !value)}>
        Sources ({citations.length})
      </Button>
      {open ? (
        <div className="mt-3 rounded-lg border border-border/50 bg-background/60 p-3">
          <SourcesList citations={citations} />
        </div>
      ) : null}
    </div>
  )
}

function validateFollowUpQuestion(question: string): string | null {
  if (question.length < 10) return "Follow-up question must be at least 10 characters."
  if (question.length > 1000) return "Follow-up question must be 1,000 characters or fewer."
  return null
}

export default function QueryDetailPage() {
  const params = useParams()
  const rawQueryId = params.queryId
  const queryId = (Array.isArray(rawQueryId) ? rawQueryId[0] : rawQueryId) ?? ""

  const [followUpQuestion, setFollowUpQuestion] = useState("")
  const [followUpError, setFollowUpError] = useState<string | null>(null)
  const [followUps, setFollowUps] = useState<FollowUpEntry[]>([])
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const followUpTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const utils = trpc.useUtils()

  const {
    data: queryRecord,
    isLoading,
    isError,
    error,
  } = trpc.compliance.get.useQuery({ id: queryId })

  const { data: feedbackStatus } = trpc.compliance.getFeedbackStatus.useQuery(
    { queryId },
    { enabled: !!queryId },
  )
  const { data: savedStatus } = trpc.compliance.getSavedStatus.useQuery(
    { queryId },
    { enabled: !!queryId },
  )
  const { data: persistedFollowUps } = trpc.compliance.getFollowUps.useQuery(
    { originalQueryId: queryId },
    { enabled: !!queryId },
  )
  const feedbackMutation = trpc.compliance.submitFeedback.useMutation()
  const saveMutation = trpc.compliance.toggleSave.useMutation()
  const followUpMutation = trpc.compliance.followUp.useMutation()
  const exportMutation = trpc.compliance.exportQueryDocx.useMutation()

  useEffect(() => {
    setFeedback(feedbackStatus?.rating ?? null)
  }, [feedbackStatus?.rating])

  useEffect(() => {
    setSaved(savedStatus?.saved ?? false)
  }, [savedStatus?.saved])

  useEffect(() => {
    const persisted = Array.isArray(persistedFollowUps?.followUps)
      ? persistedFollowUps.followUps.map((item) => ({
          id: item.id,
          question: item.query,
          answer: item.response,
          citations: Array.isArray(item.citations) ? (item.citations as CitationItem[]) : [],
          isLoading: false,
          createdAt: item.createdAt,
        }))
      : []

    setFollowUps((current) => {
      const pending = current.filter((item) => item.isLoading)
      return [...persisted, ...pending]
    })
  }, [persistedFollowUps?.followUps])

  // Derived values
  const isNotFound = (error as { data?: { code?: string } } | null)?.data?.code === "NOT_FOUND"

  // Category badge from regulatoryAreas[0]
  const regulatoryAreas: RegulatoryArea[] =
    Array.isArray(queryRecord?.regulatoryAreas)
      ? (queryRecord.regulatoryAreas as unknown[]).filter(isRegulatoryArea)
      : []
  const categoryLabel =
    regulatoryAreas.length > 0
      ? REGULATORY_AREA_NAMES[regulatoryAreas[0]]
      : null

  const confidence = (queryRecord as { confidence?: number | null } | null)?.confidence ?? null

  // Handlers
  const handleCopy = () => {
    const responseText = (queryRecord as { response?: string | null } | null)?.response
    if (!responseText) return
    void navigator.clipboard.writeText(responseText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = async () => {
    try {
      const result = await exportMutation.mutateAsync({ queryId })
      if (result.downloadUrl) {
        const link = document.createElement("a")
        link.href = result.downloadUrl
        link.download = result.fileName ?? "SheriaBot_Compliance_Query.docx"
        link.rel = "noopener noreferrer"
        document.body.appendChild(link)
        link.click()
        link.remove()
        toast.success("Export ready", {
          description: `${result.fileName ?? "DOCX file"} is downloading.`,
        })
      }
    } catch (err) {
      toast.error("Export failed", {
        description: getErrorMessage(err),
      })
    }
  }

  const handleSave = async () => {
    const previous = saved
    setSaved(!previous)
    try {
      const result = await saveMutation.mutateAsync({ queryId })
      setSaved(result.saved)
      void utils.compliance.getSavedStatus.invalidate({ queryId })
      toast(result.saved ? "Response saved" : "Removed from saved")
    } catch (err) {
      setSaved(previous)
      toast.error("Couldn't update saved response", { description: getErrorMessage(err) })
    }
  }

  const handleFeedback = async (rating: "up" | "down") => {
    const previous = feedback
    const optimistic = previous === rating ? null : rating

    setFeedback(optimistic)

    try {
      const result = await feedbackMutation.mutateAsync({ queryId, rating })
      setFeedback(result.rating)
      void utils.compliance.getFeedbackStatus.invalidate({ queryId })
    } catch (err) {
      setFeedback(previous)
      toast.error("Couldn't save feedback", { description: getErrorMessage(err) })
    }
  }

  const handleFollowUpSubmit = async () => {
    const question = followUpQuestion.trim()
    const validationError = validateFollowUpQuestion(question)

    if (validationError) {
      setFollowUpError(validationError)
      return
    }

    setFollowUpError(null)

    const optimisticId = `follow-up-${Date.now()}`
    const optimisticEntry: FollowUpEntry = {
      id: optimisticId,
      question,
      answer: null,
      citations: [],
      isLoading: true,
    }

    setFollowUps((items) => [...items, optimisticEntry])

    try {
      const result = await followUpMutation.mutateAsync({
        originalQueryId: queryId,
        question,
      })
      const resultCitations = Array.isArray(result.citations)
        ? (result.citations as CitationItem[])
        : []

      setFollowUps((items) =>
        items.map((item) =>
          item.id === optimisticId
            ? {
                id: result.queryId,
                question,
                answer: result.answer,
                citations: resultCitations,
                isLoading: false,
              }
            : item,
        ),
      )
      setFollowUpQuestion("")
      void utils.compliance.get.invalidate({ id: queryId })
      void utils.compliance.getFollowUps.invalidate({ originalQueryId: queryId })
      requestAnimationFrame(() => followUpTextareaRef.current?.focus())
    } catch (err) {
      setFollowUps((items) => items.filter((item) => item.id !== optimisticId))
      toast.error("Couldn't get follow-up answer", { description: getErrorMessage(err) })
    }
  }

  // Loading
  if (isLoading) {
    return <QueryDetailSkeleton />
  }

  // Error / not-found
  if (isError && isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Query not found</h2>
        <p className="text-sm text-muted-foreground max-w-sm text-center">
          The compliance query you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/startup/compliance-query">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Compliance Query
          </Link>
        </Button>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/startup/compliance-query">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Query Details</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Compliance query response and export
            </p>
          </div>
        </div>

        <Alert variant="destructive" role="alert" className="max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>We could not load this query. Please try again.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void utils.compliance.get.invalidate({ id: queryId })}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Record
  const q = queryRecord as unknown as {
    id: string
    query: string
    response: string | null
    createdAt: string
    regulatoryAreas?: unknown
    citations?: unknown
    confidence?: number | null
  }

  const hasResponse = !!(q.response && q.response.trim().length > 0)
  const citations = Array.isArray(q.citations) ? (q.citations as CitationItem[]) : []
  const areas = Array.isArray(q.regulatoryAreas) ? q.regulatoryAreas : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/startup/compliance-query">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Query Details</h1>
            <Badge variant="outline" className="font-mono text-xs">
              {q.id}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            <Clock className="inline h-3 w-3 mr-1" />
            Asked on{" "}
            {new Date(q.createdAt).toLocaleDateString("en-KE", { dateStyle: "full" })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-foreground">
                      Your Question
                    </CardTitle>
                    <CardDescription className="mt-2 text-foreground/80 text-base">
                      {q.query}
                    </CardDescription>
                  </div>
                </div>
                {categoryLabel ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {categoryLabel}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
          </Card>

          {/* Response card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-foreground">
                      AI Response
                    </CardTitle>
                    {confidence != null && (
                      <CardDescription className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {Math.round(confidence * 100)}% confidence
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!hasResponse}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExport}
                    disabled={exportMutation.isPending || !hasResponse}
                  >
                    {exportMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-1" />
                    )}
                    Export
                  </Button>
                  <Button
                    variant={saved ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => void handleSave()}
                    disabled={saveMutation.isPending || !hasResponse}
                    aria-pressed={saved}
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : saved ? (
                      <BookmarkCheck className="h-4 w-4 mr-1" />
                    ) : (
                      <Bookmark className="h-4 w-4 mr-1" />
                    )}
                    {saved ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasResponse ? (
                <ComplianceFeedback
                  content={q.response!}
                  variant="report"
                  collapsible
                />
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No response available for this query.
                </p>
              )}

              {followUps.length > 0 ? (
                <div className="mt-6 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Follow-ups</h3>
                  {followUps.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <p className="mb-3 text-sm font-medium text-foreground">
                        Q: {item.question}
                      </p>
                      {item.isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Getting follow-up answer...
                        </div>
                      ) : item.answer ? (
                        <>
                          <ComplianceFeedback content={item.answer} variant="report" />
                          <FollowUpSourcesDisclosure citations={item.citations} />
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              <Separator className="my-6" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Was this response helpful?
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={feedback === "up" ? "default" : "outline"}
                    size="sm"
                    onClick={() => void handleFeedback("up")}
                    disabled={feedbackMutation.isPending}
                    aria-pressed={feedback === "up"}
                    className={feedback === "up" ? "bg-primary text-primary-foreground" : ""}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful
                  </Button>
                  <Button
                    variant={feedback === "down" ? "default" : "outline"}
                    size="sm"
                    onClick={() => void handleFeedback("down")}
                    disabled={feedbackMutation.isPending}
                    aria-pressed={feedback === "down"}
                    className={feedback === "down" ? "bg-destructive text-destructive-foreground" : ""}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">
                Follow-up Question
              </CardTitle>
              <CardDescription>Ask a related question for more details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                ref={followUpTextareaRef}
                placeholder="e.g., What are the penalties for non-compliance with KYC requirements?"
                value={followUpQuestion}
                onChange={(e) => {
                  setFollowUpQuestion(e.target.value)
                  if (followUpError) setFollowUpError(null)
                }}
                className="min-h-[100px] bg-muted/50"
                maxLength={1000}
              />
              {followUpError ? (
                <p className="text-sm text-destructive">{followUpError}</p>
              ) : null}
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => void handleFollowUpSubmit()}
                disabled={followUpMutation.isPending}
              >
                {followUpMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                {followUpMutation.isPending ? "Asking..." : "Ask Follow-up"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Sources & References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SourcesList citations={citations} />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Related Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RelatedTopics areas={areas} citations={citations} />
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-foreground">Legal Disclaimer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This AI-generated response is for informational purposes only and should not be
                    considered legal advice. Always consult with qualified legal professionals for
                    specific compliance matters.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
