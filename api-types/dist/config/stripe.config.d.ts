export declare const PRICE_TO_PLAN: Record<string, 'STARTUP' | 'BUSINESS'>;
export declare const stripeConfig: {
    /** Stripe SDK is initialised from this secret key */
    readonly secretKey: string;
    /** Published key (sent to frontend for Stripe.js / Elements) */
    readonly publishableKey: string;
    /** Webhook signing secret  -  used to verify event payloads */
    readonly webhookSecret: string;
    /** Per-plan Stripe Price IDs */
    readonly prices: {
        readonly STARTUP: {
            readonly monthly: string;
        };
        readonly BUSINESS: {
            readonly monthly: string;
        };
    };
    /** Subscription lifecycle settings */
    readonly subscription: {
        /** Free trial length in days */
        readonly trialPeriodDays: 14;
        /** Grace period after cancellation (full access retained) in days */
        readonly gracePeriodDays: 7;
    };
    /** URLs Stripe redirects to after Checkout / Portal flows */
    readonly redirectUrls: {
        /** Where to send the user after a successful Checkout Session */
        readonly checkoutSuccess: `${string}/settings/billing?checkout=success`;
        /** Where to send the user if they cancel the Checkout flow */
        readonly checkoutCancel: `${string}/settings/billing?checkout=cancel`;
        /** Return URL from the Customer Portal */
        readonly portalReturn: `${string}/settings/billing`;
    };
};
export type StripeConfig = typeof stripeConfig;
//# sourceMappingURL=stripe.config.d.ts.map