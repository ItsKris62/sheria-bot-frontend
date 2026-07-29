export declare const MAX_STRUCTURED_RESPONSE_LENGTH = 200000;
/**
 * Extracts a JSON object candidate from raw model output text. Handles:
 *  - a fenced code block (```json ... ``` or ``` ... ```) wrapping the whole response
 *  - unfenced raw JSON
 *  - prose-wrapped JSON ("Here is the JSON: { ... } Let me know if...")
 * Returns null if no '{'/'}' pair can be found at all. Never uses eval/Function —
 * only string slicing, matching the actual parse attempt to JSON.parse.
 */
export declare function extractJsonCandidate(rawText: string): string | null;
//# sourceMappingURL=extract-json.d.ts.map