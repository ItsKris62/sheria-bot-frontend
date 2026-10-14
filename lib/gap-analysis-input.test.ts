import { describe, expect, it } from "vitest"
import { buildGapAnalysisInput } from "@/lib/gap-analysis-input"

describe("buildGapAnalysisInput", () => {
  it.each(["quick", "standard", "deep"] as const)("preserves the %s analysis depth value", (analysisDepth) => {
    const input = buildGapAnalysisInput({
      fileName: "policy.pdf",
      fileType: "pdf",
      fileContent: "cG9saWN5",
      regulatoryFrameworks: ["data-protection"],
      benchmarkDocumentIds: ["benchmark-1"],
      analysisDepth,
      focusAreas: ["Risk management"],
      jurisdiction: undefined,
      processingConsentAcknowledged: false,
      consentVersion: undefined,
    })

    expect(input).toEqual({
      fileName: "policy.pdf",
      fileType: "pdf",
      fileContent: "cG9saWN5",
      regulatoryFrameworks: ["data-protection"],
      benchmarkDocumentIds: ["benchmark-1"],
      analysisDepth,
      focusAreas: ["Risk management"],
      jurisdiction: undefined,
      processingConsentAcknowledged: false,
      consentVersion: undefined,
    })
    expect(input).not.toHaveProperty("industryBenchmarks")
  })

  it("omits optional benchmark documents and focus areas when none are selected", () => {
    expect(buildGapAnalysisInput({
      fileName: "policy.txt",
      fileType: "txt",
      fileContent: "cG9saWN5",
      regulatoryFrameworks: ["aml"],
      benchmarkDocumentIds: [],
      analysisDepth: "standard",
      focusAreas: [],
    })).toEqual({
      fileName: "policy.txt",
      fileType: "txt",
      fileContent: "cG9saWN5",
      regulatoryFrameworks: ["aml"],
      benchmarkDocumentIds: undefined,
      analysisDepth: "standard",
      focusAreas: undefined,
      jurisdiction: undefined,
      processingConsentAcknowledged: false,
      consentVersion: undefined,
    })
  })

  it("passes through jurisdiction when provided", () => {
    expect(buildGapAnalysisInput({
      fileName: "policy.pdf",
      fileType: "pdf",
      fileContent: "cG9saWN5",
      regulatoryFrameworks: ["aml"],
      benchmarkDocumentIds: [],
      analysisDepth: "standard",
      focusAreas: [],
      jurisdiction: "RW",
    })).toEqual({
      fileName: "policy.pdf",
      fileType: "pdf",
      fileContent: "cG9saWN5",
      regulatoryFrameworks: ["aml"],
      benchmarkDocumentIds: undefined,
      analysisDepth: "standard",
      focusAreas: undefined,
      jurisdiction: "RW",
      processingConsentAcknowledged: false,
      consentVersion: undefined,
    })
  })

  it("passes the server-provided version only as a stale-client check", () => {
    expect(buildGapAnalysisInput({
      fileName: "policy.txt",
      fileType: "txt",
      fileContent: "cG9saWN5",
      regulatoryFrameworks: ["aml"],
      benchmarkDocumentIds: [],
      analysisDepth: "standard",
      focusAreas: [],
      processingConsentAcknowledged: true,
      consentVersion: "2026-10-01",
    })).toEqual(expect.objectContaining({
      processingConsentAcknowledged: true,
      consentVersion: "2026-10-01",
    }))
  })
})
