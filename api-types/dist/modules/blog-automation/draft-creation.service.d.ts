import type { prisma as appPrisma } from '../../lib/prisma/client';
type BlogAutomationPrisma = typeof appPrisma;
export interface CreateBlogDraftFromSuggestionParams {
    prisma: BlogAutomationPrisma;
    suggestionId: string;
    createdById: string;
}
export interface CreateBlogDraftFromSuggestionResult {
    blogPostId: string;
    slug: string;
}
/**
 * Extracted verbatim from blog-automation.router.ts's adminCreateDraftFromSuggestion
 * mutation body so both the admin-dashboard route and the agent-callable automation
 * route delegate to one transactional implementation. `createdById` replaces the
 * router's `ctx.user!.id` - callers pass either a real admin's session id or the
 * `sys-automation-orchestrator` service principal id (a real User row via
 * agentCredentialService.ensureServiceUser), both valid BlogPost.authorId FKs.
 */
export declare function createBlogDraftFromSuggestion(params: CreateBlogDraftFromSuggestionParams): Promise<CreateBlogDraftFromSuggestionResult>;
export {};
//# sourceMappingURL=draft-creation.service.d.ts.map