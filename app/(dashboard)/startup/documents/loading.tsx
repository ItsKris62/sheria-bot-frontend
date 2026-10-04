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
      <PortalMetricGridSkeleton />
      <PortalFilterBarSkeleton controls={3} />
      <PortalTableSkeleton rows={6} />
    </PortalLoadingRegion>
  )
}
