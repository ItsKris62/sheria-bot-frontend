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
      <PortalPageHeaderSkeleton showAction={false} />
      <PortalMetricGridSkeleton count={3} className="xl:grid-cols-3" />
      <PortalFilterBarSkeleton controls={2} />
      <PortalListSkeleton rows={3} rowClassName="min-h-36" />
    </PortalLoadingRegion>
  )
}
