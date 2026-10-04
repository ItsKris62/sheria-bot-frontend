import {
  PortalFilterBarSkeleton,
  PortalLoadingRegion,
  PortalPageHeaderSkeleton,
  PortalTableSkeleton,
} from "@/components/portal/portal-page-skeleton"

export default function Loading() {
  return (
    <PortalLoadingRegion>
      <PortalPageHeaderSkeleton />
      <PortalFilterBarSkeleton controls={1} />
      <PortalTableSkeleton rows={6} />
    </PortalLoadingRegion>
  )
}
