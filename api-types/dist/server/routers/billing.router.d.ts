/**
 * Billing Router
 *
 * Routes:
 *  - billing.getPlanAndUsage         -  current plan, entitlements, usage, subscription status
 *  - billing.createCheckoutSession   -  Stripe Checkout for STARTUP / BUSINESS plans
 *  - billing.createPortalSession     -  Stripe Customer Portal (manage / cancel subscription)
 */
export declare const billingRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            stack: string | undefined;
            fieldErrors: Record<string, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
        };
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * Get the authenticated user's current plan, entitlements, and usage.
     *
     * Called once on dashboard mount (stale 5 min). The frontend caches this
     * and exposes it via `usePlan()` to drive all feature-gate UI.
     *
     * @protected  -  requires isAuthenticated + withPlanContext
     */
    getPlanAndUsage: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            plan: import("../../types/plan.types").EffectivePlan;
            entitlements: import("@/config/entitlements.config").PlanEntitlementConfig;
            usage: {
                complianceQueries: {
                    current: number;
                    limit: number;
                };
                checklistGenerations: {
                    current: number;
                    limit: number;
                };
                apiCalls: {
                    current: number;
                    limit: number;
                };
                documentStorageMB: {
                    current: number;
                    limit: number;
                };
            };
            billing: {
                planStartDate: string | null;
                planEndDate: string | null;
                stripeCustomerId: string | null;
                subscriptionStatus: import("@prisma/client").$Enums.SubscriptionStatus | null;
                trialEndsAt: string | null;
                gracePeriodEndsAt: string | null;
                cancelledAt: string | null;
                subscriptionEndsAt: string | null;
                preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
                mpesaNextPaymentDueDate: string | null;
                subscriptionCycleEnd: string | null;
                catalogPrice: Record<"STARTUP" | "BUSINESS", {
                    monthly: number;
                    yearly: number;
                    currency: "KES";
                }>;
            };
            trial: import("@/modules/trial").TrialStatus | null;
            effectivePlanSource: import("../../types/plan.types").EffectivePlanSource;
            appliedOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[];
            pilot: {
                isPilot: boolean;
                pilotStatus: "ACTIVE" | "EXPIRED" | "REVOKED" | "CONVERTED";
                pilotExpiresAt: string | null;
                pilotExtensionCount: number;
                entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile;
            } | {
                isPilot: boolean;
                pilotStatus: null;
                pilotExpiresAt: null;
                pilotExtensionCount: number;
                entitlementProfile: null;
            };
        };
        meta: object;
    }>;
    getPlanCatalog: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("../../modules/admin").BillingPlanCatalog;
        meta: object;
    }>;
    /**
     * Create a Stripe Checkout Session for upgrading to STARTUP or BUSINESS.
     *
     * - Creates or reuses the org's Stripe Customer record.
     * - Starts a 14-day free trial (Stripe enforces this  -  no charges until trial ends).
     * - Enterprise is sales-led only; REGULATOR is free  -  neither goes through Stripe.
     *
     * Returns { url }  -  the frontend redirects the user to this URL.
     *
     * @protected  -  requires authentication + an organization
     */
    createCheckoutSession: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            plan: "STARTUP" | "BUSINESS";
            interval?: "monthly" | "yearly" | undefined;
        };
        output: {
            url: string | null;
        };
        meta: object;
    }>;
    /**
     * Create a Stripe Customer Portal session.
     *
     * Lets the user manage their subscription (upgrade, downgrade, cancel, update
     * payment method) directly in Stripe's hosted portal.
     *
     * Requires an existing stripeCustomerId on the organization.
     *
     * Returns { url }  -  the frontend redirects the user to this URL.
     *
     * @protected  -  requires authentication + an organization with an active Stripe customer
     */
    createPortalSession: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            url: string;
        };
        meta: object;
    }>;
    /**
     * Submit an Enterprise plan inquiry.
     *
     * Sends a notification email to the SheriaBot admin inbox and returns success.
     * Rate-limited to 3 submissions per org per calendar day (UTC).
     *
     * @protected  -  requires authentication + an organization
     */
    requestEnterprise: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            email: string;
            message?: string | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Update the preferred payment method (Card/Stripe or M-Pesa) for the org.
     *
     * When switching to M-Pesa, a phone number is required (now or previously stored).
     * Switching methods does NOT cancel an existing Stripe subscription  -  it only
     * affects the next payment initiated by the user.
     */
    updatePaymentMethod: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            provider: "STRIPE" | "MPESA";
            mpesaPhoneNumber?: string | undefined;
        };
        output: {
            preferredPaymentMethod: import("@prisma/client").$Enums.PaymentProvider | null;
            mpesaPhoneNumber: string | null;
        };
        meta: object;
    }>;
    /**
     * Initiate an M-Pesa STK push for a subscription plan.
     *
     * Creates a PENDING Payment record first (idempotent via providerTransactionId),
     * then triggers the STK push via IntaSend. Returns the paymentId for polling.
     */
    initiateMpesaPayment: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            plan: "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE";
            phoneNumber?: string | undefined;
        };
        output: {
            paymentId: string;
            trackingId?: undefined;
            message?: undefined;
        } | {
            paymentId: string;
            trackingId: string;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Poll the status of a pending M-Pesa payment.
     *
     * Used by the frontend MpesaPaymentFlow component to check every 5 seconds
     * whether the webhook has confirmed the payment (or failed).
     */
    getMpesaPaymentStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            paymentId: string;
        };
        output: {
            paymentId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            updatedAt: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=billing.router.d.ts.map