/**
 * Compliance Score Theme Utility
 *
 * Returns styling tokens and metadata for any compliance score (0–100).
 * Used across the dashboard and any page that renders compliance scores.
 *
 * Thresholds:
 *  0–39   → Red     (Critical)
 *  40–59  → Orange  (Poor)
 *  60–74  → Amber   (Moderate)
 *  75–89  → Green   (Good)
 *  90–100 → Emerald (Excellent)
 */

export type ComplianceScoreIcon =
  | 'alert-triangle'   // 0–39   critical
  | 'alert-circle'     // 40–59  needs attention
  | 'info'             // 60–74  room for improvement
  | 'check-circle'     // 75–89  on track
  | 'shield-check';    // 90–100 secure/compliant

export interface ComplianceScoreTheme {
  /** Hex color for inline styles */
  color: string;
  /** Tailwind text color class */
  tailwindText: string;
  /** Tailwind solid background class */
  tailwindBg: string;
  /** Tailwind muted/translucent background for progress track */
  tailwindBgMuted: string;
  /** Icon identifier — map to Lucide component in consuming code */
  icon: ComplianceScoreIcon;
  /** Short human-readable label */
  label: string;
}

/**
 * Returns color, icon, and label tokens for a compliance score value.
 *
 * @param score - Number in the range 0–100.
 * @returns A fully typed `ComplianceScoreTheme` object.
 */
export function getComplianceScoreTheme(score: number): ComplianceScoreTheme {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  if (clamped >= 90) {
    return {
      color: '#10B981',
      tailwindText: 'text-emerald-500',
      tailwindBg: 'bg-emerald-500',
      tailwindBgMuted: 'bg-emerald-500/15',
      icon: 'shield-check',
      label: 'Excellent',
    };
  }

  if (clamped >= 75) {
    return {
      color: '#22C55E',
      tailwindText: 'text-green-500',
      tailwindBg: 'bg-green-500',
      tailwindBgMuted: 'bg-green-500/15',
      icon: 'check-circle',
      label: 'Good',
    };
  }

  if (clamped >= 60) {
    return {
      color: '#EAB308',
      tailwindText: 'text-yellow-500',
      tailwindBg: 'bg-yellow-500',
      tailwindBgMuted: 'bg-yellow-500/15',
      icon: 'info',
      label: 'Moderate',
    };
  }

  if (clamped >= 40) {
    return {
      color: '#F97316',
      tailwindText: 'text-orange-500',
      tailwindBg: 'bg-orange-500',
      tailwindBgMuted: 'bg-orange-500/15',
      icon: 'alert-circle',
      label: 'Poor',
    };
  }

  return {
    color: '#EF4444',
    tailwindText: 'text-red-500',
    tailwindBg: 'bg-red-500',
    tailwindBgMuted: 'bg-red-500/15',
    icon: 'alert-triangle',
    label: 'Critical',
  };
}
