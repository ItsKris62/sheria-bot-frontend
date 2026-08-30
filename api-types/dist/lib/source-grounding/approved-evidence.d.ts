import { prisma } from '@/lib/prisma/client';
import type { SearchResult } from '@/lib/rag/rag.service';
import { type JurisdictionCode } from '@/types/jurisdiction';
type ApprovalLookupClient = Pick<typeof prisma, 'regulatoryDocument'>;
export interface ApprovedEvidencePartition {
    eligible: SearchResult[];
    ineligible: SearchResult[];
    enforcementApplied: boolean;
}
export declare function partitionEvidenceBySourceApproval(results: SearchResult[], jurisdictionCodes: readonly JurisdictionCode[], db?: ApprovalLookupClient): Promise<ApprovedEvidencePartition>;
export {};
//# sourceMappingURL=approved-evidence.d.ts.map