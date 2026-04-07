"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search, MoreVertical, BookOpen, CheckCircle2,
  Archive, Trash2, ChevronLeft, ChevronRight, FileText, Eye, Plus,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED:    "bg-green-100 text-green-700",
  DRAFT:        "bg-yellow-100 text-yellow-700",
  ARCHIVED:     "bg-gray-100 text-gray-500",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
}

type ContentItem = {
  id: string
  title: string | null
  category: string | null
  contentStatus: string
  viewCount: number
  updatedAt: Date | string
}

export default function KnowledgeBasePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ title: "", excerpt: "", category: "" })

  const utils = trpc.useUtils()

  const { data, isLoading, isError } = trpc.admin.listContent.useQuery({
    contentType: "KNOWLEDGE_BASE_ARTICLE",
    contentStatus: statusFilter !== "all"
      ? (statusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED" | "UNDER_REVIEW")
      : undefined,
    search: search || undefined,
    page,
    limit: 20,
  })

  const updateStatusMutation = trpc.admin.updateContentStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); void utils.admin.listContent.invalidate() },
    onError: (err) => toast.error(err.message),
  })

  const deleteMutation = trpc.admin.deleteContent.useMutation({
    onSuccess: () => { toast.success("Article deleted"); setDeleteTarget(null); void utils.admin.listContent.invalidate() },
    onError: (err) => toast.error(err.message),
  })

  const createMutation = trpc.admin.createContent.useMutation({
    onSuccess: () => {
      toast.success("Draft article created")
      setCreateOpen(false)
      setCreateForm({ title: "", excerpt: "", category: "" })
      void utils.admin.listContent.invalidate()
    },
    onError: (err) => toast.error(err.message),
  })

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B4A]">Knowledge Base</h1>
          <p className="text-sm text-gray-500 mt-1">Manage help articles and compliance guides</p>
        </div>
        <Button className="bg-[#00875A] hover:bg-[#007a50] text-white gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Article
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Articles ({data?.total ?? "—"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex gap-2 flex-1">
              <Input placeholder="Search articles..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))} className="max-w-xs" />
              <Button variant="outline" size="icon" onClick={() => { setSearch(searchInput); setPage(1) }}><Search className="w-4 h-4" /></Button>
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">Failed to load articles.</div>
          ) : !data?.items.length ? (
            <div className="text-center py-12 text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No knowledge base articles found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Views</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(data.items as ContentItem[]).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <p className="font-medium text-[#1A2B4A] truncate max-w-[240px]">{item.title ?? "(Untitled)"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-500 capitalize">{item.category ?? "—"}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{item.viewCount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[item.contentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                          {item.contentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{new Date(item.updatedAt).toLocaleDateString("en-KE")}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.contentStatus !== "PUBLISHED" && <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ documentId: item.id, contentStatus: "PUBLISHED" })}><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Publish</DropdownMenuItem>}
                            {item.contentStatus !== "DRAFT" && <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ documentId: item.id, contentStatus: "DRAFT" })}><Eye className="w-4 h-4 mr-2" /> Set as Draft</DropdownMenuItem>}
                            {item.contentStatus !== "ARCHIVED" && <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ documentId: item.id, contentStatus: "ARCHIVED" })}><Archive className="w-4 h-4 mr-2 text-gray-500" /> Archive</DropdownMenuItem>}
                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget({ id: item.id, title: item.title ?? "this article" })}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data && data.total > 20 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Knowledge Base Article</DialogTitle>
            <DialogDescription>Creates a draft article. You can edit the full content after creation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Article title"
                value={createForm.title}
                onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Summary</Label>
              <Textarea
                placeholder="Brief description of what this article covers (optional)"
                value={createForm.excerpt}
                onChange={(e) => setCreateForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                placeholder="e.g. AML/KYC, Data Protection"
                value={createForm.category}
                onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#00875A] hover:bg-[#007a50]"
              disabled={!createForm.title.trim() || createMutation.isPending}
              onClick={() => createMutation.mutate({
                contentType: "KNOWLEDGE_BASE_ARTICLE",
                title: createForm.title.trim(),
                excerpt: createForm.excerpt.trim() || undefined,
                category: createForm.category.trim() || undefined,
              })}
            >
              {createMutation.isPending ? "Creating..." : "Create Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>This will soft-delete &quot;{deleteTarget?.title}&quot;. It can be recovered from the database if needed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteTarget && deleteMutation.mutate({ documentId: deleteTarget.id })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
