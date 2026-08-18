import { SubscriptionPlan } from '@prisma/client';
import type { PaymentStatusResponse } from '@/modules/intasend/intasend.types';
type FinalizationSource = 'webhook' | 'polling' | 'reconciliation' | 'admin';
interface FinalizeIntaSendPaymentInput {
    invoiceId?: string;
    paymentId?: string;
    verifiedStatus: PaymentStatusResponse;
    source: FinalizationSource;
    actorUserId?: string | null;
    operationalReason?: string | null;
}
export interface FinalizeIntaSendPaymentResult {
    paymentId: string;
    orgId: string;
    status: 'finalized' | 'already_finalized' | 'repaired';
    plan: SubscriptionPlan;
    newlyFinalized: boolean;
}
interface MarkFailedInput {
    invoiceId: string;
    source: FinalizationSource;
    failedReason?: string | null;
    failedCode?: string | null;
}
export declare function invalidateOrganizationPlanCaches(orgId: string): Promise<void>;
declare class IntaSendFinalizationService {
    finalizePayment(input: FinalizeIntaSendPaymentInput): Promise<FinalizeIntaSendPaymentResult>;
    markFailed(input: MarkFailedInput): Promise<void>;
    private recordFinalizationFailure;
}
export declare const intaSendFinalizationService: IntaSendFinalizationService;
export { IntaSendFinalizationService };
//# sourceMappingURL=intasend-finalization.service.d.ts.map