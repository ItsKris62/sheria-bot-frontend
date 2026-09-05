import { Skeleton } from "@/components/ui/skeleton"

export default function GenericBlogLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4 md:p-6" data-testid="generic-blog-loading">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 flex-1" />
        </div>
        <div className="space-y-3 pt-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
