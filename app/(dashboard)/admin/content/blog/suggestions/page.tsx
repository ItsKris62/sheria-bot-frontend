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
  ArrowUpDown, FilterX, Eye, Clock, ShieldCheck
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
      toast.success("Draft created from suggestion.")
      startTransition(() => {
        router.push(`/admin/content/blog/${res.blogPostId}`)
      })
    },
    onError: (err: any) => toast.error(err.message),
  })

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
                            <div className="flex items-center justify-end gap-1">
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
                                <DropdownMenuContent align="end" className="w-48">
                                  {suggestion.status === "PENDING_REVIEW" && (
                                    <>
                                      <DropdownMenuItem onClick={() => approveMutation.mutate({ id: suggestion.id })}>
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Approve for Draft
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

                                  {suggestion.status === "APPROVED_FOR_DRAFT" && !suggestion.blogPostId && (
                                    <DropdownMenuItem
                                      onClick={() => createDraftMutation.mutate({ suggestionId: suggestion.id })}
                                    >
                                      <FileText className="mr-2 h-4 w-4 text-purple-600" /> Create Draft Article
                                    </DropdownMenuItem>
                                  )}

                                  {suggestion.status === "DRAFT_CREATED" && suggestion.blogPostId && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        startTransition(() => {
                                          router.push(`/admin/content/blog/${suggestion.blogPostId}`)
                                        })
                                      }
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4 text-purple-600" /> Open Draft Article
                                    </DropdownMenuItem>
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
                      className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                      onClick={() => approveMutation.mutate({ id: detailSuggestion.id })}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve for Draft
                    </Button>
                  </>
                )}

                {detailSuggestion.status === "APPROVED_FOR_DRAFT" && !detailSuggestion.blogPostId && (
                  <Button
                    size="sm"
                    className="text-xs bg-purple-700 hover:bg-purple-800 text-white"
                    onClick={() => createDraftMutation.mutate({ suggestionId: detailSuggestion.id })}
                    disabled={createDraftMutation.isPending}
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" /> Create Draft Article
                  </Button>
                )}

                {detailSuggestion.status === "DRAFT_CREATED" && detailSuggestion.blogPostId && (
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
                )}
              </div>
            </div>
          )}
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
