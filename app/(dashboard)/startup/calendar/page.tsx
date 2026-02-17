"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Bell,
  FileText,
  AlertTriangle,
} from "lucide-react"

const events = [
  {
    id: 1,
    title: "Submit Audited Financials",
    date: "2024-02-15",
    type: "deadline",
    description: "CBK PSP License Application",
    priority: "high",
  },
  {
    id: 2,
    title: "Quarterly AML Report Due",
    date: "2024-02-28",
    type: "compliance",
    description: "FRC Reporting Requirement",
    priority: "high",
  },
  {
    id: 3,
    title: "Data Protection Audit",
    date: "2024-03-05",
    type: "audit",
    description: "Annual ODPC compliance review",
    priority: "medium",
  },
  {
    id: 4,
    title: "Sandbox Testing Begins",
    date: "2024-03-01",
    type: "milestone",
    description: "CBK Regulatory Sandbox",
    priority: "medium",
  },
  {
    id: 5,
    title: "Board Compliance Review",
    date: "2024-03-10",
    type: "meeting",
    description: "Quarterly board meeting",
    priority: "low",
  },
  {
    id: 6,
    title: "License Renewal",
    date: "2024-04-01",
    type: "deadline",
    description: "Annual PSP license renewal",
    priority: "high",
  },
]

const typeConfig = {
  deadline: { label: "Deadline", color: "bg-destructive/10 text-destructive" },
  compliance: { label: "Compliance", color: "bg-warning/10 text-warning" },
  audit: { label: "Audit", color: "bg-primary/10 text-primary" },
  milestone: { label: "Milestone", color: "bg-primary/10 text-primary" },
  meeting: { label: "Meeting", color: "bg-muted text-muted-foreground" },
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1))

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Track deadlines, audits, and compliance milestones
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dayEvents = getEventsForDay(day)
                  const hasHighPriority = dayEvents.some((e) => e.priority === "high")
                  return (
                    <div
                      key={day}
                      className={`aspect-square p-1 rounded-lg border border-transparent hover:border-border cursor-pointer transition-colors ${
                        dayEvents.length > 0 ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="text-sm font-medium text-foreground">{day}</div>
                      {dayEvents.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-[10px] px-1 py-0.5 rounded truncate ${
                                typeConfig[event.type as keyof typeof typeConfig].color
                              }`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={typeConfig[event.type as keyof typeof typeConfig].color}
                    >
                      {typeConfig[event.type as keyof typeof typeConfig].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(event.date).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-foreground">Reminder</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have 2 high-priority deadlines in the next 30 days. Make sure to prepare
                    required documents in advance.
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
