"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { AlertCircle, ArrowRight, Building2, Calendar, CheckCircle2, Clock, FileText, Plus, Search } from "lucide-react"

type ApplicationRow = {
  id: string
  title: string
  regulator: string
  licenseType: string
  status: string
  progress: number
  referenceNumber: string | null
  nextAction: string | null
  dueDate: Date | string | null
  submittedAt: Date | string | null
  updatedAt: Date | string
  _count?: { documents: number; fees: number; regulatorFeedback: number; timelineEvents: number }
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof FileText }> = {
  DRAFT: { label: "Draft", icon: FileText, color: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "In Progress", icon: Clock, color: "bg-primary/10 text-primary" },
  SUBMITTED: { label: "Submitted", icon: AlertCircle, color: "bg-warning/10 text-warning" },
  AWAITING_FEEDBACK: { label: "Awaiting Feedback", icon: AlertCircle, color: "bg-warning/10 text-warning" },
  APPROVED: { label: "Approved", icon: CheckCircle2, color: "bg-primary/10 text-primary" },
  REJECTED: { label: "Rejected", icon: AlertCircle, color: "bg-destructive/10 text-destructive" },
  WITHDRAWN: { label: "Withdrawn", icon: FileText, color: "bg-muted text-muted-foreground" },
}

export default function ApplicationsPage() {
  const utils = trpc.useUtils()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    regulator: "",
    licenseType: "",
    referenceNumber: "",
    nextAction: "",
    dueDate: "",
  })

  const { data, isLoading, isError } = trpc.application.list.useQuery({
    page: 1,
    limit: 50,
    status: statusFilter === "all" ? undefined : statusFilter as never,
    search: searchQuery.trim() || undefined,
  })
  const createMutation = trpc.application.create.useMutation({
    onSuccess: () => {
      setForm({ title: "", regulator: "", licenseType: "", referenceNumber: "", nextAction: "", dueDate: "" })
      setFormOpen(false)
      void utils.application.list.invalidate()
      toast.success("Application tracking record created")
    },
    onError: (err) => toast.error("Could not create application", { description: getErrorMessage(err) }),
  })

  const applications: ApplicationRow[] = Array.isArray(data?.applications) ? (data.applications as ApplicationRow[]) : []
  const stats = data?.stats ?? { total: 0, inProgress: 0, submitted: 0, approved: 0 }
  const statCards = [
    { label: "Total Applications", value: stats.total, Icon: FileText },
    { label: "In Progress", value: stats.inProgress, Icon: Clock },
    { label: "Submitted", value: stats.submitted, Icon: AlertCircle },
    { label: "Approved", value: stats.approved, Icon: CheckCircle2 },
  ]

  const submit = () => {
    createMutation.mutate({
      title: form.title,
      regulator: form.regulator,
      licenseType: form.licenseType,
      referenceNumber: form.referenceNumber || undefined,
      nextAction: form.nextAction || undefined,
      dueDate: form.dueDate ? new Date(`${form.dueDate}T00:00:00`) : undefined,
      progress: 0,
      status: "DRAFT",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">License Applications</h1>
          <p className="text-muted-foreground mt-1">Track application status, documents, fees, timelines, and regulator feedback</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => setFormOpen((value) => !value)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {formOpen ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Create Application Record</CardTitle>
            <CardDescription>Start tracking a real regulatory application for your organization.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Payment Service Provider License" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Input placeholder="Central Bank of Kenya" value={form.regulator} onChange={(e) => setForm((f) => ({ ...f, regulator: e.target.value }))} />
            <Input placeholder="License type" value={form.licenseType} onChange={(e) => setForm((f) => ({ ...f, licenseType: e.target.value }))} />
            <Input placeholder="Reference number (optional)" value={form.referenceNumber} onChange={(e) => setForm((f) => ({ ...f, referenceNumber: e.target.value }))} />
            <Input placeholder="Next action (optional)" value={form.nextAction} onChange={(e) => setForm((f) => ({ ...f, nextAction: e.target.value }))} />
            <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            <div className="flex gap-2 md:col-span-2">
              <Button onClick={submit} disabled={createMutation.isPending || !form.title || !form.regulator || !form.licenseType}>
                {createMutation.isPending ? "Creating..." : "Create Application"}
              </Button>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map(({ label, value, Icon }) => (
          <Card key={label} className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>Organization-scoped application tracking records</CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search applications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 sm:w-[250px] bg-muted/50" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:w-[190px] bg-muted/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-[112px] rounded-lg" />
                <Skeleton className="h-[112px] rounded-lg" />
                <Skeleton className="h-[112px] rounded-lg" />
              </>
            ) : isError ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Could not load application records.</p>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No application records yet.</p>
              </div>
            ) : applications.map((app) => {
              const status = statusConfig[app.status] ?? statusConfig.DRAFT
              const StatusIcon = status.icon
              return (
                <Link key={app.id} href={`/startup/applications/${app.id}`}>
                  <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-foreground">{app.title}</h3>
                            {app.referenceNumber ? <Badge variant="outline" className="font-mono text-xs">{app.referenceNumber}</Badge> : null}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{app.regulator}</span>
                            <span>{app.licenseType}</span>
                            {app.dueDate ? <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {new Date(app.dueDate).toLocaleDateString("en-KE")}</span> : null}
                          </div>
                          {app.nextAction ? <p className="mt-2 text-sm text-primary">Next: {app.nextAction}</p> : null}
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 lg:items-end">
                        <Badge className={status.color}><StatusIcon className="h-3 w-3 mr-1" />{status.label}</Badge>
                        <div className="w-40">
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground">{app.progress}%</span>
                          </div>
                          <Progress value={app.progress} className="h-1.5" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(app._count?.documents ?? 0)} docs - {(app._count?.regulatorFeedback ?? 0)} feedback
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
