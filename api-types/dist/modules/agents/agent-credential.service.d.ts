import type { Redis } from '@upstash/redis';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
export declare const AGENT_CREDENTIAL_HEADER: "x-agent-credential";
export declare const AGENT_CREDENTIAL_HEADER_DISPLAY: "X-Agent-Credential";
export declare const AGENT_SERVICE_USER_ID: "sys-agent-orchestrator";
export declare const AGENT_SERVICE_EMAIL: "sys-agent-orchestrator@sheriabot.internal";
export declare const AGENT_CAPABILITIES: readonly ["agents.run.create", "agents.run.read", "agents.run.advance", "agents.run.complete", "agents.run.fail", "agents.report.create", "agents.regIntel.run.create", "agents.marketing.draft.create", "agents.marketing.draft.read", "agents.sales.draft.create", "agents.sales.draft.read", "agents.automation.log.create", "agents.automation.generate", "agents.automation.metrics.read", "agents.automation.approval.create", "agents.automation.approval.read", "agents.automation.content.publish", "agents.automation.content.queueCandidate", "agents.automation.regulatoryItems.read", "agents.automation.approvedContent.read", "agents.automation.newsletter.send", "agents.automation.outreach.queue", "agents.automation.sources.read", "agents.automation.sources.fetch", "agents.automation.sources.dedupe", "agents.automation.pilotCohort.read", "agents.automation.dpaVendor.read", "agents.automation.notify.shouldNotify", "agents.productBi.report.create", "agents.productBi.report.read", "agents.securityOps.report.create", "agents.securityOps.report.read", "agents.chiefOfStaff.report.create", "agents.chiefOfStaff.report.read"];
export type AgentCapability = (typeof AGENT_CAPABILITIES)[number];
export type AgentPrincipalId = 'sys-agent-orchestrator' | 'sys-automation-orchestrator' | 'sys-scheduler-orchestrator';
interface AgentPrincipalDefinition {
    principalId: AgentPrincipalId;
    email: string;
    fullName: string;
    configKey: string;
    capabilities: readonly AgentCapability[];
}
/**
 * Distinct service principals, each with its own hashed secret (stored
 * under its own SystemConfig key) and its own fixed capability grant.
 * verifyCredential() matches a presented secret against every principal
 * and returns only the matched principal's own capabilities  -  capabilities
 * are never unioned across principals, and issuing/revoking one principal's
 * credential never touches another's.
 */
export declare const AGENT_PRINCIPALS: Record<AgentPrincipalId, AgentPrincipalDefinition>;
export interface AgentIdentity {
    userId: AgentPrincipalId;
    email: string;
    role: 'SERVICE';
    capabilities: readonly AgentCapability[];
}
export type AgentCredentialFailureReason = 'missing' | 'malformed' | 'not_configured' | 'invalid' | 'revoked' | 'service_unavailable';
export declare class AgentCredentialError extends Error {
    readonly reason: AgentCredentialFailureReason;
    constructor(reason: AgentCredentialFailureReason);
}
type AgentCredentialPrisma = Pick<typeof defaultPrisma, 'systemConfig' | 'user'>;
type AgentCredentialRedis = Pick<Redis, 'exists' | 'set'>;
export interface AgentCredentialServiceDependencies {
    prisma?: AgentCredentialPrisma;
    redis?: AgentCredentialRedis;
}
export declare function isAgentCapability(value: string): value is AgentCapability;
export declare class AgentCredentialService {
    private readonly prisma;
    private readonly redis;
    constructor(dependencies?: AgentCredentialServiceDependencies);
    ensureServiceUser(principalId?: AgentPrincipalId): Promise<void>;
    issueNewCredential(principalId?: AgentPrincipalId): Promise<{
        secret: string;
        credentialHash: string;
        issuedAt: string;
        version: number;
    }>;
    revokeActiveCredential(principalId?: AgentPrincipalId): Promise<void>;
    verifyCredential(secret: string | null): Promise<AgentIdentity>;
    private getStoredCredential;
    private revokeCredentialHash;
}
export declare const agentCredentialService: AgentCredentialService;
export {};
//# sourceMappingURL=agent-credential.service.d.ts.map