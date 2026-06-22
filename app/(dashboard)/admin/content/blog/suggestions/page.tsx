"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, MoreVertical, FileText, CheckCircle2, XCircle, FileSearch, RefreshCw, AlertTriangle } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
}

const STATUS_STYLES: Record<string, string> = {
  PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
  APPROVED_FOR_DRAFT: "bg-green-100 text-green-700",
  DRAFT_CREATED: "bg-purple-100 text-purple-700",
  DISMISSED: "bg-gray-100 text-gray-700",
  DUPLICATE: "bg-gray-100 text-gray-700",
  NEEDS_MORE_SOURCES: "bg-orange-100 text-orange-700",
}

export default function BlogSuggestionsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("PENDING_REVIEW")

  const [dismissTarget, setDismissTarget] = useState<{ id: string; title: string } | null>(null)
  const [dismissReason, setDismissReason] = useState("")

  const [needsMoreSourcesTarget, setNeedsMoreSourcesTarget] = useState<{ id: string; title: string } | null>(null)
  const [needsMoreSourcesReason, setNeedsMoreSourcesReason] = useState("")

  const utils = trpc.useUtils()

  const { data, isLoading } = trpc.blogAutomation.adminListSuggestions.useQuery({
    status: statusFilter !== "ALL" ? (statusFilter as any) : undefined,
    search: search || undefined,
    page,
    limit: 20,
  })

  const scoreItemsMutation = trpc.blogAutomation.adminScoreEligibleSourceItems.useMutation({
    onSuccess: (res: any) => {
      toast.success(`Scored ${res.processed} items. Created ${res.suggestionsCreated} new suggestions.`);
      void utils.blogAutomation.adminListSuggestions.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  })

  const approveMutation = trpc.blogAutomation.adminApproveSuggestionForDraft.useMutation({
    onSuccess: () => { toast.success("Suggestion approved for draft generation"); void utils.blogAutomation.adminListSuggestions.invalidate() },
    onError: (err: any) => toast.error(err.message),
  })

  const dismissMutation = trpc.blogAutomation.adminDismissSuggestion.useMutation({
    onSuccess: () => { 
      toast.success("Suggestion dismissed")
      setDismissTarget(null)
      setDismissReason("")
      void utils.blogAutomation.adminListSuggestions.invalidate() 
    },
    onError: (err: any) => toast.error(err.message),
  })

  const needsMoreSourcesMutation = trpc.blogAutomation.adminMarkSuggestionNeedsMoreSources.useMutation({
    onSuccess: () => { 
      toast.success("Suggestion marked as needing more sources")
      setNeedsMoreSourcesTarget(null)
      setNeedsMoreSourcesReason("")
      void utils.blogAutomation.adminListSuggestions.invalidate() 
    },
    onError: (err: any) => toast.error(err.message),
  })

  const totalPages = data ? data.pagination.pages : 1

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Topic Suggestions</h1>
          <p className="text-sm text-gray-500 mt-1">Review topics automatically suggested from regulatory sources.</p>
        </div>
        <Button 
          className="bg-secondary hover:bg-[#007a50] text-white gap-2" 
          onClick={() => scoreItemsMutation.mutate({})}
          disabled={scoreItemsMutation.isPending}
        >
          <RefreshCw className={`w-4 h-4 ${scoreItemsMutation.isPending ? 'animate-spin' : ''}`} /> Run Scoring Engine
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-medium">Suggestion Queue</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                  <SelectItem value="APPROVED_FOR_DRAFT">Approved</SelectItem>
                  <SelectItem value="NEEDS_MORE_SOURCES">Needs More Sources</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search titles..."
                  className="pl-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearch(searchInput)
                      setPage(1)
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Title & Context</th>
                  <th className="px-4 py-3 font-medium">Jurisdiction / Type</th>
                  <th className="px-4 py-3 font-medium">Score / Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4" colSpan={5}>
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))
                ) : data?.suggestions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No suggestions found matching the filters.
                    </td>
                  </tr>
                ) : (
                  data?.suggestions.map((suggestion: any) => (
                    <tr key={suggestion.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium text-foreground mb-1">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          Category: {suggestion.category} • Sources: {suggestion.sources?.length || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium">{suggestion.jurisdiction}</div>
                        <div className="text-xs text-muted-foreground">{suggestion.articleType.replace(/_/g, ' ')}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium">{suggestion.relevanceScore}/100</div>
                        <Badge variant="outline" className={`mt-1 text-[10px] ${PRIORITY_STYLES[suggestion.priority]}`}>
                          {suggestion.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <Badge variant="outline" className={STATUS_STYLES[suggestion.status]}>
                          {suggestion.status.replace(/_/g, ' ')}
                        </Badge>
                        {suggestion.needsMoreSources && (
                          <div className="text-[10px] text-orange-600 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Blocked
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right align-top">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {suggestion.status === "PENDING_REVIEW" && (
                              <>
                                <DropdownMenuItem onClick={() => approveMutation.mutate({ id: suggestion.id })}>
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Approve for Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setNeedsMoreSourcesTarget({ id: suggestion.id, title: suggestion.title })}>
                                  <FileSearch className="mr-2 h-4 w-4 text-orange-600" /> Request More Sources
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDismissTarget({ id: suggestion.id, title: suggestion.title })}>
                                  <XCircle className="mr-2 h-4 w-4 text-gray-500" /> Dismiss Suggestion
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => window.location.href = `/admin/content/blog/suggestions/${suggestion.id}`}>
                              <FileText className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dismiss Dialog */}
      <Dialog open={!!dismissTarget} onOpenChange={(open) => !open && setDismissTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismiss Suggestion</DialogTitle>
            <DialogDescription>
              Are you sure you want to dismiss &quot;{dismissTarget?.title}&quot;? It will be removed from the active queue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Dismissal</label>
              <Textarea 
                placeholder="Why is this not a good blog topic? (e.g. Too narrow, already covered)"
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDismissTarget(null)}>Cancel</Button>
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
              Flag &quot;{needsMoreSourcesTarget?.title}&quot; as needing more context before a draft can be generated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What&apos;s missing? (Optional)</label>
              <Textarea 
                placeholder="e.g. Wait for the final gazetted version before writing."
                value={needsMoreSourcesReason}
                onChange={(e) => setNeedsMoreSourcesReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNeedsMoreSourcesTarget(null)}>Cancel</Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                if (needsMoreSourcesTarget) {
                  needsMoreSourcesMutation.mutate({ id: needsMoreSourcesTarget.id, reason: needsMoreSourcesReason })
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
