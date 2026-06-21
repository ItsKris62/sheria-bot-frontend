/**
 * Checklist Service
 * Business logic for the normalized compliance checklist feature.
 *
 * Architecture:
 *  - generateChecklist()    -  creates a GENERATING record, fires background AI
 *                            generation without blocking the HTTP response.
 *  - runGeneration()        -  private; RAG -> AI -> prisma.$transaction; called
 *                            fire-and-forget from generateChecklist().
 *  - getChecklistStatus()   -  polling endpoint; applies lazy stale cleanup.
 *  - listChecklists()       -  list summary; applies lazy stale cleanup.
 *  - getChecklistDetail()   -  full detail with items grouped by category.
 *  - updateItemStatus()     -  per-item status toggle; recalculates progress.
 *  - softDeleteChecklist()  -  sets deletedAt; does not destroy the record.
 *
 * Legacy checklists (checklistData JSON blob + itemProgress map) continue to
 * work via compliance.module.ts.  Use isNormalizedChecklist() to distinguish.
 */
import { type ChecklistGenerateResult, type ChecklistStatusResult, type ChecklistSummary, type ChecklistDetail, type UpdateItemResult, type UpdateChecklistItemInput, type GenerateChecklistAsyncInput } from './checklist.types';
declare class ChecklistService {
    /**
     * Create a GENERATING checklist record and immediately return its ID.
     * Background AI generation is started fire-and-forget via runGeneration().
     *
     * The caller (tRPC router) returns { checklistId, status: 'GENERATING' }
     * to the frontend, which then polls getChecklistStatus().
     */
    generateChecklist(userId: string, orgId: string, input: GenerateChecklistAsyncInput, trialUserId?: string): Promise<ChecklistGenerateResult>;
    /**
     * Entry point for the background generation pipeline.
     * Fetches RAG passages (topK 12, minScore 0.65) then delegates to
     * runGenerationWithFallback() which implements the three-tier strategy.
     */
    private runGeneration;
    /**
     * Three-tier generation with progressive fallback.
     *
     * Tier 1  -  Full:       full prompt, up to 12 RAG passages (≤8000 token budget), 8192 max_tokens, 240s
     * Tier 2  -  Simplified: shorter prompt, top-6 passages (≤3000 token budget),   6144 max_tokens, 200s
     * Tier 3  -  Minimal:    source-insufficiency prompt only; service-level guard
     *                       prevents legal generation when no RAG passages exist.
     *
     * Each tier streams via executeChecklistStream() and validates via parseWithTierSchema()
     * (per-category Zod validation  -  no unvalidated data reaches the database).
     * If all three tiers fail, the checklist is marked FAILED with all error details.
     */
    private runGenerationWithFallback;
    /**
     * Execute a single generation tier: build prompts, stream, parse with
     * tier-specific Zod validation (including per-category partial recovery).
     * Throws on any failure so runGenerationWithFallback can escalate.
     */
    private runTier;
    /**
     * Persist a successfully generated checklist.
     * Maps AI output to ChecklistItem rows, updates the Checklist record to
     * IN_PROGRESS, and tracks trial token usage if applicable.
     * Extracted from runGeneration for reuse across all three tiers.
     */
    private saveGenerationResult;
    /**
     * Reset a FAILED checklist to GENERATING and re-fire the three-tier generation
     * pipeline using the original inputs stored on the record.
     *
     * Retries do NOT consume a usage credit (the original generation already did).
     * Retries are capped at 3 per checklist  -  if metadata.retryCount >= 3 this throws.
     */
    retryChecklist(checklistId: string, userId: string, orgId: string): Promise<{
        checklistId: string;
        status: 'GENERATING';
        retryCount: number;
    }>;
    /**
     * Return the current status of a checklist.
     * Applies the lazy stale-generation cleanup: if the record has been
     * GENERATING for > CHECKLIST_STALE_TIMEOUT_MS, it is marked FAILED here
     * (consistent with the billing grace-period lazy evaluation pattern).
     * No cron job required.
     */
    getChecklistStatus(checklistId: string, userId: string, orgId: string): Promise<ChecklistStatusResult>;
    /**
     * List all non-deleted checklists for an organization.
     * Also applies lazy stale cleanup to any GENERATING records older than
     * CHECKLIST_STALE_TIMEOUT_MS found in the result set.
     */
    listChecklists(orgId: string): Promise<ChecklistSummary[]>;
    /**
     * Return the full checklist detail with items grouped by category.
     * Only works for normalized checklists (isNormalized = true).
     */
    getChecklistDetail(checklistId: string, userId: string, orgId: string): Promise<ChecklistDetail>;
    /**
     * Update the status (and optional notes) of a single ChecklistItem.
     * Recalculates parent checklist progress and completedItems count.
     * If all items are COMPLETED or NOT_APPLICABLE, marks the checklist COMPLETED.
     *
     * Uses server-response-wins reconciliation: the returned values are the
     * authoritative server state that the frontend must apply via setQueryData.
     */
    updateItemStatus(userId: string, orgId: string, input: UpdateChecklistItemInput): Promise<UpdateItemResult>;
    /**
     * Soft-delete a checklist by setting deletedAt.
     * The record is retained in the database for audit purposes.
     * Works for both normalized and legacy checklists.
     */
    softDeleteChecklist(checklistId: string, userId: string, orgId: string): Promise<void>;
    /**
     * Returns true when the checklist has at least one normalized ChecklistItem
     * record, distinguishing it from legacy JSON-blob checklists.
     *
     * Use this in the frontend (via the `isNormalized` flag returned by list/status
     * endpoints) to decide which mutation to call:
     *  - isNormalized = true  -> compliance.updateChecklistItem (per-item update)
     *  - isNormalized = false -> compliance.updateChecklistProgress (legacy blob update)
     */
    isNormalizedChecklist(checklistId: string): Promise<boolean>;
    /**
     * Verify that the given checklist belongs to the caller's organization.
     * Regulators accessing shared checklists is a future TODO  -  not implemented.
     */
    private verifyOwnership;
    /** Map a raw DB row to the typed ChecklistItemDetail output shape. */
    private mapRawItemToDetail;
}
export declare const checklistService: ChecklistService;
export { ChecklistService };
//# sourceMappingURL=checklist.service.d.ts.map