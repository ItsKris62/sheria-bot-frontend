/**
 * Resend Webhook Service
 *
 * Public API (two-phase, matches Fastify route pattern in app.ts):
 *   1. verifyAndParse()        — synchronous; validates Svix signature + timestamp,
 *                                JSON-parses the body. Returns a discriminated union.
 *                                Route sends 200 immediately after this returns valid.
 *   2. processEventBackground() — async; idempotency check + all DB writes.
 *                                 Wrapped in a top-level try/catch; never rethrows.
 *                                 Called fire-and-forget from the route.
 *
 * Handled event types:
 *   email.sent        → SENT
 *   email.delivered   → DELIVERED  (deliveredAt)
 *   email.opened      → OPENED     (openedAt — first occurrence only)
 *   email.clicked     → CLICKED    (firstClickedAt — first occurrence only)
 *   email.bounced     → BOUNCED
 *     hard bounce → SuppressionList (BOUNCED) + Contact.suppressedAt/suppressedReason
 *                   consentStatus is NOT changed (bounce is operational, not consent withdrawal)
 *     soft bounce → EmailEvent only; no suppression, no contact update
 *   email.complained    → COMPLAINED → SuppressionList (COMPLAINED) + Contact.suppressedAt +
 *                                      suppressedReason + consentStatus = REVOKED
 *   email.unsubscribed  → UNSUBSCRIBED → SuppressionList (UNSUBSCRIBED) + campaign counter
 *
 * Campaign aggregate counters on MarketingCampaign are incremented for:
 *   opened, clicked, bounced (hard), complained, unsubscribed
 *
 * Idempotency: Redis SET NX on `sheriabot:resend:evt:{messageId}:{eventType}` (30-day TTL).
 */
import { EmailEventType } from '@prisma/client';
interface ResendEmailData {
    email_id: string;
    from?: string;
    to?: string[];
    subject?: string;
    created_at?: string;
    click?: {
        link: string;
        timestamp: string;
        ipAddress?: string;
        userAgent?: string;
    };
    bounce?: {
        message: string;
        type?: string;
        subtype?: string;
    };
}
interface ResendWebhookPayload {
    type: string;
    created_at: string;
    data: ResendEmailData;
}
export type VerifyAndParseResult = {
    valid: true;
    payload: ResendWebhookPayload;
    eventType: EmailEventType | null;
    messageId: string | null;
} | {
    valid: false;
    reason: 'invalid_signature' | 'invalid_timestamp' | 'malformed_payload';
};
declare class ResendWebhookService {
    verifyAndParse(rawBody: Buffer, svixId: string, svixTimestamp: string, svixSignature: string): VerifyAndParseResult;
    processEventBackground(payload: ResendWebhookPayload, eventType: EmailEventType | null, messageId: string | null): Promise<void>;
    private processEvent;
    private handleSent;
    private handleDelivered;
    private handleOpened;
    private handleClicked;
    private handleBounced;
    private handleComplained;
    /**
     * Atomically mark an event as processed (Redis SET NX).
     * Returns true if already processed (duplicate), false if new.
     * Fails open on Redis error so events are never silently dropped.
     */
    private markProcessed;
    /** Idempotent suppression upsert — email is unique in the table. */
    private upsertSuppression;
    /**
     * Update Contact suppression fields with bounce/complaint-aware semantics:
     *
     * - BOUNCED:    set suppressedAt + suppressedReason only.
     *               consentStatus is NOT changed — a hard bounce is an operational
     *               fact (mailbox doesn't exist), not a deliberate consent withdrawal.
     *
     * - COMPLAINED: set suppressedAt + suppressedReason + consentStatus = REVOKED.
     *               A spam report IS a deliberate consent withdrawal.
     *
     * - UNSUBSCRIBED (future): same as COMPLAINED.
     *
     * Uses updateMany for both paths to avoid P2025 if the contact was deleted
     * between event arrival and processing time.
     */
    private markContactSuppressed;
    /**
     * Handle email.unsubscribed from Resend's native unsubscribe handling.
     * Suppresses the contact and increments the campaign unsubscribed counter.
     */
    private handleUnsubscribed;
    /**
     * Increment a single aggregate counter on MarketingCampaign.
     * Non-fatal — logs on failure but does not rethrow.
     */
    private incrementCampaignCounter;
    /** Resolve the recipient email from CampaignSend → Contact. */
    private emailFromSend;
}
export declare const resendWebhookService: ResendWebhookService;
export {};
//# sourceMappingURL=webhook.service.d.ts.map