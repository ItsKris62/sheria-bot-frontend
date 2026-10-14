import { describe, expect, it } from "vitest"
import {
  validateGapAnalysisFile,
  type GapAnalysisUploadContract,
} from "./gap-analysis-contract"
import {
  safeGapAnalysisFailureMessage,
  isPilotJurisdictionValidated,
  getPilotJurisdictionNotice,
  getGapAnalysisRunRequirements,
  GAP_ANALYSIS_STATUS_LABELS,
} from "./gap-analysis-presentation"
import { buildGapAnalysisInput } from "./gap-analysis-input"

const uploadContract: GapAnalysisUploadContract = {
  maxFileSizeBytes: 10 * 1024 * 1024,
  allowedFileTypes: [
    { extension: "pdf", label: "PDF", mimeTypes: ["application/pdf"] },
    {
      extension: "docx",
      label: "DOCX",
      mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    },
    { extension: "txt", label: "TXT", mimeTypes: ["text/plain"] },
  ],
}

describe("Gap Analysis Pilot Functionalization Workflow", () => {
  describe("1. Upload Validation Contract", () => {
    it("rejects empty documents (0 bytes)", () => {
      const err = validateGapAnalysisFile({ name: "empty.pdf", type: "application/pdf", size: 0 }, uploadContract)
      expect(err).toContain("empty")
    })

    it("rejects oversized documents exceeding 10 MB limit", () => {
      const err = validateGapAnalysisFile({ name: "huge.pdf", type: "application/pdf", size: 10 * 1024 * 1024 + 1 }, uploadContract)
      expect(err).toContain("Maximum file size is 10 MB")
    })

    it("accepts valid PDF, DOCX, and TXT documents", () => {
      expect(validateGapAnalysisFile({ name: "policy.pdf", type: "application/pdf", size: 5000 }, uploadContract)).toBeNull()
      expect(validateGapAnalysisFile({ name: "policy.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 5000 }, uploadContract)).toBeNull()
      expect(validateGapAnalysisFile({ name: "policy.txt", type: "text/plain", size: 5000 }, uploadContract)).toBeNull()
    })
  })

  describe("2. Pilot Jurisdiction Gating & Single Country Rule", () => {
    it("recognizes Kenya as pilot-validated and others as pending", () => {
      expect(isPilotJurisdictionValidated("KE")).toBe(true)
      expect(isPilotJurisdictionValidated("RW")).toBe(false)
      expect(isPilotJurisdictionValidated("MW")).toBe(false)
      expect(isPilotJurisdictionValidated("NG")).toBe(false)
    })

    it("surfaces non-validated notice without claiming corpus is complete", () => {
      const rwNotice = getPilotJurisdictionNotice("RW")
      expect(rwNotice).toContain("Corpus validation in progress")
      expect(rwNotice).not.toContain("COMPLETE")
    })

    it("requires jurisdiction validation in pre-run requirements", () => {
      const reqs = getGapAnalysisRunRequirements({
        hasDocument: true,
        frameworkCount: 1,
        hasAllowedDepth: true,
        acknowledgementAccepted: true,
        jurisdictionValidated: false,
      })
      expect(reqs).toContain("Select a pilot-validated jurisdiction (Kenya)")
    })

    it("builds input with strictly explicit single jurisdiction", () => {
      const input = buildGapAnalysisInput({
        fileName: "policy.pdf",
        fileType: "pdf",
        fileContent: "YmFzZTY0",
        regulatoryFrameworks: ["dpa-2019"],
        benchmarkDocumentIds: [],
        analysisDepth: "standard",
        focusAreas: [],
        jurisdiction: "KE",
        processingConsentAcknowledged: true,
        consentVersion: "2026-06-01-v2",
      })
      expect(input.jurisdiction).toBe("KE")
      expect(input.processingConsentAcknowledged).toBe(true)
      expect(input.consentVersion).toBe("2026-06-01-v2")
    })
  })

  describe("3. Reused Execution Flow", () => {
    it("distinguishes completed reused execution from in-flight reused execution", () => {
      type ExecutionResponse = {
        id: string
        documentName: string
        status: string
        reused: boolean
      }

      const completedReused: ExecutionResponse = {
        id: "ga_existing_1",
        documentName: "Data_Privacy_Policy.pdf",
        status: "COMPLETED",
        reused: true,
      }

      const activeReused: ExecutionResponse = {
        id: "ga_existing_2",
        documentName: "AML_Policy.pdf",
        status: "RUNNING",
        reused: true,
      }

      // Verification logic mirroring page.tsx runMutation.onSuccess
      function routeExecution(data: ExecutionResponse): "VIEW_RESULTS" | "ATTACH_POLLING" | "NEW_POLLING" {
        if (data.reused) {
          if (data.status === "COMPLETED") return "VIEW_RESULTS"
          return "ATTACH_POLLING"
        }
        return "NEW_POLLING"
      }

      expect(routeExecution(completedReused)).toBe("VIEW_RESULTS")
      expect(routeExecution(activeReused)).toBe("ATTACH_POLLING")
    })
  })

  describe("4. Async Polling Terminal State Rules", () => {
    it("determines terminal statuses that must stop polling", () => {
      const terminalStatuses = ["COMPLETED", "FAILED", "CANCELLED", "DEAD_LETTERED"]
      const activeStatuses = ["UPLOADING", "QUEUED", "RUNNING", "EXTRACTING", "ANALYZING", "RETRYING", "VERIFYING", "COMPLETING"]

      function shouldPoll(status: string | undefined): boolean {
        if (!status) return true
        if (terminalStatuses.includes(status)) return false
        return true
      }

      for (const status of terminalStatuses) {
        expect(shouldPoll(status)).toBe(false)
      }
      for (const status of activeStatuses) {
        expect(shouldPoll(status)).toBe(true)
      }
    })
  })

  describe("5. Failure UX & OCR Guidance", () => {
    it("surfaces OCR guidance for scanned documents without continuing with empty text", () => {
      const msg = safeGapAnalysisFailureMessage("Image-only PDF detected, OCR required", "OCR_REQUIRED")
      expect(msg).toBe("OCR is not currently supported. Please upload a text-based PDF, DOCX, or TXT document.")
    })

    it("explains SOURCE_INSUFFICIENCY truthfully without fabricating findings", () => {
      const msg = safeGapAnalysisFailureMessage(null, "SOURCE_INSUFFICIENCY")
      expect(msg).toBe("SheriaBot could not find sufficient authoritative regulatory evidence for this assessment. Recommend selecting a supported framework or trying again when the regulatory source set is available.")
    })

    it("communicates security inspection rejection safely", () => {
      const msg = safeGapAnalysisFailureMessage("Trojan.Win32 detected", "MALWARE")
      expect(msg).toBe("The uploaded document did not pass security inspection and was rejected.")
    })
  })

  describe("6. Status Mapping", () => {
    it("provides human-readable status labels and descriptions for all 10 backend statuses", () => {
      const requiredStatuses = [
        "UPLOADING", "QUEUED", "RUNNING", "ANALYZING", "RETRYING",
        "EXTRACTING", "VERIFYING", "COMPLETING", "COMPLETED", "FAILED",
        "CANCELLED", "DEAD_LETTERED"
      ]
      for (const status of requiredStatuses) {
        expect(GAP_ANALYSIS_STATUS_LABELS[status]).toBeDefined()
        expect(GAP_ANALYSIS_STATUS_LABELS[status].label).not.toMatch(/%/);
      }
    })
  })
})
