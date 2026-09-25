"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShieldAlert, Loader2 } from "lucide-react";

export interface StepUpChallengeRequest {
  onSuccess: () => Promise<void> | void;
  onCancel: () => void;
}

type StepUpListener = (request: StepUpChallengeRequest | null) => void;
let activeListener: StepUpListener | null = null;

export function requestStepUpChallenge(request: StepUpChallengeRequest) {
  if (activeListener) {
    activeListener(request);
  } else {
    request.onCancel();
  }
}

export function StepUpModal() {
  const [currentRequest, setCurrentRequest] = useState<StepUpChallengeRequest | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const verifyStepUpMutation = trpc.user.verifyStepUp.useMutation();

  useEffect(() => {
    activeListener = (req) => {
      setCurrentRequest(req);
      setCode("");
      setError(null);
    };
    return () => {
      activeListener = null;
    };
  }, []);

  const isOpen = Boolean(currentRequest);

  const handleClose = () => {
    if (currentRequest) {
      currentRequest.onCancel();
    }
    setCurrentRequest(null);
    setCode("");
    setError(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length < 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    try {
      setError(null);
      await verifyStepUpMutation.mutateAsync({
        code: code.trim(),
      });

      const req = currentRequest;
      setCurrentRequest(null);
      if (req) {
        await req.onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid verification code. Please try again.";
      setError(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <DialogTitle>Step-Up Authentication Required</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            This administrative operation requires fresh multi-factor verification. Please enter the 6-digit code from your authenticator app to proceed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-4 py-2">
          <div className="space-y-2">
            <Input
              id="step-up-mfa-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-2xl tracking-widest font-mono h-12"
              autoFocus
              disabled={verifyStepUpMutation.isPending}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={verifyStepUpMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={verifyStepUpMutation.isPending || code.trim().length < 6}
            >
              {verifyStepUpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Proceed"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
