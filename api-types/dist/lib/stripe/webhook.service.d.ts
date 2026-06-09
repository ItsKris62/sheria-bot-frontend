/**
 * Stripe Webhook Service
 *
 * Validates incoming Stripe webhook events and updates org subscription state
 * in the database. All handlers are idempotent  -  Stripe may deliver the same
 * event more than once.
 *
 * Handled events:
 *   checkout.session.completed          -> activate trial / subscription + send PlanActivatedEmail
 *   customer.subscription.updated       -> plan change, trial-end, status transitions
 *   customer.subscription.deleted       -> enter 7-day grace period + send SubscriptionCancelledEmail
 *   customer.subscription.trial_will_end -> send TrialEndingReminderEmail
 *   invoice.payment_failed              -> mark PAST_DUE + send PaymentFailedEmail
 *   invoice.payment_succeeded           -> clear PAST_DUE back to ACTIVE
 *
 * Raw-body requirement:
 *   This service receives the request body as a `Buffer`. The Fastify webhook
 *   route uses an encapsulated plugin with a custom content-type parser so that
 *   the global JSON parser is NOT invoked before this service sees the payload.
 */
declare class StripeWebhookService {
    /**
     * Verify the webhook signature and dispatch to the correct handler.
     *
     * @param payload   Raw request body as a Buffer (not JSON-parsed).
     * @param signature Value of the `Stripe-Signature` header.
     * @throws          If signature verification fails (Fastify route returns 400).
     */
    handleEvent(payload: Buffer, signature: string): Promise<void>;
    /**
     * checkout.session.completed
     *
     * Fires when the user completes the Stripe-hosted checkout flow.
     * For subscription mode with a trial, this fires immediately (no charge yet).
     *
     * We store the subscription ID, activate the new plan, and record trial dates.
     */
    private handleCheckoutCompleted;
    /**
     * customer.subscription.updated
     *
     * Fires on any subscription change: trial ending, plan change, payment
     * recovery, pause, etc.
     *
     * We update the org's plan (if price ID changed) and subscription status.
     */
    private handleSubscriptionUpdated;
    /**
     * customer.subscription.deleted
     *
     * Fires when a Stripe subscription is cancelled (either immediately or at
     * period end). We begin a 7-day grace period rather than revoking access
     * immediately. The lazy check in `withPlanContext` will downgrade the plan
     * once `gracePeriodEndsAt` passes.
     */
    private handleSubscriptionDeleted;
    /**
     * invoice.payment_failed
     *
     * Fires when Stripe cannot collect payment. Marks the org as PAST_DUE.
     * Stripe will retry automatically; the org retains access during retries.
     */
    private handlePaymentFailed;
    /**
     * invoice.payment_succeeded
     *
     * Fires after a successful charge. Clears PAST_DUE back to ACTIVE.
     * (TRIALING orgs that haven't yet been charged stay TRIALING until
     * `customer.subscription.updated` fires at trial end.)
     */
    private handlePaymentSucceeded;
    /**
     * customer.subscription.trial_will_end
     *
     * Stripe fires this event ~3 days before the trial ends. We send a reminder
     * email so the user knows to add a payment method. No DB changes are needed.
     */
    private handleTrialWillEnd;
    /**
     * Atomically mark a Stripe event as processed using Redis SET NX.
     *
     * Returns true  -> key already existed -> duplicate, skip processing.
     * Returns false -> key was just set    -> new event, proceed normally.
     *
     * Fails open: Redis unavailability is logged as a warning and returns false
     * so the event is processed rather than silently dropped.
     *
     * TTL is 30 days  -  longer than Stripe's maximum 3-day retry window.
     */
    private markProcessed;
    private findOrgByCustomerId;
    /**
     * Fetch the primary contact (first owner / admin user) for an org so we
     * can address billing emails correctly. Returns null if no user is found.
     */
    private findOrgOwnerContact;
    /**
     * Invalidate all plan-related Redis caches after a subscription change.
     *
     * Two key spaces are cleared:
     *   1. Legacy org-scoped key `sheriabot:plan:{orgId}`  -  kept for any
     *      consumers that may still read it directly.
     *   2. User-scoped plan context keys `sheriabot:planctx:{userId}`  -  the
     *      authoritative cache read by `withPlanContext` middleware. Every
     *      member of the org must have their key cleared so the next request
     *      re-fetches the updated plan from the DB within this request cycle
     *      rather than after the 5-minute TTL expires.
     */
    private invalidatePlanCache;
}
export declare const stripeWebhookService: StripeWebhookService;
export {};
//# sourceMappingURL=webhook.service.d.ts.map