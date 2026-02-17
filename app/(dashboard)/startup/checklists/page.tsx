"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  ClipboardCheck,
  Plus,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react"

const existingChecklists = [
  {
    id: 1,
    title: "CBK Digital Lender Registration",
    category: "Licensing",
    progress: 75,
    total: 12,
    completed: 9,
    lastUpdated: "Feb 3, 2026",
    status: "in_progress",
  },
  {
    id: 2,
    title: "Data Protection Act Compliance",
    category: "Data Protection",
    progress: 100,
    total: 8,
    completed: 8,
    lastUpdated: "Jan 28, 2026",
    status: "completed",
  },
  {
    id: 3,
    title: "AML/KYC Requirements",
    category: "AML/KYC",
    progress: 45,
    total: 15,
    completed: 7,
    lastUpdated: "Jan 25, 2026",
    status: "in_progress",
  },
]

const checklistTemplates = [
  { value: "digital-lending", label: "Digital Credit Provider" },
  { value: "mobile-money", label: "Mobile Money Operator" },
  { value: "payment-service", label: "Payment Service Provider" },
  { value: "remittance", label: "Remittance Service" },
  { value: "microfinance", label: "Microfinance Institution" },
]

const sampleChecklistItems = [
  {
    id: 1,
    title: "Register with CBK as Digital Credit Provider",
    description: "Submit application form with required documents to Central Bank of Kenya",
    completed: true,
    category: "Licensing",
  },
  {
    id: 2,
    title: "Implement Customer Identification Program",
    description: "Establish KYC procedures for customer onboarding and verification",
    completed: true,
    category: "KYC",
  },
  {
    id: 3,
    title: "Deploy Credit Information Sharing",
    description: "Integrate with licensed Credit Reference Bureaus (CRBs)",
    completed: true,
    category: "Reporting",
  },
  {
    id: 4,
    title: "Establish Complaint Resolution Mechanism",
    description: "Set up customer complaint handling process with defined SLAs",
    completed: false,
    category: "Consumer Protection",
  },
  {
    id: 5,
    title: "Implement Data Protection Measures",
    description: "Ensure compliance with Data Protection Act 2019 requirements",
    completed: false,
    category: "Data Protection",
  },
  {
    id: 6,
    title: "Submit Annual Returns",
    description: "File annual compliance returns with CBK by January 31st",
    completed: false,
    category: "Reporting",
  },
]

export default function ChecklistsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showNewChecklist, setShowNewChecklist] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
    sampleChecklistItems.reduce((acc, item) => ({ ...acc, [item.id]: item.completed }), {})
  )

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setShowNewChecklist(false)
  }

  const toggleItem = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = Object.values(checkedItems).filter(Boolean).length
  const totalCount = sampleChecklistItems.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Checklists</h1>
          <p className="text-muted-foreground">
            Track your compliance progress with AI-generated checklists
          </p>
        </div>
        <Dialog open={showNewChecklist} onOpenChange={setShowNewChecklist}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Generate Checklist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Checklist</DialogTitle>
              <DialogDescription>
                Select your business type to generate a customized compliance checklist
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {checklistTemplates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    AI will analyze your business type and generate a comprehensive compliance checklist
                    based on current Kenyan regulations.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!selectedTemplate || isGenerating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Checklist
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Checklists Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {existingChecklists.map((checklist) => (
          <Card key={checklist.id} className="border-border/50 bg-card transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-xs">
                  {checklist.category}
                </Badge>
                {checklist.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                ) : (
                  <Clock className="h-5 w-5 text-warning" />
                )}
              </div>
              <CardTitle className="mt-2 text-foreground">{checklist.title}</CardTitle>
              <CardDescription>Last updated {checklist.lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {checklist.completed} of {checklist.total} tasks
                  </span>
                  <span className="font-medium text-foreground">{checklist.progress}%</span>
                </div>
                <Progress value={checklist.progress} className="h-2" />
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/startup/checklists/${checklist.id}`}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Checklist Detail */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">Active</Badge>
            <CardTitle className="text-foreground">CBK Digital Lender Registration</CardTitle>
            <CardDescription>
              Complete checklist for registering as a Digital Credit Provider with CBK
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Summary */}
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-primary">{progressPercent}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{completedCount} of {totalCount} completed</p>
                <p className="text-xs text-muted-foreground">Estimated: 2 days remaining</p>
              </div>
            </div>
            <Progress value={progressPercent} className="mt-3 h-2" />
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {sampleChecklistItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                  checkedItems[item.id]
                    ? "border-secondary/50 bg-secondary/5"
                    : "border-border/50 hover:bg-muted/50"
                }`}
              >
                <Checkbox
                  id={`item-${item.id}`}
                  checked={checkedItems[item.id]}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`item-${item.id}`}
                    className={`font-medium cursor-pointer ${
                      checkedItems[item.id] ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </label>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {item.category}
                  </Badge>
                </div>
                {checkedItems[item.id] && (
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
