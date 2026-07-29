import { BlogAuthorityType, BlogResearchSourceCategory, BlogSourceType } from '@prisma/client';
/**
 * Deterministic source-trust classifier for Stage C7 research packs. Runs
 * BEFORE the AI synthesis call - the AI is never given the opportunity to
 * assign or upgrade a source's category or trust level; it only ever
 * references sources by the stable `sourceRef` this classifier (indirectly,
 * via the caller) assigns. See phase-b-data-model.md §2 and
 * research-pack-policy.md for the full rationale and category definitions.
 */
export interface ClassifiableSource {
    sourceType?: BlogSourceType | null;
    authorityType?: BlogAuthorityType | null;
    /** True only when the source is SheriaBot's own vetted legal corpus - an explicit designation, never inferred. */
    isApprovedCorpus?: boolean;
    /** True only when the source was explicitly submitted by an end user rather than the monitored pipeline. */
    isUserGenerated?: boolean;
    isAvailable: boolean;
}
export interface SourceClassification {
    category: BlogResearchSourceCategory;
    trustLevel: number;
}
/**
 * Deterministic, precedence-ordered classification. Each rule is evaluated in
 * order and the first match wins - a source can only ever fall through to a
 * lower-trust category, never be upgraded by anything the AI later says.
 */
export declare function classifySource(source: ClassifiableSource): SourceClassification;
//# sourceMappingURL=research-source-classifier.d.ts.map