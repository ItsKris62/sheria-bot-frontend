import { prisma as defaultPrisma } from '@/lib/prisma/client';
type SourcesPrisma = Pick<typeof defaultPrisma, 'blogSourceItem'>;
type FetchLike = typeof fetch;
export interface AutomationSourcesServiceDependencies {
    prisma?: SourcesPrisma;
    fetchImpl?: FetchLike;
    now?: () => Date;
}
export interface SourceListItem {
    id: string;
    url: string;
    title: string;
    summary?: string;
    publicationDate?: string;
    jurisdiction: string;
    regulator?: string;
}
export declare class AutomationSourcesService {
    private readonly prisma;
    private readonly fetchImpl;
    private readonly now;
    constructor(dependencies?: AutomationSourcesServiceDependencies);
    /**
     * `regulator` maps from BlogSourceItem.publisher - the closest existing
     * field (the publishing authority's name); there is no field literally
     * named "regulator" on this model. Flagging the rename per the brief's own
     * instruction to call out any field-name deviation.
     */
    getSources(input: {
        jurisdictions: string;
    }): Promise<{
        sources: SourceListItem[];
    }>;
    /**
     * Pure fetch + normalize - no DB write. `sourceId` is accepted (per the
     * brief's input shape) but not used to update any BlogSourceItem row: the
     * brief describes this procedure only as "fetch and normalize", with no
     * output shape or persistence behavior specified, so writing to an existing
     * row here would be inventing a side effect that isn't asked for.
     */
    fetchSource(input: {
        url: string;
        sourceId: string;
        jurisdiction: string;
    }): Promise<{
        sourceId: string;
        normalizedContent: string;
        contentHash: string;
        fetchedAt: string;
    }>;
    /**
     * Jurisdiction-scoped read, per the brief's own note that the same hash can
     * be legitimately new in one jurisdiction and already-seen in another.
     * Caveat: BlogSourceItem.contentHash carries a GLOBAL @@unique constraint
     * (not scoped by jurisdiction) - this read answers correctly regardless,
     * but if the same contentHash genuinely needs to exist for two different
     * jurisdictions, a future INSERT of the second one will be rejected by that
     * constraint. That's a pre-existing schema/business-rule mismatch, not
     * something this read-only procedure introduces or fixes.
     */
    dedupeSource(input: {
        contentHash: string;
        jurisdiction: string;
    }): Promise<{
        isNew: boolean;
    }>;
}
export declare const automationSourcesService: AutomationSourcesService;
export {};
//# sourceMappingURL=sources.service.d.ts.map