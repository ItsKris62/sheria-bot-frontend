"use client";

import { useCallback } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Returns the current alert unread count and mutations for the Alerts tab.
 *
 * The count is kept fresh by two mechanisms:
 *  1. AlertSSEProvider invalidates it in real-time on every NEW_ALERT event.
 *  2. A 60-second refetchInterval acts as a fallback if the SSE connection drops.
 */
export function useAlertNotifications() {
  const utils = trpc.useUtils();

  const unreadCountQuery = trpc.alert.getUnreadCount.useQuery(undefined, {
    refetchInterval: 60_000,
  });

  const markAllAsReadMutation = trpc.alert.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.alert.getUnreadCount.invalidate();
    },
  });

  const invalidateUnreadCount = useCallback(() => {
    utils.alert.getUnreadCount.invalidate();
  }, [utils]);

  return {
    alertUnreadCount: unreadCountQuery.data?.count ?? 0,
    isLoading: unreadCountQuery.isLoading,
    markAllAsRead: () => markAllAsReadMutation.mutate(undefined),
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    invalidateUnreadCount,
  };
}
