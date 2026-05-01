"use client";

/**
 * Admin Marketing Contacts Page — Phase B3
 */

import { useState, useRef } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Upload, Eye, Edit2, ShieldOff, Shield, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

type ConsentStatus = "PENDING" | "GRANTED" | "REVOKED";

const CONSENT_COLORS: Record<ConsentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  GRANTED: "bg-green-100 text-green-700",
  REVOKED: "bg-red-100 text-red-700",
};

interface ContactItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company?: { name: string } | null;
  consentStatus: string;
  suppressedAt?: string | Date | null;
  lastEmailedAt?: string | Date | null;
  phone?: string | null;
  role?: string | null;
  companyId?: string | null;
}

interface ConsentRecord {
  id: string;
  action: string;
  source: string;
  occurredAt: string | Date;
}

interface EmailHistoryItem {
  id: string;
  eventType: string;
  occurredAt: string | Date;
}

// ---------------------------------------------------------------------------
// CSV Import Dialog
// ---------------------------------------------------------------------------

function ImportCsvDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const utils = trpc.useUtils();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [allRows, setAllRows] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState("");

  const importMutation = trpc.adminMarketing.contacts.bulkImport.useMutation({
    onSuccess: (res) => {
      toast.success(`Import complete: ${res.created} created, ${res.updated} updated, ${res.skipped} skipped`);
      void utils.adminMarketing.contacts.list.invalidate();
      onClose();
      setPreview([]); setAllRows([]);
    },
    onError: (err) => toast.error(err.message),
  });

  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
      return row;
    });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("File must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length === 0) { setError("No valid rows found"); return; }
      setError("");
      setAllRows(rows);
      setPreview(rows.slice(0, 5));
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (allRows.length === 0) return;
    const contacts = allRows.slice(0, 500).map((r) => ({
      email:       r["email"] ?? "",
      firstName:   r["firstName"] ?? r["first_name"] ?? "",
      lastName:    r["lastName"]  ?? r["last_name"]  ?? "",
      phone:       r["phone"]     ?? undefined,
      role:        r["jobTitle"]  ?? r["role"]        ?? undefined,
      companyName: r["companyName"] ?? r["company"]   ?? undefined,
    })).filter((c) => c.email);
    importMutation.mutate({ contacts, grantConsent: true });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setPreview([]); setAllRows([]); } }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Import Contacts from CSV</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Expected columns: <code>email</code> (required), <code>firstName</code>, <code>lastName</code>, <code>phone</code>, <code>jobTitle</code>, <code>companyName</code>
          </p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Choose CSV File
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {preview.length > 0 && (
            <div className="rounded border overflow-auto max-h-48">
              <table className="text-xs w-full">
                <thead className="bg-muted">
                  <tr>{Object.keys(preview[0]).map((h) => <th key={h} className="px-2 py-1 text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t">
                      {Object.values(row).map((v, j) => <td key={j} className="px-2 py-1">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground p-2">Showing first 5 of {allRows.length} rows</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} disabled={allRows.length === 0 || importMutation.isPending}>
            {importMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import {allRows.length > 0 ? `${Math.min(allRows.length, 500)} contacts` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Add/Edit Contact Dialog
// ---------------------------------------------------------------------------

function ContactDialog({
  open, onClose, contact,
}: {
  open: boolean;
  onClose: () => void;
  contact?: { id: string; firstName?: string | null; lastName?: string | null; email: string; phone?: string | null; role?: string | null; companyId?: string | null };
}) {
  const utils = trpc.useUtils();
  const [firstName,    setFirstName]    = useState(contact?.firstName ?? "");
  const [lastName,     setLastName]     = useState(contact?.lastName  ?? "");
  const [email,        setEmail]        = useState(contact?.email     ?? "");
  const [phone,        setPhone]        = useState(contact?.phone     ?? "");
  const [role,         setRole]         = useState(contact?.role      ?? "");
  const [grantConsent, setGrantConsent] = useState(false);

  const createMutation = trpc.adminMarketing.contacts.create.useMutation({
    onSuccess: () => { toast.success("Contact created"); void utils.adminMarketing.contacts.list.invalidate(); onClose(); },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.adminMarketing.contacts.update.useMutation({
    onSuccess: () => { toast.success("Contact updated"); void utils.adminMarketing.contacts.list.invalidate(); onClose(); },
    onError: (err) => toast.error(err.message),
  });

  function handleSave() {
    if (!email.trim()) { toast.error("Email is required"); return; }
    if (contact) {
      updateMutation.mutate({ id: contact.id, firstName: firstName || null, lastName: lastName || null, phone: phone || null, role: role || null });
    } else {
      createMutation.mutate({ firstName, lastName, email, phone: phone || undefined, role: role || undefined, grantConsent });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{contact ? "Edit Contact" : "Add Contact"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">First Name</label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" /></div>
            <div><label className="text-sm font-medium">Last Name</label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" /></div>
          </div>
          {!contact && (
            <div><label className="text-sm font-medium">Email *</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
          )}
          <div><label className="text-sm font-medium">Phone</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" /></div>
          <div><label className="text-sm font-medium">Job Title / Role</label><Input value={role} onChange={(e) => setRole(e.target.value)} className="mt-1" /></div>
          {!contact && (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={grantConsent} onChange={(e) => setGrantConsent(e.target.checked)} />
              Contact has given explicit consent to receive marketing emails
            </label>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {contact ? "Save Changes" : "Add Contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Contact Detail Sheet
// ---------------------------------------------------------------------------

function ContactSheet({ contactId, onClose }: { contactId: string | null; onClose: () => void }) {
  const { data } = trpc.adminMarketing.contacts.getById.useQuery(
    { id: contactId! },
    { enabled: !!contactId },
  );
  const { data: history } = trpc.adminMarketing.contacts.getEmailHistory.useQuery(
    { contactId: contactId!, take: 20, skip: 0 },
    { enabled: !!contactId },
  );

  return (
    <Sheet open={!!contactId} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent className="w-[480px] overflow-y-auto">
        <SheetHeader><SheetTitle>Contact Details</SheetTitle></SheetHeader>
        {data && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-lg">{[data.firstName, data.lastName].filter(Boolean).join(" ") || data.email}</p>
              <p className="text-sm text-muted-foreground">{data.email}</p>
              {data.role && <p className="text-sm">{data.role}</p>}
              {data.company && <p className="text-sm text-muted-foreground">{data.company.name}</p>}
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CONSENT_COLORS[data.consentStatus as ConsentStatus] ?? ""}`}>
                {data.consentStatus}
              </span>
              {data.suppressedAt && <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700">Suppressed</span>}
            </div>
            {data.consentRecords.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Consent History</p>
                <div className="space-y-1">
                  {(data.consentRecords as ConsentRecord[]).map((r) => (
                    <div key={r.id} className="text-xs text-muted-foreground flex justify-between">
                      <span>{r.action} via {r.source}</span>
                      <span>{new Date(r.occurredAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {history && history.items.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Email History</p>
                <div className="space-y-1">
                  {(history.items as EmailHistoryItem[]).map((e) => (
                    <div key={e.id} className="text-xs text-muted-foreground flex justify-between">
                      <span>{e.eventType}</span>
                      <span>{new Date(e.occurredAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ContactsPage() {
  const utils = trpc.useUtils();
  const [search,        setSearch]        = useState("");
  const [consentFilter, setConsentFilter] = useState<ConsentStatus | "ALL">("ALL");
  const [suppFilter,    setSuppFilter]    = useState<"ALL" | "YES" | "NO">("ALL");
  const [page,          setPage]          = useState(0);
  const [showImport,    setShowImport]    = useState(false);
  const [showAdd,       setShowAdd]       = useState(false);
  const [editContact,   setEditContact]   = useState<{ id: string; firstName?: string | null; lastName?: string | null; email: string; phone?: string | null; role?: string | null } | null>(null);
  const [viewId,        setViewId]        = useState<string | null>(null);
  const [suppressId,    setSuppressId]    = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const { data, isLoading } = trpc.adminMarketing.contacts.list.useQuery({
    search:        search || undefined,
    consentStatus: consentFilter === "ALL" ? undefined : consentFilter,
    suppressed:    suppFilter === "ALL" ? undefined : suppFilter === "YES",
    take:          PAGE_SIZE,
    skip:          page * PAGE_SIZE,
  });

  const suppressMutation = trpc.adminMarketing.suppression.add.useMutation({
    onSuccess: () => { toast.success("Contact suppressed"); void utils.adminMarketing.contacts.list.invalidate(); setSuppressId(null); },
    onError: (err) => toast.error(err.message),
  });

  const contacts   = (data?.items ?? []) as ContactItem[];
  const total      = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Contacts</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} contacts total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}><Upload className="mr-2 h-4 w-4" /> Import CSV</Button>
          <Button onClick={() => setShowAdd(true)}><Plus className="mr-2 h-4 w-4" /> Add Contact</Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-64" />
        <Select value={consentFilter} onValueChange={(v) => { setConsentFilter(v as ConsentStatus | "ALL"); setPage(0); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Consent</SelectItem>
            <SelectItem value="GRANTED">Granted</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REVOKED">Revoked</SelectItem>
          </SelectContent>
        </Select>
        <Select value={suppFilter} onValueChange={(v) => { setSuppFilter(v as "ALL" | "YES" | "NO"); setPage(0); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="YES">Suppressed</SelectItem>
            <SelectItem value="NO">Not Suppressed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Consent</TableHead>
              <TableHead>Suppressed</TableHead>
              <TableHead>Last Emailed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
            ) : contacts.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No contacts found</TableCell></TableRow>
            ) : contacts.map((c) => (
              <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewId(c.id)}>
                <TableCell className="font-medium">{[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}</TableCell>
                <TableCell className="text-sm">{c.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.company?.name ?? "—"}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CONSENT_COLORS[c.consentStatus as ConsentStatus] ?? ""}`}>
                    {c.consentStatus}
                  </span>
                </TableCell>
                <TableCell>{c.suppressedAt ? <span className="text-xs text-red-600 font-medium">Yes</span> : <span className="text-xs text-muted-foreground">No</span>}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.lastEmailedAt ? new Date(c.lastEmailedAt).toLocaleDateString() : "—"}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setViewId(c.id)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditContact(c)}><Edit2 className="h-4 w-4" /></Button>
                    {c.suppressedAt ? (
                      <Button variant="ghost" size="sm" title="Unsuppress" onClick={() => { /* handled via suppression page */ }}><Shield className="h-4 w-4 text-green-600" /></Button>
                    ) : (
                      <Button variant="ghost" size="sm" title="Suppress" onClick={() => setSuppressId(c.id)}><ShieldOff className="h-4 w-4 text-red-500" /></Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page + 1} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      <ImportCsvDialog open={showImport} onClose={() => setShowImport(false)} />
      <ContactDialog open={showAdd} onClose={() => setShowAdd(false)} />
      {editContact && <ContactDialog open={!!editContact} onClose={() => setEditContact(null)} contact={editContact} />}
      <ContactSheet contactId={viewId} onClose={() => setViewId(null)} />

      <AlertDialog open={!!suppressId} onOpenChange={(o) => { if (!o) setSuppressId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suppress Contact?</AlertDialogTitle>
            <AlertDialogDescription>This contact will be added to the suppression list and will not receive future marketing emails.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => {
              const contact = contacts.find((c) => c.id === suppressId);
              if (contact) suppressMutation.mutate({ email: contact.email, reason: "MANUAL" });
            }}>Suppress</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
