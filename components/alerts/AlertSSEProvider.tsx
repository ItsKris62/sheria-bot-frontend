"use client";

import { useCallback, useEffect, useRef } from "react";
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

  // Keep prefs in a ref so the callback always reads the latest value without
  // needing to be recreated (and without triggering SSE reconnects).
  const prefsRef = useRef(prefs);
  useEffect(() => {
    prefsRef.current = prefs;
  });

  const handleAlertEvent = useCallback((event: AlertSSEEvent) => {
    utils.alert.getUnreadCount.invalidate();
    const currentPrefs = prefsRef.current;
    if (!currentPrefs || (currentPrefs.inAppSoundsEnabled ?? true)) {
      playNotificationSound(soundForAlertSeverity(event.severity));
    }
  }, [utils]);

  useAlertSSE(handleAlertEvent);

  return null;
}
