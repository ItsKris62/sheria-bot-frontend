"use client";

/**
 * Admin Marketing Lead Review Queue (P0)
 *
 * Human-in-the-loop review queue for AI-discovered leads.
 * Implements strict zero-autonomous-outbound boundary: leads terminate at APPROVED
 * with human-verified state transitions.
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
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Award,
  Users,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Ban,
  Filter,
  Search,
  Check,
  FileSearch,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
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

export default function AdminMarketingLeadReviewQueuePage() {
  const utils = trpc.useUtils();

  // State
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("PENDING_REVIEW");
  const [icpTierFilter, setIcpTierFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Selected Lead for Detail Review
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Action Dialogs State
  const [approveDialogId, setApproveDialogId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [approveNotes, setApproveNotes] = useState("");

  const [rejectDialogId, setRejectDialogId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [researchDialogId, setResearchDialogId] = useState<string | null>(null);
  const [researchNotes, setResearchNotes] = useState("");

  // Queries
  const { data, isLoading } = trpc.adminMarketing.leads.listReviewQueue.useQuery({
    leadStatus: leadStatusFilter as any,
    icpTier: icpTierFilter !== "ALL" ? (icpTierFilter as any) : undefined,
    take: pageSize,
    skip: page * pageSize,
  });

  const { data: detail, isLoading: isDetailLoading } = trpc.adminMarketing.leads.getReviewDetail.useQuery(
    { companyId: selectedCompanyId || "" },
    { enabled: Boolean(selectedCompanyId) }
  );

  const { data: contactListsData } = trpc.adminMarketing.lists.list.useQuery({ take: 100, skip: 0 });
  const contactLists = contactListsData?.items;

  // Mutations
  const approveMutation = trpc.adminMarketing.leads.approveLead.useMutation({
    onSuccess: () => {
      toast.success("Lead approved successfully");
      void utils.adminMarketing.leads.listReviewQueue.invalidate();
      void utils.adminMarketing.companies.list.invalidate();
      setApproveDialogId(null);
      setSelectedListId("");
      setApproveNotes("");
      if (selectedCompanyId === approveDialogId) setSelectedCompanyId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const rejectMutation = trpc.adminMarketing.leads.rejectLead.useMutation({
    onSuccess: () => {
      toast.success("Lead rejected");
      void utils.adminMarketing.leads.listReviewQueue.invalidate();
      void utils.adminMarketing.companies.list.invalidate();
      setRejectDialogId(null);
      setRejectionReason("");
      if (selectedCompanyId === rejectDialogId) setSelectedCompanyId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const nurtureMutation = trpc.adminMarketing.leads.nurtureLead.useMutation({
    onSuccess: () => {
      toast.success("Lead moved to nurture");
      void utils.adminMarketing.leads.listReviewQueue.invalidate();
      void utils.adminMarketing.companies.list.invalidate();
      if (selectedCompanyId) setSelectedCompanyId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const researchMutation = trpc.adminMarketing.leads.requestResearch.useMutation({
    onSuccess: () => {
      toast.success("Research requested for lead");
      void utils.adminMarketing.leads.listReviewQueue.invalidate();
      setResearchDialogId(null);
      setResearchNotes("");
    },
    onError: (err) => toast.error(err.message),
  });

  const doNotContactMutation = trpc.adminMarketing.leads.doNotContact.useMutation({
    onSuccess: () => {
      toast.success("Company marked as DO NOT CONTACT");
      void utils.adminMarketing.leads.listReviewQueue.invalidate();
      void utils.adminMarketing.companies.list.invalidate();
      if (selectedCompanyId) setSelectedCompanyId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-6 p-6">
      {/* Zero Outbound Assurance Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-emerald-900">Zero-Autonomous-Outbound Protected Queue</h2>
            <p className="text-xs text-emerald-700">
              AI lead discoveries remain strictly in review. No email, LinkedIn, or campaign messages will ever be sent without explicit admin approval.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> Lead Review Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review, verify, and qualify AI-discovered prospect accounts prior to outreach.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 bg-card p-4 rounded-xl border">
        <Select value={leadStatusFilter} onValueChange={(val) => { setLeadStatusFilter(val); setPage(0); }}>
          <SelectTrigger>
            <SelectValue placeholder="Status Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
            <SelectItem value="NURTURE">Nurture</SelectItem>
            <SelectItem value="QUALIFIED">Qualified</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="UNASSESSED">Unassessed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={icpTierFilter} onValueChange={(val) => { setIcpTierFilter(val); setPage(0); }}>
          <SelectTrigger>
            <SelectValue placeholder="ICP Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All ICP Tiers</SelectItem>
            <SelectItem value="TIER_1_CORE_FINTECH">Tier 1: Core Fintech</SelectItem>
            <SelectItem value="TIER_2_HIGH_EXPOSURE">Tier 2: High Exposure</SelectItem>
            <SelectItem value="TIER_3_ADJACENT">Tier 3: Adjacent</SelectItem>
            <SelectItem value="NON_ICP">Non-ICP</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-end text-sm text-muted-foreground">
          {data ? `${data.total} prospects in queue` : "Loading..."}
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Candidate</TableHead>
              <TableHead>ICP Tier</TableHead>
              <TableHead>Lead Score</TableHead>
              <TableHead>Regulator / Licence</TableHead>
              <TableHead>Discovered</TableHead>
              <TableHead className="text-right">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No prospects currently pending review in this queue.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((company) => (
                <TableRow key={company.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedCompanyId(company.id)}>
                  <TableCell>
                    <div className="font-semibold text-sm">{company.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {company.domain || "No domain"}
                    </div>
                  </TableCell>
                  <TableCell>{getIcpTierBadge(company.icpTier)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base ${getScoreColor(company.leadScore)}`}>
                        {company.leadScore !== null && company.leadScore !== undefined ? `${company.leadScore}/100` : "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium">{company.regulatoryBody || "Unassigned"}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{company.licenceNumber || "—"}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {company.discoveredAt ? new Date(company.discoveredAt).toLocaleDateString() : new Date(company.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                        onClick={() => setApproveDialogId(company.id)}
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                        onClick={() => setRejectDialogId(company.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedCompanyId(company.id)}
                      >
                        <Eye className="h-4 w-4" />
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

      {/* Detailed Lead Review Drawer */}
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
                  <div>
                    {getIcpTierBadge(detail.icpTier)}
                  </div>
                </div>
              </SheetHeader>

              {/* Score Card */}
              <div className="p-4 bg-gradient-to-br from-card to-muted rounded-xl border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Deterministic ICP Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(detail.leadScore)}`}>
                    {detail.leadScore !== null && detail.leadScore !== undefined ? `${detail.leadScore}/100` : "Unassessed"}
                  </span>
                </div>
                {detail.reviewReason && (
                  <p className="text-xs text-muted-foreground bg-background/80 p-2.5 rounded border">
                    {detail.reviewReason}
                  </p>
                )}
              </div>

              {/* Evidence Provenance (Amendment 4 & 5) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Discovery & Extraction Evidence ({detail.evidence.length})
                </h3>

                {detail.evidence.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded border">
                    No evidence records found.
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

              {/* Contacts / Decision-Makers (Amendment 14) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" /> Named Contacts ({detail.contacts.length})
                </h3>
                {detail.contacts.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" /> No Named Contacts Found Yet
                    </p>
                    <p>
                      You may approve this company account now. Outreach will remain pending until a verified contact is researched and added.
                    </p>
                  </div>
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

              {/* Action Buttons in Drawer */}
              <div className="pt-4 border-t space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                    onClick={() => setApproveDialogId(detail.id)}
                  >
                    <Check className="h-3.5 w-3.5" /> Approve Prospect
                  </Button>
                  <Button
                    variant="outline"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                    onClick={() => setRejectDialogId(detail.id)}
                  >
                    Reject Prospect
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => nurtureMutation.mutate({ companyId: detail.id })}
                    disabled={nurtureMutation.isPending}
                  >
                    <Clock className="h-3 w-3 mr-1" /> Nurture
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setResearchDialogId(detail.id)}
                  >
                    <FileSearch className="h-3 w-3 mr-1" /> Research
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-red-600 hover:bg-red-50"
                    onClick={() => doNotContactMutation.mutate({ companyId: detail.id })}
                    disabled={doNotContactMutation.isPending}
                  >
                    <Ban className="h-3 w-3 mr-1" /> Blacklist
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Approve Dialog (Amendment 14) */}
      <Dialog open={Boolean(approveDialogId)} onOpenChange={(open) => { if (!open) setApproveDialogId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Company Prospect</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Approving advances the company state to <strong>APPROVED</strong> and sales stage to <strong>LEAD_QUALIFIED</strong>.
            </p>
            {contactLists && contactLists.length > 0 && (
              <div className="space-y-1">
                <Label>Add Existing Contacts to Marketing List (Optional)</Label>
                <Select value={selectedListId} onValueChange={setSelectedListId}>
                  <SelectTrigger><SelectValue placeholder="Select contact list..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Do not add to list</SelectItem>
                    {contactLists.map((l: any) => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1">
              <Label>Approval Rationale / Strategy Notes</Label>
              <Textarea
                placeholder="e.g. Verified licensed DCP with upcoming quarterly reporting deadline..."
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                className="h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogId(null)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                if (!approveDialogId) return;
                approveMutation.mutate({
                  companyId: approveDialogId,
                  reviewReason: approveNotes || undefined,
                  addToListId: selectedListId && selectedListId !== "NONE" ? selectedListId : undefined,
                });
              }}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={Boolean(rejectDialogId)} onOpenChange={(open) => { if (!open) setRejectDialogId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Prospect</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label>Rejection Reason *</Label>
              <Textarea
                placeholder="e.g. Unregulated software consultancy with no direct compliance obligation..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogId(null)}>Cancel</Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                if (!rejectionReason.trim()) {
                  toast.error("Rejection reason is required");
                  return;
                }
                rejectMutation.mutate({
                  companyId: rejectDialogId!,
                  rejectionReason: rejectionReason.trim(),
                });
              }}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Research Dialog */}
      <Dialog open={Boolean(researchDialogId)} onOpenChange={(open) => { if (!open) setResearchDialogId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Contact & Company Research</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label>Research Instructions</Label>
              <Textarea
                placeholder="e.g. Find Head of Compliance or Legal Counsel on LinkedIn..."
                value={researchNotes}
                onChange={(e) => setResearchNotes(e.target.value)}
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResearchDialogId(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!researchNotes.trim()) {
                  toast.error("Research instructions required");
                  return;
                }
                researchMutation.mutate({
                  companyId: researchDialogId!,
                  researchNotes: researchNotes.trim(),
                });
              }}
              disabled={researchMutation.isPending}
            >
              {researchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
