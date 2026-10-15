import type { GapAnalysisDepth } from "./gap-analysis-input"

export type GapAnalysisFileContract = {
  extension: "pdf" | "docx" | "txt"
  label: string
  mimeTypes: readonly string[]
}

export type GapAnalysisUploadContract = {
  maxFileSizeBytes: number
  allowedFileTypes: readonly GapAnalysisFileContract[]
}

export type GapAnalysisDepthAvailability = Readonly<Record<GapAnalysisDepth, boolean>>

export type GapAnalysisDepthAvailabilityContract = {
  default: GapAnalysisDepthAvailability
  frameworks: Readonly<Record<string, GapAnalysisDepthAvailability>>
}

export function getAvailableGapAnalysisDepths(
  planDepths: readonly GapAnalysisDepth[],
  availability: GapAnalysisDepthAvailabilityContract | undefined,
  jurisdiction: string,
  frameworkSlugs: readonly string[],
): GapAnalysisDepth[] {
  if (!availability) return [...planDepths]
  return planDepths.filter((depth) => {
    if (frameworkSlugs.length === 0) return availability.default[depth]
    return frameworkSlugs.every((slug) =>
      (availability.frameworks[`${jurisdiction.toUpperCase()}/${slug.toLowerCase().replaceAll("_", "-")}`]
        ?? availability.default)[depth],
    )
  })
}

export function selectGapAnalysisDepth(
  current: GapAnalysisDepth | null,
  allowedDepths: readonly GapAnalysisDepth[],
): GapAnalysisDepth | null {
  if (current && allowedDepths.includes(current)) return current
  if (allowedDepths.includes("standard")) return "standard"
  if (allowedDepths.includes("quick")) return "quick"
  if (allowedDepths.includes("deep")) return "deep"
  return null
}

export function validateGapAnalysisFile(
  file: Pick<File, "name" | "size" | "type">,
  contract: GapAnalysisUploadContract,
): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  const configuredType = contract.allowedFileTypes.find((type) => type.extension === extension)

  if (!configuredType || (file.type !== "" && !configuredType.mimeTypes.includes(file.type))) {
    const labels = contract.allowedFileTypes.map((type) => type.label).join(", ")
    return `Upload a ${labels} file.`
  }

  if (file.size === 0) {
    return "The uploaded file is empty. Please select a valid, non-empty policy document."
  }

  if (file.size > contract.maxFileSizeBytes) {
    return `Maximum file size is ${formatGapAnalysisFileSize(contract.maxFileSizeBytes)}.`
  }

  return null
}

export function formatGapAnalysisFileSize(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)} MB`
}

export function gapAnalysisAcceptValue(types: readonly GapAnalysisFileContract[]): string {
  return types.flatMap((type) => [`.${type.extension}`, ...type.mimeTypes]).join(",")
}

export function gapAnalysisFileHelperText(contract: GapAnalysisUploadContract): string {
  const labels = contract.allowedFileTypes.map((type) => type.label).join(", ")
  return `${labels} • Maximum ${formatGapAnalysisFileSize(contract.maxFileSizeBytes)}`
}
