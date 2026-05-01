"use client";

/**
 * Admin Marketing Suppression Page — Phase B3
 */

import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

type SuppressionReason = "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "MANUAL";

const REASON_COLORS: Record<SuppressionReason, string> = {
  UNSUBSCRIBED: "bg-blue-100 text-blue-700",
  BOUNCED:      "bg-orange-100 text-orange-700",
  COMPLAINED:   "bg-red-100 text-red-700",
  MANUAL:       "bg-gray-100 text-gray-700",
};

interface SuppressionItem {
  id: string;
  email: string;
  reason: string;
  addedAt: string | Date;
}

// ---------------------------------------------------------------------------
// Add Suppression Dialog
// ---------------------------------------------------------------------------

function AddSuppressionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const utils = trpc.useUtils();
  const [email,  setEmail]  = useState("");
  const [reason, setReason] = useState<SuppressionReason>("MANUAL");
  const [note,   setNote]   = useState("");

  const addMutation = trpc.adminMarketing.suppression.add.useMutation({
    onSuccess: () => {
      toast.success("Email suppressed");
      void utils.adminMarketing.suppression.list.invalidate();
      onClose();
      setEmail(""); setNote("");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Suppression</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><label className="text-sm font-medium">Email *</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
          <div>
            <label className="text-sm font-medium">Reason *</label>
            <Select value={reason} onValueChange={(v) => setReason(v as SuppressionReason)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
                <SelectItem value="BOUNCED">Bounced</SelectItem>
                <SelectItem value="COMPLAINED">Complained</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><label className="text-sm font-medium">Note (optional)</label><Input value={note} onChange={(e) => setNote(e.target.value)} className="mt-1" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (!email.trim()) { toast.error("Email is required"); return; } addMutation.mutate({ email, reason, note: note || undefined }); }} disabled={addMutation.isPending}>
            {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Suppress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function SuppressionPage() {
  const utils = trpc.useUtils();
  const [reasonFilter, setReasonFilter] = useState<SuppressionReason | "ALL">("ALL");
  const [page,         setPage]         = useState(0);
  const [showAdd,      setShowAdd]      = useState(false);
  const [removeEmail,  setRemoveEmail]  = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const { data, isLoading } = trpc.adminMarketing.suppression.list.useQuery({
    reason: reasonFilter === "ALL" ? undefined : reasonFilter,
    take:   PAGE_SIZE,
    skip:   page * PAGE_SIZE,
  });

  const removeMutation = trpc.adminMarketing.suppression.remove.useMutation({
    onSuccess: () => { toast.success("Removed from suppression list"); void utils.adminMarketing.suppression.list.invalidate(); setRemoveEmail(null); },
    onError: (err) => toast.error(err.message),
  });

  const items      = (data?.items ?? []) as SuppressionItem[];
  const total      = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppression List</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} suppressed emails</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="mr-2 h-4 w-4" /> Add Suppression</Button>
      </div>

      <div className="flex gap-3">
        <Select value={reasonFilter} onValueChange={(v) => { setReasonFilter(v as SuppressionReason | "ALL"); setPage(0); }}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Reasons</SelectItem>
            <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
            <SelectItem value="BOUNCED">Bounced</SelectItem>
            <SelectItem value="COMPLAINED">Complained</SelectItem>
            <SelectItem value="MANUAL">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No suppressed emails</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${REASON_COLORS[item.reason as SuppressionReason] ?? ""}`}>
                    {item.reason}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(item.addedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setRemoveEmail(item.email)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
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

      <AddSuppressionDialog open={showAdd} onClose={() => setShowAdd(false)} />

      <AlertDialog open={!!removeEmail} onOpenChange={(o) => { if (!o) setRemoveEmail(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Suppression List?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{removeEmail}</strong> will be able to receive marketing emails again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeEmail && removeMutation.mutate({ email: removeEmail })}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
