import type { FastifyInstance } from 'fastify';
import { rateLimiter } from '@/lib/redis/rate-limiter';
import { type AutomationApprovalService } from '@/modules/agents/automation/approval.service';
type ApprovalServiceLike = Pick<AutomationApprovalService, 'getApprovalPublicView' | 'recordApprovalDecision'>;
type RateLimitCheck = typeof rateLimiter.check;
export interface ApprovalDecisionRouteDependencies {
    approvalService?: ApprovalServiceLike;
    decisionLinkSecret?: string;
    now?: () => Date;
    rateLimitCheck?: RateLimitCheck;
}
export declare function registerApprovalDecisionRoutes(app: FastifyInstance, dependencies?: ApprovalDecisionRouteDependencies): void;
export {};
//# sourceMappingURL=approval-decision.route.d.ts.map