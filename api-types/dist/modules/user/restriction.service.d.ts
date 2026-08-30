/**
 * Section 34 Restriction of Processing Service (Kenya DPA 2019)
 *
 * Implements Section 34 of the Kenya Data Protection Act, 2019 and Regulation 12 of the
 * Data Protection (General) Regulations, 2021 (Legal Notice No. 263 of 2021).
 *
 * Statutory Actor: Data Controller (or Data Processor) under the Act.
 * Operational Owner: DPO / privacy lead / authorised compliance administrator.
 *
 * Statutory Scope (Section 34(1)):
 *   A data controller shall restrict processing under four authoritative circumstances:
 *   1. ACCURACY_CONTESTED (s.34(1)(a)):
 *      Accuracy of personal data is contested by the data subject, for a period enabling
 *      the data controller to verify accuracy.
 *   2. DATA_NO_LONGER_REQUIRED_LEGAL_CLAIM (s.34(1)(b)):
 *      Data controller no longer needs personal data for original purpose, but data is required
 *      by the data subject for establishment, exercise or defence of a legal claim.
 *   3. UNLAWFUL_PROCESSING_ERASURE_OPPOSED (s.34(1)(c)):
 *      Processing is unlawful and the data subject opposes erasure, requesting restriction instead.
 *   4. OBJECTION_PENDING_VERIFICATION (s.34(1)(d)):
 *      Data subject has objected to processing pending verification whether legitimate grounds
 *      of the controller override those of the data subject.
 *
 * Processing Permitted During Restriction (Section 34(2)(a)):
 *   Restricted data may only be processed for:
 *   (i)   STORAGE_ONLY (preserving encrypted records);
 *   (ii)  CONSENT_GRANTED (with data subject's explicit consent);
 *   (iii) LEGAL_CLAIMS_DEFENSE (establishment, exercise or defence of legal claims);
 *   (iv)  PROTECTION_OF_RIGHTS (protection of rights of another person);
 *   (v)   PUBLIC_INTEREST (for reasons of public interest).
 *
 * Statutory Pre-Lift Notice (Section 34(2)(b)):
 *   "A data controller or data processor who has restricted processing under this section
 *   shall inform the data subject before the restriction of processing is lifted."
 *
 * Time Limits and Periodic Review (Section 34(3)):
 *   Data controllers and processors must implement mechanisms ensuring time limits for
 *   rectification, erasure, restriction, and periodic review of storage are observed.
 *
 * Optional Processing Blocked by Default:
 *   - AI_QUERYING (interactive Claude LLM inference & RAG queries)
 *   - DIRECT_MARKETING (marketing emails, pilot outreach, newsletters)
 *   - PRODUCT_TELEMETRY (PostHog event capture & analytics)
 *   - POLICY_GENERATION (automated enterprise policy generation)
 *   - GAP_ANALYSIS (document evaluation against regulations)
 *
 * Non-User Data Subject Support:
 *   Applies to registered users (User table) and non-user data subjects (prospects,
 *   newsletter subscribers, pilot applicants, marketing contacts, contact-form submitters)
 *   via durable Contact suppression flags and SuppressionList integration.
 */
export type StatutoryRestrictionReason = 'ACCURACY_CONTESTED' | 'DATA_NO_LONGER_REQUIRED_LEGAL_CLAIM' | 'UNLAWFUL_PROCESSING_ERASURE_OPPOSED' | 'OBJECTION_PENDING_VERIFICATION';
export type Section34PermittedException = 'STORAGE_ONLY' | 'CONSENT_GRANTED' | 'LEGAL_CLAIMS_DEFENSE' | 'PROTECTION_OF_RIGHTS' | 'PUBLIC_INTEREST';
export type RestrictedOptionalPurpose = 'AI_QUERYING' | 'DIRECT_MARKETING' | 'PRODUCT_TELEMETRY' | 'POLICY_GENERATION' | 'GAP_ANALYSIS';
export type ProcessingActivity = Section34PermittedException | RestrictedOptionalPurpose;
export interface RestrictionRecord {
    status: 'RESTRICTED' | 'LIFTED' | 'NONE';
    restrictedAt?: string;
    reason?: StatutoryRestrictionReason;
    requestId?: string;
    restrictedPurposes: RestrictedOptionalPurpose[];
    liftedAt?: string;
    liftReason?: string;
    dpoAdminId?: string;
    notes?: string;
}
export interface RestrictProcessingInput {
    userId: string;
    reason: StatutoryRestrictionReason;
    requestId: string;
    dpoAdminId?: string;
    restrictedPurposes?: RestrictedOptionalPurpose[];
    notes?: string;
}
export interface LiftRestrictionInput {
    userId: string;
    liftReason: string;
    dpoAdminId?: string;
}
export interface RestrictEmailProcessingInput {
    email: string;
    reason: StatutoryRestrictionReason;
    requestId: string;
    dpoAdminId?: string;
    restrictedPurposes?: RestrictedOptionalPurpose[];
    notes?: string;
}
export interface LiftEmailRestrictionInput {
    email: string;
    liftReason: string;
    dpoAdminId?: string;
}
export declare class Section34RestrictionService {
    /**
     * Apply Section 34 restriction to a user's data processing
     */
    restrictProcessing(input: RestrictProcessingInput): Promise<RestrictionRecord>;
    /**
     * Lift a Section 34 restriction following statutory review and pre-lift notification (s.34(2)(b))
     */
    liftRestriction(input: LiftRestrictionInput): Promise<RestrictionRecord>;
    /**
     * Apply Section 34 restriction by email address (covering non-user data subjects:
     * prospects, newsletter subscribers, pilot applicants, marketing contacts, contact leads, former users).
     */
    restrictProcessingForEmail(input: RestrictEmailProcessingInput): Promise<RestrictionRecord>;
    /**
     * Lift a Section 34 restriction for an email address (following s.34(2)(b) pre-lift notification)
     */
    liftRestrictionForEmail(input: LiftEmailRestrictionInput): Promise<RestrictionRecord>;
    /**
     * Retrieve current Section 34 restriction status for a user
     */
    getRestrictionStatus(userId: string): Promise<RestrictionRecord>;
    /**
     * Retrieve current Section 34 restriction status for an email (user or non-user data subject)
     */
    getRestrictionStatusForEmail(email: string): Promise<RestrictionRecord>;
    /**
     * Check whether a specific processing activity is permitted for a user
     */
    isProcessingPermitted(userId: string, activity: ProcessingActivity): Promise<{
        permitted: boolean;
        reason?: string;
    }>;
    /**
     * Check whether a specific processing activity is permitted for an email (user or non-user data subject)
     */
    isProcessingPermittedForEmail(email: string, activity: ProcessingActivity): Promise<{
        permitted: boolean;
        reason?: string;
    }>;
    /**
     * Guard assertion: throws an error if processing is restricted for a user
     */
    assertProcessingPermitted(userId: string, activity: ProcessingActivity): Promise<void>;
    /**
     * Guard assertion: throws an error if processing is restricted for an email
     */
    assertProcessingPermittedForEmail(email: string, activity: ProcessingActivity): Promise<void>;
}
export declare const section34RestrictionService: Section34RestrictionService;
//# sourceMappingURL=restriction.service.d.ts.map