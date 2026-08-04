import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import {
  UserDashboardHeader,
  ComplianceOverview,
  PriorityAttention,
  RegulatoryAlertsCard,
  UpcomingDeadlinesCard,
  DashboardQuickActions,
  RecentComplianceQueries,
} from "../index"
import type { DashboardData, AlertItem, DeadlineItem, QueryItem } from "../dashboard-types"

// Mock Plan Context so FeatureGate evaluates correctly in tests
vi.mock("@/lib/plan-context", () => ({
  usePlan: () => ({
    hasFeature: (feature: string) => feature === "complianceCalendar",
  }),
}))

// Mock AllQueriesDialog to prevent tRPC context error in dialog child
vi.mock("@/components/compliance/all-queries-dialog", () => ({
  AllQueriesDialog: () => null,
}))

describe("Redesigned User Dashboard Components (Phase 2)", () => {
  describe("UserDashboardHeader", () => {
    it("renders page-level h1 welcome message and primary CTA link", () => {
      render(<UserDashboardHeader displayName="Kris" />)
      const heading = screen.getByRole("heading", { level: 1, name: "Welcome back, Kris" })
      expect(heading).toBeInTheDocument()

      const ctaLink = screen.getByRole("link", { name: "Ask Compliance Question" })
      expect(ctaLink).toHaveAttribute("href", "/startup/compliance-query")
    })
  })

  describe("ComplianceOverview", () => {
    const mockData: DashboardData = {
      overallScore: 82,
      lastUpdated: new Date().toISOString(),
      trend: { points: 5, label: "increase", comparedAt: null, windowDays: 30 },
      categories: [
        { key: "data_protection", label: "Data Protection", score: 85, completedItems: 17, totalItems: 20 },
        { key: "aml_kyc", label: "AML / KYC", score: 80, completedItems: 16, totalItems: 20 },
        { key: "cbk_licensing", label: "CBK Licensing", score: 75, completedItems: 15, totalItems: 20 },
        { key: "consumer_protection", label: "Consumer Protection", score: 90, completedItems: 18, totalItems: 20 },
        { key: "cybersecurity", label: "Cybersecurity", score: 80, completedItems: 16, totalItems: 20 },
      ],
    }

    it("renders overall score percentage and all 5 categories", () => {
      render(<ComplianceOverview data={mockData} />)
      expect(screen.getByText("82%")).toBeInTheDocument()
      expect(screen.getByText("Data Protection")).toBeInTheDocument()
      expect(screen.getByText("AML / KYC")).toBeInTheDocument()
      expect(screen.getByText("CBK Licensing")).toBeInTheDocument()
      expect(screen.getByText("Consumer Protection")).toBeInTheDocument()
      expect(screen.getByText("Cybersecurity")).toBeInTheDocument()
    })

    it("renders score trend badge text", () => {
      render(<ComplianceOverview data={mockData} />)
      expect(screen.getByText("+5 pts vs 30d ago")).toBeInTheDocument()
    })

    it("renders error state when isError is true", () => {
      render(<ComplianceOverview isError={true} />)
      expect(screen.getByText("Unable to load compliance posture")).toBeInTheDocument()
    })
  })

  describe("PriorityAttention", () => {
    it("renders positive empty state when no urgent items exist", () => {
      render(<PriorityAttention deadlines={[]} alerts={[]} />)
      expect(screen.getByText("No urgent items requiring immediate action")).toBeInTheDocument()
    })

    it("renders urgent deadlines (<= 3 days left) and critical unread alerts", () => {
      const urgentDeadline: DeadlineItem = {
        id: "d1",
        title: "CBK Annual Compliance Return",
        dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day left
        priority: "HIGH",
        status: "PENDING",
        category: "CBK",
      }

      const criticalAlert: AlertItem = {
        id: "a1",
        title: "ODPC New Penalty Guideline",
        summary: "Updated fines for data breach notifications",
        severity: "critical",
        regulatoryBody: "ODPC Kenya",
        publishedAt: new Date().toISOString(),
        isRead: false,
      }

      render(<PriorityAttention deadlines={[urgentDeadline]} alerts={[criticalAlert]} />)
      expect(screen.getByText("Priority Attention Required")).toBeInTheDocument()
      expect(screen.getByText("CBK Annual Compliance Return")).toBeInTheDocument()
      expect(screen.getByText("ODPC New Penalty Guideline")).toBeInTheDocument()
    })
  })

  describe("RegulatoryAlertsCard", () => {
    const mockAlerts: AlertItem[] = [
      {
        id: "a1",
        title: "CBK Regulatory Notice",
        summary: "New cybersecurity requirements for PSPs",
        severity: "high",
        regulatoryBody: "Central Bank of Kenya",
        publishedAt: new Date().toISOString(),
        isRead: false,
      },
    ]

    it("renders alert title, regulatory body, and severity badge", () => {
      render(<RegulatoryAlertsCard alerts={mockAlerts} />)
      expect(screen.getByText("CBK Regulatory Notice")).toBeInTheDocument()
      expect(screen.getByText("high")).toBeInTheDocument()
      expect(screen.getByText(/Central Bank of Kenya/)).toBeInTheDocument()
    })

    it("renders empty state message when alerts array is empty", () => {
      render(<RegulatoryAlertsCard alerts={[]} />)
      expect(screen.getByText("No active regulatory alerts for your current plan window.")).toBeInTheDocument()
    })
  })

  describe("DashboardQuickActions", () => {
    it("renders 4 primary workflow action buttons with valid links", () => {
      render(<DashboardQuickActions />)
      expect(screen.getByRole("link", { name: "Ask Compliance Question" })).toHaveAttribute("href", "/startup/compliance-query")
      expect(screen.getByRole("link", { name: "Generate Checklist" })).toHaveAttribute("href", "/startup/checklists")
      expect(screen.getByRole("link", { name: "Run Gap Analysis" })).toHaveAttribute("href", "/startup/gap-analysis")
      expect(screen.getByRole("link", { name: "View Documents" })).toHaveAttribute("href", "/startup/documents")
    })
  })

  describe("RecentComplianceQueries", () => {
    const mockQueries: QueryItem[] = [
      { id: "q1", query: "What are the CBK capital requirements for digital credit providers?", createdAt: new Date().toISOString() },
    ]

    it("renders recent query text and new query button", () => {
      render(<RecentComplianceQueries queries={mockQueries} />)
      expect(screen.getByText("What are the CBK capital requirements for digital credit providers?")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "New query" })).toHaveAttribute("href", "/startup/compliance-query")
    })

    it("renders empty state message when no queries exist", () => {
      render(<RecentComplianceQueries queries={[]} />)
      expect(screen.getByText("No queries yet. Ask your first question!")).toBeInTheDocument()
    })
  })
})
