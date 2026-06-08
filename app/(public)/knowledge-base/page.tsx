"use client"
"use client";

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Landmark,
  Bitcoin,
  Settings,
  PenTool,
  Upload,
  FolderCog,
  X,
  ChevronRight,
  BookOpen,
  FileText,
  Shield,
  Scale,
  CreditCard,
  Users,
  Lock,
  ArrowRight,
} from "lucide-react"
} from "lucide-react";

const categories = [
// --- MOCK DATA ---
const CATEGORIES = [
  "All Frameworks",
  "Central Bank (CBK)",
  "Data Protection (ODPC)",
  "KRA & Fiscal Architecture",
  "VASP/Crypto",
  "AML/KYC",
];

const ARTICLES = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of SheriaBot and regulatory compliance",
    articleCount: 8,
    id: "cbk-licensing-framework-overview",
    title: "CBK Licensing Framework Overview",
    preview:
      "A comprehensive breakdown of the Central Bank of Kenya's licensing requirements for financial service providers, including capital thresholds and governance standards.",
    category: "Central Bank (CBK)",
    icon: Landmark,
    author: "Wanjiku N.",
    authorRole: "Lead Compliance Analyst",
    readTime: "4 min read",
    slug: "cbk-licensing-framework-overview",
  },
  {
    id: "cbk-regulations",
    name: "CBK Regulations",
    icon: Scale,
    description: "Central Bank of Kenya guidelines and requirements",
    articleCount: 15,
    id: "data-protection-act-overview",
    title: "Data Protection Act 2019 Overview",
    preview:
      "Understand the key provisions of Kenya's Data Protection Act, including controller registration, cross-border data transfers, and subject consent protocols.",
    category: "Data Protection (ODPC)",
    icon: ShieldCheck,
    author: "Odhiambo J.",
    authorRole: "Data Privacy Counsel",
    readTime: "6 min read",
    slug: "data-protection-act-overview",
  },
  {
    id: "licensing",
    name: "Licensing & Registration",
    id: "digital-credit-provider-license",
    title: "Digital Credit Provider License Requirements",
    preview:
      "Navigate the Digital Credit Providers Regulations 2024. Step-by-step guidance on securing your digital lending license and establishing compliant operational infrastructure.",
    category: "Central Bank (CBK)",
    icon: FileText,
    description: "Fintech licensing requirements and processes",
    articleCount: 12,
  },
  {
    id: "aml-kyc",
    name: "AML/KYC Compliance",
    icon: Shield,
    description: "Anti-money laundering and customer verification",
    articleCount: 10,
  },
  {
    id: "data-protection",
    name: "Data Protection",
    icon: Lock,
    description: "Kenya Data Protection Act compliance",
    articleCount: 9,
  },
  {
    id: "payments",
    name: "Payments & Mobile Money",
    icon: CreditCard,
    description: "Payment systems and M-Pesa integration",
    articleCount: 11,
  },
]

const articles = [
  {
    slug: "getting-started-with-sheriabot",
    title: "Getting Started with SheriaBot",
    category: "getting-started",
    excerpt: "A complete guide to setting up your account and running your first compliance query.",
    popular: true,
  },
  {
    slug: "understanding-compliance-queries",
    title: "Understanding Compliance Queries",
    category: "getting-started",
    excerpt: "Learn how to formulate effective queries to get the most accurate compliance guidance.",
    popular: true,
  },
  {
    slug: "cbk-licensing-framework-overview",
    title: "CBK Licensing Framework Overview",
    category: "cbk-regulations",
    excerpt: "Comprehensive overview of CBK's licensing requirements for different fintech categories.",
    popular: true,
  },
  {
    author: "Wanjiku N.",
    authorRole: "Lead Compliance Analyst",
    readTime: "5 min read",
    slug: "digital-credit-provider-license",
    title: "Digital Credit Provider License Requirements",
    category: "licensing",
    excerpt: "Step-by-step guide to obtaining a digital credit provider license from CBK.",
    popular: true,
  },
  {
    slug: "payment-service-provider-registration",
    title: "Payment Service Provider Registration",
    category: "licensing",
    excerpt: "How to register as a payment service provider under the National Payment System Act.",
    popular: false,
  },
  {
    id: "kyc-requirements-for-fintechs",
    title: "KYC Requirements for Fintechs",
    preview:
      "Implement robust Know Your Customer (KYC) procedures under POCAMLA. Detailed guidance on identity verification, ongoing monitoring, and record retention.",
    category: "AML/KYC",
    icon: Scale,
    author: "Kibet M.",
    authorRole: "AML Specialist",
    readTime: "7 min read",
    slug: "kyc-requirements-for-fintechs",
    title: "KYC Requirements for Fintechs",
    category: "aml-kyc",
    excerpt: "Detailed breakdown of Know Your Customer requirements under POCAMLA.",
    popular: true,
  },
  {
    slug: "transaction-monitoring-guide",
    title: "Transaction Monitoring Guide",
    category: "aml-kyc",
    excerpt: "Best practices for implementing effective transaction monitoring systems.",
    popular: false,
    id: "vasp-crypto-guidelines",
    title: "Virtual Asset Service Provider Guidelines",
    preview:
      "An emerging framework analysis for crypto exchanges and VASPs operating in Kenya. Understand CMA sandbox requirements and anti-money laundering obligations.",
    category: "VASP/Crypto",
    icon: Bitcoin,
    author: "Mutua G.",
    authorRole: "Digital Assets Researcher",
    readTime: "8 min read",
    slug: "vasp-crypto-guidelines",
  },
  {
    slug: "data-protection-act-overview",
    title: "Data Protection Act 2019 Overview",
    category: "data-protection",
    excerpt: "Key provisions of Kenya's Data Protection Act and what they mean for fintechs.",
    popular: true,
    id: "kra-digital-tax-framework",
    title: "Digital Service Tax (DST) Implementation",
    preview:
      "A practical guide to complying with KRA's Digital Service Tax. Learn how to calculate, report, and remit taxes for digital marketplaces and monetization platforms.",
    category: "KRA & Fiscal Architecture",
    icon: BookOpen,
    author: "Akinyi L.",
    authorRole: "Fiscal Policy Expert",
    readTime: "5 min read",
    slug: "kra-digital-tax-framework",
  },
  {
    slug: "consent-management-best-practices",
    title: "Consent Management Best Practices",
    category: "data-protection",
    excerpt: "How to implement proper consent mechanisms under the Data Protection Act.",
    popular: false,
  },
  {
    slug: "mpesa-integration-compliance",
    title: "M-Pesa Integration Compliance",
    category: "payments",
    excerpt: "Regulatory requirements for integrating with Safaricom's M-Pesa platform.",
    popular: true,
  },
  {
    slug: "national-payment-system-act",
    title: "National Payment System Act Guide",
    category: "payments",
    excerpt: "Understanding the NPS Act and its requirements for payment service providers.",
    popular: false,
  },
  {
    slug: "regulatory-sandbox-application",
    title: "Regulatory Sandbox Application Process",
    category: "cbk-regulations",
    excerpt: "How to apply for and operate within CBK's regulatory sandbox.",
    popular: false,
  },
]
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
// --- MAIN COMPONENT ---
export default function KnowledgeBaseIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Frameworks");
  const [isContributorPanelOpen, setIsContributorPanelOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  // Hydration safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const popularArticles = articles.filter((article) => article.popular)
  // Dynamic Filtering Logic
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategory === "All Frameworks" || article.category === activeCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.preview.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Knowledge Base
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Regulatory{" "}
              <span className="text-primary">Knowledge Hub</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Comprehensive guides, tutorials, and documentation on Kenya&apos;s fintech 
              regulatory landscape.
            </p>
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* --- ADMIN CONTRIBUTOR PANEL (SLIDE-OUT) --- */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isContributorPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsContributorPanelOpen(false)}
        aria-hidden="true"
      />

            {/* Search */}
            <div className="relative mx-auto mt-10 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search the knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 text-base"
              />
            </div>
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-900/50 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isContributorPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-900">
          <div>
            <h2 className="text-white text-lg font-medium tracking-tight">Contributor Tools</h2>
            <p className="text-zinc-500 text-sm mt-1">Manage regulatory corpus</p>
          </div>
          <button
            onClick={() => setIsContributorPanelOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            aria-label="Close panel"
          >
            <X strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                className="text-left"
              >
                <Card className={`h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${
                  selectedCategory === category.id ? "border-primary/50 ring-1 ring-primary/50" : ""
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        selectedCategory === category.id 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-primary/10 text-primary"
                      }`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                        <p className="mt-2 text-xs text-primary">{category.articleCount} articles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="mt-4"
        <div className="p-6 space-y-3 flex-1 overflow-y-auto">
          {[
            { label: "Publish New Resource", icon: PenTool, desc: "Draft a new compliance guide" },
            { label: "Upload Gazette PDF", icon: Upload, desc: "Ingest structured legal documents" },
            { label: "Manage Categories", icon: FolderCog, desc: "Organize the regulatory taxonomy" },
          ].map((tool, idx) => (
            <button
              key={idx}
              className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-transparent bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              Clear filter
            </Button>
          )}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black border border-zinc-800 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                <tool.icon strokeWidth={1.5} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium group-hover:text-white transition-colors">
                  {tool.label}
                </h3>
                <p className="text-zinc-500 text-sm">{tool.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      </aside>

      {/* Popular Articles */}
      {!selectedCategory && !searchQuery && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Popular Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularArticles.map((article) => (
                <Link key={article.slug} href={`/knowledge-base/${article.slug}`}>
                  <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {categories.find((c) => c.id === article.category)?.name}
                      </Badge>
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative">
        {/* --- TOP ACTIONS --- */}
        <div className="flex justify-end mb-12">
          <button
            onClick={() => setIsContributorPanelOpen(true)}
            className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <Settings strokeWidth={1.5} className="w-4 h-4" />
            <span className="text-sm font-medium">Contributor Tools</span>
          </button>
        </div>

        {/* --- PREMIUM HEADER SECTION --- */}
        <header className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight mb-6">
            Regulatory Intelligence <br className="hidden md:block" />
            <span className="text-zinc-500">Archive</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl">
            Expertly curated breakdowns of Kenyan fintech laws, circulars, and compliance frameworks.
            Updated continuously by our legal compliance team.
          </p>

          {/* Search Bar */}
          <div className="relative w-full group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors duration-300"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search acts, regulations, and compliance guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all duration-500 shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
            />
          </div>
        </section>
      )}
        </header>

      {/* All/Filtered Articles */}
      <section className={`py-12 ${!selectedCategory && !searchQuery ? "border-t border-border" : ""}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            {selectedCategory 
              ? categories.find((c) => c.id === selectedCategory)?.name
              : searchQuery 
                ? "Search Results" 
                : "All Articles"
            }
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"})
            </span>
          </h2>
        {/* --- INTERACTIVE CATEGORY PILLARS --- */}
        <div className="flex overflow-x-auto pb-6 mb-8 gap-3 no-scrollbar mask-fade-edges">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                activeCategory === category
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(0,135,90,0.15)]"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

          {filteredArticles.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Link key={article.slug} href={`/knowledge-base/${article.slug}`}>
                  <Card className="group border-border/50 bg-card/50 transition-all hover:border-primary/50">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
        {/* --- CURATION CARD GRID --- */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link href={`/knowledge-base/${article.slug}`} key={article.id} className="group outline-none">
                <article className="relative bg-zinc-950/40 border border-zinc-800/60 rounded-3xl p-7 flex flex-col h-full hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,135,90,0.08)] hover:border-emerald-500/30 transition-all duration-500 focus-within:ring-2 focus-within:ring-emerald-500/50">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800/80 group-hover:border-emerald-500/30 transition-colors duration-500 shadow-inner">
                      <article.icon strokeWidth={1.5} className="w-5 h-5 text-zinc-300 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      {article.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-medium text-white mb-3 tracking-tight leading-snug group-hover:text-emerald-50 transition-colors duration-300">
                    {article.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-2 flex-1">
                    {article.preview}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-white border border-zinc-700">
                        {article.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground transition-colors group-hover:text-primary">
                          {article.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {article.excerpt}
                        </p>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">{article.author}</span>
                        <span className="text-[11px] text-zinc-500">{article.authorRole}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
                    </div>
                    <div className="flex items-center gap-1.5 bg-zinc-900/50 px-2.5 py-1 rounded-md border border-zinc-800">
                      <span className="text-[11px] font-medium text-emerald-400/90">{article.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
              <Search strokeWidth={1.5} className="w-6 h-6 text-zinc-500" />
            </div>
          )}
        </div>
      </section>
            <h3 className="text-xl font-medium text-white mb-2">No frameworks found</h3>
            <p className="text-zinc-500 max-w-md">
              We couldn't find any documents matching &quot;{searchQuery}&quot; in the selected category.
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All Frameworks"); }}
              className="mt-6 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Our AI-powered compliance assistant can answer your specific questions 
                with citations from Kenya&apos;s regulatory framework.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/register">
                    Try SheriaBot Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Global Style for scrollbar hiding (Can be moved to globals.css) */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </div>
  )
  );
}
