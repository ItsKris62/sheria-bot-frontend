import { z } from 'zod';
export declare const ReviewStatusSchema: z.ZodEnum<{
    APPROVED: "APPROVED";
    REJECTED: "REJECTED";
    PENDING_REVIEW: "PENDING_REVIEW";
    NEEDS_MANUAL_REVIEW: "NEEDS_MANUAL_REVIEW";
}>;
export declare const PrioritySourceMetadataIntakeSchema: z.ZodObject<{
    regulatoryDocumentId: z.ZodString;
    currentTitle: z.ZodString;
    normalizedTitle: z.ZodString;
    approvedSourceId: z.ZodNullable<z.ZodString>;
    authorityName: z.ZodString;
    officialUrl: z.ZodNullable<z.ZodString>;
    publicationDate: z.ZodNullable<z.ZodString>;
    retrievedAt: z.ZodNullable<z.ZodString>;
    effectiveDate: z.ZodNullable<z.ZodString>;
    effectiveEndDate: z.ZodNullable<z.ZodString>;
    versionLabel: z.ZodNullable<z.ZodString>;
    checksumSha256: z.ZodNullable<z.ZodString>;
    status: z.ZodString;
    authorityStatus: z.ZodString;
    isBinding: z.ZodBoolean;
    documentType: z.ZodString;
    jurisdiction: z.ZodString;
    notes: z.ZodNullable<z.ZodString>;
    reviewStatus: z.ZodEnum<{
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        PENDING_REVIEW: "PENDING_REVIEW";
        NEEDS_MANUAL_REVIEW: "NEEDS_MANUAL_REVIEW";
    }>;
}, z.core.$strip>;
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;
export type PrioritySourceMetadataIntake = z.infer<typeof PrioritySourceMetadataIntakeSchema>;
//# sourceMappingURL=intake-schema.d.ts.map