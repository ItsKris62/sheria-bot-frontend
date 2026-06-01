"use client"

export type NotificationSound =
  | "notification"
  | "alert"
  | "chat-complete"
  | "success"
  | "error"

type NotificationLike = {
  type?: string | null
  category?: string | null
  title?: string | null
  message?: string | null
}

const R2_BASE = process.env.NEXT_PUBLIC_R2_ASSETS_URL ?? ""

const SOUND_FILES: Record<NotificationSound, string> = {
  notification: "1._notification.mp3__#2-1780311183113.mp3",
  alert: "2._alert.mp3_\u2014_needs_#1-1780311229392.mp3",
  "chat-complete": "3._chat-complete.mp3_#3-1780311278177.mp3",
  success: "4._success.mp3_\u2014_pos_#2-1780310649039.wav",
  error: "5._error.mp3_\u2014_error_#2-1780310599118.wav",
}

const VOLUMES: Record<NotificationSound, number> = {
  notification: 0.42,
  alert: 0.5,
  "chat-complete": 0.28,
  success: 0.45,
  error: 0.58,
}

const ATTENTION_TYPES = new Set([
  "COMPLIANCE_ALERT",
  "TICKET_RESPONSE",
  "CHECKLIST_GENERATED",
  "GAP_ANALYSIS_COMPLETED",
  "POLICY_READY",
  "REPORT_READY",
  "REQUIREMENT_DUE",
])

const PASSIVE_TYPES = new Set([
  "DOCUMENT_PROCESSED",
  "PROFILE_UPDATED",
  "MEMBER_JOINED",
  "SUBSCRIPTION_CHANGED",
  "SYSTEM_ANNOUNCEMENT",
  "EVENT_REMINDER",
])

const SUCCESS_TYPES = new Set([
  "PAYMENT_RECEIVED",
  "SUBSCRIPTION_UPGRADED",
  "GENERATION_SUCCESS",
  "PASSWORD_CHANGED",
])

const ERROR_TYPES = new Set([
  "PASSWORD_CHANGE_FAILED",
  "LOGIN_NEW_DEVICE",
  "ACCOUNT_SUSPENDED",
  "PAYMENT_FAILED",
])

let soundsEnabled = true
const audioCache = new Map<NotificationSound, HTMLAudioElement>()

function soundUrl(sound: NotificationSound): string | null {
  if (!R2_BASE) return null
  return `${R2_BASE.replace(/\/$/, "")}/sounds/${encodeURIComponent(SOUND_FILES[sound])}`
}

function getAudio(sound: NotificationSound): HTMLAudioElement | null {
  if (typeof window === "undefined") return null

  const cached = audioCache.get(sound)
  if (cached) return cached

  const url = soundUrl(sound)
  if (!url) return null

  const audio = new Audio(url)
  audio.preload = "auto"
  audio.volume = VOLUMES[sound]
  audioCache.set(sound, audio)
  return audio
}

export function setNotificationSoundsEnabled(enabled: boolean) {
  soundsEnabled = enabled
}

export function playNotificationSound(sound: NotificationSound) {
  if (!soundsEnabled) return

  const audio = getAudio(sound)
  if (!audio) return

  audio.currentTime = 0
  audio.volume = VOLUMES[sound]
  void audio.play().catch(() => {
    // Browser autoplay policy can block sounds until the user interacts.
  })
}

export function soundForNotification(notification: NotificationLike): NotificationSound {
  const type = notification.type?.toUpperCase() ?? ""
  const category = notification.category?.toUpperCase() ?? ""
  const text = `${notification.title ?? ""} ${notification.message ?? ""}`.toUpperCase()

  if (ERROR_TYPES.has(type) || text.includes("FAILED") || text.includes("SUSPENDED") || text.includes("CRITICAL")) {
    return "error"
  }

  if (SUCCESS_TYPES.has(type) || text.includes("SUCCESS") || text.includes("PAYMENT RECEIVED") || text.includes("UPGRADED")) {
    return "success"
  }

  if (category === "SECURITY") {
    return "error"
  }

  if (ATTENTION_TYPES.has(type) || category === "COMPLIANCE" || category === "SUPPORT") {
    return "alert"
  }

  if (PASSIVE_TYPES.has(type)) {
    return "notification"
  }

  return "notification"
}

export function soundForAlertSeverity(severity?: string | null): NotificationSound {
  return severity?.toUpperCase() === "CRITICAL" ? "error" : "alert"
}
