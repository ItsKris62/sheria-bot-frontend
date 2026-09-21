/**
 * Root Application Router
 *
 * Combines all sub-routers into a single router.
 * This is the main entry point for all tRPC procedures.
 *
 * Routes:
 * - /trpc/auth.*         - Authentication (register, login, etc.)
 * - /trpc/user.*         - User management (profile, preferences, etc.)
 * - /trpc/organization.* - Organization CRUD
 * - /trpc/policy.*       - Policy CRUD + AI generation
 * - /trpc/compliance.*   - Compliance queries with RAG
 * - /trpc/document.*     - Document upload/download
 * - /trpc/admin.*        - Admin operations
 * - /trpc/notification.* - Notifications (list, mark-read, preferences)
 * - /trpc/analytics.*    - Analytics dashboards and reports
 * - /trpc/vault.*        - Organisation Document Vault (upload/download/manage compliance docs)
 * - /trpc/billing.*       - Plan, entitlements and usage data
 * - /trpc/usage.*         - Per-org monthly usage tracking, history and comparison
 * - /trpc/support.*       - User support ticket submission and tracking
 * - /trpc/adminSupport.*  - Admin ticket management (ADMIN role only)
 * - /trpc/pilot.*         - Pilot Programme dashboard (ADMIN role only)
 * - /trpc/checklist.*     - AI checklist generation, status polling, retry and progress tracking
 * - /trpc/complianceDashboard.* - Startup dashboard compliance score and category checklist data
 * - /trpc/gapAnalysis.*   - Policy gap analysis upload, polling and result retrieval
 * - /trpc/framework.*     - Regulatory framework library metadata
 * - /trpc/enterprisePolicy.* - Enterprise AI Policy Generator (ENTERPRISE tier only)
 * - /trpc/customFramework.*  - Org-scoped Enterprise custom frameworks
 * - /trpc/enterpriseContract.* - Admin Enterprise contract overrides
 * - /trpc/corpusGapReport.* - Structured missing corpus document reports
 */
export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./context").Context;
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
    auth: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        register: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                password: string;
                name: string;
                role: "ENTERPRISE" | "REGULATOR" | "STARTUP";
                companyName?: string | undefined;
                homeJurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
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
        login: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                password: string;
            };
            output: {
                mfaRequired: boolean;
                tempToken: string;
                accessToken: null;
                refreshToken: null;
                user: null;
            } | {
                mfaRequired: boolean;
                tempToken: null;
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
        verifyTotpLogin: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                tempToken: string;
                code: string;
                isBackupCode?: boolean | undefined;
            };
            output: import("../services/session.service").SessionResponsePayload;
            meta: object;
        }>;
        logout: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
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
                        eventType: string;
                        dueDate: Date | null;
                        completedAt: Date | null;
                        createdByUserId: string;
                        updatedByUserId: string | null;
                        licenseId: string;
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
                        eventType: string;
                        dueDate: Date | null;
                        completedAt: Date | null;
                        createdByUserId: string;
                        updatedByUserId: string | null;
                        licenseId: string;
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
                        eventType: string;
                        dueDate: Date | null;
                        completedAt: Date | null;
                        createdByUserId: string;
                        updatedByUserId: string | null;
                        licenseId: string;
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
        refreshToken: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                refreshToken: string;
            };
            output: never;
            meta: object;
        }>;
    }>>;
    user: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getProfile: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {};
            meta: object;
        }>;
        updateProfile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name?: string | undefined;
                phone?: string | undefined;
            };
            output: {
                success: boolean;
                user: {
                    id: string;
                    email: string;
                    phone: string | null;
                    fullName: string;
                    role: import(".prisma/client").$Enums.UserRole;
                    updatedAt: Date;
                };
            };
            meta: object;
        }>;
        changePassword: import("@trpc/server").TRPCMutationProcedure<{
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
        updatePreferences: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                preferences: Record<string, any>;
            };
            output: {
                success: boolean;
                preferences: Record<string, any>;
            };
            meta: object;
        }>;
        recordActivation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                featureName: "compliance_query" | "compliance_checklist" | "gap_analysis" | "policy_generator";
                jurisdictionCode?: string | undefined;
            };
            output: {
                firstActivation: boolean;
                activatedAt: string | undefined;
            };
            meta: object;
        }>;
        getSessions: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: any;
                device: any;
                ipAddress: any;
                createdAt: any;
                expiresAt: any;
                isCurrent: boolean;
            }[];
            meta: object;
        }>;
        revokeSession: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sessionId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        revokeOtherSessions: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                success: boolean;
                sessionsRevoked: number;
            };
            meta: object;
        }>;
        revokeAllSessions: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                success: boolean;
                sessionsRevoked: number;
            };
            meta: object;
        }>;
        getTotpStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                enabled: boolean;
            };
            meta: object;
        }>;
        setupTotp: import("@trpc/server").TRPCMutationProcedure<{
            input: Record<string, never> | undefined;
            output: {
                secret: string;
                otpauth: string;
            };
            meta: object;
        }>;
        confirmTotpSetup: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                code: string;
            };
            output: {
                success: boolean;
                message: string;
                backupCodes: string[];
            };
            meta: object;
        }>;
        disableTotp: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                password: string;
                code: string;
                isBackupCode?: boolean | undefined;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        deleteAccount: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                confirmEmail: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getNotificationPreferences: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                regulatoryUpdates: boolean;
                deadlineReminders: boolean;
                reportReady: boolean;
                supportResponses: boolean;
                paymentDueReminder: boolean;
                complianceQueryReady: boolean;
                policyDocumentReady: boolean;
                documentIngestionComplete: boolean;
                realTimeAlerts: boolean;
                inAppSoundsEnabled: any;
                emailDigestEnabled: boolean;
                digestFrequency: string;
            };
            meta: object;
        }>;
        getAvatarUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentType: "image/png" | "image/jpeg" | "image/webp";
                fileSize: number;
            };
            output: import("../../modules/user/avatar.service").AvatarUploadUrlResult;
            meta: object;
        }>;
        confirmAvatarUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                publicUrl: string;
            };
            output: import("../../modules/user/avatar.service").AvatarUpdateResult;
            meta: object;
        }>;
        deleteAvatar: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: import("../../modules/user/avatar.service").AvatarUpdateResult;
            meta: object;
        }>;
        updateNotificationPreferences: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                regulatoryUpdates?: boolean | undefined;
                deadlineReminders?: boolean | undefined;
                reportReady?: boolean | undefined;
                supportResponses?: boolean | undefined;
                paymentDueReminder?: boolean | undefined;
                complianceQueryReady?: boolean | undefined;
                policyDocumentReady?: boolean | undefined;
                documentIngestionComplete?: boolean | undefined;
                realTimeAlerts?: boolean | undefined;
                inAppSoundsEnabled?: boolean | undefined;
                emailDigestEnabled?: boolean | undefined;
                digestFrequency?: "monthly" | "daily" | "weekly" | undefined;
            };
            output: {
                regulatoryUpdates: boolean;
                deadlineReminders: boolean;
                reportReady: boolean;
                supportResponses: boolean;
                paymentDueReminder: boolean;
                complianceQueryReady: boolean;
                policyDocumentReady: boolean;
                documentIngestionComplete: boolean;
                realTimeAlerts: boolean;
                inAppSoundsEnabled: any;
                emailDigestEnabled: boolean;
                digestFrequency: string;
            };
            meta: object;
        }>;
        getRestrictionStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId?: string | undefined;
            } | undefined;
            output: import("../../modules/user/restriction.service").RestrictionRecord;
            meta: object;
        }>;
        restrictProcessing: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                reason: "ACCURACY_CONTESTED" | "DATA_NO_LONGER_REQUIRED_LEGAL_CLAIM" | "UNLAWFUL_PROCESSING_ERASURE_OPPOSED" | "OBJECTION_PENDING_VERIFICATION";
                requestId: string;
                restrictedPurposes?: ("AI_QUERYING" | "DIRECT_MARKETING" | "PRODUCT_TELEMETRY" | "POLICY_GENERATION" | "GAP_ANALYSIS")[] | undefined;
            };
            output: import("../../modules/user/restriction.service").RestrictionRecord;
            meta: object;
        }>;
        liftProcessingRestriction: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                liftReason: string;
            };
            output: import("../../modules/user/restriction.service").RestrictionRecord;
            meta: object;
        }>;
    }>>;
    organization: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                type?: "ENTERPRISE" | "REGULATOR" | "STARTUP" | "OTHER" | "BANK" | "TELECOM" | "INSURANCE" | undefined;
                search?: string | undefined;
            };
            output: {
                organizations: ({
                    _count: {
                        users: number;
                    };
                } & {
                    type: string;
                    id: string;
                    mpesaPhoneNumber: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    organizationType: string;
                    registrationNumber: string | null;
                    cbkLicenseNumber: string | null;
                    website: string | null;
                    industry: string | null;
                    size: string | null;
                    subscriptionTier: string;
                    subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                    trialEndsAt: Date | null;
                    gracePeriodEndsAt: Date | null;
                    cancelledAt: Date | null;
                    subscriptionEndsAt: Date | null;
                    verificationStatus: string;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    plan: import(".prisma/client").$Enums.SubscriptionPlan;
                    planStartDate: Date | null;
                    planEndDate: Date | null;
                    maxSeats: number;
                    homeJurisdictionCode: string | null;
                    enabledJurisdictions: string[];
                    needsCountryConfirmation: boolean;
                    stripeCustomerId: string | null;
                    stripeSubId: string | null;
                    customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                    preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                    mpesaNextPaymentDueDate: Date | null;
                    subscriptionCycleEnd: Date | null;
                    mpesaFailedRenewalAttempts: number;
                    mpesaLastRenewalAttemptAt: Date | null;
                    mpesaNextRenewalRetryAt: Date | null;
                    mpesaCancelledByUserAt: Date | null;
                    address: string | null;
                    contactPerson: string | null;
                    contactPosition: string | null;
                    contactEmail: string | null;
                    contactPhone: string | null;
                    requireMfa: boolean;
                    mfaPolicyEnabledAt: Date | null;
                    mfaPolicyFirstEnabledAt: Date | null;
                    mfaPolicyGraceHours: number;
                    mfaPolicyUpdatedBy: string | null;
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                users: {
                    id: string;
                    email: string;
                    fullName: string;
                    role: import(".prisma/client").$Enums.UserRole;
                }[];
            } & {
                type: string;
                id: string;
                mpesaPhoneNumber: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                organizationType: string;
                registrationNumber: string | null;
                cbkLicenseNumber: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                subscriptionTier: string;
                subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                trialEndsAt: Date | null;
                gracePeriodEndsAt: Date | null;
                cancelledAt: Date | null;
                subscriptionEndsAt: Date | null;
                verificationStatus: string;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                planStartDate: Date | null;
                planEndDate: Date | null;
                maxSeats: number;
                homeJurisdictionCode: string | null;
                enabledJurisdictions: string[];
                needsCountryConfirmation: boolean;
                stripeCustomerId: string | null;
                stripeSubId: string | null;
                customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                mpesaNextPaymentDueDate: Date | null;
                subscriptionCycleEnd: Date | null;
                mpesaFailedRenewalAttempts: number;
                mpesaLastRenewalAttemptAt: Date | null;
                mpesaNextRenewalRetryAt: Date | null;
                mpesaCancelledByUserAt: Date | null;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
                requireMfa: boolean;
                mfaPolicyEnabledAt: Date | null;
                mfaPolicyFirstEnabledAt: Date | null;
                mfaPolicyGraceHours: number;
                mfaPolicyUpdatedBy: string | null;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                type: "ENTERPRISE" | "REGULATOR" | "STARTUP" | "OTHER" | "BANK" | "TELECOM" | "INSURANCE";
                contactEmail: string;
                homeJurisdictionCode: "KE" | "MW" | "RW" | "NG";
                registrationNumber?: string | undefined;
                industry?: string | undefined;
                contactPhone?: string | undefined;
                address?: string | undefined;
                website?: string | undefined;
                description?: string | undefined;
                enabledJurisdictions?: ("KE" | "MW" | "RW" | "NG")[] | undefined;
            };
            output: {
                type: string;
                id: string;
                mpesaPhoneNumber: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                organizationType: string;
                registrationNumber: string | null;
                cbkLicenseNumber: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                subscriptionTier: string;
                subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                trialEndsAt: Date | null;
                gracePeriodEndsAt: Date | null;
                cancelledAt: Date | null;
                subscriptionEndsAt: Date | null;
                verificationStatus: string;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                planStartDate: Date | null;
                planEndDate: Date | null;
                maxSeats: number;
                homeJurisdictionCode: string | null;
                enabledJurisdictions: string[];
                needsCountryConfirmation: boolean;
                stripeCustomerId: string | null;
                stripeSubId: string | null;
                customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                mpesaNextPaymentDueDate: Date | null;
                subscriptionCycleEnd: Date | null;
                mpesaFailedRenewalAttempts: number;
                mpesaLastRenewalAttemptAt: Date | null;
                mpesaNextRenewalRetryAt: Date | null;
                mpesaCancelledByUserAt: Date | null;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
                requireMfa: boolean;
                mfaPolicyEnabledAt: Date | null;
                mfaPolicyFirstEnabledAt: Date | null;
                mfaPolicyGraceHours: number;
                mfaPolicyUpdatedBy: string | null;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                type?: "ENTERPRISE" | "REGULATOR" | "STARTUP" | "OTHER" | "BANK" | "TELECOM" | "INSURANCE" | undefined;
                registrationNumber?: string | undefined;
                industry?: string | undefined;
                contactEmail?: string | undefined;
                contactPhone?: string | undefined;
                address?: string | undefined;
                website?: string | undefined;
                description?: string | undefined;
                homeJurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                homeJurisdictionReason?: string | undefined;
                enabledJurisdictions?: ("KE" | "MW" | "RW" | "NG")[] | undefined;
                needsCountryConfirmation?: boolean | undefined;
            };
            output: {
                type: string;
                id: string;
                mpesaPhoneNumber: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                organizationType: string;
                registrationNumber: string | null;
                cbkLicenseNumber: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                subscriptionTier: string;
                subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                trialEndsAt: Date | null;
                gracePeriodEndsAt: Date | null;
                cancelledAt: Date | null;
                subscriptionEndsAt: Date | null;
                verificationStatus: string;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                planStartDate: Date | null;
                planEndDate: Date | null;
                maxSeats: number;
                homeJurisdictionCode: string | null;
                enabledJurisdictions: string[];
                needsCountryConfirmation: boolean;
                stripeCustomerId: string | null;
                stripeSubId: string | null;
                customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                mpesaNextPaymentDueDate: Date | null;
                subscriptionCycleEnd: Date | null;
                mpesaFailedRenewalAttempts: number;
                mpesaLastRenewalAttemptAt: Date | null;
                mpesaNextRenewalRetryAt: Date | null;
                mpesaCancelledByUserAt: Date | null;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
                requireMfa: boolean;
                mfaPolicyEnabledAt: Date | null;
                mfaPolicyFirstEnabledAt: Date | null;
                mfaPolicyGraceHours: number;
                mfaPolicyUpdatedBy: string | null;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        addMember: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                organizationId: string;
                userId: string;
                role?: "ADMIN" | "MEMBER" | "VIEWER" | undefined;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        removeMember: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                organizationId: string;
                userId: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getMembers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                organizationId: string;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                members: {
                    role: import(".prisma/client").$Enums.MemberRole;
                    platformRole: import(".prisma/client").$Enums.UserRole;
                    orgRole: import(".prisma/client").$Enums.MemberRole;
                    membershipId: string;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    joinedAt: Date;
                    invitedAt: Date | null;
                    totpEnabled: boolean;
                    id: string;
                    email: string;
                    phone: string | null;
                    fullName: string;
                    emailVerified: boolean;
                    lastLoginAt: Date | null;
                    createdAt: Date;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        updateMemberRole: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                role: "ADMIN" | "MEMBER" | "VIEWER";
                organizationId?: string | undefined;
            };
            output: {
                success: boolean;
                member: {
                    id: string;
                    userId: string;
                    user: {
                        email: string;
                        fullName: string;
                    };
                    role: import(".prisma/client").$Enums.MemberRole;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    organizationId: string;
                };
                message: string;
            };
            meta: object;
        }>;
        suspendMember: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                organizationId?: string | undefined;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        reactivateMember: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                organizationId?: string | undefined;
            };
            output: {
                success: boolean;
                member: {
                    id: string;
                    userId: string;
                    user: {
                        email: string;
                        fullName: string;
                    };
                    role: import(".prisma/client").$Enums.MemberRole;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    organizationId: string;
                    joinedAt: Date;
                };
                message: string;
            };
            meta: object;
        }>;
        getSettings: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                currentMemberRole: import(".prisma/client").$Enums.MemberRole | null;
                canManageOrganizationSettings: boolean;
                id: string;
                name: string;
                registrationNumber: string | null;
                website: string | null;
                industry: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                homeJurisdictionCode: string | null;
                enabledJurisdictions: string[];
                needsCountryConfirmation: boolean;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
            };
            meta: object;
        }>;
        getSeatUsage: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                canManageMembers: boolean;
                seatLimit: number;
                activeMembers: number;
                pendingInvites: number;
                usedSeats: number;
                availableSeats: number;
            };
            meta: object;
        }>;
        getTeamOverview: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                organization: {
                    id: string;
                    name: string;
                    registrationNumber: string | null;
                    website: string | null;
                    industry: string | null;
                    subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                    plan: import(".prisma/client").$Enums.SubscriptionPlan;
                    maxSeats: number;
                    address: string | null;
                    contactPerson: string | null;
                    contactEmail: string | null;
                    contactPhone: string | null;
                };
                callerOrgRole: import(".prisma/client").$Enums.MemberRole;
                canManageMembers: boolean;
                seatUsage: import("../services/organization-seat.service").OrganizationSeatUsage;
                memberCounts: {
                    active: number;
                    suspended: number;
                    pendingInvitations: number;
                    capacity: number;
                };
                owner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                members: {
                    id: string;
                    membershipId: string;
                    name: string;
                    email: string;
                    role: import(".prisma/client").$Enums.MemberRole;
                    orgRole: import(".prisma/client").$Enums.MemberRole;
                    platformRole: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    joinedAt: Date;
                    invitedAt: Date | null;
                    createdAt: Date;
                    lastActive: Date | null;
                    lastLoginAt: Date | null;
                    totpEnabled: boolean;
                }[];
                pendingInvitations: {
                    id: string;
                    email: string;
                    createdAt: Date;
                    expiresAt: Date;
                    organizationRole: import(".prisma/client").$Enums.MemberRole | null;
                    invitedBy: string;
                }[];
            };
            meta: object;
        }>;
        getSecurityCenter: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                policy: {
                    requireMfa: boolean;
                    mfaPolicyEnabledAt: any;
                    mfaPolicyGraceHours: any;
                    mfaPolicyUpdatedBy: any;
                };
                posture: {
                    totalMembers: number;
                    mfaEnabled: number;
                    mfaMissing: number;
                    percentage: number;
                };
                canManageSecurity: boolean;
                currentUserMfaEnabled: boolean;
                members: {
                    id: string;
                    name: string;
                    email: string;
                    role: import(".prisma/client").$Enums.MemberRole;
                    status: import(".prisma/client").$Enums.MemberStatus;
                    totpEnabled: boolean;
                    lastActive: Date | null;
                }[];
            };
            meta: object;
        }>;
        updateSecurityPolicy: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                requireMfa: boolean;
                graceHours?: number | undefined;
            };
            output: {
                success: boolean;
                policy: {
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
                        eventType: string;
                        dueDate: Date | null;
                        completedAt: Date | null;
                        createdByUserId: string;
                        updatedByUserId: string | null;
                        licenseId: string;
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
                        eventType: string;
                        dueDate: Date | null;
                        completedAt: Date | null;
                        createdByUserId: string;
                        updatedByUserId: string | null;
                        licenseId: string;
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
                        eventType: string;
                        dueDate: Date | null;
                        completedAt: Date | null;
                        createdByUserId: string;
                        updatedByUserId: string | null;
                        licenseId: string;
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
                };
            };
            meta: object;
        }>;
        setMfaPolicy: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                requireMfa: boolean;
                organizationId?: string | undefined;
                graceHours?: number | undefined;
            };
            output: {
                success: boolean;
                policy: {
                    id: string;
                    requireMfa: boolean;
                    mfaPolicyEnabledAt: Date | null;
                    mfaPolicyFirstEnabledAt: Date | null;
                    mfaPolicyGraceHours: number;
                    mfaPolicyUpdatedBy: string | null;
                };
            };
            meta: object;
        }>;
        getActivityLog: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
            } | undefined;
            output: {
                logs: {
                    id: string;
                    timestamp: Date;
                    actor: {
                        id: string;
                        email: string;
                        name: string;
                    } | null;
                    action: string;
                    target: string | null;
                    targetId: string | null;
                    result: string;
                    metadata: import("@prisma/client/runtime/client").JsonValue;
                }[];
            };
            meta: object;
        }>;
        createInvitation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                role?: "ADMIN" | "MEMBER" | "VIEWER" | undefined;
                expiresInDays?: number | undefined;
            };
            output: {
                success: boolean;
                invitation: {
                    id: any;
                    email: any;
                    organizationRole: any;
                    expiresAt: any;
                    createdAt: any;
                };
            };
            meta: object;
        }>;
        listPendingInvitations: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                invitations: {
                    id: string;
                    email: string;
                    createdAt: Date;
                    expiresAt: Date;
                    organizationRole: import(".prisma/client").$Enums.MemberRole | null;
                    invitedBy: string;
                }[];
            };
            meta: object;
        }>;
        revokeInvitation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                invitationId: string;
            };
            output: {
                success: boolean;
                invitation: {
                    id: string;
                    email: string;
                    revokedAt: Date | null;
                };
            };
            meta: object;
        }>;
        resendInvitation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                invitationId: string;
                expiresInDays?: number | undefined;
            };
            output: {
                success: boolean;
                invitation: {
                    id: string;
                    email: string;
                    expiresAt: Date;
                    organizationRole: import(".prisma/client").$Enums.MemberRole | null;
                };
            };
            meta: object;
        }>;
        updateSettings: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name?: string | undefined;
                registrationNumber?: string | undefined;
                industry?: string | undefined;
                website?: string | undefined;
                address?: string | undefined;
                contactPerson?: string | undefined;
                contactPosition?: string | undefined;
                contactEmail?: string | undefined;
                contactPhone?: string | undefined;
                homeJurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                homeJurisdictionReason?: string | undefined;
                enabledJurisdictions?: ("KE" | "MW" | "RW" | "NG")[] | undefined;
            };
            output: {
                id: string;
                name: string;
                registrationNumber: string | null;
                website: string | null;
                industry: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                homeJurisdictionCode: string | null;
                enabledJurisdictions: string[];
                needsCountryConfirmation: boolean;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
            };
            meta: object;
        }>;
        confirmCountry: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                homeJurisdictionCode: "KE" | "MW" | "RW" | "NG";
                organizationId?: string | undefined;
                enabledJurisdictions?: ("KE" | "MW" | "RW" | "NG")[] | undefined;
            };
            output: {
                type: string;
                id: string;
                mpesaPhoneNumber: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                organizationType: string;
                registrationNumber: string | null;
                cbkLicenseNumber: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                subscriptionTier: string;
                subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                trialEndsAt: Date | null;
                gracePeriodEndsAt: Date | null;
                cancelledAt: Date | null;
                subscriptionEndsAt: Date | null;
                verificationStatus: string;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                planStartDate: Date | null;
                planEndDate: Date | null;
                maxSeats: number;
                homeJurisdictionCode: string | null;
                enabledJurisdictions: string[];
                needsCountryConfirmation: boolean;
                stripeCustomerId: string | null;
                stripeSubId: string | null;
                customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                mpesaNextPaymentDueDate: Date | null;
                subscriptionCycleEnd: Date | null;
                mpesaFailedRenewalAttempts: number;
                mpesaLastRenewalAttemptAt: Date | null;
                mpesaNextRenewalRetryAt: Date | null;
                mpesaCancelledByUserAt: Date | null;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
                requireMfa: boolean;
                mfaPolicyEnabledAt: Date | null;
                mfaPolicyFirstEnabledAt: Date | null;
                mfaPolicyGraceHours: number;
                mfaPolicyUpdatedBy: string | null;
            };
            meta: object;
        }>;
        updateEnabledJurisdictions: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                enabledJurisdictions: ("KE" | "MW" | "RW" | "NG")[];
                organizationId?: string | undefined;
            };
            output: {
                type: string;
                id: string;
                mpesaPhoneNumber: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                organizationType: string;
                registrationNumber: string | null;
                cbkLicenseNumber: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                subscriptionTier: string;
                subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
                trialEndsAt: Date | null;
                gracePeriodEndsAt: Date | null;
                cancelledAt: Date | null;
                subscriptionEndsAt: Date | null;
                verificationStatus: string;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                planStartDate: Date | null;
                planEndDate: Date | null;
                maxSeats: number;
                homeJurisdictionCode: string | null;
                enabledJurisdictions: string[];
                needsCountryConfirmation: boolean;
                stripeCustomerId: string | null;
                stripeSubId: string | null;
                customLimits: import("@prisma/client/runtime/client").JsonValue | null;
                preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                mpesaNextPaymentDueDate: Date | null;
                subscriptionCycleEnd: Date | null;
                mpesaFailedRenewalAttempts: number;
                mpesaLastRenewalAttemptAt: Date | null;
                mpesaNextRenewalRetryAt: Date | null;
                mpesaCancelledByUserAt: Date | null;
                address: string | null;
                contactPerson: string | null;
                contactPosition: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
                requireMfa: boolean;
                mfaPolicyEnabledAt: Date | null;
                mfaPolicyFirstEnabledAt: Date | null;
                mfaPolicyGraceHours: number;
                mfaPolicyUpdatedBy: string | null;
            };
            meta: object;
        }>;
        scheduleCountryReplacement: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fromJurisdiction: "KE" | "MW" | "RW" | "NG";
                toJurisdiction: "KE" | "MW" | "RW" | "NG";
                organizationId?: string | undefined;
            };
            output: {
                scheduled: boolean;
                effectiveAt: string;
                fromJurisdiction: string;
                toJurisdiction: string;
            };
            meta: object;
        }>;
        getScheduledCountryReplacement: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                organizationId?: string | undefined;
            };
            output: {
                scheduled: import("../../services/country-replacement.service").ScheduledCountryReplacement | null;
            };
            meta: object;
        }>;
        cancelCountryReplacement: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                organizationId?: string | undefined;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
    }>>;
    policy: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED" | undefined;
                regulatoryArea?: string | undefined;
                search?: string | undefined;
            };
            output: {
                policies: {
                    id: string;
                    title: string | null;
                    user: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    scenario: string;
                    regulatoryAreas: string[];
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {};
            meta: object;
        }>;
        generate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                scenario: string;
                organizationType: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE";
                regulatoryAreas: string[];
                title?: string | undefined;
                specificRequirements?: string | undefined;
                targetAudience?: string | undefined;
            };
            output: {
                policyId: any;
                jobId: string;
                status: string;
                message: string;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                content?: string | undefined;
                status?: "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED" | undefined;
                metadata?: Record<string, any> | undefined;
            };
            output: any;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        export: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                format?: "PDF" | "DOCX" | "MD" | undefined;
            };
            output: {
                downloadUrl: string;
                filename: string;
                fileSize: number;
                expiresAt: string;
            };
            meta: object;
        }>;
        refine: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                refinementInstructions: string;
            };
            output: {
                success: boolean;
                policyId: any;
                version: any;
                message: string;
            };
            meta: object;
        }>;
        verifyCitations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                content: string;
                model: string;
                inputTokens: number;
                outputTokens: number;
                cost: number;
                citationCount: number;
                verified: number;
                failed: number;
            };
            meta: object;
        }>;
        getStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                policyId: string;
                title: string | null;
                status: import(".prisma/client").$Enums.PolicyStatus;
                progress: number;
                isComplete: boolean;
                isFailed: boolean;
                errorMessage: any;
                generatedAt: any;
                tokensUsed: any;
                updatedAt: Date;
            };
            meta: object;
        }>;
        getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                policyId: string;
                rootId: string;
                versions: {
                    id: string;
                    title: string | null;
                    status: import(".prisma/client").$Enums.PolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    isLatestVersion: boolean;
                    version: number;
                }[];
            };
            meta: object;
        }>;
    }>>;
    compliance: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        jurisdictionCapabilities: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                jurisdictions: {
                    code: "KE" | "MW" | "RW" | "NG";
                    name: string;
                    queryEnabled: boolean;
                    comparisonEnabled: boolean;
                    corpusReady: boolean;
                    gapAnalysisEnabled: boolean;
                    checklistEnabled: boolean;
                    customFrameworkEnabled: boolean;
                    status: import("../../types/jurisdiction").JurisdictionAvailabilityStatus;
                }[];
            };
            meta: object;
        }>;
        query: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                question: string;
                mode?: "SINGLE" | "COMPARE" | undefined;
                jurisdictions?: ("KE" | "MW" | "RW" | "NG")[] | undefined;
                organizationType?: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE" | undefined;
                industry?: string | undefined;
                context?: string | undefined;
                answerDetail?: "standard" | "detailed" | undefined;
            };
            output: {
                queryId: any;
                answer: string;
                citations: import("../../lib/source-grounding/citations").SourceCitation[];
                confidence: number | null;
                suggestedFollowUps: never[];
                mode: "SINGLE" | "COMPARE";
                jurisdictions: ("KE" | "MW" | "RW" | "NG")[];
                primaryJurisdiction: "KE" | "MW" | "RW" | "NG" | null;
                jurisdictionSource: import("../../types/jurisdiction").JurisdictionSource;
                route: string;
                grounded: boolean;
                abstained: false;
                runId: string | null;
            } | {
                queryId: any;
                answer: string;
                citations: import("../../lib/source-grounding/citations").SourceCitation[];
                confidence: null;
                suggestedFollowUps: never[];
                mode: "SINGLE" | "COMPARE";
                jurisdictions: ("KE" | "MW" | "RW" | "NG")[];
                primaryJurisdiction: "KE" | "MW" | "RW" | "NG" | null;
                jurisdictionSource: import("../../types/jurisdiction").JurisdictionSource;
                route: string | null;
                grounded: boolean;
                abstained: boolean;
                runId: string | null;
            };
            meta: object;
        }>;
        followUp: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                originalQueryId: string;
                question: string;
            };
            output: {
                queryId: any;
                answer: string;
                citations: import("../../lib/source-grounding/citations").SourceCitation[];
                mode: "SINGLE" | "COMPARE";
                jurisdictions: ("KE" | "MW" | "RW" | "NG")[];
                primaryJurisdiction: "KE" | "MW" | "RW" | "NG" | null;
                jurisdictionSource: import("../../types/jurisdiction").JurisdictionSource;
            };
            meta: object;
        }>;
        search: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                query: string;
                limit?: number | undefined;
                filter?: {
                    documentType?: string | undefined;
                    regulatoryArea?: string | undefined;
                    dateFrom?: Date | undefined;
                    dateTo?: Date | undefined;
                } | undefined;
            };
            output: {
                results: {
                    text: any;
                    source: any;
                    section: any;
                    score: any;
                    documentId: any;
                    authorityStatus: any;
                    isBinding: any;
                    sourceAuthority: any;
                    version: any;
                }[];
                summary: {
                    query: string;
                    totalResults: number;
                    documentsFound: string[];
                    topSections: string[];
                    citations: string[];
                    avgScore: number;
                };
                totalResults: number;
            };
            meta: object;
        }>;
        history: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                queries: {
                    id: string;
                    query: string;
                    user: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                    createdAt: Date;
                    jurisdictions: string[];
                    primaryJurisdiction: string | null;
                    jurisdictionSource: string | null;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                userId: string;
                query: string;
                status: string;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                regulatoryAreas: import("@prisma/client/runtime/client").JsonValue | null;
                recommendations: import("@prisma/client/runtime/client").JsonValue | null;
                confidence: number | null;
                summary: string | null;
                response: string | null;
                citations: import("@prisma/client/runtime/client").JsonValue | null;
                processingTimeMs: number | null;
                mode: string | null;
                jurisdictions: string[];
                primaryJurisdiction: string | null;
                jurisdictionSource: string | null;
                corpusVersionSnapshot: import("@prisma/client/runtime/client").JsonValue | null;
                productCategory: string | null;
                regulations: import("@prisma/client/runtime/client").JsonValue | null;
                requirements: import("@prisma/client/runtime/client").JsonValue | null;
                gaps: import("@prisma/client/runtime/client").JsonValue | null;
            };
            meta: object;
        }>;
        getFollowUps: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                originalQueryId: string;
            };
            output: {
                followUps: any;
            };
            meta: object;
        }>;
        quickCheck: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                scenario: string;
                organizationType: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE";
            };
            output: import("../../lib/ai/client").AICompletionResult;
            meta: object;
        }>;
        getScore: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/compliance").ComplianceScore;
            meta: object;
        }>;
        getScoreHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                days?: number | undefined;
            };
            output: import("../../modules/compliance").ScoreHistory[];
            meta: object;
        }>;
        getRecommendations: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: string[];
            meta: object;
        }>;
        getRequirements: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: string | undefined;
                area?: string | undefined;
            };
            output: {
                requirements: import("../../modules/compliance").Requirement[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        updateRequirement: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                requirementId: string;
                status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "OVERDUE" | "WAIVED";
                notes?: string | undefined;
            };
            output: import("../../modules/compliance").Requirement;
            meta: object;
        }>;
        getDeadlines: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                daysAhead?: number | undefined;
            };
            output: import("../../modules/compliance").UpcomingDeadline[];
            meta: object;
        }>;
        getRoadmap: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/compliance").ComplianceRoadmap;
            meta: object;
        }>;
        getSuggestedQueries: import("@trpc/server").TRPCQueryProcedure<{
            input: Record<string, never>;
            output: {
                suggestions: {
                    id: string;
                    text: string;
                    reason: "industry" | "history" | "alert" | "cohort" | "curated";
                    relatedArea?: string;
                }[];
            };
            meta: object;
        }>;
        recordSuggestionClick: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                suggestionId: string;
                suggestionText?: string | undefined;
                surface?: "other" | "empty_state" | "sidebar" | "dashboard" | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        submitFeedback: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
                rating: "down" | "up";
            };
            output: {
                rating: "down" | "up" | null;
                action: "created" | "updated" | "cleared";
                tracked: boolean;
            };
            meta: object;
        }>;
        getFeedbackStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                queryId: string;
            };
            output: {
                rating: "up" | "down" | null;
            };
            meta: object;
        }>;
        toggleSave: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
                notes?: string | undefined;
            };
            output: {
                saved: boolean;
                savedAt: Date | null;
            };
            meta: object;
        }>;
        getSavedStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                queryId: string;
            };
            output: {
                saved: boolean;
                savedAt: Date | null;
                notes: string | null;
            };
            meta: object;
        }>;
        listSavedResponses: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                items: ({
                    query: {
                        id: string;
                        query: string;
                        createdAt: Date;
                        response: string | null;
                    };
                } & {
                    id: string;
                    userId: string;
                    createdAt: Date;
                    notes: string | null;
                    queryId: string;
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        logExport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                analysisId: string;
                format: "pdf" | "docx";
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        exportDocx: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                analysisId: string;
            };
            output: {
                downloadUrl: string;
                expiresAt: string;
                fileName: string;
            };
            meta: object;
        }>;
        exportChecklistDocx: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
            };
            output: {
                downloadUrl: string;
                expiresAt: string;
                fileName: string;
            };
            meta: object;
        }>;
        exportQueryDocx: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
            };
            output: {
                downloadUrl: string;
                expiresAt: string;
                fileName: string;
            };
            meta: object;
        }>;
        reportGap: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                queryId: string;
                runId: string | null;
                suggestedDocument?: string | undefined;
                notes?: string | undefined;
            };
            output: {
                feedbackId: string;
            };
            meta: object;
        }>;
    }>>;
    document: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filename: string;
                fileType: string;
                fileSize: number;
                documentType?: string | undefined;
            };
            output: {
                uploadUrl: string;
                key: string;
                documentId: `${string}-${string}-${string}-${string}-${string}`;
                expiresAt: string;
            };
            meta: object;
        }>;
        confirmUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                key: string;
                filename: string;
                fileType: string;
                fileSize: number;
                documentType?: string | undefined;
                documentId?: string | undefined;
                description?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                documentId: string;
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                documentType?: string | undefined;
                search?: string | undefined;
            };
            output: {
                documents: {
                    id: string;
                    title: string | null;
                    createdAt: Date;
                    actName: string;
                    documentType: string;
                    regulatoryBody: string | null;
                    fileSize: number;
                    author: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        listBenchmarkDocuments: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                search?: string | undefined;
            } | undefined;
            output: {
                documents: import("../services/benchmark-document.service").AuthorizedBenchmarkDocument[];
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                author: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
            } & {
                id: string;
                title: string | null;
                userId: string | null;
                status: import(".prisma/client").$Enums.DocumentStatus;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                isLatestVersion: boolean;
                parentId: string | null;
                version: number;
                actName: string;
                documentType: string;
                enactmentDate: Date | null;
                effectiveDate: Date | null;
                amendedBy: string[];
                regulatoryBody: string | null;
                originalFilename: string;
                fileUrl: string;
                fileSize: number;
                mimeType: string;
                totalChunks: number | null;
                processedAt: Date | null;
                fullText: string | null;
                summary: string | null;
                keywords: string[];
                authorId: string | null;
                category: string | null;
                contentStatus: import(".prisma/client").$Enums.ContentStatus;
                contentType: import(".prisma/client").$Enums.ContentType;
                excerpt: string | null;
                helpfulCount: number;
                htmlContent: string | null;
                notHelpfulCount: number;
                publishedAt: Date | null;
                publishedBy: string | null;
                seoDescription: string | null;
                seoKeywords: string[];
                seoTitle: string | null;
                slug: string | null;
                subcategory: string | null;
                tags: string[];
                viewCount: number;
            };
            meta: object;
        }>;
        getDownloadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                downloadUrl: string;
                filename: string;
                expiresAt: string;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        restore: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getProcessingStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                documentId: string;
            };
            output: {
                documentId: string;
                status: import(".prisma/client").$Enums.DocumentStatus;
                totalChunks: number;
                processedChunks: number;
                processedAt: Date | null;
                isComplete: boolean;
                isFailed: boolean;
            };
            meta: object;
        }>;
        reingest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
            };
            output: {
                success: boolean;
                message: string;
                documentId: string;
            };
            meta: object;
        }>;
    }>>;
    content: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentType: "KNOWLEDGE_BASE_ARTICLE" | "POLICY_TEMPLATE";
                title: string;
                content: string;
                slug?: string | undefined;
                excerpt?: string | undefined;
                category?: string | undefined;
                subcategory?: string | undefined;
                tags?: string[] | undefined;
                seoTitle?: string | undefined;
                seoDescription?: string | undefined;
                seoKeywords?: string[] | undefined;
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
            };
            output: {
                id: string;
                slug: string | null;
                contentType: import(".prisma/client").$Enums.ContentType;
                contentStatus: import(".prisma/client").$Enums.ContentStatus;
                title: string | null;
                createdAt: Date;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                slug?: string | undefined;
                excerpt?: string | undefined;
                content?: string | undefined;
                category?: string | undefined;
                subcategory?: string | undefined;
                tags?: string[] | undefined;
                seoTitle?: string | undefined;
                seoDescription?: string | undefined;
                seoKeywords?: string[] | undefined;
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
            };
            output: {
                id: string;
                slug: string | null;
                contentStatus: import(".prisma/client").$Enums.ContentStatus;
                title: string | null;
                updatedAt: Date;
            };
            meta: object;
        }>;
        listPublishedKnowledgeBase: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                search?: string | undefined;
                category?: string | undefined;
                tag?: string | undefined;
            };
            output: {
                items: {
                    id: string;
                    title: string | null;
                    slug: string;
                    excerpt: string | null;
                    category: string | null;
                    subcategory: string | null;
                    tags: string[];
                    publishedAt: Date | null;
                    updatedAt: Date;
                    viewCount: number;
                    readingTime: number;
                    author: {
                        id: string;
                        name: string;
                        avatar: string | null;
                    } | null;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            };
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                contentType?: "REGULATORY_DOCUMENT" | "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE" | "POLICY_TEMPLATE" | undefined;
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
                category?: string | undefined;
                tag?: string | undefined;
                search?: string | undefined;
                authorId?: string | undefined;
            };
            output: {
                items: {
                    id: string;
                    title: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    version: number;
                    authorId: string | null;
                    category: string | null;
                    contentStatus: import(".prisma/client").$Enums.ContentStatus;
                    contentType: import(".prisma/client").$Enums.ContentType;
                    excerpt: string | null;
                    helpfulCount: number;
                    publishedAt: Date | null;
                    slug: string | null;
                    subcategory: string | null;
                    tags: string[];
                    viewCount: number;
                    author: {
                        id: string;
                        fullName: string;
                        avatar: string | null;
                    } | null;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                publisher: {
                    id: string;
                    fullName: string;
                } | null;
                author: {
                    id: string;
                    fullName: string;
                    avatar: string | null;
                } | null;
            } & {
                id: string;
                title: string | null;
                userId: string | null;
                status: import(".prisma/client").$Enums.DocumentStatus;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                isLatestVersion: boolean;
                parentId: string | null;
                version: number;
                actName: string;
                documentType: string;
                enactmentDate: Date | null;
                effectiveDate: Date | null;
                amendedBy: string[];
                regulatoryBody: string | null;
                originalFilename: string;
                fileUrl: string;
                fileSize: number;
                mimeType: string;
                totalChunks: number | null;
                processedAt: Date | null;
                fullText: string | null;
                summary: string | null;
                keywords: string[];
                authorId: string | null;
                category: string | null;
                contentStatus: import(".prisma/client").$Enums.ContentStatus;
                contentType: import(".prisma/client").$Enums.ContentType;
                excerpt: string | null;
                helpfulCount: number;
                htmlContent: string | null;
                notHelpfulCount: number;
                publishedAt: Date | null;
                publishedBy: string | null;
                seoDescription: string | null;
                seoKeywords: string[];
                seoTitle: string | null;
                slug: string | null;
                subcategory: string | null;
                tags: string[];
                viewCount: number;
            };
            meta: object;
        }>;
        getBySlug: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                slug: string;
                contentType?: "KNOWLEDGE_BASE_ARTICLE" | undefined;
            };
            output: {
                id: string;
                contentType: import(".prisma/client").$Enums.ContentType;
                title: string | null;
                slug: string | null;
                excerpt: string | null;
                htmlContent: string | null;
                content: string | null;
                category: string | null;
                subcategory: string | null;
                tags: string[];
                seoTitle: string | null;
                seoDescription: string | null;
                seoKeywords: string[];
                publishedAt: Date | null;
                updatedAt: Date;
                viewCount: number;
                helpfulCount: number;
                notHelpfulCount: number;
                author: {
                    id: string;
                    fullName: string;
                    avatar: string | null;
                } | null;
            };
            meta: object;
        }>;
        publish: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                slug: string | null;
                contentStatus: import(".prisma/client").$Enums.ContentStatus;
                publishedAt: Date | null;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        rate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                helpful: boolean;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    admin: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                users: {
                    total: number;
                    active: number;
                };
                organizations: {
                    total: number;
                };
                policies: {
                    total: number;
                    completed: number;
                    generating: number;
                };
                queries: {
                    total: number;
                };
                documents: {
                    total: number;
                    storageUsed: number;
                };
                recentActivity: {
                    policies: any[];
                    queries: {
                        id: string;
                        query: string;
                        user: {
                            email: string;
                            fullName: string;
                        };
                        createdAt: Date;
                    }[];
                };
            };
            meta: object;
        }>;
        getOperationalOverview: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").AdminOperationalOverview;
            meta: object;
        }>;
        listUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                role?: "ENTERPRISE" | "REGULATOR" | "STARTUP" | "ADMIN" | undefined;
                status?: "active" | "inactive" | undefined;
                recentlyActive?: boolean | undefined;
                search?: string | undefined;
            };
            output: {
                users: {
                    id: string;
                    email: string;
                    organization: {
                        id: string;
                        name: string;
                    } | null;
                    fullName: string;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.UserStatus;
                    emailVerified: boolean;
                    lastLoginAt: Date | null;
                    createdAt: Date;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        updateUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                role?: "ENTERPRISE" | "REGULATOR" | "STARTUP" | "ADMIN" | undefined;
                emailVerified?: boolean | undefined;
            };
            output: {
                id: string;
                email: string;
                fullName: string;
                role: import(".prisma/client").$Enums.UserRole;
                emailVerified: boolean;
            };
            meta: object;
        }>;
        getSystemHealth: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getLogs: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                userId?: string | undefined;
                actorEmail?: string | undefined;
                organizationId?: string | undefined;
                action?: string | undefined;
                entityType?: string | undefined;
                entityId?: string | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "INFO" | undefined;
                search?: string | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin").PaginatedAuditLog;
            meta: object;
        }>;
        getAuditLogDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: import("../../modules/admin").AuditLogEntry;
            meta: object;
        }>;
        deleteUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        suspendUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                reason?: string | undefined;
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        reactivateUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        getAllOrganizations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                search?: string | undefined;
                status?: string | undefined;
                tier?: string | undefined;
                sortBy?: "createdAt" | "name" | "organizationType" | "subscriptionTier" | "subscriptionStatus" | "memberCount" | undefined;
                sortOrder?: "asc" | "desc" | undefined;
            };
            output: import("../../modules/admin").PaginatedOrganizations;
            meta: object;
        }>;
        listOrganizations: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                plan: string;
                subscriptionTier: string;
            }[];
            meta: object;
        }>;
        listAIJobs: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "COMPLETED" | "RUNNING" | "QUEUED" | "DEAD_LETTERED" | "RETRYING" | undefined;
                type?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                jobs: {
                    type: string;
                    id: string;
                    userId: string | null;
                    status: string;
                    organizationId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    progress: number;
                    completedAt: Date | null;
                    targetEntityType: string;
                    targetEntityId: string;
                    attempts: number;
                    maxAttempts: number;
                    runAfter: Date;
                    lockedAt: Date | null;
                    lockedBy: string | null;
                    startedAt: Date | null;
                    failedAt: Date | null;
                    lastError: string | null;
                    deadLetteredAt: Date | null;
                    events: {
                        type: string;
                        message: string | null;
                        createdAt: Date;
                        progress: number | null;
                    }[];
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        getOrganizationStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin/admin.types").OrganizationStats;
            meta: object;
        }>;
        getOrgMembers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
            };
            output: {
                id: string;
                fullName: string;
                email: string;
                role: string;
                status: string;
                createdAt: Date;
            }[];
            meta: object;
        }>;
        getOrgDetails: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        getOrgAuditLog: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
            };
            output: import("../../modules/admin").AuditLogEntry[];
            meta: object;
        }>;
        suspendOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                reason?: string | undefined;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        reactivateOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        getSystemConfig: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").SystemConfig;
            meta: object;
        }>;
        updateSystemConfig: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                config: Record<string, unknown>;
            };
            output: import("../../modules/admin").SystemConfig;
            meta: object;
        }>;
        getFeatureFlags: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").FeatureFlags;
            meta: object;
        }>;
        updateFeatureFlag: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                flag: string;
                enabled: boolean;
            };
            output: import("../../modules/admin").FeatureFlags;
            meta: object;
        }>;
        setMaintenanceMode: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                enabled: boolean;
                message?: string | undefined;
            };
            output: import("../../modules/admin").MaintenanceStatus;
            meta: object;
        }>;
        getUser: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        getUserActivityLog: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").AuditLogEntry[];
            meta: object;
        }>;
        getDetailedHealth: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                cache: import("../../modules/admin").CacheStats | null;
                storage: import("../../modules/admin").StorageStats | null;
                connections: import("../../modules/admin").ConnectionStats | null;
                status: "healthy" | "degraded" | "down";
                services: {
                    database: import("../../modules/admin").ServiceHealth;
                    redis: import("../../modules/admin").ServiceHealth;
                    pinecone: import("../../modules/admin").ServiceHealth;
                    storage: import("../../modules/admin").ServiceHealth;
                };
                uptime: number;
                version: string;
                checkedAt: Date;
            };
            meta: object;
        }>;
        getSystemOpsHealth: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                overallStatus: "healthy" | "degraded" | "down";
                generatedAt: string;
                checks: {
                    database: {
                        status: "healthy" | "degraded" | "down";
                        label: string;
                        message: string;
                        lastCheckedAt: string;
                    };
                    redis: {
                        status: "healthy" | "degraded" | "down";
                        label: string;
                        message: string;
                        lastCheckedAt: string;
                    };
                    pinecone: {
                        status: "healthy" | "degraded" | "down";
                        label: string;
                        message: string;
                        lastCheckedAt: string;
                    };
                    storage: {
                        status: "healthy" | "degraded" | "down";
                        label: string;
                        message: string;
                        lastCheckedAt: string;
                    };
                    aiProvider: {
                        status: "unknown";
                        label: string;
                        message: string;
                    };
                    emailProvider: {
                        status: "unknown";
                        label: string;
                        message: string;
                    };
                    vaultReconciliation: {
                        status: "not_configured";
                        label: string;
                        message: string;
                    };
                    malwareScanning: {
                        status: "not_configured";
                        label: string;
                        message: string;
                    };
                    webhookHealth: {
                        status: "unknown";
                        label: string;
                        message: string;
                    };
                    cronJobs: {
                        status: "unknown";
                        label: string;
                        message: string;
                    };
                };
            };
            meta: object;
        }>;
        getVaultSafetySummary: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                generatedAt: string;
                overallStatus: "healthy" | "degraded" | "down";
                malwareScanning: {
                    status: "healthy" | "degraded" | "not_configured";
                    enabled: boolean;
                    configured: boolean;
                    message: string;
                    skippedScanCountLast7d: null;
                    failedScanCountLast7d: null;
                    evidence: string[];
                };
                vaultDocuments: {
                    total: number;
                    verified: number;
                    pending: number;
                    failed: number;
                    unverified: number;
                    missingContentHash: number;
                    recentlyUploadedLast7d: number;
                };
                reconciliation: {
                    status: "not_configured";
                    dryRun: null;
                    lastRunAt: null;
                    lastSuccessfulRunAt: null;
                    r2OrphansDetected: null;
                    dbOrphansDetected: null;
                    message: string;
                };
                storage: {
                    status: "healthy" | "degraded" | "down" | "unknown" | "not_configured";
                    message: string;
                    evidence: never[];
                };
                warnings: Array<{
                    id: string;
                    severity: "info" | "warning" | "critical";
                    title: string;
                    message: string;
                    actionHref?: string | null;
                }>;
                recentEvents: Array<{
                    id: string;
                    type: string;
                    title: string;
                    severity: "info" | "warning" | "critical";
                    createdAt: string;
                    description?: string;
                }>;
            };
            meta: object;
        }>;
        getSecuritySummary: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                generatedAt: string;
                overallStatus: "healthy" | "degraded";
                loginActivity: {
                    successfulSessionsLast24h: number;
                    successfulSessionsLast7d: number;
                    failedLoginsLast24h: number;
                    failedLoginTrackingAvailable: boolean;
                    suspiciousIpCount: number;
                };
                sessions: {
                    activeSessions: number;
                    expiredSessionsLast7d: number;
                    revokedSessionsLast7d: null;
                };
                accessControl: {
                    recentRoleChangesLast7d: number;
                    adminUsers: number;
                    usersWithTotpEnabled: number;
                    totpTrackingAvailable: boolean;
                };
                audit: {
                    auditLogsLast24h: number;
                    securityAuditLogsLast7d: number;
                    auditLoggingAvailable: boolean;
                };
                warnings: {
                    id: string;
                    severity: "info" | "warning" | "critical";
                    title: string;
                    message: string;
                }[];
            };
            meta: object;
        }>;
        createInvitation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                role: "ENTERPRISE" | "REGULATOR" | "STARTUP";
                organizationId?: string | undefined;
                expiresInDays?: number | undefined;
            };
            output: {
                success: boolean;
                invitationId: string;
                email: string;
                role: string;
                expiresAt: Date;
            };
            meta: object;
        }>;
        listInvitations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                used?: boolean | undefined;
                role?: "ENTERPRISE" | "REGULATOR" | "STARTUP" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                items: {
                    id: string;
                    email: string;
                    role: string;
                    organizationId: string | null;
                    createdAt: Date;
                    expiresAt: Date;
                    usedAt: Date | null;
                    revokedAt: Date | null;
                    organizationRole: import(".prisma/client").$Enums.MemberRole | null;
                    used: boolean;
                    revokedBy: string | null;
                    invitedBy: string;
                }[];
                total: number;
                page: number;
                limit: number;
            };
            meta: object;
        }>;
        listPendingUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                users: {
                    id: string;
                    email: string;
                    organization: {
                        id: string;
                        name: string;
                    } | null;
                    fullName: string;
                    role: import(".prisma/client").$Enums.UserRole;
                    accountStatus: string;
                    emailVerified: boolean;
                    createdAt: Date;
                }[];
                total: number;
                page: number;
                limit: number;
            };
            meta: object;
        }>;
        approveUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        rejectUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        listPendingOrganizations: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                orgs: {
                    type: string;
                    id: string;
                    createdAt: Date;
                    name: string;
                    organizationType: string;
                    registrationNumber: string | null;
                    cbkLicenseNumber: string | null;
                    verificationStatus: string;
                    users: {
                        id: string;
                        email: string;
                        fullName: string;
                        role: import(".prisma/client").$Enums.UserRole;
                    }[];
                }[];
                total: number;
                page: number;
                limit: number;
            };
            meta: object;
        }>;
        verifyOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        rejectOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getChecklistMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                window?: "alltime" | "today" | undefined;
            } | undefined;
            output: {
                alltime: import("../../lib/metrics/checklist-metrics").ChecklistMetricsStats;
                today: import("../../lib/metrics/checklist-metrics").ChecklistMetricsStats;
            };
            meta: object;
        }>;
        createUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                fullName: string;
                password: string;
                role?: "ENTERPRISE" | "REGULATOR" | "STARTUP" | "ADMIN" | undefined;
                subscriptionTier?: "BUSINESS" | "ENTERPRISE" | "REGULATOR" | "STARTUP" | undefined;
                organizationId?: unknown;
                organizationName?: unknown;
                homeJurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                orgRole?: "ADMIN" | "OWNER" | "MEMBER" | "VIEWER" | undefined;
                isPilot?: boolean | undefined;
                sendWelcomeEmail?: boolean | undefined;
            };
            output: {
                id: string;
                email: string;
                fullName: string;
                phone: string | null;
                role: string;
                status: string;
                emailVerified: boolean;
                organizationId: string | null;
                organizationName: string | null;
                organizationPlan: string | null;
                lastLoginAt: Date | null;
                lastLoginIp: string | null;
                createdAt: Date;
                updatedAt: Date;
                sessionCount: number;
                policyCount: number;
                queryCount: number;
            };
            meta: object;
        }>;
        forcePasswordReset: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        updateUserRole: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                role: "ENTERPRISE" | "REGULATOR" | "STARTUP" | "ADMIN";
            };
            output: import("../../modules/admin").AdminUserDetail;
            meta: object;
        }>;
        impersonateUser: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin").ImpersonationToken;
            meta: object;
        }>;
        updateOrganization: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                name?: string | undefined;
                type?: string | undefined;
                registrationNumber?: string | undefined;
                website?: string | undefined;
                address?: string | undefined;
                contactPerson?: string | undefined;
                contactEmail?: string | undefined;
                contactPhone?: string | undefined;
                contactPosition?: string | undefined;
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        updateOrganizationPlan: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId: string;
                plan: "BUSINESS" | "ENTERPRISE" | "REGULATOR" | "STARTUP";
            };
            output: import("../../modules/admin").AdminOrgDetail;
            meta: object;
        }>;
        getUserGrowth: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                period?: "monthly" | "daily" | "weekly" | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").UserGrowthData;
            meta: object;
        }>;
        getRevenueMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").RevenueMetrics;
            meta: object;
        }>;
        getAIUsageMetrics: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").AIUsageMetrics;
            meta: object;
        }>;
        getSubscriptionBreakdown: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: import("../../modules/admin/admin.types").SubscriptionBreakdown;
            meta: object;
        }>;
        getLoginHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId?: string | undefined;
                email?: string | undefined;
                success?: boolean | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").PaginatedLoginHistory;
            meta: object;
        }>;
        listContent: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contentType: "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE";
                contentStatus?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
                search?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").PaginatedContent;
            meta: object;
        }>;
        updateContentStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
                contentStatus: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW";
            };
            output: import("../../modules/admin/admin.types").ContentItem;
            meta: object;
        }>;
        deleteContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        createContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentType: "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE";
                title: string;
                excerpt?: string | undefined;
                category?: string | undefined;
            };
            output: {
                id: string;
            };
            meta: object;
        }>;
        getSubscriptionOverview: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").SubscriptionOverview;
            meta: object;
        }>;
        getBillingPlanCatalog: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").BillingPlanCatalog;
            meta: object;
        }>;
        updateBillingPlanCatalog: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                plans: {
                    id: "BUSINESS" | "STARTUP";
                    price: {
                        monthly: number;
                        yearly: number | null;
                    };
                    trialDays: number;
                    stripe: {
                        monthlyPriceId: string;
                        yearlyPriceId: string | null;
                    };
                }[];
            };
            output: import("../../modules/admin").BillingPlanCatalog;
            meta: object;
        }>;
        getBillingOperationsSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                generatedAt: string;
                overallStatus: "healthy" | "degraded";
                revenue: {
                    totalRevenueLast30Days: number;
                    totalRevenueAllTime: number;
                    currency: string;
                };
                payments: {
                    successfulLast30Days: number;
                    failedLast30Days: number;
                    pendingLast30Days: number;
                    failedAmountLast30Days: number;
                    pendingAmountLast30Days: number;
                };
                subscriptions: {
                    active: number;
                    trialing: number;
                    pastDue: number;
                    cancelled: number;
                    suspended: number;
                };
                trials: {
                    activeTrials: number;
                    expiringIn7Days: number;
                    expiredLast7Days: number;
                };
                provider: {
                    name: string;
                    status: "unknown" | "healthy" | "degraded";
                    message: string;
                    lastWebhookAt: string | null;
                    lastReceivedWebhookAt: string | null;
                    lastSuccessfulWebhookAt: string | null;
                    lastRejectedWebhookAt: string | null;
                    lastFinalizationFailureAt: string | null;
                    verificationFailuresLast24Hours: number;
                    providerLookupFailuresLast24Hours: number;
                    unknownTransactionsLast24Hours: number;
                    stalePendingPaymentCount: number;
                };
                pendingIntaSendPayments: {
                    id: string;
                    orgId: string;
                    orgName: string;
                    invoiceNumber: string | null;
                    providerTransactionId: string | null;
                    maskedPhone: string | null;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    amount: number;
                    currency: string;
                    ageMinutes: number;
                    createdAt: string;
                    lastReconciliationAt: string | null;
                }[];
                problemAccounts: {
                    organizationId: string | null;
                    organizationName: string | null;
                    userId?: string | null;
                    userEmail?: string | null;
                    issueType: "failed_payment" | "stale_pending_payment" | "past_due" | "trial_expiring" | "suspended" | "unknown";
                    amount?: number | null;
                    currency?: string | null;
                    lastEventAt?: string | null;
                    actionHref?: string | null;
                }[];
                recentEvents: {
                    id: string;
                    type: string;
                    title: string;
                    description?: string;
                    severity: "info" | "warning" | "critical";
                    createdAt: string;
                    actionHref?: string | null;
                }[];
            };
            meta: object;
        }>;
        reconcileIntaSendPayment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                paymentId: string;
                reason: string;
            };
            output: {
                providerState: "COMPLETE";
                result: import("../../modules/billing/intasend-finalization.service").FinalizeIntaSendPaymentResult;
            } | {
                providerState: "FAILED" | "PENDING";
                result: null;
            };
            meta: object;
        }>;
        expireIntaSendPayment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                paymentId: string;
                reason: string;
            };
            output: {
                success: boolean;
                expired: boolean;
                paymentStatus: "EXPIRED" | "COMPLETED" | "FAILED" | "REFUNDED";
                result: "already_terminal";
                providerState?: undefined;
            } | {
                success: boolean;
                expired: boolean;
                providerState: "COMPLETE";
                result: import("../../modules/billing/intasend-finalization.service").FinalizeIntaSendPaymentResult;
                paymentStatus?: undefined;
            } | {
                success: boolean;
                expired: boolean;
                providerState: "FAILED";
                result: "marked_failed";
                paymentStatus?: undefined;
            } | {
                success: boolean;
                expired: boolean;
                providerState: "PENDING";
                result: "expired";
                paymentStatus?: undefined;
            };
            meta: object;
        }>;
        getRecentPayments: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").PaymentSummary[];
            meta: object;
        }>;
        getOrgPaymentHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId: string;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: import("../../modules/admin/admin.types").OrgPaymentHistory;
            meta: object;
        }>;
        listUserActiveSessions: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: import("../../modules/admin/admin.types").SessionSummary[];
            meta: object;
        }>;
        signOutUserEverywhere: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        bulkUpdateUserStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userIds: string[];
                status: "SUSPENDED" | "ACTIVE";
            };
            output: {
                success: boolean;
                count: number;
            };
            meta: object;
        }>;
        bulkUpdateUserTier: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userIds: string[];
                tier: "BUSINESS" | "ENTERPRISE" | "REGULATOR" | "STARTUP";
            };
            output: {
                success: boolean;
                count: number;
            };
            meta: object;
        }>;
        getFailedPayments: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
                cursor?: string | undefined;
            };
            output: {
                items: {
                    id: string;
                    orgId: string;
                    orgName: string;
                    provider: string;
                    amount: number;
                    currency: string;
                    status: string;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    description: string | null;
                    metadata: Record<string, unknown> | null;
                    paidAt: Date | null;
                    createdAt: Date;
                }[];
                total: number;
                nextCursor: string | null;
            };
            meta: object;
        }>;
        exportAnalyticsCsv: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                dateFrom?: string | undefined;
            };
            output: {
                url: string;
                expiresAt: Date;
            };
            meta: object;
        }>;
        exportAuditLogs: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                format: "docx" | "csv";
                userId?: string | undefined;
                actorEmail?: string | undefined;
                organizationId?: string | undefined;
                action?: string | undefined;
                entityType?: string | undefined;
                entityId?: string | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "INFO" | undefined;
                search?: string | undefined;
                dateFrom?: string | undefined;
                dateTo?: string | undefined;
            };
            output: {
                url: string;
                expiresAt: Date;
            };
            meta: object;
        }>;
    }>>;
    notification: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                unreadOnly?: boolean | undefined;
                type?: string | undefined;
                category?: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM" | undefined;
            };
            output: import("../../modules/notification").PaginatedNotifications;
            meta: object;
        }>;
        getUnreadCount: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                count: number;
            };
            meta: object;
        }>;
        markAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                notificationId: string;
            };
            output: import("../../modules/notification").NotificationDTO;
            meta: object;
        }>;
        markAllAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                count: number;
                success: boolean;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                notificationId: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        deleteAllRead: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                count: number;
                success: boolean;
            };
            meta: object;
        }>;
        getPreferences: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/notification").NotificationPreferences;
            meta: object;
        }>;
        updatePreferences: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                emailEnabled?: boolean | undefined;
                inAppEnabled?: boolean | undefined;
                digestEnabled?: boolean | undefined;
                digestFrequency?: "monthly" | "daily" | "weekly" | undefined;
                channels?: Record<string, {
                    email?: boolean | undefined;
                    inApp?: boolean | undefined;
                }> | undefined;
            };
            output: import("../../modules/notification").NotificationPreferences;
            meta: object;
        }>;
        unreadCountByCategory: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: Record<import("../../modules/notification/notification.types").NotificationCategoryName, number>;
            meta: object;
        }>;
        getCategoryPreferences: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/notification/notification.types").NotificationCategoryPreferenceDTO[];
            meta: object;
        }>;
        updateCategoryPreference: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                category: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM";
                inAppEnabled?: boolean | undefined;
                emailEnabled?: boolean | undefined;
            };
            output: import("../../modules/notification/notification.types").NotificationCategoryPreferenceDTO;
            meta: object;
        }>;
        getSystemNotifications: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                unreadOnly?: boolean | undefined;
                type?: string | undefined;
                category?: "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM" | undefined;
            };
            output: import("../../modules/notification").PaginatedNotifications;
            meta: object;
        }>;
    }>>;
    analytics: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getUserSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").UserActivitySummary;
            meta: object;
        }>;
        getOrgDashboard: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId?: string | undefined;
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").OrgDashboard;
            meta: object;
        }>;
        getOrgComplianceScore: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").ComplianceScoreReport;
            meta: object;
        }>;
        getComplianceTrends: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                orgId?: string | undefined;
                periods?: number | undefined;
            };
            output: import("../../modules/analytics").ComplianceTrend[];
            meta: object;
        }>;
        getGapAnalysis: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").GapAnalysis;
            meta: object;
        }>;
        getDeadlineAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").DeadlineAlert[];
            meta: object;
        }>;
        getDocumentStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/analytics").DocumentStats;
            meta: object;
        }>;
        generateReport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                orgId?: string | undefined;
                reportType?: "compliance" | "audit" | "executive" | undefined;
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
                includeDetails?: boolean | undefined;
            };
            output: import("../../modules/analytics").GeneratedReport;
            meta: object;
        }>;
        exportData: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                format?: "csv" | "json" | undefined;
                type?: "policies" | "users" | "documents" | "audit" | "queries" | undefined;
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
                orgId?: string | undefined;
            };
            output: import("../../modules/analytics").ExportResult;
            meta: object;
        }>;
        getPlatformOverview: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").PlatformOverview;
            meta: object;
        }>;
        getUserGrowth: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").GrowthMetrics;
            meta: object;
        }>;
        getOrgGrowth: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                dateRange?: {
                    from?: string | undefined;
                    to?: string | undefined;
                    days?: number | undefined;
                } | undefined;
            };
            output: import("../../modules/analytics").GrowthMetrics;
            meta: object;
        }>;
        getDailyActiveUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                range?: "last7d" | "last30d" | "last90d" | undefined;
            };
            output: {
                today: number;
                series: Array<{
                    date: string;
                    dau: number;
                }>;
            };
            meta: object;
        }>;
        getQueriesPerUser: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
                range?: "alltime" | "last7d" | "last30d" | undefined;
            };
            output: {
                total: number;
                last30d: number;
                last7d: number;
                byStatus: {
                    completed: number;
                    processing: number;
                    failed: number;
                };
                lastQueryAt: string | null;
            };
            meta: object;
        }>;
        getFeedbackSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                range?: "last7d" | "last30d" | "last90d" | undefined;
                page?: number | undefined;
                pageSize?: number | undefined;
            };
            output: {
                aggregate: {
                    totalVotes: number;
                    upVotes: number;
                    downVotes: number;
                    upPct: number;
                };
                rows: Array<{
                    queryId: string;
                    userId: string;
                    userEmail: string;
                    orgName: string | null;
                    rating: "up" | "down";
                    createdAt: string;
                }>;
                pagination: {
                    page: number;
                    pageSize: number;
                    totalRows: number;
                    totalPages: number;
                };
            };
            meta: object;
        }>;
        getWorkflowEventSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                days?: number | undefined;
                page?: number | undefined;
                pageSize?: number | undefined;
            };
            output: {
                aggregate: {
                    [k: string]: number;
                };
                rows: {
                    id: string;
                    action: string;
                    entityType: string | null;
                    entityId: string | null;
                    metadata: import("@prisma/client/runtime/client").JsonValue;
                    createdAt: Date;
                    userEmail: string | null;
                    userName: string | null;
                }[];
                pagination: {
                    page: number;
                    pageSize: number;
                    totalRows: number;
                    totalPages: number;
                };
            };
            meta: object;
        }>;
    }>>;
    vault: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getUploadLimits: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                maxFileSizeMB: number;
                maxTotalStorageMB: number;
                allowedMimeTypes: readonly string[];
                storageUsedMB: number;
            };
            meta: object;
        }>;
        getUploadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                declaredFilename: string;
                declaredMimeType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/msword" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "text/plain" | "text/csv" | "image/png" | "image/jpeg" | "image/webp";
                declaredSize: number;
                category: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX";
                description?: string | undefined;
                expiryDate?: string | undefined;
                tags?: string[] | undefined;
            };
            output: import("../../modules/vault/vault.types").GenerateUploadUrlResult;
            meta: object;
        }>;
        confirmUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                category?: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX" | undefined;
                status?: "EXPIRED" | "PENDING" | "VERIFIED" | undefined;
                search?: string | undefined;
                sortBy?: "createdAt" | "name" | "fileSize" | "expiryDate" | undefined;
                sortOrder?: "asc" | "desc" | undefined;
            };
            output: import("../../modules/vault").VaultDocumentListResult;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        getDownloadUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                downloadUrl: string;
                filename: string;
                expiresAt: string;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                description?: string | null | undefined;
                category?: "COMPLIANCE" | "OTHER" | "CORPORATE" | "FINANCIAL" | "LICENSE" | "OPERATIONS" | "TAX" | undefined;
                expiryDate?: string | null | undefined;
                tags?: string[] | undefined;
                notes?: string | null | undefined;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        updateStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                status: "EXPIRED" | "PENDING" | "VERIFIED";
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/vault").VaultDocumentStats;
            meta: object;
        }>;
        getReplaceUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                filename: string;
                fileType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/msword" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "text/plain" | "text/csv" | "image/png" | "image/jpeg" | "image/webp";
                fileSize: number;
            };
            output: import("../../modules/vault/vault.types").GenerateUploadUrlResult & {
                currentVersion: number;
                storageKey: string;
            };
            meta: object;
        }>;
        confirmReplace: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentId: string;
                storageKey: string;
                fileName: string;
                fileType: string;
                fileExtension: string;
                fileSize: number;
            };
            output: import("../../modules/vault").VaultDocumentListItem;
            meta: object;
        }>;
    }>>;
    billing: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getPlanAndUsage: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                plan: import("../../types/plan.types").EffectivePlan;
                entitlements: import("../../config").PlanEntitlementConfig;
                usage: {
                    complianceQueries: {
                        current: number;
                        limit: number;
                    };
                    checklistGenerations: {
                        current: number;
                        limit: number;
                    };
                    apiCalls: {
                        current: number;
                        limit: number;
                    };
                    documentStorageMB: {
                        current: number;
                        limit: number;
                    };
                };
                billing: {
                    planStartDate: string | null;
                    planEndDate: string | null;
                    stripeCustomerId: string | null;
                    subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus | null;
                    trialEndsAt: string | null;
                    gracePeriodEndsAt: string | null;
                    cancelledAt: string | null;
                    subscriptionEndsAt: string | null;
                    preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                    mpesaNextPaymentDueDate: string | null;
                    subscriptionCycleEnd: string | null;
                    mpesaPhoneNumber: string | null;
                    homeJurisdictionCode: string | null;
                    enabledJurisdictions: string[];
                    needsCountryConfirmation: boolean;
                    catalogPrice: Record<"BUSINESS" | "STARTUP", {
                        monthly: number;
                        yearly: number;
                        currency: "KES";
                    }>;
                    activePaymentProvider: "INTASEND" | "STRIPE";
                    stripeEnabled: boolean;
                };
                trial: import("../../modules/trial").TrialStatus | null;
                effectivePlanSource: import("../../types/plan.types").EffectivePlanSource;
                appliedOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[];
                pilot: {
                    isPilot: boolean;
                    pilotStatus: "ACTIVE" | "EXPIRED" | "REVOKED" | "CONVERTED";
                    pilotExpiresAt: string | null;
                    pilotExtensionCount: number;
                    entitlementProfile: import("../../types/plan.types").PilotEntitlementProfile;
                } | {
                    isPilot: boolean;
                    pilotStatus: null;
                    pilotExpiresAt: null;
                    pilotExtensionCount: number;
                    entitlementProfile: null;
                };
            };
            meta: object;
        }>;
        getPlanCatalog: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/admin").BillingPlanCatalog;
            meta: object;
        }>;
        createCheckoutSession: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                plan: "STARTER" | "GROWTH" | "BUSINESS" | "STARTUP";
                interval?: "monthly" | "yearly" | undefined;
            };
            output: {
                url: string | null;
            };
            meta: object;
        }>;
        createPortalSession: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                url: string;
            };
            meta: object;
        }>;
        requestEnterprise: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                email: string;
                message?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        updatePaymentMethod: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                provider: "STRIPE" | "MPESA";
                mpesaPhoneNumber?: string | undefined;
            };
            output: {
                preferredPaymentMethod: import(".prisma/client").$Enums.PaymentProvider | null;
                mpesaPhoneNumber: string | null;
            };
            meta: object;
        }>;
        getPlanConversionPreview: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                plan: "FREE" | "STARTER" | "GROWTH" | "BUSINESS" | "ENTERPRISE" | "REGULATOR" | "STARTUP";
                interval?: "monthly" | "yearly" | undefined;
            };
            output: {
                organization: {
                    id: string;
                    name: string;
                    homeJurisdictionCode: string;
                };
                current: {
                    plan: import("../../types/plan.types").EffectivePlan;
                    isPilot: boolean;
                    pilotProfile: import("../../types/plan.types").PilotEntitlementProfile | null;
                    seatsUsed: number;
                    seatsLimit: number;
                    enabledCountries: string[];
                    docStorageMb: number;
                    docCount: number;
                    pendingInvitesCount: number;
                    entitlements: {
                        policyGeneration: boolean;
                        customFrameworks: boolean;
                        complianceQueriesLimit: number;
                        checklistGenerationsLimit: number;
                        teamCollaboration: boolean;
                    };
                };
                target: {
                    plan: "FREE" | "STARTER" | "GROWTH" | "BUSINESS" | "ENTERPRISE" | "REGULATOR" | "STARTUP";
                    interval: "monthly" | "yearly";
                    price: {
                        monthly: number;
                        yearly: number;
                        effective: number;
                        currency: "KES";
                        annualDiscountPercent: number;
                    };
                    seatsLimit: number;
                    countriesLimit: number;
                    docStorageLimitMb: number;
                    entitlements: {
                        policyGeneration: boolean;
                        customFrameworks: boolean;
                        complianceQueriesLimit: number;
                        checklistGenerationsLimit: number;
                        teamCollaboration: boolean;
                    };
                };
                comparison: {
                    isOverSeatCapacity: boolean;
                    excessSeats: number;
                    isOverCountryCapacity: boolean;
                    excessCountries: number;
                    isOverStorageCapacity: boolean;
                    featuresRetained: {
                        policyGeneration: boolean;
                        customFrameworks: boolean;
                        teamCollaboration: boolean;
                    };
                    featuresRestricted: {
                        policyGeneration: boolean;
                        customFrameworks: boolean;
                        teamCollaboration: boolean;
                    };
                };
                activeMembers: {
                    membershipId: string;
                    userId: string;
                    email: string;
                    fullName: string;
                    role: import(".prisma/client").$Enums.MemberRole;
                }[];
                availableJurisdictions: string[];
            };
            meta: object;
        }>;
        initiateMpesaPayment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                plan: "FREE" | "STARTER" | "GROWTH" | "BUSINESS" | "ENTERPRISE" | "REGULATOR" | "STARTUP";
                interval?: "monthly" | "yearly" | undefined;
                phoneNumber?: string | undefined;
                paymentPurpose?: "INITIAL_PURCHASE" | "RENEWAL" | undefined;
                retainedMemberUserIds?: string[] | undefined;
                retainedJurisdictionCodes?: string[] | undefined;
            };
            output: {
                paymentId: string;
                trackingId?: undefined;
                message?: undefined;
            } | {
                paymentId: string;
                trackingId: string;
                message: string;
            };
            meta: object;
        }>;
        getMpesaPaymentStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                paymentId: string;
            };
            output: {
                paymentId: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                updatedAt: string;
            };
            meta: object;
        }>;
        claimPurchaseTelemetry: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                paymentId: string;
            };
            output: {
                success: boolean;
                firstPurchaseTelemetry: boolean;
                recordedAt?: string;
                reason?: "ALREADY_CLAIMED" | "PAYMENT_NOT_COMPLETED" | "PAYMENT_NOT_FOUND";
            };
            meta: object;
        }>;
    }>>;
    payment: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                payments: {
                    id: string;
                    provider: import(".prisma/client").$Enums.PaymentProvider;
                    providerTransactionId: string | null;
                    amount: number;
                    currency: string;
                    status: import(".prisma/client").$Enums.PaymentStatus;
                    paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                    description: string | null;
                    paidAt: string | null;
                    createdAt: string;
                    metadata: Record<string, unknown> | null;
                    invoiceNumber: string | null;
                    subscriptionPlan: string | null;
                    billingPeriodStart: string | null;
                    billingPeriodEnd: string | null;
                }[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                provider: import(".prisma/client").$Enums.PaymentProvider;
                providerTransactionId: string | null;
                amount: number;
                currency: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                description: string | null;
                paidAt: string | null;
                createdAt: string;
                metadata: Record<string, unknown> | null;
                invoiceNumber: string | null;
                subscriptionPlan: string | null;
                billingPeriodStart: string | null;
                billingPeriodEnd: string | null;
            };
            meta: object;
        }>;
        getDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                paymentId: string;
            };
            output: {
                id: string;
                invoiceNumber: string | null;
                amount: number;
                currency: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                paymentPurpose: import(".prisma/client").$Enums.PaymentPurpose | null;
                provider: import(".prisma/client").$Enums.PaymentProvider;
                subscriptionPlan: string | null;
                billingPeriodStart: string | null;
                billingPeriodEnd: string | null;
                providerTransactionId: string | null;
                description: string | null;
                paidAt: string | null;
                createdAt: string;
                metadata: Record<string, unknown> | null;
                paymentMethodDisplay: string;
                organization: {
                    name: string;
                    address: string | null;
                    contactEmail: string | null;
                };
                user: {
                    email: string;
                    fullName: string | null;
                };
            };
            meta: object;
        }>;
    }>>;
    support: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                subject: string;
                description: string;
                category: "ACCOUNT" | "BILLING" | "TECHNICAL" | "COMPLIANCE_QUERY" | "FEATURE_REQUEST" | "OTHER";
                priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
            };
            output: any;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                tickets: any;
                total: any;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getByTicketNumber: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                ticketNumber: string;
            };
            output: any;
            meta: object;
        }>;
        addComment: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ticketId: string;
                message: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    adminSupport: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
                category?: "ACCOUNT" | "BILLING" | "TECHNICAL" | "COMPLIANCE_QUERY" | "FEATURE_REQUEST" | "OTHER" | undefined;
                search?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                tickets: any;
                total: any;
                page: number;
                limit: number;
                totalPages: number;
            };
            meta: object;
        }>;
        getByTicketNumber: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                ticketNumber: string;
            };
            output: any;
            meta: object;
        }>;
        updateStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ticketId: string;
                status: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED";
            };
            output: any;
            meta: object;
        }>;
        addResponse: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ticketId: string;
                message: string;
                updateStatusTo?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
            };
            output: any;
            meta: object;
        }>;
        stats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                open: any;
                inProgress: any;
                awaitingUser: any;
                resolved: any;
                closed: any;
                urgent: any;
            };
            meta: object;
        }>;
    }>>;
    calendar: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                dueDate: string;
                description?: string | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                category?: "RENEWAL" | "CUSTOM" | "FILING" | "AUDIT" | "REVIEW" | "REGULATORY_DEADLINE" | "DOCUMENT_EXPIRY" | "COMPLIANCE_TASK" | undefined;
                regulation?: string | undefined;
                recurrence?: "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | undefined;
                assigneeId?: string | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                month?: number | undefined;
                year?: number | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "OVERDUE" | "UPCOMING" | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord[];
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: import("../../modules/calendar").CalendarEventRecord;
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                description?: string | undefined;
                dueDate?: string | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "OVERDUE" | "UPCOMING" | undefined;
                category?: "RENEWAL" | "CUSTOM" | "FILING" | "AUDIT" | "REVIEW" | "REGULATORY_DEADLINE" | "DOCUMENT_EXPIRY" | "COMPLIANCE_TASK" | undefined;
                regulation?: string | undefined;
                recurrence?: "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | undefined;
                assigneeId?: string | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord;
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
            };
            meta: object;
        }>;
        upcoming: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                daysAhead?: number | undefined;
            };
            output: import("../../modules/calendar").CalendarEventRecord[];
            meta: object;
        }>;
    }>>;
    usage: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        current: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                period: {
                    start: Date;
                    end: Date;
                    daysRemaining: number;
                    daysTotal: number;
                };
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            };
            meta: object;
        }>;
        history: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                months?: number | undefined;
            };
            output: {
                periodId: string;
                periodStart: Date;
                periodEnd: Date;
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            }[];
            meta: object;
        }>;
        compare: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                comparePeriodStart: string;
            };
            output: {
                current: {
                    periodId: string;
                    periodStart: Date;
                    periodEnd: Date;
                    planTier: string;
                    categories: {
                        key: string;
                        label: string;
                        current: number;
                        limit: number;
                        available: boolean;
                        percentUsed: number;
                    }[];
                };
                previous: {
                    periodId: string;
                    periodStart: Date;
                    periodEnd: Date;
                    planTier: string;
                    categories: {
                        key: string;
                        label: string;
                        current: number;
                        limit: number;
                        available: boolean;
                        percentUsed: number;
                    }[];
                };
                changes: {
                    key: string;
                    label: string;
                    currentCount: number;
                    previousCount: number;
                    changePercent: number;
                    direction: "down" | "up" | "same";
                }[];
            };
            meta: object;
        }>;
        periodDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                periodId: string;
            };
            output: {
                periodId: string;
                periodStart: Date;
                periodEnd: Date;
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            };
            meta: object;
        }>;
    }>>;
    trial: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        activate: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: import("../../modules/trial").TrialStatus;
            meta: object;
        }>;
        status: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/trial").TrialStatus;
            meta: object;
        }>;
    }>>;
    session: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        heartbeat: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                ok: true;
            };
            meta: object;
        }>;
    }>>;
    pilot: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        createPilotTester: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fullName: string;
                email: string;
                organizationId?: unknown;
                organizationName?: unknown;
                homeJurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                role?: "ENTERPRISE" | "STARTUP" | undefined;
                phone?: string | undefined;
                temporaryPassword?: string | undefined;
                pilotDurationDays?: number | undefined;
            };
            output: {
                success: boolean;
                userId: string;
                organizationId: string | null;
                temporaryPasswordExpiresAt: string;
                pilotAccessExpiresAt: string;
                emailDeliveryStatus: "FAILED" | "SENT";
            };
            meta: object;
        }>;
        reissueTemporaryPassword: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: {
                success: boolean;
                temporaryPasswordExpiresAt: string;
                emailDeliveryStatus: "FAILED" | "SENT";
            };
            meta: object;
        }>;
        extendPilotAccess: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                extensionDays: number;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
                pilotAccessExpiresAt: string;
                pilotExtensionCount: any;
            };
            meta: object;
        }>;
        revokePilotAccess: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                total: number;
                active: number;
                expired: number;
                converted: number;
                totalEvents: number;
                cohorts: string[];
            };
            meta: object;
        }>;
        listTesters: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                email: string;
                fullName: string;
                organization: string | null;
                cohort: string | null;
                pilotStartedAt: string | null;
                pilotExpiresAt: string | null;
                pilotConvertedAt: string | null;
                pilotAccessStatus: any;
                pilotExtensionCount: any;
                pilotFirstExtensionGrantedAt: any;
                pilotSecondExtensionGrantedAt: any;
                status: string;
                daysRemaining: number;
                daysSinceStart: number;
                engagementScore: number;
                engagementPercent: number;
                totalEvents: number;
                lastEventAt: string;
                eventsByAction: Record<string, number>;
            }[];
            meta: object;
        }>;
    }>>;
    checklist: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        generateChecklist: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productType: string;
                businessStage: string;
                targetSegments: string[];
                servicesOffered: string[];
                additionalConcerns?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                status: string;
                checklistData: import("../../lib/ai/prompts/checklist-generation").GeneratedChecklist;
                itemProgress: Record<string, string>;
                progress: number;
                createdAt: Date;
            };
            meta: object;
        }>;
        getUserChecklists: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                title: string;
                productType: string | null;
                businessStage: string | null;
                targetSegments: unknown;
                servicesOffered: unknown;
                additionalConcerns: string | null;
                progress: number;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                totalItems: number;
                criticalItems: number;
            }[];
            meta: object;
        }>;
        getChecklist: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                title: string;
                productType: string | null;
                businessStage: string | null;
                targetSegments: unknown;
                servicesOffered: unknown;
                additionalConcerns: string | null;
                checklistData: import("../../lib/ai/prompts/checklist-generation").GeneratedChecklist | null;
                itemProgress: Record<string, string>;
                progress: number;
                status: string;
                createdAt: Date;
                updatedAt: Date;
            };
            meta: object;
        }>;
        updateChecklistProgress: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
                itemProgress: Record<string, "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED">;
            };
            output: {
                progress: number;
                itemProgress: Record<string, string>;
            };
            meta: object;
        }>;
        deleteChecklist: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        generateChecklistAsync: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                productType: string;
                businessStage: string;
                targetSegments: string[];
                servicesOffered: string[];
                additionalConcerns?: string | undefined;
            };
            output: import("../../modules/compliance/checklist.types").ChecklistGenerateResult;
            meta: object;
        }>;
        getChecklistStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                checklistId: string;
            };
            output: import("../../modules/compliance/checklist.types").ChecklistStatusResult;
            meta: object;
        }>;
        listChecklists: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../modules/compliance/checklist.types").ChecklistSummary[];
            meta: object;
        }>;
        getChecklistDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                checklistId: string;
            };
            output: import("../../modules/compliance/checklist.types").ChecklistDetail;
            meta: object;
        }>;
        updateChecklistItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
                itemId: string;
                status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "NOT_APPLICABLE";
                notes?: string | undefined;
            };
            output: import("../../modules/compliance/checklist.types").UpdateItemResult;
            meta: object;
        }>;
        getChecklistUsage: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                used: number;
                limit: number;
                period: "month" | "lifetime";
                planName: import("../../types/plan.types").EffectivePlan;
            };
            meta: object;
        }>;
        retryChecklist: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                checklistId: string;
            };
            output: {
                checklistId: string;
                status: "GENERATING";
                retryCount: number;
            };
            meta: object;
        }>;
    }>>;
    complianceDashboard: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getComplianceDashboard: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                overallScore: number;
                trend: {
                    points: number | null;
                    label: "increase" | "decrease" | "no_change" | "insufficient_history";
                    comparedAt: string | null;
                    windowDays: 30;
                };
                categories: Array<{
                    key: string;
                    label: string;
                    score: number;
                    completedItems: number;
                    totalItems: number;
                }>;
                lastUpdated: string;
            };
            meta: object;
        }>;
        updateDashboardItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                itemId: string;
                isCompleted: boolean;
            };
            output: {
                id: string;
                isCompleted: boolean;
                completedAt: Date | null;
            };
            meta: object;
        }>;
        getChecklistByCategory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                category: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_KYC" | "CONSUMER_PROTECTION" | "CBK_LICENSING";
            };
            output: {
                id: string;
                category: string;
                title: string;
                description: string;
                isCompleted: boolean;
                completedAt: Date | null;
                updatedAt: Date;
            }[];
            meta: object;
        }>;
    }>>;
    gapAnalysis: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        getFrameworks: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                slug: string;
                name: string;
                category: string;
                description: string | null;
                tier: string;
                locked: boolean;
            }[];
            meta: object;
        }>;
        runGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fileName: string;
                fileType: "pdf" | "docx" | "doc" | "txt";
                fileContent: string;
                regulatoryFrameworks: string[];
                benchmarkDocumentIds?: string[] | undefined;
                analysisDepth?: "standard" | "quick" | "deep" | undefined;
                focusAreas?: string[] | undefined;
            };
            output: {
                id: string;
                status: string;
                progress: number;
            };
            meta: object;
        }>;
        getGapAnalyses: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                documentName: string;
                documentType: string;
                regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
                analysisDepth: string;
                overallScore: number | null;
                status: string;
                progress: number;
                errorMessage: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            meta: object;
        }>;
        getGapAnalysisResult: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                documentName: string;
                documentType: string;
                documentUrl: string;
                regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
                analysisDepth: string;
                focusAreas: import("@prisma/client/runtime/client").JsonValue | null;
                results: import("../../lib/ai/prompts/gap-analysis").GapAnalysisResult | null;
                overallScore: number | null;
                status: string;
                progress: number;
                errorMessage: string | null;
                ragGrounded: boolean;
                chunksProcessed: number;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                userName: string | null;
                organizationName: string | null;
            };
            meta: object;
        }>;
        getGapAnalysisLimits: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                maxFileSizeMB: number;
            };
            meta: object;
        }>;
        deleteGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    framework: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                includeInactive?: boolean | undefined;
            } | undefined;
            output: any[];
            meta: object;
        }>;
        getBySlug: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                slug: string;
            };
            output: {
                id: string;
                slug: string;
                name: string;
                description: string | null;
                category: string;
                tier: string;
                isActive: boolean;
                version: string | null;
                documentCount: number;
                isCustom: boolean;
                organizationId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            meta: object;
        }>;
    }>>;
    alert: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        createStreamToken: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                token: string;
                expiresInSeconds: number;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                summary: string;
                body: string;
                regulatoryBody: "GAZETTE" | "CBK" | "CMA" | "ODPC" | "CA" | "BNR" | "RURA" | "RISA" | "RWANDA_GAZETTE" | "RBM" | "MACRA" | "MALAWI_GAZETTE";
                category: "DATA_PROTECTION" | "AML_CFT" | "PRUDENTIAL" | "LICENSING" | "CAPITAL_MARKETS" | "GENERAL";
                sourceUrl?: string | undefined;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                effectiveDate?: string | undefined;
                expiresAt?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                severity: string;
                createdAt: Date;
                updatedAt: Date;
                expiresAt: Date | null;
                effectiveDate: Date | null;
                regulatoryBody: string;
                summary: string;
                category: string;
                publishedAt: Date;
                jurisdictionCode: string;
                isActive: boolean;
                body: string;
                sourceUrl: string | null;
                publishedById: string;
                primaryRegulatorySourceItemId: string | null;
                automationDraftKey: string | null;
            };
            meta: object;
        }>;
        publish: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                alertId: string;
            };
            output: void;
            meta: object;
        }>;
        getAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                regulatoryBody?: "GAZETTE" | "CBK" | "CMA" | "ODPC" | "CA" | "BNR" | "RURA" | "RISA" | "RWANDA_GAZETTE" | "RBM" | "MACRA" | "MALAWI_GAZETTE" | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                unreadOnly?: boolean | undefined;
            };
            output: import("../../modules/alert").GetAlertsResult;
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                alertId: string;
            };
            output: import("../../modules/alert").AlertWithReadStatus;
            meta: object;
        }>;
        getUnreadCount: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                count: number;
            };
            meta: object;
        }>;
        markAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                notificationId: string;
            };
            output: void;
            meta: object;
        }>;
        markAllAsRead: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: void;
            meta: object;
        }>;
        upsertSubscription: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                regulatoryBodies: ("GAZETTE" | "CBK" | "CMA" | "ODPC" | "CA" | "BNR" | "RURA" | "RISA" | "RWANDA_GAZETTE" | "RBM" | "MACRA" | "MALAWI_GAZETTE")[];
                categories: ("DATA_PROTECTION" | "AML_CFT" | "PRUDENTIAL" | "LICENSING" | "CAPITAL_MARKETS" | "GENERAL")[];
                severityThreshold: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
                emailEnabled: boolean;
                inAppEnabled: boolean;
                emailFrequency: "REALTIME" | "DAILY" | "WEEKLY";
                jurisdictions?: ("KE" | "MW" | "RW" | "NG")[] | undefined;
            };
            output: {
                emailFrequency: string;
                id: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                jurisdictions: string[];
                inAppEnabled: boolean;
                emailEnabled: boolean;
                regulatoryBodies: string[];
                categories: string[];
                severityThreshold: string;
            };
            meta: object;
        }>;
        getSubscription: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                emailFrequency: string;
                id: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                jurisdictions: string[];
                inAppEnabled: boolean;
                emailEnabled: boolean;
                regulatoryBodies: string[];
                categories: string[];
                severityThreshold: string;
            } | null;
            meta: object;
        }>;
        updateDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                alertId: string;
                title?: string | undefined;
                summary?: string | undefined;
                body?: string | undefined;
                sourceUrl?: string | undefined;
                category?: "DATA_PROTECTION" | "AML_CFT" | "PRUDENTIAL" | "LICENSING" | "CAPITAL_MARKETS" | "GENERAL" | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                effectiveDate?: string | undefined;
                expiresAt?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                severity: string;
                createdAt: Date;
                updatedAt: Date;
                expiresAt: Date | null;
                effectiveDate: Date | null;
                regulatoryBody: string;
                summary: string;
                category: string;
                publishedAt: Date;
                jurisdictionCode: string;
                isActive: boolean;
                body: string;
                sourceUrl: string | null;
                publishedById: string;
                primaryRegulatorySourceItemId: string | null;
                automationDraftKey: string | null;
            };
            meta: object;
        }>;
        rejectDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                alertId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
                alertId: string;
            };
            meta: object;
        }>;
        getAdminAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                alerts: import(".prisma/client").RegulatoryAlert[];
                total: number;
            };
            meta: object;
        }>;
        getAIBudgetStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("../../lib/ai/gateway/llm-gateway").MonthlyBudgetStatus;
            meta: object;
        }>;
    }>>;
    adminMarketing: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        campaigns: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    status?: "CANCELLED" | "DRAFT" | "FAILED" | "SCHEDULED" | "SENDING" | "SENT" | "PARTIALLY_SENT" | undefined;
                    createdById?: string | undefined;
                    search?: string | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: import(".prisma/client").MarketingCampaign[];
                    total: number;
                };
                meta: object;
            }>;
            getById: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: {
                    id: string;
                    status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    name: string;
                    subject: string;
                    templateKey: "PILOT_INVITATION" | "REGULATOR_ACCESS_PROGRAM" | "PRODUCT_LAUNCH" | "COMPLIANCE_UPDATE" | "WEBINAR_INVITE" | "RESOURCE_DOWNLOAD" | "GENERIC_MARKETING" | "KENYAN_COMPLIANCE_BRIEF";
                    templateVariables: Record<string, unknown>;
                    listId: string;
                };
                output: {
                    id: string;
                    status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    name?: string | undefined;
                    subject?: string | undefined;
                    templateVariables?: Record<string, unknown> | undefined;
                    listId?: string | undefined;
                    scheduledFor?: string | null | undefined;
                };
                output: {
                    id: string;
                    status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            requestSendConfirmation: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    confirmationToken: string;
                    recipientCount: number;
                    estimatedDurationSeconds: number;
                    expiresAt: Date;
                    isAsync: boolean;
                };
                meta: object;
            }>;
            executeSend: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                    confirmationToken: string;
                    confirmedRecipientCount: number;
                };
                output: {
                    campaignId: string;
                    finalStatus: import(".prisma/client").MarketingCampaignStatus;
                    sent: number;
                    skipped: number;
                    failed: number;
                };
                meta: object;
            }>;
            cancel: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            getStats: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    campaignId: string;
                };
                output: import("../../modules/marketing/campaign.service").CampaignStats;
                meta: object;
            }>;
            getRecentSends: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    campaignId: string;
                    take?: number | undefined;
                };
                output: {
                    id: string;
                    contact: {
                        email: string;
                        firstName: string | null;
                        lastName: string | null;
                    };
                    status: import(".prisma/client").$Enums.CampaignSendStatus;
                    errorMessage: string | null;
                    sentAt: Date | null;
                    contactId: string;
                    messageId: string | null;
                    suppressionReason: import(".prisma/client").$Enums.SuppressionReason | null;
                }[];
                meta: object;
            }>;
            getJobStatus: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    remaining: number;
                    id: string;
                    failed: number;
                    status: import(".prisma/client").$Enums.CampaignSendJobStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    startedAt: Date | null;
                    campaignId: string;
                    totalContacts: number;
                    processed: number;
                    succeeded: number;
                    skipped: number;
                } | null;
                meta: object;
            }>;
            duplicate: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    campaignId: string;
                };
                output: {
                    id: string;
                    status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    errorMessage: string | null;
                    subject: string;
                    createdById: string;
                    sentAt: Date | null;
                    listId: string | null;
                    templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                    templateVariables: import("@prisma/client/runtime/client").JsonValue;
                    scheduledFor: Date | null;
                    segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
                    totalRecipients: number;
                    totalSent: number;
                    totalDelivered: number;
                    totalOpened: number;
                    totalClicked: number;
                    totalBounced: number;
                    totalUnsubscribed: number;
                    totalComplained: number;
                    totalSuppressedSkip: number;
                    totalNoConsentSkip: number;
                    totalFailed: number;
                };
                meta: object;
            }>;
        }>>;
        contacts: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    search?: string | undefined;
                    consentStatus?: "REVOKED" | "PENDING" | "GRANTED" | undefined;
                    suppressed?: boolean | undefined;
                    companyId?: string | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        company: {
                            id: string;
                            name: string;
                        } | null;
                    } & {
                        id: string;
                        email: string;
                        phone: string | null;
                        role: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        tags: string[];
                        notes: string | null;
                        createdById: string;
                        salesStage: import(".prisma/client").$Enums.SalesStage;
                        companyId: string | null;
                        firstName: string | null;
                        lastName: string | null;
                        primaryRegulator: string | null;
                        linkedinUrl: string | null;
                        lastContactedAt: Date | null;
                        nextFollowUpAt: Date | null;
                        consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                        consentSource: string | null;
                        consentTimestamp: Date | null;
                        suppressedAt: Date | null;
                        suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                        lastEmailedAt: Date | null;
                        lastEmailOpenedAt: Date | null;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
            getById: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: {
                    company: {
                        id: string;
                        name: string;
                    } | null;
                    consentRecords: {
                        metadata: import("@prisma/client/runtime/client").JsonValue | null;
                        id: string;
                        ipAddress: string | null;
                        userAgent: string | null;
                        action: import(".prisma/client").$Enums.ConsentAction;
                        source: string;
                        contactId: string;
                        occurredAt: Date;
                    }[];
                } & {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    tags: string[];
                    notes: string | null;
                    createdById: string;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
                    linkedinUrl: string | null;
                    lastContactedAt: Date | null;
                    nextFollowUpAt: Date | null;
                    consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                    consentSource: string | null;
                    consentTimestamp: Date | null;
                    suppressedAt: Date | null;
                    suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                    lastEmailedAt: Date | null;
                    lastEmailOpenedAt: Date | null;
                };
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                    firstName?: string | undefined;
                    lastName?: string | undefined;
                    phone?: string | undefined;
                    role?: string | undefined;
                    companyId?: string | undefined;
                    grantConsent?: boolean | undefined;
                };
                output: {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    tags: string[];
                    notes: string | null;
                    createdById: string;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
                    linkedinUrl: string | null;
                    lastContactedAt: Date | null;
                    nextFollowUpAt: Date | null;
                    consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                    consentSource: string | null;
                    consentTimestamp: Date | null;
                    suppressedAt: Date | null;
                    suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                    lastEmailedAt: Date | null;
                    lastEmailOpenedAt: Date | null;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    firstName?: string | null | undefined;
                    lastName?: string | null | undefined;
                    phone?: string | null | undefined;
                    role?: string | null | undefined;
                    companyId?: string | null | undefined;
                };
                output: {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    tags: string[];
                    notes: string | null;
                    createdById: string;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
                    linkedinUrl: string | null;
                    lastContactedAt: Date | null;
                    nextFollowUpAt: Date | null;
                    consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                    consentSource: string | null;
                    consentTimestamp: Date | null;
                    suppressedAt: Date | null;
                    suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                    lastEmailedAt: Date | null;
                    lastEmailOpenedAt: Date | null;
                };
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            bulkImport: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    contacts: {
                        email: string;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        phone?: string | undefined;
                        role?: string | undefined;
                        companyName?: string | undefined;
                    }[];
                    grantConsent?: boolean | undefined;
                };
                output: {
                    created: number;
                    updated: number;
                    skipped: number;
                    errors: {
                        email: string;
                        error: string;
                    }[];
                };
                meta: object;
            }>;
            recordConsent: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    contactId: string;
                    action: "REVOKED" | "GRANTED" | "UPDATED" | "IMPORTED_LEGITIMATE_INTEREST";
                    source: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            getEmailHistory: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    contactId: string;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        send: {
                            status: import(".prisma/client").$Enums.CampaignSendStatus;
                            sentAt: Date | null;
                            campaignId: string;
                        } | null;
                    } & {
                        id: string;
                        eventType: import(".prisma/client").$Enums.EmailEventType;
                        messageId: string | null;
                        sendId: string | null;
                        eventData: import("@prisma/client/runtime/client").JsonValue;
                        occurredAt: Date;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
        }>>;
        lists: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        _count: {
                            memberships: number;
                        };
                    } & {
                        id: string;
                        description: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        name: string;
                        createdById: string;
                        isDynamic: boolean;
                        filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
            getById: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: {
                    _count: {
                        memberships: number;
                    };
                    memberships: ({
                        contact: {
                            id: string;
                            email: string;
                            firstName: string | null;
                            lastName: string | null;
                        };
                    } & {
                        listId: string;
                        contactId: string;
                        addedAt: Date;
                        addedById: string;
                    })[];
                } & {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    createdById: string;
                    isDynamic: boolean;
                    filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                };
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    name: string;
                    description?: string | undefined;
                    isDynamic?: boolean | undefined;
                    filterCriteria?: Record<string, unknown> | undefined;
                };
                output: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    createdById: string;
                    isDynamic: boolean;
                    filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    name?: string | undefined;
                    description?: string | null | undefined;
                    filterCriteria?: Record<string, unknown> | undefined;
                };
                output: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    createdById: string;
                    isDynamic: boolean;
                    filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
                };
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            addMembers: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    listId: string;
                    contactIds: string[];
                };
                output: {
                    added: number;
                    skipped: number;
                };
                meta: object;
            }>;
            removeMembers: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    listId: string;
                    contactIds: string[];
                };
                output: {
                    removed: number;
                };
                meta: object;
            }>;
            previewDynamic: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    filterCriteria: Record<string, unknown>;
                };
                output: {
                    count: number;
                    sample: {
                        id: string;
                        email: string;
                        firstName: string | null;
                        lastName: string | null;
                    }[];
                };
                meta: object;
            }>;
            getMembers: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    listId: string;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: ({
                        contact: {
                            id: string;
                            email: string;
                            firstName: string | null;
                            lastName: string | null;
                            consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                            suppressedAt: Date | null;
                        };
                    } & {
                        listId: string;
                        contactId: string;
                        addedAt: Date;
                        addedById: string;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
        }>>;
        suppression: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    reason?: "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "MANUAL" | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                };
                output: {
                    items: {
                        metadata: import("@prisma/client/runtime/client").JsonValue | null;
                        id: string;
                        email: string;
                        reason: import(".prisma/client").$Enums.SuppressionReason;
                        addedAt: Date;
                        addedById: string | null;
                    }[];
                    total: number;
                };
                meta: object;
            }>;
            add: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                    reason: "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "MANUAL";
                    note?: string | undefined;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            remove: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    email: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            check: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    email: string;
                };
                output: {
                    isSuppressed: boolean;
                    reason: import(".prisma/client").$Enums.SuppressionReason | null;
                    addedAt: Date | null;
                };
                meta: object;
            }>;
        }>>;
        companies: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            list: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    query?: string | undefined;
                    leadStatus?: "CONVERTED" | "APPROVED" | "UNASSESSED" | "DISCOVERED" | "QUALIFIED" | "PENDING_REVIEW" | "REJECTED" | "NURTURE" | "DO_NOT_CONTACT" | undefined;
                    icpTier?: "UNASSESSED" | "TIER_1_CORE_FINTECH" | "TIER_2_HIGH_EXPOSURE" | "TIER_3_ADJACENT" | "NON_ICP" | undefined;
                    salesStage?: "PROSPECT" | "LEAD_QUALIFIED" | "OUTREACH_PENDING" | "CONTACTED" | "ENGAGED" | "MEETING_SCHEDULED" | "DEMO_COMPLETED" | "TRIAL_ACTIVE" | "PILOT_ACTIVE" | "OPPORTUNITY" | "CLOSED_WON" | "CLOSED_LOST" | "DISQUALIFIED" | "UNRESPONSIVE" | undefined;
                    origin?: "MANUAL_CRM" | "AI_DISCOVERY" | "PILOT_APPLICATION" | "CONTACT_IMPORT" | "INBOUND_LEAD" | undefined;
                    country?: string | undefined;
                    minScore?: number | undefined;
                    maxScore?: number | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "name" | "leadScore" | undefined;
                    orderDir?: "asc" | "desc" | undefined;
                } | undefined;
                output: {
                    items: ({
                        _count: {
                            evidence: number;
                            contacts: number;
                        };
                        reviewedBy: {
                            id: string;
                            email: string;
                            fullName: string;
                        } | null;
                        owner: {
                            id: string;
                            email: string;
                            fullName: string;
                        } | null;
                    } & {
                        origin: import(".prisma/client").$Enums.CompanyOrigin;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        name: string;
                        industry: string | null;
                        confidence: number | null;
                        regulatoryBody: string | null;
                        notes: string | null;
                        domain: string | null;
                        reviewedAt: Date | null;
                        createdById: string;
                        regulatorMix: string[];
                        leadStatus: import(".prisma/client").$Enums.LeadStatus;
                        salesStage: import(".prisma/client").$Enums.SalesStage;
                        icpTier: import(".prisma/client").$Enums.IcpTier;
                        leadScore: number | null;
                        sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                        country: string;
                        licenceType: string | null;
                        licenceNumber: string | null;
                        licenceStatus: string | null;
                        primarySourceUrl: string | null;
                        primarySourceAuthority: string | null;
                        discoveredAt: Date | null;
                        lastVerifiedAt: Date | null;
                        reviewReason: string | null;
                        rejectionReason: string | null;
                        ownerId: string | null;
                        reviewedById: string | null;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
            getById: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    id: string;
                };
                output: {
                    _count: {
                        evidence: number;
                        contacts: number;
                    };
                    reviewedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    owner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidence: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        confidence: number;
                        retrievedAt: Date;
                        sourceUrl: string;
                        verificationState: import(".prisma/client").$Enums.EvidenceVerificationState;
                        companyId: string;
                        discoveryRunId: string | null;
                        field: string;
                        extractedValue: string;
                        normalizedValue: string | null;
                        sourceAuthority: string | null;
                        sourceRecordId: string | null;
                        evidenceSnippet: string | null;
                        evidenceHash: string;
                        extractionMethod: string | null;
                        modelProvider: string | null;
                        modelName: string | null;
                        extractorVersion: string | null;
                    }[];
                    contacts: {
                        id: string;
                        email: string;
                        phone: string | null;
                        role: string | null;
                        createdAt: Date;
                        salesStage: import(".prisma/client").$Enums.SalesStage;
                        firstName: string | null;
                        lastName: string | null;
                        linkedinUrl: string | null;
                        consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                    }[];
                    discoveryRuns: ({
                        discoveryRun: {
                            id: string;
                            startedAt: Date;
                            sourceAuthority: string;
                            workflowName: string;
                        };
                    } & {
                        id: string;
                        createdAt: Date;
                        action: string;
                        reason: string | null;
                        companyId: string;
                        discoveryRunId: string;
                        scoreAtRun: number | null;
                        icpTierAtRun: import(".prisma/client").$Enums.IcpTier | null;
                        leadStatusAtRun: import(".prisma/client").$Enums.LeadStatus | null;
                    })[];
                } & {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            create: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    name: string;
                    domain?: string | null | undefined;
                    industry?: string | null | undefined;
                    country?: string | undefined;
                    regulatorMix?: string[] | undefined;
                    regulatoryBody?: string | null | undefined;
                    licenceType?: string | null | undefined;
                    licenceNumber?: string | null | undefined;
                    licenceStatus?: string | null | undefined;
                    notes?: string | null | undefined;
                    ownerId?: string | null | undefined;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            update: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                    name?: string | undefined;
                    domain?: string | null | undefined;
                    industry?: string | null | undefined;
                    country?: string | undefined;
                    regulatorMix?: string[] | undefined;
                    regulatoryBody?: string | null | undefined;
                    licenceType?: string | null | undefined;
                    licenceNumber?: string | null | undefined;
                    licenceStatus?: string | null | undefined;
                    notes?: string | null | undefined;
                    leadStatus?: "CONVERTED" | "APPROVED" | "UNASSESSED" | "DISCOVERED" | "QUALIFIED" | "PENDING_REVIEW" | "REJECTED" | "NURTURE" | "DO_NOT_CONTACT" | undefined;
                    salesStage?: "PROSPECT" | "LEAD_QUALIFIED" | "OUTREACH_PENDING" | "CONTACTED" | "ENGAGED" | "MEETING_SCHEDULED" | "DEMO_COMPLETED" | "TRIAL_ACTIVE" | "PILOT_ACTIVE" | "OPPORTUNITY" | "CLOSED_WON" | "CLOSED_LOST" | "DISQUALIFIED" | "UNRESPONSIVE" | undefined;
                    icpTier?: "UNASSESSED" | "TIER_1_CORE_FINTECH" | "TIER_2_HIGH_EXPOSURE" | "TIER_3_ADJACENT" | "NON_ICP" | undefined;
                    leadScore?: number | null | undefined;
                    sizeClass?: "ENTERPRISE" | "MEDIUM" | "UNKNOWN" | "MICRO" | "SMALL" | "LARGE" | undefined;
                    ownerId?: string | null | undefined;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            delete: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    id: string;
                };
                output: {
                    success: boolean;
                };
                meta: object;
            }>;
            merge: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    primaryCompanyId: string;
                    secondaryCompanyId: string;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
        }>>;
        leads: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            listReviewQueue: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    leadStatus?: "CONVERTED" | "APPROVED" | "UNASSESSED" | "DISCOVERED" | "QUALIFIED" | "PENDING_REVIEW" | "REJECTED" | "NURTURE" | "DO_NOT_CONTACT" | undefined;
                    icpTier?: "UNASSESSED" | "TIER_1_CORE_FINTECH" | "TIER_2_HIGH_EXPOSURE" | "TIER_3_ADJACENT" | "NON_ICP" | undefined;
                    country?: string | undefined;
                    take?: number | undefined;
                    skip?: number | undefined;
                } | undefined;
                output: {
                    items: ({
                        _count: {
                            evidence: number;
                            contacts: number;
                        };
                        reviewedBy: {
                            id: string;
                            email: string;
                            fullName: string;
                        } | null;
                        owner: {
                            id: string;
                            email: string;
                            fullName: string;
                        } | null;
                    } & {
                        origin: import(".prisma/client").$Enums.CompanyOrigin;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        name: string;
                        industry: string | null;
                        confidence: number | null;
                        regulatoryBody: string | null;
                        notes: string | null;
                        domain: string | null;
                        reviewedAt: Date | null;
                        createdById: string;
                        regulatorMix: string[];
                        leadStatus: import(".prisma/client").$Enums.LeadStatus;
                        salesStage: import(".prisma/client").$Enums.SalesStage;
                        icpTier: import(".prisma/client").$Enums.IcpTier;
                        leadScore: number | null;
                        sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                        country: string;
                        licenceType: string | null;
                        licenceNumber: string | null;
                        licenceStatus: string | null;
                        primarySourceUrl: string | null;
                        primarySourceAuthority: string | null;
                        discoveredAt: Date | null;
                        lastVerifiedAt: Date | null;
                        reviewReason: string | null;
                        rejectionReason: string | null;
                        ownerId: string | null;
                        reviewedById: string | null;
                    })[];
                    total: number;
                };
                meta: object;
            }>;
            getReviewDetail: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    companyId: string;
                };
                output: {
                    _count: {
                        evidence: number;
                        contacts: number;
                    };
                    reviewedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    owner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidence: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        confidence: number;
                        retrievedAt: Date;
                        sourceUrl: string;
                        verificationState: import(".prisma/client").$Enums.EvidenceVerificationState;
                        companyId: string;
                        discoveryRunId: string | null;
                        field: string;
                        extractedValue: string;
                        normalizedValue: string | null;
                        sourceAuthority: string | null;
                        sourceRecordId: string | null;
                        evidenceSnippet: string | null;
                        evidenceHash: string;
                        extractionMethod: string | null;
                        modelProvider: string | null;
                        modelName: string | null;
                        extractorVersion: string | null;
                    }[];
                    contacts: {
                        id: string;
                        email: string;
                        phone: string | null;
                        role: string | null;
                        createdAt: Date;
                        salesStage: import(".prisma/client").$Enums.SalesStage;
                        firstName: string | null;
                        lastName: string | null;
                        linkedinUrl: string | null;
                        consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                    }[];
                    discoveryRuns: ({
                        discoveryRun: {
                            id: string;
                            startedAt: Date;
                            sourceAuthority: string;
                            workflowName: string;
                        };
                    } & {
                        id: string;
                        createdAt: Date;
                        action: string;
                        reason: string | null;
                        companyId: string;
                        discoveryRunId: string;
                        scoreAtRun: number | null;
                        icpTierAtRun: import(".prisma/client").$Enums.IcpTier | null;
                        leadStatusAtRun: import(".prisma/client").$Enums.LeadStatus | null;
                    })[];
                } & {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            approveLead: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    companyId: string;
                    reviewReason?: string | undefined;
                    addToListId?: string | undefined;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            rejectLead: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    companyId: string;
                    rejectionReason: string;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            nurtureLead: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    companyId: string;
                    reason?: string | undefined;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            requestResearch: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    companyId: string;
                    researchNotes: string;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
            doNotContact: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    companyId: string;
                    reason?: string | undefined;
                };
                output: {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                };
                meta: object;
            }>;
        }>>;
    }>>;
    publicMarketing: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        validateUnsubscribeToken: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                token: string;
            };
            output: {
                valid: false;
                email: null;
            } | {
                valid: true;
                email: string;
            };
            meta: object;
        }>;
        unsubscribe: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                token: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        applyForPilot: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                firstName: string;
                lastName: string;
                email: string;
                companyName: string;
                jobTitle: string;
                phone?: string | undefined;
                message?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        subscribeBlogNewsletter: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                sourcePage?: string | undefined;
                readerSessionId?: string | undefined;
                privacyPolicyVersion?: string | undefined;
                spamTrap?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
    }>>;
    enterprisePolicy: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        createDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyType: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_CFT" | "CONSUMER_PROTECTION" | "CUSTOM" | "IT_SECURITY";
                title: string;
                regulatoryFrameworks: string[];
                description?: string | undefined;
                targetAudience?: string | undefined;
                organizationType?: string | undefined;
                jurisdiction?: string | undefined;
                sourceGapAnalysisId?: string | undefined;
                sourceGapId?: string | undefined;
            };
            output: {
                policyId: string;
                status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                title: string;
                policyType: string;
                jobId: string;
                createdAt: Date;
            };
            meta: object;
        }>;
        getStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                policyId: string;
                job: {
                    id: string;
                    status: string;
                    updatedAt: Date;
                    attempts: number;
                    maxAttempts: number;
                    lastError: string | null;
                    events: {
                        type: string;
                        message: string | null;
                        createdAt: Date;
                        progress: number | null;
                    }[];
                } | null;
                jobId: {} | null;
                status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                progress: number;
                title: string;
                currentStage: string;
                isComplete: boolean;
                isFailed: boolean;
                errorMessage: string | null;
                updatedAt: Date;
            };
            meta: object;
        }>;
        getPolicy: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                citations: {
                    id: string;
                    createdAt: Date;
                    actName: string;
                    section: string;
                    subsection: string | null;
                    textSnippet: string;
                    confidence: string;
                    verified: boolean;
                    rawSource: import("@prisma/client/runtime/client").JsonValue | null;
                    sectionId: string;
                    generatedPolicyId: string;
                    citationVerified: boolean | null;
                    sourceSnapshotId: string | null;
                }[];
                sourceGapAnalysis: {
                    id: string;
                    documentName: string;
                    regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
                    overallScore: number | null;
                } | null;
            } & {
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
            };
            meta: object;
        }>;
        listPolicies: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "COMPLETED" | "FAILED" | "ARCHIVED" | "INITIALIZING" | "OUTLINING" | "DRAFTING" | "REVIEWING" | undefined;
                policyType?: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_CFT" | "CONSUMER_PROTECTION" | "CUSTOM" | "IT_SECURITY" | undefined;
                cursor?: string | undefined;
                limit?: number | undefined;
            };
            output: {
                items: {
                    id: string;
                    title: string;
                    description: string | null;
                    status: import(".prisma/client").$Enums.GeneratedPolicyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    version: number;
                    progress: number;
                    completedAt: Date | null;
                    regulatoryFrameworks: string[];
                    jurisdiction: string;
                    policyType: string;
                    sourceGapAnalysisId: string | null;
                    lastExportedAt: Date | null;
                    lastExportFormat: string | null;
                }[];
                nextCursor: string | undefined;
                totalEstimate: number;
            };
            meta: object;
        }>;
        updateSectionContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
                sectionId: string;
                content: any;
                contentMarkdown?: string | undefined;
            };
            output: {
                success: boolean;
                section: {
                    id: string;
                    title?: string;
                    content?: unknown;
                    contentMarkdown?: string;
                    status?: string;
                    wordCount?: number;
                    editedAt?: string;
                    editedByUserId?: string;
                } | undefined;
                version: number;
                updatedAt: Date;
            };
            meta: object;
        }>;
        updateSectionStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
                sectionId: string;
                status: "DRAFT" | "APPROVED" | "REVIEWED" | "NEEDS_REVISION";
            };
            output: {
                success: boolean;
                section: {
                    id: string;
                    title?: string;
                    content?: unknown;
                    contentMarkdown?: string;
                    status?: string;
                    wordCount?: number;
                    editedAt?: string;
                    editedByUserId?: string;
                } | undefined;
                version: number;
                updatedAt: Date;
            };
            meta: object;
        }>;
        getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                policyId: string;
            };
            output: {
                sectionTitle: string;
                editedByName: string;
                id: string;
                createdAt: Date;
                version: number;
                sectionId: string;
                previousStatus: string | null;
                newStatus: string | null;
                editedByUserId: string;
            }[];
            meta: object;
        }>;
        deletePolicy: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        exportPolicy: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                policyId: string;
                format: "PDF" | "DOCX";
            };
            output: {
                downloadUrl: string;
                filename: string;
                expiresAt: string;
            };
            meta: object;
        }>;
    }>>;
    application: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "REJECTED" | "AWAITING_FEEDBACK" | undefined;
                search?: string | undefined;
            };
            output: {
                applications: ({
                    _count: {
                        timelineEvents: number;
                        documents: number;
                        fees: number;
                        regulatorFeedback: number;
                    };
                } & {
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
                })[];
                stats: {
                    total: number;
                    inProgress: number;
                    submitted: number;
                    approved: number;
                };
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: ({
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                };
                timelineEvents: {
                    id: string;
                    title: string;
                    description: string | null;
                    userId: string;
                    createdAt: Date;
                    applicationId: string;
                    eventDate: Date;
                    completed: boolean;
                }[];
                documents: {
                    id: string;
                    userId: string;
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    applicationId: string;
                    vaultDocumentId: string | null;
                    notes: string | null;
                    uploadedAt: Date | null;
                }[];
                fees: {
                    id: string;
                    description: string;
                    userId: string;
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    applicationId: string;
                    amount: number;
                    currency: string;
                    paidAt: Date | null;
                }[];
                regulatorFeedback: {
                    message: string;
                    id: string;
                    userId: string;
                    createdAt: Date;
                    dueDate: Date | null;
                    applicationId: string;
                    fromName: string | null;
                    actionRequired: boolean;
                    receivedAt: Date;
                }[];
            } & {
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
            }) | null;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                regulator: string;
                licenseType: string;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "REJECTED" | "AWAITING_FEEDBACK" | undefined;
                progress?: number | undefined;
                referenceNumber?: string | undefined;
                nextAction?: string | undefined;
                dueDate?: Date | undefined;
            };
            output: {
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
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                regulator?: string | undefined;
                licenseType?: string | undefined;
                status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "REJECTED" | "AWAITING_FEEDBACK" | undefined;
                progress?: number | undefined;
                referenceNumber?: string | undefined;
                nextAction?: string | undefined;
                dueDate?: Date | undefined;
                submittedAt?: Date | null | undefined;
                decidedAt?: Date | null | undefined;
            };
            output: {
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
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        addTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                title: string;
                description?: string | undefined;
                eventDate?: Date | undefined;
                completed?: boolean | undefined;
            };
            output: {
                id: string;
                title: string;
                description: string | null;
                userId: string;
                createdAt: Date;
                applicationId: string;
                eventDate: Date;
                completed: boolean;
            };
            meta: object;
        }>;
        addDocument: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                name: string;
                status?: "APPROVED" | "UPLOADED" | "REJECTED" | "REQUIRED" | undefined;
                vaultDocumentId?: string | undefined;
                notes?: string | undefined;
                uploadedAt?: Date | null | undefined;
            };
            output: {
                id: string;
                userId: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                applicationId: string;
                vaultDocumentId: string | null;
                notes: string | null;
                uploadedAt: Date | null;
            };
            meta: object;
        }>;
        addFee: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                description: string;
                amount: number;
                currency?: string | undefined;
                status?: "PENDING" | "WAIVED" | "PAID" | undefined;
                paidAt?: Date | null | undefined;
            };
            output: {
                id: string;
                description: string;
                userId: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                applicationId: string;
                amount: number;
                currency: string;
                paidAt: Date | null;
            };
            meta: object;
        }>;
        addRegulatorFeedback: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                applicationId: string;
                message: string;
                fromName?: string | undefined;
                actionRequired?: boolean | undefined;
                dueDate?: Date | null | undefined;
                receivedAt?: Date | undefined;
            };
            output: {
                message: string;
                id: string;
                userId: string;
                createdAt: Date;
                dueDate: Date | null;
                applicationId: string;
                fromName: string | null;
                actionRequired: boolean;
                receivedAt: Date;
            };
            meta: object;
        }>;
    }>>;
    license: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                search?: string | undefined;
                includeArchived?: boolean | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                licenses: ({
                    id: string;
                    status: import(".prisma/client").$Enums.LicenseStatus;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    _count: {
                        timelineEvents: number;
                        documents: number;
                        fees: number;
                    };
                    regulator: string;
                    licenseType: string;
                    submittedAt: Date | null;
                    notes: string | null;
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseNumber: string | null;
                    issueDate: Date | null;
                    expiryDate: Date | null;
                    renewalDueDate: Date | null;
                    approvedAt: Date | null;
                    assignedOwnerId: string | null;
                    assignedOwner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    derived: {
                        daysUntilExpiry: number | null;
                        daysUntilRenewal: number | null;
                        isExpired: boolean;
                        isRenewalDueSoon: boolean;
                        isRenewalOverdue: boolean;
                    };
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseType: string;
                regulator: string;
                licenseNumber?: string | undefined;
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                issueDate?: string | null | undefined;
                expiryDate?: string | null | undefined;
                renewalDueDate?: string | null | undefined;
                submittedAt?: string | null | undefined;
                approvedAt?: string | null | undefined;
                assignedOwnerId?: string | null | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                licenseType?: string | undefined;
                regulator?: string | undefined;
                licenseNumber?: string | undefined;
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                issueDate?: string | null | undefined;
                expiryDate?: string | null | undefined;
                renewalDueDate?: string | null | undefined;
                submittedAt?: string | null | undefined;
                approvedAt?: string | null | undefined;
                assignedOwnerId?: string | null | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        archive: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        addTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseId: string;
                eventType: string;
                title: string;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "BLOCKED" | undefined;
                assignedToUserId?: string | null | undefined;
                evidenceDocumentId?: string | null | undefined;
                createCalendarEvent?: boolean | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        updateTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                licenseId?: string | undefined;
                eventType?: string | undefined;
                title?: string | undefined;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                status?: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "BLOCKED" | undefined;
                assignedToUserId?: string | null | undefined;
                evidenceDocumentId?: string | null | undefined;
                createCalendarEvent?: boolean | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        completeTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        addDocument: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseId: string;
                vaultDocumentId: string;
                documentType?: string | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        removeDocument: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        addFee: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                licenseId: string;
                amount?: number | null | undefined;
                currency?: string | undefined;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                paidAt?: string | null | undefined;
                status?: "PENDING" | "OVERDUE" | "WAIVED" | "PAID" | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        updateFee: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                licenseId?: string | undefined;
                amount?: number | null | undefined;
                currency?: string | undefined;
                description?: string | undefined;
                dueDate?: string | null | undefined;
                paidAt?: string | null | undefined;
                status?: "PENDING" | "OVERDUE" | "WAIVED" | "PAID" | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        getUpcomingRenewals: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                daysAhead?: number | undefined;
            };
            output: ({
                id: string;
                status: import(".prisma/client").$Enums.LicenseStatus;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                _count: {
                    timelineEvents: number;
                    documents: number;
                    fees: number;
                };
                regulator: string;
                licenseType: string;
                submittedAt: Date | null;
                notes: string | null;
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdByUserId: string;
                updatedByUserId: string | null;
                licenseNumber: string | null;
                issueDate: Date | null;
                expiryDate: Date | null;
                renewalDueDate: Date | null;
                approvedAt: Date | null;
                assignedOwnerId: string | null;
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            })[];
            meta: object;
        }>;
        getDashboardSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                total: number;
                active: number;
                renewalDueSoon: number;
                expired: number;
            };
            meta: object;
        }>;
        adminList: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                search?: string | undefined;
                includeArchived?: boolean | undefined;
                page?: number | undefined;
                limit?: number | undefined;
                organizationId?: string | undefined;
            };
            output: {
                licenses: ({
                    organization: {
                        id: string;
                        name: string;
                        plan: import(".prisma/client").$Enums.SubscriptionPlan;
                    };
                    _count: {
                        timelineEvents: number;
                        documents: number;
                        fees: number;
                    };
                    assignedOwner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                } & {
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
                } & {
                    derived: {
                        daysUntilExpiry: number | null;
                        daysUntilRenewal: number | null;
                        isExpired: boolean;
                        isRenewalDueSoon: boolean;
                        isRenewalOverdue: boolean;
                    };
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminGet: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
                reason?: string | undefined;
            };
            output: {
                organization: {
                    id: string;
                    name: string;
                    plan: import(".prisma/client").$Enums.SubscriptionPlan;
                };
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
        adminOverrideUpdate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
                licenseType?: string | undefined;
                regulator?: string | undefined;
                licenseNumber?: string | undefined;
                status?: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "REVOKED" | "DRAFT" | "ARCHIVED" | "PENDING_RENEWAL" | "SUBMITTED" | "APPROVED" | undefined;
                issueDate?: string | null | undefined;
                expiryDate?: string | null | undefined;
                renewalDueDate?: string | null | undefined;
                submittedAt?: string | null | undefined;
                approvedAt?: string | null | undefined;
                assignedOwnerId?: string | null | undefined;
                notes?: string | undefined;
            };
            output: {
                updatedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                timelineEvents: ({
                    complianceEvent: {
                        id: string;
                        title: string;
                        status: string;
                        category: string;
                        dueDate: Date;
                    } | null;
                    assignedTo: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    evidenceDocument: {
                        id: string;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    } | null;
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    organizationId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    eventType: string;
                    dueDate: Date | null;
                    completedAt: Date | null;
                    createdByUserId: string;
                    updatedByUserId: string | null;
                    licenseId: string;
                    assignedToUserId: string | null;
                    evidenceDocumentId: string | null;
                    complianceEventId: string | null;
                })[];
                documents: ({
                    vaultDocument: {
                        id: string;
                        status: import(".prisma/client").$Enums.VaultDocumentStatus;
                        name: string;
                        category: import(".prisma/client").$Enums.DocumentCategory;
                        fileName: string;
                    };
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
                    id: string;
                    organizationId: string;
                    createdAt: Date;
                    documentType: string | null;
                    vaultDocumentId: string;
                    notes: string | null;
                    createdByUserId: string;
                    licenseId: string;
                })[];
                fees: ({
                    updatedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    createdBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                } & {
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
                })[];
                assignedOwner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
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
            } & {
                derived: {
                    daysUntilExpiry: number | null;
                    daysUntilRenewal: number | null;
                    isExpired: boolean;
                    isRenewalDueSoon: boolean;
                    isRenewalOverdue: boolean;
                };
            };
            meta: object;
        }>;
    }>>;
    customFramework: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | undefined;
            } | undefined;
            output: any;
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                description?: string | null | undefined;
                jurisdiction?: "KE" | "MW" | "RW" | "NG" | null | undefined;
                regulator?: string | null | undefined;
                category?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        updateMetadata: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                description?: string | null | undefined;
                jurisdiction?: "KE" | "MW" | "RW" | "NG" | null | undefined;
                regulator?: string | null | undefined;
                category?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        generate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                intent: string;
            };
            output: any;
            meta: object;
        }>;
        createSection: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                frameworkId: string;
                title: string;
                description?: string | null | undefined;
                order?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        updateSection: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                description?: string | null | undefined;
                order?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        deleteSection: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        createControl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                frameworkId: string;
                title: string;
                requirement: string;
                sectionId?: string | null | undefined;
                code?: string | null | undefined;
                guidance?: string | null | undefined;
                evidenceRequired?: unknown;
                severity?: string | null | undefined;
                frequency?: string | null | undefined;
                regulatorReference?: string | null | undefined;
                order?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        updateControl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                code?: string | null | undefined;
                title?: string | undefined;
                severity?: string | null | undefined;
                guidance?: string | null | undefined;
                order?: number | undefined;
                sectionId?: string | null | undefined;
                requirement?: string | undefined;
                evidenceRequired?: unknown;
                frequency?: string | null | undefined;
                regulatorReference?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        deleteControl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        publish: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        archive: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    enterpriseContract: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        adminList: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                organizationId?: string | undefined;
                status?: string | undefined;
            } | undefined;
            output: any;
            meta: object;
        }>;
        adminGet: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminCreate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                organizationId: string;
                reason: string;
                contractName?: string | null | undefined;
                contractNumber?: string | null | undefined;
                startsAt?: unknown;
                endsAt?: unknown;
                renewalDate?: unknown;
                billingCycle?: string | null | undefined;
                currency?: string | null | undefined;
                monthlyAmount?: number | null | undefined;
                annualAmount?: number | null | undefined;
                notes?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminUpdate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
                organizationId?: string | undefined;
                contractName?: string | null | undefined;
                contractNumber?: string | null | undefined;
                startsAt?: unknown;
                endsAt?: unknown;
                renewalDate?: unknown;
                billingCycle?: string | null | undefined;
                currency?: string | null | undefined;
                monthlyAmount?: number | null | undefined;
                annualAmount?: number | null | undefined;
                notes?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminActivate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminSuspend: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminArchive: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminAddOverride: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contractId: string;
                key: "seats.limit" | "features.customFrameworks" | "features.policyGeneration" | "features.licenseManagement" | "features.complianceCalendar" | "features.gapAnalysis" | "features.benchmarkDocuments" | "limits.complianceQueries.month" | "limits.gapAnalysis.month" | "limits.policyGeneration.month" | "limits.documentUploads.month" | "limits.storageGb" | "limits.customFrameworks.count" | "limits.benchmarkDocuments.count" | "support.tier";
                value: unknown;
                reason: string;
                startsAt?: unknown;
                endsAt?: unknown;
            };
            output: any;
            meta: object;
        }>;
        adminUpdateOverride: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
                contractId?: string | undefined;
                key?: "seats.limit" | "features.customFrameworks" | "features.policyGeneration" | "features.licenseManagement" | "features.complianceCalendar" | "features.gapAnalysis" | "features.benchmarkDocuments" | "limits.complianceQueries.month" | "limits.gapAnalysis.month" | "limits.policyGeneration.month" | "limits.documentUploads.month" | "limits.storageGb" | "limits.customFrameworks.count" | "limits.benchmarkDocuments.count" | "support.tier" | undefined;
                value?: unknown;
                startsAt?: unknown;
                endsAt?: unknown;
            };
            output: any;
            meta: object;
        }>;
        adminDisableOverride: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminPreviewEffectiveEntitlements: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                organizationId: string;
            };
            output: {
                organization: any;
                planDefault: import("../../config").PlanEntitlementConfig;
                effectiveEntitlements: import("../../config").PlanEntitlementConfig;
                appliedOverrides: import("../../modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[];
            };
            meta: object;
        }>;
    }>>;
    corpusGapReport: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        submitReport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                documentName: string;
                issuingAuthority: string;
                documentType: "OTHER" | "CIRCULAR" | "LEGISLATION" | "REGULATION" | "GUIDELINE" | "POLICY" | "STANDARD";
                jurisdiction: "OTHER" | "KENYA" | "MALAWI" | "NIGERIA" | "RWANDA";
                description?: string | undefined;
                sourceUrl?: string | undefined;
            };
            output: {
                outcome: "DUPLICATE";
                reportId: string;
                report?: undefined;
            } | {
                outcome: "CREATED";
                reportId: string;
                report: {
                    id: string;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    createdAt: Date;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    reportedByUser: {
                        email: string;
                        fullName: string;
                    };
                };
            };
            meta: object;
        }>;
        listMyReports: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                reports: {
                    id: string;
                    status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                    createdAt: Date;
                    documentName: string;
                    jurisdiction: import(".prisma/client").$Enums.CorpusGapJurisdiction;
                    resolvedAt: Date | null;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminListReports: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: "UNDER_REVIEW" | "PENDING" | "REJECTED" | "INGESTED" | "DUPLICATE" | undefined;
                jurisdiction?: "OTHER" | "KENYA" | "MALAWI" | "NIGERIA" | "RWANDA" | undefined;
                documentType?: "OTHER" | "CIRCULAR" | "LEGISLATION" | "REGULATION" | "GUIDELINE" | "POLICY" | "STANDARD" | undefined;
            };
            output: {
                reports: {
                    id: string;
                    description: string | null;
                    organization: {
                        id: string;
                        name: string;
                    };
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
                    reportedByUser: {
                        id: string;
                        email: string;
                        fullName: string;
                    };
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminGetReport: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                reportId: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.CorpusGapReportStatus;
                priority: null;
                createdAt: string;
                updatedAt: string;
                resolvedAt: string | null;
                reporter: {
                    userId: string;
                    name: string;
                    email: string;
                };
                organization: {
                    organizationId: string;
                    name: string;
                    type: string;
                    plan: import(".prisma/client").$Enums.SubscriptionPlan;
                };
                query: {
                    queryId: null;
                    question: null;
                    answerPreview: null;
                    status: null;
                    createdAt: null;
                };
                run: {
                    runId: null;
                    route: null;
                    grounded: null;
                    verifierVerdict: null;
                    fallbackReason: null;
                    unsupportedClaims: null;
                    acceptedChunkIds: null;
                    ragSources: null;
                    createdAt: null;
                };
                report: {
                    suggestedDocument: string;
                    notes: string | null;
                    adminNotes: string | null;
                    missingArea: string;
                    sourceUrl: string | null;
                };
                citations: never[];
                recommendedActions: {
                    id: string;
                    label: string;
                    description: string;
                    severity: "info" | "warning" | "critical";
                }[];
            };
            meta: object;
        }>;
        adminUpdateStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                reportId: string;
                status: "UNDER_REVIEW" | "PENDING" | "REJECTED" | "INGESTED" | "DUPLICATE";
                adminNotes?: string | undefined;
            };
            output: {
                id: string;
                description: string | null;
                organization: {
                    id: string;
                    name: string;
                };
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
                reportedByUser: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            };
            meta: object;
        }>;
    }>>;
    blog: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        publicList: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                category?: unknown;
                search?: unknown;
                tag?: unknown;
                page?: number | undefined;
                limit?: number | undefined;
                featured?: boolean | undefined;
            };
            output: {
                posts: {
                    readingTime: number;
                    sourceCount: number;
                    id: string;
                    title: string;
                    updatedAt: Date;
                    category: string;
                    excerpt: string | null;
                    publishedAt: Date | null;
                    slug: string;
                    tags: string[];
                    coverImageUrl: string | null;
                    featured: boolean;
                    lastReviewedAt: Date | null;
                    author: {
                        id: string;
                        fullName: string;
                    };
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        publicGetBySlug: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                slug: string;
            };
            output: {
                readingTime: number;
                author: {
                    id: string;
                    fullName: string;
                };
                sources: {
                    id: string;
                    title: string;
                    url: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    publishedAt: Date | null;
                    notes: string | null;
                    sourceType: import(".prisma/client").$Enums.BlogSourceType;
                    postId: string;
                    publisher: string | null;
                    accessedAt: Date;
                }[];
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.BlogPostStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                authorId: string;
                category: string;
                excerpt: string | null;
                htmlContent: string | null;
                publishedAt: Date | null;
                seoDescription: string | null;
                seoTitle: string | null;
                slug: string;
                tags: string[];
                jurisdiction: string;
                archivedAt: Date | null;
                canonicalUrl: string | null;
                coverImageUrl: string | null;
                featured: boolean;
                relatedRegulations: string[];
                ogImageUrl: string | null;
                reviewerId: string | null;
                updatedById: string | null;
                lastReviewedAt: Date | null;
            };
            meta: object;
        }>;
        getFeatured: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                limit?: number | undefined;
            };
            output: {
                readingTime: number;
                sourceCount: number;
                id: string;
                title: string;
                updatedAt: Date;
                category: string;
                excerpt: string | null;
                publishedAt: Date | null;
                slug: string;
                tags: string[];
                coverImageUrl: string | null;
                featured: boolean;
                lastReviewedAt: Date | null;
                author: {
                    id: string;
                    fullName: string;
                };
            }[];
            meta: object;
        }>;
        publicSlugs: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                updatedAt: Date;
                publishedAt: Date | null;
                slug: string;
            }[];
            meta: object;
        }>;
        publicTaxonomy: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                categories: {
                    name: string;
                    count: number;
                }[];
                tags: {
                    name: string;
                    count: number;
                }[];
            };
            meta: object;
        }>;
        submitFeedback: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                postId: string;
                value: "HELPFUL" | "NOT_HELPFUL";
                reasonCode?: unknown;
                readerSessionId?: unknown;
            };
            output: {
                success: true;
            };
            meta: object;
        }>;
        getPublicFeedbackSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                postId: string;
            };
            output: {
                helpfulCount: number;
                notHelpfulCount: number;
                totalResponses: number;
            };
            meta: object;
        }>;
        submitTopicRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                topic: string;
                category?: unknown;
                jurisdiction?: unknown;
                sourcePage?: unknown;
                contactEmail?: unknown;
                readerSessionId?: unknown;
                spamTrap?: string | undefined;
            };
            output: {
                success: true;
            };
            meta: object;
        }>;
        adminGetEditorialMetricsContract: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                publicTrendingEnabled: boolean;
                aggregationArchitecture: string;
                sources: import("../../modules/blog/editorial-metrics").BlogEditorialMetricSource[];
            };
            meta: object;
        }>;
        adminList: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "IN_REVIEW" | undefined;
                category?: string | undefined;
                search?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                posts: {
                    sourceCount: number;
                    _count: {
                        sources: number;
                    };
                    author: {
                        id: string;
                        fullName: string;
                    };
                    reviewer: {
                        id: string;
                        fullName: string;
                    } | null;
                    id: string;
                    title: string;
                    status: import(".prisma/client").$Enums.BlogPostStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    content: string | null;
                    authorId: string;
                    category: string;
                    excerpt: string | null;
                    htmlContent: string | null;
                    publishedAt: Date | null;
                    seoDescription: string | null;
                    seoTitle: string | null;
                    slug: string;
                    tags: string[];
                    jurisdiction: string;
                    archivedAt: Date | null;
                    canonicalUrl: string | null;
                    coverImageUrl: string | null;
                    featured: boolean;
                    relatedRegulations: string[];
                    ogImageUrl: string | null;
                    reviewerId: string | null;
                    updatedById: string | null;
                    lastReviewedAt: Date | null;
                }[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminGetById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                sources: {
                    id: string;
                    title: string;
                    url: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    publishedAt: Date | null;
                    notes: string | null;
                    sourceType: import(".prisma/client").$Enums.BlogSourceType;
                    postId: string;
                    publisher: string | null;
                    accessedAt: Date;
                }[];
                automationSuggestion: ({
                    sources: ({
                        sourceItem: {
                            monitor: {
                                id: string;
                                description: string | null;
                                status: import(".prisma/client").$Enums.BlogMonitorStatus;
                                createdAt: Date;
                                updatedAt: Date;
                                deletedAt: Date | null;
                                name: string;
                                verificationStatus: string;
                                verifiedAt: Date | null;
                                keywords: string[];
                                notes: string | null;
                                isActive: boolean;
                                jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                                authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                                baseUrl: string;
                                createdById: string | null;
                                sourceType: import(".prisma/client").$Enums.BlogSourceType;
                                lastCheckedAt: Date | null;
                                lastFailureAt: Date | null;
                                failureCount: number;
                                lastFailureReason: string | null;
                                topics: string[];
                                updatedById: string | null;
                                countryLabel: string | null;
                                monitoringMethod: import(".prisma/client").$Enums.BlogMonitoringMethod;
                                feedUrl: string | null;
                                lastRunStatus: import(".prisma/client").$Enums.BlogMonitorLastRunStatus;
                                isOfficial: boolean;
                                lastSuccessfulRunAt: Date | null;
                                maxItemsPerRun: number;
                                fetchTimeoutMs: number;
                                respectRobots: boolean;
                                verifiedById: string | null;
                            };
                        } & {
                            id: string;
                            title: string;
                            url: string;
                            status: import(".prisma/client").$Enums.BlogSourceItemStatus;
                            createdAt: Date;
                            updatedAt: Date;
                            deletedAt: Date | null;
                            summary: string | null;
                            failureReason: string | null;
                            jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                            publicationDate: Date | null;
                            contentHash: string;
                            authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                            sourceType: import(".prisma/client").$Enums.BlogSourceType;
                            discoveredAt: Date;
                            publisher: string | null;
                            monitorId: string;
                            normalizedUrl: string;
                            rawContentHash: string | null;
                            dismissedReason: string | null;
                        };
                    } & {
                        createdAt: Date;
                        sourceItemId: string;
                        suggestionId: string;
                    })[];
                } & {
                    id: string;
                    title: string;
                    status: import(".prisma/client").$Enums.BlogSuggestionStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    targetAudience: string[];
                    summary: string | null;
                    category: string;
                    jurisdictions: import(".prisma/client").$Enums.BlogJurisdiction[];
                    priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
                    jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                    reason: string | null;
                    approvedAt: Date | null;
                    relevanceScore: number;
                    blogPostId: string | null;
                    dismissedReason: string | null;
                    suggestedSlug: string | null;
                    articleType: import(".prisma/client").$Enums.BlogArticleType;
                    sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
                    recommendedTags: string[];
                    suggestedNextAction: string | null;
                    requiresOfficialSource: boolean;
                    requiresHumanReview: boolean;
                    needsMoreSources: boolean;
                    dismissedAt: Date | null;
                    dismissedById: string | null;
                    approvedById: string | null;
                }) | null;
            } & {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.BlogPostStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                authorId: string;
                category: string;
                excerpt: string | null;
                htmlContent: string | null;
                publishedAt: Date | null;
                seoDescription: string | null;
                seoTitle: string | null;
                slug: string;
                tags: string[];
                jurisdiction: string;
                archivedAt: Date | null;
                canonicalUrl: string | null;
                coverImageUrl: string | null;
                featured: boolean;
                relatedRegulations: string[];
                ogImageUrl: string | null;
                reviewerId: string | null;
                updatedById: string | null;
                lastReviewedAt: Date | null;
            };
            meta: object;
        }>;
        adminCreate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                slug?: string | undefined;
                excerpt?: string | undefined;
                category?: string | undefined;
            };
            output: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.BlogPostStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                authorId: string;
                category: string;
                excerpt: string | null;
                htmlContent: string | null;
                publishedAt: Date | null;
                seoDescription: string | null;
                seoTitle: string | null;
                slug: string;
                tags: string[];
                jurisdiction: string;
                archivedAt: Date | null;
                canonicalUrl: string | null;
                coverImageUrl: string | null;
                featured: boolean;
                relatedRegulations: string[];
                ogImageUrl: string | null;
                reviewerId: string | null;
                updatedById: string | null;
                lastReviewedAt: Date | null;
            };
            meta: object;
        }>;
        adminUpdate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                slug?: string | undefined;
                excerpt?: string | null | undefined;
                content?: string | null | undefined;
                coverImageUrl?: string | null | undefined;
                category?: string | undefined;
                tags?: string[] | undefined;
                jurisdiction?: string | undefined;
                relatedRegulations?: string[] | undefined;
                featured?: boolean | undefined;
                seoTitle?: string | null | undefined;
                seoDescription?: string | null | undefined;
                canonicalUrl?: string | null | undefined;
                ogImageUrl?: string | null | undefined;
                reviewerId?: string | null | undefined;
                sources?: {
                    sourceType: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA";
                    title: string;
                    id?: string | undefined;
                    publisher?: string | null | undefined;
                    url?: string | null | undefined;
                    publishedAt?: Date | null | undefined;
                    notes?: string | null | undefined;
                }[] | undefined;
            };
            output: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.BlogPostStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                authorId: string;
                category: string;
                excerpt: string | null;
                htmlContent: string | null;
                publishedAt: Date | null;
                seoDescription: string | null;
                seoTitle: string | null;
                slug: string;
                tags: string[];
                jurisdiction: string;
                archivedAt: Date | null;
                canonicalUrl: string | null;
                coverImageUrl: string | null;
                featured: boolean;
                relatedRegulations: string[];
                ogImageUrl: string | null;
                reviewerId: string | null;
                updatedById: string | null;
                lastReviewedAt: Date | null;
            };
            meta: object;
        }>;
        adminSetStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                status: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "IN_REVIEW";
            };
            output: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.BlogPostStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                authorId: string;
                category: string;
                excerpt: string | null;
                htmlContent: string | null;
                publishedAt: Date | null;
                seoDescription: string | null;
                seoTitle: string | null;
                slug: string;
                tags: string[];
                jurisdiction: string;
                archivedAt: Date | null;
                canonicalUrl: string | null;
                coverImageUrl: string | null;
                featured: boolean;
                relatedRegulations: string[];
                ogImageUrl: string | null;
                reviewerId: string | null;
                updatedById: string | null;
                lastReviewedAt: Date | null;
            };
            meta: object;
        }>;
        adminDelete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.BlogPostStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                content: string | null;
                authorId: string;
                category: string;
                excerpt: string | null;
                htmlContent: string | null;
                publishedAt: Date | null;
                seoDescription: string | null;
                seoTitle: string | null;
                slug: string;
                tags: string[];
                jurisdiction: string;
                archivedAt: Date | null;
                canonicalUrl: string | null;
                coverImageUrl: string | null;
                featured: boolean;
                relatedRegulations: string[];
                ogImageUrl: string | null;
                reviewerId: string | null;
                updatedById: string | null;
                lastReviewedAt: Date | null;
            };
            meta: object;
        }>;
    }>>;
    blogAutomation: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        adminListMonitors: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
                authorityType?: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY" | undefined;
                sourceType?: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | undefined;
                monitoringMethod?: "API" | "MANUAL" | "RSS" | "HTML_LISTING" | undefined;
                status?: "ACTIVE" | "INACTIVE" | "NEEDS_VERIFICATION" | "FAILING" | undefined;
                isActive?: boolean | undefined;
                search?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminGetMonitor: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminCreateMonitor: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                jurisdiction: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL";
                authorityType: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY";
                sourceType: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA";
                baseUrl: string;
                description?: string | null | undefined;
                countryLabel?: string | null | undefined;
                monitoringMethod?: "API" | "MANUAL" | "RSS" | "HTML_LISTING" | undefined;
                feedUrl?: string | null | undefined;
                apiConfig?: {
                    endpoint: string;
                    fieldMapping: {
                        title: string;
                        url: string;
                        publicationDate: string;
                        content?: string | undefined;
                    };
                    headers?: Record<string, string> | undefined;
                    itemsPath?: string | undefined;
                } | null | undefined;
                topics?: string[] | undefined;
                keywords?: string[] | undefined;
                status?: "ACTIVE" | "INACTIVE" | "NEEDS_VERIFICATION" | "FAILING" | undefined;
                isActive?: boolean | undefined;
                maxItemsPerRun?: number | undefined;
                fetchTimeoutMs?: number | undefined;
                respectRobots?: boolean | undefined;
                notes?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminUpdateMonitor: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                description?: string | null | undefined;
                jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
                countryLabel?: string | null | undefined;
                authorityType?: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY" | undefined;
                sourceType?: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | undefined;
                monitoringMethod?: "API" | "MANUAL" | "RSS" | "HTML_LISTING" | undefined;
                baseUrl?: string | undefined;
                feedUrl?: string | null | undefined;
                apiConfig?: {
                    endpoint: string;
                    fieldMapping: {
                        title: string;
                        url: string;
                        publicationDate: string;
                        content?: string | undefined;
                    };
                    headers?: Record<string, string> | undefined;
                    itemsPath?: string | undefined;
                } | null | undefined;
                topics?: string[] | undefined;
                keywords?: string[] | undefined;
                maxItemsPerRun?: number | undefined;
                fetchTimeoutMs?: number | undefined;
                respectRobots?: boolean | undefined;
                notes?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminSetMonitorStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                status: "ACTIVE" | "INACTIVE" | "NEEDS_VERIFICATION" | "FAILING";
                isActive?: boolean | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminVerifyMonitor: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                notes?: string | null | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminDeleteMonitor: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminListSourceItems: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                monitorId?: string | undefined;
                jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
                authorityType?: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY" | undefined;
                sourceType?: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | undefined;
                status?: "DUPLICATE" | "DISMISSED" | "NEW" | "READY_FOR_SCORING" | "SCORED" | "FETCH_FAILED" | "CONVERTED_TO_SUGGESTION" | undefined;
                search?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminGetSourceItem: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminDismissSourceItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminRunMonitorNow: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                monitorId: string;
            };
            output: any;
            meta: object;
        }>;
        adminListDiscoveryRuns: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                monitorId?: string | undefined;
                status?: "FAILED" | "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "SKIPPED_LOCKED" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminScoreSourceItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceItemId: string;
                minScore?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminScoreEligibleSourceItems: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                minScore?: number | undefined;
                limit?: number | undefined;
                jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
                monitorId?: string | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminListSuggestions: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "PENDING_REVIEW" | "DUPLICATE" | "DISMISSED" | "APPROVED_FOR_DRAFT" | "DRAFT_CREATED" | "NEEDS_MORE_SOURCES" | undefined;
                priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
                jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
                authorityType?: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY" | undefined;
                category?: string | undefined;
                articleType?: "SINGLE_JURISDICTION_UPDATE" | "COUNTRY_SPECIFIC_GUIDE" | "CROSS_COUNTRY_COMPARISON" | "REGIONAL_TREND_ANALYSIS" | "EVERGREEN_EXPLAINER" | "PRODUCT_EDUCATION" | undefined;
                search?: string | undefined;
                sortBy?: "createdAt" | "relevanceScore" | "score" | undefined;
                sortOrder?: "asc" | "desc" | undefined;
                minScore?: number | undefined;
                maxScore?: number | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminGetSuggestion: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminDismissSuggestion: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: any;
            meta: object;
        }>;
        adminApproveSuggestionForDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminMarkSuggestionNeedsMoreSources: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason?: string | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminDeleteSuggestion: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminCreateDraftFromSuggestion: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                suggestionId: string;
            };
            output: any;
            meta: object;
        }>;
        adminGenerateAiDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                blogPostId?: string | undefined;
                suggestionId?: string | undefined;
                modelOverride?: string | undefined;
                targetWordCount?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminRunBlogVerification: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                blogPostId: string;
                runType?: "SYSTEM" | "MANUAL" | "PRE_PUBLISH" | undefined;
                useAiReview?: boolean | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminListBlogVerificationRuns: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                blogPostId?: string | undefined;
                status?: "FAILED" | "PENDING" | "RUNNING" | "PASSED" | "NEEDS_REVIEW" | "BLOCKED" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminGetBlogVerificationRun: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminGetLatestBlogVerification: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                blogPostId: string;
            };
            output: any;
            meta: object;
        }>;
        adminListEditorialTriageRuns: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                runs: ({
                    sourceItem: {
                        id: string;
                        title: string;
                        url: string;
                        status: import(".prisma/client").$Enums.BlogSourceItemStatus;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        summary: string | null;
                        failureReason: string | null;
                        jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                        publicationDate: Date | null;
                        contentHash: string;
                        authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                        sourceType: import(".prisma/client").$Enums.BlogSourceType;
                        discoveredAt: Date;
                        publisher: string | null;
                        monitorId: string;
                        normalizedUrl: string;
                        rawContentHash: string | null;
                        dismissedReason: string | null;
                    } | null;
                    suggestion: {
                        id: string;
                        title: string;
                        status: import(".prisma/client").$Enums.BlogSuggestionStatus;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        targetAudience: string[];
                        summary: string | null;
                        category: string;
                        jurisdictions: import(".prisma/client").$Enums.BlogJurisdiction[];
                        priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
                        jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                        reason: string | null;
                        approvedAt: Date | null;
                        relevanceScore: number;
                        blogPostId: string | null;
                        dismissedReason: string | null;
                        suggestedSlug: string | null;
                        articleType: import(".prisma/client").$Enums.BlogArticleType;
                        sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
                        recommendedTags: string[];
                        suggestedNextAction: string | null;
                        requiresOfficialSource: boolean;
                        requiresHumanReview: boolean;
                        needsMoreSources: boolean;
                        dismissedAt: Date | null;
                        dismissedById: string | null;
                        approvedById: string | null;
                    } | null;
                } & {
                    id: string;
                    status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                    createdAt: Date;
                    urgency: import(".prisma/client").$Enums.BlogSuggestionPriority;
                    version: number;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    sourceItemId: string | null;
                    modelProvider: string | null;
                    modelName: string | null;
                    promptVersion: string;
                    recommendation: import(".prisma/client").$Enums.BlogEditorialRecommendation;
                    requiresHumanReview: boolean;
                    suggestionId: string | null;
                    agentRunId: string | null;
                    deterministicScore: number;
                    aiRelevanceScore: number | null;
                    finalScore: number;
                    targetAudiences: string[];
                    recommendedArticleType: import(".prisma/client").$Enums.BlogArticleType | null;
                    recommendedChannels: string[];
                    rationale: string;
                    sourceConfidence: number;
                    inputHash: string;
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminGetEditorialTriageRun: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                sourceItem: {
                    id: string;
                    title: string;
                    url: string;
                    status: import(".prisma/client").$Enums.BlogSourceItemStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: string | null;
                    failureReason: string | null;
                    jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                    publicationDate: Date | null;
                    contentHash: string;
                    authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                    sourceType: import(".prisma/client").$Enums.BlogSourceType;
                    discoveredAt: Date;
                    publisher: string | null;
                    monitorId: string;
                    normalizedUrl: string;
                    rawContentHash: string | null;
                    dismissedReason: string | null;
                } | null;
                suggestion: {
                    id: string;
                    title: string;
                    status: import(".prisma/client").$Enums.BlogSuggestionStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    targetAudience: string[];
                    summary: string | null;
                    category: string;
                    jurisdictions: import(".prisma/client").$Enums.BlogJurisdiction[];
                    priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
                    jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                    reason: string | null;
                    approvedAt: Date | null;
                    relevanceScore: number;
                    blogPostId: string | null;
                    dismissedReason: string | null;
                    suggestedSlug: string | null;
                    articleType: import(".prisma/client").$Enums.BlogArticleType;
                    sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
                    recommendedTags: string[];
                    suggestedNextAction: string | null;
                    requiresOfficialSource: boolean;
                    requiresHumanReview: boolean;
                    needsMoreSources: boolean;
                    dismissedAt: Date | null;
                    dismissedById: string | null;
                    approvedById: string | null;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                createdAt: Date;
                urgency: import(".prisma/client").$Enums.BlogSuggestionPriority;
                version: number;
                errorMessage: string | null;
                completedAt: Date | null;
                sourceItemId: string | null;
                modelProvider: string | null;
                modelName: string | null;
                promptVersion: string;
                recommendation: import(".prisma/client").$Enums.BlogEditorialRecommendation;
                requiresHumanReview: boolean;
                suggestionId: string | null;
                agentRunId: string | null;
                deterministicScore: number;
                aiRelevanceScore: number | null;
                finalScore: number;
                targetAudiences: string[];
                recommendedArticleType: import(".prisma/client").$Enums.BlogArticleType | null;
                recommendedChannels: string[];
                rationale: string;
                sourceConfidence: number;
                inputHash: string;
            };
            meta: object;
        }>;
        adminListResearchPackVersions: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                blogPostId?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                packs: ({
                    blogPost: {
                        id: string;
                        title: string;
                    } | null;
                    reviewedBy: {
                        id: string;
                        fullName: string;
                    } | null;
                } & {
                    id: string;
                    status: import(".prisma/client").$Enums.BlogResearchPackStatus;
                    createdAt: Date;
                    executiveSummary: string | null;
                    version: number;
                    confidence: number;
                    reviewedAt: Date | null;
                    reviewedById: string | null;
                    modelProvider: string | null;
                    modelName: string | null;
                    blogPostId: string | null;
                    sourceSetHash: string;
                    promptVersion: string;
                    suggestionId: string | null;
                    inputHash: string;
                    researchObjective: string;
                    importantDates: import("@prisma/client/runtime/client").JsonValue | null;
                    authorities: import("@prisma/client/runtime/client").JsonValue | null;
                    obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
                    evidenceGaps: string[];
                    contradictions: import("@prisma/client/runtime/client").JsonValue | null;
                    reviewerStatus: string | null;
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminGetResearchPack: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                blogPost: {
                    id: string;
                    title: string;
                } | null;
                reviewedBy: {
                    id: string;
                    fullName: string;
                } | null;
                sources: {
                    id: string;
                    title: string;
                    createdAt: Date;
                    category: import(".prisma/client").$Enums.BlogResearchSourceCategory;
                    jurisdiction: string | null;
                    publicationDate: Date | null;
                    contentHash: string | null;
                    sourceItemId: string | null;
                    publisher: string | null;
                    researchPackId: string;
                    postSourceId: string | null;
                    externalUrl: string | null;
                    authority: string | null;
                    retrievalDate: Date;
                    trustLevel: number;
                    isAvailable: boolean;
                    isContradictory: boolean;
                }[];
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogResearchPackStatus;
                createdAt: Date;
                executiveSummary: string | null;
                version: number;
                confidence: number;
                reviewedAt: Date | null;
                reviewedById: string | null;
                modelProvider: string | null;
                modelName: string | null;
                blogPostId: string | null;
                sourceSetHash: string;
                promptVersion: string;
                suggestionId: string | null;
                inputHash: string;
                researchObjective: string;
                importantDates: import("@prisma/client/runtime/client").JsonValue | null;
                authorities: import("@prisma/client/runtime/client").JsonValue | null;
                obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
                evidenceGaps: string[];
                contradictions: import("@prisma/client/runtime/client").JsonValue | null;
                reviewerStatus: string | null;
            };
            meta: object;
        }>;
        adminReviewResearchPack: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                status: "REJECTED" | "REVIEWED";
                note?: string | undefined;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.BlogResearchPackStatus;
                createdAt: Date;
                executiveSummary: string | null;
                version: number;
                confidence: number;
                reviewedAt: Date | null;
                reviewedById: string | null;
                modelProvider: string | null;
                modelName: string | null;
                blogPostId: string | null;
                sourceSetHash: string;
                promptVersion: string;
                suggestionId: string | null;
                inputHash: string;
                researchObjective: string;
                importantDates: import("@prisma/client/runtime/client").JsonValue | null;
                authorities: import("@prisma/client/runtime/client").JsonValue | null;
                obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
                evidenceGaps: string[];
                contradictions: import("@prisma/client/runtime/client").JsonValue | null;
                reviewerStatus: string | null;
            } | null;
            meta: object;
        }>;
        adminGetFreshnessReview: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                blogPost: {
                    id: string;
                    title: string;
                };
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                createdAt: Date;
                errorMessage: string | null;
                completedAt: Date | null;
                action: import(".prisma/client").$Enums.BlogFreshnessAction;
                contentHash: string;
                modelProvider: string | null;
                modelName: string | null;
                blogPostId: string;
                triggeredBy: string;
                sourceSetHash: string;
                promptVersion: string;
                agentRunId: string | null;
                rationale: string;
                riskTier: import(".prisma/client").$Enums.BlogFreshnessRiskTier;
                freshnessScore: number;
                changedSourceIds: string[];
                newSignalIds: string[];
                brokenSourceCount: number;
                staleSourceCount: number;
                nextReviewAt: Date | null;
            };
            meta: object;
        }>;
        adminListFreshnessReviews: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                blogPostId?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                reviews: ({
                    blogPost: {
                        id: string;
                        title: string;
                    };
                } & {
                    id: string;
                    status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                    createdAt: Date;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    action: import(".prisma/client").$Enums.BlogFreshnessAction;
                    contentHash: string;
                    modelProvider: string | null;
                    modelName: string | null;
                    blogPostId: string;
                    triggeredBy: string;
                    sourceSetHash: string;
                    promptVersion: string;
                    agentRunId: string | null;
                    rationale: string;
                    riskTier: import(".prisma/client").$Enums.BlogFreshnessRiskTier;
                    freshnessScore: number;
                    changedSourceIds: string[];
                    newSignalIds: string[];
                    brokenSourceCount: number;
                    staleSourceCount: number;
                    nextReviewAt: Date | null;
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminListRevisionRequests: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                blogPostId?: string | undefined;
                status?: "RESOLVED" | "PENDING_REVIEW" | "ACCEPTED" | "DISMISSED" | "ASSIGNED" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                requests: ({
                    blogPost: {
                        id: string;
                        title: string;
                    };
                    assignedTo: {
                        id: string;
                        fullName: string;
                    } | null;
                    requestedBy: {
                        id: string;
                        fullName: string;
                    } | null;
                } & {
                    id: string;
                    status: import(".prisma/client").$Enums.BlogRevisionStatus;
                    createdAt: Date;
                    priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                    reason: string;
                    idempotencyKey: string;
                    resolvedAt: Date | null;
                    blogPostId: string;
                    requestedById: string | null;
                    approvedById: string | null;
                    freshnessReviewId: string | null;
                    recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                    evidence: import("@prisma/client/runtime/client").JsonValue | null;
                    assignedToId: string | null;
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminGetRevisionRequest: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                blogPost: {
                    id: string;
                    title: string;
                };
                assignedTo: {
                    id: string;
                    fullName: string;
                } | null;
                requestedBy: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogRevisionStatus;
                createdAt: Date;
                priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                reason: string;
                idempotencyKey: string;
                resolvedAt: Date | null;
                blogPostId: string;
                requestedById: string | null;
                approvedById: string | null;
                freshnessReviewId: string | null;
                recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                evidence: import("@prisma/client/runtime/client").JsonValue | null;
                assignedToId: string | null;
            };
            meta: object;
        }>;
        adminAssignRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                assignedToId: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.BlogRevisionStatus;
                createdAt: Date;
                priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                reason: string;
                idempotencyKey: string;
                resolvedAt: Date | null;
                blogPostId: string;
                requestedById: string | null;
                approvedById: string | null;
                freshnessReviewId: string | null;
                recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                evidence: import("@prisma/client/runtime/client").JsonValue | null;
                assignedToId: string | null;
            };
            meta: object;
        }>;
        adminAcceptRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.BlogRevisionStatus;
                createdAt: Date;
                priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                reason: string;
                idempotencyKey: string;
                resolvedAt: Date | null;
                blogPostId: string;
                requestedById: string | null;
                approvedById: string | null;
                freshnessReviewId: string | null;
                recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                evidence: import("@prisma/client/runtime/client").JsonValue | null;
                assignedToId: string | null;
            };
            meta: object;
        }>;
        adminStartRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.BlogRevisionStatus;
                createdAt: Date;
                priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                reason: string;
                idempotencyKey: string;
                resolvedAt: Date | null;
                blogPostId: string;
                requestedById: string | null;
                approvedById: string | null;
                freshnessReviewId: string | null;
                recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                evidence: import("@prisma/client/runtime/client").JsonValue | null;
                assignedToId: string | null;
            };
            meta: object;
        }>;
        adminResolveRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                resolutionNotes: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.BlogRevisionStatus;
                createdAt: Date;
                priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                reason: string;
                idempotencyKey: string;
                resolvedAt: Date | null;
                blogPostId: string;
                requestedById: string | null;
                approvedById: string | null;
                freshnessReviewId: string | null;
                recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                evidence: import("@prisma/client/runtime/client").JsonValue | null;
                assignedToId: string | null;
            };
            meta: object;
        }>;
        adminDismissRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.BlogRevisionStatus;
                createdAt: Date;
                priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                reason: string;
                idempotencyKey: string;
                resolvedAt: Date | null;
                blogPostId: string;
                requestedById: string | null;
                approvedById: string | null;
                freshnessReviewId: string | null;
                recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                evidence: import("@prisma/client/runtime/client").JsonValue | null;
                assignedToId: string | null;
            };
            meta: object;
        }>;
        adminListContentOpsAlerts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "OPEN" | "RESOLVED" | "ACKNOWLEDGED" | "IGNORED" | undefined;
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                alerts: ({
                    resolvedBy: {
                        id: string;
                        fullName: string;
                    } | null;
                } & {
                    type: string;
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
                    status: import(".prisma/client").$Enums.AutomationIncidentStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    summary: string;
                    entityType: string;
                    entityId: string;
                    resolvedAt: Date | null;
                    workflowKey: string | null;
                    firstSeenAt: Date;
                    lastSeenAt: Date;
                    occurrenceCount: number;
                    executionId: string | null;
                    notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
                    notificationAttempts: number;
                    lastNotificationAt: Date | null;
                    acknowledgedById: string | null;
                    acknowledgedAt: Date | null;
                    resolvedById: string | null;
                    resolutionNote: string | null;
                })[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        adminGetContentOpsAlert: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                resolvedBy: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
                type: string;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                title: string;
                severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
                status: import(".prisma/client").$Enums.AutomationIncidentStatus;
                createdAt: Date;
                updatedAt: Date;
                summary: string;
                entityType: string;
                entityId: string;
                resolvedAt: Date | null;
                workflowKey: string | null;
                firstSeenAt: Date;
                lastSeenAt: Date;
                occurrenceCount: number;
                executionId: string | null;
                notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
                notificationAttempts: number;
                lastNotificationAt: Date | null;
                acknowledgedById: string | null;
                acknowledgedAt: Date | null;
                resolvedById: string | null;
                resolutionNote: string | null;
            };
            meta: object;
        }>;
        adminAcknowledgeContentOpsAlert: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                type: string;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                title: string;
                severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
                status: import(".prisma/client").$Enums.AutomationIncidentStatus;
                createdAt: Date;
                updatedAt: Date;
                summary: string;
                entityType: string;
                entityId: string;
                resolvedAt: Date | null;
                workflowKey: string | null;
                firstSeenAt: Date;
                lastSeenAt: Date;
                occurrenceCount: number;
                executionId: string | null;
                notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
                notificationAttempts: number;
                lastNotificationAt: Date | null;
                acknowledgedById: string | null;
                acknowledgedAt: Date | null;
                resolvedById: string | null;
                resolutionNote: string | null;
            };
            meta: object;
        }>;
        adminResolveContentOpsAlert: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                resolutionNotes: string;
            };
            output: {
                type: string;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                title: string;
                severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
                status: import(".prisma/client").$Enums.AutomationIncidentStatus;
                createdAt: Date;
                updatedAt: Date;
                summary: string;
                entityType: string;
                entityId: string;
                resolvedAt: Date | null;
                workflowKey: string | null;
                firstSeenAt: Date;
                lastSeenAt: Date;
                occurrenceCount: number;
                executionId: string | null;
                notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
                notificationAttempts: number;
                lastNotificationAt: Date | null;
                acknowledgedById: string | null;
                acknowledgedAt: Date | null;
                resolvedById: string | null;
                resolutionNote: string | null;
            };
            meta: object;
        }>;
        adminIgnoreContentOpsAlert: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                reason: string;
            };
            output: {
                type: string;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                title: string;
                severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
                status: import(".prisma/client").$Enums.AutomationIncidentStatus;
                createdAt: Date;
                updatedAt: Date;
                summary: string;
                entityType: string;
                entityId: string;
                resolvedAt: Date | null;
                workflowKey: string | null;
                firstSeenAt: Date;
                lastSeenAt: Date;
                occurrenceCount: number;
                executionId: string | null;
                notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
                notificationAttempts: number;
                lastNotificationAt: Date | null;
                acknowledgedById: string | null;
                acknowledgedAt: Date | null;
                resolvedById: string | null;
                resolutionNote: string | null;
            };
            meta: object;
        }>;
        adminListEditorialDigests: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: any;
            meta: object;
        }>;
        adminGetEditorialDigest: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: any;
            meta: object;
        }>;
        adminGenerateEditorialDigest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                force?: boolean | undefined;
                periodStart?: Date | undefined;
                periodEnd?: Date | undefined;
            };
            output: any;
            meta: object;
        }>;
    }>>;
    agents: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        beginRun: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                agentType: string;
                idempotencyKey: string;
                organizationId?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
                estimatedCostUsd?: number | undefined;
            };
            output: import("../../modules/agents/agent-run.service").BeginAgentRunResult;
            meta: object;
        }>;
        getRun: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                runId: string;
            };
            output: ({
                error: string | null;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                status: string;
                organizationId: string | null;
                inputTokens: number;
                outputTokens: number;
                completedAt: Date | null;
                idempotencyKey: string;
                startedAt: Date;
                costUsd: import("@prisma/client-runtime-utils").Decimal;
                agentType: string;
                iterations: number;
            } & {
                reports: import(".prisma/client").AgentReport[];
            }) | null;
            meta: object;
        }>;
        advanceRun: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                runId: string;
                inputTokens?: number | undefined;
                outputTokens?: number | undefined;
                costUsd?: number | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                error: string | null;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                status: string;
                organizationId: string | null;
                inputTokens: number;
                outputTokens: number;
                completedAt: Date | null;
                idempotencyKey: string;
                startedAt: Date;
                costUsd: import("@prisma/client-runtime-utils").Decimal;
                agentType: string;
                iterations: number;
            };
            meta: object;
        }>;
        completeRun: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                runId: string;
                inputTokens?: number | undefined;
                outputTokens?: number | undefined;
                costUsd?: number | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                error: string | null;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                status: string;
                organizationId: string | null;
                inputTokens: number;
                outputTokens: number;
                completedAt: Date | null;
                idempotencyKey: string;
                startedAt: Date;
                costUsd: import("@prisma/client-runtime-utils").Decimal;
                agentType: string;
                iterations: number;
            };
            meta: object;
        }>;
        failRun: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                runId: string;
                error: string;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                error: string | null;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                status: string;
                organizationId: string | null;
                inputTokens: number;
                outputTokens: number;
                completedAt: Date | null;
                idempotencyKey: string;
                startedAt: Date;
                costUsd: import("@prisma/client-runtime-utils").Decimal;
                agentType: string;
                iterations: number;
            };
            meta: object;
        }>;
        createReport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                agentRunId: string;
                summary?: string | undefined;
                signals?: Record<string, unknown> | undefined;
                recommendedActions?: Record<string, unknown> | undefined;
                risks?: Record<string, unknown> | undefined;
                humanApproved?: boolean | undefined;
            };
            output: {
                id: string;
                createdAt: Date;
                summary: string | null;
                agentRunId: string;
                signals: import("@prisma/client/runtime/client").JsonValue | null;
                recommendedActions: import("@prisma/client/runtime/client").JsonValue | null;
                risks: import("@prisma/client/runtime/client").JsonValue | null;
                humanApproved: boolean;
            };
            meta: object;
        }>;
        marketing: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            runDrafting: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey?: string | undefined;
                    maxSignals?: number | undefined;
                } | undefined;
                output: import("../../modules/agents/marketing/types").MarketingRunResult;
                meta: object;
            }>;
            listDrafts: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    status?: "DRAFT" | "DISMISSED" | "REVIEWED" | undefined;
                    contentType?: "newsletter_item" | "linkedin_post" | undefined;
                };
                output: {
                    drafts: import("../../modules/agents/marketing/types").PersistedMarketingDraft[];
                    pagination: {
                        page: number;
                        limit: number;
                        total: number;
                        pages: number;
                    };
                };
                meta: object;
            }>;
            getDraft: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    draftId: string;
                };
                output: import("../../modules/agents/marketing/types").PersistedMarketingDraft | null;
                meta: object;
            }>;
            reviewDraft: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    draftId: string;
                    status: "DISMISSED" | "REVIEWED";
                    editedBody?: string | undefined;
                };
                output: import("../../modules/agents/marketing/types").PersistedMarketingDraft;
                meta: object;
            }>;
            leads: import("@trpc/server").TRPCBuiltRouter<{
                ctx: import("./context").Context;
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
                getDiscoverySources: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        jurisdiction?: string | undefined;
                    } | undefined;
                    output: import("../../modules/marketing/lead-discovery-sources").DiscoverySourceDefinition[];
                    meta: object;
                }>;
                updateDiscoverySourceState: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        sourceId: string;
                        result: "FAILED" | "SUCCESS" | "SKIPPED_UNCHANGED";
                        contentFingerprint?: string | null | undefined;
                        processedCursor?: string | null | undefined;
                        recordIdentifier?: string | null | undefined;
                        sourceVersion?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        metadata?: Record<string, unknown> | undefined;
                    };
                    output: import("../../modules/marketing/lead-discovery-sources").DiscoverySourceState;
                    meta: object;
                }>;
                getBudgetStatus: import("@trpc/server").TRPCQueryProcedure<{
                    input: {
                        period?: string | undefined;
                    } | undefined;
                    output: {
                        period: string;
                        budgetUsd: number;
                        spentUsd: number;
                        reservedUsd: number;
                        remainingUsd: number;
                        percentUsed: number;
                        isHalted: boolean;
                        providers: Record<import("../../lib/ai/gateway/types").LLMProviderName, number>;
                    };
                    meta: object;
                }>;
                initDiscoveryRun: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        runIdempotencyKey: string;
                        workflowName?: string | undefined;
                        sourceAuthority?: string | null | undefined;
                        sourceUrl?: string | null | undefined;
                        jurisdiction?: string | undefined;
                        sourceSetId?: string | undefined;
                        metadata?: Record<string, unknown> | undefined;
                    };
                    output: {
                        metadata: import("@prisma/client/runtime/client").JsonValue | null;
                        id: string;
                        status: import(".prisma/client").$Enums.DiscoveryRunStatus;
                        errorMessage: string | null;
                        completedAt: Date | null;
                        startedAt: Date;
                        sourceUrl: string;
                        sourceAuthority: string;
                        runIdempotencyKey: string;
                        workflowName: string;
                        totalDiscovered: number;
                        totalQualified: number;
                        totalDeduplicated: number;
                        totalRejected: number;
                        totalCreated: number;
                        totalUpdated: number;
                    };
                    meta: object;
                }>;
                ingestBatch: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        discoveryRunId: string;
                        batchId: string;
                        candidates: {
                            name: string;
                            primarySourceUrl: string;
                            domain?: string | null | undefined;
                            country?: string | undefined;
                            industry?: string | null | undefined;
                            regulatoryBody?: string | null | undefined;
                            licenceType?: string | null | undefined;
                            licenceNumber?: string | null | undefined;
                            licenceStatus?: string | null | undefined;
                            sizeClass?: "ENTERPRISE" | "MEDIUM" | "UNKNOWN" | "MICRO" | "SMALL" | "LARGE" | null | undefined;
                            primarySourceAuthority?: string | null | undefined;
                            confidence?: number | undefined;
                            hasComplianceObligation?: boolean | undefined;
                            operatesCrossBorder?: boolean | undefined;
                            handlesPersonalData?: boolean | undefined;
                            handlesCustomerFunds?: boolean | undefined;
                            hasNamedBuyerContact?: boolean | undefined;
                            buyerRoleIdentified?: boolean | undefined;
                            targetRoleTitle?: string | null | undefined;
                            recentRegulatoryEvent?: boolean | undefined;
                            recentLicensingDeadline?: boolean | undefined;
                            evidence?: {
                                field: string;
                                extractedValue: string;
                                sourceUrl: string;
                                normalizedValue?: string | null | undefined;
                                confidence?: number | undefined;
                                sourceAuthority?: string | null | undefined;
                                sourceRecordId?: string | null | undefined;
                                evidenceSnippet?: string | null | undefined;
                                verificationState?: "VERIFIED" | "UNVERIFIED" | "REJECTED" | "CONFLICTING" | undefined;
                                extractionMethod?: string | null | undefined;
                                modelProvider?: string | null | undefined;
                                modelName?: string | null | undefined;
                                extractorVersion?: string | null | undefined;
                            }[] | undefined;
                        }[];
                    };
                    output: import("../../modules/marketing/lead-ingestion.service").IngestBatchResult;
                    meta: object;
                }>;
                completeDiscoveryRun: import("@trpc/server").TRPCMutationProcedure<{
                    input: {
                        discoveryRunId: string;
                        status?: "COMPLETED" | "FAILED" | "RUNNING" | "PARTIALLY_COMPLETED" | undefined;
                        errorMessage?: string | undefined;
                        metadata?: Record<string, unknown> | undefined;
                    };
                    output: {
                        metadata: import("@prisma/client/runtime/client").JsonValue | null;
                        id: string;
                        status: import(".prisma/client").$Enums.DiscoveryRunStatus;
                        errorMessage: string | null;
                        completedAt: Date | null;
                        startedAt: Date;
                        sourceUrl: string;
                        sourceAuthority: string;
                        runIdempotencyKey: string;
                        workflowName: string;
                        totalDiscovered: number;
                        totalQualified: number;
                        totalDeduplicated: number;
                        totalRejected: number;
                        totalCreated: number;
                        totalUpdated: number;
                    };
                    meta: object;
                }>;
            }>>;
        }>>;
        regIntel: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            runScan: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey?: string | undefined;
                    maxItems?: number | undefined;
                } | undefined;
                output: import("../../modules/agents/regulatory-intelligence/reg-intel.agent").RegIntelRunResult;
                meta: object;
            }>;
            getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
                input: void;
                output: import("../../modules/agents/regulatory-intelligence/reg-intel.agent").LatestReportRow | null;
                meta: object;
            }>;
            listSignals: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    jurisdiction?: string | undefined;
                    severity?: string | undefined;
                    corpusGap?: boolean | undefined;
                    status?: string | undefined;
                };
                output: {
                    signals: import("../../modules/agents/regulatory-intelligence/reg-intel.agent").RegulatorySignalListRow[];
                    pagination: {
                        page: number;
                        limit: number;
                        total: number;
                        pages: number;
                    };
                };
                meta: object;
            }>;
            acknowledgeSignal: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    signalId: string;
                };
                output: import("../../modules/agents/regulatory-intelligence/reg-intel.agent").RegulatorySignalListRow;
                meta: object;
            }>;
        }>>;
        sales: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            runDrafting: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey?: string | undefined;
                    maxProspects?: number | undefined;
                } | undefined;
                output: import("../../modules/agents/sales/types").SalesRunResult;
                meta: object;
            }>;
            listDrafts: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    status?: "DRAFT" | "QUEUED" | "DISMISSED" | "REVIEWED" | undefined;
                };
                output: {
                    drafts: import("../../modules/agents/sales/types").PersistedSalesOutreachDraft[];
                    pagination: {
                        page: number;
                        limit: number;
                        total: number;
                        pages: number;
                    };
                };
                meta: object;
            }>;
            getDraft: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    draftId: string;
                };
                output: import("../../modules/agents/sales/types").PersistedSalesOutreachDraft | null;
                meta: object;
            }>;
            reviewDraft: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    draftId: string;
                    status: "DISMISSED" | "REVIEWED";
                    editedBody?: string | undefined;
                };
                output: import("../../modules/agents/sales/types").PersistedSalesOutreachDraft;
                meta: object;
            }>;
        }>>;
        automation: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            logEvent: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    workflowKey: string;
                    event: string;
                    payload: Record<string, unknown>;
                    executionId: string;
                };
                output: {
                    received: true;
                };
                meta: object;
            }>;
            generate: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    workflowKey: string;
                    taskType: string;
                    systemPrompt: string;
                    userPrompt: string;
                    maxTokens: number;
                };
                output: import("../../modules/agents/automation/automation.service").GenerateAutomationContentResult;
                meta: object;
            }>;
            getMetrics: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    department: string;
                    window: string;
                    jurisdictions?: string | undefined;
                    detail?: string | undefined;
                };
                output: import("../../modules/agents/automation/metrics-types").GetMetricsResult;
                meta: object;
            }>;
            createApproval: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    department: string;
                    workflow: string;
                    kind: string;
                    summary: string;
                    callbackUrl: string;
                    metadata: Record<string, unknown>;
                    idempotencyKey: string;
                    reviewerEmail?: string | undefined;
                };
                output: {
                    approvalId: string;
                };
                meta: object;
            }>;
            getApproval: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    approvalId: string;
                };
                output: {
                    status: import("../../modules/agents/automation/approval.service").ApprovalStatus;
                    decidedBy: string | null;
                    blogPost?: import("../../modules/agents/automation/approval.service").ApprovalBlogPostSummary;
                };
                meta: object;
            }>;
            recordApprovalDecision: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    approvalId: string;
                    decision: "rejected" | "approved";
                };
                output: {
                    approvalId: string;
                    status: import("../../modules/agents/automation/approval.service").ApprovalStatus;
                };
                meta: object;
            }>;
            listApprovals: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    page?: number | undefined;
                    limit?: number | undefined;
                    department?: string | undefined;
                    workflow?: string | undefined;
                    status?: "rejected" | "pending" | "approved" | undefined;
                };
                output: import("../../modules/agents/automation/approval.service").ListApprovalsResult;
                meta: object;
            }>;
            listApprovalsForAutomation: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    department?: string | undefined;
                    workflow?: string | undefined;
                    status?: "rejected" | "pending" | "approved" | undefined;
                    limit?: number | undefined;
                };
                output: import("../../modules/agents/automation/approval.service").ListApprovalsResult;
                meta: object;
            }>;
            publishContent: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    approvalId: string;
                };
                output: {
                    blogPostId: string;
                    publishedAt: string;
                };
                meta: object;
            }>;
            queueContentCandidate: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceItemId: string;
                    title: string;
                    score: number;
                    jurisdiction: string;
                };
                output: {
                    forwarded: boolean;
                };
                meta: object;
            }>;
            createDraftFromCandidate: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceItemId: string;
                };
                output: import("../../modules/agents/automation/blog-draft.service").CreateDraftFromCandidateResult;
                meta: object;
            }>;
            generateDraftContent: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    blogPostId: string;
                    idempotencyKey: string;
                };
                output: import("../../modules/agents/automation/blog-draft.service").GenerateDraftContentResult;
                meta: object;
            }>;
            getRecentHighImpactRegulatoryItems: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    window: string;
                    jurisdictions: string;
                };
                output: {
                    items: import("../../modules/agents/automation/content.service").RegulatoryItem[];
                };
                meta: object;
            }>;
            getApprovedContentThisWeek: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    jurisdictions: string;
                };
                output: {
                    items: import("../../modules/agents/automation/content.service").ApprovedContentItem[];
                };
                meta: object;
            }>;
            sendNewsletter: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    approvalId: string;
                };
                output: import("../../modules/agents/automation/newsletter.service").SendNewsletterResult;
                meta: object;
            }>;
            queueOutreach: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    approvalId: string;
                    orgId: string;
                    content: string;
                };
                output: {
                    orgId: string;
                    sent: boolean;
                    messageId?: string;
                };
                meta: object;
            }>;
            getSources: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    jurisdictions: string;
                };
                output: {
                    sources: import("../../modules/agents/automation/sources.service").SourceListItem[];
                };
                meta: object;
            }>;
            fetchSource: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    url: string;
                    sourceId: string;
                    jurisdiction: string;
                };
                output: {
                    sourceId: string;
                    normalizedContent: string;
                    contentHash: string;
                    fetchedAt: string;
                };
                meta: object;
            }>;
            dedupeSource: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    contentHash: string;
                    jurisdiction: string;
                };
                output: {
                    isNew: boolean;
                };
                meta: object;
            }>;
            getPilotCohortStatus: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    cohort: string;
                    jurisdictions: string;
                };
                output: {
                    orgs: import("../../modules/agents/automation/pilot-vendor.service").PilotCohortOrgStatus[];
                };
                meta: object;
            }>;
            getDpaVendorStatus: import("@trpc/server").TRPCMutationProcedure<{
                input: void;
                output: {
                    vendors: import("../../modules/agents/automation/pilot-vendor.service").DpaVendorStatus[];
                    dataAvailable: boolean;
                };
                meta: object;
            }>;
            shouldNotify: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    dedupeKey: string;
                    ttlSeconds: number;
                };
                output: {
                    shouldNotify: boolean;
                };
                meta: object;
            }>;
            triageEditorialCandidate: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey: string;
                    sourceItemId?: string | undefined;
                    suggestionId?: string | undefined;
                    regulatorySignalId?: string | undefined;
                    forceRetriage?: boolean | undefined;
                };
                output: import("../../modules/blog-automation/editorial-triage.service").TriageEditorialCandidateResult;
                meta: object;
            }>;
            getEditorialTriage: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    triageRunId: string;
                };
                output: {
                    id: string;
                    status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                    createdAt: Date;
                    urgency: import(".prisma/client").$Enums.BlogSuggestionPriority;
                    version: number;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    sourceItemId: string | null;
                    modelProvider: string | null;
                    modelName: string | null;
                    promptVersion: string;
                    recommendation: import(".prisma/client").$Enums.BlogEditorialRecommendation;
                    requiresHumanReview: boolean;
                    suggestionId: string | null;
                    agentRunId: string | null;
                    deterministicScore: number;
                    aiRelevanceScore: number | null;
                    finalScore: number;
                    targetAudiences: string[];
                    recommendedArticleType: import(".prisma/client").$Enums.BlogArticleType | null;
                    recommendedChannels: string[];
                    rationale: string;
                    sourceConfidence: number;
                    inputHash: string;
                } | null;
                meta: object;
            }>;
            createResearchPack: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey: string;
                    blogPostId?: string | undefined;
                    suggestionId?: string | undefined;
                };
                output: import("../../modules/blog-automation/research-pack.service").CreateResearchPackResult;
                meta: object;
            }>;
            getResearchPack: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    researchPackId?: string | undefined;
                    blogPostId?: string | undefined;
                };
                output: ({
                    id: string;
                    status: import(".prisma/client").$Enums.BlogResearchPackStatus;
                    createdAt: Date;
                    executiveSummary: string | null;
                    version: number;
                    confidence: number;
                    reviewedAt: Date | null;
                    reviewedById: string | null;
                    modelProvider: string | null;
                    modelName: string | null;
                    blogPostId: string | null;
                    sourceSetHash: string;
                    promptVersion: string;
                    suggestionId: string | null;
                    inputHash: string;
                    researchObjective: string;
                    importantDates: import("@prisma/client/runtime/client").JsonValue | null;
                    authorities: import("@prisma/client/runtime/client").JsonValue | null;
                    obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
                    evidenceGaps: string[];
                    contradictions: import("@prisma/client/runtime/client").JsonValue | null;
                    reviewerStatus: string | null;
                } & {
                    sources: unknown[];
                }) | null;
                meta: object;
            }>;
            verifyBlogPostClaims: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    blogPostId: string;
                    idempotencyKey: string;
                    requestSecondReview?: boolean | undefined;
                };
                output: import("../../modules/blog-automation/semantic-verification.service").RunSemanticVerificationResult;
                meta: object;
            }>;
            getVerificationResult: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    verificationRunId?: string | undefined;
                    blogPostId?: string | undefined;
                };
                output: ({
                    issues: {
                        id: string;
                        title: string;
                        description: string;
                        severity: import(".prisma/client").$Enums.BlogVerificationIssueSeverity;
                        createdAt: Date;
                        confidence: number | null;
                        excerpt: string | null;
                        claimText: string | null;
                        sourceId: string | null;
                        sourceUrl: string | null;
                        runId: string;
                        issueType: import(".prisma/client").$Enums.BlogVerificationIssueType;
                        recommendation: string | null;
                        paragraphIndex: number | null;
                        sentenceIndex: number | null;
                        claimCategory: import(".prisma/client").$Enums.BlogClaimCategory | null;
                        claimVerificationStatus: import(".prisma/client").$Enums.BlogClaimVerificationStatus | null;
                        claimHash: string | null;
                        reviewProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                    }[];
                } & {
                    id: string;
                    status: import(".prisma/client").$Enums.BlogVerificationStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    summary: string | null;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    contentHash: string | null;
                    startedAt: Date;
                    blogPostId: string;
                    draftGenerationRunId: string | null;
                    runType: import(".prisma/client").$Enums.BlogVerificationRunType;
                    qualityScore: number;
                    sourceScore: number;
                    claimRiskScore: number;
                    jurisdictionScore: number;
                    readinessScore: number;
                    blockingIssueCount: number;
                    warningIssueCount: number;
                    infoIssueCount: number;
                    recommendedAction: string | null;
                    requestedById: string | null;
                    sourceSetHash: string | null;
                    promptVersion: string | null;
                }) | null;
                meta: object;
            }>;
            listFreshnessReviewCandidates: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    maxItems?: number | undefined;
                };
                output: import("../../modules/blog-automation/freshness-review.service").FreshnessCandidate[];
                meta: object;
            }>;
            runFreshnessReview: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    blogPostId: string;
                    idempotencyKey: string;
                };
                output: import("../../modules/blog-automation/freshness-review.service").RunFreshnessReviewResult;
                meta: object;
            }>;
            createRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    blogPostId: string;
                    reason: string;
                    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
                    idempotencyKey: string;
                    freshnessReviewId?: string | undefined;
                    recommendedChanges?: Record<string, unknown> | undefined;
                    evidence?: Record<string, unknown> | undefined;
                };
                output: import("../../modules/blog-automation/revision-request.service").CreateRevisionRequestResult;
                meta: object;
            }>;
            listEditorialMonitors: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    jurisdictions?: string | undefined;
                    limit?: number | undefined;
                } | undefined;
                output: {
                    monitors: {
                        id: string;
                        name: string;
                        jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                        authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                        baseUrl: string;
                        sourceType: import(".prisma/client").$Enums.BlogSourceType;
                        lastCheckedAt: Date | null;
                        monitoringMethod: import(".prisma/client").$Enums.BlogMonitoringMethod;
                        feedUrl: string | null;
                    }[];
                };
                meta: object;
            }>;
            runEditorialDiscovery: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    monitorId: string;
                };
                output: {
                    status: string;
                    message: string;
                    itemsFound?: undefined;
                    itemsCreated?: undefined;
                    duplicateCount?: undefined;
                    failureCount?: undefined;
                    errorMessage?: undefined;
                } | {
                    status: "FAILED" | "SUCCESS" | "PARTIAL_SUCCESS";
                    itemsFound: number;
                    itemsCreated: number;
                    duplicateCount: number;
                    failureCount: number;
                    errorMessage: string | null;
                    message?: undefined;
                };
                meta: object;
            }>;
            createBlogSuggestion: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceItemId: string;
                    minScore?: number | undefined;
                };
                output: {
                    createdSuggestion: boolean;
                    scoringResult: import("../../modules/blog-automation/relevance-scoring.service").ScoringResult;
                    suggestion: null;
                    reason?: undefined;
                } | {
                    createdSuggestion: boolean;
                    scoringResult: import("../../modules/blog-automation/relevance-scoring.service").ScoringResult;
                    suggestion: null;
                    reason: string;
                } | {
                    createdSuggestion: boolean;
                    scoringResult: import("../../modules/blog-automation/relevance-scoring.service").ScoringResult;
                    suggestion: {
                        id: string;
                        title: string;
                        status: import(".prisma/client").$Enums.BlogSuggestionStatus;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        targetAudience: string[];
                        summary: string | null;
                        category: string;
                        jurisdictions: import(".prisma/client").$Enums.BlogJurisdiction[];
                        priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
                        jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                        reason: string | null;
                        approvedAt: Date | null;
                        relevanceScore: number;
                        blogPostId: string | null;
                        dismissedReason: string | null;
                        suggestedSlug: string | null;
                        articleType: import(".prisma/client").$Enums.BlogArticleType;
                        sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
                        recommendedTags: string[];
                        suggestedNextAction: string | null;
                        requiresOfficialSource: boolean;
                        requiresHumanReview: boolean;
                        needsMoreSources: boolean;
                        dismissedAt: Date | null;
                        dismissedById: string | null;
                        approvedById: string | null;
                    };
                    reason?: undefined;
                };
                meta: object;
            }>;
            listBlogSuggestions: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    status?: "PENDING_REVIEW" | "DUPLICATE" | "DISMISSED" | "APPROVED_FOR_DRAFT" | "DRAFT_CREATED" | "NEEDS_MORE_SOURCES" | undefined;
                    jurisdictions?: string | undefined;
                    limit?: number | undefined;
                } | undefined;
                output: {
                    suggestions: {
                        id: string;
                        title: string;
                        status: import(".prisma/client").$Enums.BlogSuggestionStatus;
                        createdAt: Date;
                        category: string;
                        priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
                        jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                        relevanceScore: number;
                        blogPostId: string | null;
                        suggestedSlug: string | null;
                        articleType: import(".prisma/client").$Enums.BlogArticleType;
                        sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
                        requiresHumanReview: boolean;
                    }[];
                };
                meta: object;
            }>;
            generateEditorialDraft: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    suggestionId: string;
                    idempotencyKey: string;
                };
                output: import("../../modules/agents/automation/blog-draft.service").GenerateDraftFromSuggestionResult;
                meta: object;
            }>;
            listRegulatorySources: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    jurisdictions?: string | undefined;
                    limit?: number | undefined;
                } | undefined;
                output: {
                    sources: import("../../modules/agents/automation/regulatory-automation.service").RegulatorySourceOperationalItem[];
                };
                meta: object;
            }>;
            fetchRegulatorySource: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceId?: string | undefined;
                    sourceKey?: string | undefined;
                    executionMetadata?: Record<string, unknown> | undefined;
                };
                output: import("../../modules/regulatory-intelligence/domain").RegulatoryFetchResult;
                meta: object;
            }>;
            ingestRegulatorySnapshot: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceId: string;
                    sourceUrl: string;
                    rawPayload?: string | undefined;
                    rawText?: string | undefined;
                    rawStorageKey?: string | undefined;
                    title?: string | undefined;
                    httpStatus?: number | undefined;
                    contentType?: string | undefined;
                    etag?: string | undefined;
                    lastModified?: string | undefined;
                    metadata?: Record<string, unknown> | undefined;
                };
                output: import("../../modules/regulatory-intelligence/domain").SnapshotIngestResult;
                meta: object;
            }>;
            createRegulatorySourceItem: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    dedupeKey: string;
                    sourceId: string;
                    regulator: string;
                    title: string;
                    summary: string;
                    primarySnapshotId?: string | undefined;
                    jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                    officialTitle?: string | undefined;
                    informationType?: "OTHER" | "CONSULTATION" | "DRAFT_REGULATION" | "CIRCULAR" | "NOTICE" | "GAZETTE_NOTICE" | "GUIDANCE" | "DIRECTIVE" | "LEGISLATIVE_UPDATE" | "POLICY_UPDATE" | "ENFORCEMENT" | "LICENSING_UPDATE" | "OFFICIAL_ANNOUNCEMENT" | "MARKET_DEVELOPMENT" | undefined;
                    regulatoryStage?: "DRAFT" | "SUPERSEDED" | "CONSULTATION" | "PROPOSED" | "ANNOUNCED" | "ISSUED" | "GAZETTED" | "EFFECTIVE" | "DEVELOPING" | "WITHDRAWN" | undefined;
                    verificationState?: "UNVERIFIED" | "SOURCE_VERIFIED" | "FACT_VERIFIED" | "REQUIRES_REVIEW" | "DISPUTED" | undefined;
                    materiality?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                    relevanceScore?: number | undefined;
                    publicationDate?: string | undefined;
                    effectiveDate?: string | undefined;
                    consultationDeadline?: string | undefined;
                    complianceDeadline?: string | undefined;
                    affectedSectors?: string[] | undefined;
                    affectedEntityTypes?: string[] | undefined;
                    topics?: string[] | undefined;
                    metadata?: Record<string, unknown> | undefined;
                };
                output: {
                    id: string;
                    dedupeKey: string;
                    jurisdictionCode: string;
                    regulator: string;
                    title: string;
                    informationType: import(".prisma/client").$Enums.RegulatoryInformationType;
                    regulatoryStage: import(".prisma/client").$Enums.RegulatoryStage;
                    materiality: import(".prisma/client").$Enums.RegulatoryMateriality;
                    createdAt: string;
                };
                meta: object;
            }>;
            getRegulatorySourceItem: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    itemId: string;
                };
                output: {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string;
                    createdAt: Date;
                    updatedAt: Date;
                    effectiveDate: Date | null;
                    summary: string;
                    jurisdictionCode: string;
                    regulator: string;
                    publicationDate: Date | null;
                    supersededById: string | null;
                    sourceId: string;
                    dedupeKey: string;
                    primarySnapshotId: string | null;
                    officialTitle: string | null;
                    informationType: import(".prisma/client").$Enums.RegulatoryInformationType;
                    regulatoryStage: import(".prisma/client").$Enums.RegulatoryStage;
                    verificationState: import(".prisma/client").$Enums.RegulatoryVerificationState;
                    materiality: import(".prisma/client").$Enums.RegulatoryMateriality;
                    relevanceScore: number | null;
                    consultationDeadline: Date | null;
                    complianceDeadline: Date | null;
                    affectedSectors: import("@prisma/client/runtime/client").JsonValue;
                    affectedEntityTypes: import("@prisma/client/runtime/client").JsonValue;
                    topics: import("@prisma/client/runtime/client").JsonValue;
                    firstDetectedAt: Date;
                    lastObservedAt: Date;
                };
                meta: object;
            }>;
            listRegulatorySourceItems: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceId?: string | undefined;
                    jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                    regulator?: string | undefined;
                    informationType?: "OTHER" | "CONSULTATION" | "DRAFT_REGULATION" | "CIRCULAR" | "NOTICE" | "GAZETTE_NOTICE" | "GUIDANCE" | "DIRECTIVE" | "LEGISLATIVE_UPDATE" | "POLICY_UPDATE" | "ENFORCEMENT" | "LICENSING_UPDATE" | "OFFICIAL_ANNOUNCEMENT" | "MARKET_DEVELOPMENT" | undefined;
                    regulatoryStage?: "DRAFT" | "SUPERSEDED" | "CONSULTATION" | "PROPOSED" | "ANNOUNCED" | "ISSUED" | "GAZETTED" | "EFFECTIVE" | "DEVELOPING" | "WITHDRAWN" | undefined;
                    verificationState?: "UNVERIFIED" | "SOURCE_VERIFIED" | "FACT_VERIFIED" | "REQUIRES_REVIEW" | "DISPUTED" | undefined;
                    materiality?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                    limit?: number | undefined;
                    offset?: number | undefined;
                };
                output: {
                    items: import(".prisma/client").RegulatorySourceItem[];
                    total: number;
                };
                meta: object;
            }>;
            createRegulatoryAlertDraft: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceItemId: string;
                    automationDraftKey: string;
                    title?: string | undefined;
                    summary?: string | undefined;
                    body?: string | undefined;
                    category?: string | undefined;
                    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                    effectiveDate?: string | undefined;
                    expiresAt?: string | undefined;
                    sourceUrl?: string | undefined;
                };
                output: {
                    alertId: string;
                    title: string;
                    summary: string;
                    jurisdictionCode: string;
                    regulatoryBody: string;
                    category: string;
                    severity: string;
                    isActive: boolean;
                    automationDraftKey: string | null;
                    primaryRegulatorySourceItemId: string | null;
                    isNew: boolean;
                };
                meta: object;
            }>;
            getRegulatorySnapshot: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    snapshotId: string;
                };
                output: {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    title: string | null;
                    createdAt: Date;
                    contentType: string | null;
                    retrievedAt: Date;
                    contentHash: string;
                    sourceId: string;
                    sourceUrl: string;
                    canonicalUrl: string;
                    hashVersion: number;
                    normalizationVersion: number;
                    contentLength: number;
                    httpStatus: number | null;
                    etag: string | null;
                    lastModified: string | null;
                    rawText: string | null;
                    rawPayload: string | null;
                    rawStorageKey: string | null;
                };
                meta: object;
            }>;
            processRegulatorySnapshot: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    snapshotId: string;
                    correlationId?: string | undefined;
                };
                output: import("../../modules/regulatory-intelligence/domain").ProcessRegulatorySnapshotResult;
                meta: object;
            }>;
            listPendingRegulatorySnapshots: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    limit?: number | undefined;
                } | undefined;
                output: {
                    snapshots: Array<{
                        id: string;
                        sourceId: string;
                        sourceKey: string;
                        jurisdictionCode: string;
                        regulatoryBody: string;
                        canonicalUrl: string;
                        retrievedAt: Date;
                    }>;
                    total: number;
                };
                meta: object;
            }>;
        }>>;
        productBi: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            runReport: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey?: string | undefined;
                    windowDays?: number | undefined;
                } | undefined;
                output: import("../../modules/agents/product-bi/types").ProductBiRunResult;
                meta: object;
            }>;
            getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
                input: void;
                output: import("../../modules/agents/product-bi/product-bi.agent").LatestReportRow | null;
                meta: object;
            }>;
            listReports: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    page?: number | undefined;
                    limit?: number | undefined;
                };
                output: {
                    reports: import("../../modules/agents/product-bi/product-bi.agent").LatestReportRow[];
                    pagination: {
                        page: number;
                        limit: number;
                        total: number;
                        pages: number;
                    };
                };
                meta: object;
            }>;
        }>>;
        securityOps: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            runReport: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey?: string | undefined;
                    windowDays?: number | undefined;
                } | undefined;
                output: import("../../modules/agents/security-ops/types").SecurityOpsRunResult;
                meta: object;
            }>;
            getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
                input: void;
                output: import("../../modules/agents/security-ops/security-ops.agent").LatestReportRow | null;
                meta: object;
            }>;
            listReports: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    page?: number | undefined;
                    limit?: number | undefined;
                };
                output: {
                    reports: import("../../modules/agents/security-ops/security-ops.agent").LatestReportRow[];
                    pagination: {
                        page: number;
                        limit: number;
                        total: number;
                        pages: number;
                    };
                };
                meta: object;
            }>;
        }>>;
        chiefOfStaff: import("@trpc/server").TRPCBuiltRouter<{
            ctx: import("./context").Context;
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
            runBrief: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    idempotencyKey?: string | undefined;
                } | undefined;
                output: import("../../modules/agents/chief-of-staff/types").ChiefOfStaffRunResult;
                meta: object;
            }>;
            getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
                input: void;
                output: import("../../modules/agents/chief-of-staff/chief-of-staff.agent").LatestReportRow | null;
                meta: object;
            }>;
            listReports: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    page?: number | undefined;
                    limit?: number | undefined;
                };
                output: {
                    reports: import("../../modules/agents/chief-of-staff/chief-of-staff.agent").LatestReportRow[];
                    pagination: {
                        page: number;
                        limit: number;
                        total: number;
                        pages: number;
                    };
                };
                meta: object;
            }>;
        }>>;
    }>>;
    regulatorySource: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        createSource: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceKey: string;
                name: string;
                regulatoryBody: string;
                baseUrl: string;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                authorityType?: "PRIMARY_OFFICIAL" | "AUTHORITATIVE" | "SECONDARY_VERIFIED" | undefined;
                sourceType?: "WEBSITE" | "FEED_RSS" | "GAZETTE_FEED" | "API" | "PORTAL" | undefined;
                fetchUrl?: string | undefined;
                isActive?: boolean | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                regulatoryBody: string;
                jurisdictionCode: string;
                isActive: boolean;
                authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
                baseUrl: string;
                sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
                sourceKey: string;
                fetchUrl: string | null;
                lastCheckedAt: Date | null;
                lastSuccessfulFetchAt: Date | null;
                lastFailureAt: Date | null;
                failureCount: number;
                lastFailureReason: string | null;
            };
            meta: object;
        }>;
        updateSource: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            } & {
                name?: string | undefined;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                regulatoryBody?: string | undefined;
                authorityType?: "PRIMARY_OFFICIAL" | "AUTHORITATIVE" | "SECONDARY_VERIFIED" | undefined;
                sourceType?: "WEBSITE" | "FEED_RSS" | "GAZETTE_FEED" | "API" | "PORTAL" | undefined;
                baseUrl?: string | undefined;
                fetchUrl?: string | null | undefined;
                isActive?: boolean | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                regulatoryBody: string;
                jurisdictionCode: string;
                isActive: boolean;
                authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
                baseUrl: string;
                sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
                sourceKey: string;
                fetchUrl: string | null;
                lastCheckedAt: Date | null;
                lastSuccessfulFetchAt: Date | null;
                lastFailureAt: Date | null;
                failureCount: number;
                lastFailureReason: string | null;
            };
            meta: object;
        }>;
        deactivateSource: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                regulatoryBody: string;
                jurisdictionCode: string;
                isActive: boolean;
                authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
                baseUrl: string;
                sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
                sourceKey: string;
                fetchUrl: string | null;
                lastCheckedAt: Date | null;
                lastSuccessfulFetchAt: Date | null;
                lastFailureAt: Date | null;
                failureCount: number;
                lastFailureReason: string | null;
            };
            meta: object;
        }>;
        getSource: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                regulatoryBody: string;
                jurisdictionCode: string;
                isActive: boolean;
                authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
                baseUrl: string;
                sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
                sourceKey: string;
                fetchUrl: string | null;
                lastCheckedAt: Date | null;
                lastSuccessfulFetchAt: Date | null;
                lastFailureAt: Date | null;
                failureCount: number;
                lastFailureReason: string | null;
            };
            meta: object;
        }>;
        listSources: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                regulatoryBody?: string | undefined;
                authorityType?: "PRIMARY_OFFICIAL" | "AUTHORITATIVE" | "SECONDARY_VERIFIED" | undefined;
                isActive?: boolean | undefined;
                limit?: number | undefined;
                offset?: number | undefined;
            };
            output: {
                sources: import(".prisma/client").RegulatorySource[];
                total: number;
            };
            meta: object;
        }>;
        testConnection: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                ok: boolean;
                httpStatus: number;
                latencyMs: number;
                contentType?: string;
                previewText?: string;
                error?: string;
            };
            meta: object;
        }>;
    }>>;
    passkey: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context").Context;
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
        generateRegistrationOptions: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: import("@simplewebauthn/types").PublicKeyCredentialCreationOptionsJSON;
            meta: object;
        }>;
        verifyRegistration: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                response: {
                    id: string;
                    rawId: string;
                    response: {
                        clientDataJSON: string;
                        attestationObject: string;
                        transports?: string[] | undefined;
                        authenticatorData?: string | undefined;
                    };
                    type: "public-key";
                    authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                    clientExtensionResults?: Record<string, any> | undefined;
                };
                deviceName?: string | undefined;
            };
            output: {
                id: string;
                createdAt: Date;
                deviceName: string | null;
            };
            meta: object;
        }>;
        generateAuthenticationOptions: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userHandle?: string | undefined;
            };
            output: {
                options: import("@simplewebauthn/types").PublicKeyCredentialRequestOptionsJSON;
                challengeId: string;
            };
            meta: object;
        }>;
        verifyAuthentication: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                challengeId: string;
                response: {
                    id: string;
                    rawId: string;
                    response: {
                        clientDataJSON: string;
                        authenticatorData: string;
                        signature: string;
                        userHandle?: string | null | undefined;
                    };
                    type: "public-key";
                    authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                    clientExtensionResults?: Record<string, any> | undefined;
                };
            };
            output: import("../services/session.service").SessionResponsePayload;
            meta: object;
        }>;
        listUserPasskeys: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                createdAt: Date;
                deviceName: string | null;
                transports: string[];
                backedUp: boolean;
                lastUsedAt: Date | null;
            }[];
            meta: object;
        }>;
        renamePasskey: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                deviceName: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        deletePasskey: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                remainingPasskeyCount: number;
            };
            meta: object;
        }>;
    }>>;
}>>;
/**
 * Export type definition of API
 *
 * This type is used on the frontend for end-to-end type safety.
 * The frontend can import this type to get full autocomplete and
 * type checking for all API calls.
 *
 * @example
 * // On frontend:
 * import type { AppRouter } from '@/server/trpc/router';
 *
 * const client = createTRPCProxyClient<AppRouter>({
 *   links: [httpBatchLink({ url: 'http://localhost:3001/trpc' })],
 * });
 */
export type AppRouter = typeof appRouter;
//# sourceMappingURL=router.d.ts.map