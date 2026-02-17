"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  Copy,
  Share2,
  FileText,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Printer,
} from "lucide-react"

const policyData = {
  id: "pol-001",
  title: "Digital Credit Provider Consumer Protection Policy",
  status: "completed",
  createdAt: "2025-01-15T10:30:00Z",
  query: "Generate a consumer protection policy for digital credit providers that complies with CBK regulations",
  sections: [
    {
      title: "1. Introduction and Scope",
      content: `This Consumer Protection Policy ("Policy") is established in accordance with the Central Bank of Kenya (Digital Credit Providers) Regulations, 2024 and the Consumer Protection Act, 2012. This Policy applies to all digital lending operations conducted by [Company Name] ("the Company") within the Republic of Kenya.

The Policy aims to ensure fair, transparent, and responsible lending practices that protect consumers while maintaining the financial sustainability of the Company's operations.`,
    },
    {
      title: "2. Pricing and Fee Disclosure",
      content: `2.1 All fees, charges, and interest rates must be disclosed clearly and prominently before loan disbursement.

2.2 The Company shall provide a standardized loan schedule showing:
- Principal amount
- Total interest charges
- All applicable fees (facility fee, late payment fees, etc.)
- Total cost of credit
- Annual Percentage Rate (APR)

2.3 No hidden charges or fees shall be applied that were not disclosed at the time of loan application.`,
    },
    {
      title: "3. Right to Information",
      content: `3.1 Borrowers have the right to receive complete information about loan terms in a language they understand.

3.2 The Company shall provide loan agreements that are written in plain language, avoiding technical jargon where possible.

3.3 A copy of the signed loan agreement shall be provided to the borrower immediately after execution.`,
    },
    {
      title: "4. Cooling-Off Period",
      content: `4.1 In accordance with CBK Digital Credit Providers Regulations, borrowers shall have a 48-hour cooling-off period during which they may cancel the loan without penalty.

4.2 The Company shall clearly communicate this right to borrowers at the time of loan disbursement.

4.3 Cancellation requests shall be processed within 24 hours of receipt.`,
    },
    {
      title: "5. Debt Collection Practices",
      content: `5.1 The Company shall only use ethical and lawful debt collection practices.

5.2 Prohibited practices include:
- Contacting borrowers before 7:00 AM or after 9:00 PM
- Harassment, threats, or use of abusive language
- Contact with employers, family members, or third parties (except guarantors)
- Public shaming or disclosure of debt status
- Misrepresentation of legal consequences

5.3 All debt collection communications shall be documented and retained for audit purposes.`,
    },
  ],
  citations: [
    {
      law: "CBK Digital Credit Providers Regulations, 2024",
      section: "Part III, Section 15",
      text: "Disclosure of terms and conditions",
    },
    {
      law: "Consumer Protection Act, 2012",
      section: "Section 4",
      text: "Consumer rights",
    },
    {
      law: "Data Protection Act, 2019",
      section: "Section 25",
      text: "Rights of data subjects",
    },
    {
      law: "Central Bank of Kenya Act",
      section: "Section 33",
      text: "Regulation of financial institutions",
    },
  ],
}

export default function PolicyViewerPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const fullText = policyData.sections.map((s) => `${s.title}\n\n${s.content}`).join("\n\n")
    await navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link 
            href="/regulator/policy-generator/history" 
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{policyData.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="border-secondary/50 text-secondary">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completed
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(policyData.createdAt).toLocaleDateString("en-KE", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="bg-transparent">
            {copied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Original Query */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Original Query:</span> {policyData.query}
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Policy Content */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Policy Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="space-y-6">
                {policyData.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="mb-3 text-lg font-semibold text-foreground">{section.title}</h3>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {section.content}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="markdown">
                <pre className="overflow-auto rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                  {policyData.sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n")}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Citations Sidebar */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Legal Citations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {policyData.citations.map((citation, index) => (
                <div key={index} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-sm font-medium text-foreground">{citation.law}</p>
                  <p className="mt-1 text-xs text-primary">{citation.section}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{citation.text}</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">
                    View Full Text
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <h4 className="mb-2 text-sm font-medium text-foreground">Need to modify?</h4>
              <p className="mb-3 text-xs text-muted-foreground">
                You can generate a new version with different parameters.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href="/regulator/policy-generator">
                  Create New Version
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
