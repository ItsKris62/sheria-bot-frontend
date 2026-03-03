"use client"

import React, { useEffect, useRef, useState } from "react"
import { X, Shield, FileText, ChevronUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PrivacyPolicyContent } from "./privacy-policy-content"
import { TermsOfServiceContent } from "./terms-of-service-content"
import { cn } from "@/lib/utils"

export type LegalDocumentType = "terms" | "privacy"

interface LegalDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: LegalDocumentType
  /** If true, shows an "Accept & Continue" button instead of just "Close" */
  onAccept?: () => void
}

const META: Record<
  LegalDocumentType,
  {
    title: string
    subtitle: string
    icon: React.ElementType
    effectiveDate: string
    lastUpdated: string
    sections: string[]
  }
> = {
  terms: {
    title: "Terms of Service",
    subtitle: "SheriaBot Technologies Limited",
    icon: FileText,
    effectiveDate: "3 March 2026",
    lastUpdated: "3 March 2026",
    sections: [
      "Definitions",
      "Account Registration",
      "Acceptable Use",
      "Payment Terms",
      "Intellectual Property",
      "AI Disclaimers",
      "Disclaimer of Warranties",
      "Limitation of Liability",
      "Indemnification",
      "Termination",
      "Data Protection",
      "Confidentiality",
      "Modifications",
      "Governing Law",
      "General Provisions",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "SheriaBot Technologies Limited",
    icon: Shield,
    effectiveDate: "3 March 2026",
    lastUpdated: "3 March 2026",
    sections: [
      "Data Controller Info",
      "Definitions",
      "Data We Collect",
      "Purposes & Legal Basis",
      "AI Sub-Processors",
      "Cross-Border Transfers",
      "Data Retention",
      "Data Security",
      "Data Subject Rights",
      "Cookies",
      "Children's Data",
      "Changes to Policy",
      "Contact Us",
    ],
  },
}

export function LegalDocumentModal({
  open,
  onOpenChange,
  type,
  onAccept,
}: LegalDocumentModalProps) {
  const meta = META[type]
  const Icon = meta.icon
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

  // Reset state when modal opens/type changes
  useEffect(() => {
    if (open) {
      setScrollProgress(0)
      setShowScrollTop(false)
      setHasScrolledToBottom(false)
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
      }
    }
  }, [open, type])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const scrolled = el.scrollTop
    const total = el.scrollHeight - el.clientHeight
    const progress = total > 0 ? Math.round((scrolled / total) * 100) : 0
    setScrollProgress(progress)
    setShowScrollTop(scrolled > 300)
    if (progress >= 95) setHasScrolledToBottom(true)
  }

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Override the default shadcn Dialog sizing — full document overlay
        className={cn(
          // position & size
          "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50",
          "w-[95vw] max-w-4xl",
          // remove default padding/gap so we control our own layout
          "p-0 gap-0 overflow-hidden",
          // height
          "h-[92vh] max-h-[92vh]",
          // styling
          "border border-border/60 bg-background shadow-2xl shadow-black/50 rounded-xl",
        )}
        // hide the default Radix close button (we provide our own)
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* ── Scroll Progress Bar ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-border/30 z-20">
          <div
            className="h-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* ── Header ── */}
        <div className="relative flex items-start gap-3 px-6 pt-6 pb-4 border-b border-border bg-card/60 backdrop-blur-sm shrink-0">
          {/* Icon badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground leading-tight">{meta.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{meta.subtitle}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="text-xs text-muted-foreground">
                Effective: <span className="text-foreground">{meta.effectiveDate}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Last updated: <span className="text-foreground">{meta.lastUpdated}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Governing law:{" "}
                <span className="text-foreground">Republic of Kenya</span>
              </span>
            </div>
          </div>

          {/* Scroll progress label + close */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-block text-xs text-muted-foreground tabular-nums">
              {scrollProgress}% read
            </span>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close document"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Body: Sidebar TOC + Scrollable Content ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Table of Contents — hidden on mobile, visible sm+ */}
          <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-border bg-muted/20 overflow-y-auto">
            <p className="px-4 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Contents
            </p>
            <nav className="flex flex-col px-2 pb-4 gap-0.5">
              {meta.sections.map((section, i) => (
                <button
                  key={section}
                  onClick={() => {
                    // Scroll content to approximate position based on section index
                    if (scrollRef.current) {
                      const total = scrollRef.current.scrollHeight - scrollRef.current.clientHeight
                      const target = (i / meta.sections.length) * total
                      scrollRef.current.scrollTo({ top: target, behavior: "smooth" })
                    }
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left leading-tight"
                >
                  <span className="w-4 text-right text-[10px] text-muted-foreground/50 shrink-0 font-mono">
                    {i + 1}
                  </span>
                  <span className="truncate">{section}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main scrollable document content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overscroll-contain scroll-smooth"
          >
            <div className="px-6 py-6 md:px-8 max-w-none">
              {type === "privacy" ? <PrivacyPolicyContent /> : <TermsOfServiceContent />}
            </div>

            {/* End-of-document marker */}
            <div className="px-6 md:px-8 pb-6">
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">End of Document</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                {meta.title} — {meta.subtitle} — Governed by the Laws of the Republic of Kenya
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-3 px-6 py-3 border-t border-border bg-card/60 backdrop-blur-sm shrink-0">
          {/* Left info */}
          <div className="flex items-center gap-2">
            {!hasScrolledToBottom && (
              <p className="text-xs text-muted-foreground hidden sm:block">
                Scroll to read the full document
              </p>
            )}
            {hasScrolledToBottom && (
              <p className="text-xs text-muted-foreground hidden sm:block">
                ✓ You have read the full document
              </p>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Scroll to top */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Scroll to top"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-transparent"
            >
              Close
            </Button>

            {onAccept && (
              <Button
                size="sm"
                onClick={() => {
                  onAccept()
                  onOpenChange(false)
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                I Accept
              </Button>
            )}
          </div>
        </div>

        {/* Floating scroll-to-top button (mobile) */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="md:hidden absolute bottom-16 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all z-10"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}
