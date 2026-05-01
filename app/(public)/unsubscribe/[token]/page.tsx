"use client";

/**
 * Public Unsubscribe Page — Phase B4-1
 * Tokenized unsubscribe link handler (RFC 8058 compliant)
 */

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";

export default function UnsubscribePage() {
  const params = useParams<{ token: string }>();
  const token  = params.token;

  const [confirmed, setConfirmed] = useState(false);
  const [kept,      setKept]      = useState(false);

  // Validate token on load
  const { data: validation, isLoading: validating, error: validationError } =
    trpc.publicMarketing.validateUnsubscribeToken.useQuery(
      { token },
      { retry: false },
    );

  const unsubscribeMutation = trpc.publicMarketing.unsubscribe.useMutation({
    onSuccess: () => setConfirmed(true),
    onError:   (err: { message: string }) => toast.error(err.message),
  });

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Validating your unsubscribe link…</p>
        </div>
      </div>
    );
  }

  if (validationError || !validation?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-semibold">Invalid Link</h1>
          <p className="text-muted-foreground">
            This unsubscribe link is invalid or has already been used.
          </p>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="text-xl font-semibold">You have been unsubscribed</h1>
          <p className="text-muted-foreground">
            You will no longer receive marketing emails from SheriaBot.
          </p>
          <p className="text-sm text-muted-foreground">
            If you unsubscribed by mistake, please contact{" "}
            <a href="mailto:support@sheriabot.com" className="underline">support@sheriabot.com</a>.
          </p>
        </div>
      </div>
    );
  }

  if (kept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <Mail className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-xl font-semibold">You&apos;re still subscribed</h1>
          <p className="text-muted-foreground">
            No changes were made. You will continue to receive marketing emails from SheriaBot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Mail className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Unsubscribe</h1>
          <p className="text-muted-foreground">
            You are unsubscribing{" "}
            <strong className="text-foreground">{validation.email}</strong>{" "}
            from SheriaBot marketing emails.
          </p>
        </div>

        <div className="rounded-lg border p-4 bg-muted/30 text-sm text-muted-foreground">
          <p>
            Once unsubscribed, you will no longer receive product updates, newsletters, or
            promotional emails from SheriaBot. Transactional emails (billing, security alerts)
            will not be affected.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => unsubscribeMutation.mutate({ token })}
            disabled={unsubscribeMutation.isPending}
          >
            {unsubscribeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Unsubscribe
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setKept(true)}
            disabled={unsubscribeMutation.isPending}
          >
            Keep me subscribed
          </Button>
        </div>
      </div>
    </div>
  );
}
