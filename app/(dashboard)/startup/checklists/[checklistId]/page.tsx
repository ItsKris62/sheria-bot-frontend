"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  Share2,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ExternalLink,
  Upload,
} from "lucide-react"

const mockChecklist = {
  id: "CL-001",
  title: "PSP License Application Checklist",
  description: "Complete checklist for Payment Service Provider license application to CBK",
  category: "Licensing",
  progress: 45,
  dueDate: "2024-03-15",
  totalItems: 20,
  completedItems: 9,
  sections: [
    {
      title: "Company Documentation",
      items: [
        { id: 1, title: "Certificate of Incorporation", completed: true, required: true },
        { id: 2, title: "Memorandum and Articles of Association", completed: true, required: true },
        { id: 3, title: "Tax Compliance Certificate", completed: true, required: true },
        { id: 4, title: "Business Permit", completed: false, required: true },
        { id: 5, title: "Company PIN Certificate", completed: true, required: true },
      ],
    },
    {
      title: "Director & Shareholder Documents",
      items: [
        { id: 6, title: "Directors' ID copies (National ID or Passport)", completed: true, required: true },
        { id: 7, title: "Directors' CVs and academic certificates", completed: true, required: true },
        { id: 8, title: "Certificate of Good Conduct for each director", completed: false, required: true },
        { id: 9, title: "Shareholder register (Form CR12)", completed: true, required: true },
        { id: 10, title: "Beneficial ownership declaration", completed: false, required: true },
      ],
    },
    {
      title: "Financial Requirements",
      items: [
        { id: 11, title: "Audited financial statements (last 3 years)", completed: true, required: true },
        { id: 12, title: "Proof of minimum capital (KES 50M)", completed: false, required: true },
        { id: 13, title: "Bank reference letters", completed: false, required: true },
        { id: 14, title: "5-year business plan with financial projections", completed: true, required: true },
      ],
    },
    {
      title: "Technical & Operational",
      items: [
        { id: 15, title: "System security documentation", completed: false, required: true },
        { id: 16, title: "Business continuity plan", completed: false, required: true },
        { id: 17, title: "AML/CFT policy and procedures", completed: false, required: true },
        { id: 18, title: "Customer complaint handling procedures", completed: false, required: true },
        { id: 19, title: "Data protection policy", completed: false, required: true },
        { id: 20, title: "Cyber security framework", completed: false, required: false },
      ],
    },
  ],
}

export default function ChecklistDetailPage() {
  const params = useParams()
  const [checklist, setChecklist] = useState(mockChecklist)

  const toggleItem = (sectionIndex: number, itemId: number) => {
    setChecklist((prev) => {
      const newSections = [...prev.sections]
      const section = newSections[sectionIndex]
      const itemIndex = section.items.findIndex((item) => item.id === itemId)
      if (itemIndex !== -1) {
        section.items[itemIndex].completed = !section.items[itemIndex].completed
      }

      const totalCompleted = newSections.reduce(
        (acc, s) => acc + s.items.filter((item) => item.completed).length,
        0
      )
      const totalItems = newSections.reduce((acc, s) => acc + s.items.length, 0)

      return {
        ...prev,
        sections: newSections,
        completedItems: totalCompleted,
        progress: Math.round((totalCompleted / totalItems) * 100),
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/startup/checklists">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{checklist.title}</h1>
              <Badge variant="outline" className="font-mono text-xs">
                {params.checklistId}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">{checklist.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {checklist.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">{section.title}</CardTitle>
                <CardDescription>
                  {section.items.filter((i) => i.completed).length} of {section.items.length} completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      item.completed ? "bg-primary/10" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(sectionIndex, item.id)}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            item.completed ? "text-muted-foreground line-through" : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.required && !item.completed && (
                          <span className="text-xs text-destructive">Required</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium text-foreground">{checklist.progress}%</span>
                </div>
                <Progress value={checklist.progress} className="h-2" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-2xl font-bold">{checklist.completedItems}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Circle className="h-4 w-4" />
                    <span className="text-2xl font-bold">{checklist.totalItems - checklist.completedItems}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Remaining</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-medium text-foreground">
                    {new Date(checklist.dueDate).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="secondary">{checklist.category}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-foreground">Important Note</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ensure all required documents are certified copies. Original documents may be required during the
                    CBK review process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground">Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                <Link href="#">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                  CBK PSP Guidelines 2023
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                <Link href="#">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                  Application Form Template
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                <Link href="#">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                  Fee Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
