const noOp = () => undefined
const mutation = (options?: { onSuccess?: (value: any) => void }) => ({
  mutate: (value?: any) => options?.onSuccess?.(value),
  mutateAsync: async (value?: any) => value,
  isPending: false,
})

const longTitle = "Kenya Data Protection Act 2019 - Cross-Border Transfers, Automated Decision-Making, Sensitive Personal Data and Children"

export const resultFixture = {
  id: "analysis-complete",
  documentName: "enterprise-policy-with-a-very-long-filename-for-responsive-validation.pdf",
  organizationName: "Visual QA Organization",
  userName: "Visual QA",
  createdAt: "2026-10-17T08:00:00.000Z",
  analysisDepth: "standard",
  ragGrounded: true,
  chunksProcessed: 18,
  jurisdictionCode: "KE",
  regulatoryFrameworks: ["dpa-2019"],
  overallScore: 68,
  results: {
    overallScore: 68,
    complianceAlignmentScore: 68,
    assessmentCoverageScore: 72,
    coverageStatus: "PARTIAL",
    scoringVersion: "v2.0-evidence-backed",
    executiveSummary: "The policy partially aligns with assessed requirements. Several controls need clearer ownership and evidence.",
    frameworks: [{
      id: "dpa-2019", name: longTitle, score: 68,
      summary: "Partial alignment across the assessed requirements.", strengths: ["Defines a privacy owner", "Includes an incident workflow"],
      gaps: [{
        id: "gap-long-citation", title: "Cross-border transfer safeguards require clearer operational evidence", severity: "HIGH",
        regulatoryBasis: "Data Protection Act 2019, long-form regulatory basis used to exercise wrapping without clipping or horizontal overflow.",
        description: "The policy states a control but does not identify the transfer assessment record or review owner.",
        policyCurrentState: "A general transfer statement exists.", recommendation: "Name the accountable role and attach the assessment evidence reference.", effort: "Medium", priority: 1,
        verification: { verdict: "SUPPORTED", confidence: 0.93 }, verificationStatus: "verified",
        coverage: { regulatoryEvidenceAvailable: true, policySectionAssessed: true, extractionComplete: true },
        regulatoryEvidence: [{ evidenceId: "ev-1", vectorId: "vec-1", documentTitle: longTitle, section: "Section 48", jurisdiction: "KE", frameworkSlug: "dpa-2019", sourceAuthority: "Office of the Data Protection Commissioner", excerpt: "A deliberately long evidence excerpt validates that citations and authoritative source text wrap inside the result card without widening the mobile viewport." }],
        policyEvidence: [{ policyEvidenceId: "pol-1", chunkIndex: 4, page: 7, sectionHeading: "International Transfers", excerpt: "Transfers may occur where suitable safeguards are in place." }],
      }, {
        id: "gap-partial", title: "Retention schedule is only partly specified", severity: "MEDIUM", regulatoryBasis: "Data minimisation and storage limitation requirements.",
        description: "The policy lacks approved disposal intervals.", policyCurrentState: "Deletion is described without schedules.", recommendation: "Approve and publish the retention schedule.", effort: "Low", priority: 2,
        verification: { verdict: "PARTIALLY_SUPPORTED", confidence: 0.74 }, coverage: { regulatoryEvidenceAvailable: true, policySectionAssessed: true, extractionComplete: true },
      }],
    }],
    crossCuttingStrengths: ["Named privacy owner", "Incident escalation path"],
    actionPlan: [{ priority: 1, action: "Document transfer assessment evidence", framework: "dpa-2019", deadline: "30 days", effort: "Medium", resources: ["Privacy owner", "Legal review"] }],
    metadata: {
      documentName: "enterprise-policy.pdf", analysisDepth: "standard", frameworksAnalysed: ["dpa-2019"], totalGaps: 2, criticalGaps: 0, highGaps: 1,
      analysisDate: "2026-10-17T08:00:00.000Z", scoringVersion: "v2.0-evidence-backed", complianceAlignmentScore: 68, assessmentCoverageScore: 72,
      coverageStatus: "PARTIAL", executionProfileVersion: "gap-analysis-depth-v2", executionLimitations: ["One requirement was not assessed because policy evidence was unavailable."],
      frameworkCoverage: { "dpa-2019": { frameworkSlug: "dpa-2019", evidenceStatus: "PARTIAL", assessedRequirementCount: 8, unassessedRequirementCount: 2 } },
      documentCoverage: { totalChunks: 20, processedChunks: 18, failedChunks: 1, skippedChunks: 1, extractionComplete: false }, selectedBenchmarkDocuments: [],
    },
  },
}

const analyses = [
  { id: "analysis-complete", documentName: resultFixture.documentName, documentType: "pdf", overallScore: 68, status: "COMPLETED", analysisDepth: "standard", createdAt: resultFixture.createdAt, jurisdictionCode: "KE", regulatoryFrameworks: ["dpa-2019"], results: resultFixture.results },
  { id: "analysis-not-assessed", documentName: "legacy-policy-not-assessed.pdf", documentType: "pdf", overallScore: 54, status: "COMPLETED", analysisDepth: "quick", createdAt: resultFixture.createdAt, jurisdictionCode: "RW", regulatoryFrameworks: ["rw-dpa-2021"], results: { scoringVersion: "v2.0-evidence-backed", coverageStatus: "INSUFFICIENT", complianceAlignmentScore: 54, metadata: { coverageStatus: "INSUFFICIENT", frameworkCoverage: { rw: { assessedRequirementCount: 0 } } } } },
  { id: "analysis-cancelled", documentName: "cancelled-policy.pdf", documentType: "pdf", overallScore: null, status: "CANCELLED", analysisDepth: "standard", createdAt: resultFixture.createdAt, jurisdictionCode: "MW", regulatoryFrameworks: ["mw-cybersecurity-2016"] },
  { id: "analysis-failed", documentName: "failed-policy.pdf", documentType: "pdf", overallScore: null, status: "FAILED", analysisDepth: "quick", createdAt: resultFixture.createdAt, jurisdictionCode: "NG", regulatoryFrameworks: ["ndpa-2023"], errorMessage: "Provider request failed" },
]

const query = (data: any) => ({ data, isLoading: false, error: null, refetch: async () => ({ data }) })
export const trpc: any = {
  useUtils: () => ({ gapAnalysis: { getGapAnalyses: { invalidate: noOp }, getFrameworks: { invalidate: noOp }, getGapAnalysisLimits: { invalidate: noOp } } }),
  gapAnalysis: {
    getGapAnalyses: { useQuery: () => query(analyses) },
    getFrameworks: { useQuery: () => query([{ slug: "dpa-2019", name: longTitle, category: "Privacy", description: "Primary Kenyan privacy framework", tier: "STARTUP", locked: false, applicable: true, pilotEnabled: true }]) },
    getGapAnalysisLimits: { useQuery: () => query({ enabled: true, maxFileSizeBytes: 10_485_760, allowedFileTypes: [{ extension: "pdf", label: "PDF", mimeTypes: ["application/pdf"] }, { extension: "docx", label: "DOCX", mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] }, { extension: "txt", label: "TXT", mimeTypes: ["text/plain"] }], allowedDepths: ["quick", "standard", "deep"], depthAvailability: { default: { quick: true, standard: true, deep: false }, frameworks: {} }, depthOptions: [{ depth: "quick", units: 1, label: "Quick", description: "Focused review", breadth: "Priority requirements" }, { depth: "standard", units: 2, label: "Standard", description: "Broader review", breadth: "Expanded requirements" }, { depth: "deep", units: 4, label: "Deep", description: "Research mode", breadth: "Extended research" }], processingAcknowledgement: { version: "visual-qa-v1", text: "I understand that SheriaBot processes this document to provide evidence-backed decision support and not legal advice." }, benchmarkDocuments: false, pilotAvailability: { jurisdictions: Object.fromEntries(["KE", "RW", "MW", "NG"].map((jurisdiction) => [jurisdiction, { jurisdiction, pilotEnabled: true, readiness: "VALIDATED_FOR_GAP_ANALYSIS" }])) } }) },
    getGapAnalysisStatus: { useQuery: () => query(null) },
    getGapAnalysisResult: { useQuery: () => query(resultFixture) },
    runGapAnalysis: { useMutation: mutation }, deleteGapAnalysis: { useMutation: mutation },
  },
  document: { listBenchmarkDocuments: { useQuery: () => query([]) } },
  compliance: { logExport: { useMutation: mutation }, exportDocx: { useMutation: mutation } },
}
