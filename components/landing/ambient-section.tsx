import { type ReactNode } from "react"

function SectionAtmosphere({
  tone = "green",
  density = "normal",
}: {
  tone?: "green" | "gold"
  density?: "quiet" | "normal"
}) {
  const accent =
    tone === "gold"
      ? "rgba(198,161,91,0.12)"
      : "rgba(30,215,96,0.11)"
  const secondary =
    tone === "gold"
      ? "rgba(30,215,96,0.045)"
      : "rgba(15,169,88,0.055)"
  const opacity = density === "quiet" ? "opacity-55" : "opacity-80"

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-[background,transform,opacity] duration-700 ease-out ${opacity}`}
        style={{
          background: `radial-gradient(circle at var(--mouse-x,50%) var(--mouse-y,30%), ${accent}, transparent 30%), linear-gradient(115deg, transparent 0%, ${secondary} 42%, transparent 76%)`,
          transform:
            "translate3d(var(--drift-x-px,0px), calc(var(--parallax-y,0px) + var(--drift-y-px,0px)), 0)",
        }}
        data-parallax={density === "quiet" ? "0.035" : "0.055"}
        data-ambient-layer
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(245,247,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,246,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,45%),black,transparent_58%)] motion-reduce:hidden"
        style={{
          transform:
            "translate3d(var(--drift-x-px-inverse,0px), calc(var(--parallax-y,0px) + var(--drift-y-px-inverse,0px)), 0)",
        }}
        data-parallax="0.025"
        data-ambient-layer
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-brand-green/25 to-transparent" />
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
  tone?: "green" | "gold"
  density?: "quiet" | "normal"
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
