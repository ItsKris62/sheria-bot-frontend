"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sparkles,
  Send,
  FileText,
  Clock,
  Loader2,
  Copy,
  Download,
  Share2,
  RefreshCw,
  ChevronRight,
  BookOpen,
  Scale,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

const regulatoryAreas = [
  { value: "digital-lending", label: "Digital Lending" },
  { value: "mobile-money", label: "Mobile Money" },
  { value: "payments", label: "Payment Systems" },
  { value: "aml-kyc", label: "AML/KYC" },
  { value: "data-protection", label: "Data Protection" },
  { value: "consumer-protection", label: "Consumer Protection" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cryptocurrency", label: "Cryptocurrency/Virtual Assets" },
]

const recentQueries = [
  {
    id: 1,
    title: "Mobile Money Interoperability Guidelines",
    area: "Mobile Money",
    date: "Feb 3, 2026",
    status: "completed",
  },
  {
    id: 2,
    title: "Digital Credit Provider Licensing",
    area: "Digital Lending",
    date: "Feb 1, 2026",
    status: "completed",
  },
  {
    id: 3,
    title: "Crypto Asset Service Provider Framework",
    area: "Cryptocurrency",
    date: "Jan 28, 2026",
    status: "completed",
  },
]

const sampleCitations = [
  {
    act: "Central Bank of Kenya Act",
    section: "Section 4A(1)",
    text: "The Bank shall formulate and implement such policies as best promote the establishment, regulation and supervision of efficient and effective payment, clearing and settlement systems.",
    confidence: 98,
  },
  {
    act: "National Payment System Act, 2011",
    section: "Section 12(1)",
    text: "No person shall operate a payment system without a valid license issued by the Central Bank under this Act.",
    confidence: 95,
  },
  {
    act: "Data Protection Act, 2019",
    section: "Section 25(1)",
    text: "A data controller or data processor shall ensure that personal data is processed in accordance with the right to privacy of the data subject.",
    confidence: 92,
  },
]

export default function PolicyGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [query, setQuery] = useState("")
  const [area, setArea] = useState("")
  const [scenario, setScenario] = useState("")

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setShowResult(true)
  }

  const resetForm = () => {
    setShowResult(false)
    setQuery("")
    setArea("")
    setScenario("")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Policy Generator</h1>
          <p className="text-muted-foreground">
            Generate comprehensive regulatory policies using AI analysis of Kenya&apos;s legal corpus
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/regulator/policy-generator/history">
              <Clock className="mr-2 h-4 w-4" />
              History
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Query Input Panel */}
        <div className="lg:col-span-2">
          {!showResult ? (
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Policy Query
                </CardTitle>
                <CardDescription>
                  Describe the regulatory policy you need to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="query" className="text-foreground">Policy Question or Topic</Label>
                  <Textarea
                    id="query"
                    placeholder="E.g., What regulations should govern mobile money interoperability between different service providers in Kenya?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-24 bg-background"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-foreground">Regulatory Area</Label>
                    <Select value={area} onValueChange={setArea}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {regulatoryAreas.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="text-foreground">Priority Level</Label>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High - Urgent</SelectItem>
                        <SelectItem value="medium">Medium - Standard</SelectItem>
                        <SelectItem value="low">Low - Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scenario" className="text-foreground">Scenario Description (Optional)</Label>
                  <Textarea
                    id="scenario"
                    placeholder="Provide additional context about the specific scenario or use case..."
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="min-h-20 bg-background"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-4">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    AI will analyze 50+ Kenyan laws including CBK Act, Data Protection Act, and National Payment System Act
                  </p>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!query || isGenerating}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Policy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Policy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Generated Policy Result */
            <Card className="border-border/50 bg-card">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <Badge className="mb-2 bg-secondary text-secondary-foreground">AI Generated</Badge>
                  <CardTitle className="text-foreground">Mobile Money Interoperability Guidelines</CardTitle>
                  <CardDescription>Generated on February 5, 2026</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Copy">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="policy" className="w-full">
                  <TabsList className="w-full justify-start bg-muted/50">
                    <TabsTrigger value="policy">Policy Document</TabsTrigger>
                    <TabsTrigger value="summary">Executive Summary</TabsTrigger>
                    <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
                  </TabsList>

                  <TabsContent value="policy" className="mt-6">
                    <ScrollArea className="h-[500px] rounded-lg border border-border/50 bg-background p-6">
                      <div className="prose prose-invert max-w-none">
                        <h2 className="text-xl font-bold text-foreground">1. Introduction and Purpose</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          These guidelines establish the regulatory framework for mobile money interoperability 
                          in Kenya, ensuring seamless transactions between different mobile money service providers 
                          while maintaining consumer protection and financial system stability.
                        </p>

                        <h2 className="mt-6 text-xl font-bold text-foreground">2. Scope and Applicability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          These guidelines apply to all licensed mobile money service providers operating in Kenya, 
                          including but not limited to telecommunications companies, banks, and other financial 
                          institutions offering mobile money services.
                        </p>

                        <h2 className="mt-6 text-xl font-bold text-foreground">3. Key Requirements</h2>
                        <h3 className="mt-4 text-lg font-semibold text-foreground">3.1 Technical Standards</h3>
                        <ul className="list-disc pl-6 text-muted-foreground">
                          <li>All providers must implement standardized API protocols for interoperability</li>
                          <li>Real-time transaction processing with maximum latency of 3 seconds</li>
                          <li>End-to-end encryption using industry-standard protocols</li>
                          <li>Compliance with ISO 20022 messaging standards</li>
                        </ul>

                        <h3 className="mt-4 text-lg font-semibold text-foreground">3.2 Consumer Protection</h3>
                        <ul className="list-disc pl-6 text-muted-foreground">
                          <li>Clear disclosure of all fees and charges before transaction completion</li>
                          <li>Dispute resolution mechanism within 48 hours</li>
                          <li>Mandatory SMS/notification confirmation for all transactions</li>
                          <li>Protection of consumer data per Data Protection Act, 2019</li>
                        </ul>

                        <h2 className="mt-6 text-xl font-bold text-foreground">4. Implementation Timeline</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          Mobile money service providers shall achieve full interoperability compliance within 
                          12 months from the effective date of these guidelines, with quarterly progress 
                          reports submitted to the Central Bank of Kenya.
                        </p>

                        <h2 className="mt-6 text-xl font-bold text-foreground">5. Penalties and Enforcement</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          Non-compliance with these guidelines may result in penalties as prescribed under 
                          Section 57 of the National Payment System Act, 2011, including fines up to 
                          KES 10,000,000 and potential license revocation.
                        </p>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="summary" className="mt-6">
                    <div className="rounded-lg border border-border/50 bg-background p-6">
                      <h3 className="text-lg font-semibold text-foreground">Executive Summary</h3>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        This policy establishes a comprehensive framework for mobile money interoperability 
                        in Kenya. Key provisions include mandatory technical standards for API integration, 
                        consumer protection measures, and a 12-month implementation timeline. The framework 
                        aligns with existing CBK regulations and international best practices.
                      </p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-2xl font-bold text-primary">5</p>
                          <p className="text-sm text-muted-foreground">Key Sections</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-2xl font-bold text-secondary">12</p>
                          <p className="text-sm text-muted-foreground">Months to Comply</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-2xl font-bold text-accent">3</p>
                          <p className="text-sm text-muted-foreground">Legal Citations</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="checklist" className="mt-6">
                    <div className="rounded-lg border border-border/50 bg-background p-6">
                      <h3 className="text-lg font-semibold text-foreground">Compliance Checklist</h3>
                      <div className="mt-4 space-y-3">
                        {[
                          "Implement standardized API protocols",
                          "Ensure real-time transaction processing",
                          "Deploy end-to-end encryption",
                          "Achieve ISO 20022 compliance",
                          "Set up fee disclosure mechanisms",
                          "Establish dispute resolution process",
                          "Implement notification system",
                          "Submit quarterly progress reports",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex items-center gap-2">
                  <Button variant="outline" onClick={resetForm} className="bg-transparent">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Query
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Download className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Citations Panel */}
          {showResult && (
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Scale className="h-5 w-5 text-primary" />
                  Legal Citations
                </CardTitle>
                <CardDescription>
                  Sources referenced in this policy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleCitations.map((citation, index) => (
                    <div key={index} className="rounded-lg border border-border/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground text-sm">{citation.act}</p>
                        <Badge variant="outline" className="text-xs">
                          {citation.confidence}% match
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-primary">{citation.section}</p>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{citation.text}</p>
                      <Button variant="ghost" size="sm" className="mt-2 h-auto p-0 text-xs text-primary">
                        View full text
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Queries */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Queries</CardTitle>
              <CardDescription>Your recent policy generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentQueries.map((item) => (
                  <Link
                    key={item.id}
                    href={`/regulator/policy-generator/${item.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.area} • {item.date}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
