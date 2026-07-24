"use client";

/**
 * Admin Marketing Lists Page — Phase B3
 */

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Eye, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface ContactListItem {
  id: string;
  name: string;
  isDynamic: boolean;
  createdAt: string | Date;
  _count: { memberships: number };
}

interface PreviewResult {
  count: number;
  sample: { id: string; firstName?: string | null; lastName?: string | null; email: string }[];
}

interface MarketingListsFacade {
  create: {
    useMutation: (opts: {
      onSuccess: () => void;
      onError: (err: { message: string }) => void;
    }) => { mutate: (input: unknown) => void; isPending: boolean };
  };
  previewDynamic: {
    useQuery: (
      input: { filterCriteria: Record<string, unknown> },
      opts: { enabled: boolean },
    ) => { refetch: () => Promise<{ data?: PreviewResult }>; isFetching: boolean };
  };
}

// ---------------------------------------------------------------------------
// New List Dialog
// ---------------------------------------------------------------------------

function NewListDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const utils = trpc.useUtils();
  const marketingLists = trpc.adminMarketing.lists as unknown as MarketingListsFacade;
  const [step,        setStep]        = useState(1);
  const [name,        setName]        = useState("");
  const [description, setDescription] = useState("");
  const [isDynamic,   setIsDynamic]   = useState(false);
  const [filterJson,  setFilterJson]  = useState("{}");
  const [jsonError,   setJsonError]   = useState("");
  const [preview,     setPreview]     = useState<PreviewResult | null>(null);

  const createMutation = marketingLists.create.useMutation({
    onSuccess: () => {
      toast.success("List created");
      void utils.adminMarketing.lists.list.invalidate();
      onClose();
      setStep(1); setName(""); setDescription(""); setIsDynamic(false); setFilterJson("{}");
    },
    onError: (err) => toast.error(err.message),
  });

  const previewQuery = marketingLists.previewDynamic.useQuery(
    { filterCriteria: (() => { try { return JSON.parse(filterJson) as Record<string, unknown>; } catch { return {}; } })() },
    { enabled: false },
  );

  async function handlePreview() {
    try {
      JSON.parse(filterJson);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON");
      return;
    }
    const result = await previewQuery.refetch();
    if (result.data) setPreview(result.data);
  }

  function handleCreate() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    let filterCriteria: Record<string, unknown> | undefined;
    if (isDynamic) {
      try { filterCriteria = JSON.parse(filterJson) as Record<string, unknown>; }
      catch { setJsonError("Invalid JSON"); return; }
    }
    createMutation.mutate({ name, description: description || undefined, isDynamic, filterCriteria });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New Contact List — Step {step} of 2</DialogTitle></DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium">List Name *</label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="e.g. Kenyan Fintechs" /></div>
            <div><label className="text-sm font-medium">Description</label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" /></div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={!isDynamic} onChange={() => setIsDynamic(false)} /> Static (manually managed)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={isDynamic} onChange={() => setIsDynamic(true)} /> Dynamic (filter-based)
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && isDynamic && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Define filter criteria as JSON -- a raw Prisma <code>Contact</code> where clause. Any valid field is supported, including nested relations (e.g. <code>consentStatus</code>, <code>suppressedAt</code>, <code>companyId</code>, <code>role</code>, <code>tags</code>, <code>company.regulatorMix</code>). Use real JSON values, not string sentinels -- e.g. <code>suppressedAt: null</code> for &quot;not suppressed&quot;, <code>{"{ not: null }"}</code> for &quot;suppressed&quot;.</p>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono min-h-[120px]"
              value={filterJson}
              onChange={(e) => { setFilterJson(e.target.value); setJsonError(""); }}
            />
            {jsonError && <p className="text-xs text-red-500">{jsonError}</p>}
            <Button variant="outline" size="sm" onClick={handlePreview} disabled={previewQuery.isFetching}>
              {previewQuery.isFetching && <Loader2 className="mr-2 h-3 w-3 animate-spin" />} Preview
            </Button>
            {preview && (
              <div className="rounded border p-3 text-sm space-y-2">
                <p className="font-medium">{preview.count} contacts match</p>
                {preview.sample.map((c) => (
                  <p key={c.id} className="text-xs text-muted-foreground">{[c.firstName, c.lastName].filter(Boolean).join(" ") || c.email} — {c.email}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && !isDynamic && (
          <div className="text-sm text-muted-foreground">
            <p>Your static list will be created empty. You can add members from the list detail page.</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && <Button variant="outline" onClick={() => setStep(1)}>Back</Button>}
          {step === 1 ? (
            <Button onClick={() => { if (!name.trim()) { toast.error("Name is required"); return; } setStep(2); }}>Next</Button>
          ) : (
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create List
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

export default function ListsPage() {
  const utils = trpc.useUtils();
  const [page,      setPage]      = useState(0);
  const [showNew,   setShowNew]   = useState(false);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const { data, isLoading } = trpc.adminMarketing.lists.list.useQuery({ take: PAGE_SIZE, skip: page * PAGE_SIZE });

  const deleteMutation = trpc.adminMarketing.lists.delete.useMutation({
    onSuccess: () => { toast.success("List deleted"); void utils.adminMarketing.lists.list.invalidate(); setDeleteId(null); },
    onError: (err) => toast.error(err.message),
  });

  const lists      = (data?.items ?? []) as ContactListItem[];
  const total      = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contact Lists</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} lists total</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="mr-2 h-4 w-4" /> New List</Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
            ) : lists.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No lists found</TableCell></TableRow>
            ) : lists.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${l.isDynamic ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {l.isDynamic ? "Dynamic" : "Static"}
                  </span>
                </TableCell>
                <TableCell className="text-right">{l._count.memberships}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(l.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" asChild><Link href={`/admin/marketing/lists/${l.id}`}><Eye className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(l.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      <NewListDialog open={showNew} onClose={() => setShowNew(false)} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete List?</AlertDialogTitle>
            <AlertDialogDescription>This will soft-delete the list. Campaigns using this list will not be affected.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
