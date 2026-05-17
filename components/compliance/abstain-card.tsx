"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, BookOpen, ExternalLink, MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Authority registry ────────────────────────────────────────────────────────

interface Authority {
  code: string;
  name: string;
  url: string;
}

const AUTHORITIES: Authority[] = [
  { code: "CBK",  name: "Central Bank of Kenya",              url: "https://www.centralbank.go.ke" },
  { code: "FRC",  name: "Financial Reporting Centre",         url: "https://frc.or.ke" },
  { code: "ODPC", name: "Office of the Data Protection Commissioner", url: "https://www.odpc.go.ke" },
  { code: "IRA",  name: "Insurance Regulatory Authority",     url: "https://www.ira.go.ke" },
  { code: "CMA",  name: "Capital Markets Authority",          url: "https://www.cma.or.ke" },
];

const ALL_AUTHORITY_CODES = AUTHORITIES.map((a) => a.code);

function selectAuthorityCodes(question: string): string[] {
  const matched: string[] = [];
  if (/aml|aml\/cft|anti[\s-]?money|financial intel|terrorist financ|cft/i.test(question)) matched.push("FRC");
  if (/data[\s-]?protect|odpc|privacy|personal[\s-]?data/i.test(question)) matched.push("ODPC");
  if (/payment|central bank|cbk|mobile[\s-]?money|e[\s-]?money|nps act|psp/i.test(question)) matched.push("CBK");
  if (/insur|ira\b|underwriting|reinsur/i.test(question)) matched.push("IRA");
  if (/capital[\s-]?market|cma\b|securit|nse\b|exchange|bonds?|equit/i.test(question)) matched.push("CMA");
  return matched.length > 0 ? matched : ALL_AUTHORITY_CODES;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AbstainCardProps {
  queryId: string;
  /** null on legacy path or double-failure — disables "Tell us what's missing" button */
  runId: string | null;
  /** The original question text — used for keyword-based authority selection */
  question: string;
  /** Determines which copy variant to show */
  route: string | null;
  className?: string;
}

// ── GapForm (inline feedback form) ───────────────────────────────────────────

interface GapFormProps {
  queryId: string;
  runId: string;
  onClose: () => void;
}

function GapForm({ queryId, runId, onClose }: GapFormProps) {
  const [suggestedDocument, setSuggestedDocument] = useState("");
  const [notes, setNotes] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  const reportGap = trpc.compliance.reportGap.useMutation({
    onSuccess: () => {
      toast.success("Thanks — your feedback helps us prioritise corpus additions.");
      onClose();
    },
    onError: (err) => {
      toast.error(err.message ?? "Something went wrong. Please try again.");
    },
  });

  // Escape to cancel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus first field on mount
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    reportGap.mutate({
      queryId,
      runId,
      suggestedDocument: suggestedDocument.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div
      role="form"
      aria-label="Report a corpus gap"
      className="mt-4 rounded-md border border-border bg-muted/30 p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Tell us what's missing</p>
        <button
          type="button"
          aria-label="Close form"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gap-suggested-doc" className="text-sm text-muted-foreground">
          Suggested document or regulation <span className="text-xs">(optional)</span>
        </Label>
        <Input
          id="gap-suggested-doc"
          ref={firstInputRef}
          value={suggestedDocument}
          onChange={(e) => setSuggestedDocument(e.target.value)}
          maxLength={500}
          placeholder="e.g. CBK Non-Deposit Taking Credit Providers Regulations 2024"
          disabled={reportGap.isPending}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gap-notes" className="text-sm text-muted-foreground">
          Additional context <span className="text-xs">(optional)</span>
        </Label>
        <Textarea
          id="gap-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          placeholder="What specific provision or threshold were you looking for?"
          disabled={reportGap.isPending}
          className="bg-background resize-none min-h-[80px]"
        />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={reportGap.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={reportGap.isPending}
        >
          {reportGap.isPending ? "Submitting…" : "Submit feedback"}
        </Button>
      </div>
    </div>
  );
}

// ── AbstainCard ───────────────────────────────────────────────────────────────

export function AbstainCard({ queryId, runId, question, route, className }: AbstainCardProps) {
  const [formOpen, setFormOpen] = useState(false);

  const isRouteScopeAbstain = route === "abstain";
  const authorityCodes = isRouteScopeAbstain ? [] : selectAuthorityCodes(question);
  const authorities = AUTHORITIES.filter((a) => authorityCodes.includes(a.code));

  return (
    <Card
      className={cn(
        "border",
        isRouteScopeAbstain
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-blue-500/30 bg-blue-500/5",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          {isRouteScopeAbstain ? (
            <>
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
              <span>This question is outside SheriaBot's scope</span>
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 text-blue-500 shrink-0" aria-hidden="true" />
              <span>This regulation isn't currently in SheriaBot's indexed corpus</span>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm text-muted-foreground">
        {isRouteScopeAbstain ? (
          <p>
            SheriaBot specialises in Kenyan fintech compliance — banking, payments, lending, data
            protection, AML/CFT, and related regulations supervised by CBK, ODPC, FRC, IRA, and
            CMA. For questions outside this domain, a specialist resource or regulator would be
            better placed to help.
          </p>
        ) : (
          <>
            <p>
              SheriaBot grounds every answer in specific cited regulatory documents. The relevant
              regulation hasn't been indexed yet, so we can't provide a verified answer.
            </p>

            <div>
              <p className="font-medium text-foreground mb-2">Consider checking directly with:</p>
              <ul className="space-y-1" aria-label="Relevant regulatory authorities">
                {authorities.map((auth) => (
                  <li key={auth.code} className="flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <a
                      href={auth.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground hover:underline transition-colors"
                    >
                      <span className="font-medium text-foreground">{auth.code}</span>
                      {" — "}
                      {auth.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={runId === null}
            onClick={() => setFormOpen((v) => !v)}
            aria-expanded={formOpen}
            aria-controls="abstain-gap-form"
            title={
              runId === null
                ? "Not available — run record not written (legacy path)"
                : "Report a missing document or regulation"
            }
            className="gap-1.5"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
            Tell us what's missing
          </Button>
          {runId === null && (
            <p className="mt-1 text-xs text-muted-foreground/70" role="note">
              Feedback unavailable on this result.
            </p>
          )}
        </div>

        {formOpen && runId !== null && (
          <div id="abstain-gap-form">
            <GapForm
              queryId={queryId}
              runId={runId}
              onClose={() => setFormOpen(false)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
