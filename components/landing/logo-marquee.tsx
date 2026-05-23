"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoItem {
  name: string
  abbreviation: string
  logo?: string
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
            <div
              className="
                flex h-20 min-w-[172px] items-center justify-center gap-4 rounded-lg
                border border-white/70 bg-gradient-to-br from-white via-zinc-100 to-zinc-300 px-6
                shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_30px_rgba(0,0,0,0.22)]
                ring-1 ring-black/5 transition-all duration-300
                hover:-translate-y-0.5 hover:border-brand-green/35 hover:from-white hover:to-zinc-200
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_36px_rgba(0,0,0,0.28)]
              "
              title={logo.name}
            >
              {logo.logo ? (
                <Image
                  src={logo.logo}
                  alt={logo.name}
                  width={112}
                  height={48}
                  className="max-h-12 w-auto object-contain"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-300 bg-white/80 text-sm font-semibold text-zinc-700 shadow-sm">
                  {logo.abbreviation.slice(0, 2)}
                </div>
              )}
              <span className="text-sm font-semibold text-zinc-700 whitespace-nowrap transition-colors group-hover:text-zinc-950">
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
