"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Send, Paperclip, Clock, CheckCircle2 } from "lucide-react"

const mockTicket = {
  id: "TKT-2024-001",
  subject: "Issue with compliance checklist generation",
  status: "open",
  priority: "high",
  category: "Technical",
  createdAt: "2024-01-25T10:30:00Z",
  messages: [
    {
      id: 1,
      sender: "user",
      name: "John Kamau",
      message: "I'm having trouble generating the PSP License checklist. The system shows an error after I select the document type.",
      timestamp: "2024-01-25T10:30:00Z",
    },
    {
      id: 2,
      sender: "support",
      name: "Support Team",
      message: "Thank you for reaching out. Could you please provide more details about the error message you're seeing? A screenshot would be helpful.",
      timestamp: "2024-01-25T11:15:00Z",
    },
    {
      id: 3,
      sender: "user",
      name: "John Kamau",
      message: "The error says 'Failed to generate checklist. Please try again later.' I've tried multiple times but keep getting the same error.",
      timestamp: "2024-01-25T11:30:00Z",
    },
  ],
}

export default function TicketDetailPage() {
  const params = useParams()
  const [newMessage, setNewMessage] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/support"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{mockTicket.subject}</h1>
              <Badge variant="outline" className="font-mono text-xs">{params.ticketId}</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={mockTicket.status === "open" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}>
                {mockTicket.status === "open" ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                {mockTicket.status}
              </Badge>
              <Badge variant="outline" className="border-destructive text-destructive">{mockTicket.priority}</Badge>
              <span className="text-sm text-muted-foreground">{mockTicket.category}</span>
            </div>
          </div>
        </div>
        <Button variant="outline">Close Ticket</Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockTicket.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === "support" ? "flex-row-reverse" : ""}`}>
              <Avatar>
                <AvatarFallback className={msg.sender === "support" ? "bg-primary/10 text-primary" : "bg-muted"}>
                  {msg.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 max-w-[80%] ${msg.sender === "support" ? "text-right" : ""}`}>
                <div className={`inline-block p-4 rounded-lg ${msg.sender === "support" ? "bg-primary/10" : "bg-muted/50"}`}>
                  <p className="text-sm text-foreground">{msg.message}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${msg.sender === "support" ? "justify-end" : ""}`}>
                  <span>{msg.name}</span>
                  <span>{new Date(msg.timestamp).toLocaleString("en-KE")}</span>
                </div>
              </div>
            </div>
          ))}

          <Separator />

          <div className="space-y-4">
            <Textarea
              placeholder="Type your reply..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px] bg-muted/50"
            />
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm"><Paperclip className="h-4 w-4 mr-2" />Attach File</Button>
              <Button className="bg-primary text-primary-foreground"><Send className="h-4 w-4 mr-2" />Send Reply</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
