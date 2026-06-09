export declare const licenseRouter: import("@trpc/server").TRPCBuiltRouter<{
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
                status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    plan: import("@prisma/client").$Enums.SubscriptionPlan;
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
                status: import("@prisma/client").$Enums.LicenseStatus;
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
                plan: import("@prisma/client").$Enums.SubscriptionPlan;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                    status: import("@prisma/client").$Enums.VaultDocumentStatus;
                    name: string;
                    category: import("@prisma/client").$Enums.DocumentCategory;
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
                amount: import("@prisma/client/runtime/client").Decimal | null;
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
            status: import("@prisma/client").$Enums.LicenseStatus;
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
//# sourceMappingURL=license.router.d.ts.map