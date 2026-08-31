import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface PortalSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Surface hierarchy level:
   * - `shell`: Level 1 glass (header, sidebar, navigation drawers) with restrained backdrop blur.
   * - `raised`: Level 2 raised portal card surface (translucent background, subtle border).
   * - `solid`: Level 3 solid surface for nested lists, sub-cards, form controls, and tables.
   */
  variant?: "shell" | "raised" | "solid"
  /** Merge properties onto the immediate child element instead of rendering a wrapper `div`. */
  asChild?: boolean
}

const variantStyles: Record<NonNullable<PortalSurfaceProps["variant"]>, string> = {
  shell: "portal-surface-shell border-b transition-colors",
  raised: "portal-surface-raised transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-[var(--portal-accent-border)] hover:bg-[var(--portal-surface-hover)] hover:shadow-[0_10px_30px_-24px_var(--portal-accent)] motion-reduce:transform-none motion-reduce:transition-none",
  solid: "portal-surface-solid transition-[background-color,border-color,color] duration-200 ease-out hover:border-[var(--portal-border-strong)] motion-reduce:transition-none",
}

export const PortalSurface = React.forwardRef<HTMLDivElement, PortalSurfaceProps>(
  ({ className, variant = "raised", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      />
    )
  }
)

PortalSurface.displayName = "PortalSurface"
