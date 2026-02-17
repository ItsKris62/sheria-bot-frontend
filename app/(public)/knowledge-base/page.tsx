"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Search,
  BookOpen,
  FileText,
  Shield,
  Scale,
  CreditCard,
  Users,
  Lock,
  ArrowRight,
} from "lucide-react"

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of SheriaBot and regulatory compliance",
    articleCount: 8,
  },
  {
    id: "cbk-regulations",
    name: "CBK Regulations",
    icon: Scale,
    description: "Central Bank of Kenya guidelines and requirements",
    articleCount: 15,
  },
  {
    id: "licensing",
    name: "Licensing & Registration",
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
  },
  {
    slug: "data-protection-act-overview",
    title: "Data Protection Act 2019 Overview",
    category: "data-protection",
    excerpt: "Key provisions of Kenya's Data Protection Act and what they mean for fintechs.",
    popular: true,
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

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularArticles = articles.filter((article) => article.popular)

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
          </div>
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
            >
              Clear filter
            </Button>
          )}
        </div>
      </section>

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
          </div>
        </section>
      )}

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
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground transition-colors group-hover:text-primary">
                          {article.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {article.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
    </div>
  )
}
