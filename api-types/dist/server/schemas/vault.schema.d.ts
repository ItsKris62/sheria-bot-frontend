import { z } from 'zod';
export declare const documentCategorySchema: z.ZodEnum<{
    COMPLIANCE: "COMPLIANCE";
    OTHER: "OTHER";
    CORPORATE: "CORPORATE";
    FINANCIAL: "FINANCIAL";
    LICENSE: "LICENSE";
    OPERATIONS: "OPERATIONS";
    TAX: "TAX";
}>;
export declare const vaultDocumentStatusSchema: z.ZodEnum<{
    EXPIRED: "EXPIRED";
    PENDING: "PENDING";
    VERIFIED: "VERIFIED";
}>;
export type DocumentCategoryValue = z.infer<typeof documentCategorySchema>;
export type VaultDocumentStatusValue = z.infer<typeof vaultDocumentStatusSchema>;
export declare const vaultGetUploadUrlSchema: z.ZodObject<{
    name: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    description: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodString>;
    declaredFilename: z.ZodString;
    declaredMimeType: z.ZodEnum<{
        "application/pdf": "application/pdf";
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        "application/msword": "application/msword";
        "application/vnd.ms-excel": "application/vnd.ms-excel";
        "application/vnd.ms-powerpoint": "application/vnd.ms-powerpoint";
        "text/plain": "text/plain";
        "text/csv": "text/csv";
        "image/png": "image/png";
        "image/jpeg": "image/jpeg";
        "image/webp": "image/webp";
    }>;
    declaredSize: z.ZodNumber;
    category: z.ZodEnum<{
        COMPLIANCE: "COMPLIANCE";
        OTHER: "OTHER";
        CORPORATE: "CORPORATE";
        FINANCIAL: "FINANCIAL";
        LICENSE: "LICENSE";
        OPERATIONS: "OPERATIONS";
        TAX: "TAX";
    }>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type VaultGetUploadUrlInput = z.infer<typeof vaultGetUploadUrlSchema>;
export declare const vaultConfirmUploadSchema: z.ZodObject<{
    documentId: z.ZodString;
}, z.core.$strip>;
export type VaultConfirmUploadInput = z.infer<typeof vaultConfirmUploadSchema>;
export declare const vaultListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    category: z.ZodOptional<z.ZodEnum<{
        COMPLIANCE: "COMPLIANCE";
        OTHER: "OTHER";
        CORPORATE: "CORPORATE";
        FINANCIAL: "FINANCIAL";
        LICENSE: "LICENSE";
        OPERATIONS: "OPERATIONS";
        TAX: "TAX";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        EXPIRED: "EXPIRED";
        PENDING: "PENDING";
        VERIFIED: "VERIFIED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        name: "name";
        fileSize: "fileSize";
        expiryDate: "expiryDate";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
}, z.core.$strip>;
export type VaultListQueryInput = z.infer<typeof vaultListQuerySchema>;
export declare const vaultDocumentIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type VaultDocumentIdInput = z.infer<typeof vaultDocumentIdSchema>;
export declare const vaultUpdateDocumentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category: z.ZodOptional<z.ZodEnum<{
        COMPLIANCE: "COMPLIANCE";
        OTHER: "OTHER";
        CORPORATE: "CORPORATE";
        FINANCIAL: "FINANCIAL";
        LICENSE: "LICENSE";
        OPERATIONS: "OPERATIONS";
        TAX: "TAX";
    }>>;
    expiryDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type VaultUpdateDocumentInput = z.infer<typeof vaultUpdateDocumentSchema>;
export declare const vaultUpdateStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<{
        EXPIRED: "EXPIRED";
        PENDING: "PENDING";
        VERIFIED: "VERIFIED";
    }>;
}, z.core.$strip>;
export type VaultUpdateStatusInput = z.infer<typeof vaultUpdateStatusSchema>;
export declare const vaultReplaceDocumentSchema: z.ZodObject<{
    id: z.ZodString;
    filename: z.ZodString;
    fileType: z.ZodEnum<{
        "application/pdf": "application/pdf";
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        "application/msword": "application/msword";
        "application/vnd.ms-excel": "application/vnd.ms-excel";
        "application/vnd.ms-powerpoint": "application/vnd.ms-powerpoint";
        "text/plain": "text/plain";
        "text/csv": "text/csv";
        "image/png": "image/png";
        "image/jpeg": "image/jpeg";
        "image/webp": "image/webp";
    }>;
    fileSize: z.ZodNumber;
}, z.core.$strip>;
export type VaultReplaceDocumentInput = z.infer<typeof vaultReplaceDocumentSchema>;
//# sourceMappingURL=vault.schema.d.ts.map