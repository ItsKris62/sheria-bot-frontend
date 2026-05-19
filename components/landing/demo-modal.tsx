"use client"

import { type ReactNode, useState, useRef, useCallback } from "react"
import { Play, Shield, FileText, BarChart3, Scale, Bell, ChevronRight, Ticket } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const R2_BASE = "https://pub-724936356a15494f9ce61480c5225e6f.r2.dev/demos"

interface DemoSection {
  id: string
  title: string
  description: string
  icon: ReactNode
  videoUrl: string
}

const DEMO_SECTIONS: DemoSection[] = [
  {
    id: "ai-compliance",
    title: "AI Compliance Queries",
    description: "Ask regulatory questions and review cited answers",
    icon: <Shield className="h-4 w-4" />,
    videoUrl: `${R2_BASE}/compliance-c.mp4`,
  },
  {
    id: "compliance-checklist",
    title: "Compliance Checklist",
    description: "Generate checklists for your fintech workflow",
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
    description: "Upload documents and identify compliance gaps",
    icon: <BarChart3 className="h-4 w-4" />,
    videoUrl: "",
  },
  {
    id: "policy-library",
    title: "Policy Library",
    description: "Browse and search Kenya's regulatory library",
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
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleSectionChange = useCallback((section: DemoSection) => {
    setActiveSection(section)
    setVideoError(false)
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-6xl flex-col gap-0 overflow-hidden rounded-2xl border-border bg-background p-0 shadow-2xl">
        <DialogHeader className="border-b border-border px-6 pb-4 pt-6 pr-14 text-left">
          <DialogTitle className="text-lg font-semibold text-foreground">Tutorial Videos</DialogTitle>
          <DialogDescription className="text-sm text-foreground-muted">
            Watch short walkthroughs on how to navigate SheriaBot and complete common compliance tasks.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">

          {/* Sidebar */}
          <div className="max-h-56 w-full flex-shrink-0 overflow-y-auto border-b border-border bg-surface/30 md:max-h-none md:w-72 md:border-b-0 md:border-r">
            <div className="p-3">
              <p className="px-3 py-2 text-xs font-medium text-foreground-muted uppercase tracking-wider">
                Tutorial Library
              </p>
              {DEMO_SECTIONS.map((section) => {
                const isActive = activeSection.id === section.id
                const hasVideo = Boolean(section.videoUrl)
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section)}
                    aria-pressed={isActive}
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
          <div className="flex min-h-[22rem] flex-1 flex-col overflow-hidden">
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
              {activeSection.videoUrl && !videoError ? (
                <video
                  ref={videoRef}
                  key={activeSection.id}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                  preload="auto"
                  onError={() => setVideoError(true)}
                >
                  <source src={activeSection.videoUrl} type="video/mp4" />
                </video>
              ) : activeSection.videoUrl && videoError ? (
                <div className="flex flex-col items-center gap-4 text-center px-8">
                  <div className="rounded-full bg-red-500/10 border border-red-500/20 p-6">
                    <Play className="h-10 w-10 text-red-400" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Unable to load video</p>
                    <p className="text-foreground-muted text-sm mt-1">The video could not be played from storage.</p>
                    <a
                      href={activeSection.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-xs text-brand-green underline underline-offset-2"
                    >
                      Open video directly &gt;
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center px-8">
                  <div className="rounded-full bg-brand-green/10 border border-brand-green/20 p-6">
                    <Play className="h-10 w-10 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-lg">{activeSection.title}</p>
                    <p className="text-foreground-muted text-sm mt-1">{activeSection.description}</p>
                    <p className="text-foreground-muted/50 text-xs mt-3">Tutorial video coming soon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video meta */}
            <div className="flex-shrink-0 border-t border-border bg-surface/20 px-6 py-4">
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
      </DialogContent>
    </Dialog>
  )
}
