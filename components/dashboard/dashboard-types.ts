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

// ============================================================================
// V2 Jurisdiction-First Compliance Dashboard Types
// ============================================================================

export type DashboardAvailabilityStatus =
  | 'READY'
  | 'BASELINE_UNAVAILABLE'
  | 'JURISDICTION_NOT_ENTITLED'
  | 'JURISDICTION_NOT_CONFIGURED'
  | 'JURISDICTION_UNSUPPORTED'

export type DashboardAssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ASSESSED'

export type ComplianceRiskBand = 'CRITICAL' | 'POOR' | 'MODERATE' | 'GOOD' | 'EXCELLENT'

export type RequirementItemDTO = {
  id: string
  requirementKey: string
  jurisdictionCode: string
  category: string
  title: string
  description: string
  reviewStatus: 'NOT_REVIEWED' | 'MEETS_REQUIREMENT' | 'DOES_NOT_MEET_REQUIREMENT'
  isCompleted: boolean
  assessedAt: string | null
  updatedAt: string
}

export type CategoryPostureDTO = {
  category: string
  categoryName: string
  weight: number
  totalItems: number
  assessedItems: number
  compliantItems: number
  coveragePercent: number
  score: number | null
  reviewStatus: 'NOT_REVIEWED' | 'IN_PROGRESS' | 'COMPLETED'
}

export type ActiveDashboardData = {
  jurisdictionCode: string
  jurisdictionName: string
  assessmentStatus: DashboardAssessmentStatus
  scoreType: 'PROVISIONAL' | 'FINAL' | null
  overallScore: number | null
  riskBand: ComplianceRiskBand | null
  coveragePercent: number
  totalRequirements: number
  assessedRequirements: number
  compliantRequirements: number
  categories: CategoryPostureDTO[]
  requirements: RequirementItemDTO[]
  trend: {
    direction: 'UP' | 'DOWN' | 'STABLE' | 'NONE'
    delta: number | null
    historicalScores: Array<{ calculatedAt: string; overallScore: number }>
  }
}

export type InactiveDashboardData = {
  jurisdictionCode: string | null
  reasonCode: Exclude<DashboardAvailabilityStatus, 'READY'>
  message: string
  entitlement: {
    maxEnabledCountries: number
    enabledCount: number
    enabledJurisdictions: string[];
  }
}

export type ComplianceDashboardV2Response =
  | {
      availabilityStatus: 'READY'
      context: {
        selectedJurisdiction: string
        homeJurisdiction: string
        enabledJurisdictions: string[]
        maxEnabledCountries: number
      }
      dashboard: ActiveDashboardData
    }
  | {
      availabilityStatus: Exclude<DashboardAvailabilityStatus, 'READY'>
      context: {
        selectedJurisdiction: string | null
        homeJurisdiction: string | null
        enabledJurisdictions: string[]
        maxEnabledCountries: number
      }
      dashboard: InactiveDashboardData
    }
