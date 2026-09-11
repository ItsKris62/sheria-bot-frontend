import { type RegulatorySourceItem } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type CreateRegulatorySourceItemInput, type UpdateRegulatorySourceItemInput, type LinkEvidenceInput, type ListRegulatorySourceItemsInput } from './types';
export declare class RegulatoryItemService {
    private readonly prisma;
    constructor(prisma?: typeof defaultPrisma);
    /**
     * Creates a normalized regulatory source item with database-backed deduplication.
     * Links primary snapshot evidence transactionally if provided.
     */
    createItem(input: CreateRegulatorySourceItemInput): Promise<RegulatorySourceItem>;
    updateItem(id: string, input: UpdateRegulatorySourceItemInput): Promise<RegulatorySourceItem>;
    getItem(id: string): Promise<RegulatorySourceItem>;
    getItemByDedupeKey(dedupeKey: string): Promise<RegulatorySourceItem | null>;
    listItems(input: ListRegulatorySourceItemsInput): Promise<{
        items: RegulatorySourceItem[];
        total: number;
    }>;
    /**
     * Links a snapshot to a regulatory source item.
     * Ensures at most ONE primary evidence relationship exists per item.
     */
    linkEvidence(input: LinkEvidenceInput): Promise<void>;
    markSuperseded(itemId: string, supersededById: string): Promise<RegulatorySourceItem>;
}
export declare const regulatoryItemService: RegulatoryItemService;
//# sourceMappingURL=regulatory-item.service.d.ts.map