export type GapAnalysisDepth = "quick" | "standard" | "deep"

type BuildGapAnalysisInputOptions = {
  fileName: string
  fileType: "pdf" | "docx" | "doc" | "txt"
  fileContent: string
  regulatoryFrameworks: string[]
  benchmarkDocumentIds: string[]
  analysisDepth: GapAnalysisDepth
  focusAreas: string[]
}

export function buildGapAnalysisInput({
  fileName,
  fileType,
  fileContent,
  regulatoryFrameworks,
  benchmarkDocumentIds,
  analysisDepth,
  focusAreas,
}: BuildGapAnalysisInputOptions) {
  return {
    fileName,
    fileType,
    fileContent,
    regulatoryFrameworks,
    benchmarkDocumentIds: benchmarkDocumentIds.length > 0 ? benchmarkDocumentIds : undefined,
    analysisDepth,
    focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
  }
}
