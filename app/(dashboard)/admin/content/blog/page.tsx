"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Search, MoreVertical, FileText, CheckCircle2,
  Archive, Trash2, ChevronLeft, ChevronRight, Newspaper, Eye,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED:    "bg-green-100 text-green-700",
  DRAFT:        "bg-yellow-100 text-yellow-700",
  ARCHIVED:     "bg-gray-100 text-gray-500",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
}

export default function BlogPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  const utils = trpc.useUtils()

  const { data, isLoading, isError } = trpc.admin.listContent.useQuery({
    contentType: "BLOG_POST",
    contentStatus: statusFilter !== "all" ? (statusFilter as never) : undefined,
    search: search || undefined,
    page,
    limit: 20,
  })

  const updateStatusMutation = trpc.admin.updateContentStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); void utils.admin.listContent.invalidate() },
    onError: (err) => toast.error(err.message),
  })

  const deleteMutation = trpc.admin.deleteContent.useMutation({
    onSuccess: () => { toast.success("Post deleted"); setDeleteTarget(null); void utils.admin.listContent.invalidate() },
    onError: (err) => toast.error(err.message),
  })

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2B4A]">Blog</h1>
        <p className="text-sm text-gray-500 mt-1">Manage blog posts and regulatory insights</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="w-4 h-4" /> Posts ({data?.total ?? "—"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex gap-2 flex-1">
              <Input placeholder="Search posts..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(1))} className="max-w-xs" />
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
            <div className="text-center py-12 text-red-500">Failed to load posts.</div>
          ) : !data?.items.length ? (
            <div className="text-center py-12 text-gray-400">
              <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No blog posts found</p>
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
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Published</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <p className="font-medium text-[#1A2B4A] truncate max-w-[240px]">{item.title ?? "(Untitled)"}</p>
                        </div>
                        {item.excerpt && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px] pl-6">{item.excerpt}</p>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-500 capitalize">{item.category ?? "—"}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{item.viewCount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[item.contentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                          {item.contentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-KE") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.contentStatus !== "PUBLISHED" && <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ documentId: item.id, contentStatus: "PUBLISHED" })}><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Publish</DropdownMenuItem>}
                            {item.contentStatus !== "DRAFT" && <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ documentId: item.id, contentStatus: "DRAFT" })}><Eye className="w-4 h-4 mr-2" /> Set as Draft</DropdownMenuItem>}
                            {item.contentStatus !== "ARCHIVED" && <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ documentId: item.id, contentStatus: "ARCHIVED" })}><Archive className="w-4 h-4 mr-2 text-gray-500" /> Archive</DropdownMenuItem>}
                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget({ id: item.id, title: item.title ?? "this post" })}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
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

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>This will soft-delete &quot;{deleteTarget?.title}&quot;.</AlertDialogDescription>
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
