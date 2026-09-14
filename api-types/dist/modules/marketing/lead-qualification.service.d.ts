/**
 * Lead Qualification Service (P0)
 *
 * Implements deterministic 100-point ICP qualification, regulatory exposure scoring,
 * hard exclusions, and evidence hashing for AI-discovered leads.
 *
 * Scoring Formula (Max 100):
 *   S = S_reg (30) + S_fit (20) + S_comp (15) + S_size (10) + S_buyer (10) + S_trig (5) + S_conf (10)
 *
 * Deterministic Score-to-State Mapping:
 *   80 - 100: Priority HOT    -> PENDING_REVIEW
 *   65 - 79:  Priority STRONG -> PENDING_REVIEW
 *   50 - 64:  Priority NURTURE-> NURTURE
 *   Below 50: Rejected       -> REJECTED
 */
import { IcpTier, LeadStatus, CompanySizeClass } from '@prisma/client';
export interface CandidateLeadInput {
    name: string;
    domain?: string | null;
    country?: string;
    industry?: string | null;
    regulatoryBody?: string | null;
    licenceType?: string | null;
    licenceNumber?: string | null;
    licenceStatus?: string | null;
    sizeClass?: CompanySizeClass | null;
    employeeCount?: number | null;
    hasComplianceObligation?: boolean;
    operatesCrossBorder?: boolean;
    handlesPersonalData?: boolean;
    handlesCustomerFunds?: boolean;
    hasNamedBuyerContact?: boolean;
    buyerRoleIdentified?: boolean;
    targetRoleTitle?: string | null;
    recentRegulatoryEvent?: boolean;
    recentLicensingDeadline?: boolean;
    confidence?: number;
}
export interface HardExclusionResult {
    isExcluded: boolean;
    reason?: 'EXISTING_CUSTOMER' | 'REJECTED_UNSUPPORTED_COUNTRY' | 'REJECTED_BANNED_REVOKED' | 'EXCLUDED_DO_NOT_CONTACT';
    targetStatus: LeadStatus;
}
export interface ScoreBreakdown {
    regulatoryExposure: number;
    sheriaBotFit: number;
    complexity: number;
    companySize: number;
    buyerAccessibility: number;
    regulatoryTrigger: number;
    confidenceAdjustment: number;
    totalScore: number;
}
export interface QualificationResult {
    isExcluded: boolean;
    exclusionReason?: string;
    score: number;
    scoreBreakdown: ScoreBreakdown;
    icpTier: IcpTier;
    leadStatus: LeadStatus;
    priority: 'HOT' | 'STRONG' | 'NURTURE' | 'DISQUALIFIED';
    reviewReason?: string;
    rejectionReason?: string;
}
export declare const SUPPORTED_COUNTRIES: Set<string>;
export declare const CORE_REGULATORS_KE: Set<string>;
/**
 * Computes a deterministic SHA-256 hash for evidence deduplication and replay safety.
 */
export declare function computeEvidenceHash(params: {
    companyIdentifier: string;
    field: string;
    normalizedValue: string;
    sourceUrl: string;
    sourceRecordId?: string | null;
}): string;
export declare function evaluateHardExclusions(params: {
    candidate: CandidateLeadInput;
    isExistingCustomer?: boolean;
    isDoNotContact?: boolean;
}): HardExclusionResult;
export declare function determineIcpTier(candidate: CandidateLeadInput): IcpTier;
export declare function calculateLeadScore(candidate: CandidateLeadInput, icpTier: IcpTier): ScoreBreakdown;
export declare function qualifyLead(params: {
    candidate: CandidateLeadInput;
    isExistingCustomer?: boolean;
    isDoNotContact?: boolean;
}): QualificationResult;
//# sourceMappingURL=lead-qualification.service.d.ts.map