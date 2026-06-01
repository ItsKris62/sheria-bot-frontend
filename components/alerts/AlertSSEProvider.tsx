"use client";

import { useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAlertSSE, type AlertSSEEvent } from "@/hooks/use-alert-sse";
import { playNotificationSound, soundForAlertSeverity } from "@/lib/notification-sounds";

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
  const { data: prefs } = trpc.user.getNotificationPreferences.useQuery(undefined, {
    staleTime: 60_000,
  });

  const handleAlertEvent = useCallback((event: AlertSSEEvent) => {
    utils.alert.getUnreadCount.invalidate();
    if (prefs && (prefs.inAppSoundsEnabled ?? true)) {
      playNotificationSound(soundForAlertSeverity(event.severity));
    }
  }, [prefs?.inAppSoundsEnabled, utils]);

  useAlertSSE(handleAlertEvent);

  return null;
}
