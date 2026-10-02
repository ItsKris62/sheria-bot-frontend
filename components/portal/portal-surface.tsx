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
  shell: "portal-surface-shell border-b transition-colors bg-white",
  raised: "portal-surface-raised bg-white border border-[var(--portal-border)] rounded-xl shadow-[0_1px_2px_rgba(16,24,20,0.04)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[var(--portal-border-strong)] hover:shadow-[0_2px_4px_rgba(16,24,20,0.06)] motion-reduce:transition-none",
  solid: "portal-surface-solid bg-[var(--portal-surface-solid)] border border-[var(--portal-border)] rounded-lg transition-colors duration-200 ease-out hover:border-[var(--portal-border-strong)] motion-reduce:transition-none",
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
