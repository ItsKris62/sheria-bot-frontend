/**
 * IntaSend Webhook Service
 *
 * Handles POST events from IntaSend at /api/webhooks/intasend.
 *
 * Security:
 *   IntaSend does not sign webhook payloads with HMAC. On every webhook
 *   receipt we re-call intaSendService.getPaymentStatus(invoice_id) to
 *   confirm the reported state from IntaSend's API before acting on it.
 *
 * Idempotency:
 *   All handlers guard against duplicate delivery using the Payment record's
 *   providerTransactionId (= IntaSend invoice_id) dedup check in
 *   paymentService.createPaymentRecord().
 *
 * Handled events (IntaSend state field):
 *   COMPLETE  -> activate subscription, generate invoice, send receipt email
 *   FAILED    -> mark payment FAILED, send failure email
 *   PENDING   -> upsert payment record as PENDING (no further action)
 */
import { type IntaSendWebhookPayload } from '@/modules/intasend/intasend.types';
declare class IntaSendWebhookService {
    /**
     * Main entry point. Called by the Fastify /api/webhooks/intasend route.
     *
     * Verification: re-calls IntaSend status API to confirm state before acting.
     */
    handleEvent(rawPayload: IntaSendWebhookPayload): Promise<void>;
    private handleComplete;
    private handleFailed;
    private handlePending;
}
export declare const intaSendWebhookService: IntaSendWebhookService;
export { IntaSendWebhookService };
//# sourceMappingURL=webhook.service.d.ts.map