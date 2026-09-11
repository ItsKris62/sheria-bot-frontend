import type { RegulatorySource } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type CreateRegulatorySourceInput, type UpdateRegulatorySourceInput, type ListRegulatorySourcesInput } from './types';
export declare class RegulatorySourceService {
    private readonly prisma;
    constructor(prisma?: typeof defaultPrisma);
    /**
     * Admin-controlled creation of a new regulatory source monitor.
     * Validates URLs at creation time against SSRF protections.
     */
    createSource(input: CreateRegulatorySourceInput): Promise<RegulatorySource>;
    /**
     * Admin-controlled update of a regulatory source.
     */
    updateSource(id: string, input: UpdateRegulatorySourceInput): Promise<RegulatorySource>;
    getSource(id: string): Promise<RegulatorySource>;
    getSourceByKey(sourceKey: string): Promise<RegulatorySource | null>;
    listSources(input: ListRegulatorySourcesInput): Promise<{
        sources: RegulatorySource[];
        total: number;
    }>;
    deactivateSource(id: string): Promise<RegulatorySource>;
    recordFetchResult(id: string, result: {
        success: boolean;
        error?: string;
        timestamp?: Date;
    }): Promise<void>;
}
export declare const regulatorySourceService: RegulatorySourceService;
//# sourceMappingURL=regulatory-source.service.d.ts.map