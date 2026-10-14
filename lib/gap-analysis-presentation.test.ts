import { describe, expect, it } from "vitest"
import {
  filterGapAnalysisFrameworks,
  formatGapAnalysisDepth,
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

  it("lists every missing pre-run requirement including jurisdiction validation", () => {
    expect(getGapAnalysisRunRequirements({
      hasDocument: false,
      frameworkCount: 0,
      hasAllowedDepth: false,
      acknowledgementAccepted: false,
      jurisdictionValidated: false,
    })).toEqual([
      "Upload a policy document",
      "Select at least one framework",
      "Select an allowed analysis method",
      "Accept the processing acknowledgement",
      "Select a pilot-validated jurisdiction (Kenya)",
    ])
  })

  it("validates pilot jurisdictions and surfaces notice for in-progress corpora", () => {
    expect(isPilotJurisdictionValidated("KE")).toBe(true)
    expect(isPilotJurisdictionValidated("RW")).toBe(false)
    expect(isPilotJurisdictionValidated("MW")).toBe(false)
    expect(isPilotJurisdictionValidated("NG")).toBe(false)

    expect(getPilotJurisdictionNotice("KE")).toBeNull()
    expect(getPilotJurisdictionNotice("RW")).toContain("Corpus validation in progress")
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
