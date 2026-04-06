"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { trpc, setAccessToken } from "@/lib/trpc";
import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase-client";
import {
  SESSION_TIMEOUTS,
  LOGOUT_SIGNAL_KEY,
  SESSION_EXPIRED_FLAG,
} from "@/lib/session-timeouts";

export interface UseIdleTimeoutReturn {
  /** Whether the warning modal should be shown */
  showWarning: boolean;
  /** Remaining seconds in the countdown (meaningful when showWarning is true) */
  remainingSeconds: number;
  /** Call when the user clicks "Stay Logged In" */
  resetTimer: () => void;
  /** Call to trigger immediate logout */
  logout: () => void;
  /** Whether the current page is considered sensitive */
  isSensitivePage: boolean;
}

export function useIdleTimeout(): UseIdleTimeoutReturn {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showWarning, setShowWarning] = useState(false);
  // Explicit number type — WARNING_COUNTDOWN_SECONDS is a literal (60) due to as const,
  // which would otherwise infer useState<60> and make setRemainingSeconds reject numbers.
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    SESSION_TIMEOUTS.WARNING_COUNTDOWN_SECONDS,
  );

  // Refs for mutable state — avoids stale closures in event handlers
  const lastActivityRef = useRef<number>(Date.now());
  const showWarningRef = useRef<boolean>(false);
  const isLoggingOutRef = useRef<boolean>(false);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs for stable function references used inside event listener effects
  const scheduleWarningRef = useRef<() => void>(() => undefined);
  const heartbeatMutateRef = useRef<() => void>(() => undefined);
  const performLogoutRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const logoutMutation = trpc.auth.logout.useMutation();
  const heartbeatMutation = trpc.session.heartbeat.useMutation();

  const isSensitivePage = SESSION_TIMEOUTS.SENSITIVE_ROUTES.some(
    (prefix) => pathname.startsWith(prefix),
  );

  const effectiveTimeout = isSensitivePage
    ? SESSION_TIMEOUTS.SENSITIVE_IDLE_MS
    : SESSION_TIMEOUTS.GLOBAL_IDLE_MS;

  // Keep showWarningRef in sync with state
  const setWarning = useCallback((value: boolean) => {
    showWarningRef.current = value;
    setShowWarning(value);
  }, []);

  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current !== null) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Core logout sequence — idempotent via isLoggingOutRef guard
  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    clearAllTimers();

    if (typeof window !== "undefined") {
      // Signal other tabs to also log out
      localStorage.setItem(LOGOUT_SIGNAL_KEY, String(Date.now()));
      // Flag so the login page can show the "session expired" banner
      sessionStorage.setItem(SESSION_EXPIRED_FLAG, "1");
    }

    try {
      await logoutMutation.mutateAsync();
      await supabase.auth.signOut();
    } catch {
      // Clean up locally regardless of server errors
    }

    queryClient.clear();
    setAccessToken(null);
    useAuthStore.getState().clearAuth();
    router.push("/login?reason=session_expired");
  }, [clearAllTimers, logoutMutation, queryClient, router]);

  // Schedule the warning timer relative to right now
  const scheduleWarning = useCallback(() => {
    clearAllTimers();
    setWarning(false);
    setRemainingSeconds(SESSION_TIMEOUTS.WARNING_COUNTDOWN_SECONDS);

    const warningDelay =
      effectiveTimeout - SESSION_TIMEOUTS.WARNING_COUNTDOWN_SECONDS * 1000;

    warningTimerRef.current = setTimeout(() => {
      setWarning(true);
      setRemainingSeconds(SESSION_TIMEOUTS.WARNING_COUNTDOWN_SECONDS);

      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }, warningDelay);
  }, [clearAllTimers, effectiveTimeout, setWarning]);

  // Keep stable refs pointing at the latest versions of these functions
  // so the single-registration event listener useEffect can always call current logic
  useEffect(() => {
    scheduleWarningRef.current = scheduleWarning;
  }, [scheduleWarning]);

  useEffect(() => {
    heartbeatMutateRef.current = () => heartbeatMutation.mutate();
  }, [heartbeatMutation]);

  useEffect(() => {
    performLogoutRef.current = performLogout;
  }, [performLogout]);

  // Public: reset the idle timer and send a heartbeat to keep the backend session alive
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    heartbeatMutation.mutate();
    scheduleWarning();
  }, [heartbeatMutation, scheduleWarning]);

  // Public: immediate logout (e.g. user clicks "Log Out Now")
  const logout = useCallback(() => {
    void performLogout();
  }, [performLogout]);

  // Auto-logout when countdown reaches 0
  useEffect(() => {
    if (remainingSeconds === 0 && showWarning) {
      void performLogout();
    }
    // performLogout is stable (clearAllTimers + logoutMutation are stable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, showWarning]);

  // Recalculate timer position when the effective timeout changes (route navigation).
  // This runs on mount (initial setup) and whenever the user navigates between
  // sensitive and non-sensitive pages.
  useEffect(() => {
    const elapsed = Date.now() - lastActivityRef.current;
    const warningThreshold =
      effectiveTimeout - SESSION_TIMEOUTS.WARNING_COUNTDOWN_SECONDS * 1000;

    if (elapsed >= effectiveTimeout) {
      // Already past the timeout — log out immediately
      void performLogoutRef.current();
      return;
    }

    if (elapsed >= warningThreshold) {
      // Already in the warning window — show countdown with correct remaining time
      clearAllTimers();
      const remaining = Math.ceil((effectiveTimeout - elapsed) / 1000);
      setWarning(true);
      setRemainingSeconds(Math.max(1, remaining));

      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
      return;
    }

    // Normal case: schedule the warning for the remaining idle-until-warning duration
    const delay = warningThreshold - elapsed;
    clearAllTimers();
    setWarning(false);

    warningTimerRef.current = setTimeout(() => {
      setWarning(true);
      setRemainingSeconds(SESSION_TIMEOUTS.WARNING_COUNTDOWN_SECONDS);

      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }, delay);

    return clearAllTimers;
    // clearAllTimers is stable; effectiveTimeout drives this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveTimeout]);

  // Activity event listeners — registered once, read mutable state via refs
  useEffect(() => {
    let isThrottled = false;

    const handleActivity = () => {
      // If the warning modal is showing, any activity resets the timer immediately
      if (showWarningRef.current) {
        lastActivityRef.current = Date.now();
        heartbeatMutateRef.current();
        scheduleWarningRef.current();
        return;
      }

      // Outside warning phase: throttle lastActivity updates to avoid churning
      if (isThrottled) return;
      isThrottled = true;
      lastActivityRef.current = Date.now();

      setTimeout(() => {
        isThrottled = false;
      }, SESSION_TIMEOUTS.ACTIVITY_THROTTLE_MS);
    };

    SESSION_TIMEOUTS.ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      SESSION_TIMEOUTS.ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []); // Empty deps: listeners are set up once; all mutable state accessed via refs

  // Cross-tab logout sync: when one tab writes LOGOUT_SIGNAL_KEY, other tabs log out too
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOGOUT_SIGNAL_KEY && e.newValue) {
        // Another tab logged out — mirror the logout here without re-writing the key
        clearAllTimers();
        setAccessToken(null);
        useAuthStore.getState().clearAuth();
        queryClient.clear();
        router.replace("/login?reason=session_expired");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [clearAllTimers, queryClient, router]);

  // Cleanup on unmount
  useEffect(() => clearAllTimers, [clearAllTimers]);

  return {
    showWarning,
    remainingSeconds,
    resetTimer,
    logout,
    isSensitivePage,
  };
}
