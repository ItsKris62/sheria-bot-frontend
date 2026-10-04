import {
  PortalLoadingRegion,
  PortalPageHeaderSkeleton,
} from "@/components/portal/portal-page-skeleton"
import { PortalSkeleton } from "@/components/portal/portal-skeleton"

export default function Loading() {
  return (
    <PortalLoadingRegion>
      <PortalPageHeaderSkeleton showAction={false} />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-5 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5 lg:col-span-8">
          <div className="space-y-2">
            <PortalSkeleton variant="text" className="h-6 w-48" />
            <PortalSkeleton variant="text" className="w-3/4" />
          </div>
          <PortalSkeleton variant="card" className="h-72" />
          <PortalSkeleton variant="custom" className="h-28 w-full rounded-lg" />
          <div className="flex justify-end">
            <PortalSkeleton variant="button" className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-4 lg:col-span-4">
          <PortalSkeleton variant="card" className="h-52" />
          <PortalSkeleton variant="card" className="h-64" />
        </div>
      </div>
    </PortalLoadingRegion>
  )
}
