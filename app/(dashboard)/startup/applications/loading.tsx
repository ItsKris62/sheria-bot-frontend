import {
  PortalFilterBarSkeleton,
  PortalListSkeleton,
  PortalLoadingRegion,
  PortalMetricGridSkeleton,
  PortalPageHeaderSkeleton,
} from "@/components/portal/portal-page-skeleton"

export default function Loading() {
  return (
    <PortalLoadingRegion>
      <PortalPageHeaderSkeleton />
      <PortalMetricGridSkeleton className="xl:grid-cols-4" />
      <PortalFilterBarSkeleton controls={2} />
      <PortalListSkeleton rows={3} rowClassName="min-h-28" />
    </PortalLoadingRegion>
  )
}
