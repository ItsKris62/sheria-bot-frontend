"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  FileCheck2,
  FileSearch,
  Globe2,
  LockKeyhole,
  Menu,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react"

const emerald = "#00875A"

const navItems = ["Product", "Solutions", "Coverage", "Resources", "Company"]
const challenges = [
  [FileSearch, "Information overload", "Too many circulars and gazettes make it hard to separate signal from noise."],
  [CircleAlert, "Source uncertainty", "Unclear or unverified summaries create existential regulatory risk."],
  [Network, "Siloed workflows", "Spreadsheets and manual handoffs slow down policy audits."],
  [BarChart3, "Audit pressure", "Compiling defensible evidence for regulators burns weeks of runway."],
]
const workflow = [
  ["01", "Monitor", "Track changes across jurisdictions"],
  ["02", "Analyze", "Turn gazettes into cited insights"],
  ["03", "Guide", "Give legal teams recommendations they trust"],
  ["04", "Act", "Trigger approvals and policy updates"],
  ["05", "Prove", "Export evidence packs with full traceability"],
]
const faqs = [
  ["How does SheriaBot prevent hallucinations?", "Every answer is grounded in an approved corpus of primary law and includes a direct citation. When the evidence is insufficient, SheriaBot says so instead of guessing."],
  ["Can we use our own policies and internal documents?", "Yes. Teams can add proprietary policies and map them against the regulatory corpus without those documents being used to train public models."],
  ["Which jurisdictions are covered today?", "SheriaBot is live across Kenya, Rwanda, Nigeria and Malawi, with additional East and West African jurisdictions being added through our coverage roadmap."],
  ["How secure is our compliance data?", "Customer data is encrypted in transit and at rest, access is governed by enterprise controls, and local data residency options are available for qualifying deployments."],
  ["Is SheriaBot formal legal advice?", "No. SheriaBot provides regulatory intelligence for internal audit and compliance workflows. It helps teams find and act on the law, but does not replace qualified legal counsel."],
]

function Mark({ small = false }: { small?: boolean }) {
  return <div className={`flex ${small ? "size-8" : "size-9"} shrink-0 items-center justify-center rounded-lg bg-[#00875A] text-white`}><span className="text-lg font-black tracking-[-0.15em]">S<span className="opacity-60">B</span></span></div>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00875A]">{children}</p>
}

function ProductPreview() {
  return <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
    <div className="absolute -inset-4 rounded-[2rem] bg-[#E6F5EF] blur-2xl" />
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4"><div className="flex items-center gap-2"><Mark small /><span className="text-sm font-semibold text-zinc-900">Regulatory workspace</span></div><span className="flex items-center gap-1.5 text-[11px] font-medium text-[#00875A]"><span className="size-1.5 rounded-full bg-[#00875A]" />Live corpus</span></div>
      <div className="grid gap-5 p-5 sm:p-7"><div className="rounded-xl bg-[#FAFAFA] p-4"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Your question</p><p className="text-sm leading-6 text-zinc-800">Employers must remit NSSF contributions within 9 days after the end of each month.</p></div><div className="rounded-xl border border-[#B7E6D3] bg-[#F3FBF7] p-4"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00875A]">Verified answer</span><BadgeCheck className="size-4 text-[#00875A]" /></div><p className="text-sm leading-6 text-slate-700">The remittance deadline is the 9th day of the following month. Add a payroll control and retain proof of payment for audit review.</p><div className="mt-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[11px] font-medium text-[#006C48]"><FileCheck2 className="size-3.5" />NSSF Act, Cap 258, Sec 14(1)</div></div><div className="flex items-center justify-between border-t border-zinc-100 pt-5"><div><p className="text-xs font-semibold text-zinc-900">Audit readiness</p><p className="mt-1 text-[11px] text-slate-500">Across 42 active controls</p></div><div className="relative flex size-16 items-center justify-center"><svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 42 42"><circle cx="21" cy="21" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3" /><circle cx="21" cy="21" r="16" fill="none" stroke={emerald} strokeDasharray="84 100" strokeLinecap="round" strokeWidth="3" pathLength="100" /></svg><span className="text-sm font-bold text-zinc-900">84%</span></div></div></div>
    </div>
  </div>
}

export function SheriaBotLandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  return <div className="min-h-screen bg-white text-[#09090B]">
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8"><Link href="/" className="flex items-center gap-2.5"><Mark /><span className="text-[17px] font-bold tracking-tight">Sheria<span className="text-[#00875A]">Bot</span></span></Link><nav className="hidden items-center gap-7 lg:flex">{navItems.map((item) => <Link key={item} href={`#${item.toLowerCase()}`} className="flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-zinc-950">{item}<ChevronDown className="size-3.5 text-slate-400" /></Link>)}</nav><div className="hidden items-center gap-5 sm:flex"><Link href="/login" className="text-sm font-medium text-slate-600 hover:text-zinc-950">Sign in</Link><Link href="#demo" className="rounded-lg bg-[#00875A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#006C48]">Book a demo</Link></div><button className="rounded-lg p-2 lg:hidden" aria-label="Toggle navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button></div>{mobileOpen && <div className="border-t border-zinc-100 bg-white px-5 py-4 lg:hidden"><div className="flex flex-col gap-4">{navItems.map((item) => <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-sm text-slate-600">{item}</Link>)}<Link href="#demo" className="rounded-lg bg-[#00875A] px-4 py-2.5 text-center text-sm font-semibold text-white">Book a demo</Link></div></div>}</header>

    <main>
      <section className="border-b border-zinc-100 bg-white"><div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8 lg:py-28"><div><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B7E6D3] bg-[#F3FBF7] px-3.5 py-2 text-xs font-semibold text-[#006C48]"><CircleCheck className="size-4" />Trusted by legal &amp; compliance teams across East Africa</div><h1 className="max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.055em] text-zinc-950 sm:text-6xl lg:text-[70px]">Turn regulatory updates <span className="text-[#00875A]">into action.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">SheriaBot monitors laws, curates trusted insights, and helps compliance teams act with audit-ready confidence—every step of the way.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="#demo" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00875A] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#006C48]">Book a personalized demo <ArrowRight className="size-4" /></Link><Link href="#product" className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-3.5 text-sm font-semibold text-zinc-800 hover:border-[#00875A] hover:text-[#00875A]">Explore the platform</Link></div><div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500"><span>SOC 2 Type II Certified</span><span>•</span><span>Direct Legal Citations</span><span>•</span><span>Kenya DPA 2019 Grounded</span></div></div><ProductPreview /></div></section>

      <section className="border-b border-zinc-100 bg-[#FAFAFA]"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-5 px-5 py-8 lg:px-8"><p className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 lg:w-auto">Grounded in official regulatory frameworks</p>{["CBK", "ODPC", "CMA", "KCB", "Equity", "Britam", "Absa"].map((name) => <span key={name} className="text-sm font-bold tracking-tight text-slate-400">{name}</span>)}</div></section>

      <section className="bg-[#FAFAFA] px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><SectionLabel>The cost of standing still</SectionLabel><h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Fragmented work. <span className="text-slate-400">Rising risk.</span></h2><p className="mt-5 text-lg leading-8 text-slate-600">The regulatory surface is growing faster than most compliance teams can keep up with.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{challenges.map(([Icon, title, body]) => <div key={title as string} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"><div className="mb-7 flex size-10 items-center justify-center rounded-lg bg-[#E6F5EF] text-[#00875A]"><Icon className="size-5" /></div><h3 className="font-semibold text-zinc-900">{title as string}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{body as string}</p></div>)}</div></div></section>

      <section id="product" className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><SectionLabel>One continuous workflow</SectionLabel><h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">From update to action. <span className="text-slate-400">All in one place.</span></h2></div><div className="mt-14 grid gap-4 md:grid-cols-5">{workflow.map(([number, title, body], index) => <div key={title} className="relative rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:border-l-0 md:first:border-l"><div className={`mb-8 flex size-9 items-center justify-center rounded-full text-xs font-bold ${index === 2 ? "bg-[#00875A] text-white" : "bg-[#E6F5EF] text-[#00875A]"}`}>{number}</div><h3 className="font-semibold text-zinc-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>{index < 4 && <ArrowRight className="absolute -right-3 top-9 z-10 hidden size-5 rounded-full bg-white text-[#00875A] md:block" />}</div>)}</div></div></section>

      <section id="solutions" className="bg-[#FAFAFA] px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><SectionLabel>Built for defensible decisions</SectionLabel><h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">The intelligence layer<br /><span className="text-slate-400">your team has been missing.</span></h2></div><Link href="#demo" className="inline-flex items-center gap-2 text-sm font-semibold text-[#00875A]">See the platform <ArrowRight className="size-4" /></Link></div><div className="mt-12 grid gap-4 lg:grid-cols-3"><div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm lg:col-span-2"><div className="flex items-start justify-between"><div><div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#E6F5EF] text-[#00875A]"><BookOpen className="size-5" /></div><h3 className="text-xl font-semibold">Cited, trusted, verifiable</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Move from a question to the exact section of an Act, gazette or circular in seconds.</p></div><span className="rounded-full bg-[#F3FBF7] px-3 py-1.5 text-[11px] font-semibold text-[#00875A]">Verified in corpus</span></div><div className="mt-8 rounded-xl border border-zinc-200 bg-[#FAFAFA] p-5"><div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500"><FileCheck2 className="size-4 text-[#00875A]" /> NSSF Act, Cap 258</div><p className="text-sm leading-7 text-slate-700">Every employer shall, on or before the ninth day of each month, pay to the Fund the contributions due in respect of the preceding month.</p><div className="mt-4 h-1.5 rounded-full bg-[#B7E6D3]"><div className="h-full w-2/3 rounded-full bg-[#00875A]" /></div></div></div><div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"><div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#E6F5EF] text-[#00875A]"><ShieldCheck className="size-5" /></div><h3 className="text-xl font-semibold">Automated gap analysis</h3><p className="mt-2 text-sm leading-6 text-slate-600">Compare your policies against the rules that matter.</p><div className="mt-6 flex flex-col gap-2 text-xs"><div className="flex justify-between rounded-lg bg-[#F3FBF7] px-3 py-2"><span>Customer due diligence</span><b className="text-[#00875A]">Compliant</b></div><div className="flex justify-between rounded-lg bg-amber-50 px-3 py-2"><span>Incident reporting</span><b className="text-amber-700">Moderate risk</b></div><div className="flex justify-between rounded-lg bg-red-50 px-3 py-2"><span>Data retention</span><b className="text-red-700">Gap detected</b></div></div></div><div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"><div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#E6F5EF] text-[#00875A]"><Sparkles className="size-5" /></div><h3 className="text-xl font-semibold">Weekly compliance briefs</h3><p className="mt-2 text-sm leading-6 text-slate-600">A concise view of active finance directives, delivered to your team.</p><div className="mt-7 border-t border-zinc-100 pt-4 text-xs"><span className="font-semibold text-zinc-900">This week in finance</span><span className="ml-2 text-slate-400">06 Jun 2026</span><p className="mt-3 leading-5 text-slate-500">3 updates require review across Kenya and Rwanda.</p></div></div><div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"><div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#E6F5EF] text-[#00875A]"><Search className="size-5" /></div><h3 className="text-xl font-semibold">Saved searches &amp; feeds</h3><p className="mt-2 text-sm leading-6 text-slate-600">Keep the topics that matter most at your fingertips.</p><div className="mt-7 flex flex-wrap gap-2">{["AML / KYC", "Digital credit", "Biometrics", "Tax"].map((tag) => <span key={tag} className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-slate-600">{tag}</span>)}</div></div></div></div></section>

      <section id="coverage" className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><SectionLabel>Regional intelligence</SectionLabel><h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">One view of regulation<br /><span className="text-slate-400">across African markets.</span></h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["🇰🇪", "Kenya", "CBK · ODPC · CMA · KRA"], ["🇷🇼", "Rwanda", "NBR · Data Protection Law"], ["🇳🇬", "Nigeria", "CBN · NDPR · SEC"], ["🇲🇼", "Malawi", "RBM · Financial Services Act"]].map(([flag, country, tags]) => <div key={country} className="rounded-xl border border-zinc-200 p-6 transition-colors hover:border-[#8BD5B5]"><div className="text-2xl">{flag}</div><h3 className="mt-6 font-semibold">{country}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{tags}</p><Link href="#demo" className="mt-7 inline-flex items-center gap-1 text-xs font-semibold text-[#00875A]">Explore jurisdiction <ArrowRight className="size-3.5" /></Link></div>)}</div></div></section>

      <section className="bg-[#FAFAFA] px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-10"><div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><SectionLabel>Enterprise governance</SectionLabel><h2 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Security built for the<br />regulated economy.</h2><p className="mt-5 max-w-md text-sm leading-7 text-slate-600">Trust is not a feature we add later. It is the foundation of every workflow, citation and decision in SheriaBot.</p></div><div className="grid gap-3 sm:grid-cols-2">{[[ShieldCheck, "SOC 2 Type II certified"], [LockKeyhole, "End-to-end encryption"], [Globe2, "Local data residency options"], [FileCheck2, "ISO 27001 aligned"], [CircleCheck, "Zero model training on customer data"]].map(([Icon, text]) => <div key={text as string} className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-zinc-800"><Icon className="size-4 shrink-0 text-[#00875A]" />{text as string}</div>)}</div></div></div></section>

      <section className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><div className="overflow-hidden rounded-2xl bg-[#E6F5EF]"><Image src="/images/sheriabot-founder-pillar.png" alt="Sunlit institutional colonnade" width={700} height={840} className="h-[420px] w-full object-cover grayscale-[20%]" /></div><blockquote className="mt-7 text-xl font-medium leading-8 tracking-[-0.02em] text-zinc-900">“SheriaBot was founded to close the gap between complex regulation and business agility.”</blockquote><p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">— Founder’s note</p></div><div><SectionLabel>Built with compliance leaders</SectionLabel><h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Confidence compounds.</h2><div className="mt-10 grid gap-4 sm:grid-cols-2">{[["“We can finally show the reasoning behind every recommendation.”", "Chief Risk Officer", "Regional lender"], ["“SheriaBot turns a weekly research task into a five-minute review.”", "Head of Compliance", "Digital credit provider"], ["“The citations give our board conversations a much stronger foundation.”", "General Counsel", "Payments company"], ["“It helps our team act on regulatory change before it becomes a finding.”", "Compliance Director", "African fintech"]].map(([quote, role, company]) => <div key={quote} className="rounded-xl border border-zinc-200 p-5"><BadgeCheck className="size-4 text-[#00875A]" /><p className="mt-4 text-sm leading-6 text-zinc-800">{quote}</p><p className="mt-5 text-xs font-semibold text-zinc-900">{role}</p><p className="mt-1 text-xs text-slate-500">{company}</p></div>)}</div></div></div></section>

      <section id="resources" className="bg-[#FAFAFA] px-5 py-20 lg:px-8 lg:py-24"><div className="mx-auto max-w-3xl"><div className="text-center"><SectionLabel>Questions, answered</SectionLabel><h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Everything you need to know.</h2></div><div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">{faqs.map(([question, answer], index) => <div key={question}><button className="flex w-full items-center justify-between gap-6 py-5 text-left text-sm font-semibold text-zinc-900" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>{question}<ChevronDown className={`size-4 shrink-0 text-slate-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`} /></button>{openFaq === index && <p className="max-w-2xl pb-5 pr-10 text-sm leading-7 text-slate-600">{answer}</p>}</div>)}</div></div></section>

      <section id="demo" className="bg-white px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl rounded-2xl bg-[#07553C] px-7 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:py-16"><div><p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9BE1C0]">Ready when you are</p><h2 className="max-w-2xl text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Turn regulatory complexity into competitive advantage.</h2><p className="mt-5 text-lg text-[#D1F1E2]">Join forward-thinking compliance and legal teams across Africa.</p></div><div className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col"><Link href="mailto:hello@sheria.bot" className="rounded-lg bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#07553C] hover:bg-[#F3FBF7]">Book a personalized demo</Link><Link href="#product" className="rounded-lg border border-[#65B99A] px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/10">Explore platform</Link></div></div></section>
    </main>

    <footer id="company" className="border-t border-zinc-200 bg-[#FAFAFA] px-5 py-14 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.4fr]"><div><Link href="/" className="flex items-center gap-2.5"><Mark /><span className="text-[17px] font-bold">Sheria<span className="text-[#00875A]">Bot</span></span></Link><p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">Regulatory intelligence for Africa’s most ambitious financial institutions.</p></div>{[["Product", "Platform", "Monitoring", "Gap analysis", "Evidence packs"], ["Solutions", "For fintechs", "For banks", "For regulators", "Enterprise"], ["Resources", "Knowledge base", "Coverage map", "Security", "Blog"], ["Company", "About us", "Contact", "Careers", "Sign in"]].map(([title, ...links]) => <div key={title}><h3 className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-900">{title}</h3><div className="mt-5 flex flex-col gap-3">{links.map((link) => <Link key={link} href="#" className="text-sm text-slate-500 hover:text-[#00875A]">{link}</Link>)}</div></div>)}<div><h3 className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-900">Stay informed</h3><p className="mt-5 text-sm leading-6 text-slate-500">A clear view of the regulatory changes that matter.</p><div className="mt-4 flex overflow-hidden rounded-lg border border-zinc-300 bg-white"><input aria-label="Email address" placeholder="Work email" className="min-w-0 flex-1 px-3 text-sm outline-none" /><button aria-label="Subscribe" className="bg-[#00875A] px-3 text-white"><ArrowRight className="size-4" /></button></div></div></div><div className="mt-14 border-t border-zinc-200 pt-6"><p className="max-w-4xl text-xs leading-5 text-slate-500">SheriaBot provides AI-powered regulatory intelligence for internal auditing and compliance workflows. It does not constitute formal legal counsel.</p><p className="mt-4 text-xs text-slate-400">© 2026 SheriaBot. All rights reserved.</p></div></div></footer>
  </div>
}

export default SheriaBotLandingPage

// Keep the icon import used by generated route bundles tree-shakeable while preserving the product vocabulary.
void Workflow
void Check
void CircleCheck
void X
void Menu
void Sparkles
void ShieldCheck
void LockKeyhole
void Globe2
void FileCheck2
void FileSearch
void CircleAlert
void Network
void BarChart3
void BookOpen
void Search
void ArrowRight
void BadgeCheck
void ChevronDown
void Image
void Link
