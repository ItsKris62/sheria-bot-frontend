"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  MessageSquare,
  BookOpen,
  Scale,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

const mockQuery = {
  id: "Q-2024-001",
  question: "What are the KYC requirements for onboarding corporate customers in Kenya's mobile money sector?",
  status: "answered",
  createdAt: "2024-01-15T10:30:00Z",
  answeredAt: "2024-01-15T10:32:00Z",
  category: "KYC/AML",
  confidence: 94,
  answer: `Based on the Central Bank of Kenya's Mobile Money Regulations and the Proceeds of Crime and Anti-Money Laundering Act (POCAMLA), corporate customer onboarding requires the following KYC documentation:

**Required Documents:**
1. Certificate of Incorporation or Registration
2. Memorandum and Articles of Association
3. Board Resolution authorizing account opening
4. List of Directors with their identification documents
5. List of Shareholders holding more than 10% shares
6. Beneficial ownership declaration
7. Tax Compliance Certificate (KRA PIN)
8. Business Permit

**Enhanced Due Diligence (EDD):**
For high-risk corporate customers, additional requirements include:
- Source of funds documentation
- Nature of business verification
- Site visits for verification
- Senior management approval

**Ongoing Monitoring:**
- Transaction monitoring for unusual patterns
- Annual KYC review and update
- Sanctions screening against OFAC, UN, and local lists`,
  sources: [
    { title: "CBK Mobile Money Regulations 2023", section: "Part IV - Customer Due Diligence", url: "#" },
    { title: "POCAMLA Guidelines", section: "Section 45 - Corporate Customers", url: "#" },
    { title: "FRC Advisory on Beneficial Ownership", section: "Circular No. 5/2023", url: "#" },
  ],
  relatedTopics: ["Customer Due Diligence", "Beneficial Ownership", "Transaction Monitoring", "Sanctions Screening"],
}

export default function QueryDetailPage() {
  const params = useParams()
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null)
  const [followUpQuestion, setFollowUpQuestion] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(mockQuery.answer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/startup/compliance-query">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Query Details</h1>
            <Badge variant="outline" className="font-mono text-xs">
              {params.queryId}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            <Clock className="inline h-3 w-3 mr-1" />
            Asked on {new Date(mockQuery.createdAt).toLocaleDateString("en-KE", { dateStyle: "full" })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-foreground">Your Question</CardTitle>
                    <CardDescription className="mt-2 text-foreground/80 text-base">
                      {mockQuery.question}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">{mockQuery.category}</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-foreground">AI Response</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {mockQuery.confidence}% confidence
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{mockQuery.answer}</div>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Was this response helpful?</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={feedback === "helpful" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedback("helpful")}
                    className={feedback === "helpful" ? "bg-primary text-primary-foreground" : ""}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful
                  </Button>
                  <Button
                    variant={feedback === "not-helpful" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedback("not-helpful")}
                    className={feedback === "not-helpful" ? "bg-destructive text-destructive-foreground" : ""}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">Follow-up Question</CardTitle>
              <CardDescription>Ask a related question for more details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., What are the penalties for non-compliance with KYC requirements?"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                className="min-h-[100px] bg-muted/50"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Sources & References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockQuery.sources.map((source, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="font-medium text-sm text-foreground">{source.title}</p>
                  <p className="text-xs text-muted-foreground">{source.section}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs">
                    View Document <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Related Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockQuery.relatedTopics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-foreground">Legal Disclaimer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This AI-generated response is for informational purposes only and should not be considered legal
                    advice. Always consult with qualified legal professionals for specific compliance matters.
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
