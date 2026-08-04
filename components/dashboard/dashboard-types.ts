export type DashboardCategory = {
  key: string
  label: string
  score: number
  completedItems: number
  totalItems: number
}

export type DashboardTrend = {
  points: number | null
  label: "increase" | "decrease" | "no_change" | "insufficient_history"
  comparedAt: string | null
  windowDays: 30
}

export type DashboardData = {
  overallScore: number
  categories: DashboardCategory[]
  trend?: DashboardTrend | null
  lastUpdated?: string | Date | null
}

export type AlertItem = {
  id: string
  title: string
  summary: string
  severity: "critical" | "high" | "medium" | "low" | string
  regulatoryBody: string
  publishedAt: Date | string | null
  isRead: boolean
}

export type DeadlineItem = {
  id: string
  title: string
  dueDate: string | Date
  priority: "HIGH" | "MEDIUM" | "LOW" | string
  status: string
  category: string
  regulation?: string | null
}

export type QueryItem = {
  id: string
  query: string
  createdAt: string | Date
}
