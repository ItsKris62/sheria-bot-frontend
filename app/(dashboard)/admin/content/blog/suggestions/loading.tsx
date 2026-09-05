import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function BlogSuggestionsLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="suggestions-loading-skeleton">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Skeleton className="h-4 w-24" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-44" />
        </div>
      </div>

      {/* Filter Bar & Table Skeleton */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-48 flex-1 sm:flex-none" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
