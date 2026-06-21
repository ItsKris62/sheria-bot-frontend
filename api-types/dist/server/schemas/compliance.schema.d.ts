import { z } from 'zod';
/**
 * Compliance Schemas
 *
 * Zod validation schemas for compliance query operations with RAG.
 */
/**
 * Submit compliance query
 *
 * @example
 * {
 *   question: "What are the KYC requirements for mobile lending?",
 *   organizationType: "FINTECH",
 *   industry: "Mobile Lending",
 *   context: "We are launching a new product..."
 * }
 */
export declare const complianceQuerySchema: z.ZodObject<{
    question: z.ZodString;
    organizationType: z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        FINTECH: "FINTECH";
        BANK: "BANK";
        TELECOM: "TELECOM";
        INSURANCE: "INSURANCE";
    }>>;
    industry: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodString>;
    answerDetail: z.ZodDefault<z.ZodEnum<{
        standard: "standard";
        detailed: "detailed";
    }>>;
}, z.core.$strip>;
export type ComplianceQueryInput = z.infer<typeof complianceQuerySchema>;
/**
 * Search legal documents
 */
export declare const searchDocumentsSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
    filter: z.ZodOptional<z.ZodObject<{
        documentType: z.ZodOptional<z.ZodString>;
        regulatoryArea: z.ZodOptional<z.ZodString>;
        dateFrom: z.ZodOptional<z.ZodDate>;
        dateTo: z.ZodOptional<z.ZodDate>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SearchDocumentsInput = z.infer<typeof searchDocumentsSchema>;
/**
 * Get query history
 */
export declare const getQueryHistorySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetQueryHistoryInput = z.infer<typeof getQueryHistorySchema>;
/**
 * Get query by ID
 */
export declare const getQuerySchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type GetQueryInput = z.infer<typeof getQuerySchema>;
/**
 * Follow-up query
 */
export declare const followUpQuerySchema: z.ZodObject<{
    originalQueryId: z.ZodString;
    question: z.ZodString;
}, z.core.$strip>;
export type FollowUpQueryInput = z.infer<typeof followUpQuerySchema>;
/**
 * Quick compliance check
 */
export declare const quickCheckSchema: z.ZodObject<{
    scenario: z.ZodString;
    organizationType: z.ZodEnum<{
        OTHER: "OTHER";
        FINTECH: "FINTECH";
        BANK: "BANK";
        TELECOM: "TELECOM";
        INSURANCE: "INSURANCE";
    }>;
}, z.core.$strip>;
export type QuickCheckInput = z.infer<typeof quickCheckSchema>;
/**
 * Get suggested queries for the active user
 */
export declare const getSuggestedQueriesSchema: z.ZodObject<{}, z.core.$strip>;
export type GetSuggestedQueriesInput = z.infer<typeof getSuggestedQueriesSchema>;
/**
 * Record a suggestion click (telemetry)
 */
export declare const recordSuggestionClickSchema: z.ZodObject<{
    suggestionId: z.ZodString;
    suggestionText: z.ZodOptional<z.ZodString>;
    surface: z.ZodDefault<z.ZodEnum<{
        other: "other";
        empty_state: "empty_state";
        sidebar: "sidebar";
        dashboard: "dashboard";
    }>>;
}, z.core.$strip>;
export type RecordSuggestionClickInput = z.infer<typeof recordSuggestionClickSchema>;
//# sourceMappingURL=compliance.schema.d.ts.map