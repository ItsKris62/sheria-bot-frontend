import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ComplianceScoreGauge } from '../compliance-score-gauge'
import { JurisdictionSelector } from '../jurisdiction-selector'
import { PriorityAttention } from '../priority-attention'
import { ComplianceReviewDrawer } from '../compliance-review-drawer'

// Mock TRPC in frontend tests
vi.mock('@/lib/trpc', () => ({
  trpc: {
    useUtils: () => ({
      complianceDashboard: {
        getComplianceDashboard: { invalidate: vi.fn() },
        getComplianceDashboardV2: { invalidate: vi.fn() },
      },
    }),
    complianceDashboard: {
      assessDashboardItem: {
        useMutation: () => ({
          mutateAsync: vi.fn(),
          isLoading: false,
        }),
      },
    },
  },
}))

describe('Frontend V2 Jurisdiction Dashboard Components (Phase 1)', () => {
  describe('ComplianceScoreGauge Posture States', () => {
    it('renders unassessed neutral state when overallScore is null (NOT_STARTED)', () => {
      render(
        <ComplianceScoreGauge
          data={{
            overallScore: null,
            scoreType: null,
            assessmentStatus: 'NOT_STARTED',
            coveragePercent: 0,
          }}
        />
      )

      expect(screen.getByText('—')).toBeDefined()
      expect(screen.getByText('Not Assessed')).toBeDefined()
      expect(screen.getByText(/NOT REVIEWED/i)).toBeDefined()
      expect(screen.queryByText(/CRITICAL/i)).toBeNull()
    })

    it('renders provisional posture badge and coverage when scoreType is PROVISIONAL (IN_PROGRESS)', () => {
      render(
        <ComplianceScoreGauge
          data={{
            overallScore: 65,
            scoreType: 'PROVISIONAL',
            assessmentStatus: 'IN_PROGRESS',
            coveragePercent: 40,
          }}
        />
      )

      expect(screen.getByText('65')).toBeDefined()
      expect(screen.getByText(/PROVISIONAL POSTURE/i)).toBeDefined()
      expect(screen.getByText(/40% assessed across active categories/i)).toBeDefined()
      // CRITICAL INVARIANT: Incomplete assessment must NEVER display "Critical"
      expect(screen.queryByText(/CRITICAL/i)).toBeNull()
    })

    it('renders final mapped risk band when scoreType is FINAL (ASSESSED)', () => {
      render(
        <ComplianceScoreGauge
          data={{
            overallScore: 25,
            scoreType: 'FINAL',
            assessmentStatus: 'ASSESSED',
            coveragePercent: 100,
          }}
        />
      )

      expect(screen.getByText('25')).toBeDefined()
      expect(screen.getByText(/CRITICAL/i)).toBeDefined()
    })
  });

  describe('PriorityAttention Truthful Empty State', () => {
    it('displays factual empty state without false all up to date claims', () => {
      render(<PriorityAttention deadlines={[]} alerts={[]} />)

      expect(screen.getByText('No urgent items requiring immediate action')).toBeDefined()
      expect(
        screen.getByText(/No critical regulatory alerts or imminent deadlines within the active window/i)
      ).toBeDefined()
      // Verifies false assertion was removed
      expect(screen.queryByText(/All critical regulatory alerts and upcoming deadlines are up to date/i)).toBeNull()
    })
  });

  describe('JurisdictionSelector', () => {
    it('renders current selection and primary country indicator', () => {
      render(
        <JurisdictionSelector
          selectedJurisdiction="KE"
          homeJurisdiction="KE"
          enabledJurisdictions={['KE', 'RW']}
          onSelectJurisdiction={vi.fn()}
        />
      )

      expect(screen.getByText(/Jurisdiction:/i)).toBeDefined()
    })
  });

  describe('ComplianceReviewDrawer', () => {
    it('renders requirements for the category with 3-state review actions', () => {
      const mockReqs = [
        {
          id: 'item_1',
          requirementKey: 'KE:DATA_PROTECTION:DPO_REGISTRATION',
          jurisdictionCode: 'KE',
          category: 'DATA_PROTECTION',
          title: 'Data Protection Officer (DPO) registered',
          description: 'A Data Protection Officer has been appointed and registered.',
          reviewStatus: 'NOT_REVIEWED' as const,
          isCompleted: false,
          assessedAt: null,
          updatedAt: new Date().toISOString(),
        },
      ]

      render(
        <ComplianceReviewDrawer
          isOpen={true}
          onClose={vi.fn()}
          categoryKey="DATA_PROTECTION"
          categoryName="Data Protection"
          requirements={mockReqs}
        />
      )

      expect(screen.getByText(/Review Requirements — Data Protection/i)).toBeDefined()
      expect(screen.getByText('Data Protection Officer (DPO) registered')).toBeDefined()
      expect(screen.getByText('KE:DATA_PROTECTION:DPO_REGISTRATION')).toBeDefined()
      expect(screen.getByText('Meets Requirement')).toBeDefined()
      expect(screen.getByText('Does Not Meet')).toBeDefined()
      expect(screen.getAllByText('Not Reviewed').length).toBeGreaterThanOrEqual(1)
    })
  });
});
