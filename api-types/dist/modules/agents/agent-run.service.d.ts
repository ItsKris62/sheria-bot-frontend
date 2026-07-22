import { Prisma } from '@prisma/client';
import type { AgentReport, AgentRun } from '@prisma/client';
import type { Redis } from '@upstash/redis';
import type { EmailOptions, EmailResult } from '@/lib/email/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
export declare const AGENT_RUN_STATUSES: readonly ["RUNNING", "COMPLETED", "FAILED", "HALTED_BUDGET", "HALTED_ITERATIONS"];
export type AgentRunStatus = (typeof AGENT_RUN_STATUSES)[number];
export interface AgentBudgetConfig {
    maxCostPerRunUsd: number;
    maxCostPerDayUsd: number;
    maxIterationsPerRun: number;
}
export interface BeginAgentRunInput {
    agentType: string;
    idempotencyKey: string;
    organizationId?: string;
    metadata?: Prisma.InputJsonValue;
    estimatedCostUsd?: number;
    retryFailed?: boolean;
}
export interface AdvanceAgentRunInput {
    runId: string;
    inputTokens?: number;
    outputTokens?: number;
    costUsd?: number;
    metadata?: Prisma.InputJsonValue;
}
export interface CompleteAgentRunInput {
    runId: string;
    inputTokens?: number;
    outputTokens?: number;
    costUsd?: number;
    metadata?: Prisma.InputJsonValue;
}
export interface FailAgentRunInput {
    runId: string;
    error: string;
    metadata?: Prisma.InputJsonValue;
}
export interface CreateAgentReportInput {
    agentRunId: string;
    summary?: string;
    signals?: Prisma.InputJsonValue;
    recommendedActions?: Prisma.InputJsonValue;
    risks?: Prisma.InputJsonValue;
    humanApproved?: boolean;
}
export type BeginAgentRunResult = {
    started: false;
    reason: 'agents_disabled';
} | {
    started: true;
    duplicate: boolean;
    run: AgentRun;
};
interface LLMCostGuard {
    checkCostLimit(estimatedCost: number): Promise<void>;
}
type SendEmail = (options: EmailOptions) => Promise<EmailResult>;
type AgentRunPrisma = {
    agentRun: Pick<typeof defaultPrisma.agentRun, 'create' | 'findUnique' | 'update' | 'updateMany'>;
    agentReport: Pick<typeof defaultPrisma.agentReport, 'create'>;
};
type AgentRunRedis = Pick<Redis, 'get' | 'set' | 'incrbyfloat' | 'expire'>;
export interface AgentRunServiceDependencies {
    prisma?: AgentRunPrisma;
    redis?: AgentRunRedis;
    llmGateway?: LLMCostGuard;
    sendEmail?: SendEmail;
    budgetConfigProvider?: () => AgentBudgetConfig;
    agentsEnabledProvider?: () => boolean;
    now?: () => Date;
}
export declare class AgentBudgetHalt extends Error {
    readonly reason: string;
    constructor(reason: string);
}
export declare class AgentIterationHalt extends Error {
    readonly maxIterations: number;
    constructor(maxIterations: number);
}
export declare class AgentRunService {
    private readonly prisma;
    private readonly redis;
    private readonly llmGateway;
    private readonly sendEmail;
    private readonly budgetConfigProvider;
    private readonly agentsEnabledProvider;
    private readonly now;
    constructor(dependencies?: AgentRunServiceDependencies);
    beginRun(input: BeginAgentRunInput): Promise<BeginAgentRunResult>;
    advanceRun(input: AdvanceAgentRunInput): Promise<AgentRun>;
    completeRun(input: CompleteAgentRunInput): Promise<AgentRun>;
    failRun(input: FailAgentRunInput): Promise<AgentRun>;
    createReport(input: CreateAgentReportInput): Promise<AgentReport>;
    getRun(runId: string): Promise<(AgentRun & {
        reports: AgentReport[];
    }) | null>;
    private readBudgetConfig;
    private assertBudgetBeforeWork;
    private updateUsage;
    private markRunStatus;
    private requireRun;
    private alertOperator;
}
export declare const agentRunService: AgentRunService;
export {};
//# sourceMappingURL=agent-run.service.d.ts.map