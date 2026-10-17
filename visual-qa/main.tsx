import React from "react"
import { createRoot } from "react-dom/client"
import "../test-results/gap-analysis-visual/tailwind.css"
import GapAnalysisPage, { AnalysisHistoryItem, AnalysisProgressView, AnalysisResultsView, FileUploadSection } from "@/app/(dashboard)/startup/gap-analysis/page"

const fixture = new URLSearchParams(location.search).get("fixture") ?? "form"
const noop = () => undefined
const longName = "enterprise-policy-with-an-extremely-long-filename-that-must-truncate-without-causing-horizontal-overflow-on-mobile.pdf"

function Harness() {
  if (fixture === "upload-long") return <div className="mx-auto max-w-4xl p-4"><FileUploadSection file={new File(["fixture"], longName, { type: "application/pdf" })} onFile={noop} onRemove={noop} uploadContract={{ maxFileSizeBytes: 10_485_760, allowedFileTypes: [{ extension: "pdf", label: "PDF", mimeTypes: ["application/pdf"] }] }} /></div>
  if (fixture.startsWith("progress-")) {
    const status = fixture.slice("progress-".length).toUpperCase()
    return <div className="mx-auto max-w-5xl p-4"><AnalysisProgressView documentName={longName} frameworks={["Kenya Data Protection Act 2019 with a deliberately long framework title", "Cross-Border Transfer Controls"]} status={status} errorMessage={status === "FAILED" ? "The provider could not complete this request. Retry when service is restored." : null} failureClass={status === "FAILED" ? "PROVIDER_ERROR" : null} jurisdictionCode="KE" startedAt={null} analysisDepth="standard" onBack={noop} onRetry={noop} /></div>
  }
  if (fixture === "history") return <div className="mx-auto max-w-5xl space-y-3 p-4">{["QUEUED", "RUNNING", "RETRYING", "CANCELLED", "FAILED", "COMPLETED"].map((status, index) => <AnalysisHistoryItem key={status} analysis={{ id: status, documentName: index === 5 ? longName : `${status.toLowerCase()}-policy.pdf`, documentType: "pdf", overallScore: status === "COMPLETED" ? 68 : null, status, analysisDepth: index % 2 ? "standard" : "quick", createdAt: "2026-10-17T08:00:00.000Z", progress: status === "RUNNING" ? 45 : undefined, jurisdictionCode: "KE", regulatoryFrameworks: ["dpa-2019"], results: status === "COMPLETED" ? { scoringVersion: "v2.0-evidence-backed", complianceAlignmentScore: 68, metadata: { coverageStatus: "PARTIAL", frameworkCoverage: { ke: { assessedRequirementCount: 8 } } } } : undefined, errorMessage: status === "FAILED" ? "Provider request failed" : null }} onView={noop} onDelete={noop} />)}</div>
  if (fixture === "results" || fixture === "results-gaps") return <div className="mx-auto max-w-6xl p-4"><AnalysisResultsView analysisId="analysis-complete" documentName={longName} onBack={noop} /></div>
  return <div className="mx-auto max-w-7xl p-4"><GapAnalysisPage /></div>
}

createRoot(document.getElementById("root")!).render(<Harness />)
