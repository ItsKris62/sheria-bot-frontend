"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Shield,
  FileText,
  Lock,
  Database,
  ChevronUp,
  Printer,
  ChevronRight,
  Menu,
} from "lucide-react"
import { PrivacyPolicyContent } from "./privacy-policy-content"
import { TermsOfServiceContent } from "./terms-of-service-content"
import { DataProtectionContent } from "./data-protection-content"
import { SecurityPolicyContent } from "./security-policy-content"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type LegalDocType = "privacy" | "terms" | "data-protection" | "security"

interface TocEntry {
  id: string
  label: string
}

interface DocMeta {
  title: string
  subtitle: string
  icon: React.ElementType
  effectiveDate: string
  lastUpdated: string
  toc: TocEntry[]
}

// ─── Document metadata ────────────────────────────────────────────────────────

const META: Record<LegalDocType, DocMeta> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "SheriaBot Technologies Limited",
    icon: Shield,
    effectiveDate: "5 March 2026",
    lastUpdated: "5 March 2026",
    toc: [
      { id: "data-controller", label: "Data Controller Info" },
      { id: "definitions", label: "Definitions" },
      { id: "data-collected", label: "Data We Collect" },
      { id: "purposes", label: "Purposes & Legal Basis" },
      { id: "ai-processing", label: "AI Processing & Sub-Processors" },
      { id: "cross-border", label: "Cross-Border Transfers" },
      { id: "retention", label: "Data Retention" },
      { id: "security", label: "Data Security" },
      { id: "rights", label: "Data Subject Rights" },
      { id: "cookies", label: "Cookies & Tracking" },
      { id: "children", label: "Children's Data" },
      { id: "changes", label: "Changes to Policy" },
      { id: "contact", label: "Contact Us" },
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle: "SheriaBot Technologies Limited",
    icon: FileText,
    effectiveDate: "5 March 2026",
    lastUpdated: "5 March 2026",
    toc: [
      { id: "definitions", label: "Definitions" },
      { id: "account", label: "Account Registration" },
      { id: "acceptable-use", label: "Acceptable Use" },
      { id: "payment", label: "Payment Terms" },
      { id: "ip", label: "Intellectual Property" },
      { id: "ai-disclaimers", label: "AI Disclaimers" },
      { id: "warranties", label: "Disclaimer of Warranties" },
      { id: "liability", label: "Limitation of Liability" },
      { id: "indemnification", label: "Indemnification" },
      { id: "termination", label: "Termination" },
      { id: "data-protection", label: "Data Protection" },
      { id: "confidentiality", label: "Confidentiality" },
      { id: "modifications", label: "Modifications" },
      { id: "governing-law", label: "Governing Law" },
      { id: "general", label: "General Provisions" },
    ],
  },
  "data-protection": {
    title: "Data Protection Policy",
    subtitle: "SheriaBot Technologies Limited",
    icon: Database,
    effectiveDate: "5 March 2026",
    lastUpdated: "5 March 2026",
    toc: [
      { id: "purpose", label: "Purpose & Scope" },
      { id: "principles", label: "Data Protection Principles" },
      { id: "roles", label: "Roles & Responsibilities" },
      { id: "register", label: "Processing Activities Register" },
      { id: "dpia", label: "Data Protection Impact Assessments" },
      { id: "cross-border", label: "Cross-Border Transfers" },
      { id: "dsr-procedures", label: "Data Subject Rights Procedures" },
      { id: "breach-response", label: "Data Breach Response" },
      { id: "processors", label: "Third-Party Processor Management" },
      { id: "retention", label: "Data Retention & Disposal" },
      { id: "training", label: "Training & Awareness" },
      { id: "review", label: "Policy Review" },
    ],
  },
  security: {
    title: "Security Policy",
    subtitle: "SheriaBot Technologies Limited",
    icon: Lock,
    effectiveDate: "5 March 2026",
    lastUpdated: "5 March 2026",
    toc: [
      { id: "commitment", label: "Security Commitment" },
      { id: "infrastructure", label: "Infrastructure Security" },
      { id: "application", label: "Application Security" },
      { id: "ai-security", label: "AI & Data Processing" },
      { id: "isolation", label: "Data Isolation & Access Control" },
      { id: "incident-response", label: "Incident Response" },
      { id: "continuity", label: "Business Continuity" },
      { id: "development", label: "Secure Development" },
      { id: "compliance", label: "Compliance Alignment" },
      { id: "contact", label: "Contact" },
    ],
  },
}

// ─── Print styles injected into <head> ────────────────────────────────────────

const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #legal-doc-print-region,
  #legal-doc-print-region * { visibility: visible !important; }
  #legal-doc-print-region {
    position: fixed !important;
    inset: 0 !important;
    background: #ffffff !important;
    color: #111827 !important;
    padding: 2rem 3rem !important;
    font-family: Georgia, serif !important;
    font-size: 11pt !important;
    line-height: 1.7 !important;
    overflow: visible !important;
  }
  #legal-doc-print-region h2 {
    color: #111827 !important;
    border-bottom: 1px solid #d1d5db !important;
    font-size: 12pt !important;
    margin-top: 1.5rem !important;
  }
  #legal-doc-print-region h3 {
    color: #374151 !important;
    font-size: 11pt !important;
  }
  #legal-doc-print-region table {
    border-collapse: collapse !important;
    width: 100% !important;
    font-size: 9pt !important;
  }
  #legal-doc-print-region th,
  #legal-doc-print-region td {
    border: 1px solid #d1d5db !important;
    padding: 4px 8px !important;
    color: #374151 !important;
  }
  #legal-doc-print-region th {
    background: #f3f4f6 !important;
    font-weight: 600 !important;
  }
}
`

// ─── Main overlay component ───────────────────────────────────────────────────

export interface LegalDocumentOverlayProps {
  type: LegalDocType
  /**
   * "overlay" — fixed full-screen (used by intercepting routes, renders on top of current page)
   * "page"    — inline (used by full-page routes, sits inside the normal public shell)
   */
  mode?: "overlay" | "page"
}

export function LegalDocumentOverlay({
  type,
  mode = "overlay",
}: LegalDocumentOverlayProps) {
  const router = useRouter()
  const meta = META[type]
  const Icon = meta.icon

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Entrance animation
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Inject print styles once
  useEffect(() => {
    if (typeof document === "undefined") return
    const existing = document.getElementById("legal-print-styles")
    if (existing) return
    const style = document.createElement("style")
    style.id = "legal-print-styles"
    style.textContent = PRINT_STYLES
    document.head.appendChild(style)
    return () => {
      const el = document.getElementById("legal-print-styles")
      el?.remove()
    }
  }, [])

  // Lock body scroll in overlay mode
  useEffect(() => {
    if (mode !== "overlay") return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mode])

  // ESC key closes the overlay (overlay mode only)
  const handleClose = useCallback(() => {
    if (mode === "overlay") router.back()
  }, [mode, router])

  useEffect(() => {
    if (mode !== "overlay") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, handleClose])

  // Scroll handler — progress + show-scroll-top
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const scrolled = el.scrollTop
    const total = el.scrollHeight - el.clientHeight
    setScrollProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0)
    setShowScrollTop(scrolled > 300)
  }

  // Intersection observer for active TOC section
  useEffect(() => {
    const content = scrollRef.current
    if (!content) return
    const sections = content.querySelectorAll("section[id]")
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      {
        root: content,
        rootMargin: "-15% 0px -60% 0px",
        threshold: 0,
      },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [type])

  const scrollToSection = (id: string) => {
    const el = scrollRef.current?.querySelector(`#${id}`)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMobileTocOpen(false)
  }

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrint = () => {
    window.print()
  }

  const ContentComponent =
    type === "privacy"
      ? PrivacyPolicyContent
      : type === "terms"
        ? TermsOfServiceContent
        : type === "data-protection"
          ? DataProtectionContent
          : SecurityPolicyContent

  // ─── Shared inner layout (used in both modes) ─────────────────────────────

  const inner = (
    <>
      {/* Scroll progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-border/30 z-20">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative flex items-start gap-3 px-5 pt-5 pb-4 border-b border-border bg-card/60 backdrop-blur-sm shrink-0">
        {/* Icon badge */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-foreground leading-tight">{meta.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{meta.subtitle}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <span className="text-xs text-muted-foreground">
              Effective:{" "}
              <span className="text-foreground font-medium">{meta.effectiveDate}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Last updated:{" "}
              <span className="text-foreground font-medium">{meta.lastUpdated}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Governed by:{" "}
              <span className="text-foreground font-medium">Republic of Kenya</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block text-xs text-muted-foreground tabular-nums">
            {scrollProgress}% read
          </span>

          {/* Mobile TOC toggle */}
          <button
            onClick={() => setMobileTocOpen((v) => !v)}
            className="md:hidden flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle table of contents"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Print document"
          >
            <Printer className="h-4 w-4" />
          </button>

          {/* Close — overlay mode only */}
          {mode === "overlay" && (
            <button
              onClick={handleClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile TOC dropdown */}
      {mobileTocOpen && (
        <div className="md:hidden border-b border-border bg-muted/30 px-4 py-3 shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Contents
          </p>
          <nav className="grid grid-cols-2 gap-1">
            {meta.toc.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => scrollToSection(entry.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors",
                  activeSection === entry.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                <span className="w-4 text-right text-[10px] text-muted-foreground/50 shrink-0 font-mono">
                  {i + 1}
                </span>
                <span className="truncate leading-tight">{entry.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Desktop TOC sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-muted/20 overflow-y-auto">
          <p className="px-4 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Contents
          </p>
          <nav className="flex flex-col px-2 pb-4 gap-0.5">
            {meta.toc.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => scrollToSection(entry.id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors text-left leading-tight",
                  activeSection === entry.id
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                <span className="w-4 text-right text-[10px] text-muted-foreground/50 shrink-0 font-mono">
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0 truncate">{entry.label}</span>
                {activeSection === entry.id && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          id="legal-doc-print-region"
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain scroll-smooth"
        >
          <div className="px-6 py-6 md:px-8 max-w-none">
            <ContentComponent />
          </div>

          {/* End of document */}
          <div className="px-6 md:px-8 pb-8">
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

      {/* ── Footer bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border bg-card/60 backdrop-blur-sm shrink-0">
        <p className="text-xs text-muted-foreground hidden sm:block">
          {scrollProgress < 95
            ? `Scroll to read the full document`
            : `✓ You have read the full document`}
        </p>
        <div className="flex items-center gap-2 ml-auto">
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
          {mode === "overlay" && (
            <button
              onClick={handleClose}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-transparent px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Close
            </button>
          )}
        </div>
      </div>

      {/* Floating scroll-to-top (mobile) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="md:hidden absolute bottom-16 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all z-10"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </>
  )

  // ─── Overlay mode — fixed full-screen ────────────────────────────────────

  if (mode === "overlay") {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 250ms ease-out",
          }}
        />

        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={meta.title}
          className={cn(
            // Positioning: full-width on mobile, right-anchored on desktop
            "fixed inset-y-0 right-0 z-50 flex flex-col",
            "w-full md:w-[min(90vw,1100px)]",
            // Background
            "bg-background border-l border-border shadow-2xl shadow-black/60",
          )}
          style={{
            transform: mounted ? "translateX(0)" : "translateX(100%)",
            transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {inner}
        </div>
      </>
    )
  }

  // ─── Page mode — inline within public shell ───────────────────────────────

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] bg-background border border-border/50 rounded-xl overflow-hidden mx-auto max-w-6xl my-8 shadow-xl">
      {inner}
    </div>
  )
}
