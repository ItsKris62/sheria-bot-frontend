"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const STATUS_STYLES: Record<string, string> = {
  PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-green-100 text-green-700",
  DISMISSED: "bg-gray-100 text-gray-700",
}

export default function EditorialRevisionsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = trpc.blogAutomation.adminListRevisionRequests.useQuery({ page, limit: 20 })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revision Requests</h1>
        <p className="text-muted-foreground mt-2">Manage requested edits and corrections for content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revision Requests</CardTitle>
          <CardDescription>Tasks requiring editorial updates.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : data?.requests.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No revision requests found.</div>
          ) : (
            <div className="space-y-4">
              {data?.requests.map((req: any) => (
                <div key={req.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/content/editorial/revisions/${req.id}`} className="font-medium text-lg hover:underline text-primary">
                        {req.blogPost?.title || `Request ${req.id.slice(0, 8)}`}
                      </Link>
                      <Badge variant="outline" className={STATUS_STYLES[req.status]}>
                        {req.status}
                      </Badge>
                      <Badge variant="secondary">{req.priority} PRIORITY</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{req.reason}</p>
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
                      <span>Created {format(new Date(req.createdAt), 'PP p')}</span>
                      {req.assignedTo && <span>Assigned to {req.assignedTo.fullName}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
