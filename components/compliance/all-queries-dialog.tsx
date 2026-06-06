"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Search,
    Clock,
    ChevronRight,
    AlertCircle,
    Loader2,
    ArrowRight,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { formatDistanceToNow } from "date-fns"

interface AllQueriesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type QueryRow = {
    id: string
    query: string
    createdAt: string
}

export function AllQueriesDialog({ open, onOpenChange }: AllQueriesDialogProps) {
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState("")
    const LIMIT = 20

    const { data, isLoading, isError, refetch, isFetching } =
        trpc.compliance.history.useQuery(
            { page, limit: LIMIT },
            { enabled: open }
        )

    const queries: QueryRow[] = useMemo(
        () => (Array.isArray(data?.queries) ? (data.queries as unknown as QueryRow[]) : []),
        [data]
    )

    const pagination = data?.pagination

    // Client-side substring filter
    const filtered = useMemo(() => {
        if (!searchInput.trim()) return queries
        const needle = searchInput.toLowerCase()
        return queries.filter((q) => q.query.toLowerCase().includes(needle))
    }, [queries, searchInput])

    const hasMore = pagination ? pagination.page < pagination.pages : false

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>All Queries</DialogTitle>
                    <DialogDescription>
                        {pagination
                            ? `${pagination.total} quer${pagination.total !== 1 ? "ies" : "y"}`
                            : "Your compliance query history"}
                    </DialogDescription>
                </DialogHeader>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search queries..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto -mx-6 px-6">
                    {isLoading ? (
                        <div className="space-y-2 py-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-lg" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <AlertCircle className="h-8 w-8 text-destructive/60" />
                            <p className="font-medium text-foreground">Failed to load queries</p>
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                Retry
                            </Button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                            <p className="font-medium text-foreground">
                                {searchInput.trim()
                                    ? "No queries match your search."
                                    : "No queries yet. Ask your first question!"}
                            </p>
                            {!searchInput.trim() && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    onClick={() => onOpenChange(false)}
                                >
                                    <Link href="/startup/compliance-query">
                                        Ask a question
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1 py-1">
                            {filtered.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/startup/compliance-query/${item.id}`}
                                    onClick={() => onOpenChange(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
                                >
                                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {item.query}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Load more */}
                {hasMore && !searchInput.trim() && (
                    <div className="pt-3 border-t flex justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={isFetching}
                        >
                            {isFetching ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : null}
                            Load more
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
