"use client";

import React from "react";
import { Zap, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePlan } from "@/lib/plan-context";
import { trpc } from "@/lib/trpc";

/**
 * TrialCtaBanner
 *
 * Displayed to REGULATOR-plan users who have never activated the free trial
 * (isEligible === true). Prompts them to start the 7-day free premium trial.
 *
 * Hidden when:
 *  - The user is already on a paid plan or FREE_TRIAL
 *  - The user has already used their trial (isEligible === false)
 *  - Plan data is still loading
 */
export function TrialCtaBanner() {
  const { plan, trial, isLoading } = usePlan();
  const utils = trpc.useUtils();

  const activate = trpc.trial.activate.useMutation({
    onSuccess: () => {
      // Refetch plan data so PlanProvider picks up FREE_TRIAL immediately
      void utils.billing.getPlanAndUsage.invalidate();
    },
  });

  // Only show to eligible REGULATOR users
  if (isLoading) return null;
  if (plan !== "REGULATOR") return null;
  if (trial && !trial.isEligible) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 mt-0.5 shrink-0">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sm">Start your free 7-day premium trial</p>
            <p className="text-xs text-muted-foreground max-w-md">
              Get full access to AI Policy Generation, Gap Analysis, Compliance Checklists,
              and Document Vault — no credit card required.
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {[
                "25 compliance queries",
                "5 gap analyses",
                "5 checklists",
                "10 vault uploads",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            7 days free
          </span>
          <Button
            size="sm"
            onClick={() => activate.mutate()}
            disabled={activate.isPending}
          >
            {activate.isPending ? "Activating…" : "Start Free Trial"}
          </Button>
        </div>
      </CardContent>

      {activate.isError && (
        <p className="px-6 pb-4 text-xs text-destructive">
          {activate.error?.message ?? "Failed to activate trial. Please try again."}
        </p>
      )}
    </Card>
  );
}
