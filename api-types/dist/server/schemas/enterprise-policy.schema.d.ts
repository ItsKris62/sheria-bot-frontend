import { z } from 'zod';
/**
 * Supported policy types for generation.
 */
export declare const PolicyTypeEnum: z.ZodEnum<{
    DATA_PROTECTION: "DATA_PROTECTION";
    CYBERSECURITY: "CYBERSECURITY";
    AML_CFT: "AML_CFT";
    CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
    CUSTOM: "CUSTOM";
    IT_SECURITY: "IT_SECURITY";
}>;
export type PolicyType = z.infer<typeof PolicyTypeEnum>;
/**
 * Input schema for creating a new enterprise policy draft.
 *
 * This is the initial mutation — it creates the DB record and
 * (in a future phase) fires the async generation pipeline.
 */
export declare const createDraftSchema: z.ZodObject<{
    policyType: z.ZodEnum<{
        DATA_PROTECTION: "DATA_PROTECTION";
        CYBERSECURITY: "CYBERSECURITY";
        AML_CFT: "AML_CFT";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CUSTOM: "CUSTOM";
        IT_SECURITY: "IT_SECURITY";
    }>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    targetAudience: z.ZodOptional<z.ZodString>;
    organizationType: z.ZodOptional<z.ZodString>;
    regulatoryFrameworks: z.ZodArray<z.ZodString>;
    jurisdiction: z.ZodDefault<z.ZodString>;
    sourceGapAnalysisId: z.ZodOptional<z.ZodString>;
    sourceGapId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateDraftInput = z.infer<typeof createDraftSchema>;
/**
 * Input schema for fetching a single policy by ID.
 */
export declare const getPolicySchema: z.ZodObject<{
    policyId: z.ZodString;
}, z.core.$strip>;
export type GetPolicyInput = z.infer<typeof getPolicySchema>;
/**
 * Input schema for listing user's generated policies.
 */
export declare const listPoliciesSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
        ARCHIVED: "ARCHIVED";
        INITIALIZING: "INITIALIZING";
        OUTLINING: "OUTLINING";
        DRAFTING: "DRAFTING";
        REVIEWING: "REVIEWING";
    }>>;
    policyType: z.ZodOptional<z.ZodEnum<{
        DATA_PROTECTION: "DATA_PROTECTION";
        CYBERSECURITY: "CYBERSECURITY";
        AML_CFT: "AML_CFT";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        CUSTOM: "CUSTOM";
        IT_SECURITY: "IT_SECURITY";
    }>>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type ListPoliciesInput = z.infer<typeof listPoliciesSchema>;
/**
 * Input schema for updating a single section's content (TipTap JSON).
 */
export declare const updateSectionContentSchema: z.ZodObject<{
    policyId: z.ZodString;
    sectionId: z.ZodString;
    content: z.ZodAny;
    contentMarkdown: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateSectionContentInput = z.infer<typeof updateSectionContentSchema>;
export declare const SectionStatusEnum: z.ZodEnum<{
    DRAFT: "DRAFT";
    APPROVED: "APPROVED";
    REVIEWED: "REVIEWED";
    NEEDS_REVISION: "NEEDS_REVISION";
}>;
export type SectionStatus = z.infer<typeof SectionStatusEnum>;
export declare const updateSectionStatusSchema: z.ZodObject<{
    policyId: z.ZodString;
    sectionId: z.ZodString;
    status: z.ZodEnum<{
        DRAFT: "DRAFT";
        APPROVED: "APPROVED";
        REVIEWED: "REVIEWED";
        NEEDS_REVISION: "NEEDS_REVISION";
    }>;
}, z.core.$strip>;
export type UpdateSectionStatusInput = z.infer<typeof updateSectionStatusSchema>;
export declare const getVersionHistorySchema: z.ZodObject<{
    policyId: z.ZodString;
}, z.core.$strip>;
export type GetVersionHistoryInput = z.infer<typeof getVersionHistorySchema>;
/**
 * Input schema for getting pipeline status (polling).
 */
export declare const getStatusSchema: z.ZodObject<{
    policyId: z.ZodString;
}, z.core.$strip>;
export type GetStatusInput = z.infer<typeof getStatusSchema>;
/**
 * Input schema for deleting (soft-archiving) a generated policy.
 */
export declare const deletePolicySchema: z.ZodObject<{
    policyId: z.ZodString;
}, z.core.$strip>;
export type DeletePolicyInput = z.infer<typeof deletePolicySchema>;
export declare const exportGeneratedPolicySchema: z.ZodObject<{
    policyId: z.ZodString;
    format: z.ZodEnum<{
        PDF: "PDF";
        DOCX: "DOCX";
    }>;
}, z.core.$strip>;
export type ExportGeneratedPolicyInput = z.infer<typeof exportGeneratedPolicySchema>;
//# sourceMappingURL=enterprise-policy.schema.d.ts.map