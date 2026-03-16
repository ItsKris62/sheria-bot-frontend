"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Bell,
  AlertTriangle,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { AddEventModal } from "@/components/calendar/AddEventModal"
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from "@/lib/calendar-config"

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarEvent {
  id:          string
  title:       string
  description: string | null
  dueDate:     Date | string
  priority:    string
  status:      string
  category:    string
  regulation:  string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function getDaysInMonth(date: Date) {
  const year     = date.getFullYear()
  const month    = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const total    = new Date(year, month + 1, 0).getDate()
  return { firstDay, daysInMonth: total }
}

function toDateStr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function getEventsForDay(events: CalendarEvent[], year: number, month: number, day: number): CalendarEvent[] {
  const target = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return events.filter((e) => toDateStr(e.dueDate) === target)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = new Date()
  const [currentDate, setCurrentDate]   = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [addEventOpen, setAddEventOpen] = useState(false)

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: monthEvents = [], isLoading: eventsLoading } = trpc.calendar.list.useQuery({
    month: currentDate.getMonth() + 1,
    year:  currentDate.getFullYear(),
  })

  const { data: upcomingEvents = [], isLoading: upcomingLoading } = trpc.calendar.upcoming.useQuery({
    daysAhead: 30,
  })

  // ── Navigation ─────────────────────────────────────────────────────────────

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // ── High-priority count for reminder card ──────────────────────────────────

  const highPriorityCount = upcomingEvents.filter(
    (e: CalendarEvent) => e.priority === "HIGH" || e.priority === "CRITICAL"
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Track deadlines, audits, and compliance milestones
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground"
          onClick={() => setAddEventOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar grid */}
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
              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {eventsLoading ? (
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day       = i + 1
                    const dayEvents = getEventsForDay(monthEvents, currentDate.getFullYear(), currentDate.getMonth(), day)
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
                            {dayEvents.slice(0, 2).map((event) => {
                              const cfg = CATEGORY_CONFIG[event.category] ?? CATEGORY_CONFIG["CUSTOM"]
                              return (
                                <div
                                  key={event.id}
                                  className={`text-[10px] px-1 py-0.5 rounded truncate ${cfg.color}`}
                                >
                                  {event.title}
                                </div>
                              )
                        })}
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming deadlines */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming deadlines in the next 30 days.
                </p>
              ) : (
                upcomingEvents.map((event: CalendarEvent) => {
                  const catCfg  = CATEGORY_CONFIG[event.category]  ?? CATEGORY_CONFIG["CUSTOM"]
                  const priCfg  = PRIORITY_CONFIG[event.priority]  ?? PRIORITY_CONFIG["MEDIUM"]
                  const dueDate = typeof event.dueDate === "string" ? new Date(event.dueDate) : event.dueDate
                  return (
                    <div key={event.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{event.title}</p>
                          {event.regulation && (
                            <p className="text-xs text-muted-foreground truncate">{event.regulation}</p>
                          )}
                        </div>
                        <Badge variant="outline" className={`shrink-0 ${catCfg.color}`}>
                          {catCfg.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          {dueDate.toLocaleDateString("en-KE", { dateStyle: "medium" })}
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${priCfg.color}`}>
                          {priCfg.label}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Reminder card — only shown when there are high-priority items */}
          {highPriorityCount > 0 && (
            <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-foreground">Reminder</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You have {highPriorityCount} high-priority{" "}
                      {highPriorityCount === 1 ? "deadline" : "deadlines"} in the next 30 days.
                      Make sure to prepare required documents in advance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        open={addEventOpen}
        onClose={() => setAddEventOpen(false)}
      />
    </div>
  )
}
