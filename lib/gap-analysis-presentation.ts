export type FrameworkPresentation = {
  slug: string
  name: string
  category: string
  description?: string | null
  scope?: string
  locked?: boolean
  tier?: string
}

export const PILOT_VALIDATED_JURISDICTIONS: readonly string[] = ["KE"] as const

export function isPilotJurisdictionValidated(jurisdiction: string): boolean {
  return PILOT_VALIDATED_JURISDICTIONS.includes(jurisdiction)
}

export function getPilotJurisdictionNotice(jurisdiction: string): string | null {
  if (isPilotJurisdictionValidated(jurisdiction)) return null
  return "Corpus validation in progress. Regulatory sources for this jurisdiction are undergoing validation. Gap Analysis is currently enabled for Kenya (KE) during the pilot phase."
}

export function filterGapAnalysisFrameworks<T extends FrameworkPresentation>(
  frameworks: readonly T[],
  query: string,
): T[] {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return [...frameworks]

  return frameworks.filter((framework) =>
    [framework.name, framework.category, framework.description ?? ""]
      .some((value) => value.toLocaleLowerCase().includes(normalized)),
  )
}

export function groupGapAnalysisFrameworks<T extends FrameworkPresentation>(frameworks: readonly T[]) {
  return Object.entries(frameworks.reduce<Record<string, T[]>>((groups, framework) => {
    const group = framework.scope === "INTERNATIONAL"
      ? "International / cross-border standards"
      : "Domestic regulation"
    ;(groups[group] ??= []).push(framework)
    return groups
  }, {}))
}

export function getGapAnalysisRunRequirements(input: {
  hasDocument: boolean
  frameworkCount: number
  hasAllowedDepth: boolean
  acknowledgementAccepted: boolean
  jurisdictionValidated?: boolean
}): string[] {
  const requirements: string[] = []
  if (!input.hasDocument) requirements.push("Upload a policy document")
  if (input.frameworkCount === 0) requirements.push("Select at least one framework")
  if (!input.hasAllowedDepth) requirements.push("Select an allowed analysis method")
  if (!input.acknowledgementAccepted) requirements.push("Accept the processing acknowledgement")
  if (input.jurisdictionValidated === false) requirements.push("Select a pilot-validated jurisdiction (Kenya)")
  return requirements
}

export function formatGapAnalysisDepth(depth: string | null | undefined): string {
  if (depth === "quick") return "Quick Scan"
  if (depth === "deep") return "Deep Analysis"
  if (depth === "standard") return "Standard Analysis"
  return "Legacy execution profile"
}

export type GapAnalysisFailureClass =
  | "VALIDATION"
  | "ENTITLEMENT"
  | "MALWARE"
  | "SOURCE_INSUFFICIENCY"
  | "RAG_SERVICE"
  | "AI_PROVIDER"
  | "TIMEOUT"
  | "CANCELLED"
  | "STORAGE"
  | "DATABASE"
  | "INTERNAL"
  | "OCR_REQUIRED"

export function safeGapAnalysisFailureMessage(
  message: string | null | undefined,
  failureClass?: GapAnalysisFailureClass | string | null,
): string {
  if (!message && !failureClass) {
    return "The analysis could not be completed. Review the configuration and try again."
  }
  const normalized = (message ?? "").toLocaleLowerCase()
  const normalizedClass = (failureClass ?? "").toUpperCase()

  // OCR / Scanned image detection
  if (
    normalizedClass === "OCR_REQUIRED" ||
    normalized.includes("ocr") ||
    normalized.includes("scanned") ||
    normalized.includes("image-only")
  ) {
    return "OCR is not currently supported. Please upload a text-based PDF, DOCX, or TXT document."
  }

  // Source insufficiency
  if (
    normalizedClass === "SOURCE_INSUFFICIENCY" ||
    normalized.includes("insufficient") ||
    normalized.includes("source insufficiency") ||
    normalized.includes("insufficient authoritative")
  ) {
    return "SheriaBot could not find sufficient authoritative regulatory evidence for this assessment. Recommend selecting a supported framework or trying again when the regulatory source set is available."
  }

  // Malware detection
  if (
    normalizedClass === "MALWARE" ||
    normalized.includes("malware") ||
    normalized.includes("virus") ||
    normalized.includes("trojan")
  ) {
    return "The uploaded document did not pass security inspection and was rejected."
  }

  // Cancellation
  if (normalizedClass === "CANCELLED" || normalized.includes("cancel")) {
    return "The analysis was cancelled before completion."
  }

  // Timeout
  if (normalizedClass === "TIMEOUT" || normalized.includes("timeout") || normalized.includes("timed out")) {
    return "The analysis timed out before completion. Recommend selecting Quick or Standard depth and trying again."
  }

  // Entitlement / Quota / Permission
  if (
    normalizedClass === "ENTITLEMENT" ||
    normalized.includes("entitlement") ||
    normalized.includes("forbidden") ||
    normalized.includes("quota") ||
    normalized.includes("plan")
  ) {
    return "Your organization plan or pilot allocation does not permit this action."
  }

  // Validation
  if (normalizedClass === "VALIDATION" || normalized.includes("validation") || normalized.includes("invalid")) {
    return "Document validation failed. Ensure the document is a supported, non-empty PDF, DOCX, or TXT file."
  }

  // General service availability (AI provider / RAG service)
  if (
    normalizedClass === "RAG_SERVICE" ||
    normalizedClass === "AI_PROVIDER" ||
    normalized.includes("provider") ||
    normalized.includes("unavailable") ||
    normalized.includes("service")
  ) {
    return "The regulatory analysis service was temporarily unavailable. Try again shortly."
  }

  // Storage / Database
  if (normalizedClass === "STORAGE" || normalizedClass === "DATABASE") {
    return "A storage or database error occurred while processing the analysis. Try again shortly."
  }

  // Evidence fallback
  if (normalized.includes("evidence") || normalized.includes("source")) {
    return "The analysis could not find enough regulatory evidence to complete this review."
  }

  return "The analysis could not be completed. Try again or contact support with the report ID."
}

export const GAP_ANALYSIS_STATUS_LABELS: Record<string, { label: string; description: string }> = {
  UPLOADING:     { label: "Uploading document",            description: "Validating and securely scanning the policy document." },
  QUEUED:        { label: "Preparing analysis",            description: "The analysis is queued and will start shortly." },
  RUNNING:       { label: "Analyzing policy",              description: "Reviewing policy provisions against applicable criteria." },
  EXTRACTING:    { label: "Reviewing policy",               description: "Extracting sections and obligations from the policy document." },
  ANALYZING:     { label: "Retrieving regulatory evidence", description: "Reviewing the policy against applicable regulatory evidence." },
  RETRYING:      { label: "Retrying analysis stage",       description: "Re-attempting an analysis stage with resilient retry." },
  VERIFYING:     { label: "Verifying findings",             description: "Checking finding claims against the retrieved evidence." },
  COMPLETING:    { label: "Finalizing results",            description: "Compiling the defensible compliance alignment record." },
  COMPLETED:     { label: "Analysis complete",             description: "Your gap analysis is ready to view." },
  FAILED:        { label: "Analysis failed",               description: "An error occurred during analysis." },
  CANCELLED:     { label: "Analysis cancelled",            description: "The analysis was cancelled." },
  DEAD_LETTERED: { label: "Analysis halted",               description: "Execution exhausted retry attempts and was stopped." },
}
