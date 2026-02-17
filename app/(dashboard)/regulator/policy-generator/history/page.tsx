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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowLeft,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  Download,
  Trash2,
  Plus,
} from "lucide-react"

const policyHistory = [
  {
    id: "pol-001",
    title: "Digital Credit Provider Consumer Protection Policy",
    category: "Consumer Protection",
    status: "completed",
    createdAt: "2025-01-15T10:30:00Z",
    citations: 4,
  },
  {
    id: "pol-002",
    title: "AML/CFT Compliance Framework for Payment Providers",
    category: "AML/CFT",
    status: "completed",
    createdAt: "2025-01-12T14:20:00Z",
    citations: 6,
  },
  {
    id: "pol-003",
    title: "Data Protection Policy for Mobile Money Operators",
    category: "Data Protection",
    status: "completed",
    createdAt: "2025-01-10T09:15:00Z",
    citations: 5,
  },
  {
    id: "pol-004",
    title: "Cybersecurity Risk Management Framework",
    category: "Cybersecurity",
    status: "processing",
    createdAt: "2025-01-08T16:45:00Z",
    citations: 0,
  },
  {
    id: "pol-005",
    title: "Regulatory Sandbox Participation Guidelines",
    category: "Licensing",
    status: "completed",
    createdAt: "2025-01-05T11:00:00Z",
    citations: 3,
  },
  {
    id: "pol-006",
    title: "Foreign Exchange Bureau Compliance Manual",
    category: "Forex",
    status: "failed",
    createdAt: "2025-01-03T08:30:00Z",
    citations: 0,
  },
]

const statusConfig = {
  completed: { icon: CheckCircle2, label: "Completed", className: "text-secondary border-secondary/50" },
  processing: { icon: Loader2, label: "Processing", className: "text-primary border-primary/50" },
  failed: { icon: AlertCircle, label: "Failed", className: "text-destructive border-destructive/50" },
}

export default function PolicyHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredHistory = policyHistory.filter((policy) => {
    const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || policy.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link 
            href="/regulator/policy-generator" 
            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Policy Generator
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Policy Generation History</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage your previously generated policies
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/regulator/policy-generator">
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Generated Policies ({filteredHistory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No policies found matching your criteria</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Citations</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((policy) => {
                    const status = statusConfig[policy.status as keyof typeof statusConfig]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={policy.id}>
                        <TableCell>
                          <Link 
                            href={`/regulator/policy-generator/${policy.id}`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {policy.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{policy.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.className}>
                            <StatusIcon className={`mr-1 h-3 w-3 ${policy.status === "processing" ? "animate-spin" : ""}`} />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{policy.citations}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(policy.createdAt).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link href={`/regulator/policy-generator/${policy.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={policy.status !== "completed"}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
