"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, FileText, Edit, Trash2, Eye, Clock, CheckCircle2 } from "lucide-react"

const articles = [
  { id: 1, title: "CBK PSP Guidelines 2023", category: "Regulations", status: "published", views: 1245, lastUpdated: "2024-01-25" },
  { id: 2, title: "KYC Requirements for Mobile Money", category: "Compliance", status: "published", views: 892, lastUpdated: "2024-01-20" },
  { id: 3, title: "Data Protection Act 2019 Overview", category: "Legal", status: "published", views: 756, lastUpdated: "2024-01-18" },
  { id: 4, title: "AML/CFT Compliance Framework", category: "Compliance", status: "draft", views: 0, lastUpdated: "2024-01-28" },
  { id: 5, title: "Regulatory Sandbox Application Guide", category: "Guides", status: "published", views: 534, lastUpdated: "2024-01-15" },
]

export default function KnowledgeBaseAdminPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Knowledge Base Management</h1>
          <p className="text-muted-foreground mt-1">Manage regulatory content and articles</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Articles</CardTitle>
              <CardDescription>{filteredArticles.length} articles</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px] bg-muted/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{article.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{article.category}</span>
                      <span>{article.views} views</span>
                      <span>Updated: {new Date(article.lastUpdated).toLocaleDateString("en-KE")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={article.status === "published" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                    {article.status === "published" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {article.status}
                  </Badge>
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
