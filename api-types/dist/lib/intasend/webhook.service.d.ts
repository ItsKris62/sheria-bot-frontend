/**
 * IntaSend Webhook Service
 *
 * Handles POST events from IntaSend at /api/webhooks/intasend.
 * Webhooks verify the shared challenge in the Fastify route, then this service
 * re-checks the referenced invoice directly with IntaSend before mutating local
 * finance records.
 */
import { type IntaSendWebhookPayload } from '@/modules/intasend/intasend.types';
export type IntaSendWebhookOperationalEvent = 'WEBHOOK_RECEIVED' | 'WEBHOOK_ACCEPTED' | 'WEBHOOK_REJECTED_IP' | 'WEBHOOK_REJECTED_CHALLENGE' | 'WEBHOOK_INVALID_PAYLOAD' | 'WEBHOOK_UNKNOWN_TRANSACTION' | 'WEBHOOK_PROVIDER_LOOKUP_FAILED' | 'WEBHOOK_FINALIZATION_SUCCEEDED' | 'WEBHOOK_FINALIZATION_FAILED';
declare class IntaSendWebhookService {
    recordOperationalEvent(input: {
        event: IntaSendWebhookOperationalEvent;
        providerTransactionId?: string | null;
        paymentId?: string | null;
        reasonCode?: string | null;
        requestId?: string | null;
        ipHash?: string | null;
    }): Promise<void>;
    handleEvent(rawPayload: IntaSendWebhookPayload): Promise<void>;
}
export declare const intaSendWebhookService: IntaSendWebhookService;
export { IntaSendWebhookService };
//# sourceMappingURL=webhook.service.d.ts.map