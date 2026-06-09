import { z } from 'zod';
/**
 * Document Schemas
 *
 * Zod validation schemas for document upload, download, and management.
 */
/**
 * Get presigned upload URL
 */
export declare const getUploadUrlSchema: z.ZodObject<{
    filename: z.ZodString;
    fileType: z.ZodString;
    fileSize: z.ZodNumber;
    documentType: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;
/**
 * Confirm upload and create document record
 */
export declare const confirmUploadSchema: z.ZodObject<{
    key: z.ZodString;
    filename: z.ZodString;
    fileType: z.ZodString;
    fileSize: z.ZodNumber;
    documentType: z.ZodDefault<z.ZodString>;
    documentId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;
/**
 * List documents with pagination
 */
export declare const listDocumentsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    documentType: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ListDocumentsInput = z.infer<typeof listDocumentsSchema>;
/**
 * Get document by ID
 */
export declare const getDocumentSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type GetDocumentInput = z.infer<typeof getDocumentSchema>;
/**
 * Get presigned download URL
 */
export declare const getDownloadUrlSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type GetDownloadUrlInput = z.infer<typeof getDownloadUrlSchema>;
/**
 * Delete document
 */
export declare const deleteDocumentSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>;
//# sourceMappingURL=document.schema.d.ts.map