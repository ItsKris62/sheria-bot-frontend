"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface LogoItem {
  name: string
  abbreviation: string
}

interface LogoMarqueeProps {
  logos: LogoItem[]
  speed?: "slow" | "normal" | "fast"
  pauseOnHover?: boolean
  direction?: "left" | "right"
  className?: string
}

const SPEED_MAP = {
  slow: 60,
  normal: 40,
  fast: 25,
}

export function LogoMarquee({
  logos,
  speed = "normal",
  pauseOnHover = true,
  direction = "left",
  className,
}: LogoMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    addAnimation()
  }, [])

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      // Duplicate items for seamless loop
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      )
    }
  }

  const getSpeed = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-duration",
        `${SPEED_MAP[speed]}s`
      )
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-10 max-w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-8 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {logos.map((logo, idx) => (
          <li
            key={`${logo.abbreviation}-${idx}`}
            className="group relative flex items-center justify-center"
          >
            <div className="flex h-14 min-w-[140px] items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 transition-all duration-300 hover:border-brand-green/30 hover:bg-surface-overlay">
              {/* Logo placeholder - monogram style */}
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-green/10 text-brand-green font-semibold text-sm">
                {logo.abbreviation.slice(0, 2)}
              </div>
              <span className="text-sm font-medium text-foreground-muted whitespace-nowrap transition-colors group-hover:text-foreground">
                {logo.abbreviation}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Compact version for inline use
export function LogoMarqueeCompact({
  logos,
  className,
}: {
  logos: LogoItem[]
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-center gap-2 flex-wrap", className)}>
      <span className="text-xs text-foreground-muted uppercase tracking-wider mr-2">
        Trusted by
      </span>
      {logos.slice(0, 6).map((logo) => (
        <div
          key={logo.abbreviation}
          className="flex h-7 items-center justify-center rounded border border-border/50 bg-surface/50 px-3 text-xs font-medium text-foreground-muted"
        >
          {logo.abbreviation}
        </div>
      ))}
    </div>
  )
}
