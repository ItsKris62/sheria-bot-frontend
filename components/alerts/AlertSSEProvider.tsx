"use client";

import { useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAlertSSE, type AlertSSEEvent } from "@/hooks/use-alert-sse";

/**
 * Headless component - renders nothing.
 *
 * Owns the single SSE connection for the authenticated session and
 * invalidates the alert unread-count cache on every NEW_ALERT event so
 * all consumers of useAlertNotifications() update in real-time.
 *
 * Must be rendered inside the tRPC provider tree (it is - dashboard layout
 * sits inside <Providers /> which wraps the tRPC client).
 */
export function AlertSSEProvider(): null {
  const utils = trpc.useUtils();

  const handleAlertEvent = useCallback((_event: AlertSSEEvent) => {
    utils.alert.getUnreadCount.invalidate();
  }, [utils]);

  useAlertSSE(handleAlertEvent);

  return null;
}
