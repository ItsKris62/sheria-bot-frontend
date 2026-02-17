"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Newspaper,
  Search,
  ExternalLink,
  Clock,
  Filter,
  Bell,
  TrendingUp,
  Globe,
  AlertTriangle,
} from "lucide-react"

const newsItems = [
  {
    id: "1",
    title: "CBK Announces New Digital Lending Guidelines Effective March 2025",
    source: "Central Bank of Kenya",
    category: "regulation",
    date: "2025-01-20",
    summary: "The Central Bank of Kenya has issued comprehensive guidelines for digital credit providers, including stricter consumer protection measures and enhanced disclosure requirements.",
    impact: "high",
    url: "#",
  },
  {
    id: "2",
    title: "Kenya Data Protection Commissioner Issues Fintech Compliance Advisory",
    source: "ODPC Kenya",
    category: "compliance",
    date: "2025-01-18",
    summary: "The Office of the Data Protection Commissioner has released an advisory specifically targeting fintech companies on data handling and cross-border transfer requirements.",
    impact: "medium",
    url: "#",
  },
  {
    id: "3",
    title: "Parliament Debates Amendments to National Payment System Act",
    source: "Kenya Parliament",
    category: "legislation",
    date: "2025-01-15",
    summary: "Proposed amendments include provisions for cryptocurrency regulation and enhanced cybersecurity requirements for payment service providers.",
    impact: "high",
    url: "#",
  },
  {
    id: "4",
    title: "FRC Updates Suspicious Transaction Reporting Templates",
    source: "Financial Reporting Centre",
    category: "aml",
    date: "2025-01-12",
    summary: "The Financial Reporting Centre has released updated STR templates with new fields for digital asset transactions.",
    impact: "medium",
    url: "#",
  },
  {
    id: "5",
    title: "East African Community Harmonizes Cross-Border Payment Regulations",
    source: "EAC Secretariat",
    category: "regional",
    date: "2025-01-10",
    summary: "EAC member states agree on common framework for cross-border mobile money transfers, effective July 2025.",
    impact: "medium",
    url: "#",
  },
  {
    id: "6",
    title: "CBK Sandbox Admits Five New Fintech Innovations",
    source: "Central Bank of Kenya",
    category: "sandbox",
    date: "2025-01-08",
    summary: "Latest cohort includes blockchain-based remittance services and AI-powered credit scoring solutions.",
    impact: "low",
    url: "#",
  },
]

const categoryConfig = {
  regulation: { label: "Regulation", className: "bg-primary/10 text-primary border-primary/30" },
  compliance: { label: "Compliance", className: "bg-secondary/10 text-secondary border-secondary/30" },
  legislation: { label: "Legislation", className: "bg-accent/10 text-accent border-accent/30" },
  aml: { label: "AML/CFT", className: "bg-destructive/10 text-destructive border-destructive/30" },
  regional: { label: "Regional", className: "bg-chart-4/10 text-chart-4 border-chart-4/30" },
  sandbox: { label: "Sandbox", className: "bg-chart-5/10 text-chart-5 border-chart-5/30" },
}

const impactConfig = {
  high: { label: "High Impact", className: "border-destructive/50 text-destructive" },
  medium: { label: "Medium Impact", className: "border-accent/50 text-accent" },
  low: { label: "Low Impact", className: "border-muted-foreground/50 text-muted-foreground" },
}

export default function IntelligenceFeedPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [impactFilter, setImpactFilter] = useState("all")

  const filteredNews = newsItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesImpact = impactFilter === "all" || item.impact === impactFilter
    return matchesSearch && matchesCategory && matchesImpact
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intelligence Feed</h1>
          <p className="mt-1 text-muted-foreground">
            Real-time regulatory news and updates from Kenya&apos;s fintech sector
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Bell className="mr-2 h-4 w-4" />
            Set Alerts
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{newsItems.length}</p>
                <p className="text-sm text-muted-foreground">Total Updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {newsItems.filter((n) => n.impact === "high").length}
                </p>
                <p className="text-sm text-muted-foreground">High Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search regulatory updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="regulation">Regulation</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="legislation">Legislation</SelectItem>
                <SelectItem value="aml">AML/CFT</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="sandbox">Sandbox</SelectItem>
              </SelectContent>
            </Select>
            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No updates found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredNews.map((item) => {
            const category = categoryConfig[item.category as keyof typeof categoryConfig]
            const impact = impactConfig[item.impact as keyof typeof impactConfig]
            return (
              <Card key={item.id} className="border-border/50 transition-all hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={category.className}>
                          {category.label}
                        </Badge>
                        <Badge variant="outline" className={impact.className}>
                          {impact.label}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground">{item.summary}</p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{item.source}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString("en-KE", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                      Read More
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
