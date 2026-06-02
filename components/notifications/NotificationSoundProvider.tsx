"use client"

import { useEffect, useRef } from "react"
import { trpc } from "@/lib/trpc"
import {
  playNotificationSound,
  setNotificationSoundsEnabled,
  soundForNotification,
} from "@/lib/notification-sounds"

type NotificationItem = {
  id: string
  type: string
  category: string
  title: string
  message: string
  read: boolean
  createdAt: Date | string
}

export function NotificationSoundProvider(): null {
  const { data: prefs } = trpc.user.getNotificationPreferences.useQuery(undefined, {
    staleTime: 60_000,
  })
  // Default to true while prefs are loading so the module-level flag stays
  // enabled until we know the user's actual preference.
  const soundsEnabled = prefs ? (prefs.inAppSoundsEnabled ?? true) : true
  const previousUnreadCount = useRef<number | null>(null)
  const lastPlayedId = useRef<string | null>(null)

  const unreadCountQuery = trpc.notification.getUnreadCount.useQuery(undefined, {
    refetchInterval: 30_000,
  })

  const notificationsQuery = trpc.notification.list.useQuery(
    { page: 1, limit: 1, unreadOnly: true },
    {
      enabled: soundsEnabled,
      refetchInterval: 30_000,
    }
  )

  // Keep the refetch function in a stable ref so the count-change effect
  // doesn't need it in its dependency array (avoids spurious re-runs).
  const refetchNotifications = notificationsQuery.refetch
  const refetchRef = useRef(refetchNotifications)
  useEffect(() => {
    refetchRef.current = refetchNotifications
  })

  useEffect(() => {
    setNotificationSoundsEnabled(soundsEnabled)
  }, [soundsEnabled])

  useEffect(() => {
    const currentCount = unreadCountQuery.data?.count ?? 0
    const previousCount = previousUnreadCount.current
    previousUnreadCount.current = currentCount

    if (!soundsEnabled || previousCount === null || currentCount <= previousCount) {
      return
    }

    void refetchRef.current().then(({ data }) => {
      const latestUnread = (data?.items?.[0] ?? null) as NotificationItem | null
      if (!latestUnread || latestUnread.id === lastPlayedId.current) return

      lastPlayedId.current = latestUnread.id
      playNotificationSound(soundForNotification(latestUnread))
    })
  }, [soundsEnabled, unreadCountQuery.data?.count])

  return null
}
