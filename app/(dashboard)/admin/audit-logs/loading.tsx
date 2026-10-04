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
      <PortalFilterBarSkeleton controls={5} />
      <PortalTableSkeleton rows={8} />
    </PortalLoadingRegion>
  )
}
