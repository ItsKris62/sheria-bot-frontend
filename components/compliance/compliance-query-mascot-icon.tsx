"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export const COMPLIANCE_QUERY_MASCOT_PATH = "/icons/compliance-query-search-icon.png"

export function getComplianceQueryMascotUrl(): string {
  return COMPLIANCE_QUERY_MASCOT_PATH
}

export interface ComplianceQueryMascotIconProps {
  className?: string
  alt?: string
}

export function ComplianceQueryMascotIcon({
  className,
  alt = "",
}: ComplianceQueryMascotIconProps) {
  const [hasError, setHasError] = useState(false)
  const url = getComplianceQueryMascotUrl()

  if (hasError || !url) {
    return <Search className={className} aria-hidden="true" />
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={url}
      alt={alt}
      aria-hidden={alt === "" ? "true" : undefined}
      onError={() => setHasError(true)}
      className={cn("object-contain [image-rendering:pixelated] shrink-0", className)}
    />
  )
}
