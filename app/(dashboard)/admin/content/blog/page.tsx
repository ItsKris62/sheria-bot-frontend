"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, FileText, Edit, Trash2, Eye, Clock, CheckCircle2 } from "lucide-react"

const posts = [
  { id: 1, title: "Understanding Kenya's New PSP Regulations", author: "Admin", status: "published", views: 2345, publishedAt: "2024-01-25" },
  { id: 2, title: "5 Steps to Achieve AML Compliance", author: "Admin", status: "published", views: 1892, publishedAt: "2024-01-20" },
  { id: 3, title: "Data Protection Best Practices for Fintechs", author: "Admin", status: "draft", views: 0, publishedAt: null },
  { id: 4, title: "CBK Sandbox: What You Need to Know", author: "Admin", status: "published", views: 1534, publishedAt: "2024-01-15" },
]

export default function BlogAdminPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground mt-1">Manage blog posts and content</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>{filteredPosts.length} posts</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px] bg-muted/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>By {post.author}</span>
                      <span>{post.views} views</span>
                      {post.publishedAt && <span>Published: {new Date(post.publishedAt).toLocaleDateString("en-KE")}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={post.status === "published" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                    {post.status === "published" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {post.status}
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
