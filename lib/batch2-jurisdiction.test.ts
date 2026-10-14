import { describe, expect, it } from 'vitest';
import { buildGapAnalysisInput } from '@/lib/gap-analysis-input';
import { jurisdictionLabel, type JurisdictionCode } from '@/lib/jurisdictions';
import { buildGapAnalysisReportHtml, type GapAnalysisReportResult } from '@/lib/utils/buildGapAnalysisReportHtml';

describe('Batch 2 Frontend: Jurisdiction Architecture & Report Alignment', () => {
  describe('Entitled Jurisdictions Resolution', () => {
    it('28. Single-country account resolves exactly 1 jurisdiction', () => {
      const homeJurisdictionCode: JurisdictionCode = 'KE';
      const enabledJurisdictions: JurisdictionCode[] = [];

      const entitledList = Array.from(
        new Set(
          [homeJurisdictionCode ?? 'KE', ...enabledJurisdictions].filter(
            (c): c is JurisdictionCode => ['KE', 'RW', 'MW', 'NG'].includes(c)
          )
        )
      );

      expect(entitledList).toEqual(['KE']);
      expect(entitledList.length).toBe(1);
    });

    it('29-30. Multi-country account resolves all entitled jurisdictions', () => {
      const homeJurisdictionCode: JurisdictionCode = 'KE';
      const enabledJurisdictions: JurisdictionCode[] = ['RW'];

      const entitledList = Array.from(
        new Set(
          [homeJurisdictionCode ?? 'KE', ...enabledJurisdictions].filter(
            (c): c is JurisdictionCode => ['KE', 'RW', 'MW', 'NG'].includes(c)
          )
        )
      );

      expect(entitledList).toEqual(['KE', 'RW']);
      expect(entitledList.length).toBe(2);
      expect(entitledList).not.toContain('NG');
    });

    it('Enterprise multi-country account resolves up to 4 jurisdictions', () => {
      const homeJurisdictionCode: JurisdictionCode = 'KE';
      const enabledJurisdictions: JurisdictionCode[] = ['RW', 'MW', 'NG'];

      const entitledList = Array.from(
        new Set(
          [homeJurisdictionCode ?? 'KE', ...enabledJurisdictions].filter(
            (c): c is JurisdictionCode => ['KE', 'RW', 'MW', 'NG'].includes(c)
          )
        )
      );

      expect(entitledList).toEqual(['KE', 'RW', 'MW', 'NG']);
      expect(entitledList.length).toBe(4);
    });
  });

  describe('Framework Selection and Incompatible Clearing', () => {
    it('31. Switching jurisdiction cleans out incompatible framework selections', () => {
      // Frameworks returned for Kenya: cbk-prudential (applicable: true), iso-27001 (applicable: true)
      // Frameworks returned for Rwanda: cbk-prudential (applicable: false), iso-27001 (applicable: true)
      const rwFrameworksData = [
        { slug: 'cbk-prudential', name: 'CBK Prudential', applicable: false },
        { slug: 'iso-27001', name: 'ISO 27001', applicable: true },
      ];

      const currentSelected = ['cbk-prudential', 'iso-27001'];
      const applicableSlugs = new Set(
        rwFrameworksData.filter((f) => f.applicable !== false).map((f) => f.slug)
      );
      const cleaned = currentSelected.filter((slug) => applicableSlugs.has(slug));

      expect(cleaned).toEqual(['iso-27001']);
      expect(cleaned).not.toContain('cbk-prudential');
    });
  });

  describe('Gap Analysis Input Contract', () => {
    it('32. buildGapAnalysisInput attaches explicit jurisdiction', () => {
      const input = buildGapAnalysisInput({
        fileName: 'policy.pdf',
        fileType: 'pdf',
        fileContent: 'cG9saWN5',
        regulatoryFrameworks: ['iso-27001'],
        benchmarkDocumentIds: [],
        analysisDepth: 'standard',
        focusAreas: [],
        jurisdiction: 'RW',
      });

      expect(input.jurisdiction).toBe('RW');
    });
  });

  describe('History & Legacy Handling', () => {
    it('34. New analysis preserves recorded jurisdiction in history', () => {
      const analysis = {
        id: 'ga_new_1',
        documentName: 'policy.pdf',
        jurisdictionCode: 'RW',
      };

      const label = analysis.jurisdictionCode
        ? `${jurisdictionLabel(analysis.jurisdictionCode)} (${analysis.jurisdictionCode})`
        : 'Jurisdiction not recorded for this legacy analysis';

      expect(label).toBe('Rwanda (RW)');
    });

    it('35. Legacy unknown jurisdiction is not fabricated as Kenya', () => {
      const legacyAnalysis = {
        id: 'ga_legacy_1',
        documentName: 'old_policy.pdf',
        jurisdictionCode: null,
      };

      const label = legacyAnalysis.jurisdictionCode
        ? `${jurisdictionLabel(legacyAnalysis.jurisdictionCode)} (${legacyAnalysis.jurisdictionCode})`
        : 'Jurisdiction not recorded for this legacy analysis';

      expect(label).toBe('Jurisdiction not recorded for this legacy analysis');
      expect(label).not.toContain('Kenya');
      expect(label).not.toContain('KE');
    });
  });

  describe('Report Alignment (Tests 36-37)', () => {
    const mockResult: GapAnalysisReportResult = {
      overallScore: 82,
      executiveSummary: 'Executive summary text.',
      frameworks: [
        {
          id: 'fw_1',
          name: 'ISO/IEC 27001',
          score: 85,
          summary: 'Framework summary',
          gaps: [],
          strengths: ['Strong access controls'],
        },
      ],
      actionPlan: [],
      metadata: {
        totalGaps: 0,
        criticalGaps: 0,
        highGaps: 0,
      },
    };

    it('36. Browser PDF HTML report includes jurisdiction on cover and methodology', () => {
      const html = buildGapAnalysisReportHtml({
        analysisId: 'ga_report_test_1',
        documentName: 'Security_Policy.pdf',
        createdAt: '2026-10-01T10:00:00.000Z',
        analysisDepth: 'standard',
        ragGrounded: true,
        chunksProcessed: 12,
        regulatoryFrameworks: ['iso-27001'],
        jurisdictionCode: 'RW',
        result: mockResult,
      });

      // Cover includes jurisdiction
      expect(html).toContain('Jurisdiction: <strong>RW</strong>');
      // Methodology includes jurisdiction
      expect(html).toContain('<tr><td>Jurisdiction</td><td>RW</td></tr>');
    });

    it('Legacy analysis report HTML clearly marks jurisdiction as not recorded', () => {
      const html = buildGapAnalysisReportHtml({
        analysisId: 'ga_report_legacy_1',
        documentName: 'Legacy_Policy.pdf',
        createdAt: '2026-01-01T10:00:00.000Z',
        analysisDepth: 'standard',
        ragGrounded: true,
        chunksProcessed: 5,
        regulatoryFrameworks: ['cbk-prudential'],
        jurisdictionCode: null,
        result: mockResult,
      });

      expect(html).toContain('Jurisdiction: <strong>Not recorded (legacy)</strong>');
      expect(html).toContain('<tr><td>Jurisdiction</td><td>Not recorded (legacy analysis)</td></tr>');
      expect(html).not.toContain('Jurisdiction: <strong>KE</strong>');
    });

    it('Quick high alignment remains visibly limited by assessment coverage', () => {
      const html = buildGapAnalysisReportHtml({
        analysisId: 'ga_quick_limited',
        documentName: 'Quick_Policy.pdf',
        createdAt: '2026-10-08T10:00:00.000Z',
        analysisDepth: 'quick',
        ragGrounded: true,
        chunksProcessed: 4,
        regulatoryFrameworks: ['iso-27001'],
        jurisdictionCode: 'KE',
        result: {
          ...mockResult,
          overallScore: 92,
          assessmentCoverage: 35,
          documentCoverage: {
            totalChunks: 14,
            processedChunks: 4,
            failedChunks: 0,
            skippedChunks: 10,
            extractionComplete: false,
          },
          metadata: {
            ...mockResult.metadata,
            scoringVersion: 'v2.0-evidence-backed',
            complianceAlignmentScore: 92,
            assessmentCoverageScore: 35,
            coverageStatus: 'PARTIAL',
            executionProfileVersion: 'gap-analysis-depth-v2',
            executionLimitations: ['Quick screening sampled the configured policy structure; assessment coverage is limited.'],
          },
        },
      });

      expect(html).toContain('Compliance Alignment')
      expect(html).toContain('92% (Assessed requirements)')
      expect(html).toContain('Assessment Coverage')
      expect(html).toContain('Partial - 0 evidence-backed obligations evaluated')
      expect(html).toContain('This is not a complete framework inventory')
      expect(html).toContain('gap-analysis-depth-v2')
      expect(html).not.toContain('92% Compliant')
    });
  });
});
