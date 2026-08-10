import { AmbientSection } from "@/components/landing/ambient-section"
import { HeroContent } from "@/components/landing/hero-content"
import { HeroVisual } from "@/components/landing/hero-visual"

export function HomeHero() {
  return (
    <AmbientSection className="pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:gap-10 lg:px-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(520px,1.14fr)] xl:gap-14">
        <HeroContent />
        <HeroVisual />
      </div>
    </AmbientSection>
  )
}
