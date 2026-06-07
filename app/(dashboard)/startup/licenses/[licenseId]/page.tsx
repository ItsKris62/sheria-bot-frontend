"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, BadgeCheck, Calendar, CheckCircle2, Clock, FileText, Landmark, Plus, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage, trpc } from "@/lib/trpc"

type LicenseDetail = {
  id: string
  licenseType: string
  regulator: string
  licenseNumber: string | null
  status: string
  issueDate: string | Date | null
  expiryDate: string | Date | null
  renewalDueDate: string | Date | null
  submittedAt: string | Date | null
  approvedAt: string | Date | null
  notes: string | null
  createdAt: string | Date
  updatedAt: string | Date
  assignedOwner?: { id: string; fullName: string; email: string } | null
  createdBy?: { fullName: string; email: string } | null
  updatedBy?: { fullName: string; email: string } | null
  derived?: {
    daysUntilExpiry: number | null
    daysUntilRenewal: number | null
    isExpired: boolean
    isRenewalDueSoon: boolean
    isRenewalOverdue: boolean
  }
  timelineEvents: Array<{
    id: string
    eventType: string
    title: string
    description: string | null
    dueDate: string | Date | null
    completedAt: string | Date | null
    status: string
    assignedTo?: { fullName: string; email: string } | null
    complianceEvent?: { id: string; title: string; dueDate: string | Date; status: string; category: string } | null
  }>
  documents: Array<{
    id: string
    documentType: string | null
    notes: string | null
    vaultDocument: { id: string; name: string; fileName: string; category: string; status: string }
  }>
  fees: Array<{
    id: string
    amount: string | number | null
    currency: string
    description: string | null
    dueDate: string | Date | null
    paidAt: string | Date | null
    status: string
  }>
}

const statuses = ["DRAFT", "ACTIVE", "PENDING_RENEWAL", "SUBMITTED", "APPROVED", "EXPIRED", "SUSPENDED", "REVOKED", "ARCHIVED"]

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("en-KE", { dateStyle: "medium" })
}

function toDateInput(value: string | Date | null | undefined) {
  if (!value) return ""
  return new Date(value).toISOString().slice(0, 10)
}

function dateToIso(value: string) {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined
}

function amountLabel(amount: string | number | null, currency: string) {
  if (amount === null || amount === undefined) return currency
  return `${currency} ${Number(amount).toLocaleString()}`
}

export default function LicenseDetailPage() {
  const params = useParams()
  const licenseId = (Array.isArray(params.licenseId) ? params.licenseId[0] : params.licenseId) ?? ""
  const utils = trpc.useUtils()
  const [editing, setEditing] = useState(false)
  const [timelineTitle, setTimelineTitle] = useState("")
  const [timelineDueDate, setTimelineDueDate] = useState("")
  const [feeDescription, setFeeDescription] = useState("")
  const [feeAmount, setFeeAmount] = useState("")
  const [feeDueDate, setFeeDueDate] = useState("")
  const [vaultDocumentId, setVaultDocumentId] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [editForm, setEditForm] = useState({
    licenseType: "",
    regulator: "",
    licenseNumber: "",
    status: "ACTIVE",
    issueDate: "",
    expiryDate: "",
    renewalDueDate: "",
    notes: "",
  })

  const { data, isLoading, isError, error } = trpc.license.get.useQuery({ id: licenseId }, { enabled: !!licenseId })
  const license = data as unknown as LicenseDetail | undefined
  const invalidate = () => utils.license.get.invalidate({ id: licenseId })

  const updateLicense = trpc.license.update.useMutation({
    onSuccess: () => {
      setEditing(false)
      void invalidate()
      void utils.license.list.invalidate()
      toast.success("License updated")
    },
    onError: (err) => toast.error("Could not update license", { description: getErrorMessage(err) }),
  })
  const archiveLicense = trpc.license.archive.useMutation({
    onSuccess: () => {
      void utils.license.list.invalidate()
      toast.success("License archived")
    },
    onError: (err) => toast.error("Could not archive license", { description: getErrorMessage(err) }),
  })
  const addTimeline = trpc.license.addTimelineEvent.useMutation({
    onSuccess: () => { setTimelineTitle(""); setTimelineDueDate(""); void invalidate(); toast.success("Timeline event added") },
    onError: (err) => toast.error("Could not add timeline event", { description: getErrorMessage(err) }),
  })
  const completeTimeline = trpc.license.completeTimelineEvent.useMutation({
    onSuccess: () => { void invalidate(); toast.success("Timeline event completed") },
    onError: (err) => toast.error("Could not complete event", { description: getErrorMessage(err) }),
  })
  const addFee = trpc.license.addFee.useMutation({
    onSuccess: () => { setFeeDescription(""); setFeeAmount(""); setFeeDueDate(""); void invalidate(); toast.success("Fee added") },
    onError: (err) => toast.error("Could not add fee", { description: getErrorMessage(err) }),
  })
  const addDocument = trpc.license.addDocument.useMutation({
    onSuccess: () => { setVaultDocumentId(""); setDocumentType(""); void invalidate(); toast.success("Evidence linked") },
    onError: (err) => toast.error("Could not link evidence", { description: getErrorMessage(err) }),
  })

  function startEditing() {
    if (!license) return
    setEditForm({
      licenseType: license.licenseType,
      regulator: license.regulator,
      licenseNumber: license.licenseNumber ?? "",
      status: license.status,
      issueDate: toDateInput(license.issueDate),
      expiryDate: toDateInput(license.expiryDate),
      renewalDueDate: toDateInput(license.renewalDueDate),
      notes: license.notes ?? "",
    })
    setEditing(true)
  }

  function saveLicense() {
    updateLicense.mutate({
      id: licenseId,
      licenseType: editForm.licenseType,
      regulator: editForm.regulator,
      licenseNumber: editForm.licenseNumber || undefined,
      status: editForm.status as never,
      issueDate: dateToIso(editForm.issueDate),
      expiryDate: dateToIso(editForm.expiryDate),
      renewalDueDate: dateToIso(editForm.renewalDueDate),
      notes: editForm.notes || undefined,
    })
  }

  if (isLoading) {
    return <Skeleton className="h-64 rounded-lg" />
  }

  if (isError || !license) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild><Link href="/startup/licenses"><ArrowLeft className="mr-2 h-5 w-5" />Back</Link></Button>
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">{getErrorMessage(error)}</CardContent></Card>
      </div>
    )
  }

  const totalFees = license.fees.reduce((sum, fee) => sum + Number(fee.amount ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/startup/licenses"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{license.licenseType}</h1>
              {license.licenseNumber ? <Badge variant="outline" className="font-mono text-xs">{license.licenseNumber}</Badge> : null}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Landmark className="h-3 w-3" />{license.regulator}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Renewal {formatDate(license.renewalDueDate)}</span>
              <span>Expiry {formatDate(license.expiryDate)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary/10 text-primary">{license.status.replace(/_/g, " ")}</Badge>
          <Button variant="outline" onClick={startEditing}>Edit</Button>
          <Button variant="outline" onClick={() => archiveLicense.mutate({ id: license.id })} disabled={archiveLicense.isPending}>Archive</Button>
        </div>
      </div>

      {editing ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Edit License</CardTitle>
            <CardDescription>Updating renewal or expiry dates updates linked calendar events.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input value={editForm.licenseType} onChange={(e) => setEditForm((prev) => ({ ...prev, licenseType: e.target.value }))} />
            <Input value={editForm.regulator} onChange={(e) => setEditForm((prev) => ({ ...prev, regulator: e.target.value }))} />
            <Input value={editForm.licenseNumber} onChange={(e) => setEditForm((prev) => ({ ...prev, licenseNumber: e.target.value }))} />
            <Select value={editForm.status} onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{item.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={editForm.issueDate} onChange={(e) => setEditForm((prev) => ({ ...prev, issueDate: e.target.value }))} />
            <Input type="date" value={editForm.expiryDate} onChange={(e) => setEditForm((prev) => ({ ...prev, expiryDate: e.target.value }))} />
            <Input type="date" value={editForm.renewalDueDate} onChange={(e) => setEditForm((prev) => ({ ...prev, renewalDueDate: e.target.value }))} />
            <Textarea className="md:col-span-2" value={editForm.notes} onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))} />
            <div className="flex gap-2 md:col-span-2">
              <Button onClick={saveLicense} disabled={updateLicense.isPending}>{updateLicense.isPending ? "Saving..." : "Save"}</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Timeline Events</CardTitle>
              <CardDescription>Renewal preparation, submissions, inspections, evidence tasks, and regulator follow-ups.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_180px_auto]">
                <Input placeholder="Submit renewal package" value={timelineTitle} onChange={(e) => setTimelineTitle(e.target.value)} />
                <Input type="date" value={timelineDueDate} onChange={(e) => setTimelineDueDate(e.target.value)} />
                <Button onClick={() => addTimeline.mutate({ licenseId, eventType: "CUSTOM", title: timelineTitle, dueDate: dateToIso(timelineDueDate), createCalendarEvent: true })} disabled={!timelineTitle || addTimeline.isPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {license.timelineEvents.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No timeline events yet.</p> : license.timelineEvents.map((event) => (
                  <div key={event.id} className="rounded-lg bg-muted/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <Badge variant="outline">{event.status.replace(/_/g, " ")}</Badge>
                          {event.complianceEvent ? <Badge className="bg-primary/10 text-primary">Calendar linked</Badge> : null}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{event.description ?? event.eventType.replace(/_/g, " ")}</p>
                        <p className="mt-2 text-xs text-muted-foreground">Due {formatDate(event.dueDate)}</p>
                      </div>
                      {event.status !== "COMPLETED" ? (
                        <Button size="sm" variant="outline" onClick={() => completeTimeline.mutate({ id: event.id })} disabled={completeTimeline.isPending}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Complete
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Completed {formatDate(event.completedAt)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Evidence Documents</CardTitle>
              <CardDescription>Link existing organization vault documents to this license.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_180px_auto]">
                <Input placeholder="Vault document ID" value={vaultDocumentId} onChange={(e) => setVaultDocumentId(e.target.value)} />
                <Input placeholder="Document type" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
                <Button onClick={() => addDocument.mutate({ licenseId, vaultDocumentId, documentType: documentType || undefined })} disabled={!vaultDocumentId || addDocument.isPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {license.documents.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No evidence documents linked yet.</p> : license.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.vaultDocument.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.documentType ?? doc.vaultDocument.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{doc.vaultDocument.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Deadline State</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Renewal due</span><span>{formatDate(license.renewalDueDate)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Expiry</span><span>{formatDate(license.expiryDate)}</span></div>
              <Separator />
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Days to renewal</span><span>{license.derived?.daysUntilRenewal ?? "-"}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Days to expiry</span><span>{license.derived?.daysUntilExpiry ?? "-"}</span></div>
              {license.derived?.isRenewalOverdue ? <Badge className="bg-destructive/10 text-destructive">Renewal overdue</Badge> : null}
              {license.derived?.isRenewalDueSoon ? <Badge className="bg-warning/10 text-warning">Renewal due soon</Badge> : null}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Owner</span><p className="text-foreground">{license.assignedOwner?.fullName ?? "Unassigned"}</p></div>
              <div><span className="text-muted-foreground">Created by</span><p className="text-foreground">{license.createdBy?.fullName ?? "-"}</p></div>
              <div><span className="text-muted-foreground">Updated by</span><p className="text-foreground">{license.updatedBy?.fullName ?? "-"}</p></div>
              <Separator />
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Created</span><span>{formatDate(license.createdAt)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Updated</span><span>{formatDate(license.updatedAt)}</span></div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Fees</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Input placeholder="Annual renewal fee" value={feeDescription} onChange={(e) => setFeeDescription(e.target.value)} />
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <Input type="number" placeholder="Amount" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} />
                  <Input type="date" value={feeDueDate} onChange={(e) => setFeeDueDate(e.target.value)} />
                  <Button onClick={() => addFee.mutate({ licenseId, description: feeDescription || undefined, amount: feeAmount ? Number(feeAmount) : undefined, dueDate: dateToIso(feeDueDate), status: "PENDING" })} disabled={addFee.isPending}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {license.fees.length === 0 ? <p className="text-sm text-muted-foreground">No fees tracked yet.</p> : license.fees.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{fee.description ?? "License fee"}</p>
                    <p className="text-xs text-muted-foreground">{amountLabel(fee.amount, fee.currency)} - Due {formatDate(fee.dueDate)}</p>
                  </div>
                  <Badge variant="outline">{fee.status}</Badge>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span className="flex items-center gap-2"><Wallet className="h-4 w-4" />Total</span>
                <span>KES {totalFees.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {license.notes ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-wrap text-sm text-muted-foreground">{license.notes}</p></CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
