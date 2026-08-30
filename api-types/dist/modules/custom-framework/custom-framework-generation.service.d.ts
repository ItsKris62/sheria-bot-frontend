import { z } from 'zod';
import { buildCitationsFromChunks } from '@/lib/source-grounding/citations';
import { regulatoryIntelligenceService } from '@/modules/regulatory-intelligence/regulatory-intelligence.service';
import type { JurisdictionContext } from '@/types/jurisdiction';
declare const generatedFrameworkSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        controls: z.ZodArray<z.ZodObject<{
            code: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            requirement: z.ZodString;
            guidance: z.ZodOptional<z.ZodString>;
            evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
            severity: z.ZodOptional<z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>>;
            frequency: z.ZodOptional<z.ZodString>;
            sourceIndex: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GeneratedCustomFramework = z.infer<typeof generatedFrameworkSchema>;
export declare class CustomFrameworkGenerationError extends Error {
    readonly code: 'NO_ACCEPTED_EVIDENCE' | 'VERIFICATION_FAILURE' | 'PROVIDER_FAILURE';
    constructor(code: 'NO_ACCEPTED_EVIDENCE' | 'VERIFICATION_FAILURE' | 'PROVIDER_FAILURE');
}
export declare function generateCustomFramework(input: {
    intent: string;
    organizationId: string;
    jurisdictionContext: JurisdictionContext;
}): Promise<{
    framework: GeneratedCustomFramework;
    evidence: Awaited<ReturnType<typeof regulatoryIntelligenceService.retrieveAndGrade>>['evidence'];
    citations: ReturnType<typeof buildCitationsFromChunks>;
    metadata: Record<string, unknown>;
}>;
export {};
//# sourceMappingURL=custom-framework-generation.service.d.ts.map