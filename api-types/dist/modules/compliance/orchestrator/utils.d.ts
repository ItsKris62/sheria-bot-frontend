/**
 * Extracts a JSON string from a model response that may be wrapped in markdown
 * code fences (e.g. ```json ... ```). Falls back to the raw trimmed content so
 * callers can attempt JSON.parse and handle errors uniformly.
 */
export declare function extractJson(content: string): string;
//# sourceMappingURL=utils.d.ts.map