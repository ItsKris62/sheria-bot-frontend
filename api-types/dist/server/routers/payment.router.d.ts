/**
 * Payment Router
 *
 * Routes:
 *  - payment.list       -  paginated payment history for the authenticated user's org
 *  - payment.getById    -  single payment detail (org-scoped ownership check)
 *  - payment.getDetail  -  full invoice data with org + user join for the invoice modal
 */
export declare const paymentRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * List paginated payment history for the user's organization.
     *
     * orgMemberProcedure enforces an active OrganizationMember row, so a user
     * removed from the org loses access immediately (60 s cache TTL), not at
     * JWT expiry. User-scoped only — orgId always comes from ctx, never input.
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            payments: {
                id: string;
                provider: import(".prisma/client").$Enums.PaymentProvider;
                providerTransactionId: string | null;
                amount: number;
                currency: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                description: string | null;
                paidAt: string | null;
                createdAt: string;
                metadata: Record<string, unknown> | null;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        meta: object;
    }>;
    /**
     * Get a single payment by ID, scoped to the user's organization.
     * orgId is always sourced from ctx — user cannot supply it.
     */
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            providerTransactionId: string | null;
            amount: number;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            description: string | null;
            paidAt: string | null;
            createdAt: string;
            metadata: Record<string, unknown> | null;
        };
        meta: object;
    }>;
    /**
     * Get full invoice detail for a single payment.
     *
     * Joins Payment + Organization + User for the invoice modal.
     * Org-scoped — returns 404 if payment does not belong to the authenticated
     * user's organization. orgId always sourced from ctx, never input.
     */
    getDetail: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            paymentId: string;
        };
        output: {
            id: string;
            invoiceNumber: string | null;
            amount: number;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            subscriptionPlan: string | null;
            billingPeriodStart: string | null;
            billingPeriodEnd: string | null;
            providerTransactionId: string | null;
            description: string | null;
            paidAt: string | null;
            createdAt: string;
            metadata: Record<string, unknown> | null;
            paymentMethodDisplay: string;
            organization: {
                name: string;
                address: string | null;
                contactEmail: string | null;
            };
            user: {
                email: string;
                fullName: string | null;
            };
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=payment.router.d.ts.map