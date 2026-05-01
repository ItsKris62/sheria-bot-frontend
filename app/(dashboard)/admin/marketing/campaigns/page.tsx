"use client";

/**
 * Admin Marketing Campaigns Page — Phase B3
 *
 * Full campaign list with:
 *   - Status filter + search
 *   - New Campaign multi-step dialog (4 steps)
 *   - Duplicate + Cancel actions
 *   - Async send UX (shows "Queue Send" for >25 recipients)
 */

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Eye, Copy, XCircle, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CampaignStatus =
  | "DRAFT" | "SCHEDULED" | "SENDING" | "SENT"
  | "PARTIALLY_SENT" | "FAILED" | "CANCELLED";

type TemplateKey =
  | "PILOT_INVITATION" | "REGULATOR_ACCESS_PROGRAM" | "PRODUCT_LAUNCH"
  | "COMPLIANCE_UPDATE" | "WEBINAR_INVITE" | "RESOURCE_DOWNLOAD"
  | "GENERIC_MARKETING";

interface FieldDef {
  key:      string;
  label:    string;
  type:     "text" | "url" | "number" | "date" | "textarea";
  required: boolean;
  default?: string | number;
}

interface CampaignListItem {
  id: string;
  name: string;
  templateKey: string;
  status: string;
  totalRecipients: number;
  totalSent: number;
  createdAt: string | Date;
}

interface ContactListSummary {
  id: string;
  name: string;
  _count: { memberships: number };
}

// ---------------------------------------------------------------------------
// Template variable field definitions
// ---------------------------------------------------------------------------

const TEMPLATE_VARIABLE_FIELDS: Record<TemplateKey, FieldDef[]> = {
  PILOT_INVITATION: [
    { key: "recipientCompanyName", label: "Company Name",       type: "text",   required: false },
    { key: "applicationUrl",       label: "Application URL",    type: "url",    required: true  },
    { key: "expiresInDays",        label: "Expires in (days)",  type: "number", required: true, default: 14 },
    { key: "inviterName",          label: "Inviter Name",       type: "text",   required: false },
  ],
  REGULATOR_ACCESS_PROGRAM: [
    { key: "regulatorName", label: "Regulator Name", type: "text", required: true },
    { key: "signupUrl",     label: "Signup URL",     type: "url",  required: true },
  ],
  PRODUCT_LAUNCH: [
    { key: "featureName",    label: "Feature Name",                  type: "text",     required: true },
    { key: "featureTagline", label: "Tagline",                       type: "text",     required: true },
    { key: "ctaUrl",         label: "CTA URL",                       type: "url",      required: true },
    { key: "ctaText",        label: "CTA Button Text",               type: "text",     required: true },
    { key: "whatsNew",       label: "What's New (one per line)",     type: "textarea", required: true },
  ],
  COMPLIANCE_UPDATE: [
    { key: "updateTitle",   label: "Update Title",    type: "text",     required: true },
    { key: "regulatorName", label: "Regulator",       type: "text",     required: true },
    { key: "publishedDate", label: "Published Date",  type: "date",     required: true },
    { key: "summary",       label: "Summary",         type: "textarea", required: true },
    { key: "whoAffected",   label: "Who is Affected", type: "text",     required: true },
    { key: "ctaUrl",        label: "Analysis URL",    type: "url",      required: true },
  ],
  WEBINAR_INVITE: [
    { key: "eventTitle",       label: "Event Title",              type: "text",     required: true },
    { key: "eventDate",        label: "Event Date",               type: "text",     required: true },
    { key: "eventTime",        label: "Event Time",               type: "text",     required: true },
    { key: "eventLocation",    label: "Location",                 type: "text",     required: true },
    { key: "speakerNames",     label: "Speakers (one per line)",  type: "textarea", required: true },
    { key: "agenda",           label: "Agenda (one per line)",    type: "textarea", required: true },
    { key: "registrationUrl",  label: "Registration URL",         type: "url",      required: true },
  ],
  RESOURCE_DOWNLOAD: [
    { key: "resourceTitle",       label: "Resource Title",  type: "text",     required: true  },
    { key: "resourceDescription", label: "Description",     type: "textarea", required: true  },
    { key: "downloadUrl",         label: "Download URL",    type: "url",      required: true  },
    { key: "pageCount",           label: "Page Count",      type: "number",   required: false },
    { key: "fileFormat",          label: "File Format",     type: "text",     required: false },
  ],
  GENERIC_MARKETING: [
    { key: "headline",       label: "Headline",                          type: "text",     required: true  },
    { key: "bodyParagraphs", label: "Body Paragraphs (one per line)",    type: "textarea", required: true  },
    { key: "ctaUrl",         label: "CTA URL",                           type: "url",      required: false },
    { key: "ctaText",        label: "CTA Button Text",                   type: "text",     required: false },
  ],
};

const ARRAY_FIELDS = new Set(["whatsNew", "speakerNames", "agenda", "bodyParagraphs"]);

const TEMPLATE_LABELS: Record<TemplateKey, string> = {
  PILOT_INVITATION:        "Pilot Invitation",
  REGULATOR_ACCESS_PROGRAM: "Regulator Access Program",
  PRODUCT_LAUNCH:          "Product Launch",
  COMPLIANCE_UPDATE:       "Compliance Update",
  WEBINAR_INVITE:          "Webinar Invite",
  RESOURCE_DOWNLOAD:       "Resource Download",
  GENERIC_MARKETING:       "Generic Marketing",
};

const STATUS_COLORS: Record<CampaignStatus, string> = {
  DRAFT:          "bg-gray-100 text-gray-700",
  SCHEDULED:      "bg-blue-100 text-blue-700",
  SENDING:        "bg-yellow-100 text-yellow-700",
  SENT:           "bg-green-100 text-green-700",
  PARTIALLY_SENT: "bg-orange-100 text-orange-700",
  FAILED:         "bg-red-100 text-red-700",
  CANCELLED:      "bg-gray-100 text-gray-500",
};

// ---------------------------------------------------------------------------
// New Campaign Dialog
// ---------------------------------------------------------------------------

function NewCampaignDialog({
  open,
  onClose,
  onCreated,
}: {
  open:      boolean;
  onClose:   () => void;
  onCreated: () => void;
}) {
  const utils = trpc.useUtils();

  // Step state
  const [step, setStep] = useState(1);

  // Step 1
  const [name,        setName]        = useState("");
  const [subject,     setSubject]     = useState("");
  const [templateKey, setTemplateKey] = useState<TemplateKey | "">("");

  // Step 2 — dynamic variable fields
  const [vars, setVars] = useState<Record<string, string>>({});

  // Step 3 — list selection
  const [listId, setListId] = useState("");

  const { data: listsData } = trpc.adminMarketing.lists.list.useQuery(
    { take: 100, skip: 0 },
    { enabled: open },
  );

  const createMutation = trpc.adminMarketing.campaigns.create.useMutation({
    onSuccess: () => {
      toast.success("Campaign created successfully");
      void utils.adminMarketing.campaigns.list.invalidate();
      onCreated();
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });

  function resetForm() {
    setStep(1);
    setName(""); setSubject(""); setTemplateKey("");
    setVars({}); setListId("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleNext() {
    if (step === 1) {
      if (!name.trim() || !subject.trim() || !templateKey) {
        toast.error("Please fill in all required fields");
        return;
      }
      // Pre-populate defaults
      if (templateKey) {
        const defaults: Record<string, string> = {};
        for (const f of TEMPLATE_VARIABLE_FIELDS[templateKey]) {
          if (f.default !== undefined) defaults[f.key] = String(f.default);
        }
        setVars(defaults);
      }
    }
    if (step === 2) {
      const fields = TEMPLATE_VARIABLE_FIELDS[templateKey as TemplateKey] ?? [];
      for (const f of fields) {
        if (f.required && !vars[f.key]?.trim()) {
          toast.error(`"${f.label}" is required`);
          return;
        }
      }
    }
    if (step === 3) {
      if (!listId) {
        toast.error("Please select a contact list");
        return;
      }
    }
    setStep((s) => s + 1);
  }

  function handleCreate() {
    if (!templateKey) return;
    const fields = TEMPLATE_VARIABLE_FIELDS[templateKey as TemplateKey] ?? [];
    const templateVariables: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = vars[f.key] ?? "";
      if (ARRAY_FIELDS.has(f.key)) {
        templateVariables[f.key] = raw.split("\n").map((l) => l.trim()).filter(Boolean);
      } else if (f.type === "number") {
        templateVariables[f.key] = raw ? Number(raw) : undefined;
      } else {
        templateVariables[f.key] = raw || undefined;
      }
    }

    createMutation.mutate({
      name,
      subject,
      templateKey: templateKey as TemplateKey,
      templateVariables,
      listId,
    });
  }

  const fields = templateKey ? TEMPLATE_VARIABLE_FIELDS[templateKey as TemplateKey] : [];
  const listItems = (listsData?.items ?? []) as ContactListSummary[];
  const selectedList = listItems.find((l) => l.id === listId);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Campaign — Step {step} of 4</DialogTitle>
        </DialogHeader>

        {/* Step 1: Name + Subject + Template */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Campaign Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q2 Product Launch" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email Subject *</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Introducing SheriaBot v2" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Template *</label>
              <Select value={templateKey} onValueChange={(v) => setTemplateKey(v as TemplateKey)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TEMPLATE_LABELS) as TemplateKey[]).map((k) => (
                    <SelectItem key={k} value={k}>{TEMPLATE_LABELS[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Template variables */}
        {step === 2 && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
                    value={vars[f.key] ?? ""}
                    onChange={(e) => setVars((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={ARRAY_FIELDS.has(f.key) ? "One item per line" : ""}
                  />
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    className="mt-1"
                    value={vars[f.key] ?? ""}
                    onChange={(e) => setVars((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 3: List selection */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Contact List *</label>
              <Select value={listId} onValueChange={setListId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  {listItems.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name} ({l._count.memberships} members)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border p-4 space-y-2">
              <div><span className="font-medium">Name:</span> {name}</div>
              <div><span className="font-medium">Subject:</span> {subject}</div>
              <div><span className="font-medium">Template:</span> {templateKey ? TEMPLATE_LABELS[templateKey as TemplateKey] : ""}</div>
              <div><span className="font-medium">List:</span> {selectedList?.name ?? listId} ({selectedList?._count.memberships ?? "?"} members)</div>
            </div>
            <p className="text-muted-foreground text-xs">
              The campaign will be created as a DRAFT. You can review and send it from the campaign detail page.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CampaignsPage() {
  const utils = trpc.useUtils();

  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");
  const [search,       setSearch]       = useState("");
  const [page,         setPage]         = useState(0);
  const [showNew,      setShowNew]      = useState(false);
  const [cancelId,     setCancelId]     = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const { data, isLoading } = trpc.adminMarketing.campaigns.list.useQuery({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    take:   PAGE_SIZE,
    skip:   page * PAGE_SIZE,
  });

  const cancelMutation = trpc.adminMarketing.campaigns.cancel.useMutation({
    onSuccess: () => {
      toast.success("Campaign cancelled");
      void utils.adminMarketing.campaigns.list.invalidate();
      setCancelId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const duplicateMutation = trpc.adminMarketing.campaigns.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Campaign duplicated as DRAFT");
      void utils.adminMarketing.campaigns.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const campaigns = (data?.items ?? []) as CampaignListItem[];
  const total     = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const filtered = search
    ? campaigns.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : campaigns;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} campaigns total</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as CampaignStatus | "ALL"); setPage(0); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {(["DRAFT","SCHEDULED","SENDING","SENT","PARTIALLY_SENT","FAILED","CANCELLED"] as CampaignStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Recipients</TableHead>
              <TableHead className="text-right">Sent</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {TEMPLATE_LABELS[c.templateKey as TemplateKey] ?? c.templateKey}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status as CampaignStatus] ?? ""}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{c.totalRecipients}</TableCell>
                  <TableCell className="text-right">{c.totalSent}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/marketing/campaigns/${c.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateMutation.mutate({ campaignId: c.id })}
                        disabled={duplicateMutation.isPending}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {(c.status === "DRAFT" || c.status === "SCHEDULED") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCancelId(c.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page + 1} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* New Campaign Dialog */}
      <NewCampaignDialog
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={() => setShowNew(false)}
      />

      {/* Cancel Confirmation */}
      <AlertDialog open={!!cancelId} onOpenChange={(o) => { if (!o) setCancelId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the campaign. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Campaign</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => cancelId && cancelMutation.mutate({ campaignId: cancelId })}
            >
              Cancel Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
