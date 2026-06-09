import { z } from 'zod';
/**
 * Policy Schemas
 *
 * Zod validation schemas for policy management and AI generation.
 */
/**
 * Generate policy with AI
 *
 * @example
 * {
 *   title: "Data Protection Policy for Mobile Lending",
 *   scenario: "We are a mobile lending platform...",
 *   organizationType: "FINTECH",
 *   regulatoryAreas: ["data-protection", "consumer-protection"],
 *   specificRequirements: "Must comply with ODPC guidelines"
 * }
 */
export declare const generatePolicySchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    scenario: z.ZodString;
    organizationType: z.ZodEnum<{
        OTHER: "OTHER";
        FINTECH: "FINTECH";
        BANK: "BANK";
        TELECOM: "TELECOM";
        INSURANCE: "INSURANCE";
    }>;
    regulatoryAreas: z.ZodArray<z.ZodString>;
    specificRequirements: z.ZodOptional<z.ZodString>;
    targetAudience: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GeneratePolicyInput = z.infer<typeof generatePolicySchema>;
/**
 * List policies with filters
 */
export declare const listPoliciesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        GENERATING: "GENERATING";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
    }>>;
    regulatoryArea: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ListPoliciesInput = z.infer<typeof listPoliciesSchema>;
/**
 * Get policy by ID
 */
export declare const getPolicySchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type GetPolicyInput = z.infer<typeof getPolicySchema>;
/**
 * Update policy
 */
export declare const updatePolicySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        GENERATING: "GENERATING";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
    }>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;
/**
 * Delete policy
 */
export declare const deletePolicySchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type DeletePolicyInput = z.infer<typeof deletePolicySchema>;
/**
 * Export policy
 */
export declare const exportPolicySchema: z.ZodObject<{
    id: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<{
        PDF: "PDF";
        DOCX: "DOCX";
        MD: "MD";
    }>>;
}, z.core.$strip>;
export type ExportPolicyInput = z.infer<typeof exportPolicySchema>;
/**
 * Refine policy with AI
 */
export declare const refinePolicySchema: z.ZodObject<{
    id: z.ZodString;
    refinementInstructions: z.ZodString;
}, z.core.$strip>;
export type RefinePolicyInput = z.infer<typeof refinePolicySchema>;
/**
 * Verify policy citations
 */
export declare const verifyCitationsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type VerifyCitationsInput = z.infer<typeof verifyCitationsSchema>;
//# sourceMappingURL=policy.schema.d.ts.map