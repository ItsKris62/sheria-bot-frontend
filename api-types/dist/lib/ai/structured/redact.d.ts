import type { z } from 'zod';
export declare function redactForPrompt(text: string): string;
export interface CorrectionIssueSummary {
    path: string;
    message: string;
}
/**
 * Reduces a ZodError's issues to a small, redacted, prompt-safe summary — at
 * most 10 items, {path, message} only. Deliberately drops `received`/`expected`
 * raw-value echoes, which could otherwise round-trip attacker-controlled
 * source text back into a second prompt.
 */
export declare function summarizeZodIssuesForCorrection(error: z.ZodError): CorrectionIssueSummary[];
//# sourceMappingURL=redact.d.ts.map