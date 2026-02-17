"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  MessageSquare,
  Plus,
  Search,
  Send,
  Paperclip,
  Clock,
  FileText,
  UserPlus,
} from "lucide-react"

const workspaces = [
  {
    id: "ws-001",
    name: "DCP Regulations Review",
    description: "Review and finalize digital credit provider regulations",
    members: 5,
    messages: 23,
    lastActive: "2 hours ago",
    unread: 3,
  },
  {
    id: "ws-002",
    name: "AML/CFT Policy Update",
    description: "Updating anti-money laundering policies for 2025",
    members: 4,
    messages: 45,
    lastActive: "1 day ago",
    unread: 0,
  },
  {
    id: "ws-003",
    name: "Mobile Money Framework",
    description: "Developing new regulatory framework for mobile money operators",
    members: 6,
    messages: 67,
    lastActive: "3 hours ago",
    unread: 8,
  },
]

const teamMembers = [
  { id: "1", name: "Dr. Amina Ochieng", role: "Policy Lead", status: "online" },
  { id: "2", name: "James Mwangi", role: "Legal Counsel", status: "online" },
  { id: "3", name: "Grace Wanjiru", role: "Compliance Officer", status: "away" },
  { id: "4", name: "Peter Kamau", role: "Technical Analyst", status: "offline" },
  { id: "5", name: "Mary Akinyi", role: "Research Associate", status: "online" },
]

const messages = [
  {
    id: "1",
    sender: "Dr. Amina Ochieng",
    content: "I've reviewed the draft consumer protection clauses. We need to strengthen the cooling-off period provisions.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    sender: "Me",
    content: "Agreed. I'll prepare an updated draft with a 72-hour cooling-off period instead of 48 hours.",
    time: "10:45 AM",
    isMe: true,
  },
  {
    id: "3",
    sender: "James Mwangi",
    content: "That aligns with the Consumer Protection Act recommendations. Let me also add cross-references to relevant sections.",
    time: "11:00 AM",
    isMe: false,
  },
]

export default function CollaborationPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0])
  const [newMessage, setNewMessage] = useState("")

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Collaboration</h1>
          <p className="mt-1 text-muted-foreground">
            Collaborate on regulatory policies and frameworks with your team
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr_250px]">
        {/* Workspaces List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search workspaces..." className="pl-9" />
          </div>
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className={`cursor-pointer border-border/50 transition-all hover:border-primary/50 ${
                  selectedWorkspace.id === workspace.id ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => setSelectedWorkspace(workspace)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-foreground">{workspace.name}</h3>
                    {workspace.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        {workspace.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {workspace.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {workspace.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {workspace.messages}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workspace.lastActive}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <Card className="flex flex-col border-border/50">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedWorkspace.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedWorkspace.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Files
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-0">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isMe ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {message.sender.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[70%] ${message.isMe ? "text-right" : ""}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {message.isMe ? "You" : message.sender}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.isMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[44px] resize-none"
                  rows={1}
                />
                <Button className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                        member.status === "online"
                          ? "bg-secondary"
                          : member.status === "away"
                            ? "bg-accent"
                            : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full bg-transparent">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>
    </div>
  )
}
