"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditorialFreshnessPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = trpc.blogAutomation.adminListFreshnessReviews.useQuery({ page, limit: 20 })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Freshness Reviews</h1>
        <p className="text-muted-foreground mt-2">Manage content freshness and decay evaluations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Freshness Reviews</CardTitle>
          <CardDescription>Automated content decay and obsolescence reviews.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : data?.reviews.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No freshness reviews found.</div>
          ) : (
            <div className="space-y-4">
              {data?.reviews.map((review: any) => (
                <div key={review.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/content/blog/${review.blogPost?.id}`} className="font-medium text-lg hover:underline text-primary">
                        {review.blogPost?.title || `Review ${review.id.slice(0, 8)}`}
                      </Link>
                      <Badge variant={review.isStale ? "destructive" : "outline"}>
                        {review.isStale ? "STALE" : "FRESH"}
                      </Badge>
                    </div>
                    {review.staleReason && (
                      <p className="text-sm text-red-600 mt-2 line-clamp-2">{review.staleReason}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
                      <span>Evaluated {format(new Date(review.createdAt), 'PP p')}</span>
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
