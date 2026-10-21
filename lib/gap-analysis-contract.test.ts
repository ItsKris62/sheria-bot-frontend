import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  getAvailableGapAnalysisDepths,
  gapAnalysisAcceptValue,
  gapAnalysisFileHelperText,
  selectGapAnalysisDepth,
  validateGapAnalysisFile,
  type GapAnalysisUploadContract,
} from "./gap-analysis-contract"

const contract: GapAnalysisUploadContract = {
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

describe("Gap Analysis frontend contract", () => {
  it("uses the generated status-polling procedure without an unsafe compatibility cast", () => {
    const pageSource = readFileSync(
      resolve(process.cwd(), "app/(dashboard)/startup/gap-analysis/page.tsx"),
      "utf8",
    )
    const apiSource = readFileSync(
      resolve(process.cwd(), "api-types/dist/server/routers/gap-analysis.router.d.ts"),
      "utf8",
    )

    expect(apiSource).toContain("getGapAnalysisStatus:")
    expect(pageSource).toContain("trpc.gapAnalysis.getGapAnalysisStatus.useQuery(")
    expect(pageSource).not.toContain("getGapAnalysisStatus: typeof trpc.gapAnalysis.getGapAnalysisResult")
  })

  it("selects Standard when permitted, otherwise Quick, otherwise no runnable depth", () => {
    expect(selectGapAnalysisDepth(null, ["quick", "standard"])).toBe("standard")
    expect(selectGapAnalysisDepth("standard", ["quick"])).toBe("quick")
    expect(selectGapAnalysisDepth("deep", [])).toBeNull()
  })

  it("preserves a currently selected depth while it remains authorized", () => {
    expect(selectGapAnalysisDepth("quick", ["quick", "standard"])).toBe("quick")
  })

  it("intersects plan entitlement with authoritative framework depth readiness", () => {
    const availability = {
      default: { quick: true, standard: true, deep: false },
      frameworks: {
        "KE/dpa-2019": { quick: true, standard: true, deep: false },
      },
    } as const

    expect(getAvailableGapAnalysisDepths(
      ["quick", "standard", "deep"],
      availability,
      "KE",
      ["dpa-2019"],
    )).toEqual(["quick", "standard"])
  })

  it.each([
    ["policy.pdf", "application/pdf"],
    ["policy.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ["policy.txt", "text/plain"],
    ["policy.txt", ""],
  ])("accepts the permitted extension/MIME pair %s / %s", (name, type) => {
    expect(validateGapAnalysisFile({ name, type, size: 1024 }, contract)).toBeNull()
  })

  it.each([
    ["policy.doc", "application/msword"],
    ["policy.exe", "application/pdf"],
    ["policy.pdf", "text/plain"],
  ])("rejects unsupported or mismatched extension/MIME pair %s / %s", (name, type) => {
    expect(validateGapAnalysisFile({ name, type, size: 1024 }, contract)).toContain("PDF, DOCX, TXT")
  })

  it("rejects empty files (0 bytes)", () => {
    expect(validateGapAnalysisFile({
      name: "policy.pdf",
      type: "application/pdf",
      size: 0,
    }, contract)).toContain("empty")
  })

  it("rejects files above the server-provided limit", () => {
    expect(validateGapAnalysisFile({
      name: "policy.pdf",
      type: "application/pdf",
      size: contract.maxFileSizeBytes + 1,
    }, contract)).toBe("Maximum file size is 10 MB.")
  })

  it("derives the input accept value and helper text from the same contract", () => {
    expect(gapAnalysisAcceptValue(contract.allowedFileTypes)).toContain(".txt,text/plain")
    expect(gapAnalysisFileHelperText(contract)).toBe("PDF, DOCX, TXT • Maximum 10 MB")
  })
})
