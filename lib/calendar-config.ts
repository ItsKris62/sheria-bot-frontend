// ─── Kenyan Regulatory Frameworks ────────────────────────────────────────────
// Keep regulation names here so they can be extended without touching UI code.

export const KENYAN_REGULATIONS = [
  "Data Protection Act 2019",
  "CBK Prudential Guidelines",
  "CBK Cybersecurity Guidelines",
  "CBK National Payments System Guidelines",
  "CMA Capital Markets Regulations",
  "CMA Digital Assets Framework",
  "ODPC Data Privacy Guidelines",
  "Communications Authority Regulations",
  "Anti-Money Laundering Act",
  "Proceeds of Crime and Anti-Money Laundering Regulations",
  "Insurance Regulatory Authority Guidelines",
  "Kenya Revenue Authority (Tax Compliance)",
  "ISO 27001 Information Security",
  "PCI-DSS Payment Card Security",
  "SWIFT Security Requirements",
  "Other",
] as const;

export type KenyanRegulation = typeof KENYAN_REGULATIONS[number];

// ─── Event category display config ───────────────────────────────────────────

export const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  CUSTOM:   { label: "Custom",   color: "bg-muted text-muted-foreground" },
  FILING:   { label: "Filing",   color: "bg-warning/10 text-warning" },
  AUDIT:    { label: "Audit",    color: "bg-primary/10 text-primary" },
  RENEWAL:  { label: "Renewal",  color: "bg-destructive/10 text-destructive" },
  REVIEW:   { label: "Review",   color: "bg-primary/10 text-primary" },
};

// ─── Priority display config ──────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  LOW:      { label: "Low",      color: "bg-muted text-muted-foreground" },
  MEDIUM:   { label: "Medium",   color: "bg-warning/10 text-warning" },
  HIGH:     { label: "High",     color: "bg-destructive/10 text-destructive" },
  CRITICAL: { label: "Critical", color: "bg-destructive text-destructive-foreground" },
};
