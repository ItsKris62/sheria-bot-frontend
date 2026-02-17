"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Send,
  Loader2,
  BookOpen,
  Sparkles,
  Clock,
  ChevronRight,
  Scale,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  AlertCircle,
} from "lucide-react"
import { useComplianceQuery, useComplianceHistory } from "@/hooks/use-compliance"
import { formatDistanceToNow } from "date-fns"

const suggestedQueries = [
  "What are the KYC requirements for digital lenders in Kenya?",
  "How do I comply with the Data Protection Act for mobile money?",
  "What are the CBK reporting requirements for payment service providers?",
  "Consumer protection obligations for fintech companies",
  "AML compliance requirements for cryptocurrency exchanges",
]

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  citations?: {
    text: string
    source: string
    section: string
  }[]
  confidence?: number
  queryId?: string
  timestamp: Date
}

export default function ComplianceQueryPage() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const { submitQuery, isQuerying, queryError, submitFollowUp, isFollowingUp } = useComplianceQuery()
  const { data: historyData } = useComplianceHistory(1, 5)

  const isLoading = isQuerying || isFollowingUp
  const lastQueryId = messages.filter((m) => m.queryId).at(-1)?.queryId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: query,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentQuery = query
    setQuery("")

    try {
      let result;
      if (lastQueryId) {
        // Follow-up question
        result = await submitFollowUp({
          originalQueryId: lastQueryId,
          question: currentQuery,
        })
      } else {
        // New query
        result = await submitQuery({
          question: currentQuery,
        })
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: result.answer,
        citations: result.citations?.map((c) => ({
          text: c.text,
          source: c.source,
          section: c.section,
        })),
        confidence: "confidence" in result ? (result as { confidence?: number }).confidence : undefined,
        queryId: result.queryId,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "assistant",
        content: queryError || "Failed to process your query. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleSuggestedQuery = (suggested: string) => {
    setQuery(suggested)
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance Query</h1>
        <p className="text-muted-foreground">
          Ask questions about Kenya&apos;s fintech regulations and get AI-powered answers with legal citations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="flex h-[calc(100vh-240px)] flex-col border-border/50 bg-card">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">
                    Ask a Compliance Question
                  </h2>
                  <p className="mt-2 max-w-md text-muted-foreground">
                    Get instant answers about Kenya&apos;s fintech regulations, CBK guidelines,
                    data protection requirements, and more.
                  </p>
                  <div className="mt-8 w-full max-w-md">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      Suggested queries:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedQueries.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuery(suggestion)}
                          className="rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          {suggestion.length > 40 ? suggestion.slice(0, 40) + "..." : suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.type === "assistant" && (
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">SheriaBot</span>
                            {message.confidence && (
                              <Badge variant="outline" className="text-xs ml-auto">
                                {Math.round(message.confidence * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className={`prose prose-sm max-w-none ${message.type === "user" ? "prose-invert" : ""}`}>
                          <p className="whitespace-pre-line text-sm">{message.content}</p>
                        </div>
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-4 border-t border-border/50 pt-4">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Legal Citations ({message.citations.length}):
                            </p>
                            <div className="space-y-2">
                              {message.citations.map((citation, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 rounded-lg bg-background/50 p-2"
                                >
                                  <Scale className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-foreground">{citation.source}</p>
                                    {citation.section && (
                                      <p className="text-xs text-muted-foreground">{citation.section}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {citation.text}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {message.type === "assistant" && (
                          <div className="mt-4 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => handleCopy(message.content)}
                            >
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Bookmark className="mr-1 h-3 w-3" />
                              Save
                            </Button>
                            <div className="flex-1" />
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-muted px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Analyzing regulations...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Error display */}
            {queryError && (
              <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {queryError}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about KYC requirements, data protection, CBK guidelines..."
                  className="flex-1 bg-background"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <p className="mt-2 text-xs text-muted-foreground">
                Answers are AI-generated based on Kenya&apos;s legal corpus. Always verify with official sources.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Suggested Queries */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Suggested Queries</CardTitle>
              <CardDescription>Common compliance questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedQueries.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(suggestion)}
                    className="flex w-full items-center gap-2 rounded-lg border border-border/50 p-3 text-left text-sm transition-colors hover:bg-muted/50"
                  >
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2 text-foreground">{suggestion}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Query History - from API */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Queries</CardTitle>
              <CardDescription>Your query history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historyData?.queries && historyData.queries.length > 0 ? (
                  historyData.queries.map((item) => (
                    <Link
                      key={item.id}
                      href={`/startup/compliance-query/${item.id}`}
                      className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                    >
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.question}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No queries yet. Ask your first question!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legal Corpus Info */}
          <Card className="border-border/50 bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Legal Corpus</p>
                  <p className="text-xs text-muted-foreground">50+ Kenyan laws indexed</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Our AI is trained on CBK guidelines, Data Protection Act, National Payment System Act,
                and other relevant Kenyan legislation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
