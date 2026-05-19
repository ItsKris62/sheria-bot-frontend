"use client"

import { type KeyboardEvent, type ReactNode, useId, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  FileCheck2,
  FileText,
  Folder,
  HelpCircle,
  Home,
  Lock,
  Megaphone,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const steps = [
  {
    id: "ask",
    number: "01",
    title: "Ask a real compliance question",
    description:
      "Start where the team already works: a Kenyan fintech regulatory question, prompted directly into SheriaBot AI.",
    mockupType: "question",
  },
  {
    id: "answer",
    number: "02",
    title: "Receive a cited answer",
    description:
      "SheriaBot responds in the same workspace, with answer text, confidence, citations, and a source trail.",
    mockupType: "answer",
  },
  {
    id: "checklist",
    number: "03",
    title: "Generate an actionable checklist",
    description:
      "The answer becomes controls, documents, owners, and team tasks instead of staying as research notes.",
    mockupType: "checklist",
  },
  {
    id: "export",
    number: "04",
    title: "Export a compliance summary",
    description:
      "Package the question, answer, citations, checklist, risks, and next actions for review or audit prep.",
    mockupType: "export",
  },
  {
    id: "track",
    number: "05",
    title: "Track gaps over time",
    description:
      "Move from one-off answers to a live gap tracker across KYC, AML, Data Protection, and regulatory updates.",
    mockupType: "tracker",
  },
] as const

const suggestedQueries = [
  "What are the KYC requirements for digital lenders in Kenya?",
  "How do I comply with the Data Protection Act for mobile money?",
  "What are the CBK reporting requirements for payment service providers?",
  "Consumer protection obligations for fintech companies",
  "AML compliance requirements for cryptocurrency exchanges",
]

const legalSources = [
  "CBK Digital Credit Providers Regulations",
  "Proceeds of Crime and Anti-Money Laundering Act",
  "Data Protection Act, 2019",
]

const checklistItems = [
  { text: "Collect customer identification details", status: "Required" },
  { text: "Verify phone number and customer ownership", status: "Required" },
  { text: "Screen customers for AML/CFT risk indicators", status: "Needs Review" },
  { text: "Store KYC records securely", status: "Required" },
  { text: "Provide privacy notice before collecting personal data", status: "Required" },
  { text: "Define retention and deletion procedures", status: "Recommended" },
  { text: "Assign compliance owner for periodic review", status: "Recommended" },
]

const trackerMetrics = [
  { label: "KYC controls", value: "82% complete", progress: 82, tone: "green" },
  { label: "AML reporting workflow", value: "3 open gaps", progress: 58, tone: "gold" },
  { label: "Data protection notices", value: "1 overdue item", progress: 67, tone: "gold" },
  { label: "Regulatory alerts", value: "2 new updates", progress: 74, tone: "green" },
]

export function ComplianceEvidenceSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabPrefix = useId()
  const activeStep = steps[activeIndex]

  const viewExampleOutput = () => {
    setActiveIndex(1)
    window.requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      document.getElementById(`${tabPrefix}-panel`)?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      })
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return

    event.preventDefault()
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1
    const nextIndex = (index + direction + steps.length) % steps.length
    setActiveIndex(nextIndex)
    document.getElementById(`${tabPrefix}-tab-${steps[nextIndex].id}`)?.focus()
  }

  return (
    <section
      id="workflow"
      data-ambient-section
      className="relative isolate overflow-hidden border-y border-[#1D2925] bg-[#050706] py-24 sm:py-32 scroll-mt-20"
    >
      <div
        className="absolute inset-0 -z-10 transition-[background,transform] duration-700 ease-out"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x,72%) var(--mouse-y,8%), rgba(30,215,96,0.12), transparent 34%), linear-gradient(180deg,#080D0B 0%,#050706 48%,#0D1411 100%)",
          transform:
            "translate3d(var(--drift-x-px,0px), calc(var(--parallax-y,0px) + var(--drift-y-px,0px)), 0)",
        }}
        data-parallax="0.04"
        data-ambient-layer
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.10] [background-image:linear-gradient(rgba(245,247,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,246,0.06)_1px,transparent_1px)] [background-size:76px_76px] [mask-image:radial-gradient(circle_at_var(--mouse-x,64%)_var(--mouse-y,38%),black,transparent_58%)] motion-reduce:hidden"
        style={{
          transform:
            "translate3d(var(--drift-x-px-inverse,0px), calc(var(--parallax-y,0px) + var(--drift-y-px-inverse,0px)), 0)",
        }}
        data-parallax="0.02"
        data-ambient-layer
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#D8B76E]/30 to-transparent" />

      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.58fr_1.42fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2D3B35] bg-[#0D1411]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1ED760]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Product workflow
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-[#F5F7F6] sm:text-5xl lg:text-6xl text-balance">
                From regulatory question to audit-ready evidence
              </h2>
              <p className="mt-6 text-base leading-8 text-[#B8C0BC] sm:text-lg">
                SheriaBot does not stop at AI answers. It turns Kenyan fintech regulations into cited guidance,
                practical checklists, exportable summaries, and trackable compliance gaps your team can act on.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  asChild
                  className="group h-12 rounded-xl bg-[#1ED760] px-6 text-sm font-semibold text-[#041008] shadow-[0_16px_40px_rgba(30,215,96,0.18)] transition-all duration-300 hover:bg-[#18C357] focus-visible:ring-[#1ED760]/60"
                >
                  <Link href="/register">
                    Run a Sample Compliance Query
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={viewExampleOutput}
                  className="h-12 rounded-xl border-[#2D3B35] bg-[#0D1411]/70 px-6 text-sm font-semibold text-[#F5F7F6] transition-all duration-300 hover:border-[#C6A15B]/60 hover:bg-[#C6A15B]/10 hover:text-[#F5F7F6] focus-visible:ring-[#C6A15B]/50"
                >
                  View Example Output
                </Button>
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Compliance evidence workflow"
              className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-1"
            >
              {steps.map((step, index) => {
                const isActive = activeIndex === index

                return (
                  <button
                    key={step.id}
                    id={`${tabPrefix}-tab-${step.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${tabPrefix}-panel`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ED760]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050706] ${
                      isActive
                        ? "border-[#1ED760]/50 bg-[#0D1411] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                        : "border-[#1D2925] bg-[#080D0B]/50 p-4 hover:border-[#2D3B35] hover:bg-[#0D1411]/70"
                    }`}
                  >
                    {isActive && <span className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-[#1ED760]" />}
                    <span className="flex items-center gap-3">
                      <span
                        className={`font-numeric flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                          isActive
                            ? "border-[#1ED760]/40 bg-[#1ED760]/10 text-[#1ED760]"
                            : "border-[#2D3B35] bg-[#050706] text-[#7F8A85]"
                        }`}
                      >
                        {step.number}
                      </span>
                      <span className={`text-sm font-semibold ${isActive ? "text-[#F5F7F6]" : "text-[#B8C0BC]"}`}>
                        {step.title}
                      </span>
                    </span>
                    <span
                      className={`mt-3 block text-sm leading-6 transition-all duration-300 ${
                        isActive ? "max-h-28 text-[#B8C0BC] opacity-100" : "max-h-0 overflow-hidden text-[#7F8A85] opacity-0 lg:group-hover:max-h-20 lg:group-hover:opacity-100"
                      }`}
                    >
                      {step.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <ProductMockup activeStep={activeStep} tabPrefix={tabPrefix} />
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[28px] border border-[#1D2925] bg-[#080D0B]/80 shadow-[0_20px_70px_rgba(0,0,0,0.25)] md:grid-cols-2">
          <ValueStripItem
            eyebrow="Before SheriaBot"
            title="Scattered PDFs, manual research, unclear obligations, and no citation trail."
            description="Compliance teams spend hours searching through regulations, circulars, PDFs, and internal notes: often without a clear audit trail."
          />
          <ValueStripItem
            eyebrow="After SheriaBot"
            title="Cited answer, generated checklist, exportable summary, gap tracker, and regulatory alerts."
            description="SheriaBot turns the same question into a cited answer, checklist, exportable summary, and trackable compliance task."
            highlighted
          />
        </div>
      </div>
    </section>
  )
}

function ProductMockup({
  activeStep,
  tabPrefix,
}: {
  activeStep: (typeof steps)[number]
  tabPrefix: string
}) {
  return (
    <div
      id={`${tabPrefix}-panel`}
      role="tabpanel"
      aria-labelledby={`${tabPrefix}-tab-${activeStep.id}`}
      className="relative [perspective:1800px]"
    >
      <div
        className="pointer-events-none absolute -inset-8 hidden rounded-[38px] bg-[radial-gradient(circle_at_72%_8%,rgba(30,215,96,0.18),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(198,161,91,0.14),transparent_30%)] blur-2xl lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-10 -bottom-9 hidden h-16 rounded-[100%] bg-black/65 blur-2xl lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-3 hidden rounded-[32px] border border-[#2D3B35] bg-[#07100D] opacity-75 shadow-[0_38px_100px_rgba(0,0,0,0.38)] lg:block lg:[transform:translate3d(22px,22px,-80px)_rotateX(3deg)_rotateY(-7deg)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-1 hidden rounded-[34px] border border-[#C6A15B]/12 bg-[#0A110E] opacity-80 shadow-[0_28px_80px_rgba(0,0,0,0.28)] lg:block lg:[transform:translate3d(10px,10px,-38px)_rotateX(3deg)_rotateY(-7deg)]"
        aria-hidden="true"
      />

      <div
        className="relative z-10 overflow-hidden rounded-[30px] border border-[#26342F] bg-[#050706] shadow-[0_48px_130px_rgba(0,0,0,0.68),0_14px_46px_rgba(30,215,96,0.10),inset_0_1px_0_rgba(245,247,246,0.08)] transition-transform duration-500 ease-out lg:[transform:rotateX(3deg)_rotateY(-7deg)_rotateZ(0.35deg)] lg:hover:[transform:rotateX(1.5deg)_rotateY(-4deg)_rotateZ(0deg)_translateY(-4px)] motion-reduce:transform-none"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-px bg-gradient-to-b from-white/24 via-[#1ED760]/18 to-transparent" />
        <div
          key={activeStep.id}
          className="animate-fade-slide-up"
        >
          <WorkspaceShell activeStep={activeStep} />
        </div>
      </div>
    </div>
  )
}

function WorkspaceShell({ activeStep }: { activeStep: (typeof steps)[number] }) {
  const activeNav =
    activeStep.mockupType === "checklist"
      ? "Checklists"
      : activeStep.mockupType === "tracker"
        ? "Gap Analysis"
        : "Compliance Query"

  return (
    <div className="min-h-[740px] bg-[#020403] text-[#F5F7F6] lg:min-h-[820px]">
      <div className="grid min-h-[740px] grid-cols-1 lg:min-h-[820px] lg:grid-cols-[172px_1fr] xl:grid-cols-[206px_1fr]">
        <MockSidebar active={activeNav} />
        <div className="min-w-0 border-l border-[#1D2925]">
          <MockTopbar />
          <div className="p-4 sm:p-6">
            <div className="mb-5">
              <h3 className="text-2xl font-bold text-[#F5F7F6]">
                {activeStep.mockupType === "tracker"
                  ? "Gap Analysis"
                  : activeStep.mockupType === "checklist"
                    ? "Compliance Checklist"
                    : "Compliance Query"}
              </h3>
              <p className="mt-1 text-sm text-[#B8C0BC]">
                {activeStep.mockupType === "tracker"
                  ? "Track open compliance gaps, evidence status, and regulatory updates over time"
                  : activeStep.mockupType === "checklist"
                    ? "Convert cited guidance into practical compliance controls, owners, and review tasks"
                  : "Ask questions about Kenya's fintech regulations and get AI-powered answers with legal citations"}
              </p>
            </div>

            <div className="min-w-0">
              {activeStep.mockupType === "question" && <QuestionScreen />}
              {activeStep.mockupType === "answer" && <AnswerScreen />}
              {activeStep.mockupType === "checklist" && <ChecklistScreen />}
              {activeStep.mockupType === "export" && <ExportScreen />}
              {activeStep.mockupType === "tracker" && <TrackerScreen />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockSidebar({ active }: { active: string }) {
  const groups = [
    {
      label: "Overview",
      items: [{ label: "Dashboard", icon: Home }],
    },
    {
      label: "Compliance",
      items: [
        { label: "Compliance Query", icon: Search, badge: "AI" },
        { label: "Checklists", icon: ClipboardCheck },
        { label: "Gap Analysis", icon: ShieldAlert, locked: true },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Applications", icon: FileText },
        { label: "Calendar", icon: Calendar },
        { label: "Documents", icon: Folder, locked: true },
        { label: "Monitor", icon: Bell, badge: "3" },
        { label: "Regulatory Alerts", icon: Megaphone },
      ],
    },
  ]

  return (
    <aside className="hidden bg-[#020403] p-4 lg:block">
      <div className="mb-8">
        <Image
          src="/navigation-bar-logo.png"
          alt="SheriaBot"
          width={132}
          height={42}
          className="h-10 w-auto object-contain"
          priority={false}
        />
        <p className="mt-1 pl-11 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1ED760]">Dashboard</p>
      </div>

      <nav className="space-y-6" aria-label="Mock dashboard navigation">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#0FA958]">{group.label}</p>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = active === item.label

                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium ${
                      isActive
                        ? "border-l-2 border-[#1ED760] bg-[#0FA958]/20 text-[#1ED760]"
                        : item.locked
                          ? "text-[#7F8A85]/65"
                          : "text-[#B8C0BC]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-[#1ED760]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#1ED760]">
                        {item.badge}
                      </span>
                    )}
                    {item.locked && <Lock className="ml-auto h-3 w-3" />}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-10 space-y-1.5 border-t border-[#1D2925] pt-4">
        {[
          { label: "Settings", icon: Settings },
          { label: "Support", icon: HelpCircle },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#B8C0BC]">
            <item.icon className="h-4 w-4" />
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  )
}

function MockTopbar() {
  return (
    <div className="flex h-16 items-center justify-between gap-4 border-b border-[#1D2925] bg-[#020403] px-4 sm:px-6">
      <div className="flex h-10 w-full max-w-[270px] items-center gap-3 rounded-lg bg-[#1ED760] px-4 text-sm font-medium text-[#041008]">
        <Search className="h-4 w-4" />
        Search...
        <span className="ml-auto rounded bg-[#041008]/70 px-2 py-0.5 text-[10px] text-[#F5F7F6]">-K</span>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="hidden h-4 w-4 text-[#B8C0BC] sm:block" />
        <HelpCircle className="hidden h-4 w-4 text-[#B8C0BC] sm:block" />
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1ED760] text-xs font-bold text-[#041008]">
            CR
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-none">Christopher Roteng</p>
            <p className="mt-1 text-[11px] text-[#B8C0BC]">Startup</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestionScreen() {
  return (
    <ChatCard
      footer={
        <PromptInput value="Ask about KYC requirements, data protection, CBK guidelines..." />
      }
    >
      <div className="flex min-h-[430px] flex-col items-center justify-center px-4 text-center">
        <SheriaMark className="h-16 w-16 rounded-2xl" imageClassName="h-9 w-9" />
        <h4 className="mt-5 text-2xl font-bold">Ask a Compliance Question</h4>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#B8C0BC]">
          Get instant answers about Kenya's fintech regulations, CBK guidelines, data protection requirements,
          and more.
        </p>
        <div className="mt-8 w-full max-w-md">
          <p className="mb-3 text-sm font-medium text-[#B8C0BC]">Suggested queries:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedQueries.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="max-w-[320px] truncate rounded-full border border-[#2D3B35] bg-[#121817] px-4 py-2 text-sm text-[#F5F7F6]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ChatCard>
  )
}

function AnswerScreen() {
  return (
    <ChatCard footer={<PromptInput value="Ask a follow-up about record retention..." />}>
      <div className="space-y-5 p-4 sm:p-5">
        <UserBubble text="What are the KYC requirements for a digital credit provider in Kenya?" />
        <AssistantPanel>
          <div className="mb-3 flex items-center gap-2">
            <span className="ml-auto rounded-full border border-[#1ED760]/25 bg-[#1ED760]/10 px-2.5 py-1 text-[11px] font-semibold text-[#1ED760]">
              91% confidence
            </span>
          </div>
          <p className="text-sm leading-7 text-[#F5F7F6]">
            Digital credit providers should verify customer identity, assess customer risk, retain relevant records,
            and ensure personal data is processed lawfully and securely. KYC workflows should also support AML/CFT
            screening and ongoing monitoring where risk indicators are present.
          </p>
          <CitationTrail />
          <ActionBar />
        </AssistantPanel>
      </div>
    </ChatCard>
  )
}

function ChecklistScreen() {
  return (
    <ChatCard footer={<PromptInput value="Generate a checklist from this answer..." />}>
      <div className="space-y-4 p-4 sm:p-5">
        <UserBubble text="Turn that KYC guidance into an implementation checklist." />
        <AssistantPanel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#F5F7F6]">Generated checklist</p>
              <p className="mt-1 text-xs text-[#B8C0BC]">7 controls mapped from the cited answer</p>
            </div>
            <Button className="h-9 rounded-lg bg-[#1ED760] px-3 text-xs font-semibold text-[#041008] hover:bg-[#18C357]">
              Generate Checklist
            </Button>
          </div>
          <div className="space-y-2.5">
            {checklistItems.map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl border border-[#1D2925] bg-[#050706] p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1ED760]" />
                <p className="flex-1 text-xs font-medium leading-5 text-[#F5F7F6]">{item.text}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                    item.status === "Needs Review"
                      ? "bg-[#C6A15B]/10 text-[#D8B76E]"
                      : item.status === "Recommended"
                        ? "bg-[#2D3B35] text-[#B8C0BC]"
                        : "bg-[#1ED760]/10 text-[#1ED760]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </AssistantPanel>
      </div>
    </ChatCard>
  )
}

function ExportScreen() {
  return (
    <ChatCard footer={<PromptInput value="Export this as a management summary..." />}>
      <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[1fr_220px]">
        <div className="rounded-2xl border border-[#1D2925] bg-[#F5F1E8] p-5 text-[#17201B]">
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#D8B76E]/40 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B713C]">Compliance record</p>
              <h4 className="mt-1 text-2xl font-bold">KYC Compliance Summary</h4>
            </div>
            <FileCheck2 className="h-6 w-6 text-[#8B713C]" />
          </div>
          {[
            "Original question",
            "AI-generated answer",
            "Legal citations",
            "Generated checklist",
            "Risk notes",
            "Recommended next actions",
          ].map((item, index) => (
            <div key={item} className="flex items-center gap-3 border-b border-[#17201B]/10 py-3 last:border-b-0">
              <span className="font-numeric text-xs font-bold text-[#8B713C]">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-sm font-semibold">{item}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#1D2925] bg-[#0D1411] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Download className="h-4 w-4 text-[#1ED760]" />
            Export output
          </div>
          <div className="space-y-2">
            {["PDF Summary", "DOCX Checklist", "Internal Compliance Report"].map((option) => (
              <button
                key={option}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-[#1D2925] bg-[#050706] px-3 py-3 text-left text-xs font-medium text-[#F5F7F6]"
              >
                {option}
                <ArrowRight className="h-3.5 w-3.5 text-[#D8B76E]" />
              </button>
            ))}
          </div>
          <Button className="mt-4 h-9 w-full rounded-lg bg-[#1ED760] text-xs font-semibold text-[#041008] hover:bg-[#18C357]">
            Export Summary
          </Button>
        </div>
      </div>
    </ChatCard>
  )
}

function TrackerScreen() {
  return (
    <div className="rounded-2xl border border-[#1D2925] bg-[#080D0B] p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Compliance score", value: "78%", icon: BarChart3 },
          { label: "Open gaps", value: "4", icon: ShieldAlert },
          { label: "Evidence records", value: "23", icon: FileText },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-[#1D2925] bg-[#050706] p-4">
            <metric.icon className="h-4 w-4 text-[#D8B76E]" />
            <p className="mt-4 text-2xl font-bold text-[#F5F7F6]">{metric.value}</p>
            <p className="mt-1 text-xs text-[#7F8A85]">{metric.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-[#1D2925] bg-[#050706] p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#F5F7F6]">Gap tracker</p>
            <p className="mt-1 text-xs text-[#B8C0BC]">Live status across priority compliance workstreams</p>
          </div>
          <Button className="h-9 rounded-lg bg-[#1ED760] px-3 text-xs font-semibold text-[#041008] hover:bg-[#18C357]">
            View Gap Analysis
          </Button>
        </div>
        <div className="space-y-4">
          {trackerMetrics.map((metric) => (
            <div key={metric.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[#F5F7F6]">{metric.label}</span>
                <span className={metric.tone === "green" ? "text-[#1ED760]" : "text-[#D8B76E]"}>{metric.value}</span>
              </div>
              <div className="h-2 rounded-full bg-[#1D2925]" aria-label={`${metric.label}: ${metric.value}`}>
                <div
                  className={`h-full rounded-full ${metric.tone === "green" ? "bg-[#1ED760]" : "bg-[#D8B76E]"}`}
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatCard({
  children,
  footer,
}: {
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="flex min-h-[560px] flex-col rounded-2xl border border-[#1D2925] bg-[#080D0B] xl:min-h-[612px]">
      <div className="min-h-0 flex-1">{children}</div>
      <div className="border-t border-[#1D2925] p-4">{footer}</div>
    </div>
  )
}

function PromptInput({ value }: { value: string }) {
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex min-h-10 flex-1 items-center rounded-lg bg-[#020403] px-3 text-sm text-[#F5F7F6]">
          {value}
        </div>
        <button
          type="button"
          className="flex h-10 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0FA958] text-[#041008]"
          aria-label="Ask SheriaBot"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-xs text-[#B8C0BC]">
        Answers are AI-generated based on Kenya's legal corpus. Always verify with official sources.{" "}
        <kbd className="rounded bg-[#161D1A] px-1.5 py-0.5 font-mono text-[10px]">Ctrl+Enter</kbd> to submit.
      </p>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[82%] rounded-2xl bg-[#1ED760] px-4 py-3 text-sm font-medium leading-6 text-[#041008]">
        {text}
      </div>
    </div>
  )
}

function AssistantPanel({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[92%] rounded-2xl bg-[#121817] px-4 py-4">
      <div className="mb-2 flex items-center gap-2">
        <SheriaMark className="h-7 w-7 rounded-full" imageClassName="h-4 w-4" />
        <span className="text-sm font-semibold text-[#F5F7F6]">SheriaBot</span>
      </div>
      {children}
    </div>
  )
}

function SheriaMark({
  className,
  imageClassName,
}: {
  className: string
  imageClassName: string
}) {
  return (
    <div className={`flex items-center justify-center border border-[#1ED760]/25 bg-[#1ED760]/10 shadow-[inset_0_1px_0_rgba(245,247,246,0.08)] ${className}`}>
      <Image
        src="/favicon-logo.png"
        alt=""
        width={48}
        height={48}
        className={`object-contain ${imageClassName}`}
        aria-hidden="true"
      />
    </div>
  )
}

function CitationTrail() {
  return (
    <div className="mt-4 border-t border-[#2D3B35] pt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#B8C0BC]">Legal Citations ({legalSources.length})</p>
        <button type="button" className="text-xs font-semibold text-[#D8B76E]">View source trail</button>
      </div>
      <div className="space-y-2">
        {legalSources.map((source) => (
          <div key={source} className="flex items-start gap-2 rounded-lg border border-[#C6A15B]/25 bg-[#C6A15B]/10 p-2">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#D8B76E]" />
            <div>
              <p className="text-xs font-semibold text-[#F5F7F6]">{source}</p>
              <p className="mt-1 text-[11px] text-[#B8C0BC]">Matched source passage and authority metadata</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#7F8A85]">Sample output. Verify against official sources.</p>
    </div>
  )
}

function ActionBar() {
  return (
    <div className="mt-4 flex items-center gap-2 text-xs text-[#B8C0BC]">
      {[
        { label: "Copy", icon: Copy },
        { label: "Saved", icon: BookmarkCheck },
      ].map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1 rounded-lg px-2 py-1">
          <item.icon className="h-3.5 w-3.5" />
          {item.label}
        </span>
      ))}
      <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[#1ED760]/10 px-2 py-1 text-[#1ED760]">
        <ThumbsUp className="h-3.5 w-3.5" />
        Helpful
      </span>
    </div>
  )
}

function ValueStripItem({
  eyebrow,
  title,
  description,
  highlighted = false,
}: {
  eyebrow: string
  title: string
  description: string
  highlighted?: boolean
}) {
  return (
    <div className={`p-6 sm:p-8 ${highlighted ? "bg-[#0D1411]" : "bg-[#050706]/60"} md:border-r md:border-[#1D2925] md:last:border-r-0`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${highlighted ? "text-[#1ED760]" : "text-[#7F8A85]"}`}>
        {eyebrow}
      </p>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-[#F5F7F6]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#B8C0BC]">{description}</p>
    </div>
  )
}
