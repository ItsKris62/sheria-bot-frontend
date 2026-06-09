/**
 * Compliance Checklist  -  Types, Zod Schemas, and Constants
 *
 * Covers the normalized ChecklistItem model (new path, post-March 2026).
 * Legacy JSON-blob checklists (checklistData / itemProgress) continue to
 * work via the existing ComplianceModule methods and are detected at runtime
 * via `isNormalizedChecklist()` in checklist.service.ts.
 */
import { z } from 'zod';
export declare const CHECKLIST_STATUS: {
    readonly GENERATING: "GENERATING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type ChecklistStatus = (typeof CHECKLIST_STATUS)[keyof typeof CHECKLIST_STATUS];
export declare const CHECKLIST_ITEM_STATUS: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly NOT_APPLICABLE: "NOT_APPLICABLE";
};
export type ChecklistItemStatus = (typeof CHECKLIST_ITEM_STATUS)[keyof typeof CHECKLIST_ITEM_STATUS];
export declare const CHECKLIST_ITEM_PRIORITY: {
    readonly CRITICAL: "CRITICAL";
    readonly HIGH: "HIGH";
    readonly MEDIUM: "MEDIUM";
    readonly LOW: "LOW";
};
export type ChecklistItemPriority = (typeof CHECKLIST_ITEM_PRIORITY)[keyof typeof CHECKLIST_ITEM_PRIORITY];
/**
 * Maximum age (ms) of a GENERATING checklist before the lazy-evaluation stale
 * cleanup marks it FAILED.  Must be ≥ the AI client timeout (120 s) plus
 * reasonable DB/RAG overhead.
 */
export declare const CHECKLIST_STALE_TIMEOUT_MS: number;
export declare const generateChecklistAsyncInputSchema: z.ZodObject<{
    productType: z.ZodString;
    businessStage: z.ZodString;
    targetSegments: z.ZodArray<z.ZodString>;
    servicesOffered: z.ZodArray<z.ZodString>;
    additionalConcerns: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GenerateChecklistAsyncInput = z.infer<typeof generateChecklistAsyncInputSchema>;
export declare const updateChecklistItemInputSchema: z.ZodObject<{
    checklistId: z.ZodString;
    itemId: z.ZodString;
    status: z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        PENDING: "PENDING";
        NOT_APPLICABLE: "NOT_APPLICABLE";
    }>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemInputSchema>;
export declare const getChecklistStatusInputSchema: z.ZodObject<{
    checklistId: z.ZodString;
}, z.core.$strip>;
export type GetChecklistStatusInput = z.infer<typeof getChecklistStatusInputSchema>;
export interface ChecklistGenerateResult {
    checklistId: string;
    /** Always GENERATING on initial response  -  frontend polls getChecklistStatus. */
    status: 'GENERATING';
}
export interface ChecklistStatusResult {
    checklistId: string;
    status: ChecklistStatus;
    progress: number;
    completedItems: number;
    totalItems: number;
    title: string;
    createdAt: Date;
    /** True when normalized ChecklistItem records exist for this checklist. */
    isNormalized: boolean;
    productType: string | null;
    businessStage: string | null;
    /** Persisted generation metadata  -  available for FAILED state UI. */
    metadata: {
        errorMessage?: string | null;
        retryCount?: number;
        generationTier?: string | null;
    } | null;
}
export interface ChecklistSummary {
    id: string;
    title: string;
    productType: string | null;
    businessStage: string | null;
    targetSegments: unknown;
    servicesOffered: unknown;
    additionalConcerns: string | null;
    progress: number;
    completedItems: number;
    totalItems: number;
    criticalItems: number;
    status: ChecklistStatus;
    /** Persisted error reason for FAILED checklists. */
    metadata: unknown;
    generatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    /** True when normalized ChecklistItem records exist for this checklist. */
    isNormalized: boolean;
}
export interface ChecklistItemDetail {
    id: string;
    category: string;
    itemCode: string | null;
    title: string;
    description: string;
    guidance: string | null;
    regulatoryReference: string;
    actionItems: string[];
    deadline: string | null;
    penalty: string | null;
    priority: ChecklistItemPriority;
    status: ChecklistItemStatus;
    notes: string | null;
    order: number;
    completedAt: Date | null;
    completedById: string | null;
}
export interface ChecklistCategoryDetail {
    name: string;
    items: ChecklistItemDetail[];
    completedCount: number;
    totalCount: number;
    /** 0-100 percentage. */
    progress: number;
}
export interface ChecklistDetail {
    id: string;
    title: string;
    productType: string | null;
    businessStage: string | null;
    targetSegments: unknown;
    servicesOffered: unknown;
    additionalConcerns: string | null;
    progress: number;
    completedItems: number;
    totalItems: number;
    status: ChecklistStatus;
    summary: unknown;
    metadata: unknown;
    generatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
    isNormalized: true;
    categories: ChecklistCategoryDetail[];
}
export interface UpdateItemResult {
    item: {
        id: string;
        status: ChecklistItemStatus;
        notes: string | null;
        completedAt: Date | null;
    };
    checklist: {
        id: string;
        progress: number;
        completedItems: number;
        status: ChecklistStatus;
        completedAt: Date | null;
    };
}
export interface RawChecklistItemRow {
    id: string;
    checklistId: string;
    category: string;
    itemCode: string | null;
    title: string;
    description: string;
    guidance: string | null;
    regulatoryReference: string;
    actionItems: unknown;
    deadline: string | null;
    penalty: string | null;
    priority: string;
    status: string;
    notes: string | null;
    order: number;
    completedAt: Date | null;
    completedById: string | null;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Safely cast a JSON-stored value to string[].
 * Returns [] for non-arrays or mixed-type values.
 */
export declare function safeStringArray(raw: unknown): string[];
//# sourceMappingURL=checklist.types.d.ts.map