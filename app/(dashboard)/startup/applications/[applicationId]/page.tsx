"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  Upload,
  Download,
  MessageSquare,
  Calendar,
  Building2,
  AlertTriangle,
} from "lucide-react"

const mockApplication = {
  id: "APP-2024-001",
  title: "Payment Service Provider License",
  regulator: "Central Bank of Kenya",
  status: "in-progress",
  progress: 65,
  submittedDate: "2024-01-10",
  lastUpdate: "2024-01-25",
  estimatedCompletion: "2024-03-15",
  timeline: [
    { date: "2024-01-10", title: "Application Submitted", description: "Initial application submitted to CBK", completed: true },
    { date: "2024-01-15", title: "Document Review", description: "CBK reviewing submitted documents", completed: true },
    { date: "2024-01-20", title: "Additional Documents Requested", description: "CBK requested audited financials", completed: true },
    { date: "2024-02-15", title: "Submit Audited Financials", description: "Upload audited financial statements", completed: false },
    { date: "2024-02-28", title: "Background Checks", description: "Director background verification", completed: false },
    { date: "2024-03-15", title: "Final Decision", description: "CBK final approval/rejection", completed: false },
  ],
  documents: [
    { name: "Certificate of Incorporation", status: "approved", uploadedAt: "2024-01-10" },
    { name: "Business Plan", status: "approved", uploadedAt: "2024-01-10" },
    { name: "Director ID Documents", status: "approved", uploadedAt: "2024-01-10" },
    { name: "Tax Compliance Certificate", status: "pending", uploadedAt: "2024-01-20" },
    { name: "Audited Financials", status: "required", uploadedAt: null },
  ],
  fees: [
    { description: "Application Fee", amount: 50000, status: "paid" },
    { description: "Processing Fee", amount: 100000, status: "paid" },
    { description: "License Fee", amount: 250000, status: "pending" },
  ],
}

export default function ApplicationDetailPage() {
  const params = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/startup/applications">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{mockApplication.title}</h1>
              <Badge variant="outline" className="font-mono text-xs">
                {params.applicationId}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {mockApplication.regulator}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Submitted: {new Date(mockApplication.submittedDate).toLocaleDateString("en-KE")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Regulator
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>Track the progress of your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {mockApplication.timeline.map((step, index) => (
                  <div key={index} className="flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      {index < mockApplication.timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${
                            step.completed ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(step.date).toLocaleDateString("en-KE")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>Upload and track document status</CardDescription>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockApplication.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{doc.name}</p>
                        {doc.uploadedAt && (
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString("en-KE")}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        doc.status === "approved"
                          ? "default"
                          : doc.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        doc.status === "approved"
                          ? "bg-primary/10 text-primary"
                          : doc.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {doc.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {doc.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {doc.status === "required" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="bg-primary/10 text-primary">
                  <Clock className="h-3 w-3 mr-1" />
                  In Progress
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{mockApplication.progress}%</span>
                </div>
                <Progress value={mockApplication.progress} className="h-2" />
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="text-foreground">
                    {new Date(mockApplication.submittedDate).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Update</span>
                  <span className="text-foreground">
                    {new Date(mockApplication.lastUpdate).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Est. Completion</span>
                  <span className="text-foreground">
                    {new Date(mockApplication.estimatedCompletion).toLocaleDateString("en-KE")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base">Fees & Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockApplication.fees.map((fee, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{fee.description}</p>
                      <p className="text-xs text-muted-foreground">
                        KES {fee.amount.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={fee.status === "paid" ? "default" : "secondary"}
                      className={
                        fee.status === "paid"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {fee.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">
                    KES {mockApplication.fees.reduce((acc, f) => acc + f.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-foreground">Action Required</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please upload your audited financial statements by February 15, 2024 to continue
                    the application process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
