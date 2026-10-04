import {
  PortalFilterBarSkeleton,
  PortalListSkeleton,
  PortalLoadingRegion,
  PortalPageHeaderSkeleton,
} from "@/components/portal/portal-page-skeleton"

export default function Loading() {
  return (
    <PortalLoadingRegion>
      <PortalPageHeaderSkeleton />
      <PortalFilterBarSkeleton controls={1} />
      <PortalListSkeleton rows={6} />
    </PortalLoadingRegion>
  )
}
