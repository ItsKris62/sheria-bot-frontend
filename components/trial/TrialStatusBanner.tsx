"use client";

import React from "react";
import { Clock, AlertCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePlan } from "@/lib/plan-context";

/**
 * TrialStatusBanner
 *
 * Displayed at the top of the dashboard when the user is on a FREE_TRIAL plan.
 * Shows days remaining, per-feature usage bars, and an upgrade CTA.
 *
 * Hidden when the user is not on FREE_TRIAL or plan data is loading.
 */
export function TrialStatusBanner() {
  const { plan, trial, isLoading } = usePlan();

  if (isLoading) return null;
  if (plan !== "FREE_TRIAL" || !trial) return null;

  const { daysRemaining, usage, limits } = trial;

  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 2;
  const isExpired      = daysRemaining !== null && daysRemaining <= 0;

  const usageItems: Array<{ label: string; current: number; limit: number }> = [
    { label: "Queries",    current: usage.complianceQueries, limit: limits.complianceQueries },
    { label: "Analyses",   current: usage.gapAnalyses,       limit: limits.gapAnalyses },
    { label: "Checklists", current: usage.checklists,        limit: limits.checklists },
    { label: "Vault",      current: usage.vaultUploads,      limit: limits.vaultUploads },
  ];

  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        isExpired
          ? "border-destructive/30 bg-destructive/5"
          : isExpiringSoon
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-primary/20 bg-primary/5"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: timer + usage */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            ) : isExpiringSoon ? (
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
            ) : (
              <Clock className="h-4 w-4 text-primary shrink-0" />
            )}
            <span className="text-sm font-medium">
              {isExpired
                ? "Your free trial has expired"
                : daysRemaining === 1
                ? "1 day left in your free trial"
                : `${daysRemaining} days left in your free trial`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
            {usageItems.map(({ label, current, limit }) => {
              const pct = Math.min(100, Math.round((current / limit) * 100));
              const isFull = pct >= 100;
              return (
                <div key={label} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{label}</span>
                    <span className={isFull ? "text-destructive font-medium" : ""}>
                      {current}/{limit}
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? "bg-destructive" : pct >= 80 ? "bg-amber-500" : "bg-primary"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: upgrade CTA */}
        <div className="shrink-0 flex items-center gap-2">
          <Button size="sm" asChild>
            <a href="/settings/billing">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              Upgrade
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
