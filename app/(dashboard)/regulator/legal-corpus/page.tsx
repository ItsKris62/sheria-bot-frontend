"use client"

import { useState } from "react"
import Link from "next/link"
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
  Search,
  FileText,
  Upload,
  FolderOpen,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  BookOpen,
} from "lucide-react"

const documents = [
  {
    id: "doc-001",
    title: "Central Bank of Kenya Act (Cap 491)",
    category: "Primary Legislation",
    type: "Act",
    lastUpdated: "2024-06-15",
    status: "active",
    sections: 78,
  },
  {
    id: "doc-002",
    title: "Digital Credit Providers Regulations, 2024",
    category: "Regulations",
    type: "Regulation",
    lastUpdated: "2024-01-10",
    status: "active",
    sections: 45,
  },
  {
    id: "doc-003",
    title: "National Payment System Act, 2011",
    category: "Primary Legislation",
    type: "Act",
    lastUpdated: "2023-12-01",
    status: "active",
    sections: 52,
  },
  {
    id: "doc-004",
    title: "Data Protection Act, 2019",
    category: "Primary Legislation",
    type: "Act",
    lastUpdated: "2023-11-20",
    status: "active",
    sections: 91,
  },
  {
    id: "doc-005",
    title: "POCAMLA Regulations, 2022",
    category: "Regulations",
    type: "Regulation",
    lastUpdated: "2023-10-15",
    status: "active",
    sections: 34,
  },
  {
    id: "doc-006",
    title: "CBK Prudential Guidelines, 2020",
    category: "Guidelines",
    type: "Guideline",
    lastUpdated: "2023-09-01",
    status: "under_review",
    sections: 120,
  },
  {
    id: "doc-007",
    title: "Mobile Money Regulations (Draft)",
    category: "Regulations",
    type: "Regulation",
    lastUpdated: "2024-01-05",
    status: "draft",
    sections: 28,
  },
]

const categories = ["All", "Primary Legislation", "Regulations", "Guidelines", "Circulars"]
const statuses = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "under_review", label: "Under Review" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

const statusConfig = {
  active: { label: "Active", className: "border-secondary/50 text-secondary" },
  under_review: { label: "Under Review", className: "border-accent/50 text-accent" },
  draft: { label: "Draft", className: "border-muted-foreground/50 text-muted-foreground" },
  archived: { label: "Archived", className: "border-destructive/50 text-destructive" },
}

export default function LegalCorpusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: documents.length,
    active: documents.filter((d) => d.status === "active").length,
    sections: documents.reduce((sum, d) => sum + d.sections, 0),
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Legal Corpus Manager</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and organize Kenya&apos;s fintech regulatory documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <FileText className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.sections}</p>
                <p className="text-sm text-muted-foreground">Total Sections</p>
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
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                  className={categoryFilter === cat ? "bg-primary text-primary-foreground" : "bg-transparent"}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDocs.length === 0 ? (
          <Card className="col-span-full border-border/50">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No documents found</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => {
                setSearchQuery("")
                setCategoryFilter("All")
                setStatusFilter("all")
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDocs.map((doc) => {
            const status = statusConfig[doc.status as keyof typeof statusConfig]
            return (
              <Card key={doc.id} className="group border-border/50 transition-all hover:border-primary/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      {doc.type}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${status.className}`}>
                      {status.label}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 line-clamp-2 text-base">
                    <Link 
                      href={`/regulator/legal-corpus/${doc.id}`}
                      className="hover:text-primary"
                    >
                      {doc.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{doc.sections} sections</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(doc.lastUpdated).toLocaleDateString("en-KE", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="sm" className="h-8" asChild>
                      <Link href={`/regulator/legal-corpus/${doc.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8" asChild>
                      <Link href={`/regulator/legal-corpus/${doc.id}?edit=true`}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
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
