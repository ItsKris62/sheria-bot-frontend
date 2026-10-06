import Image from "next/image"
import {
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Copy,
  MapPin,
  Scale,
  Send,
  SlidersHorizontal,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { JurisdictionBadge } from "@/components/compliance/query/jurisdiction-badge"
import { AUDITED_JURISDICTIONS, jurisdictionLabel } from "@/lib/jurisdictions"

const PREVIEW_JURISDICTION = "KE" as const
const PREVIEW_COUNTRY = jurisdictionLabel(PREVIEW_JURISDICTION)

const previewCitations = [
  {
    title: "Applicable regulatory source",
    section: "Relevant licensing provision",
    evidence: "Source evidence returned by SheriaBot is shown here for review.",
  },
  {
    title: "Supporting regulatory document",
    section: "Related application guidance",
    evidence: "Supporting context is presented alongside the answer when available.",
  },
] as const

export function ComplianceQueryPreview() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#050706] text-foreground shadow-[0_32px_90px_-28px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)] sm:rounded-3xl"
      aria-label="Illustrative preview of the SheriaBot Compliance Query workspace"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/35 to-transparent" />

      <div className="border-b border-border/60 bg-card/70 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Compliance Query</h2>
              <span className="rounded-full border border-border/70 bg-muted/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Illustrative preview
              </span>
            </div>
            <p className="mt-1 hidden max-w-xl text-xs text-muted-foreground sm:block">
              Ask regulatory questions and receive evidence-backed guidance from verified sources.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[11px] shadow-xs">
            <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
            <span className="font-semibold text-green-400">Verified Legal Corpus</span>
            <span className="text-muted-foreground/50" aria-hidden="true">•</span>
            <span className="text-muted-foreground">{PREVIEW_COUNTRY}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/70 p-3 shadow-xs sm:p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-green-500/25 bg-green-500/10 text-green-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground sm:text-sm">Ask SheriaBot about {PREVIEW_COUNTRY} law</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">The selected jurisdiction shapes the answer and its sources.</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-card px-2.5 py-2 text-xs text-foreground" aria-label={`${PREVIEW_COUNTRY} selected`}>
            <JurisdictionBadge code={PREVIEW_JURISDICTION} showLabel className="h-5 border-0 bg-transparent px-0" />
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Available Compliance Query jurisdictions">
          <span className="mr-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Available jurisdictions
          </span>
          {AUDITED_JURISDICTIONS.map(({ code }) => (
            <JurisdictionBadge
              key={code}
              code={code}
              showLabel
              className={code === PREVIEW_JURISDICTION ? "border-green-400/50 bg-green-500/15" : undefined}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-5 p-3 sm:p-5 lg:grid-cols-12 lg:gap-6 lg:p-6">
        <div className="min-w-0 lg:col-span-9">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-sm">
            <div className="space-y-4 p-3.5 sm:p-5">
              <div className="flex justify-end motion-safe:animate-fade-slide-up">
                <div className="max-w-[94%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-primary-foreground shadow-sm sm:max-w-[82%] sm:px-4 sm:py-3">
                  <p className="text-xs font-medium leading-relaxed sm:text-sm">
                    What licensing requirements apply to payment service providers in Kenya?
                  </p>
                </div>
              </div>

              <article className="rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm motion-safe:animate-fade-slide-up sm:p-5">
                <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 shadow-xs">
                    <Image
                      src="/favicon-logo.png"
                      alt=""
                      width={28}
                      height={28}
                      className="h-4 w-4 rounded-full object-contain"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-foreground">SheriaBot</span>
                    <span className="ml-2 text-[10px] text-muted-foreground">Regulatory Guidance</span>
                  </div>
                  <JurisdictionBadge code={PREVIEW_JURISDICTION} showLabel className="ml-auto h-5 px-1.5" />
                </div>

                <div className="py-3.5 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  <p>
                    SheriaBot organizes the applicable licensing framework into a clear summary, then links each point to the regulatory material used to support it.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Review the referenced documents below before using the guidance for a compliance decision.
                  </p>
                </div>

                <div className="border-t border-amber-500/20 pt-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                      <Scale className="h-3.5 w-3.5" aria-hidden="true" />
                      Referenced Documents ({previewCitations.length}):
                    </p>
                    <span className="text-[10px] text-muted-foreground">Preview fixture</span>
                  </div>
                  <p className="mt-1.5 hidden text-[10px] leading-relaxed text-muted-foreground sm:block">
                    Source cards show jurisdiction, verification state, relevance, document context, and supporting evidence.
                  </p>

                  <div className="mt-2.5 space-y-2">
                    {previewCitations.map((citation, index) => (
                      <div
                        key={citation.title}
                        className={`${index === 1 ? "hidden sm:flex" : "flex"} items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 sm:p-3`}
                      >
                        <Scale className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground">{citation.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <JurisdictionBadge code={PREVIEW_JURISDICTION} className="h-5 px-1.5" />
                            <span className="rounded-full border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                              Verified in corpus
                            </span>
                            <span className="text-[10px] text-muted-foreground">Relevant source</span>
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-muted-foreground sm:text-xs">{citation.section}</p>
                          <p className="mt-1.5 line-clamp-2 rounded-md border border-border/30 bg-background/40 p-1.5 text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
                            {citation.evidence}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 border-t border-border/40 pt-2.5 text-muted-foreground" aria-label="Response actions shown for demonstration">
                  <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px]"><Copy className="h-3.5 w-3.5" aria-hidden="true" />Copy</span>
                  <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px]"><Bookmark className="h-3.5 w-3.5" aria-hidden="true" />Save</span>
                  <span className="ml-auto rounded-md p-1.5"><ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  <span className="rounded-md p-1.5"><ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" /></span>
                </div>
              </article>
            </div>

            <div className="space-y-2.5 border-t border-border/50 bg-card/80 p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
                    Detail Level:
                  </span>
                  <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
                    <span className="rounded-md border border-green-500/30 bg-green-500/15 px-2 py-1 font-medium text-green-400">Standard <span className="opacity-70">(1 credit)</span></span>
                    <span className="hidden rounded-md px-2 py-1 text-muted-foreground sm:inline">Detailed <span className="opacity-70">(2 credits)</span></span>
                  </div>
                </div>
              </div>
              <div className="flex min-h-11 items-center rounded-xl border border-border/70 bg-background/90 pl-3.5 pr-1.5 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground sm:text-sm">Ask a compliance question about {PREVIEW_COUNTRY}...</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-hidden="true">
                  <Send className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden space-y-4 lg:col-span-3 lg:block" aria-label="Compliance Query supporting information">
          <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-green-400" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">Suggested for {PREVIEW_COUNTRY}</p>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Curated compliance questions</p>
            <div className="mt-3 space-y-2">
              {["Licensing", "Data Protection", "AML / KYC"].map((topic) => (
                <div key={topic} className="rounded-full border border-border/70 bg-background/60 px-3 py-2 text-xs font-medium text-foreground">
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-green-400">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Legal Corpus Coverage</p>
                <p className="text-[10px] text-muted-foreground">Multi-jurisdiction regulatory material</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {AUDITED_JURISDICTIONS.map(({ code }) => (
                <JurisdictionBadge key={code} code={code} />
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Answers cite indexed sources when the evidence is strong enough.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
