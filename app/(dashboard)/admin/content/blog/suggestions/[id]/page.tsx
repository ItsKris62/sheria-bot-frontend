"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/lib/trpc"
import { ChevronLeft, ExternalLink, CheckCircle2, FileSearch, XCircle } from "lucide-react"
import { format } from "date-fns"

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

export default function SuggestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: suggestion, isLoading } = trpc.blogAutomation.adminGetSuggestion.useQuery({ id })
  const utils = trpc.useUtils()

  if (isLoading) {
    return <div className="p-6"><Skeleton className="h-64 w-full" /></div>
  }

  if (!suggestion) {
    return <div className="p-6 text-red-500">Suggestion not found</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={() => router.push("/admin/content/blog/suggestions")}>
          <ChevronLeft className="w-4 h-4" /> Back to Suggestions
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={STATUS_STYLES[suggestion.status]}>
            {suggestion.status.replace(/_/g, ' ')}
          </Badge>
          <Badge variant="outline" className={PRIORITY_STYLES[suggestion.priority]}>
            {suggestion.priority} Priority
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{suggestion.title}</h1>
          <p className="text-muted-foreground mt-2">
            Suggested Slug: <span className="font-mono text-sm">{suggestion.suggestedSlug}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Generated Reason</h4>
                <div className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                  {suggestion.reason || 'No reason provided'}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Recommended Next Action</h4>
                <div className="text-sm whitespace-pre-wrap bg-blue-50/50 text-blue-800 p-3 rounded-md border border-blue-100">
                  {suggestion.suggestedNextAction || 'Review and approve.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Target Audience</h4>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.targetAudience.map((a: string) => (
                      <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.recommendedTags.map((t: string) => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Materials ({suggestion.sources.length})</CardTitle>
              <CardDescription>Items used to generate this suggestion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestion.sources.map((s: any) => (
                <div key={s.sourceItemId} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-blue-600 hover:underline">
                        <a href={s.sourceItem.url} target="_blank" rel="noreferrer">{s.sourceItem.title}</a>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Source: {s.sourceItem.monitor.name} • Discovered: {format(new Date(s.sourceItem.discoveredAt), 'PP')}
                      </p>
                    </div>
                    <Badge variant="outline">{s.sourceItem.sourceType}</Badge>
                  </div>
                  {s.sourceItem.summary && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                      {s.sourceItem.summary}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Jurisdiction</span>
                <span className="font-medium">{suggestion.jurisdiction}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{suggestion.category}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Article Type</span>
                <span className="font-medium text-right">{suggestion.articleType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Relevance Score</span>
                <span className="font-medium text-green-600">{suggestion.relevanceScore}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Source Quality</span>
                <span className="font-medium">{suggestion.sourceQuality}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{format(new Date(suggestion.createdAt), 'PP')}</span>
              </div>
            </CardContent>
          </Card>
          
          {suggestion.status === 'PENDING_REVIEW' && (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-medium text-center mb-4">Quick Actions</h3>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve for Draft
                </Button>
                <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                  <FileSearch className="w-4 h-4 mr-2" /> Needs More Sources
                </Button>
                <Button variant="outline" className="w-full justify-start text-gray-600 hover:bg-gray-100">
                  <XCircle className="w-4 h-4 mr-2" /> Dismiss
                </Button>
              </CardContent>
            </Card>
          )}

          {suggestion.dismissedReason && (
            <Card className="border-red-100 bg-red-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-800 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Dismissed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">{suggestion.dismissedReason}</p>
                <p className="text-xs text-red-500 mt-2">By {suggestion.dismissedBy?.fullName || 'System'}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
