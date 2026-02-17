"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Upload,
  Search,
  FileText,
  Folder,
  Download,
  Eye,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Grid,
  List,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const documents = [
  {
    id: 1,
    name: "Certificate of Incorporation",
    category: "Corporate",
    type: "PDF",
    size: "245 KB",
    uploadedAt: "2024-01-10",
    status: "verified",
    expiresAt: null,
  },
  {
    id: 2,
    name: "Tax Compliance Certificate",
    category: "Tax",
    type: "PDF",
    size: "180 KB",
    uploadedAt: "2024-01-15",
    status: "verified",
    expiresAt: "2024-12-31",
  },
  {
    id: 3,
    name: "AML Policy Document",
    category: "Compliance",
    type: "PDF",
    size: "1.2 MB",
    uploadedAt: "2024-01-20",
    status: "pending",
    expiresAt: null,
  },
  {
    id: 4,
    name: "Data Protection Policy",
    category: "Compliance",
    type: "DOCX",
    size: "890 KB",
    uploadedAt: "2024-01-22",
    status: "verified",
    expiresAt: null,
  },
  {
    id: 5,
    name: "Business Continuity Plan",
    category: "Operations",
    type: "PDF",
    size: "2.1 MB",
    uploadedAt: "2024-01-25",
    status: "pending",
    expiresAt: null,
  },
  {
    id: 6,
    name: "Audited Financials 2023",
    category: "Financial",
    type: "PDF",
    size: "5.4 MB",
    uploadedAt: "2024-01-28",
    status: "expired",
    expiresAt: "2024-01-01",
  },
]

const folders = [
  { id: 1, name: "Corporate Documents", count: 8 },
  { id: 2, name: "Compliance Policies", count: 12 },
  { id: 3, name: "Financial Reports", count: 6 },
  { id: 4, name: "License Applications", count: 4 },
]

const statusConfig = {
  verified: { label: "Verified", icon: CheckCircle2, color: "bg-primary/10 text-primary" },
  pending: { label: "Pending", icon: Clock, color: "bg-warning/10 text-warning" },
  expired: { label: "Expired", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category.toLowerCase() === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
          <p className="text-muted-foreground mt-1">
            Securely store and manage your compliance documents
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {folders.map((folder) => (
          <Card
            key={folder.id}
            className="border-border/50 bg-card/50 backdrop-blur hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Folder className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{folder.name}</p>
                  <p className="text-xs text-muted-foreground">{folder.count} documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>{filteredDocuments.length} documents</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[250px] bg-muted/50"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="tax">Tax</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => {
                const status = statusConfig[doc.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{doc.category}</span>
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString("en-KE")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredDocuments.map((doc) => {
                const status = statusConfig[doc.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center p-6 rounded-lg bg-primary/10 mb-3">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doc.size}</p>
                    <div className="mt-2">
                      <Badge className={`${status.color} text-xs`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
