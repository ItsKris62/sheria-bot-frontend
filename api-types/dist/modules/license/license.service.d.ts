import { LicenseStatus, Prisma } from '@prisma/client';
export declare class LicenseService {
    private assertAssignableMember;
    private assertVaultDocument;
    private requireLicense;
    private ensureManager;
    private syncLicenseCalendarEvents;
    private upsertDateCalendarEvent;
    list(params: {
        organizationId: string;
        status?: LicenseStatus;
        search?: string;
        includeArchived?: boolean;
        page: number;
        limit: number;
    }): Promise<{
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
    }>;
    get(params: {
        organizationId: string;
        id: string;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    create(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        input: any;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    update(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        input: any;
        adminOverrideReason?: string;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    archive(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        id: string;
    }): Promise<{
        success: boolean;
    }>;
    addTimelineEvent(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        input: any;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    updateTimelineEvent(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        input: any;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    completeTimelineEvent(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        id: string;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    addDocument(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        input: any;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    removeDocument(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        id: string;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    addFee(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        input: any;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    updateFee(params: {
        organizationId: string;
        actorUserId: string;
        actorRole: string;
        input: any;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
    upcoming(params: {
        organizationId: string;
        daysAhead: number;
    }): Promise<({
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
    })[]>;
    summary(params: {
        organizationId: string;
    }): Promise<{
        total: number;
        active: number;
        renewalDueSoon: number;
        expired: number;
    }>;
    adminList(params: {
        actorUserId: string;
        organizationId?: string;
        status?: LicenseStatus;
        search?: string;
        includeArchived?: boolean;
        page: number;
        limit: number;
    }): Promise<{
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
    }>;
    adminGet(params: {
        actorUserId: string;
        id: string;
        reason?: string;
    }): Promise<{
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
            dueDate: Date | null;
            completedAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            licenseId: string;
            eventType: string;
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
            amount: Prisma.Decimal | null;
            paidAt: Date | null;
            createdByUserId: string;
            updatedByUserId: string | null;
            currency: string;
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
    }>;
}
export declare const licenseService: LicenseService;
//# sourceMappingURL=license.service.d.ts.map