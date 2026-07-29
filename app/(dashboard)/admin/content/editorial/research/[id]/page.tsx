"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, Check, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function ResearchPackDetailPage() {
  const params = useParams()
  const router = useRouter()

  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.blogAutomation.adminGetResearchPack.useQuery({ id: params.id as string })

  const reviewMutation = trpc.blogAutomation.adminReviewResearchPack.useMutation({
    onSuccess: () => {
      toast.success("Review submitted successfully")
      utils.blogAutomation.adminGetResearchPack.invalidate({ id: params.id as string })
      setRejectDialogOpen(false)
    },
    onError: (err) => {
      toast.error("Failed to submit review", { description: err.message })
    }
  })

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectNote, setRejectNote] = useState("")

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
  if (!data) return <div className="p-8 text-center text-red-500">Research Pack not found</div>

  const canReview = data.status === 'COMPLETE' && data.reviewerStatus === 'PENDING'

  const handleApprove = () => {
    if (confirm("Are you sure you want to approve this research pack?")) {
      reviewMutation.mutate({ id: data.id, status: 'REVIEWED' })
    }
  }

  const handleReject = () => {
    if (!rejectNote.trim()) {
      toast.error("Note required", { description: "Please provide a revision note" })
      return
    }
    reviewMutation.mutate({ id: data.id, status: 'REJECTED', note: rejectNote })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.push("/admin/content/editorial/research")}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        {canReview && (
          <div className="flex gap-2">
            <Button variant="outline" className="text-red-600" onClick={() => setRejectDialogOpen(true)} disabled={reviewMutation.isPending}>
              <X className="w-4 h-4 mr-2" /> Reject / Request Revision
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={reviewMutation.isPending}>
              <Check className="w-4 h-4 mr-2" /> Approve
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Research Pack {data.id.slice(0, 8)}</h1>
        <div className="text-right text-sm text-muted-foreground">
          <div>Status: <span className="font-semibold text-foreground">{data.reviewerStatus}</span></div>
          {data.reviewedBy && <div>Reviewed by: {data.reviewedBy.fullName}</div>}
          {data.reviewedAt && <div>Reviewed at: {new Date(data.reviewedAt).toLocaleString()}</div>}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Research Objective</CardTitle></CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{data.researchObjective}</div>
        </CardContent>
      </Card>

      {data.executiveSummary && (
        <Card>
          <CardHeader><CardTitle>Executive Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{data.executiveSummary}</div>
          </CardContent>
        </Card>
      )}

      {data.evidenceGaps && data.evidenceGaps.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Evidence Gaps</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {data.evidenceGaps.map((gap: string, i: number) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject or Request Revision</DialogTitle>
            <DialogDescription>
              Provide a note explaining what needs to be revised. This will be logged for audit purposes.
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            value={rejectNote} 
            onChange={e => setRejectNote(e.target.value)} 
            placeholder="What is wrong with this research pack?" 
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={reviewMutation.isPending}>
              {reviewMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
