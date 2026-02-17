"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Save,
  Download,
  Edit,
  Eye,
  Search,
  ChevronRight,
  FileText,
  Clock,
  BookOpen,
} from "lucide-react"

const documentData = {
  id: "doc-002",
  title: "Digital Credit Providers Regulations, 2024",
  category: "Regulations",
  status: "active",
  effectiveDate: "2024-01-15",
  lastUpdated: "2024-01-10",
  sections: [
    {
      id: "s1",
      number: "Part I",
      title: "Preliminary",
      subsections: [
        { id: "s1.1", number: "1", title: "Citation", content: "These Regulations may be cited as the Central Bank of Kenya (Digital Credit Providers) Regulations, 2024." },
        { id: "s1.2", number: "2", title: "Interpretation", content: "In these Regulations, unless the context otherwise requires—\n\n\"digital credit\" means credit that is applied for, approved, disbursed and repaid using electronic means;\n\n\"digital credit provider\" means a person licensed under these Regulations to carry on digital credit business;\n\n\"digital platform\" means an electronic system used to offer digital credit services;" },
        { id: "s1.3", number: "3", title: "Application", content: "These Regulations apply to all persons carrying on digital credit business in Kenya." },
      ],
    },
    {
      id: "s2",
      number: "Part II",
      title: "Licensing",
      subsections: [
        { id: "s2.1", number: "4", title: "Requirement for license", content: "No person shall carry on digital credit business unless they hold a valid license issued under these Regulations." },
        { id: "s2.2", number: "5", title: "Application for license", content: "An application for a license shall be made to the Central Bank in the prescribed form and shall be accompanied by—\n\n(a) the prescribed fee;\n(b) a certified copy of the certificate of incorporation;\n(c) the proposed memorandum and articles of association;\n(d) a business plan;\n(e) proof of minimum capital requirements;" },
        { id: "s2.3", number: "6", title: "Minimum capital", content: "A digital credit provider shall maintain minimum paid-up capital of not less than ten million Kenya shillings." },
      ],
    },
    {
      id: "s3",
      number: "Part III",
      title: "Consumer Protection",
      subsections: [
        { id: "s3.1", number: "15", title: "Disclosure of terms", content: "A digital credit provider shall, before disbursing a loan, disclose to the borrower in a clear and prominent manner—\n\n(a) the principal amount;\n(b) the interest rate;\n(c) all fees and charges;\n(d) the total cost of credit;\n(e) the repayment schedule;" },
        { id: "s3.2", number: "16", title: "Cooling-off period", content: "A borrower may cancel a digital credit agreement within forty-eight hours of disbursement without penalty." },
        { id: "s3.3", number: "17", title: "Prohibited practices", content: "A digital credit provider shall not—\n\n(a) use abusive or threatening language in debt collection;\n(b) contact third parties regarding a borrower's debt;\n(c) publicly disclose a borrower's debt status;\n(d) access a borrower's personal data beyond what is necessary for credit assessment;" },
      ],
    },
  ],
}

export default function DocumentEditorPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSection, setSelectedSection] = useState(documentData.sections[0].subsections[0])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link 
            href="/regulator/legal-corpus" 
            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Legal Corpus
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{documentData.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Badge variant="outline">{documentData.category}</Badge>
            <Badge variant="outline" className="border-secondary/50 text-secondary">
              Active
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Effective: {new Date(documentData.effectiveDate).toLocaleDateString("en-KE")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "bg-primary text-primary-foreground" : "bg-transparent"}
          >
            {isEditing ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
          {isEditing && (
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar - Table of Contents */}
        <Card className="border-border/50 lg:sticky lg:top-20 lg:self-start">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-7 text-sm"
              />
            </div>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {documentData.sections.map((part) => (
                  <div key={part.id}>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                      {part.number}: {part.title}
                    </p>
                    <div className="space-y-1 pl-2">
                      {part.subsections
                        .filter((s) => 
                          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.content.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((subsection) => (
                          <button
                            key={subsection.id}
                            onClick={() => setSelectedSection(subsection)}
                            className={`flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm transition-colors hover:bg-muted ${
                              selectedSection.id === subsection.id 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground"
                            }`}
                          >
                            <ChevronRight className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {subsection.number}. {subsection.title}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Section {selectedSection.number}: {selectedSection.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Section Title</label>
                  <Input defaultValue={selectedSection.title} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Content</label>
                  <Textarea
                    defaultValue={selectedSection.content}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button className="bg-primary text-primary-foreground">
                    Save Section
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {selectedSection.content}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
