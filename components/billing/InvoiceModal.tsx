"use client"

/**
 * InvoiceModal
 *
 * Professional invoice overlay for SheriaBot payments.
 * Opens when a user clicks a payment row in the history table.
 *
 * Data: fetched via trpc.payment.getDetail.useQuery({ paymentId })
 * PDF:  window.print() with @media print styles that isolate the invoice
 */

import { useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { X, Download, Printer } from "lucide-react"
import { toast } from "sonner"

// ── Local types (avoids tsc issues with @/ alias inference) ────────────────

interface InvoiceOrganization {
  name:         string
  address:      string | null
  contactEmail: string | null
}

interface InvoiceUser {
  email:    string
  fullName: string | null
}

interface InvoiceDetail {
  id:                    string
  invoiceNumber:         string | null
  amount:                number
  currency:              string
  status:                string
  provider:              string
  subscriptionPlan:      string | null
  billingPeriodStart:    string | null
  billingPeriodEnd:      string | null
  providerTransactionId: string | null
  description:           string | null
  paidAt:                string | null
  createdAt:             string
  paymentMethodDisplay:  string
  organization:          InvoiceOrganization
  user:                  InvoiceUser
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatKes(cents: number): string {
  const kes = cents / 100
  return `KES ${kes.toLocaleString("en-KE")}`
}

function formatDate(iso: string | null): string {
  if (!iso) return "--"
  return new Date(iso).toLocaleDateString("en-KE", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  })
}

function formatShortDate(iso: string | null): string {
  if (!iso) return "--"
  return new Date(iso).toLocaleDateString("en-KE", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  })
}

function statusBadgeStyle(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case "COMPLETED":
      return { bg: "#00875A", text: "#fff", label: "PAID" }
    case "PENDING":
      return { bg: "#D4A843", text: "#1A2B4A", label: "PENDING" }
    case "FAILED":
      return { bg: "#DC2626", text: "#fff", label: "FAILED" }
    case "REFUNDED":
      return { bg: "#4A5568", text: "#fff", label: "REFUNDED" }
    default:
      return { bg: "#4A5568", text: "#fff", label: status }
  }
}

function planDisplayName(plan: string | null): string {
  if (!plan) return "Subscription"
  return plan.charAt(0) + plan.slice(1).toLowerCase()
}

// ── Print trigger ──────────────────────────────────────────────────────────

function triggerPrint() {
  // A brief timeout lets the browser finish any paint before print dialog opens
  setTimeout(() => window.print(), 100)
}

// ── Invoice content (extracted so it can be used for both screen + print) ──

function InvoiceContent({ data }: { data: InvoiceDetail }) {
  const badge     = statusBadgeStyle(data.status)
  const planLabel = planDisplayName(data.subscriptionPlan)
  const amount    = formatKes(data.amount)
  // VAT is not currently configured -- show subtotal = total
  // TODO: Add VAT calculation when tax requirements are confirmed (Kenya 16% VAT)

  return (
    <div
      id="sheriabot-invoice"
      style={{
        fontFamily:      "system-ui, -apple-system, sans-serif",
        backgroundColor: "#F7F8FA",
        padding:         "48px",
        maxWidth:        "760px",
        margin:          "0 auto",
        color:           "#1A2B4A",
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/navigation-bar-logo.png"
            alt="SheriaBot"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "0.08em", color: "#1A2B4A" }}>
            INVOICE
          </div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#4A5568" }}>
            <div><strong>Invoice:</strong> {data.invoiceNumber ?? "--"}</div>
            <div><strong>Date:</strong> {formatDate(data.paidAt ?? data.createdAt)}</div>
            <div><strong>Due:</strong> {formatDate(data.paidAt ?? data.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", backgroundColor: "#1A2B4A", marginBottom: "32px", opacity: 0.15 }} />

      {/* ── From / To ── */}
      <div style={{ display: "flex", gap: "48px", marginBottom: "40px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#4A5568", marginBottom: "8px" }}>
            FROM
          </div>
          <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#1A2B4A" }}>
            <div style={{ fontWeight: 700 }}>SheriaBot Ltd</div>
            <div>Nairobi, Kenya</div>
            <div>support@sheriabot.com</div>
            <div>www.sheriabot.com</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#4A5568", marginBottom: "8px" }}>
            BILL TO
          </div>
          <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#1A2B4A" }}>
            <div style={{ fontWeight: 700 }}>{data.organization.name}</div>
            {data.organization.address && <div>{data.organization.address}</div>}
            <div>{data.organization.contactEmail ?? data.user.email}</div>
            {data.user.fullName && <div>{data.user.fullName}</div>}
          </div>
        </div>
      </div>

      {/* ── Line items table ── */}
      <div style={{ marginBottom: "32px" }}>
        {/* Table header */}
        <div
          style={{
            display:         "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap:             "16px",
            backgroundColor: "#1A2B4A",
            color:           "#fff",
            padding:         "10px 16px",
            fontSize:        "11px",
            fontWeight:      700,
            letterSpacing:   "0.08em",
            borderRadius:    "4px 4px 0 0",
          }}
        >
          <div>DESCRIPTION</div>
          <div style={{ textAlign: "center" }}>QTY</div>
          <div style={{ textAlign: "right" }}>UNIT PRICE</div>
          <div style={{ textAlign: "right" }}>AMOUNT</div>
        </div>

        {/* Line item row */}
        <div
          style={{
            display:         "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap:             "16px",
            padding:         "14px 16px",
            backgroundColor: "#fff",
            borderLeft:      "1px solid #e2e8f0",
            borderRight:     "1px solid #e2e8f0",
            borderBottom:    "1px solid #e2e8f0",
            fontSize:        "13px",
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{planLabel} Plan Subscription</div>
            {data.billingPeriodStart && data.billingPeriodEnd && (
              <div style={{ fontSize: "12px", color: "#4A5568", marginTop: "2px" }}>
                {formatShortDate(data.billingPeriodStart)} to {formatShortDate(data.billingPeriodEnd)}
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", alignSelf: "center" }}>1</div>
          <div style={{ textAlign: "right", alignSelf: "center", fontWeight: 500 }}>{amount}</div>
          <div style={{ textAlign: "right", alignSelf: "center", fontWeight: 600 }}>{amount}</div>
        </div>

        {/* Totals */}
        <div
          style={{
            backgroundColor: "#fff",
            borderLeft:      "1px solid #e2e8f0",
            borderRight:     "1px solid #e2e8f0",
            borderBottom:    "1px solid #e2e8f0",
            borderRadius:    "0 0 4px 4px",
            padding:         "12px 16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "280px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#4A5568", paddingBottom: "8px", borderBottom: "1px solid #e2e8f0" }}>
                <span>Subtotal</span>
                <span>{amount}</span>
              </div>
              {/* TODO: Add VAT line (16%) when tax requirements are confirmed */}
              <div
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  fontSize:       "15px",
                  fontWeight:     800,
                  color:          "#1A2B4A",
                  paddingTop:     "10px",
                }}
              >
                <span>TOTAL ({data.currency})</span>
                <span style={{ color: "#00875A" }}>{amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment information ── */}
      <div
        style={{
          backgroundColor: "#fff",
          border:          "1px solid #e2e8f0",
          borderRadius:    "6px",
          padding:         "20px 24px",
          marginBottom:    "32px",
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#4A5568", marginBottom: "12px" }}>
          PAYMENT INFORMATION
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
          <div>
            <span style={{ color: "#4A5568" }}>Method: </span>
            <span style={{ fontWeight: 600 }}>{data.paymentMethodDisplay}</span>
          </div>
          <div>
            <span style={{ color: "#4A5568" }}>Status: </span>
            <span
              style={{
                backgroundColor: badge.bg,
                color:           badge.text,
                fontSize:        "11px",
                fontWeight:      700,
                padding:         "2px 8px",
                borderRadius:    "4px",
                letterSpacing:   "0.06em",
              }}
            >
              {badge.label}
            </span>
          </div>
          {data.providerTransactionId && (
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ color: "#4A5568" }}>Transaction ID: </span>
              <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "12px" }}>
                {data.providerTransactionId}
              </span>
            </div>
          )}
          {data.paidAt && (
            <div>
              <span style={{ color: "#4A5568" }}>Paid on: </span>
              <span style={{ fontWeight: 600 }}>{formatDate(data.paidAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#1A2B4A", marginBottom: "6px" }}>
          Thank you for choosing SheriaBot.
        </div>
        <div style={{ fontSize: "12px", color: "#4A5568" }}>
          www.sheriabot.com
        </div>
        <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "8px" }}>
          This invoice was generated automatically by SheriaBot. For queries, contact support@sheriabot.com
        </div>
      </div>
    </div>
  )
}

// ── Main modal component ───────────────────────────────────────────────────

interface InvoiceModalProps {
  paymentId: string
  onClose:   () => void
}

export function InvoiceModal({ paymentId, onClose }: InvoiceModalProps) {
  const query = trpc.payment.getDetail.useQuery(
    { paymentId },
    { staleTime: 5 * 60 * 1000 },
  )

  const data = query.data as InvoiceDetail | undefined

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  function handleDownload() {
    if (!data) {
      toast.error("Invoice not loaded yet.")
      return
    }
    triggerPrint()
  }

  return (
    <>
      {/* Print styles — isolate invoice content, hide modal chrome */}
      <style>{`
        @media print {
          body > *:not(#invoice-print-root) { display: none !important; }
          #invoice-print-root { display: block !important; }
          #invoice-modal-chrome { display: none !important; }
          #sheriabot-invoice {
            padding: 24px !important;
            background: #fff !important;
            box-shadow: none !important;
            max-width: 100% !important;
          }
          @page {
            margin: 16mm;
            size: A4;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        id="invoice-print-root"
      >
        {/* Modal panel */}
        <div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
          id="invoice-print-root"
        >
          {/* Modal chrome (hidden on print) */}
          <div
            id="invoice-modal-chrome"
            className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-white/95 backdrop-blur px-6 py-4"
          >
            <div>
              <h2 className="text-base font-semibold text-foreground">Invoice</h2>
              {data?.invoiceNumber && (
                <p className="text-xs text-muted-foreground mt-0.5">{data.invoiceNumber}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                disabled={!data}
                className="gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Download PDF
                <Download className="h-3 w-3 opacity-60" />
              </Button>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Close invoice"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Invoice content */}
          <div className="p-2">
            {query.isLoading && (
              <div className="space-y-4 p-10">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}
            {query.isError && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm font-medium text-foreground">Failed to load invoice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {query.error?.message ?? "An unexpected error occurred."}
                </p>
                <Button size="sm" variant="outline" className="mt-4" onClick={() => query.refetch()}>
                  Try again
                </Button>
              </div>
            )}
            {data && <InvoiceContent data={data} />}
          </div>
        </div>
      </div>
    </>
  )
}
