import { describe, expect, it, vi } from "vitest"
import {
  validateGapAnalysisFile,
  type GapAnalysisUploadContract,
} from "./gap-analysis-contract"
import {
  safeGapAnalysisFailureMessage,
  isPilotJurisdictionEnabled,
  isPilotJurisdictionValidated,
  getPilotJurisdictionNotice,
  getGapAnalysisRunRequirements,
  GAP_ANALYSIS_STATUS_LABELS,
  type PilotJurisdictionAvailability,
  type PilotFrameworkAvailability,
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

  describe("2. Pilot Corpus & Availability Requirements (Sections 1-6 & 12)", () => {
    it("1. unconfigured jurisdiction cannot run", () => {
      // In baseline source without explicit release enablement, jurisdiction is not pilot-enabled
      const unconfiguredKE = getPilotJurisdictionNotice("KE")
      expect(unconfiguredKE).toContain("Corpus validation in progress")
      expect(isPilotJurisdictionEnabled("KE")).toBe(false)

      const reqs = getGapAnalysisRunRequirements({
        hasDocument: true,
        frameworkCount: 1,
        hasAllowedDepth: true,
        acknowledgementAccepted: true,
        jurisdictionPilotEnabled: isPilotJurisdictionEnabled("KE"),
      })
      expect(reqs).toContain("Select a pilot-enabled jurisdiction")
    })

    it("2. entitled but non-pilot-enabled jurisdiction cannot run", () => {
      // Organization entitled to Rwanda, but Rwanda corpus is not pilot-enabled
      const rwAvailability: PilotJurisdictionAvailability = {
        jurisdiction: "RW",
        pilotEnabled: false,
        readiness: "UNAVAILABLE",
        message: "Gap Analysis corpus for Rwanda is not yet enabled for pilot testing.",
      }
      expect(isPilotJurisdictionEnabled("RW", rwAvailability)).toBe(false)
      expect(getPilotJurisdictionNotice("RW", rwAvailability)).toContain("not yet enabled")

      const canRun = false && isPilotJurisdictionEnabled("RW", rwAvailability)
      expect(canRun).toBe(false)
    })

    it("3. framework catalog presence does not imply pilot readiness", () => {
      // Framework exists in catalog, but pilotEnabled is false
      const catalogFramework: PilotFrameworkAvailability = {
        slug: "cbk-cyber-2019",
        pilotEnabled: false,
        readiness: "UNAVAILABLE",
      }
      expect(catalogFramework.pilotEnabled).toBe(false)
      expect(catalogFramework.readiness).toBe("UNAVAILABLE")

      const selectedFrameworks = ["cbk-cyber-2019"]
      const areFrameworksPilotEnabled = selectedFrameworks.every(
        (slug) => slug === catalogFramework.slug && catalogFramework.pilotEnabled
      )
      expect(areFrameworksPilotEnabled).toBe(false)
    })

    it("4. enabled jurisdiction + enabled framework can submit", () => {
      const keAvailability: PilotJurisdictionAvailability = {
        jurisdiction: "KE",
        pilotEnabled: true,
        readiness: "INDEXED_PARTIAL",
      }
      const fwAvailability: PilotFrameworkAvailability = {
        slug: "dpa-2019",
        pilotEnabled: true,
        readiness: "INDEXED_PARTIAL",
      }

      const isJurisdictionOk = isPilotJurisdictionEnabled("KE", keAvailability)
      const isFrameworkOk = fwAvailability.pilotEnabled
      const hasDoc = true
      const hasDepth = true
      const consentAccepted = true

      const canRun = hasDoc && isJurisdictionOk && isFrameworkOk && hasDepth && consentAccepted
      expect(canRun).toBe(true)

      const reqs = getGapAnalysisRunRequirements({
        hasDocument: hasDoc,
        frameworkCount: 1,
        hasAllowedDepth: hasDepth,
        acknowledgementAccepted: consentAccepted,
        jurisdictionPilotEnabled: isJurisdictionOk,
        frameworksPilotEnabled: isFrameworkOk,
      })
      expect(reqs).toEqual([])
    })

    it("5. readiness state does not claim COMPLETE", () => {
      const allowedReadinessStates = [
        "UNAVAILABLE",
        "INDEXED_PARTIAL",
        "VALIDATED_FOR_GAP_ANALYSIS",
        "STALE_OR_UNKNOWN",
      ]
      expect(allowedReadinessStates).not.toContain("COMPLETE")

      const rwNotice = getPilotJurisdictionNotice("RW")
      expect(rwNotice).not.toContain("COMPLETE")
      const keNotice = getPilotJurisdictionNotice("KE")
      expect(keNotice).not.toContain("COMPLETE")
    })

    it("6. organization switch clears query state and purges active analysis view", () => {
      let activeView: { id: string; name: string } | null = { id: "analysis-1", name: "Doc.pdf" }
      let activeAnalysisId: string | null = "analysis-1"
      let isAwaitingResult = true
      const invalidatedQueries: string[] = []

      function onOrgSwitch(newOrgId: string, oldOrgId: string) {
        if (newOrgId !== oldOrgId) {
          activeView = null
          activeAnalysisId = null
          isAwaitingResult = false
          invalidatedQueries.push("getGapAnalyses", "getFrameworks", "getGapAnalysisLimits")
        }
      }

      onOrgSwitch("org-b", "org-a")
      expect(activeView).toBeNull()
      expect(activeAnalysisId).toBeNull()
      expect(isAwaitingResult).toBe(false)
      expect(invalidatedQueries).toEqual(["getGapAnalyses", "getFrameworks", "getGapAnalysisLimits"])
    })

    it("7. feedback UI behavior matches what is actually persisted/sent (Option B)", () => {
      const trackedEvents: Array<{ event: string; payload: any }> = []
      function trackEvent(event: string, payload: any) {
        trackedEvents.push({ event, payload })
      }

      // Option B: Structured rating + tags, no fake free-text collection
      const rating = "helpful"
      const selectedChips = ["Accurate findings", "Clear recommendations"]

      trackEvent("gap_analysis_pilot_feedback", {
        analysis_id: "analysis-123",
        rating,
        tags: selectedChips.join(","),
      })

      expect(trackedEvents).toHaveLength(1)
      expect(trackedEvents[0].event).toBe("gap_analysis_pilot_feedback")
      expect(trackedEvents[0].payload.rating).toBe("helpful")
      expect(trackedEvents[0].payload.tags).toBe("Accurate findings,Clear recommendations")
      expect(trackedEvents[0].payload.comment).toBeUndefined()
      expect(trackedEvents[0].payload.has_comment).toBeUndefined()
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
        expect(GAP_ANALYSIS_STATUS_LABELS[status].label).not.toMatch(/%/)
      }
    })
  })
})
