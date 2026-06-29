export declare class BlogEditorialDigestService {
    /**
     * Generates a blog editorial digest for the specified period.
     * By default, calculates for the last 7 days.
     * If a digest already exists for this exact period, it will return the existing one
     * unless force=true is passed.
     */
    generateBlogEditorialDigest(params?: {
        periodStart?: Date;
        periodEnd?: Date;
        force?: boolean;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        errorMessage: string | null;
        generatedAt: Date;
        periodStart: Date;
        periodEnd: Date;
        sentAt: Date | null;
        sourceMonitorsChecked: number;
        sourceItemsDiscovered: number;
        highPrioritySuggestions: number;
        urgentSuggestions: number;
        approvedAwaitingDraft: number;
        draftsAwaitingVerification: number;
        blockedDrafts: number;
        failingMonitors: number;
        summaryJson: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getDigests(page?: number, limit?: number): Promise<{
        items: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            errorMessage: string | null;
            generatedAt: Date;
            periodStart: Date;
            periodEnd: Date;
            sentAt: Date | null;
            sourceMonitorsChecked: number;
            sourceItemsDiscovered: number;
            highPrioritySuggestions: number;
            urgentSuggestions: number;
            approvedAwaitingDraft: number;
            draftsAwaitingVerification: number;
            blockedDrafts: number;
            failingMonitors: number;
            summaryJson: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDigestById(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        errorMessage: string | null;
        generatedAt: Date;
        periodStart: Date;
        periodEnd: Date;
        sentAt: Date | null;
        sourceMonitorsChecked: number;
        sourceItemsDiscovered: number;
        highPrioritySuggestions: number;
        urgentSuggestions: number;
        approvedAwaitingDraft: number;
        draftsAwaitingVerification: number;
        blockedDrafts: number;
        failingMonitors: number;
        summaryJson: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
export declare const blogEditorialDigestService: BlogEditorialDigestService;
//# sourceMappingURL=blog-editorial-digest.service.d.ts.map