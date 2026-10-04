import {
  PortalFilterBarSkeleton,
  PortalLoadingRegion,
  PortalMetricGridSkeleton,
  PortalPageHeaderSkeleton,
  PortalTableSkeleton,
} from "@/components/portal/portal-page-skeleton"

export default function Loading() {
  return (
    <PortalLoadingRegion>
      <PortalPageHeaderSkeleton />
      <PortalMetricGridSkeleton count={3} className="xl:grid-cols-3" />
      <PortalFilterBarSkeleton controls={2} />
      <PortalTableSkeleton rows={7} />
    </PortalLoadingRegion>
  )
}
