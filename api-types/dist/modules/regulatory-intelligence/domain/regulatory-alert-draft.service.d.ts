import { type RegulatoryAlert } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import type { CreateRegulatoryAlertDraftInput } from './types';
export declare class RegulatoryAlertDraftService {
    private readonly prisma;
    constructor(prisma?: typeof defaultPrisma);
    /**
     * Creates an inactive draft RegulatoryAlert linked to a verified RegulatorySourceItem.
     * STRICT GUARANTEE:
     * - Sets isActive = false
     * - Creates 0 AlertNotification records
     * - Emits 0 SSE / Redis pubsub messages
     * - Dispatches 0 emails
     * - Idempotency guaranteed via database-unique automationDraftKey
     */
    createAlertDraft(input: CreateRegulatoryAlertDraftInput, publishedById: string): Promise<{
        alert: RegulatoryAlert;
        isNew: boolean;
    }>;
}
export declare const regulatoryAlertDraftService: RegulatoryAlertDraftService;
//# sourceMappingURL=regulatory-alert-draft.service.d.ts.map