"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UngroundedBannerProps {
  className?: string;
}

export function UngroundedBanner({ className }: UngroundedBannerProps) {
  return (
    <div
      role="note"
      aria-label="Limited regulatory grounding warning"
      className={cn(
        "flex gap-3 rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm",
        className,
      )}
    >
      <Info
        className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="font-medium text-foreground">
          Answer has limited regulatory grounding
        </p>
        <p className="text-muted-foreground">
          SheriaBot generated this response but could not fully verify it
          against indexed regulatory documents. Treat it as a starting point
          and confirm key provisions directly with the relevant regulator or
          legal counsel before acting on it.
        </p>
      </div>
    </div>
  );
}
