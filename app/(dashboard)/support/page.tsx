"use client"

import React from "react"

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  Video,
  Send,
  Loader2,
  Search,
  HelpCircle,
  FileText,
  CheckCircle2,
} from "lucide-react"

const faqs = [
  {
    question: "How accurate are the AI-generated policies?",
    answer: "Our AI achieves 98% citation accuracy by cross-referencing against Kenya's complete legal corpus. All generated content includes legal citations for verification, and we recommend human review before implementation.",
  },
  {
    question: "What legal documents are included in the corpus?",
    answer: "Our corpus includes 50+ Kenyan laws and regulations including the CBK Act, Data Protection Act 2019, National Payment System Act, Proceeds of Crime and Anti-Money Laundering Act, and all CBK Prudential Guidelines.",
  },
  {
    question: "How do I upgrade my subscription?",
    answer: "You can upgrade your subscription from the Billing section in Settings. Enterprise customers should contact our sales team for custom pricing and features.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we implement end-to-end encryption, store all data in Kenya-based servers, and are SOC 2 compliant. Your compliance queries and generated policies are confidential and never shared.",
  },
  {
    question: "Can I export generated policies?",
    answer: "Yes, all generated policies can be exported in PDF, DOCX, or Markdown formats. You can also share policies with team members directly through the platform.",
  },
]

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using SheriaBot",
    icon: BookOpen,
    href: "/docs/getting-started",
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step tutorials",
    icon: Video,
    href: "/docs/tutorials",
  },
  {
    title: "API Documentation",
    description: "Integrate SheriaBot into your systems",
    icon: FileText,
    href: "/docs/api",
  },
]

const existingTickets = [
  {
    id: "TKT-2024-001",
    subject: "Question about CBK reporting requirements",
    status: "resolved",
    date: "Jan 28, 2026",
  },
  {
    id: "TKT-2024-002",
    subject: "API integration assistance needed",
    status: "open",
    date: "Feb 1, 2026",
  },
]

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketData, setTicketData] = useState({
    subject: "",
    category: "",
    description: "",
  })

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setTicketData({ subject: "", category: "", description: "" })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">How can we help?</h1>
        <p className="mt-2 text-muted-foreground">
          Get support, browse resources, or contact our team
        </p>
      </div>

      {/* Search */}
      <div className="relative mx-auto w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          className="bg-card pl-12 h-12 text-base"
        />
      </div>

      {/* Contact Options */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card text-center">
          <CardContent className="p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">Live Chat</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Chat with our support team
            </p>
            <Badge className="mt-3 bg-secondary text-secondary-foreground">Available Now</Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card text-center">
          <CardContent className="p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">Email Support</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              support@sheriabot.co.ke
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Response within 24hrs</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card text-center">
          <CardContent className="p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">Phone Support</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              +254 20 123 4567
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Mon-Fri, 8am-6pm EAT</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit Ticket */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Submit a Support Ticket</CardTitle>
            <CardDescription>
              Describe your issue and our team will get back to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={ticketData.category}
                  onValueChange={(value) => setTicketData({ ...ticketData, category: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing & Subscription</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="compliance">Compliance Question</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible..."
                  value={ticketData.description}
                  onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                  className="min-h-32 bg-background"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Tickets */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Your Tickets</CardTitle>
            <CardDescription>Track the status of your support requests</CardDescription>
          </CardHeader>
          <CardContent>
            {existingTickets.length > 0 ? (
              <div className="space-y-3">
                {existingTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono text-muted-foreground">{ticket.id}</p>
                        <Badge variant={ticket.status === "resolved" ? "secondary" : "outline"}>
                          {ticket.status === "resolved" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : null}
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="mt-1 font-medium text-foreground">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No support tickets yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Help Resources</CardTitle>
          <CardDescription>Browse our documentation and tutorials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {resources.map((resource) => (
              <Link
                key={resource.title}
                href={resource.href}
                className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <resource.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{resource.title}</p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
