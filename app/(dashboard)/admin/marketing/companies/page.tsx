"use client";

/**
 * Admin Marketing Company Directory Page (P0)
 *
 * Full management interface for marketing company records, lead qualification inspection,
 * evidence audit trail, manual CRM creation, and entity merging.
 */

import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Award,
  Users,
  Eye,
  Edit2,
  Trash2,
  GitMerge,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers & Badge Styles
// ---------------------------------------------------------------------------

function getIcpTierBadge(tier?: string | null) {
  switch (tier) {
    case "TIER_1_CORE_FINTECH":
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Tier 1: Core Fintech</Badge>;
    case "TIER_2_HIGH_EXPOSURE":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Tier 2: High Exposure</Badge>;
    case "TIER_3_ADJACENT":
      return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Tier 3: Adjacent</Badge>;
    case "NON_ICP":
      return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Non-ICP</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground">Unassessed</Badge>;
  }
}

function getLeadStatusBadge(status?: string | null) {
  switch (status) {
    case "PENDING_REVIEW":
      return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending Review</Badge>;
    case "APPROVED":
      return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
    case "QUALIFIED":
      return <Badge className="bg-teal-100 text-teal-800 border-teal-300">Qualified</Badge>;
    case "NURTURE":
      return <Badge className="bg-sky-100 text-sky-800 border-sky-300">Nurture</Badge>;
    case "CONVERTED":
      return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Converted</Badge>;
    case "REJECTED":
      return <Badge className="bg-rose-100 text-rose-800 border-rose-300">Rejected</Badge>;
    case "DO_NOT_CONTACT":
      return <Badge className="bg-red-100 text-red-800 border-red-300">Do Not Contact</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground">Unassessed</Badge>;
  }
}

function getScoreColor(score?: number | null) {
  if (score === null || score === undefined) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-600 font-bold";
  if (score >= 65) return "text-blue-600 font-bold";
  if (score >= 50) return "text-amber-600 font-semibold";
  return "text-rose-600";
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminMarketingCompaniesPage() {
  const utils = trpc.useUtils();

  // Search & Filter State
  const [query, setQuery] = useState("");
  const [leadStatus, setLeadStatus] = useState<string>("ALL");
  const [icpTier, setIcpTier] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  // Modals & Drawers
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mergePrimaryId, setMergePrimaryId] = useState<string | null>(null);
  const [mergeSecondaryId, setMergeSecondaryId] = useState<string>("");

  // Create Form State
  const [formName, setFormName] = useState("");
  const [formDomain, setFormDomain] = useState("");
  const [formIndustry, setFormIndustry] = useState("");
  const [formCountry, setFormCountry] = useState("Kenya");
  const [formLicenceNumber, setFormLicenceNumber] = useState("");
  const [formLicenceType, setFormLicenceType] = useState("");
  const [formRegBody, setFormRegBody] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Queries
  const { data, isLoading } = trpc.adminMarketing.companies.list.useQuery({
    query: query || undefined,
    leadStatus: leadStatus !== "ALL" ? (leadStatus as any) : undefined,
    icpTier: icpTier !== "ALL" ? (icpTier as any) : undefined,
    take: pageSize,
    skip: page * pageSize,
    orderBy: "createdAt",
    orderDir: "desc",
  });

  const { data: detail, isLoading: isDetailLoading } = trpc.adminMarketing.companies.getById.useQuery(
    { id: selectedCompanyId || "" },
    { enabled: Boolean(selectedCompanyId) }
  );

  // Mutations
  const createMutation = trpc.adminMarketing.companies.create.useMutation({
    onSuccess: () => {
      toast.success("Company created successfully");
      void utils.adminMarketing.companies.list.invalidate();
      setCreateOpen(false);
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.adminMarketing.companies.update.useMutation({
    onSuccess: () => {
      toast.success("Company updated successfully");
      void utils.adminMarketing.companies.list.invalidate();
      if (selectedCompanyId) void utils.adminMarketing.companies.getById.invalidate({ id: selectedCompanyId });
      setEditCompany(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.adminMarketing.companies.delete.useMutation({
    onSuccess: () => {
      toast.success("Company deleted");
      void utils.adminMarketing.companies.list.invalidate();
      setDeleteId(null);
      if (selectedCompanyId === deleteId) setSelectedCompanyId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const mergeMutation = trpc.adminMarketing.companies.merge.useMutation({
    onSuccess: () => {
      toast.success("Companies merged successfully");
      void utils.adminMarketing.companies.list.invalidate();
      setMergePrimaryId(null);
      setMergeSecondaryId("");
    },
    onError: (err) => toast.error(err.message),
  });

  function resetForm() {
    setFormName("");
    setFormDomain("");
    setFormIndustry("");
    setFormCountry("Kenya");
    setFormLicenceNumber("");
    setFormLicenceType("");
    setFormRegBody("");
    setFormNotes("");
  }

  function handleCreate() {
    if (!formName.trim()) {
      toast.error("Company name is required");
      return;
    }
    createMutation.mutate({
      name: formName,
      domain: formDomain || null,
      industry: formIndustry || null,
      country: formCountry,
      licenceNumber: formLicenceNumber || null,
      licenceType: formLicenceType || null,
      regulatoryBody: formRegBody || null,
      notes: formNotes || null,
    });
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" /> Company Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Target company accounts, regulatory profiles, AI discovery metadata, and ICP qualification scores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => { resetForm(); setCreateOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Company
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 bg-card p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, domain, licence..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>

        <Select value={leadStatus} onValueChange={(val) => { setLeadStatus(val); setPage(0); }}>
          <SelectTrigger>
            <SelectValue placeholder="Lead Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Lead Statuses</SelectItem>
            <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
            <SelectItem value="QUALIFIED">Qualified</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="NURTURE">Nurture</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="UNASSESSED">Unassessed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="DO_NOT_CONTACT">Do Not Contact</SelectItem>
          </SelectContent>
        </Select>

        <Select value={icpTier} onValueChange={(val) => { setIcpTier(val); setPage(0); }}>
          <SelectTrigger>
            <SelectValue placeholder="ICP Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All ICP Tiers</SelectItem>
            <SelectItem value="TIER_1_CORE_FINTECH">Tier 1: Core Fintech</SelectItem>
            <SelectItem value="TIER_2_HIGH_EXPOSURE">Tier 2: High Exposure</SelectItem>
            <SelectItem value="TIER_3_ADJACENT">Tier 3: Adjacent</SelectItem>
            <SelectItem value="NON_ICP">Non-ICP</SelectItem>
            <SelectItem value="UNASSESSED">Unassessed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-end text-sm text-muted-foreground">
          {data ? `Showing ${data.items.length} of ${data.total} companies` : "Loading..."}
        </div>
      </div>

      {/* Companies Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Country / Reg</TableHead>
              <TableHead>ICP Tier</TableHead>
              <TableHead>Lead Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No companies found matching the filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((company) => (
                <TableRow key={company.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedCompanyId(company.id)}>
                  <TableCell>
                    <div className="font-semibold text-sm">{company.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      {company.domain ? (
                        <span className="text-primary font-mono">{company.domain}</span>
                      ) : (
                        <span className="italic">No domain</span>
                      )}
                      {company.origin === "AI_DISCOVERY" && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200">
                          <Sparkles className="h-2.5 w-2.5" /> AI
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium">{company.country}</div>
                    <div className="text-[11px] text-muted-foreground">{company.regulatoryBody || "—"}</div>
                  </TableCell>
                  <TableCell>{getIcpTierBadge(company.icpTier)}</TableCell>
                  <TableCell>
                    <span className={`text-sm ${getScoreColor(company.leadScore)}`}>
                      {company.leadScore !== null && company.leadScore !== undefined ? `${company.leadScore}/100` : "—"}
                    </span>
                  </TableCell>
                  <TableCell>{getLeadStatusBadge(company.leadStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {company._count.contacts}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCompanyId(company.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditCompany(company)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => setDeleteId(company.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
          <div>
            Page {page + 1} of {data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="h-7 px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data || (page + 1) * pageSize >= data.total}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 px-2"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Company Detail Drawer */}
      <Sheet open={Boolean(selectedCompanyId)} onOpenChange={(open) => { if (!open) setSelectedCompanyId(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6 space-y-6">
          {isDetailLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : detail ? (
            <>
              <SheetHeader className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl font-bold">{detail.name}</SheetTitle>
                    {detail.domain && (
                      <a
                        href={`https://${detail.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1 font-mono"
                      >
                        {detail.domain} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {getLeadStatusBadge(detail.leadStatus)}
                    {getIcpTierBadge(detail.icpTier)}
                  </div>
                </div>
              </SheetHeader>

              {/* Score & Profile Summary */}
              <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-lg border text-xs">
                <div>
                  <span className="text-muted-foreground">Lead Score:</span>{" "}
                  <span className={`font-bold ${getScoreColor(detail.leadScore)}`}>
                    {detail.leadScore !== null && detail.leadScore !== undefined ? `${detail.leadScore}/100` : "Unassessed"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Country:</span> <span className="font-semibold">{detail.country}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Licence Number:</span>{" "}
                  <span className="font-mono">{detail.licenceNumber || "None"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Regulator:</span>{" "}
                  <span>{detail.regulatoryBody || "None"}</span>
                </div>
                {detail.reviewReason && (
                  <div className="col-span-2 pt-2 border-t text-muted-foreground">
                    <span className="font-semibold text-foreground">Review Notes:</span> {detail.reviewReason}
                  </div>
                )}
              </div>

              {/* Discovery Evidence Audit (Amendment 4 & 5) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Verified & AI Evidence ({detail.evidence.length})
                  </h3>
                </div>

                {detail.evidence.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded border">
                    No raw evidence recorded yet for this company.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {detail.evidence.map((ev: any) => (
                      <div key={ev.id} className="text-xs p-2.5 rounded-lg border bg-card space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">{ev.field}</span>
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase font-mono">
                            {ev.verificationState}
                          </span>
                        </div>
                        <div className="font-medium text-foreground">{ev.extractedValue}</div>
                        {ev.evidenceSnippet && (
                          <div className="text-[11px] text-muted-foreground bg-muted/30 p-1.5 rounded italic">
                            &ldquo;{ev.evidenceSnippet}&rdquo;
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                          <a href={ev.sourceUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5 text-primary font-mono">
                            Source <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                          <span>Conf: {Math.round(ev.confidence * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contacts */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" /> Contacts ({detail.contacts.length})
                </h3>
                {detail.contacts.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded border">
                    No named contacts identified yet. Contact research required before outbound.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {detail.contacts.map((contact: any) => (
                      <div key={contact.id} className="text-xs p-2.5 rounded-lg border bg-card flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{contact.firstName} {contact.lastName}</div>
                          <div className="text-muted-foreground font-mono">{contact.email}</div>
                          <div className="text-[11px] text-muted-foreground">{contact.role || "No title"}</div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {contact.salesStage}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => setMergePrimaryId(detail.id)} className="gap-1.5 text-xs">
                  <GitMerge className="h-3.5 w-3.5" /> Merge Duplicate
                </Button>
                <Button size="sm" onClick={() => setEditCompany(detail)} className="gap-1.5 text-xs">
                  <Edit2 className="h-3.5 w-3.5" /> Edit Company
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label>Company Name *</Label>
              <Input placeholder="e.g. Acme Payments Ltd" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Domain</Label>
              <Input placeholder="e.g. acmepayments.co.ke" value={formDomain} onChange={(e) => setFormDomain(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Country</Label>
                <Input value={formCountry} onChange={(e) => setFormCountry(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Regulatory Body</Label>
                <Input placeholder="e.g. CBK" value={formRegBody} onChange={(e) => setFormRegBody(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Licence Number</Label>
                <Input placeholder="e.g. DCP/014" value={formLicenceNumber} onChange={(e) => setFormLicenceNumber(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Licence Type</Label>
                <Input placeholder="e.g. Digital Credit Provider" value={formLicenceType} onChange={(e) => setFormLicenceType(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea placeholder="Internal notes..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="h-20" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editCompany)} onOpenChange={(open) => { if (!open) setEditCompany(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editCompany && (
            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label>Company Name</Label>
                <Input defaultValue={editCompany.name} id="edit-name" />
              </div>
              <div className="space-y-1">
                <Label>Domain</Label>
                <Input defaultValue={editCompany.domain || ""} id="edit-domain" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Licence Number</Label>
                  <Input defaultValue={editCompany.licenceNumber || ""} id="edit-licence" />
                </div>
                <div className="space-y-1">
                  <Label>Lead Status</Label>
                  <Select defaultValue={editCompany.leadStatus} onValueChange={(val) => { editCompany.leadStatus = val; }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNASSESSED">UNASSESSED</SelectItem>
                      <SelectItem value="PENDING_REVIEW">PENDING_REVIEW</SelectItem>
                      <SelectItem value="QUALIFIED">QUALIFIED</SelectItem>
                      <SelectItem value="APPROVED">APPROVED</SelectItem>
                      <SelectItem value="NURTURE">NURTURE</SelectItem>
                      <SelectItem value="CONVERTED">CONVERTED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                      <SelectItem value="DO_NOT_CONTACT">DO_NOT_CONTACT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Notes</Label>
                <Textarea defaultValue={editCompany.notes || ""} id="edit-notes" className="h-20" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCompany(null)}>Cancel</Button>
            <Button
              onClick={() => {
                const nameEl = document.getElementById("edit-name") as HTMLInputElement;
                const domainEl = document.getElementById("edit-domain") as HTMLInputElement;
                const licEl = document.getElementById("edit-licence") as HTMLInputElement;
                const notesEl = document.getElementById("edit-notes") as HTMLTextAreaElement;

                updateMutation.mutate({
                  id: editCompany.id,
                  name: nameEl?.value,
                  domain: domainEl?.value || null,
                  licenceNumber: licEl?.value || null,
                  leadStatus: editCompany.leadStatus,
                  notes: notesEl?.value || null,
                });
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog open={Boolean(mergePrimaryId)} onOpenChange={(open) => { if (!open) setMergePrimaryId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Merge Duplicate Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Enter the Company ID of the duplicate record to merge into this primary record.
              All contacts, evidence, and run records will be safely reassigned.
            </p>
            <div className="space-y-1">
              <Label>Secondary (Duplicate) Company ID *</Label>
              <Input
                placeholder="e.g. clx123abc..."
                value={mergeSecondaryId}
                onChange={(e) => setMergeSecondaryId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergePrimaryId(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!mergeSecondaryId.trim()) {
                  toast.error("Duplicate Company ID required");
                  return;
                }
                mergeMutation.mutate({
                  primaryCompanyId: mergePrimaryId!,
                  secondaryCompanyId: mergeSecondaryId.trim(),
                });
              }}
              disabled={mergeMutation.isPending}
            >
              {mergeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Execute Merge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to soft-delete this company record? Associated contacts will be retained.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) deleteMutation.mutate({ id: deleteId }); }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
