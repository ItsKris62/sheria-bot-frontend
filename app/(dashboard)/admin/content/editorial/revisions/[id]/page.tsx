"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Loader2, PlayCircle, CheckCircle, XCircle, UserPlus, FileCheck2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function RevisionRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const utils = trpc.useUtils()
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [dismissReason, setDismissReason] = useState("")

  const { data, isLoading } = trpc.blogAutomation.adminGetRevisionRequest.useQuery({ id: params.id as string })
  
  const acceptMut = trpc.blogAutomation.adminAcceptRevisionRequest.useMutation({
    onSuccess: () => { toast.success("Accepted"); utils.blogAutomation.adminGetRevisionRequest.invalidate() },
    onError: (e: any) => toast.error(e.message)
  })
  
  const startMut = trpc.blogAutomation.adminStartRevisionRequest.useMutation({
    onSuccess: () => { toast.success("Started"); utils.blogAutomation.adminGetRevisionRequest.invalidate() },
    onError: (e: any) => toast.error(e.message)
  })
  
  const resolveMut = trpc.blogAutomation.adminResolveRevisionRequest.useMutation({
    onSuccess: () => { toast.success("Resolved"); utils.blogAutomation.adminGetRevisionRequest.invalidate() },
    onError: (e: any) => toast.error(e.message)
  })

  const dismissMut = trpc.blogAutomation.adminDismissRevisionRequest.useMutation({
    onSuccess: () => { toast.success("Dismissed"); utils.blogAutomation.adminGetRevisionRequest.invalidate() },
    onError: (e: any) => toast.error(e.message)
  })

  const assignMut = trpc.blogAutomation.adminAssignRevisionRequest.useMutation({
    onSuccess: () => { toast.success("Assigned"); utils.blogAutomation.adminGetRevisionRequest.invalidate() },
    onError: (e: any) => toast.error(e.message)
  })

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
  if (!data) return <div className="p-8 text-center text-red-500">Revision Request not found</div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push("/admin/content/editorial/revisions")}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Revision Request</h1>
        <span className="px-3 py-1 rounded bg-slate-100 font-mono text-sm">{data.status}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {data.status === 'PENDING_REVIEW' && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Triage Actions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => acceptMut.mutate({ id: data.id })} disabled={acceptMut.isPending}>
                <CheckCircle className="w-4 h-4 mr-2"/> Accept
              </Button>
              <div className="flex gap-2">
                <Input placeholder="Assignee ID" id="assignee" />
                <Button variant="outline" onClick={() => {
                  const val = (document.getElementById('assignee') as HTMLInputElement).value
                  if (val) assignMut.mutate({ id: data.id, assignedToId: val })
                }}>Assign</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {data.status === 'ACCEPTED' && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Work Actions</CardTitle></CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => startMut.mutate({ id: data.id })} disabled={startMut.isPending}>
                <PlayCircle className="w-4 h-4 mr-2"/> Start Work
              </Button>
            </CardContent>
          </Card>
        )}

        {(data.status === 'ACCEPTED' || data.status === 'IN_PROGRESS') && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Resolution</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Resolution notes..." value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} />
              <Button className="w-full" onClick={() => resolveMut.mutate({ id: data.id, resolutionNotes })} disabled={!resolutionNotes || resolveMut.isPending}>
                <FileCheck2 className="w-4 h-4 mr-2"/> Resolve
              </Button>
            </CardContent>
          </Card>
        )}

        {data.status !== 'DISMISSED' && data.status !== 'RESOLVED' && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Dismissal</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Dismiss reason..." value={dismissReason} onChange={(e) => setDismissReason(e.target.value)} />
              <Button variant="destructive" className="w-full" onClick={() => dismissMut.mutate({ id: data.id, reason: dismissReason })} disabled={!dismissReason || dismissMut.isPending}>
                <XCircle className="w-4 h-4 mr-2"/> Dismiss
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
