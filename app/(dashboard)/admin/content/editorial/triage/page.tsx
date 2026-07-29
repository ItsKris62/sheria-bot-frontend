"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function EditorialTriagePage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = trpc.blogAutomation.adminListEditorialTriageRuns.useQuery({ page, limit: 20 })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editorial Triage</h1>
        <p className="text-muted-foreground mt-2">Manage AI-driven content triage evaluations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Triage Runs</CardTitle>
          <CardDescription>Recent editorial triage evaluations.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : data?.runs.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No triage runs found.</div>
          ) : (
            <div className="space-y-4">
              {data?.runs.map((run: any) => (
                <div key={run.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/content/editorial/triage/${run.id}`} className="font-medium text-lg hover:underline text-primary">
                        {run.sourceItem?.title || `Run ${run.id.slice(0, 8)}`}
                      </Link>
                      <Badge variant="outline">{run.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{run.reason || "No reason provided."}</p>
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
                      <span>{format(new Date(run.createdAt), 'PP p')}</span>
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
