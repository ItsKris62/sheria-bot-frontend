"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SESSION_TIMEOUTS } from "@/lib/session-timeouts";

interface SessionTimeoutWarningProps {
  open: boolean;
  remainingSeconds: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
  isSensitivePage: boolean;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Non-dismissible session timeout warning modal.
 *
 * Uses Radix Dialog primitives directly (not the shadcn DialogContent wrapper)
 * so we can suppress both the overlay-click and Escape-key close paths while
 * also omitting the default X close button.  Focus is trapped automatically by
 * the Radix portal.
 */
export function SessionTimeoutWarning({
  open,
  remainingSeconds,
  onStayLoggedIn,
  onLogout,
  isSensitivePage,
}: SessionTimeoutWarningProps) {
  const totalSeconds = SESSION_TIMEOUTS.WARNING_COUNTDOWN_SECONDS;
  const progressPct = Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100));

  // Colour the countdown bar: green -> amber -> red as time runs out
  const barColour =
    remainingSeconds > 30
      ? "#00875A"
      : remainingSeconds > 10
        ? "#D4A843"
        : "#EF4444";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={() => undefined}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content — onInteractOutside + onEscapeKeyDown prevented */}
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "#D4A84320" }}
            >
              {isSensitivePage ? (
                <ShieldAlert className="h-7 w-7" style={{ color: "#D4A843" }} />
              ) : (
                <Clock className="h-7 w-7" style={{ color: "#D4A843" }} />
              )}
            </div>

            <DialogPrimitive.Title className="text-xl font-semibold text-foreground">
              Session Expiring Soon
            </DialogPrimitive.Title>

            <DialogPrimitive.Description asChild>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  You have been idle and will be logged out automatically to
                  protect your account.
                </p>
                {isSensitivePage && (
                  <p className="text-xs" style={{ color: "#D4A843" }}>
                    You are on a protected page with an enhanced 5-minute
                    timeout for your security.
                  </p>
                )}
              </div>
            </DialogPrimitive.Description>
          </div>

          {/* Countdown display */}
          <div className="my-6 flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Logging out in
            </p>
            <span
              className="tabular-nums text-5xl font-bold"
              style={{ color: barColour }}
              aria-live="polite"
              aria-atomic="true"
            >
              {formatCountdown(remainingSeconds)}
            </span>

            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPct}%`, backgroundColor: barColour }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-700"
            >
              Log Out Now
            </Button>

            <Button
              onClick={onStayLoggedIn}
              className="font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: "#00875A" }}
            >
              Stay Logged In
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
