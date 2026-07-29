/**
 * Metadata/text sanitization for ContentOpsAlert (Pack 1 Stage C4). Allows
 * only short structured pointers - IDs, counts, scores, enum values, booleans,
 * short machine-readable reason codes. Rejects/strips anything that could
 * carry article bodies, source content, prompts, raw model output,
 * credentials, tokens, recipient lists, or rendered HTML.
 *
 * Deliberately conservative: only flat scalar values are allowed in metadata
 * (no nested objects/arrays) - if a future stage needs e.g. an array of
 * source IDs, that is a considered schema/contract decision to make then,
 * not something this sanitizer should silently allow through today.
 */
/** Sanitizes a free-text field (title/summary/resolutionNote) - strips HTML tags, caps length. */
export declare function sanitizeAlertText(text: string, maxLength?: number): string;
export interface SanitizeMetadataResult {
    metadata: Record<string, string | number | boolean | null>;
    droppedKeys: string[];
}
/**
 * Sanitizes an alert metadata object down to short scalar pointers only.
 * Silently drops (does not throw on) forbidden keys and unsupported value
 * shapes - callers can inspect `droppedKeys` if they need to know what was
 * stripped. Caps the final serialized size; if still oversized after
 * per-field truncation, returns a minimal marker rather than an arbitrarily
 * truncated (and therefore potentially misleading) JSON blob.
 */
export declare function sanitizeAlertMetadata(metadata: Record<string, unknown> | undefined | null): SanitizeMetadataResult;
//# sourceMappingURL=content-ops-alert-sanitizer.d.ts.map