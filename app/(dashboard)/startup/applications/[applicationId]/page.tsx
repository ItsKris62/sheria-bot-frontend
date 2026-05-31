"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { AlertTriangle, ArrowLeft, Building2, Calendar, CheckCircle2, Clock, FileText, MessageSquare, Plus } from "lucide-react"

type ApplicationDetail = {
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
  decidedAt: Date | string | null
  updatedAt: Date | string
  timelineEvents: Array<{ id: string; title: string; description: string | null; eventDate: Date | string; completed: boolean }>
  documents: Array<{ id: string; name: string; status: string; notes: string | null; uploadedAt: Date | string | null }>
  fees: Array<{ id: string; description: string; amount: number; status: string; paidAt: Date | string | null }>
  regulatorFeedback: Array<{ id: string; fromName: string | null; message: string; actionRequired: boolean; dueDate: Date | string | null; receivedAt: Date | string }>
}

const statusLabel: Record<string, string> = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  AWAITING_FEEDBACK: "Awaiting Feedback",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const applicationId = (Array.isArray(params.applicationId) ? params.applicationId[0] : params.applicationId) ?? ""
  const utils = trpc.useUtils()
  const [timelineTitle, setTimelineTitle] = useState("")
  const [documentName, setDocumentName] = useState("")
  const [feeDescription, setFeeDescription] = useState("")
  const [feeAmount, setFeeAmount] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState("")

  const { data, isLoading, isError, error } = trpc.application.get.useQuery({ id: applicationId }, { enabled: !!applicationId })
  const app = data as ApplicationDetail | undefined
  const invalidate = () => utils.application.get.invalidate({ id: applicationId })

  const addTimeline = trpc.application.addTimelineEvent.useMutation({ onSuccess: () => { setTimelineTitle(""); void invalidate(); toast.success("Timeline updated") } })
  const addDocument = trpc.application.addDocument.useMutation({ onSuccess: () => { setDocumentName(""); void invalidate(); toast.success("Document added") } })
  const addFee = trpc.application.addFee.useMutation({ onSuccess: () => { setFeeDescription(""); setFeeAmount(""); void invalidate(); toast.success("Fee added") } })
  const addFeedback = trpc.application.addRegulatorFeedback.useMutation({ onSuccess: () => { setFeedbackMessage(""); void invalidate(); toast.success("Feedback logged") } })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading application...</p>
  }

  if (isError || !app) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild><Link href="/startup/applications"><ArrowLeft className="h-5 w-5 mr-2" />Back</Link></Button>
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">{getErrorMessage(error)}</CardContent></Card>
      </div>
    )
  }

  const totalFees = app.fees.reduce((sum, fee) => sum + fee.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/startup/applications"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{app.title}</h1>
              {app.referenceNumber ? <Badge variant="outline" className="font-mono text-xs">{app.referenceNumber}</Badge> : null}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{app.regulator}</span>
              <span>{app.licenseType}</span>
              {app.dueDate ? <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {new Date(app.dueDate).toLocaleDateString("en-KE")}</span> : null}
            </div>
          </div>
        </div>
        <Badge className="bg-primary/10 text-primary">{statusLabel[app.status] ?? app.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>Track events, requests, submissions, and decisions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Input placeholder="Add timeline event" value={timelineTitle} onChange={(e) => setTimelineTitle(e.target.value)} />
                <Button onClick={() => addTimeline.mutate({ applicationId: app.id, title: timelineTitle, completed: true })} disabled={!timelineTitle || addTimeline.isPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                {app.timelineEvents.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No timeline events yet.</p> : app.timelineEvents.map((step, index) => (
                  <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {step.completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      {index < app.timelineEvents.length - 1 ? <div className={`mt-2 w-0.5 flex-1 ${step.completed ? "bg-primary" : "bg-border"}`} /> : null}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <span className="text-xs text-muted-foreground">{new Date(step.eventDate).toLocaleDateString("en-KE")}</span>
                      </div>
                      {step.description ? <p className="mt-1 text-sm text-muted-foreground">{step.description}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Track document requirements and review status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Input placeholder="Document name" value={documentName} onChange={(e) => setDocumentName(e.target.value)} />
                <Button onClick={() => addDocument.mutate({ applicationId: app.id, name: documentName, status: "REQUIRED" })} disabled={!documentName || addDocument.isPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {app.documents.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No document requirements tracked yet.</p> : app.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        {doc.notes ? <p className="text-xs text-muted-foreground">{doc.notes}</p> : null}
                      </div>
                    </div>
                    <Badge variant="outline">{doc.status.replace(/_/g, " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Application Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Status</span><Badge>{statusLabel[app.status] ?? app.status}</Badge></div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Progress</span><span>{app.progress}%</span></div>
                <Progress value={app.progress} className="h-2" />
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Updated</span><span>{new Date(app.updatedAt).toLocaleDateString("en-KE")}</span></div>
                {app.nextAction ? <div><span className="text-muted-foreground">Next action</span><p className="mt-1 text-foreground">{app.nextAction}</p></div> : null}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Fees & Payments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Fee" value={feeDescription} onChange={(e) => setFeeDescription(e.target.value)} />
                <Input className="w-28" type="number" placeholder="KES" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} />
                <Button onClick={() => addFee.mutate({ applicationId: app.id, description: feeDescription, amount: Number(feeAmount), status: "PENDING" })} disabled={!feeDescription || !feeAmount || addFee.isPending}><Plus className="h-4 w-4" /></Button>
              </div>
              {app.fees.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-foreground">{fee.description}</p><p className="text-xs text-muted-foreground">KES {fee.amount.toLocaleString()}</p></div>
                  <Badge variant="outline">{fee.status}</Badge>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between font-medium"><span>Total</span><span>KES {totalFees.toLocaleString()}</span></div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Regulator Feedback</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea placeholder="Log regulator feedback or action required" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} />
              <Button className="w-full" onClick={() => addFeedback.mutate({ applicationId: app.id, message: feedbackMessage, actionRequired: true })} disabled={!feedbackMessage || addFeedback.isPending}>
                <MessageSquare className="h-4 w-4 mr-2" />Log Feedback
              </Button>
              {app.regulatorFeedback.length === 0 ? <p className="text-sm text-muted-foreground">No regulator feedback logged yet.</p> : app.regulatorFeedback.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/50 p-3">
                  <p className="text-sm text-foreground">{item.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.fromName ?? "Regulator"} - {new Date(item.receivedAt).toLocaleDateString("en-KE")}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {app.regulatorFeedback.some((item) => item.actionRequired) ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
                  <div><p className="text-sm font-medium text-foreground">Action Required</p><p className="mt-1 text-xs text-muted-foreground">Review the latest regulator feedback and update your next action.</p></div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
