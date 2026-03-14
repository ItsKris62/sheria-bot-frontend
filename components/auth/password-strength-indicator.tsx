"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";

// ── Password validation (mirrors backend password.schema.ts rules) ────────────
// Kept local to avoid cross-package imports; must stay in sync with backend.

const PASSWORD_MIN_LENGTH = 10;
const SPECIAL_CHAR_RE = /[!@#$%^&*()\-_+=[\]{}|;:'",.<>?/~`\\]/;
const REPEATED_CHARS_RE = /(.)\1{3,}/;
const SEQUENTIAL_PATTERNS = [
  "abcdefghijklmnopqrstuvwxyz",
  "zyxwvutsrqponmlkjihgfedcba",
  "0123456789",
  "9876543210",
  "qwertyuiop",
  "poiuytrewq",
  "asdfghjkl",
  "lkjhgfdsa",
  "zxcvbnm",
  "mnbvcxz",
];

export interface PasswordRules {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  noRepeated: boolean;
  noSequential: boolean;
}

export interface PasswordStrength {
  score: number; // 0–5
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  rules: PasswordRules;
  isValid: boolean;
}

function hasSequential(password: string): boolean {
  const lower = password.toLowerCase();
  for (const seq of SEQUENTIAL_PATTERNS) {
    for (let i = 0; i <= seq.length - 4; i++) {
      if (lower.includes(seq.slice(i, i + 4))) return true;
    }
  }
  return false;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "Very Weak",
      isValid: false,
      rules: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasDigit: false,
        hasSpecial: false,
        noRepeated: true,
        noSequential: true,
      },
    };
  }

  const rules: PasswordRules = {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: SPECIAL_CHAR_RE.test(password),
    noRepeated: !REPEATED_CHARS_RE.test(password),
    noSequential: !hasSequential(password),
  };

  const coreRuleCount = [
    rules.minLength,
    rules.hasUppercase,
    rules.hasLowercase,
    rules.hasDigit,
    rules.hasSpecial,
  ].filter(Boolean).length;

  let score = coreRuleCount;
  if (password.length >= 14) score = Math.min(score + 1, 5);
  score = Math.min(score, 5);

  const isValid =
    rules.minLength &&
    rules.hasUppercase &&
    rules.hasLowercase &&
    rules.hasDigit &&
    rules.hasSpecial &&
    rules.noRepeated &&
    rules.noSequential;

  const labels: PasswordStrength["label"][] = [
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
    "Very Strong",
  ];

  return {
    score,
    label: labels[Math.max(0, score - 1)] ?? "Very Weak",
    isValid,
    rules,
  };
}

// ── Segment bar colours ───────────────────────────────────────────────────────

const SEGMENT_COLORS: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-emerald-500",
  5: "bg-emerald-700",
};

const LABEL_COLORS: Record<number, string> = {
  1: "text-red-500",
  2: "text-orange-500",
  3: "text-yellow-600",
  4: "text-emerald-500",
  5: "text-emerald-700",
};

// ── Requirement rows shown in the checklist ───────────────────────────────────

interface RequirementItem {
  key: keyof PasswordRules;
  label: string;
}

const REQUIREMENTS: RequirementItem[] = [
  { key: "minLength", label: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { key: "hasUppercase", label: "Uppercase letter (A–Z)" },
  { key: "hasLowercase", label: "Lowercase letter (a–z)" },
  { key: "hasDigit", label: "Number (0–9)" },
  { key: "hasSpecial", label: "Special character (!, @, #, $, …)" },
  { key: "noRepeated", label: "No repeated characters (aaaa)" },
  { key: "noSequential", label: "No sequential patterns (abcd, 1234)" },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface PasswordStrengthIndicatorProps {
  password: string;
  /** Show the detailed checklist. Defaults to true. */
  showChecklist?: boolean;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  showChecklist = true,
  className = "",
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => checkPasswordStrength(password), [password]);

  if (!password) return null;

  const filledColor = SEGMENT_COLORS[strength.score] ?? "bg-muted";
  const labelColor = LABEL_COLORS[strength.score] ?? "text-muted-foreground";

  return (
    <div className={`space-y-2 ${className}`} aria-label="Password strength">
      {/* Segmented bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" role="progressbar" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={5} aria-label={`Password strength: ${strength.label}`}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < strength.score ? filledColor : "bg-muted"
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ${labelColor} min-w-[6rem] text-right`}>
          {strength.label}
        </span>
      </div>

      {/* Checklist */}
      {showChecklist && (
        <div className="grid grid-cols-1 gap-1 rounded-lg border border-border/50 bg-muted/30 p-3 sm:grid-cols-2">
          {REQUIREMENTS.map(({ key, label }) => {
            const met = strength.rules[key];
            return (
              <div key={key} className="flex items-center gap-2">
                {met ? (
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                ) : (
                  <X
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-xs ${
                    met ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
