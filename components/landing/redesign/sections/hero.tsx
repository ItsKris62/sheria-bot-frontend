import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComplianceQueryPreview } from "@/components/landing/redesign/product-preview/compliance-query-preview"

export function Hero() {
  return (
    <section id="hero" className="relative z-10 w-full overflow-hidden">
      <div className="relative w-full bg-white pb-10 pt-10 sm:pb-12 sm:pt-14 lg:pb-14 lg:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#09090B 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="motion-safe:animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#09090B] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              Regulatory Intelligence for African FinTech
            </div>
          </div>

          <div className="motion-safe:animate-fade-slide-up">
            <h1 className="mt-6 text-balance font-heading text-4xl font-bold leading-[1.08] tracking-tight text-[#09090B] sm:text-6xl lg:text-7xl">
              Know what the regulation says.
              <span className="mt-1 block font-semibold text-zinc-500">
                Know what your business needs to do.
              </span>
            </h1>
          </div>

          <div className="motion-safe:animate-fade-slide-up">
            <p className="mx-auto mt-6 max-w-3xl text-lg font-normal leading-relaxed text-zinc-700 sm:text-xl">
              SheriaBot turns complex African financial regulations, circulars, and statutes into instant, evidence-backed answers with primary legal citations your examiners, auditors, and board can verify.
            </p>
          </div>

          <div className="motion-safe:animate-fade-slide-up">
            <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-xl bg-[#00875A] px-7 text-base font-semibold text-white shadow-[0_10px_25px_-5px_rgba(0,135,90,0.35)] transition-all duration-300 hover:bg-[#00875A]/90 hover:shadow-[0_12px_30px_-5px_rgba(0,135,90,0.45)] focus-visible:ring-2 focus-visible:ring-[#00875A]"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Ask SheriaBot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-zinc-300 bg-white px-6 text-base font-medium text-[#09090B] shadow-sm transition-all duration-300 hover:border-zinc-400 hover:bg-zinc-50"
              >
                <Link href="#product">Explore the platform</Link>
              </Button>
            </div>
          </div>

          <div className="motion-safe:animate-fade-slide-up">
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-600 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-zinc-700" />
                Central Bank of Kenya (CBK)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-zinc-700" />
                Office of Data Protection Commissioner (ODPC)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-zinc-700" />
                Jurisdiction-aware source evidence
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full bg-gradient-to-b from-white via-zinc-950 to-[#09090B] pb-20 pt-2 sm:pb-24 lg:pb-28">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="motion-safe:animate-fade-slide-up">
            <ComplianceQueryPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
