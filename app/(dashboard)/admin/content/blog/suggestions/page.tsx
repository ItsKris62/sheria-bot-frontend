"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  Search, MoreVertical, FileText, CheckCircle2, XCircle, FileSearch,
  RefreshCw, AlertTriangle, ExternalLink, Globe, Sparkles,
  ArrowUpDown, FilterX, Eye, Clock, ShieldCheck, ShieldAlert,
  AlertOctagon, Cpu, Coins, Zap, Check, ArrowRight
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { format } from "date-fns"
import { safeExternalUrl } from "@/lib/safe-url"

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700 border-slate-200",
  MEDIUM: "bg-blue-50 text-blue-700 border-blue-200",
  HIGH: "bg-amber-50 text-amber-700 border-amber-200",
  URGENT: "bg-rose-50 text-rose-700 border-rose-200",
}

const STATUS_STYLES: Record<string, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-800 border-amber-300",
  APPROVED_FOR_DRAFT: "bg-emerald-50 text-emerald-800 border-emerald-300",
  DRAFT_CREATED: "bg-purple-50 text-purple-800 border-purple-300",
  DISMISSED: "bg-slate-100 text-slate-700 border-slate-200",
  DUPLICATE: "bg-slate-100 text-slate-700 border-slate-200",
  NEEDS_MORE_SOURCES: "bg-orange-50 text-orange-800 border-orange-300",
}

const VERIFICATION_STATUS_STYLES: Record<string, { badge: string; icon: string }> = {
  PASSED: { badge: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "text-emerald-600" },
  NEEDS_REVIEW: { badge: "bg-amber-100 text-amber-800 border-amber-300", icon: "text-amber-600" },
  BLOCKED: { badge: "bg-rose-100 text-rose-800 border-rose-300", icon: "text-rose-600" },
}

const SEVERITY_STYLES: Record<string, string> = {
  BLOCKING: "bg-rose-100 text-rose-800 border-rose-300 font-semibold",
  WARNING: "bg-amber-100 text-amber-800 border-amber-300",
  INFO: "bg-blue-100 text-blue-800 border-blue-300",
}

const JURISDICTION_LABELS: Record<string, { label: string; flag: string }> = {
  KE: { label: "Kenya", flag: "🇰🇪" },
  RW: { label: "Rwanda", flag: "🇷🇼" },
  MW: { label: "Malawi", flag: "🇲🇼" },
  NG: { label: "Nigeria", flag: "🇳🇬" },
  REGIONAL: { label: "Regional", flag: "🌍" },
  GLOBAL: { label: "Global", flag: "🌐" },
}

function getScoreBadge(score: number) {
  if (score >= 85) {
    return {
      label: "Very High Priority",
      className: "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold",
      barColor: "bg-emerald-500",
    }
  }
  if (score >= 70) {
    return {
      label: "High Priority",
      className: "bg-blue-100 text-blue-800 border-blue-300 font-semibold",
      barColor: "bg-blue-500",
    }
  }
  if (score >= 45) {
    return {
      label: "Medium Priority",
      className: "bg-amber-100 text-amber-800 border-amber-300",
      barColor: "bg-amber-500",
    }
  }
  return {
    label: "Low Priority",
    className: "bg-slate-100 text-slate-700 border-slate-300",
    barColor: "bg-slate-400",
  }
}

export default function BlogSuggestionsPage() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [, startTransition] = useTransition()

  // Filter & sorting states
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [scoreTierFilter, setScoreTierFilter] = useState<string>("ALL")
  const [sortOption, setSortOption] = useState<string>("score_desc")

  // Detail Drawer state
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null)

  // Draft Generation Drawer state
  const [generationDrawerTarget, setGenerationDrawerTarget] = useState<{
    suggestionId: string
    blogPostId?: string
    title: string
  } | null>(null)
  const [generationLiveResult, setGenerationLiveResult] = useState<any | null>(null)

  // Dialog targets
  const [dismissTarget, setDismissTarget] = useState<{ id: string; title: string } | null>(null)
  const [dismissReason, setDismissReason] = useState("")

  const [needsMoreSourcesTarget, setNeedsMoreSourcesTarget] = useState<{ id: string; title: string } | null>(null)
  const [needsMoreSourcesReason, setNeedsMoreSourcesReason] = useState("")

  // Compute min/max scores based on tier selection
  const { minScore, maxScore } = useMemo(() => {
    switch (scoreTierFilter) {
      case "VERY_HIGH":
        return { minScore: 85, maxScore: 100 }
      case "HIGH":
        return { minScore: 70, maxScore: 84 }
      case "MEDIUM":
        return { minScore: 45, maxScore: 69 }
      case "LOW":
        return { minScore: 0, maxScore: 44 }
      default:
        return { minScore: undefined, maxScore: undefined }
    }
  }, [scoreTierFilter])

  // Parse sort option
  const { sortBy, sortOrder } = useMemo(() => {
    switch (sortOption) {
      case "score_asc":
        return { sortBy: "score" as const, sortOrder: "asc" as const }
      case "date_desc":
        return { sortBy: "createdAt" as const, sortOrder: "desc" as const }
      case "date_asc":
        return { sortBy: "createdAt" as const, sortOrder: "asc" as const }
      case "score_desc":
      default:
        return { sortBy: "score" as const, sortOrder: "desc" as const }
    }
  }, [sortOption])

  // Query suggestions list
  const { data, isLoading, isFetching, error, refetch } = trpc.blogAutomation.adminListSuggestions.useQuery(
    {
      status: statusFilter !== "ALL" ? (statusFilter as any) : undefined,
      jurisdiction: jurisdictionFilter !== "ALL" ? (jurisdictionFilter as any) : undefined,
      minScore,
      maxScore,
      sortBy,
      sortOrder,
      search: search || undefined,
      page,
      limit: 20,
    },
    {
      placeholderData: (previousData: any) => previousData,
    }
  )

  // Query full details for the drawer lazily
  const { data: detailSuggestion, isLoading: isDetailLoading } = trpc.blogAutomation.adminGetSuggestion.useQuery(
    { id: selectedSuggestionId! },
    { enabled: !!selectedSuggestionId }
  )

  // Query latest verification for active draft generation drawer target if available
  const targetBlogPostId = generationLiveResult?.blogPostId || generationDrawerTarget?.blogPostId
  const { data: latestVerificationData, isLoading: isVerificationLoading, refetch: refetchVerification } =
    trpc.blogAutomation.adminGetLatestBlogVerification.useQuery(
      { blogPostId: targetBlogPostId! },
      { enabled: !!targetBlogPostId && !generationLiveResult }
    )

  // Query the full verification run to get individual issue details if we have a run ID
  const activeVerificationRunId =
    generationLiveResult?.verificationRun?.id || latestVerificationData?.run?.id
  const { data: activeVerificationRunDetails, isLoading: isRunDetailsLoading } =
    trpc.blogAutomation.adminGetBlogVerificationRun.useQuery(
      { id: activeVerificationRunId! },
      { enabled: !!activeVerificationRunId }
    )

  // Mutations
  const scoreItemsMutation = trpc.blogAutomation.adminScoreEligibleSourceItems.useMutation({
    onSuccess: (res: any) => {
      toast.success(`Scored ${res.processed} items. Created ${res.suggestionsCreated} new suggestions.`)
      void utils.blogAutomation.adminListSuggestions.invalidate()
    },
    onError: (err: any) => toast.error(err.message),
  })

  const approveMutation = trpc.blogAutomation.adminApproveSuggestionForDraft.useMutation({
    onSuccess: () => {
      toast.success("Suggestion approved for draft generation")
      void utils.blogAutomation.adminListSuggestions.invalidate()
      if (selectedSuggestionId) {
        void utils.blogAutomation.adminGetSuggestion.invalidate({ id: selectedSuggestionId })
      }
    },
    onError: (err: any) => toast.error(err.message),
  })

  const dismissMutation = trpc.blogAutomation.adminDismissSuggestion.useMutation({
    onSuccess: () => {
      toast.success("Suggestion dismissed")
      setDismissTarget(null)
      setDismissReason("")
      void utils.blogAutomation.adminListSuggestions.invalidate()
      if (selectedSuggestionId) {
        void utils.blogAutomation.adminGetSuggestion.invalidate({ id: selectedSuggestionId })
      }
    },
    onError: (err: any) => toast.error(err.message),
  })

  const needsMoreSourcesMutation = trpc.blogAutomation.adminMarkSuggestionNeedsMoreSources.useMutation({
    onSuccess: () => {
      toast.success("Suggestion marked as needing more sources")
      setNeedsMoreSourcesTarget(null)
      setNeedsMoreSourcesReason("")
      void utils.blogAutomation.adminListSuggestions.invalidate()
      if (selectedSuggestionId) {
        void utils.blogAutomation.adminGetSuggestion.invalidate({ id: selectedSuggestionId })
      }
    },
    onError: (err: any) => toast.error(err.message),
  })

  const createDraftMutation = trpc.blogAutomation.adminCreateDraftFromSuggestion.useMutation({
    onSuccess: (res) => {
      toast.success("Draft skeleton created from suggestion.")
      startTransition(() => {
        router.push(`/admin/content/blog/${res.blogPostId}`)
      })
    },
    onError: (err: any) => toast.error(err.message),
  })

  // End-to-end AI Draft Generation mutation
  const generateAiDraftMutation = trpc.blogAutomation.adminGenerateAiDraft.useMutation({
    onSuccess: (res: any) => {
      toast.success("AI draft generated and semantic verification completed!")
      setGenerationLiveResult(res)
      if (res.blogPostId) {
        setGenerationDrawerTarget((prev) => ({
          suggestionId: prev?.suggestionId || "",
          blogPostId: res.blogPostId,
          title: prev?.title || "Draft Generation Telemetry",
        }))
      }
      void utils.blogAutomation.adminListSuggestions.invalidate()
      if (selectedSuggestionId) {
        void utils.blogAutomation.adminGetSuggestion.invalidate({ id: selectedSuggestionId })
      }
    },
    onError: (err: any) => {
      toast.error(`Draft generation failed: ${err.message}`)
    },
  })

  // Manual re-verification mutation
  const runVerificationMutation = trpc.blogAutomation.adminRunBlogVerification.useMutation({
    onSuccess: () => {
      toast.success("Verification completed successfully")
      if (targetBlogPostId) {
        void utils.blogAutomation.adminGetLatestBlogVerification.invalidate({ blogPostId: targetBlogPostId })
      }
      if (activeVerificationRunId) {
        void utils.blogAutomation.adminGetBlogVerificationRun.invalidate({ id: activeVerificationRunId })
      }
    },
    onError: (err: any) => toast.error(err.message),
  })

  const handleApproveAndGenerateDraft = (suggestionId: string, title: string, existingBlogPostId?: string) => {
    setGenerationLiveResult(null)
    setGenerationDrawerTarget({
      suggestionId,
      blogPostId: existingBlogPostId,
      title,
    })
    generateAiDraftMutation.mutate(
      existingBlogPostId
        ? { suggestionId, blogPostId: existingBlogPostId }
        : { suggestionId }
    )
  }

  const totalPages = data ? data.pagination.pages : 1
  const hasActiveFilters =
    jurisdictionFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    scoreTierFilter !== "ALL" ||
    search.length > 0 ||
    sortOption !== "score_desc"

  const handleClearFilters = () => {
    setJurisdictionFilter("ALL")
    setStatusFilter("ALL")
    setScoreTierFilter("ALL")
    setSortOption("score_desc")
    setSearch("")
    setSearchInput("")
    setPage(1)
  }

  // Active run telemetry resolution
  const activeVerification =
    generationLiveResult?.verificationRun ||
    activeVerificationRunDetails ||
    latestVerificationData?.run
  const activeGenerationRun = generationLiveResult?.generationRun

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="blog-suggestions-page">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/admin/content/blog/sources" className="hover:text-foreground transition-colors">
            Source Monitors
          </Link>
          <span>/</span>
          <Link href="/admin/content/blog/source-items" className="hover:text-foreground transition-colors">
            Source Items
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Suggestions</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Blog Suggestions</h1>
              {isFetching && !isLoading && (
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Regulatory and market developments prioritised for SheriaBot content creation across active jurisdictions.
            </p>
          </div>

          <Button
            className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shrink-0 shadow-sm"
            onClick={() => scoreItemsMutation.mutate({})}
            disabled={scoreItemsMutation.isPending}
          >
            <RefreshCw className={`w-4 h-4 ${scoreItemsMutation.isPending ? "animate-spin" : ""}`} />
            Run Scoring Engine
          </Button>
        </div>
      </div>

      {/* Main Container Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b bg-card">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                Regulatory Content Inbox
                {data && (
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {data.pagination.total} {data.pagination.total === 1 ? "suggestion" : "suggestions"}
                  </span>
                )}
              </CardTitle>

              {/* Filter Controls Bar */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Jurisdiction Selector */}
                <Select
                  value={jurisdictionFilter}
                  onValueChange={(val) => {
                    setJurisdictionFilter(val)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <Globe className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="Jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Countries</SelectItem>
                    <SelectItem value="KE">🇰🇪 Kenya (KE)</SelectItem>
                    <SelectItem value="RW">🇷🇼 Rwanda (RW)</SelectItem>
                    <SelectItem value="MW">🇲🇼 Malawi (MW)</SelectItem>
                    <SelectItem value="NG">🇳🇬 Nigeria (NG)</SelectItem>
                    <SelectItem value="REGIONAL">🌍 Regional</SelectItem>
                    <SelectItem value="GLOBAL">🌐 Global</SelectItem>
                  </SelectContent>
                </Select>

                {/* Score Tier Selector */}
                <Select
                  value={scoreTierFilter}
                  onValueChange={(val) => {
                    setScoreTierFilter(val)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[155px] h-9 text-xs">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
                    <SelectValue placeholder="Score Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Scores</SelectItem>
                    <SelectItem value="VERY_HIGH">Critical (85–100)</SelectItem>
                    <SelectItem value="HIGH">High (70–84)</SelectItem>
                    <SelectItem value="MEDIUM">Medium (45–69)</SelectItem>
                    <SelectItem value="LOW">Low (&lt; 45)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Selector */}
                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[150px] h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                    <SelectItem value="APPROVED_FOR_DRAFT">Approved for Draft</SelectItem>
                    <SelectItem value="DRAFT_CREATED">Draft Created</SelectItem>
                    <SelectItem value="NEEDS_MORE_SOURCES">Needs More Sources</SelectItem>
                    <SelectItem value="DISMISSED">Dismissed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Order Selector */}
                <Select
                  value={sortOption}
                  onValueChange={(val) => {
                    setSortOption(val)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[160px] h-9 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="Sort Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_desc">Highest Score First</SelectItem>
                    <SelectItem value="score_asc">Lowest Score First</SelectItem>
                    <SelectItem value="date_desc">Newest Discovered</SelectItem>
                    <SelectItem value="date_asc">Oldest Discovered</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Bar */}
                <div className="relative flex-1 sm:w-56 min-w-[180px]">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search titles..."
                    className="pl-8 h-9 text-xs"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearch(searchInput.trim())
                        setPage(1)
                      }
                    }}
                  />
                </div>

                {/* Clear Filter button if active */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleClearFilters}
                  >
                    <FilterX className="w-3.5 h-3.5 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Content Table / Results Area */}
        <CardContent className="p-0">
          {error ? (
            <div className="p-8 text-center space-y-3" data-testid="suggestions-error-state">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">We couldn&apos;t load Blog Suggestions</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your dashboard is still available. An error occurred while retrieving suggestion records.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry Query
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="px-4 py-3">Score & Priority</th>
                    <th className="px-4 py-3">Title & Regulatory Context</th>
                    <th className="px-4 py-3">Jurisdiction</th>
                    <th className="px-4 py-3">Authority / Source</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-4" colSpan={6}>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-5 flex-1" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : !data || data.suggestions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <Search className="w-5 h-5" />
                          </div>
                          <p className="font-medium text-foreground">No suggestions match these filters</p>
                          <p className="text-xs text-muted-foreground">
                            SheriaBot continuously evaluates regulatory and industry sources for potential content opportunities.
                          </p>
                          {hasActiveFilters && (
                            <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={handleClearFilters}>
                              Clear all filters
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.suggestions.map((suggestion: any) => {
                      const scoreBadge = getScoreBadge(suggestion.relevanceScore)
                      const countryMeta = JURISDICTION_LABELS[suggestion.jurisdiction] || {
                        label: suggestion.jurisdiction,
                        flag: "📍",
                      }
                      const primarySource = suggestion.sources?.[0]?.sourceItem
                      const isGeneratingThis =
                        generateAiDraftMutation.isPending &&
                        generationDrawerTarget?.suggestionId === suggestion.id

                      return (
                        <tr
                          key={suggestion.id}
                          className="hover:bg-muted/30 transition-colors cursor-pointer group"
                          onClick={() => setSelectedSuggestionId(suggestion.id)}
                        >
                          {/* Score column */}
                          <td className="px-4 py-3.5 align-top w-32">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base font-bold text-foreground">
                                  {suggestion.relevanceScore}
                                </span>
                                <span className="text-xs text-muted-foreground">/100</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full ${scoreBadge.barColor}`}
                                  style={{ width: `${Math.min(100, Math.max(5, suggestion.relevanceScore))}%` }}
                                />
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-[10px] py-0 px-1.5 w-fit ${PRIORITY_STYLES[suggestion.priority]}`}
                              >
                                {suggestion.priority}
                              </Badge>
                            </div>
                          </td>

                          {/* Title & Context */}
                          <td className="px-4 py-3.5 align-top max-w-md">
                            <div className="font-semibold text-foreground group-hover:text-emerald-700 transition-colors line-clamp-2">
                              {suggestion.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span>Category: {suggestion.category}</span>
                              <span>•</span>
                              <span>{suggestion.articleType?.replace(/_/g, " ")}</span>
                              {suggestion.sources?.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{suggestion.sources.length} {suggestion.sources.length === 1 ? "source" : "sources"}</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Jurisdiction */}
                          <td className="px-4 py-3.5 align-top whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                              <span className="text-base leading-none">{countryMeta.flag}</span>
                              <span>{countryMeta.label}</span>
                            </div>
                          </td>

                          {/* Authority / Source */}
                          <td className="px-4 py-3.5 align-top max-w-xs">
                            <div className="text-xs font-medium text-foreground truncate">
                              {primarySource?.monitor?.name || primarySource?.publisher || "Official Registry"}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {format(new Date(suggestion.createdAt), "MMM d, yyyy")}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5 align-top whitespace-nowrap">
                            <Badge variant="outline" className={`text-xs py-0.5 px-2 ${STATUS_STYLES[suggestion.status]}`}>
                              {suggestion.status.replace(/_/g, " ")}
                            </Badge>
                            {suggestion.needsMoreSources && (
                              <div className="text-[10px] text-orange-600 mt-1 flex items-center gap-1 font-medium">
                                <AlertTriangle className="w-3 h-3" /> Needs Sources
                              </div>
                            )}
                          </td>

                          {/* Row Actions */}
                          <td
                            className="px-4 py-3.5 text-right align-top whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Direct AI Draft Trigger button for PENDING_REVIEW or APPROVED_FOR_DRAFT */}
                              {suggestion.status === "PENDING_REVIEW" && (
                                <Button
                                  size="sm"
                                  className="h-8 px-2.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 shadow-2xs"
                                  onClick={() => handleApproveAndGenerateDraft(suggestion.id, suggestion.title, suggestion.blogPostId)}
                                  disabled={generateAiDraftMutation.isPending}
                                >
                                  {isGeneratingThis ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                  )}
                                  Approve & Draft
                                </Button>
                              )}

                              {suggestion.status === "APPROVED_FOR_DRAFT" && (
                                <Button
                                  size="sm"
                                  className="h-8 px-2.5 text-xs bg-purple-700 hover:bg-purple-800 text-white gap-1.5 shadow-2xs"
                                  onClick={() => handleApproveAndGenerateDraft(suggestion.id, suggestion.title, suggestion.blogPostId)}
                                  disabled={generateAiDraftMutation.isPending}
                                >
                                  {isGeneratingThis ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                  )}
                                  Generate AI Draft
                                </Button>
                              )}

                              {suggestion.status === "DRAFT_CREATED" && suggestion.blogPostId && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2.5 text-xs border-purple-200 text-purple-700 hover:bg-purple-50 gap-1.5"
                                  onClick={() => {
                                    setGenerationDrawerTarget({
                                      suggestionId: suggestion.id,
                                      blogPostId: suggestion.blogPostId,
                                      title: suggestion.title,
                                    })
                                  }}
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Telemetry
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                                onClick={() => setSelectedSuggestionId(suggestion.id)}
                              >
                                <Eye className="w-3.5 h-3.5" /> Details
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52">
                                  {suggestion.status === "PENDING_REVIEW" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleApproveAndGenerateDraft(suggestion.id, suggestion.title, suggestion.blogPostId)}>
                                        <Sparkles className="mr-2 h-4 w-4 text-emerald-600" /> Approve & Generate Draft
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => approveMutation.mutate({ id: suggestion.id })}>
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Approve Only
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setNeedsMoreSourcesTarget({ id: suggestion.id, title: suggestion.title })
                                        }
                                      >
                                        <FileSearch className="mr-2 h-4 w-4 text-orange-600" /> Request More Sources
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setDismissTarget({ id: suggestion.id, title: suggestion.title })
                                        }
                                      >
                                        <XCircle className="mr-2 h-4 w-4 text-slate-500" /> Dismiss Suggestion
                                      </DropdownMenuItem>
                                    </>
                                  )}

                                  {suggestion.status === "APPROVED_FOR_DRAFT" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => handleApproveAndGenerateDraft(suggestion.id, suggestion.title, suggestion.blogPostId)}
                                      >
                                        <Sparkles className="mr-2 h-4 w-4 text-purple-600" /> Generate AI Draft
                                      </DropdownMenuItem>
                                      {!suggestion.blogPostId && (
                                        <DropdownMenuItem
                                          onClick={() => createDraftMutation.mutate({ suggestionId: suggestion.id })}
                                        >
                                          <FileText className="mr-2 h-4 w-4 text-slate-600" /> Create Skeleton Only
                                        </DropdownMenuItem>
                                      )}
                                    </>
                                  )}

                                  {suggestion.status === "DRAFT_CREATED" && suggestion.blogPostId && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setGenerationDrawerTarget({
                                            suggestionId: suggestion.id,
                                            blogPostId: suggestion.blogPostId,
                                            title: suggestion.title,
                                          })
                                        }
                                      >
                                        <ShieldCheck className="mr-2 h-4 w-4 text-purple-600" /> View Run & Verification
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleApproveAndGenerateDraft(suggestion.id, suggestion.title, suggestion.blogPostId)}
                                      >
                                        <RefreshCw className="mr-2 h-4 w-4 text-purple-600" /> Regenerate AI Draft
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          startTransition(() => {
                                            router.push(`/admin/content/blog/${suggestion.blogPostId}`)
                                          })
                                        }
                                      >
                                        <ExternalLink className="mr-2 h-4 w-4 text-purple-600" /> Open in Post Editor
                                      </DropdownMenuItem>
                                    </>
                                  )}

                                  {primarySource?.url && safeExternalUrl(primarySource.url) && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        const validated = safeExternalUrl(primarySource.url)
                                        if (validated) {
                                          window.open(validated, "_blank", "noopener,noreferrer")
                                        }
                                      }}
                                    >
                                      <Globe className="mr-2 h-4 w-4 text-blue-600" /> Visit Original Source
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {data && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
              <div>
                Showing page <span className="font-semibold text-foreground">{data.pagination.page}</span> of{" "}
                <span className="font-semibold text-foreground">{data.pagination.pages}</span> (
                {data.pagination.total} items)
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestion Detail Sheet / Drawer */}
      <Sheet open={!!selectedSuggestionId} onOpenChange={(open) => !open && setSelectedSuggestionId(null)}>
        <SheetContent side="right" className="sm:max-w-xl w-full p-0 flex flex-col h-full bg-card">
          <SheetHeader className="p-6 border-b bg-muted/10">
            <div className="flex items-center gap-2 mb-1">
              {detailSuggestion && (
                <>
                  <Badge variant="outline" className={STATUS_STYLES[detailSuggestion.status]}>
                    {detailSuggestion.status.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="outline" className={PRIORITY_STYLES[detailSuggestion.priority]}>
                    {detailSuggestion.priority} Priority
                  </Badge>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted">
                    {JURISDICTION_LABELS[detailSuggestion.jurisdiction]?.flag}{" "}
                    {detailSuggestion.jurisdiction}
                  </span>
                </>
              )}
            </div>
            <SheetTitle className="text-lg font-bold text-foreground text-left">
              {isDetailLoading ? <Skeleton className="h-6 w-3/4" /> : detailSuggestion?.title}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground text-left">
              Suggested Slug: <span className="font-mono text-foreground">{detailSuggestion?.suggestedSlug || "—"}</span>
            </SheetDescription>
          </SheetHeader>

          {/* Drawer Body with scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isDetailLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : detailSuggestion ? (
              <>
                {/* Score & Priority Overview */}
                <div className="p-4 rounded-lg bg-muted/40 border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">Relevance Score</div>
                      <div className="text-2xl font-bold text-foreground">
                        {detailSuggestion.relevanceScore}
                        <span className="text-xs text-muted-foreground font-normal"> / 100</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={getScoreBadge(detailSuggestion.relevanceScore).className}>
                      {getScoreBadge(detailSuggestion.relevanceScore).label}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getScoreBadge(detailSuggestion.relevanceScore).barColor}`}
                      style={{ width: `${Math.min(100, Math.max(5, detailSuggestion.relevanceScore))}%` }}
                    />
                  </div>
                </div>

                {/* Regulatory Rationale / Why SheriaBot Flagged This */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Regulatory Relevance Rationale
                  </h4>
                  <div className="text-sm bg-muted/30 p-3.5 rounded-md border text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {detailSuggestion.reason || "No explicit scoring rationale recorded."}
                  </div>
                </div>

                {/* Suggested Next Action */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" /> Recommended Action
                  </h4>
                  <div className="text-sm bg-blue-50/60 text-blue-950 p-3.5 rounded-md border border-blue-200">
                    {detailSuggestion.suggestedNextAction || "Review source material and approve for draft generation."}
                  </div>
                </div>

                {/* Classification & Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-3.5 rounded-md border">
                  <div>
                    <span className="text-muted-foreground block">Category:</span>
                    <span className="font-medium text-foreground">{detailSuggestion.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Article Type:</span>
                    <span className="font-medium text-foreground">
                      {detailSuggestion.articleType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Source Quality:</span>
                    <span className="font-medium text-foreground">{detailSuggestion.sourceQuality}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Discovered:</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(detailSuggestion.createdAt), "PPp")}
                    </span>
                  </div>
                </div>

                {/* Target Audience & Tags */}
                {detailSuggestion.targetAudience?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Target Audience:</span>
                    <div className="flex flex-wrap gap-1">
                      {detailSuggestion.targetAudience.map((aud: string) => (
                        <Badge key={aud} variant="secondary" className="text-xs">
                          {aud}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources & Excerpts */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" /> Discovered Source Articles ({detailSuggestion.sources?.length || 0})
                  </h4>

                  {detailSuggestion.sources?.map((s: any) => {
                    const validatedUrl = safeExternalUrl(s.sourceItem.url)

                    return (
                      <div key={s.sourceItemId} className="p-3.5 rounded-md border bg-card space-y-2 shadow-2xs">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-medium text-sm text-foreground leading-snug">
                            {s.sourceItem.title}
                          </h5>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {s.sourceItem.sourceType}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2">
                          <span>Monitor: {s.sourceItem.monitor?.name || "Official Feed"}</span>
                          <span>•</span>
                          <span>Discovered {format(new Date(s.sourceItem.discoveredAt), "PP")}</span>
                        </div>

                        {s.sourceItem.summary && (
                          <div className="text-xs text-foreground/80 bg-muted/40 p-2.5 rounded border border-border/50 line-clamp-4">
                            {s.sourceItem.summary}
                          </div>
                        )}

                        {validatedUrl && (
                          <div className="pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-blue-600 hover:text-blue-700 gap-1"
                              onClick={() => window.open(validatedUrl, "_blank", "noopener,noreferrer")}
                            >
                              <ExternalLink className="w-3 h-3" /> Visit Original Source
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : null}
          </div>

          {/* Drawer Actions Footer */}
          {detailSuggestion && (
            <div className="p-4 border-t bg-muted/20 flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setSelectedSuggestionId(null)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {detailSuggestion.status === "PENDING_REVIEW" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-slate-700"
                      onClick={() =>
                        setDismissTarget({ id: detailSuggestion.id, title: detailSuggestion.title })
                      }
                    >
                      Dismiss
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-orange-700 border-orange-200 hover:bg-orange-50"
                      onClick={() =>
                        setNeedsMoreSourcesTarget({ id: detailSuggestion.id, title: detailSuggestion.title })
                      }
                    >
                      Needs Sources
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
                      onClick={() => {
                        handleApproveAndGenerateDraft(detailSuggestion.id, detailSuggestion.title, detailSuggestion.blogPostId)
                        setSelectedSuggestionId(null)
                      }}
                      disabled={generateAiDraftMutation.isPending}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Approve & Generate Draft
                    </Button>
                  </>
                )}

                {detailSuggestion.status === "APPROVED_FOR_DRAFT" && (
                  <Button
                    size="sm"
                    className="text-xs bg-purple-700 hover:bg-purple-800 text-white gap-1.5"
                    onClick={() => {
                      handleApproveAndGenerateDraft(detailSuggestion.id, detailSuggestion.title, detailSuggestion.blogPostId)
                      setSelectedSuggestionId(null)
                    }}
                    disabled={generateAiDraftMutation.isPending}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Generate AI Draft
                  </Button>
                )}

                {detailSuggestion.status === "DRAFT_CREATED" && detailSuggestion.blogPostId && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 gap-1.5"
                      onClick={() => {
                        setGenerationDrawerTarget({
                          suggestionId: detailSuggestion.id,
                          blogPostId: detailSuggestion.blogPostId,
                          title: detailSuggestion.title,
                        })
                        setSelectedSuggestionId(null)
                      }}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Verification & Telemetry
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-purple-700 hover:bg-purple-800 text-white"
                      onClick={() =>
                        startTransition(() => {
                          router.push(`/admin/content/blog/${detailSuggestion.blogPostId}`)
                        })
                      }
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open Draft Article
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dedicated Draft Generation & Semantic Verification Details Sheet */}
      <Sheet
        open={!!generationDrawerTarget}
        onOpenChange={(open) => {
          if (!open) {
            setGenerationDrawerTarget(null)
            setGenerationLiveResult(null)
          }
        }}
      >
        <SheetContent side="right" className="sm:max-w-2xl w-full p-0 flex flex-col h-full bg-card">
          <SheetHeader className="p-6 border-b bg-muted/10">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    generateAiDraftMutation.isPending
                      ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                      : activeGenerationRun?.status === "FAILED"
                      ? "bg-rose-100 text-rose-800 border-rose-300"
                      : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }
                >
                  {generateAiDraftMutation.isPending
                    ? "GENERATING_DRAFT"
                    : activeGenerationRun?.status || "COMPLETED"}
                </Badge>
                {activeVerification && (
                  <Badge
                    variant="outline"
                    className={
                      VERIFICATION_STATUS_STYLES[activeVerification.status]?.badge ||
                      "bg-slate-100 text-slate-700"
                    }
                  >
                    Verification: {activeVerification.status}
                  </Badge>
                )}
              </div>
              {targetBlogPostId && (
                <span className="font-mono text-[11px] text-muted-foreground">
                  Post ID: {targetBlogPostId.slice(0, 8)}...
                </span>
              )}
            </div>
            <SheetTitle className="text-lg font-bold text-foreground text-left flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
              Draft Generation & Citation Verification
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground text-left line-clamp-1">
              {generationDrawerTarget?.title}
            </SheetDescription>
          </SheetHeader>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {generateAiDraftMutation.isPending ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin flex items-center justify-center" />
                  <Sparkles className="w-6 h-6 text-purple-600 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">
                    Synthesizing Regulatory Draft & Running Post-Hoc Verification
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Claude 3.5 Sonnet is structuring content from verified canonical sources and executing claim verification passes.
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-2 pt-4 text-xs text-left">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" /> Fetching Canonical Source Versions
                  </div>
                  <div className="flex items-center gap-2 text-purple-700 font-medium animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-600" /> AI Draft Generation (Claude 3.5 Sonnet)
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" /> Semantic Claim Verification
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Error Banner if run failed */}
                {activeGenerationRun?.status === "FAILED" && (
                  <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <AlertOctagon className="w-4 h-4 text-rose-600" /> AI Generation Failed
                    </div>
                    <p className="text-xs leading-relaxed">
                      {activeGenerationRun.errorMessage || "An unexpected error occurred during draft synthesis."}
                    </p>
                  </div>
                )}

                {/* Telemetry Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Cpu className="w-3.5 h-3.5 text-blue-500" /> Model
                    </div>
                    <div className="text-xs font-semibold text-foreground truncate" title="claude-3-5-sonnet-20240620">
                      Claude 3.5 Sonnet
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Token Usage
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      {activeGenerationRun?.inputTokenEstimate
                        ? `${activeGenerationRun.inputTokenEstimate + (activeGenerationRun.outputTokenEstimate || 0)} tokens`
                        : "Dynamic Est."}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Coins className="w-3.5 h-3.5 text-emerald-500" /> Est. Cost (USD)
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      {activeGenerationRun?.costUsdEstimate != null
                        ? `$${activeGenerationRun.costUsdEstimate.toFixed(4)}`
                        : "< $0.02"}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-purple-500" /> Completed
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      {activeGenerationRun?.completedAt
                        ? format(new Date(activeGenerationRun.completedAt), "HH:mm:ss")
                        : "Just now"}
                    </div>
                  </div>
                </div>

                {/* Reviewer Notes & Uncertainty Flags */}
                {(generationLiveResult?.reviewerNotes || activeGenerationRun?.reviewerNotes) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> AI Reviewer Notes
                    </h4>
                    <div className="text-xs bg-purple-50/60 text-purple-950 p-3.5 rounded-md border border-purple-200 leading-relaxed">
                      {generationLiveResult?.reviewerNotes || activeGenerationRun?.reviewerNotes}
                    </div>
                  </div>
                )}

                {(generationLiveResult?.uncertaintyFlags?.length > 0 ||
                  activeGenerationRun?.uncertaintyFlags?.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Uncertainty / Verification Flags
                    </h4>
                    <ul className="text-xs bg-amber-50/60 text-amber-950 p-3.5 rounded-md border border-amber-200 space-y-1.5 list-disc list-inside">
                      {(generationLiveResult?.uncertaintyFlags || activeGenerationRun?.uncertaintyFlags || []).map(
                        (flag: string, idx: number) => (
                          <li key={idx} className="leading-snug">
                            {flag}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Semantic Verification Results Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Semantic Verification Audit
                    </h4>
                    {activeVerification && (
                      <span className="text-xs text-muted-foreground font-medium">
                        Quality Score: <span className="font-bold text-foreground">{activeVerification.qualityScore ?? 100}/100</span>
                      </span>
                    )}
                  </div>

                  {isVerificationLoading || isRunDetailsLoading ? (
                    <Skeleton className="h-28 w-full" />
                  ) : activeVerification ? (
                    <div className="space-y-3">
                      {/* Issue summary badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="px-3 py-1.5 rounded-md bg-muted/40 border flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">Status:</span>
                          <Badge
                            variant="outline"
                            className={
                              VERIFICATION_STATUS_STYLES[activeVerification.status]?.badge ||
                              "bg-slate-100"
                            }
                          >
                            {activeVerification.status}
                          </Badge>
                        </div>
                        <div className="px-3 py-1.5 rounded-md bg-muted/40 border flex items-center gap-1.5">
                          <span className="font-medium text-rose-700">Blocking Issues:</span>
                          <span className="font-bold text-foreground">{activeVerification.blockingIssueCount ?? 0}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-md bg-muted/40 border flex items-center gap-1.5">
                          <span className="font-medium text-amber-700">Warnings:</span>
                          <span className="font-bold text-foreground">{activeVerification.warningIssueCount ?? 0}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-md bg-muted/40 border flex items-center gap-1.5">
                          <span className="font-medium text-blue-700">Info Notices:</span>
                          <span className="font-bold text-foreground">{activeVerification.infoIssueCount ?? 0}</span>
                        </div>
                      </div>

                      {/* List of Issues */}
                      {activeVerification.issues && activeVerification.issues.length > 0 ? (
                        <div className="space-y-2.5">
                          {activeVerification.issues.map((issue: any) => (
                            <div
                              key={issue.id}
                              className="p-3.5 rounded-md border bg-card space-y-2 text-xs shadow-2xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 font-semibold text-foreground">
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] py-0 px-1.5 ${
                                      SEVERITY_STYLES[issue.severity] || "bg-slate-100"
                                    }`}
                                  >
                                    {issue.severity}
                                  </Badge>
                                  <span>{issue.title}</span>
                                </div>
                                {issue.claimCategory && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    {issue.claimCategory}
                                  </Badge>
                                )}
                              </div>

                              {issue.claimText && (
                                <div className="p-2 bg-muted/40 rounded border text-foreground/90 italic font-mono text-[11px]">
                                  &ldquo;{issue.claimText}&rdquo;
                                </div>
                              )}

                              <p className="text-foreground/80 leading-relaxed">
                                {issue.description}
                              </p>

                              {issue.recommendation && (
                                <div className="text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-200 flex items-start gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <span><strong>Recommendation:</strong> {issue.recommendation}</span>
                                </div>
                              )}

                              {issue.sourceUrl && (
                                <div className="pt-1 flex items-center gap-2 text-muted-foreground text-[11px]">
                                  <Globe className="w-3 h-3 text-muted-foreground" />
                                  <span className="truncate max-w-sm">{issue.sourceUrl}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>All factual and legal obligations are strictly grounded against canonical verified sources. No blocking issues detected.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-muted/20 border text-center text-xs text-muted-foreground">
                      No semantic verification run found for this post yet.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t bg-muted/20 flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setGenerationDrawerTarget(null)
                setGenerationLiveResult(null)
              }}
            >
              Close
            </Button>

            <div className="flex items-center gap-2">
              {targetBlogPostId && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => runVerificationMutation.mutate({ blogPostId: targetBlogPostId })}
                    disabled={runVerificationMutation.isPending || generateAiDraftMutation.isPending}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${runVerificationMutation.isPending ? "animate-spin" : ""}`} />
                    Re-Verify Claims
                  </Button>

                  <Button
                    size="sm"
                    className="text-xs bg-purple-700 hover:bg-purple-800 text-white gap-1.5"
                    onClick={() => {
                      startTransition(() => {
                        router.push(`/admin/content/blog/${targetBlogPostId}`)
                      })
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Review Draft in Editor
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dismiss Dialog */}
      <Dialog open={!!dismissTarget} onOpenChange={(open) => !open && setDismissTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismiss Suggestion</DialogTitle>
            <DialogDescription>
              Are you sure you want to dismiss &quot;{dismissTarget?.title}&quot;? It will be archived and removed from the active queue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Dismissal</label>
              <Textarea
                placeholder="Why is this not a good blog topic? (e.g. Too narrow, already covered in previous circular analysis)"
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDismissTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (dismissTarget && dismissReason.length >= 5) {
                  dismissMutation.mutate({ id: dismissTarget.id, reason: dismissReason })
                } else {
                  toast.error("Please provide a valid reason (min 5 characters).")
                }
              }}
              disabled={dismissMutation.isPending}
            >
              Confirm Dismissal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Needs More Sources Dialog */}
      <Dialog open={!!needsMoreSourcesTarget} onOpenChange={(open) => !open && setNeedsMoreSourcesTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request More Sources</DialogTitle>
            <DialogDescription>
              Flag &quot;{needsMoreSourcesTarget?.title}&quot; as needing more official context before a draft can be generated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What is missing? (Optional note)</label>
              <Textarea
                placeholder="e.g. Awaiting published gazette notice or implementing regulation."
                value={needsMoreSourcesReason}
                onChange={(e) => setNeedsMoreSourcesReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNeedsMoreSourcesTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                if (needsMoreSourcesTarget) {
                  needsMoreSourcesMutation.mutate({
                    id: needsMoreSourcesTarget.id,
                    reason: needsMoreSourcesReason,
                  })
                }
              }}
              disabled={needsMoreSourcesMutation.isPending}
            >
              Mark Needs Sources
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
