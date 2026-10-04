import {
  PortalLoadingRegion,
  PortalMetricGridSkeleton,
  PortalPageHeaderSkeleton,
  PortalPanelSkeleton,
} from "@/components/portal/portal-page-skeleton"

export default function Loading() {
  return (
    <PortalLoadingRegion>
      <PortalPageHeaderSkeleton showAction={false} />
      <PortalMetricGridSkeleton />
      <div className="grid gap-6 lg:grid-cols-3">
        <PortalPanelSkeleton className="lg:col-span-2" />
        <PortalPanelSkeleton />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <PortalPanelSkeleton />
        <PortalPanelSkeleton />
      </div>
    </PortalLoadingRegion>
  )
}
