"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  ArrowRight,
  Search,
  Calendar,
  Clock,
  User,
} from "lucide-react"

const categories = [
  "All",
  "Regulatory Updates",
  "Compliance Tips",
  "Industry News",
  "Product Updates",
  "Case Studies",
]

const blogPosts = [
  {
    slug: "cbk-digital-credit-providers-regulations-2024",
    title: "Understanding the CBK Digital Credit Providers Regulations 2024",
    excerpt: "A comprehensive breakdown of the new regulations affecting digital lenders in Kenya, including licensing requirements and consumer protection measures.",
    category: "Regulatory Updates",
    author: "Dr. Amina Ochieng",
    date: "2025-01-15",
    readTime: "8 min read",
    featured: true,
  },
  {
    slug: "aml-kyc-best-practices-kenya-fintechs",
    title: "AML/KYC Best Practices for Kenya Fintechs",
    excerpt: "Learn the essential AML and KYC procedures every fintech must implement to stay compliant with Kenya's financial regulations.",
    category: "Compliance Tips",
    author: "Grace Wanjiru",
    date: "2025-01-10",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "data-protection-act-fintech-compliance",
    title: "Data Protection Act Compliance: A Fintech Guide",
    excerpt: "How Kenya's Data Protection Act 2019 affects fintech operations and what steps you need to take for compliance.",
    category: "Compliance Tips",
    author: "Peter Kamau",
    date: "2025-01-05",
    readTime: "10 min read",
    featured: false,
  },
  {
    slug: "sandbox-regulatory-framework-kenya",
    title: "Navigating Kenya's Regulatory Sandbox Framework",
    excerpt: "Everything you need to know about applying for and operating within the CBK's regulatory sandbox for innovative financial products.",
    category: "Regulatory Updates",
    author: "Dr. Amina Ochieng",
    date: "2024-12-20",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "mpesa-integration-compliance-checklist",
    title: "M-Pesa Integration Compliance Checklist",
    excerpt: "A step-by-step checklist for fintechs integrating with M-Pesa, covering all regulatory and technical requirements.",
    category: "Compliance Tips",
    author: "David Mwangi",
    date: "2024-12-15",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "sheriabot-policy-generator-launch",
    title: "Introducing SheriaBot's AI Policy Generator",
    excerpt: "We're excited to announce our new AI-powered policy generator, designed to help regulators create comprehensive compliance frameworks.",
    category: "Product Updates",
    author: "Peter Kamau",
    date: "2024-12-10",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "finpay-compliance-transformation-case-study",
    title: "How FinPay Reduced Compliance Time by 70%",
    excerpt: "A case study on how one of Kenya's leading payment providers transformed their compliance process with SheriaBot.",
    category: "Case Studies",
    author: "Grace Wanjiru",
    date: "2024-12-01",
    readTime: "6 min read",
    featured: false,
  },
  {
    slug: "kenya-fintech-regulatory-outlook-2025",
    title: "Kenya Fintech Regulatory Outlook 2025",
    excerpt: "Our predictions for the regulatory changes that will shape Kenya's fintech sector in the coming year.",
    category: "Industry News",
    author: "Dr. Amina Ochieng",
    date: "2024-11-25",
    readTime: "9 min read",
    featured: false,
  },
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Blog
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Regulatory Insights &{" "}
              <span className="text-primary">Compliance News</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Stay informed with the latest regulatory updates, compliance tips, 
              and industry news from Kenya&apos;s fintech sector.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Featured Articles</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3 text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("en-KE", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric" 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="border-y border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-transparent"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            {selectedCategory === "All" ? "All Articles" : selectedCategory}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"})
            </span>
          </h2>

          {filteredPosts.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSelectedCategory("All")
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="group h-full border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {post.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Stay Updated
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Subscribe to our newsletter for weekly regulatory updates and compliance tips.
              </p>
              <div className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row">
                <Input 
                  placeholder="Enter your email" 
                  type="email"
                  className="flex-1"
                />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
