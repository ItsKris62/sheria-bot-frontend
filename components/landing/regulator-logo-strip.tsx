import Image from "next/image"
import { PRIMARY_REGULATORS, SECONDARY_REGULATORS } from "@/lib/data/regulators"
import type { Regulator } from "@/lib/data/regulators"

interface RegulatorLogoStripProps {
  compact?: boolean
}

interface LogoCardProps {
  regulator: Regulator
  width: number
  height: number
  compact: boolean
}

function LogoCard({ regulator, width, height, compact }: LogoCardProps) {
  return (
    <a
      href={regulator.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2.5 cursor-pointer"
      aria-label={`${regulator.name} — opens in new tab`}
    >
      {/*
        Force white backing card so dark logos are always readable
        regardless of the app's dark theme. Regulator logos are designed
        for white/light backgrounds — this is the correct approach.
      */}
      <div
        className="
          flex items-center justify-center
          rounded-xl bg-white
          border border-black/6
          shadow-md shadow-black/25
          transition-all duration-300 ease-out
          group-hover:shadow-xl group-hover:shadow-primary/25
          group-hover:scale-[1.05] group-hover:-translate-y-1
          group-hover:border-primary/30
        "
        style={{
          padding: compact ? "10px 14px" : "12px 18px",
          minWidth: width + 20,
          minHeight: height + 16,
        }}
      >
        <Image
          src={regulator.logo}
          alt={regulator.name}
          width={width}
          height={height}
          className="object-contain"
        />
      </div>

      {/* Label below the card */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-xs font-semibold text-foreground tracking-wide leading-none">
          {regulator.acronym}
        </span>
        {!compact && (
          <span
            className="text-[10px] text-muted-foreground leading-tight"
            style={{ maxWidth: width + 20 }}
          >
            {regulator.scope}
          </span>
        )}
      </div>
    </a>
  )
}

export function RegulatorLogoStrip({ compact = false }: RegulatorLogoStripProps) {
  const primaryWidth = compact ? 90 : 120
  const primaryHeight = compact ? 42 : 56
  const secondaryWidth = compact ? 68 : 90
  const secondaryHeight = compact ? 32 : 42
  const sectionPadding = compact ? "py-8" : "py-14"

  return (
    <section
      className={`animate-fade-in w-full ${sectionPadding} border-y border-border/40`}
      style={{
        background:
          "linear-gradient(to bottom, hsl(0 0% 6% / 0.6), hsl(0 0% 8% / 0.8), hsl(0 0% 6% / 0.6))",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!compact && (
          /* Section label with decorative side rules */
          <div className="mb-10 flex items-center justify-center gap-4">
            <span className="h-px flex-1 max-w-[120px] bg-border/40" />
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] shrink-0 text-primary"
            >
              Regulations We Cover
            </p>
            <span className="h-px flex-1 max-w-[120px] bg-border/40" />
          </div>
        )}

        {/* Primary regulators — desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-6 lg:gap-8">
          {PRIMARY_REGULATORS.map((regulator) => (
            <LogoCard
              key={regulator.id}
              regulator={regulator}
              width={primaryWidth}
              height={primaryHeight}
              compact={compact}
            />
          ))}
        </div>

        {/* Primary regulators — mobile */}
        <div className="grid grid-cols-2 gap-5 place-items-center md:hidden">
          {PRIMARY_REGULATORS.map((regulator) => (
            <LogoCard
              key={regulator.id}
              regulator={regulator}
              width={primaryWidth}
              height={primaryHeight}
              compact={compact}
            />
          ))}
        </div>

        {/* Divider with "Also covers" label */}
        {!compact ? (
          <div className="my-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-border/20" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50 shrink-0">
              Also covers
            </span>
            <span className="h-px flex-1 bg-border/20" />
          </div>
        ) : (
          <div className="my-5 border-t border-border/20" />
        )}

        {/* Secondary regulators — desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-5 lg:gap-6">
          {SECONDARY_REGULATORS.map((regulator) => (
            <LogoCard
              key={regulator.id}
              regulator={regulator}
              width={secondaryWidth}
              height={secondaryHeight}
              compact={compact}
            />
          ))}
        </div>

        {/* Secondary regulators — mobile */}
        <div className="grid grid-cols-2 gap-4 place-items-center md:hidden">
          {SECONDARY_REGULATORS.map((regulator) => (
            <LogoCard
              key={regulator.id}
              regulator={regulator}
              width={secondaryWidth}
              height={secondaryHeight}
              compact={compact}
            />
          ))}
        </div>

        {!compact && (
          <p className="mt-10 text-center text-[11px] italic text-muted-foreground/50">
            SheriaBot covers regulations issued by these bodies and does not imply endorsement by
            any regulatory authority.
          </p>
        )}
      </div>
    </section>
  )
}
