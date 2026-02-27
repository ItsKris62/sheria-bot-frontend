"use client";

import { trpc } from "@/lib/trpc";

/** List notifications for the current user */
export function useNotifications(options?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
}) {
  return trpc.notification.list.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 20,
    unreadOnly: options?.unreadOnly,
    type: options?.type,
  });
}

/**
 * Poll unread notification count.
 * Refetches every 30 seconds so the notification badge stays fresh.
 */
export function useUnreadCount() {
  return trpc.notification.getUnreadCount.useQuery(undefined, {
    refetchInterval: 30_000,
  });
}

/** Notification mutations: mark-as-read, mark-all-as-read, delete */
export function useNotificationActions() {
  const utils = trpc.useUtils();

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      utils.notification.list.invalidate();
      utils.notification.getUnreadCount.invalidate();
    },
  });

  const markAllAsReadMutation = trpc.notification.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notification.list.invalidate();
      utils.notification.getUnreadCount.invalidate();
    },
  });

  const deleteNotificationMutation = trpc.notification.delete.useMutation({
    onSuccess: () => {
      utils.notification.list.invalidate();
      utils.notification.getUnreadCount.invalidate();
    },
  });

  const deleteAllReadMutation = trpc.notification.deleteAllRead.useMutation({
    onSuccess: () => {
      utils.notification.list.invalidate();
    },
  });

  return {
    markAsRead: (notificationId: string) =>
      markAsReadMutation.mutateAsync({ notificationId }),
    isMarkingAsRead: markAsReadMutation.isPending,

    markAllAsRead: () => markAllAsReadMutation.mutateAsync(),
    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    deleteNotification: (notificationId: string) =>
      deleteNotificationMutation.mutateAsync({ notificationId }),
    isDeleting: deleteNotificationMutation.isPending,

    deleteAllRead: () => deleteAllReadMutation.mutateAsync(),
    isDeletingAllRead: deleteAllReadMutation.isPending,
  };
}

/** Load and update notification preferences */
export function useNotificationPreferences() {
  return trpc.notification.getPreferences.useQuery();
}

export function useUpdateNotificationPreferences() {
  const utils = trpc.useUtils();

  return trpc.notification.updatePreferences.useMutation({
    onSuccess: () => {
      utils.notification.getPreferences.invalidate();
    },
  });
}
