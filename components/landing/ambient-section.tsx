import { type ReactNode } from "react"

type AmbientTone = "dark" | "green" | "light" | "gold"
type AmbientDensity = "quiet" | "normal"

const toneStyles: Record<
  AmbientTone,
  {
    base: string
    accent: string
    secondary: string
    line: string
    gridOpacity: string
  }
> = {
  dark: {
    base: "linear-gradient(180deg,#000000 0%,#030705 48%,#06110C 100%)",
    accent: "rgba(30,215,96,0.10)",
    secondary: "rgba(15,169,88,0.045)",
    line: "rgba(30,215,96,0.22)",
    gridOpacity: "opacity-[0.09]",
  },
  green: {
    base: "linear-gradient(180deg,#06110C 0%,#081D12 46%,#0D1411 100%)",
    accent: "rgba(30,215,96,0.14)",
    secondary: "rgba(34,197,94,0.075)",
    line: "rgba(30,215,96,0.28)",
    gridOpacity: "opacity-[0.11]",
  },
  light: {
    base: "linear-gradient(180deg,#0D1411 0%,#10251A 42%,rgba(245,247,246,0.08) 100%)",
    accent: "rgba(245,247,246,0.11)",
    secondary: "rgba(30,215,96,0.06)",
    line: "rgba(245,247,246,0.20)",
    gridOpacity: "opacity-[0.13]",
  },
  gold: {
    base: "linear-gradient(180deg,#0D1411 0%,#0B100D 46%,#050706 100%)",
    accent: "rgba(198,161,91,0.12)",
    secondary: "rgba(30,215,96,0.045)",
    line: "rgba(198,161,91,0.24)",
    gridOpacity: "opacity-[0.10]",
  },
}

function SectionAtmosphere({
  tone = "green",
  density = "normal",
}: {
  tone?: AmbientTone
  density?: AmbientDensity
}) {
  const style = toneStyles[tone]
  const opacity = density === "quiet" ? "opacity-55" : "opacity-80"

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: style.base }}
      />
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-[background,transform,opacity] duration-700 ease-out ${opacity}`}
        style={{
          background: `radial-gradient(circle at var(--mouse-x,50%) var(--mouse-y,30%), ${style.accent}, transparent 30%), linear-gradient(115deg, transparent 0%, ${style.secondary} 42%, transparent 76%)`,
          transform:
            "translate3d(var(--drift-x-px,0px), calc(var(--parallax-y,0px) + var(--drift-y-px,0px)), 0)",
        }}
        data-parallax={density === "quiet" ? "0.035" : "0.055"}
        data-ambient-layer
      />
      <div
        className={`pointer-events-none absolute inset-0 -z-10 ${style.gridOpacity} [background-image:linear-gradient(rgba(245,247,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,246,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,45%),black,transparent_58%)] motion-reduce:hidden`}
        style={{
          transform:
            "translate3d(var(--drift-x-px-inverse,0px), calc(var(--parallax-y,0px) + var(--drift-y-px-inverse,0px)), 0)",
        }}
        data-parallax="0.025"
        data-ambient-layer
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${style.line}, transparent)` }}
      />
    </>
  )
}

export function AmbientSection({
  children,
  className,
  id,
  tone,
  density,
}: {
  children: ReactNode
  className: string
  id?: string
  tone?: AmbientTone
  density?: AmbientDensity
}) {
  return (
    <section
      id={id}
      data-ambient-section
      className={`relative isolate overflow-hidden ${className}`}
    >
      <SectionAtmosphere tone={tone} density={density} />
      {children}
    </section>
  )
}
