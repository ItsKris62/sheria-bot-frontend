export interface TriageInputHashFields {
    /** Canonical BlogSourceItem id when resolvable - the common case. */
    sourceItemId?: string | null;
    /** Populated when resolution fell back to the suggestion-only path (no resolvable source item). */
    suggestionId?: string | null;
    title: string;
    summary?: string | null;
    sourceType: string;
    authorityType: string;
    /** Plain string - RegulatorySignal-derived candidates carry jurisdiction as free text, not the typed enum. */
    jurisdiction: string;
    publicationDate?: Date | null;
    deterministicScore: number;
    scoringPolicyVersion: string;
    promptVersion: string;
}
/** Bump when the deterministic scoring policy (weights/thresholds) changes materially. */
export declare const SCORING_POLICY_VERSION = "relevance-scoring-v1";
export declare function computeTriageInputHash(input: TriageInputHashFields): string;
export interface ResearchInputHashFields {
    researchObjective: string;
    /** blogPostId when present, else suggestionId - the authoritative versioning target. */
    canonicalTargetId: string;
    promptVersion: string;
    researchPolicyVersion: string;
}
/** Bump when the research-pack prompt/source-classification policy changes materially. */
export declare const RESEARCH_POLICY_VERSION = "research-pack-policy-v1";
export declare function computeResearchInputHash(input: ResearchInputHashFields): string;
export interface ResearchSourceHashInput {
    /** Stable identity for sort/hash purposes - sourceItemId, postSourceId, or a normalized-URL-derived id, in that preference order. */
    stableSourceId: string;
    normalizedUrl: string;
    contentHash?: string | null;
    publicationDate?: Date | null;
    isAvailable: boolean;
    category: string;
    trustLevel: number;
}
/**
 * Hashes the full, sorted source set - never URLs alone (phase-b-data-model.md
 * §2/§11: a source whose content changed behind a stable URL, or whose
 * publicationDate was corrected, must change this hash even though the URL
 * didn't move).
 */
export declare function computeResearchSourceSetHash(sources: readonly ResearchSourceHashInput[]): string;
/** sha256 of BlogPost.content at verification/freshness time - null/empty content hashes consistently, never throws. */
export declare function computeContentHash(content: string | null | undefined): string;
/** sha256 of normalized claim text - correlates a PRIMARY row with its SECONDARY_REVIEW row for the same underlying claim. */
export declare function computeClaimHash(claimText: string): string;
export interface FallbackSourceHashInput {
    url: string | null;
    updatedAt: Date;
}
/**
 * Fallback-mode source-set hash for BlogPostSource rows (used when semantic
 * verification has no active research pack to reuse a sourceSetHash from).
 * Sorted by URL for determinism regardless of query order.
 */
export declare function computeFallbackSourceSetHash(sources: readonly FallbackSourceHashInput[]): string;
//# sourceMappingURL=editorial-input-hash.d.ts.map