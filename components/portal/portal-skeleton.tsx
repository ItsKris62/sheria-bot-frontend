import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface PortalSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variant preset for quick layout reservation. */
  variant?: "card" | "text" | "button" | "avatar" | "custom"
}

const variantDimensions: Record<NonNullable<PortalSkeletonProps["variant"]>, string> = {
  card: "h-32 w-full rounded-lg",
  text: "h-4 w-3/4 rounded",
  button: "h-9 w-28 rounded-md",
  avatar: "h-10 w-10 rounded-full",
  custom: "",
}

export function PortalSkeleton({
  variant = "custom",
  className,
  ...props
}: PortalSkeletonProps) {
  return (
    <Skeleton
      className={cn(
        "bg-[var(--portal-surface-solid)]/60 animate-pulse border border-[var(--portal-border)]/40",
        variantDimensions[variant],
        className
      )}
      {...props}
    />
  )
}
