import { SubscriptionPlan } from '@prisma/client';
import type { EffectivePlan, PilotEntitlementProfile } from '@/types/plan.types';
export type SupportTier = 'community' | 'email-48hr' | 'priority-24hr' | 'dedicated';
export type AnalyticsTier = 'none' | 'basic' | 'advanced';
export type KnowledgeBaseAccess = 'read-only' | 'full';
export interface QuotaEntitlement {
    /** -1 = unlimited, 0 = not available, n = cap for the given period */
    limit: number;
    /** 'month' = reset on billing cycle; 'lifetime' = never resets */
    period: 'month' | 'lifetime';
}
export interface StorageEntitlement {
    /** -1 = unlimited, 0 = not available */
    limitMB: number;
}
export type ApiAccessEntitlement = false | QuotaEntitlement;
export declare const VAULT_BASE_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain"];
export declare const VAULT_STARTUP_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "text/csv"];
export declare const VAULT_BUSINESS_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "text/csv", "image/png", "image/jpeg"];
export declare const VAULT_ENTERPRISE_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "text/csv", "image/png", "image/jpeg", "image/webp"];
export declare const ALLOWED_VAULT_MIME_TYPE_VALUES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "text/plain", "text/csv", "image/png", "image/jpeg", "image/webp"];
export interface AlertEntitlement {
    /** -1 = unlimited history; n = days of history accessible */
    historyDays: number;
    /** null = no email alerts for this tier */
    emailFrequency: 'REALTIME' | 'DAILY' | 'WEEKLY' | null;
    customFilters: boolean;
    aiSummary: boolean;
}
export interface PlanEntitlementConfig {
    complianceQueries: QuotaEntitlement;
    checklistGenerations: QuotaEntitlement;
    apiAccess: ApiAccessEntitlement;
    gapAnalysis: QuotaEntitlement;
    benchmarkDocuments: boolean;
    policyGeneration: boolean;
    customFrameworks: boolean;
    customIntegrations: boolean;
    teamCollaboration: boolean;
    regulatoryDashboard: boolean;
    regulatoryAlerts: boolean;
    /** Rich alert entitlements  history window, email frequency, filters */
    alerts?: AlertEntitlement;
    /** Compliance Calendar -- create/manage org-scoped deadline events */
    complianceCalendar: boolean;
    /** License Management -- manage org-scoped licenses, renewals, evidence links, and fees */
    licenseManagement: boolean;
    documentRepository: StorageEntitlement;
    /** -1 = unlimited, 0 = feature disabled, n = max bytes for a single vault document */
    vaultDocumentMaxBytes: number;
    /** -1 = unlimited, 0 = feature disabled, n = max bytes for active org vault storage */
    vaultTotalQuotaBytes: number;
    /** Plan-specific MIME types permitted for vault uploads */
    vaultAllowedMimeTypes: readonly string[];
    maxSeats: number;
    supportTier: SupportTier;
    analytics: AnalyticsTier;
    knowledgeBaseAccess: KnowledgeBaseAccess;
    /** Agentic orchestrator complexity level gated inside the orchestrator itself */
    agenticComplexityLevel: 'simple' | 'complex';
    sso?: boolean;
    onPremise?: boolean;
    slaGuarantee?: string;
    legalCorpusManagement?: boolean;
    dedicatedAccountManager?: boolean;
}
export type FeatureKey = keyof PlanEntitlementConfig;
/** The full entitlements map -- covers all EffectivePlan values (DB plans + FREE_TRIAL). */
export type PlanEntitlements = Record<EffectivePlan, PlanEntitlementConfig>;
export type PilotEntitlementProfiles = Record<PilotEntitlementProfile, PlanEntitlementConfig>;
export declare const PLAN_ENTITLEMENTS: PlanEntitlements;
export declare const PILOT_ENTITLEMENT_PROFILES: PilotEntitlementProfiles;
export declare function resolvePilotEntitlementProfile(value: string | null | undefined): PilotEntitlementProfile;
export { SubscriptionPlan };
//# sourceMappingURL=entitlements.config.d.ts.map