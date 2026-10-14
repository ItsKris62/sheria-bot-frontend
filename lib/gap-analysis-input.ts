export type GapAnalysisDepth = "quick" | "standard" | "deep"
export type GapAnalysisJurisdiction = "KE" | "RW" | "MW" | "NG"

type BuildGapAnalysisInputOptions = {
  fileName: string
  fileType: "pdf" | "docx" | "txt"
  fileContent: string
  regulatoryFrameworks: string[]
  benchmarkDocumentIds: string[]
  analysisDepth: GapAnalysisDepth
  focusAreas: string[]
  jurisdiction?: GapAnalysisJurisdiction
  processingConsentAcknowledged?: boolean
  consentVersion?: string
}

export function buildGapAnalysisInput({
  fileName,
  fileType,
  fileContent,
  regulatoryFrameworks,
  benchmarkDocumentIds,
  analysisDepth,
  focusAreas,
  jurisdiction,
  processingConsentAcknowledged = false,
  consentVersion,
}: BuildGapAnalysisInputOptions) {
  return {
    fileName,
    fileType,
    fileContent,
    regulatoryFrameworks,
    benchmarkDocumentIds: benchmarkDocumentIds.length > 0 ? benchmarkDocumentIds : undefined,
    analysisDepth,
    focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
    jurisdiction: jurisdiction || undefined,
    processingConsentAcknowledged,
    consentVersion: consentVersion || undefined,
  }
}
