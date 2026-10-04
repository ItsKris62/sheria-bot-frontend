"use client"

import { useCallback, useRef, type ComponentProps, type FocusEvent, type MouseEvent, type ReactNode } from "react"
import Link, { useLinkStatus } from "next/link"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type NavigationPrefetchStrategy = "default" | "intent" | "none"

type PendingNavigationLinkProps = ComponentProps<typeof Link> & {
  pendingLabel: string
  pendingTone?: "sidebar" | "surface"
  prefetchStrategy?: NavigationPrefetchStrategy
}

function PendingNavigationIndicator({
  label,
  tone,
}: {
  label: string
  tone: NonNullable<PendingNavigationLinkProps["pendingTone"]>
}) {
  const { pending } = useLinkStatus()

  if (!pending) return null

  return (
    <span
      data-navigation-pending="true"
      aria-busy="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-[inherit] ring-1 ring-inset",
          tone === "sidebar"
            ? "bg-white/[0.06] ring-white/10"
            : "bg-[var(--portal-surface-hover)] ring-[var(--portal-border)]",
        )}
      />
      <LoaderCircle
        aria-hidden="true"
        className={cn(
          "absolute right-1 top-1 h-3 w-3 animate-spin motion-reduce:animate-none",
          tone === "sidebar" ? "text-[var(--portal-sidebar-text)]" : "text-[var(--portal-text-secondary)]",
        )}
      />
      <span className="sr-only">Opening {label}</span>
    </span>
  )
}

export function PendingNavigationLink({
  children,
  href,
  onFocus,
  onMouseEnter,
  prefetch,
  pendingLabel,
  pendingTone = "sidebar",
  prefetchStrategy = "default",
  ...props
}: PendingNavigationLinkProps & { children: ReactNode }) {
  const router = useRouter()
  const prefetchedHref = useRef<string | null>(null)
  const prefetchOnIntent = useCallback(() => {
    if (
      prefetchStrategy !== "intent" ||
      typeof href !== "string" ||
      prefetchedHref.current === href
    ) {
      return
    }

    prefetchedHref.current = href
    router.prefetch(href)
  }, [href, prefetchStrategy, router])
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(event)
    if (!event.defaultPrevented) prefetchOnIntent()
  }, [onMouseEnter, prefetchOnIntent])
  const handleFocus = useCallback((event: FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(event)
    if (!event.defaultPrevented) prefetchOnIntent()
  }, [onFocus, prefetchOnIntent])

  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetchStrategy === "default" ? prefetch : false}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
    >
      <PendingNavigationIndicator label={pendingLabel} tone={pendingTone} />
      {children}
    </Link>
  )
}
