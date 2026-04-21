"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, Shield, FileText, BarChart3, Scale, Bell, ChevronRight, Ticket } from "lucide-react"

const R2_BASE = "https://pub-724936356a15494f9ce61480c5225e6f.r2.dev/demos"

interface DemoSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  videoUrl: string
}

const DEMO_SECTIONS: DemoSection[] = [
  {
    id: "ai-compliance",
    title: "AI Compliance Queries",
    description: "Ask complex regulatory questions and get instant, cited answers",
    icon: <Shield className="h-4 w-4" />,
    videoUrl: `${R2_BASE}/compliance-c.mp4`,
  },
  {
    id: "compliance-checklist",
    title: "Compliance Checklist",
    description: "Auto-generate tailored checklists based on your business type",
    icon: <FileText className="h-4 w-4" />,
    videoUrl: `${R2_BASE}/0421.mp4`,
  },
  {
    id: "support-ticket",
    title: "Support Tickets",
    description: "Learn how to create and track support tickets",
    icon: <Ticket className="h-4 w-4" />,
    videoUrl: `${R2_BASE}/suupport-ticket.mp4`,
  },
  {
    id: "gap-analysis",
    title: "Gap Analysis",
    description: "Upload documents and identify compliance gaps instantly",
    icon: <BarChart3 className="h-4 w-4" />,
    videoUrl: "",
  },
  {
    id: "policy-library",
    title: "Policy Library",
    description: "Browse and search Kenya's full regulatory document library",
    icon: <Scale className="h-4 w-4" />,
    videoUrl: "",
  },
  {
    id: "compliance-score",
    title: "Compliance Score Dashboard",
    description: "Track your real-time compliance score across all categories",
    icon: <BarChart3 className="h-4 w-4" />,
    videoUrl: "",
  },
  {
    id: "alerts",
    title: "Regulatory Alerts",
    description: "Stay notified of new regulations affecting your fintech",
    icon: <Bell className="h-4 w-4" />,
    videoUrl: "",
  },
]

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  const [activeSection, setActiveSection] = useState(DEMO_SECTIONS[0])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  // Reload video when section changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [activeSection.id])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Product Demo</h2>
            <p className="text-sm text-foreground-muted">See how SheriaBot works for your fintech</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-border overflow-y-auto bg-surface/30">
            <div className="p-3">
              <p className="px-3 py-2 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                Feature Tours
              </p>
              {DEMO_SECTIONS.map((section) => {
                const isActive = activeSection.id === section.id
                const hasVideo = Boolean(section.videoUrl)
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left rounded-xl px-3 py-3 mb-1 transition-all duration-200 group ${
                      isActive
                        ? "bg-brand-green/10 border border-brand-green/30 text-brand-green"
                        : "text-foreground-muted hover:text-foreground hover:bg-surface border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex-shrink-0 ${isActive ? "text-brand-green" : "text-foreground-muted group-hover:text-foreground"}`}>
                        {section.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium leading-tight">{section.title}</div>
                        <div className="text-xs mt-0.5 opacity-70 leading-tight line-clamp-2">{section.description}</div>
                        {!hasVideo && (
                          <div className="text-xs mt-1.5 opacity-40 italic">Coming soon</div>
                        )}
                      </div>
                      {isActive && (
                        <ChevronRight className="h-3 w-3 flex-shrink-0 mt-0.5 ml-auto" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Video panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-0">
              {activeSection.videoUrl ? (
                <video
                  ref={videoRef}
                  key={activeSection.id}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  <source src={activeSection.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center px-8">
                  <div className="rounded-full bg-brand-green/10 border border-brand-green/20 p-6">
                    <Play className="h-10 w-10 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-lg">{activeSection.title}</p>
                    <p className="text-foreground-muted text-sm mt-1">{activeSection.description}</p>
                    <p className="text-foreground-muted/50 text-xs mt-3">Demo video coming soon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video meta */}
            <div className="px-6 py-4 border-t border-border flex-shrink-0 bg-surface/20">
              <div className="flex items-center gap-3">
                <span className="text-brand-green">{activeSection.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{activeSection.title}</p>
                  <p className="text-xs text-foreground-muted">{activeSection.description}</p>
                </div>
                {!activeSection.videoUrl && (
                  <span className="ml-auto text-xs text-foreground-muted border border-border rounded-md px-2 py-1">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
