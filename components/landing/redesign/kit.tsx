"use client"

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type HTMLMotionProps,
} from "motion/react"
import { type ReactNode, type CSSProperties, useRef } from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────
   Motion: scroll reveals (respects prefers-reduced-motion)
   ────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  once = true,
  ...rest
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-90px" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  className,
  delayChildren = 0.05,
  stagger = 0.09,
}: {
  children: ReactNode
  className?: string
  delayChildren?: number
  stagger?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode
  className?: string
  y?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? {} : { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────
   Liquid Glass surface
   ────────────────────────────────────────────────────────── */

export function GlassCard({
  children,
  className,
  interactive = false,
  glow = false,
  style,
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
  glow?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08]",
        "bg-white/[0.045] backdrop-blur-2xl backdrop-saturate-150",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_24px_60px_-24px_rgba(0,0,0,0.9)]",
        interactive &&
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.06]",
        glow && "ring-1 ring-brand-green/20",
        className,
      )}
    >
      {/* top refractive highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {children}
    </div>
  )
}

/* Cursor-reactive glass: subtle light that follows the pointer */
export function LiquidGlassCard({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const sx = useSpring(mx, { stiffness: 120, damping: 20 })
  const sy = useSpring(my, { stiffness: 120, damping: 20 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 100)
    my.set(((e.clientY - r.top) / r.height) * 100)
  }

  const light = useTransform<number, string>(
    [sx, sy] as unknown as MotionValue<number>[],
    ([lx, ly]: number[]) =>
      `radial-gradient(360px circle at ${lx}% ${ly}%, rgba(34,197,94,0.14), transparent 55%)`,
  )

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/[0.08]",
        "bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_40px_90px_-40px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: light }}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {children}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Small building blocks
   ────────────────────────────────────────────────────────── */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-brand-green/90",
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-brand-green shadow-[0_0_10px_2px_rgba(34,197,94,0.6)]" />
      {children}
    </span>
  )
}

export function SectionShell({
  children,
  className,
  id,
  atmosphere,
}: {
  children: ReactNode
  className?: string
  id?: string
  /** position of the ambient green glow, or "none" */
  atmosphere?: "top" | "center" | "left" | "right" | "none"
}) {
  const glow: Record<string, string> = {
    top: "radial-gradient(1100px 420px at 50% -10%, rgba(34,197,94,0.10), transparent 70%)",
    center: "radial-gradient(900px 600px at 50% 40%, rgba(34,197,94,0.07), transparent 70%)",
    left: "radial-gradient(760px 620px at 8% 30%, rgba(34,197,94,0.09), transparent 70%)",
    right: "radial-gradient(760px 620px at 92% 30%, rgba(34,197,94,0.09), transparent 70%)",
    none: "none",
  }
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24", className)}
    >
      {atmosphere && atmosphere !== "none" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glow[atmosphere] }}
        />
      )}
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
