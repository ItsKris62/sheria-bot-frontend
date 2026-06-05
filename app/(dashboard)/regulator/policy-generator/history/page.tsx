"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
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
  Trash2,
  Plus,
} from "lucide-react"
import {
  type EnterprisePolicyStatus,
  useEnterprisePolicies,
  useEnterprisePolicyActions,
} from "@/hooks/use-enterprise-policies"
import { getErrorMessage } from "@/lib/trpc"
import { toast } from "sonner"

type PolicyHistoryItem = {
  id: string
  title: string
  policyType: string
  status: EnterprisePolicyStatus
  progress: number
  createdAt: Date | string
  completedAt?: Date | string | null
}

const statusConfig: Record<EnterprisePolicyStatus, { icon: typeof CheckCircle2; label: string; className: string; spin?: boolean }> = {
  INITIALIZING: { icon: Loader2, label: "Initializing", className: "text-primary border-primary/50", spin: true },
  OUTLINING: { icon: Loader2, label: "Outlining", className: "text-primary border-primary/50", spin: true },
  DRAFTING: { icon: Loader2, label: "Drafting", className: "text-primary border-primary/50", spin: true },
  REVIEWING: { icon: Loader2, label: "Reviewing", className: "text-primary border-primary/50", spin: true },
  COMPLETED: { icon: CheckCircle2, label: "Completed", className: "text-secondary border-secondary/50" },
  FAILED: { icon: AlertCircle, label: "Failed", className: "text-destructive border-destructive/50" },
  ARCHIVED: { icon: FileText, label: "Archived", className: "text-muted-foreground border-muted-foreground/50" },
}

function PolicyHistoryContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<EnterprisePolicyStatus | "all">("all")
  const queryStatus = statusFilter === "all" ? undefined : statusFilter
  const { data, isLoading, isError, error } = useEnterprisePolicies({ limit: 50, status: queryStatus })
  const { deletePolicy, isDeleting } = useEnterprisePolicyActions()
  const policies = (data?.items ?? []) as PolicyHistoryItem[]

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return policies
    return policies.filter((policy) =>
      policy.title.toLowerCase().includes(query) ||
      policy.policyType.toLowerCase().replace(/_/g, " ").includes(query)
    )
  }, [policies, searchQuery])

  const handleDelete = async (policyId: string) => {
    try {
      await deletePolicy({ policyId })
      toast.success("Policy archived")
    } catch (err) {
      toast.error("Archive failed", { description: getErrorMessage(err) })
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
            View and manage generated Enterprise policy drafts.
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/regulator/policy-generator">
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Link>
        </Button>
      </div>

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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EnterprisePolicyStatus | "all")}>
              <SelectTrigger className="w-full sm:w-[190px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="INITIALIZING">Initializing</SelectItem>
                <SelectItem value="OUTLINING">Outlining</SelectItem>
                <SelectItem value="DRAFTING">Drafting</SelectItem>
                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Generated Policies ({filteredHistory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading generated policies...
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {getErrorMessage(error)}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "No policies found matching your criteria."
                  : "No generated policies yet. Create your first Enterprise policy draft to get started."}
              </p>
              {(searchQuery || statusFilter !== "all") ? (
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}>
                  Clear Filters
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((policy) => {
                    const status = statusConfig[policy.status] ?? statusConfig.INITIALIZING
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
                          <Badge variant="outline">{policy.policyType.replace(/_/g, " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.className}>
                            <StatusIcon className={`mr-1 h-3 w-3 ${status.spin ? "animate-spin" : ""}`} />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{policy.progress}%</TableCell>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={isDeleting}
                              onClick={() => void handleDelete(policy.id)}
                            >
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

export default function PolicyHistoryPage() {
  return (
    <FeatureGate
      feature="policyGeneration"
      fallback={(
        <LockedFeatureCard
          feature="policyGeneration"
          requiredPlan="ENTERPRISE"
          title="AI Policy Generator is available on Enterprise plans."
          description="Generate structured compliance policies grounded in SheriaBot's legal corpus, with citations and review support."
        />
      )}
    >
      <PolicyHistoryContent />
    </FeatureGate>
  )
}
