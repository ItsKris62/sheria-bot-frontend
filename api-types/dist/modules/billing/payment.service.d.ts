/**
 * Payment Service
 *
 * Handles creation and retrieval of Payment records. Designed to be
 * called from:
 *   1. Stripe webhook handlers (after successful/failed payments)
 *   2. tRPC payment router (for paginated history reads)
 *
 * All writes are idempotent  -  duplicate providerTransactionId entries
 * are silently ignored (upsert semantics via `createOrUpdate` guard).
 */
import { PaymentProvider, PaymentStatus } from '@prisma/client';
export interface CreatePaymentInput {
    orgId: string;
    subscriptionId?: string;
    provider: PaymentProvider;
    providerTransactionId?: string;
    amount: number;
    currency?: string;
    status: PaymentStatus;
    description?: string;
    paidAt?: Date;
    metadata?: Record<string, unknown>;
    invoiceNumber?: string;
    subscriptionPlan?: string;
    billingPeriodStart?: Date;
    billingPeriodEnd?: Date;
}
export interface GetPaymentsInput {
    orgId: string;
    page: number;
    limit: number;
}
declare class PaymentService {
    /**
     * Create a new payment record.
     *
     * Idempotent: if a record with the same `providerTransactionId` already
     * exists for this org, the existing record is returned without creating
     * a duplicate.
     */
    createPaymentRecord(input: CreatePaymentInput): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        description: string | null;
        status: import("@prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        paidAt: Date | null;
        orgId: string;
        currency: string;
        subscriptionId: string | null;
        provider: import("@prisma/client").$Enums.PaymentProvider;
        providerTransactionId: string | null;
        invoiceNumber: string | null;
        subscriptionPlan: string | null;
        billingPeriodStart: Date | null;
        billingPeriodEnd: Date | null;
    }>;
    /**
     * Retrieve paginated payment history for an organization.
     * Returns records newest-first.
     */
    getPaymentsByOrg(input: GetPaymentsInput): Promise<{
        payments: {
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            description: string | null;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            paidAt: Date | null;
            orgId: string;
            currency: string;
            subscriptionId: string | null;
            provider: import("@prisma/client").$Enums.PaymentProvider;
            providerTransactionId: string | null;
            invoiceNumber: string | null;
            subscriptionPlan: string | null;
            billingPeriodStart: Date | null;
            billingPeriodEnd: Date | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    /**
     * Retrieve a single payment by ID, restricted to a specific org.
     * Returns null if not found or if the payment belongs to a different org.
     */
    getPaymentById(paymentId: string, orgId: string): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        description: string | null;
        status: import("@prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        paidAt: Date | null;
        orgId: string;
        currency: string;
        subscriptionId: string | null;
        provider: import("@prisma/client").$Enums.PaymentProvider;
        providerTransactionId: string | null;
        invoiceNumber: string | null;
        subscriptionPlan: string | null;
        billingPeriodStart: Date | null;
        billingPeriodEnd: Date | null;
    } | null>;
    /**
     * Generate a sequential invoice number for the current year.
     *
     * Uses an atomic Redis INCR on key `sheriabot:invoice_seq:{YYYY}` so that
     * concurrent calls never produce the same number. The TTL is set to 400 days
     * on first write so the counter expires well after year-end without manual cleanup.
     *
     * Format: SB-{YYYY}-{00000} (e.g. SB-2026-00042)
     */
    generateInvoiceNumber(): Promise<string>;
    /**
     * Update the status of an existing payment.
     * Used by webhooks to flip PENDING -> COMPLETED/FAILED.
     */
    updatePaymentStatus(paymentId: string, status: PaymentStatus, metadata?: Record<string, unknown>): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        id: string;
        description: string | null;
        status: import("@prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        paidAt: Date | null;
        orgId: string;
        currency: string;
        subscriptionId: string | null;
        provider: import("@prisma/client").$Enums.PaymentProvider;
        providerTransactionId: string | null;
        invoiceNumber: string | null;
        subscriptionPlan: string | null;
        billingPeriodStart: Date | null;
        billingPeriodEnd: Date | null;
    }>;
}
export declare const paymentService: PaymentService;
export { PaymentService };
//# sourceMappingURL=payment.service.d.ts.map