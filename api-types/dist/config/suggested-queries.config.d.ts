/**
 * Curated Suggested Queries Configuration
 *
 * Industry -> curated suggestion templates map for the personalised suggested
 * queries feature. Each industry key maps to >=5 template strings.
 *
 * When `Organization.industry` is null or unmatched, `DEFAULT_SUGGESTIONS`
 * is used as the deterministic fallback for Signal #5 (curated baseline).
 *
 * These templates are also used by the cohort signal (Signal #4): popular
 * query topics from the same organizationType are matched against template
 * keywords to rank which template to surface.
 */
export declare const DEFAULT_SUGGESTIONS: readonly string[];
/**
 * Resolve the curated suggestion templates for a given industry string.
 * Returns the matching industry template array, or the default suggestions
 * if no keyword match is found.
 */
export declare function resolveTemplatesForIndustry(industry: string | null | undefined): readonly string[];
/**
 * All curated templates (from every industry category) flattened into a single
 * array, used by the cohort signal to map popular topics back to templates.
 * Each entry carries its source category for ranking tie-breaking.
 */
export interface CuratedTemplateEntry {
    template: string;
    industryKey: string;
}
export declare function getAllCuratedTemplates(): CuratedTemplateEntry[];
//# sourceMappingURL=suggested-queries.config.d.ts.map