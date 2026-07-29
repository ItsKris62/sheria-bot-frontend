import type { BlogPost, BlogPostSource } from '@prisma/client';
/**
 * Resolves the evidence semantic verification compares article claims
 * against. Preferred evidence is the post's active BlogResearchPack (its
 * already-synthesized findings - never re-fetched raw source bodies).
 * Falls back to the post's own BlogPostSource rows when no active research
 * pack exists, with an explicit confidence penalty, since raw source titles
 * are weaker evidence than a synthesized, source-graded research pack.
 */
export interface EvidenceItem {
    sourceRef: string;
    /** BlogPostSource.id in fallback mode; undefined in research_pack mode (the pack's sources are not individually re-cited here). */
    sourceId?: string;
    sourceUrl?: string | null;
    title?: string;
    text: string;
    category?: string;
}
export type VerificationEvidenceMode = 'research_pack' | 'fallback_post_sources' | 'no_evidence';
export interface VerificationEvidence {
    mode: VerificationEvidenceMode;
    researchPackId?: string;
    /** Reused directly from the active research pack when in research_pack mode - never recomputed. */
    sourceSetHash: string;
    items: EvidenceItem[];
    /** Added to LOW_STRUCTURED_AI_CONFIDENCE-style checks when evidence is weaker than a research pack. */
    confidencePenalty: number;
}
export declare const FALLBACK_CONFIDENCE_PENALTY = 20;
interface ResearchPackLike {
    id: string;
    sourceSetHash: string;
    obligationsSummary: unknown;
    authorities: unknown;
    importantDates: unknown;
}
export interface VerificationEvidencePrisma {
    blogResearchPack: {
        findFirst(args: object): Promise<ResearchPackLike | null>;
    };
}
export declare function resolveVerificationEvidence(prisma: VerificationEvidencePrisma, post: BlogPost & {
    sources: BlogPostSource[];
}): Promise<VerificationEvidence>;
export {};
//# sourceMappingURL=verification-evidence.d.ts.map