export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            stack: string | undefined;
            fieldErrors: Record<string, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
        };
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * Register  -  creates a Supabase auth user AND a Prisma user profile.
     * If Prisma creation fails, the Supabase user is deleted as a compensating
     * transaction so no orphaned auth records are left behind.
     */
    register: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            password: string;
            name: string;
            role: "REGULATOR" | "STARTUP" | "ENTERPRISE";
            companyName?: string | undefined;
            invitationToken?: string | undefined;
            phone?: string | undefined;
        };
        output: {
            success: boolean;
            userId: any;
            email: any;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Login  -  proxies credentials to Supabase and returns Supabase session tokens.
     * Enforces email verification and account status before granting access.
     * The frontend must store and send the access_token as Bearer on all requests.
     */
    login: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            password: string;
        };
        output: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
                emailVerified: boolean;
                mustChangePassword: boolean;
                organization: {
                    type: string;
                    id: string;
                    name: string;
                } | null;
                createdAt: Date;
            };
        };
        meta: object;
    }>;
    /**
     * Logout  -  deletes DB session and invalidates the Upstash Redis user cache.
     */
    logout: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /** Get current authenticated user */
    me: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            phone: string | null;
            emailVerified: boolean;
            totpEnabled: any;
            organization: {
                [x: string]: ({
                    id: string;
                    email: string;
                    password: string | null;
                    phone: string | null;
                    supabaseAuthId: string | null;
                    fullName: string;
                    avatar: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    accountStatus: string;
                    emailVerified: boolean;
                    emailVerifiedAt: Date | null;
                    emailVerificationToken: string | null;
                    emailVerificationExpiry: Date | null;
                    passwordResetToken: string | null;
                    passwordResetExpiry: Date | null;
                    mustChangePassword: boolean;
                    temporaryPasswordExpiresAt: Date | null;
                    temporaryPasswordIssuedAt: Date | null;
                    temporaryPasswordUsedAt: Date | null;
                    temporaryPasswordCreatedByAdminId: string | null;
                    temporaryPasswordDeliveryStatus: string | null;
                    temporaryPasswordVersion: number;
                    organizationId: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    preferences: import("@prisma/client/runtime/client").JsonValue | null;
                    totpEnabled: boolean;
                    totpSecret: string | null;
                    freeTrialActivatedAt: Date | null;
                    freeTrialExpiresAt: Date | null;
                    freeTrialUsage: import("@prisma/client/runtime/client").JsonValue | null;
                    isPilot: boolean;
                    pilotCohort: string | null;
                    pilotStartedAt: Date | null;
                    pilotExpiresAt: Date | null;
                    pilotAccessStatus: string;
                    pilotFirstExtensionGrantedAt: Date | null;
                    pilotSecondExtensionGrantedAt: Date | null;
                    pilotExtensionCount: number;
                    pilotCreatedByAdminId: string | null;
                    pilotLastExtendedByAdminId: string | null;
                    postPilotTier: string;
                    pilotConvertedAt: Date | null;
                    deletionScheduledAt: Date | null;
                    deletionReason: string | null;
                    deletionFeedback: string | null;
                } | {
                    id: string;
                    email: string;
                    password: string | null;
                    phone: string | null;
                    supabaseAuthId: string | null;
                    fullName: string;
                    avatar: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    accountStatus: string;
                    emailVerified: boolean;
                    emailVerifiedAt: Date | null;
                    emailVerificationToken: string | null;
                    emailVerificationExpiry: Date | null;
                    passwordResetToken: string | null;
                    passwordResetExpiry: Date | null;
                    mustChangePassword: boolean;
                    temporaryPasswordExpiresAt: Date | null;
                    temporaryPasswordIssuedAt: Date | null;
                    temporaryPasswordUsedAt: Date | null;
                    temporaryPasswordCreatedByAdminId: string | null;
                    temporaryPasswordDeliveryStatus: string | null;
                    temporaryPasswordVersion: number;
                    organizationId: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    preferences: import("@prisma/client/runtime/client").JsonValue | null;
                    totpEnabled: boolean;
                    totpSecret: string | null;
                    freeTrialActivatedAt: Date | null;
                    freeTrialExpiresAt: Date | null;
                    freeTrialUsage: import("@prisma/client/runtime/client").JsonValue | null;
                    isPilot: boolean;
                    pilotCohort: string | null;
                    pilotStartedAt: Date | null;
                    pilotExpiresAt: Date | null;
                    pilotAccessStatus: string;
                    pilotFirstExtensionGrantedAt: Date | null;
                    pilotSecondExtensionGrantedAt: Date | null;
                    pilotExtensionCount: number;
                    pilotCreatedByAdminId: string | null;
                    pilotLastExtendedByAdminId: string | null;
                    postPilotTier: string;
                    pilotConvertedAt: Date | null;
                    deletionScheduledAt: Date | null;
                    deletionReason: string | null;
                    deletionFeedback: string | null;
                })[] | ({
                    id: string;
                    title: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    scenario: string;
                    regulatoryAreas: string[];
                    urgency: string;
                    stakeholders: string[];
                    executiveSummary: string | null;
                    analysis: string | null;
                    recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                    complianceChecklist: import("@prisma/client/runtime/client").JsonValue | null;
                    implementationTimeline: import("@prisma/client/runtime/client").JsonValue | null;
                    appendices: import("@prisma/client/runtime/client").JsonValue | null;
                    content: string | null;
                    specificRequirements: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    generationTime: number | null;
                    version: number;
                    assignedTo: string | null;
                    reviewers: string[];
                } | {
                    id: string;
                    title: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    scenario: string;
                    regulatoryAreas: string[];
                    urgency: string;
                    stakeholders: string[];
                    executiveSummary: string | null;
                    analysis: string | null;
                    recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                    complianceChecklist: import("@prisma/client/runtime/client").JsonValue | null;
                    implementationTimeline: import("@prisma/client/runtime/client").JsonValue | null;
                    appendices: import("@prisma/client/runtime/client").JsonValue | null;
                    content: string | null;
                    specificRequirements: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    generationTime: number | null;
                    version: number;
                    assignedTo: string | null;
                    reviewers: string[];
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: import("@prisma/client/runtime/client").JsonValue | null;
                    citations: import("@prisma/client/runtime/client").JsonValue | null;
                    jurisdictionCode: string | null;
                    progress: number;
                    dueDate: Date | null;
                    productType: string | null;
                    businessStage: string | null;
                    targetSegments: import("@prisma/client/runtime/client").JsonValue | null;
                    servicesOffered: import("@prisma/client/runtime/client").JsonValue | null;
                    additionalConcerns: string | null;
                    items: import("@prisma/client/runtime/client").JsonValue;
                    checklistData: import("@prisma/client/runtime/client").JsonValue | null;
                    itemProgress: import("@prisma/client/runtime/client").JsonValue | null;
                    completedItems: number;
                    totalItems: number;
                    evidenceProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                    generatedAt: Date | null;
                    completedAt: Date | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: import("@prisma/client/runtime/client").JsonValue | null;
                    citations: import("@prisma/client/runtime/client").JsonValue | null;
                    jurisdictionCode: string | null;
                    progress: number;
                    dueDate: Date | null;
                    productType: string | null;
                    businessStage: string | null;
                    targetSegments: import("@prisma/client/runtime/client").JsonValue | null;
                    servicesOffered: import("@prisma/client/runtime/client").JsonValue | null;
                    additionalConcerns: string | null;
                    items: import("@prisma/client/runtime/client").JsonValue;
                    checklistData: import("@prisma/client/runtime/client").JsonValue | null;
                    itemProgress: import("@prisma/client/runtime/client").JsonValue | null;
                    completedItems: number;
                    totalItems: number;
                    evidenceProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                    generatedAt: Date | null;
                    completedAt: Date | null;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.VaultDocumentStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    version: number;
                    fileSize: number;
                    category: import(".prisma/client").$Enums.DocumentCategory;
                    tags: string[];
                    notes: string | null;
                    fileName: string;
                    fileType: string;
                    storageKey: string;
                    contentHash: string | null;
                    expiryDate: Date | null;
                    fileExtension: string;
                    uploadedById: string;
                    isArchived: boolean;
                    r2Bucket: string | null;
                    encryptionKeyId: string | null;
                    uploadStatus: import(".prisma/client").$Enums.VaultDocumentUploadStatus | null;
                    retentionExpiresAt: Date | null;
                } | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.VaultDocumentStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    version: number;
                    fileSize: number;
                    category: import(".prisma/client").$Enums.DocumentCategory;
                    tags: string[];
                    notes: string | null;
                    fileName: string;
                    fileType: string;
                    storageKey: string;
                    contentHash: string | null;
                    expiryDate: Date | null;
                    fileExtension: string;
                    uploadedById: string;
                    isArchived: boolean;
                    r2Bucket: string | null;
                    encryptionKeyId: string | null;
                    uploadStatus: import(".prisma/client").$Enums.VaultDocumentUploadStatus | null;
                    retentionExpiresAt: Date | null;
                })[] | ({
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    complianceQueryId: string;
                    notes: string | null;
                    runId: string;
                    question: string;
                    suggestedDocument: string | null;
                    statusChangedAt: Date | null;
                } | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    complianceQueryId: string;
                    notes: string | null;
                    runId: string;
                    question: string;
                    suggestedDocument: string | null;
                    statusChangedAt: Date | null;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    documentType: import(".prisma/client").$Enums.CorpusGapDocumentType;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    sourceUrl: string | null;
                    reportedByUserId: string;
                    issuingAuthority: string;
                    adminNotes: string | null;
                    resolvedAt: Date | null;
                } | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    documentType: import(".prisma/client").$Enums.CorpusGapDocumentType;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    sourceUrl: string | null;
                    reportedByUserId: string;
                    issuingAuthority: string;
                    adminNotes: string | null;
                    resolvedAt: Date | null;
                })[] | ({
                    id: string;
                    title: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    jurisdictionCode: string;
                    regulator: string;
                    licenseType: string;
                    progress: number;
                    referenceNumber: string | null;
                    nextAction: string | null;
                    dueDate: Date | null;
                    submittedAt: Date | null;
                    decidedAt: Date | null;
                } | {
                    id: string;
                    title: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    jurisdictionCode: string;
                    regulator: string;
                    licenseType: string;
                    progress: number;
                    referenceNumber: string | null;
                    nextAction: string | null;
                    dueDate: Date | null;
                    submittedAt: Date | null;
                    decidedAt: Date | null;
                })[] | ({
                    id: string;
                    status: import(".prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                } | {
                    id: string;
                    status: import(".prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                })[] | ({
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    eventType: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                } | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    eventType: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[] | ({
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                } | {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client-runtime-utils").Decimal | null;
                    currency: string;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                } | {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client-runtime-utils").Decimal | null;
                    currency: string;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    userId: string;
                    status: import(".prisma/client").$Enums.PilotAccessStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    expiresAt: Date;
                    revokedAt: Date | null;
                    entitlementProfile: string;
                    startsAt: Date;
                    extensionCount: number;
                    createdByAdminId: string | null;
                    lastExtendedByAdminId: string | null;
                    revokedByAdminId: string | null;
                    convertedAt: Date | null;
                    convertedPlan: string | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    userId: string;
                    status: import(".prisma/client").$Enums.PilotAccessStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    expiresAt: Date;
                    revokedAt: Date | null;
                    entitlementProfile: string;
                    startsAt: Date;
                    extensionCount: number;
                    createdByAdminId: string | null;
                    lastExtendedByAdminId: string | null;
                    revokedByAdminId: string | null;
                    convertedAt: Date | null;
                    convertedPlan: string | null;
                })[] | ({
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    readAt: Date | null;
                    alertId: string;
                    channel: string;
                    sentAt: Date | null;
                } | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    readAt: Date | null;
                    alertId: string;
                    channel: string;
                    sentAt: Date | null;
                })[] | ({
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    executiveSummary: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    version: number;
                    errorMessage: string | null;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    ragGrounded: boolean;
                    jurisdiction: string;
                    reviewNotes: string | null;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    sourceGapId: string | null;
                    tableOfContents: import("@prisma/client/runtime/client").JsonValue | null;
                    sections: import("@prisma/client/runtime/client").JsonValue | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                } | {
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    executiveSummary: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    version: number;
                    errorMessage: string | null;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    ragGrounded: boolean;
                    jurisdiction: string;
                    reviewNotes: string | null;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    sourceGapId: string | null;
                    tableOfContents: import("@prisma/client/runtime/client").JsonValue | null;
                    sections: import("@prisma/client/runtime/client").JsonValue | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                })[] | ({
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    priority: number;
                    idempotencyKey: string;
                    targetEntityType: string;
                    targetEntityId: string;
                    payload: import("@prisma/client/runtime/client").JsonValue;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                } | {
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    priority: number;
                    idempotencyKey: string;
                    targetEntityType: string;
                    targetEntityId: string;
                    payload: import("@prisma/client/runtime/client").JsonValue;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                })[] | ({
                    id: string;
                    userId: string;
                    role: import(".prisma/client").$Enums.MemberRole;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    invitedBy: string | null;
                    invitedAt: Date | null;
                    joinedAt: Date;
                } | {
                    id: string;
                    userId: string;
                    role: import(".prisma/client").$Enums.MemberRole;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    invitedBy: string | null;
                    invitedAt: Date | null;
                    joinedAt: Date;
                })[] | ({
                    id: string;
                    title: string;
                    description: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: import(".prisma/client").$Enums.ComplianceCategory;
                    completedAt: Date | null;
                    isCompleted: boolean;
                } | {
                    id: string;
                    title: string;
                    description: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: import(".prisma/client").$Enums.ComplianceCategory;
                    completedAt: Date | null;
                    isCompleted: boolean;
                })[] | ({
                    id: string;
                    organizationId: string;
                    overallScore: number;
                    dataProtectionScore: number;
                    amlKycScore: number;
                    consumerProtectionScore: number;
                    cbkLicensingScore: number;
                    cybersecurityScore: number;
                    calculatedAt: Date;
                } | {
                    id: string;
                    organizationId: string;
                    overallScore: number;
                    dataProtectionScore: number;
                    amlKycScore: number;
                    consumerProtectionScore: number;
                    cbkLicensingScore: number;
                    cybersecurityScore: number;
                    calculatedAt: Date;
                })[] | ({
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: string;
                    dueDate: Date;
                    completedAt: Date | null;
                    priority: string;
                    regulation: string | null;
                    recurrence: string | null;
                    assigneeId: string | null;
                    createdById: string;
                    sourceType: string | null;
                    sourceId: string | null;
                } | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: string;
                    dueDate: Date;
                    completedAt: Date | null;
                    priority: string;
                    regulation: string | null;
                    recurrence: string | null;
                    assigneeId: string | null;
                    createdById: string;
                    sourceType: string | null;
                    sourceId: string | null;
                })[] | ({
                    id: string;
                    count: number;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    metric: import(".prisma/client").$Enums.BillingMetric;
                    periodStart: Date;
                    periodEnd: Date;
                } | {
                    id: string;
                    count: number;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    metric: import(".prisma/client").$Enums.BillingMetric;
                    periodStart: Date;
                    periodEnd: Date;
                })[] | ({
                    complianceQueries: number;
                    gapAnalyses: number;
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    periodStart: Date;
                    periodEnd: Date;
                    checklistGenerations: number;
                    apiCalls: number;
                    documentStorageMb: number;
                    policyGenerations: number;
                    planTier: string;
                    complianceQueryLimit: number;
                    checklistGenerationLimit: number;
                    apiCallLimit: number;
                    documentStorageMbLimit: number;
                    gapAnalysisLimit: number;
                    policyGenerationLimit: number;
                    syncedFromRedisAt: Date | null;
                } | {
                    complianceQueries: number;
                    gapAnalyses: number;
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    periodStart: Date;
                    periodEnd: Date;
                    checklistGenerations: number;
                    apiCalls: number;
                    documentStorageMb: number;
                    policyGenerations: number;
                    planTier: string;
                    complianceQueryLimit: number;
                    checklistGenerationLimit: number;
                    apiCallLimit: number;
                    documentStorageMbLimit: number;
                    gapAnalysisLimit: number;
                    policyGenerationLimit: number;
                    syncedFromRedisAt: Date | null;
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    currency: string;
                    paidAt: Date | null;
                    orgId: string;
                    subscriptionId: string | null;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    billingPeriodStart: Date | null;
                    billingPeriodEnd: Date | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    currency: string;
                    paidAt: Date | null;
                    orgId: string;
                    subscriptionId: string | null;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    billingPeriodStart: Date | null;
                    billingPeriodEnd: Date | null;
                })[] | ({
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CustomFrameworkStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    version: number;
                    category: string | null;
                    publishedAt: Date | null;
                    slug: string;
                    citations: import("@prisma/client/runtime/client").JsonValue | null;
                    regulator: string | null;
                    evidenceProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                    jurisdiction: string | null;
                    archivedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                } | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CustomFrameworkStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    version: number;
                    category: string | null;
                    publishedAt: Date | null;
                    slug: string;
                    citations: import("@prisma/client/runtime/client").JsonValue | null;
                    regulator: string | null;
                    evidenceProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                    jurisdiction: string | null;
                    archivedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                })[] | ({
                    id: string;
                    status: import(".prisma/client").$Enums.EnterpriseContractStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    notes: string | null;
                    currency: string | null;
                    startsAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    contractName: string | null;
                    contractNumber: string | null;
                    endsAt: Date | null;
                    renewalDate: Date | null;
                    billingCycle: string | null;
                    monthlyAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    annualAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    approvedByUserId: string | null;
                } | {
                    id: string;
                    status: import(".prisma/client").$Enums.EnterpriseContractStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    notes: string | null;
                    currency: string | null;
                    startsAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    contractName: string | null;
                    contractNumber: string | null;
                    endsAt: Date | null;
                    renewalDate: Date | null;
                    billingCycle: string | null;
                    monthlyAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    annualAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    approvedByUserId: string | null;
                })[] | ({
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: string;
                    organizationId: string;
                    generatedAt: Date;
                    priority: string;
                    subject: string;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                    body: string;
                    agentRunId: string;
                    sourceFingerprint: string;
                    editedBody: string | null;
                    sourceSignalId: string;
                    triggerReason: string;
                    engagementContext: import("@prisma/client/runtime/client").JsonValue | null;
                } | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: string;
                    organizationId: string;
                    generatedAt: Date;
                    priority: string;
                    subject: string;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                    body: string;
                    agentRunId: string;
                    sourceFingerprint: string;
                    editedBody: string | null;
                    sourceSignalId: string;
                    triggerReason: string;
                    engagementContext: import("@prisma/client/runtime/client").JsonValue | null;
                })[] | {
                    id: string;
                    email: string;
                    password: string | null;
                    phone: string | null;
                    supabaseAuthId: string | null;
                    fullName: string;
                    avatar: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    accountStatus: string;
                    emailVerified: boolean;
                    emailVerifiedAt: Date | null;
                    emailVerificationToken: string | null;
                    emailVerificationExpiry: Date | null;
                    passwordResetToken: string | null;
                    passwordResetExpiry: Date | null;
                    mustChangePassword: boolean;
                    temporaryPasswordExpiresAt: Date | null;
                    temporaryPasswordIssuedAt: Date | null;
                    temporaryPasswordUsedAt: Date | null;
                    temporaryPasswordCreatedByAdminId: string | null;
                    temporaryPasswordDeliveryStatus: string | null;
                    temporaryPasswordVersion: number;
                    organizationId: string | null;
                    lastLoginAt: Date | null;
                    lastLoginIp: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    preferences: import("@prisma/client/runtime/client").JsonValue | null;
                    totpEnabled: boolean;
                    totpSecret: string | null;
                    freeTrialActivatedAt: Date | null;
                    freeTrialExpiresAt: Date | null;
                    freeTrialUsage: import("@prisma/client/runtime/client").JsonValue | null;
                    isPilot: boolean;
                    pilotCohort: string | null;
                    pilotStartedAt: Date | null;
                    pilotExpiresAt: Date | null;
                    pilotAccessStatus: string;
                    pilotFirstExtensionGrantedAt: Date | null;
                    pilotSecondExtensionGrantedAt: Date | null;
                    pilotExtensionCount: number;
                    pilotCreatedByAdminId: string | null;
                    pilotLastExtendedByAdminId: string | null;
                    postPilotTier: string;
                    pilotConvertedAt: Date | null;
                    deletionScheduledAt: Date | null;
                    deletionReason: string | null;
                    deletionFeedback: string | null;
                }[] | {
                    id: string;
                    title: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    scenario: string;
                    regulatoryAreas: string[];
                    urgency: string;
                    stakeholders: string[];
                    executiveSummary: string | null;
                    analysis: string | null;
                    recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                    complianceChecklist: import("@prisma/client/runtime/client").JsonValue | null;
                    implementationTimeline: import("@prisma/client/runtime/client").JsonValue | null;
                    appendices: import("@prisma/client/runtime/client").JsonValue | null;
                    content: string | null;
                    specificRequirements: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    generationTime: number | null;
                    version: number;
                    assignedTo: string | null;
                    reviewers: string[];
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: import("@prisma/client/runtime/client").JsonValue | null;
                    citations: import("@prisma/client/runtime/client").JsonValue | null;
                    jurisdictionCode: string | null;
                    progress: number;
                    dueDate: Date | null;
                    productType: string | null;
                    businessStage: string | null;
                    targetSegments: import("@prisma/client/runtime/client").JsonValue | null;
                    servicesOffered: import("@prisma/client/runtime/client").JsonValue | null;
                    additionalConcerns: string | null;
                    items: import("@prisma/client/runtime/client").JsonValue;
                    checklistData: import("@prisma/client/runtime/client").JsonValue | null;
                    itemProgress: import("@prisma/client/runtime/client").JsonValue | null;
                    completedItems: number;
                    totalItems: number;
                    evidenceProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                    generatedAt: Date | null;
                    completedAt: Date | null;
                }[] | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.VaultDocumentStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    version: number;
                    fileSize: number;
                    category: import(".prisma/client").$Enums.DocumentCategory;
                    tags: string[];
                    notes: string | null;
                    fileName: string;
                    fileType: string;
                    storageKey: string;
                    contentHash: string | null;
                    expiryDate: Date | null;
                    fileExtension: string;
                    uploadedById: string;
                    isArchived: boolean;
                    r2Bucket: string | null;
                    encryptionKeyId: string | null;
                    uploadStatus: import(".prisma/client").$Enums.VaultDocumentUploadStatus | null;
                    retentionExpiresAt: Date | null;
                }[] | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    complianceQueryId: string;
                    notes: string | null;
                    runId: string;
                    question: string;
                    suggestedDocument: string | null;
                    statusChangedAt: Date | null;
                }[] | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    documentType: import(".prisma/client").$Enums.CorpusGapDocumentType;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    sourceUrl: string | null;
                    reportedByUserId: string;
                    issuingAuthority: string;
                    adminNotes: string | null;
                    resolvedAt: Date | null;
                }[] | {
                    id: string;
                    title: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    jurisdictionCode: string;
                    regulator: string;
                    licenseType: string;
                    progress: number;
                    referenceNumber: string | null;
                    nextAction: string | null;
                    dueDate: Date | null;
                    submittedAt: Date | null;
                    decidedAt: Date | null;
                }[] | {
                    id: string;
                    status: import(".prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                }[] | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    eventType: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                }[] | {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                }[] | {
                    id: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    dueDate: Date | null;
                    amount: import("@prisma/client-runtime-utils").Decimal | null;
                    currency: string;
                    paidAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    userId: string;
                    status: import(".prisma/client").$Enums.PilotAccessStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    expiresAt: Date;
                    revokedAt: Date | null;
                    entitlementProfile: string;
                    startsAt: Date;
                    extensionCount: number;
                    createdByAdminId: string | null;
                    lastExtendedByAdminId: string | null;
                    revokedByAdminId: string | null;
                    convertedAt: Date | null;
                    convertedPlan: string | null;
                }[] | {
                    id: string;
                    userId: string;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    readAt: Date | null;
                    alertId: string;
                    channel: string;
                    sentAt: Date | null;
                }[] | {
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    organizationType: string | null;
                    executiveSummary: string | null;
                    targetAudience: string | null;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    isLatestVersion: boolean;
                    parentId: string | null;
                    version: number;
                    errorMessage: string | null;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    ragGrounded: boolean;
                    jurisdiction: string;
                    reviewNotes: string | null;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    sourceGapId: string | null;
                    tableOfContents: import("@prisma/client/runtime/client").JsonValue | null;
                    sections: import("@prisma/client/runtime/client").JsonValue | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                }[] | {
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    priority: number;
                    idempotencyKey: string;
                    targetEntityType: string;
                    targetEntityId: string;
                    payload: import("@prisma/client/runtime/client").JsonValue;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                }[] | {
                    id: string;
                    userId: string;
                    role: import(".prisma/client").$Enums.MemberRole;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    invitedBy: string | null;
                    invitedAt: Date | null;
                    joinedAt: Date;
                }[] | {
                    id: string;
                    title: string;
                    description: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: import(".prisma/client").$Enums.ComplianceCategory;
                    completedAt: Date | null;
                    isCompleted: boolean;
                }[] | {
                    id: string;
                    organizationId: string;
                    overallScore: number;
                    dataProtectionScore: number;
                    amlKycScore: number;
                    consumerProtectionScore: number;
                    cbkLicensingScore: number;
                    cybersecurityScore: number;
                    calculatedAt: Date;
                }[] | {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: string;
                    dueDate: Date;
                    completedAt: Date | null;
                    priority: string;
                    regulation: string | null;
                    recurrence: string | null;
                    assigneeId: string | null;
                    createdById: string;
                    sourceType: string | null;
                    sourceId: string | null;
                }[] | {
                    id: string;
                    count: number;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    metric: import(".prisma/client").$Enums.BillingMetric;
                    periodStart: Date;
                    periodEnd: Date;
                }[] | {
                    complianceQueries: number;
                    gapAnalyses: number;
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    periodStart: Date;
                    periodEnd: Date;
                    checklistGenerations: number;
                    apiCalls: number;
                    documentStorageMb: number;
                    policyGenerations: number;
                    planTier: string;
                    complianceQueryLimit: number;
                    checklistGenerationLimit: number;
                    apiCallLimit: number;
                    documentStorageMbLimit: number;
                    gapAnalysisLimit: number;
                    policyGenerationLimit: number;
                    syncedFromRedisAt: Date | null;
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    amount: number;
                    currency: string;
                    paidAt: Date | null;
                    orgId: string;
                    subscriptionId: string | null;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    billingPeriodStart: Date | null;
                    billingPeriodEnd: Date | null;
                }[] | {
                    id: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.CustomFrameworkStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
                    version: number;
                    category: string | null;
                    publishedAt: Date | null;
                    slug: string;
                    citations: import("@prisma/client/runtime/client").JsonValue | null;
                    regulator: string | null;
                    evidenceProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                    jurisdiction: string | null;
                    archivedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                }[] | {
                    id: string;
                    status: import(".prisma/client").$Enums.EnterpriseContractStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    notes: string | null;
                    currency: string | null;
                    startsAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    contractName: string | null;
                    contractNumber: string | null;
                    endsAt: Date | null;
                    renewalDate: Date | null;
                    billingCycle: string | null;
                    monthlyAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    annualAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    approvedByUserId: string | null;
                }[] | {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: string;
                    organizationId: string;
                    generatedAt: Date;
                    priority: string;
                    subject: string;
                    reviewedBy: string | null;
                    reviewedAt: Date | null;
                    body: string;
                    agentRunId: string;
                    sourceFingerprint: string;
                    editedBody: string | null;
                    sourceSignalId: string;
                    triggerReason: string;
                    engagementContext: import("@prisma/client/runtime/client").JsonValue | null;
                }[];
                [x: number]: never;
                [x: symbol]: never;
            } | null;
            preferences: any;
            createdAt: Date;
            lastLoginAt: Date | null;
            mustChangePassword: boolean;
        };
        meta: object;
    }>;
    changeTemporaryPassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Request password reset  -  F4.2 (complete rewrite).
     *
     * Uses a fully custom Prisma token flow instead of the Supabase-native
     * resetPasswordForEmail(), which sends tokens in a format incompatible with
     * the /reset-password?token= frontend pattern.
     *
     * Flow: generate token -> store in Prisma -> send via React Email template.
     * Always returns success to prevent email enumeration.
     */
    requestPasswordReset: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Reset password with Prisma DB token.
     * F4.5a  -  error-checks supabaseAdmin.auth.admin.updateUserById().
     * F4.5b  -  revokes all Supabase sessions for the user after reset.
     * F4.6   -  sends a post-reset confirmation email.
     */
    resetPassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            token: string;
            newPassword: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /** Verify email with DB token (Phase 7 compatible). */
    verifyEmail: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            token: string;
        };
        output: {
            success: boolean;
            message: string;
            requiresApproval: boolean;
        };
        meta: object;
    }>;
    /**
     * Resend email verification  -  F3.6 (converted from protectedProcedure to publicProcedure).
     *
     * Previously required an authenticated session, which created a UX deadlock
     * once login enforces emailVerified. Now takes an email address and looks up
     * the user directly, rate-limited at 3/hour by email address.
     */
    resendVerification: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Confirm email via Supabase callback.
     *
     * Called by the /auth/callback frontend page after the user clicks the
     * Supabase OTP verification link in their email.  Supabase has already set
     * email_confirmed_at by the time this is reached; we use the issued
     * access_token to identify the user and sync Prisma emailVerified.
     *
     * Flow:
     *  1. User clicks Supabase link in email -> Supabase verifies -> redirects to
     *     https://sheriabot.com/auth/callback#access_token=xxx&...
     *  2. Frontend /auth/callback page reads the session via supabase.auth.getSession()
     *  3. Frontend calls this procedure with the access_token
     *  4. We verify the token with Supabase admin, find the Prisma user, and mark
     *     emailVerified = true.
     */
    confirmEmailCallback: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            accessToken: string;
        };
        output: {
            success: boolean;
            requiresApproval: boolean;
            alreadyVerified: boolean;
        };
        meta: object;
    }>;
    /**
     * refreshToken  -  deprecated endpoint.
     * Supabase handles token refresh on the frontend automatically.
     * Call supabase.auth.refreshSession() from your Supabase client instead.
     */
    refreshToken: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            refreshToken: string;
        };
        output: never;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=auth.router.d.ts.map