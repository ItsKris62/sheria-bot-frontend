import { Skeleton } from "@/components/ui/skeleton"
import { PortalLoadingRegion } from "@/components/portal/portal-page-skeleton"

export default function GenericBlogLoading() {
  return (
    <PortalLoadingRegion className="p-4 md:p-6" data-testid="generic-blog-loading">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-4 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
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
    </PortalLoadingRegion>
  )
}
