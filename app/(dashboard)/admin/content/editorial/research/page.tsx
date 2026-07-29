"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function EditorialResearchPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = trpc.blogAutomation.adminListResearchPackVersions.useQuery({ page, limit: 20 })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Research Packs</h1>
        <p className="text-muted-foreground mt-2">Manage compiled research materials for content generation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Packs</CardTitle>
          <CardDescription>Recently generated research packs.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : data?.packs.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No research packs found.</div>
          ) : (
            <div className="space-y-4">
              {data?.packs.map((pack: any) => (
                <div key={pack.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/content/editorial/research/${pack.id}`} className="font-medium text-lg hover:underline text-primary">
                        {pack.blogPost?.title || `Pack ${pack.id.slice(0, 8)}`}
                      </Link>
                      <Badge variant="outline">v{pack.version}</Badge>
                      <Badge variant={pack.reviewStatus === 'COMPLETE' ? 'default' : 'outline'}>{pack.reviewStatus}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
                      <span>Created {format(new Date(pack.createdAt), 'PP p')}</span>
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
