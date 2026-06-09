/**
 * Compliance Checklist Generation Prompts
 * AI prompts for generating RAG-grounded compliance checklists
 * for Kenyan fintech regulatory requirements.
 */
import { z } from 'zod';
export interface ChecklistGenerationParams {
    productType: string;
    businessStage: string;
    targetSegments: string[];
    servicesOffered: string[];
    additionalConcerns?: string;
    ragContext?: string;
    ragSourcesUsed?: number;
}
export declare const ChecklistItemSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    regulatoryBasis: z.ZodString;
    priority: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    description: z.ZodString;
    guidance: z.ZodOptional<z.ZodString>;
    actionItems: z.ZodDefault<z.ZodArray<z.ZodString>>;
    deadline: z.ZodDefault<z.ZodString>;
    penalty: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const ChecklistCategorySchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        regulatoryBasis: z.ZodString;
        priority: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>;
        description: z.ZodString;
        guidance: z.ZodOptional<z.ZodString>;
        actionItems: z.ZodDefault<z.ZodArray<z.ZodString>>;
        deadline: z.ZodDefault<z.ZodString>;
        penalty: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const GeneratedChecklistSchema: z.ZodObject<{
    categories: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            regulatoryBasis: z.ZodString;
            priority: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            description: z.ZodString;
            guidance: z.ZodOptional<z.ZodString>;
            actionItems: z.ZodDefault<z.ZodArray<z.ZodString>>;
            deadline: z.ZodDefault<z.ZodString>;
            penalty: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    metadata: z.ZodObject<{
        productType: z.ZodString;
        businessStage: z.ZodString;
        totalItems: z.ZodNumber;
        criticalItems: z.ZodNumber;
        highItems: z.ZodNumber;
        estimatedCompletionDays: z.ZodNumber;
        generatedAt: z.ZodString;
        ragSourcesUsed: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type ChecklistCategory = z.infer<typeof ChecklistCategorySchema>;
export type GeneratedChecklist = z.infer<typeof GeneratedChecklistSchema>;
/**
 * System prompt establishing the AI persona and output contract.
 */
export declare function generateChecklistSystemPrompt(): string;
/**
 * User prompt with full context for checklist generation.
 */
export declare function generateChecklistUserPrompt(params: ChecklistGenerationParams): string;
/**
 * Parse and strictly validate AI checklist output via Zod.
 *
 * Pipeline:
 *  1. Strip markdown code fences (Claude sometimes adds them despite instructions).
 *  2. JSON.parse()  -  throw if not valid JSON.
 *  3. GeneratedChecklistSchema.parse()  -  throw ZodError with field-level detail
 *     if the shape is wrong.  This is the P0 guard against corrupt DB writes.
 *  4. Recompute metadata counts from actual item data (override AI-reported counts).
 *
 * Throws an Error with a descriptive message on any failure.
 * Callers (checklist.service.ts) must catch and mark the checklist FAILED.
 */
export declare function parseChecklistOutput(rawContent: string): GeneratedChecklist;
/**
 * Minimal passage shape expected by the tier prompt builders.
 * SearchResult from rag.service.ts is a structural superset of this interface
 * and can be passed without any conversion.
 */
export interface RagPassage {
    chunkText: string;
    documentTitle: string;
}
/**
 * Trim a list of RAG passages to fit within a rough token budget.
 * Uses the standard approximation: 1 token ≈ 4 characters.
 * Passages are included in order (highest-relevance first) until the budget
 * is exhausted; the first passage is always included even if it alone exceeds
 * the budget.
 */
export declare function trimRagPassages(passages: RagPassage[], maxTokenBudget: number): RagPassage[];
export declare const Tier1ResponseSchema: z.ZodObject<{
    categories: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            regulatoryBasis: z.ZodString;
            priority: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            description: z.ZodString;
            guidance: z.ZodOptional<z.ZodString>;
            actionItems: z.ZodDefault<z.ZodArray<z.ZodString>>;
            deadline: z.ZodDefault<z.ZodString>;
            penalty: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    metadata: z.ZodObject<{
        productType: z.ZodString;
        businessStage: z.ZodString;
        totalItems: z.ZodNumber;
        criticalItems: z.ZodNumber;
        highItems: z.ZodNumber;
        estimatedCompletionDays: z.ZodNumber;
        generatedAt: z.ZodString;
        ragSourcesUsed: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const Tier2ResponseSchema: z.ZodObject<{
    categories: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            regulatoryBasis: z.ZodString;
            priority: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            description: z.ZodString;
            guidance: z.ZodOptional<z.ZodString>;
            actionItems: z.ZodDefault<z.ZodArray<z.ZodString>>;
            deadline: z.ZodDefault<z.ZodString>;
            penalty: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    metadata: z.ZodObject<{
        productType: z.ZodString;
        businessStage: z.ZodString;
        totalItems: z.ZodNumber;
        criticalItems: z.ZodNumber;
        highItems: z.ZodNumber;
        estimatedCompletionDays: z.ZodNumber;
        generatedAt: z.ZodString;
        ragSourcesUsed: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const Tier3ResponseSchema: z.ZodObject<{
    categories: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            regulatoryBasis: z.ZodString;
            priority: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            description: z.ZodString;
            guidance: z.ZodOptional<z.ZodString>;
            actionItems: z.ZodDefault<z.ZodArray<z.ZodString>>;
            deadline: z.ZodDefault<z.ZodString>;
            penalty: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    metadata: z.ZodOptional<z.ZodObject<{
        productType: z.ZodOptional<z.ZodString>;
        businessStage: z.ZodOptional<z.ZodString>;
        totalItems: z.ZodOptional<z.ZodNumber>;
        criticalItems: z.ZodOptional<z.ZodNumber>;
        highItems: z.ZodOptional<z.ZodNumber>;
        estimatedCompletionDays: z.ZodOptional<z.ZodNumber>;
        generatedAt: z.ZodOptional<z.ZodString>;
        ragSourcesUsed: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare function buildTier1Prompt(input: Pick<ChecklistGenerationParams, 'productType' | 'businessStage' | 'targetSegments' | 'servicesOffered' | 'additionalConcerns'>, passages: RagPassage[]): {
    system: string;
    user: string;
};
export declare function buildTier2Prompt(input: Pick<ChecklistGenerationParams, 'productType' | 'businessStage' | 'targetSegments' | 'servicesOffered' | 'additionalConcerns'>, passages: RagPassage[]): {
    system: string;
    user: string;
};
export declare function buildTier3Prompt(input: Pick<ChecklistGenerationParams, 'productType' | 'businessStage' | 'targetSegments' | 'servicesOffered' | 'additionalConcerns'>): {
    system: string;
    user: string;
};
/**
 * Parse and validate raw AI output for a given generation tier.
 *
 * Pipeline:
 *  1. extractJsonObject()  -  strip fences, JSON.parse, repair truncation
 *  2. Attempt full tier Zod schema validation (strictest pass)
 *  3. If full validation fails, attempt per-category Zod recovery
 *  4. synthesizeMetadata()  -  recompute counts from validated data; fill defaults
 *  5. Return a complete GeneratedChecklist
 *
 * Throws on unrecoverable failure so callers can escalate to the next tier.
 * No unvalidated data reaches the database  -  every category in the result has
 * passed ChecklistCategorySchema.safeParse().
 */
export declare function parseWithTierSchema(rawContent: string, tier: 1 | 2 | 3, logCtx: {
    checklistId?: string;
    input: {
        productType: string;
        businessStage: string;
    };
    ragSourcesUsed?: number;
}): GeneratedChecklist;
//# sourceMappingURL=checklist-generation.d.ts.map