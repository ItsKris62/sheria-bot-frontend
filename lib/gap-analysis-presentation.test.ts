import { describe, expect, it } from "vitest"
import {
  filterGapAnalysisFrameworks,
  formatGapAnalysisDepth,
  getComplianceAlignmentPresentation,
  getGapAnalysisRunRequirements,
  getPilotJurisdictionNotice,
  groupGapAnalysisFrameworks,
  isPilotJurisdictionValidated,
  safeGapAnalysisFailureMessage,
  GAP_ANALYSIS_STATUS_LABELS,
} from "./gap-analysis-presentation"

const frameworks = [
  { slug: "dpa", name: "Data Protection Act", category: "Privacy", description: "ODPC requirements", scope: "DOMESTIC" },
  { slug: "iso", name: "ISO 27001", category: "Security", description: "Information security", scope: "INTERNATIONAL" },
]

describe("Gap Analysis presentation contract", () => {
  it("searches only visible framework metadata", () => {
    expect(filterGapAnalysisFrameworks(frameworks, "odpc").map((item) => item.slug)).toEqual(["dpa"])
    expect(filterGapAnalysisFrameworks(frameworks, "security").map((item) => item.slug)).toEqual(["iso"])
    expect(filterGapAnalysisFrameworks(frameworks, "payments")).toEqual([])
  })

  it("groups domestic and international frameworks", () => {
    expect(groupGapAnalysisFrameworks(frameworks).map(([label]) => label)).toEqual([
      "Domestic regulation",
      "International / cross-border standards",
    ])
  })

  it("lists every missing pre-run requirement including jurisdiction and framework pilot readiness", () => {
    expect(getGapAnalysisRunRequirements({
      hasDocument: false,
      frameworkCount: 0,
      hasAllowedDepth: false,
      acknowledgementAccepted: false,
      jurisdictionPilotEnabled: false,
      frameworksPilotEnabled: false,
    })).toEqual([
      "Upload a policy document",
      "Select at least one framework",
      "Select an allowed analysis method",
      "Accept the processing acknowledgement",
      "Select a pilot-enabled jurisdiction",
      "Selected frameworks must be pilot-enabled",
    ])
  })

  it("evaluates release-driven pilot jurisdiction availability without client hardcoding", () => {
    // Unconfigured baseline: no jurisdiction is automatically assumed validated
    expect(isPilotJurisdictionValidated("KE")).toBe(false)
    expect(isPilotJurisdictionValidated("RW")).toBe(false)
    expect(getPilotJurisdictionNotice("KE")).toContain("Corpus validation in progress")
    expect(getPilotJurisdictionNotice("RW")).toContain("Corpus validation in progress")

    // Release-configured partial pilot availability
    const partialKE = { jurisdiction: "KE", pilotEnabled: true, readiness: "INDEXED_PARTIAL" as const }
    expect(isPilotJurisdictionValidated("KE", partialKE)).toBe(false)
    expect(getPilotJurisdictionNotice("KE", partialKE)).toContain("partial coverage")

    // Release-configured fully validated pilot availability
    const validatedKE = { jurisdiction: "KE", pilotEnabled: true, readiness: "VALIDATED_FOR_GAP_ANALYSIS" as const }
    expect(isPilotJurisdictionValidated("KE", validatedKE)).toBe(true)
    expect(getPilotJurisdictionNotice("KE", validatedKE)).toBeNull()
  })

  it("maps failure classes truthfully without internal leaks", () => {
    expect(formatGapAnalysisDepth("standard")).toBe("Standard Analysis")
    expect(formatGapAnalysisDepth(null)).toBe("Legacy execution profile")
    expect(safeGapAnalysisFailureMessage("provider timeout: secret upstream")).not.toContain("secret")

    // SOURCE_INSUFFICIENCY
    const srcInsuffMsg = safeGapAnalysisFailureMessage(null, "SOURCE_INSUFFICIENCY")
    expect(srcInsuffMsg).toContain("SheriaBot could not find sufficient authoritative regulatory evidence")

    // OCR_REQUIRED
    const ocrMsg = safeGapAnalysisFailureMessage("Scanned document requires OCR", "OCR_REQUIRED")
    expect(ocrMsg).toBe("OCR is not currently supported. Please upload a text-based PDF, DOCX, or TXT document.")

    // MALWARE
    const malwareMsg = safeGapAnalysisFailureMessage(null, "MALWARE")
    expect(malwareMsg).toContain("did not pass security inspection")

    // TIMEOUT
    const timeoutMsg = safeGapAnalysisFailureMessage(null, "TIMEOUT")
    expect(timeoutMsg).toContain("timed out before completion")
  })

  it("does not classify an unassessed v2 result as critical risk", () => {
    expect(getComplianceAlignmentPresentation({
      score: 0,
      evidenceBacked: true,
      coverageStatus: "PARTIAL",
      assessedRequirementCount: 0,
    })).toEqual({ available: false, label: "Not assessed" })

    expect(getComplianceAlignmentPresentation({
      score: 0,
      evidenceBacked: true,
      coverageStatus: "INSUFFICIENT",
      assessedRequirementCount: 3,
    })).toEqual({ available: false, label: "Not assessed" })

    expect(getComplianceAlignmentPresentation({
      score: 0,
      evidenceBacked: true,
      coverageStatus: "PARTIAL",
      assessedRequirementCount: 2,
    })).toEqual({ available: true, label: "Critical Risk" })
  })

  it("defines user-friendly labels for all 10 canonical backend statuses", () => {
    const statuses = [
      "UPLOADING", "QUEUED", "RUNNING", "ANALYZING", "RETRYING",
      "EXTRACTING", "VERIFYING", "COMPLETING", "COMPLETED", "FAILED",
      "CANCELLED", "DEAD_LETTERED"
    ]
    for (const status of statuses) {
      expect(GAP_ANALYSIS_STATUS_LABELS[status]).toBeDefined()
      expect(GAP_ANALYSIS_STATUS_LABELS[status].label).toBeTruthy()
      expect(GAP_ANALYSIS_STATUS_LABELS[status].description).toBeTruthy()
    }
  })
})
