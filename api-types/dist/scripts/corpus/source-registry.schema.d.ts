/**
 * Source Registry Schema
 *
 * Defines the Zod schema for official-source registries. Each country has a
 * JSON registry of regulator/authority websites that may publish legal and
 * regulatory documents relevant to the SheriaBot corpus.
 *
 * Phase 3 — discovery and download automation.
 */
import { z } from 'zod';
export declare const SourceCountryEnum: z.ZodEnum<{
    Malawi: "Malawi";
    Nigeria: "Nigeria";
}>;
export type SourceCountry = z.infer<typeof SourceCountryEnum>;
export declare const SourceJurisdictionCodeEnum: z.ZodEnum<{
    MW: "MW";
    NG: "NG";
}>;
export type SourceJurisdictionCode = z.infer<typeof SourceJurisdictionCodeEnum>;
export declare const SourceTypeEnum: z.ZodEnum<{
    REGULATOR: "REGULATOR";
    OTHER: "OTHER";
    LEGAL_DATABASE: "LEGAL_DATABASE";
    FIU: "FIU";
    DATA_PROTECTION_AUTHORITY: "DATA_PROTECTION_AUTHORITY";
    SECURITIES_REGULATOR: "SECURITIES_REGULATOR";
    CONSUMER_PROTECTION_AUTHORITY: "CONSUMER_PROTECTION_AUTHORITY";
    GOVERNMENT_PORTAL: "GOVERNMENT_PORTAL";
}>;
export type SourceType = z.infer<typeof SourceTypeEnum>;
export declare const CrawlModeEnum: z.ZodEnum<{
    "link-discovery": "link-discovery";
    "publication-table": "publication-table";
    "static-list": "static-list";
    "manual-only": "manual-only";
}>;
export type CrawlMode = z.infer<typeof CrawlModeEnum>;
export declare const SourcePriorityEnum: z.ZodEnum<{
    P0: "P0";
    P1: "P1";
    P2: "P2";
}>;
export type SourcePriority = z.infer<typeof SourcePriorityEnum>;
export declare const SOURCE_COUNTRY_JURISDICTION_MAP: Record<SourceCountry, SourceJurisdictionCode>;
export declare const SourceRegistryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    country: z.ZodEnum<{
        Malawi: "Malawi";
        Nigeria: "Nigeria";
    }>;
    jurisdictionCode: z.ZodEnum<{
        MW: "MW";
        NG: "NG";
    }>;
    regulator: z.ZodString;
    sourceType: z.ZodEnum<{
        REGULATOR: "REGULATOR";
        OTHER: "OTHER";
        LEGAL_DATABASE: "LEGAL_DATABASE";
        FIU: "FIU";
        DATA_PROTECTION_AUTHORITY: "DATA_PROTECTION_AUTHORITY";
        SECURITIES_REGULATOR: "SECURITIES_REGULATOR";
        CONSUMER_PROTECTION_AUTHORITY: "CONSUMER_PROTECTION_AUTHORITY";
        GOVERNMENT_PORTAL: "GOVERNMENT_PORTAL";
    }>;
    baseUrl: z.ZodString;
    allowedDomains: z.ZodArray<z.ZodString>;
    categories: z.ZodArray<z.ZodString>;
    crawlMode: z.ZodEnum<{
        "link-discovery": "link-discovery";
        "publication-table": "publication-table";
        "static-list": "static-list";
        "manual-only": "manual-only";
    }>;
    priority: z.ZodEnum<{
        P0: "P0";
        P1: "P1";
        P2: "P2";
    }>;
    enabled: z.ZodBoolean;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SourceRegistryEntry = z.infer<typeof SourceRegistryEntrySchema>;
export declare const SourceRegistrySchema: z.ZodObject<{
    version: z.ZodNumber;
    country: z.ZodEnum<{
        Malawi: "Malawi";
        Nigeria: "Nigeria";
    }>;
    jurisdictionCode: z.ZodEnum<{
        MW: "MW";
        NG: "NG";
    }>;
    sources: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        country: z.ZodEnum<{
            Malawi: "Malawi";
            Nigeria: "Nigeria";
        }>;
        jurisdictionCode: z.ZodEnum<{
            MW: "MW";
            NG: "NG";
        }>;
        regulator: z.ZodString;
        sourceType: z.ZodEnum<{
            REGULATOR: "REGULATOR";
            OTHER: "OTHER";
            LEGAL_DATABASE: "LEGAL_DATABASE";
            FIU: "FIU";
            DATA_PROTECTION_AUTHORITY: "DATA_PROTECTION_AUTHORITY";
            SECURITIES_REGULATOR: "SECURITIES_REGULATOR";
            CONSUMER_PROTECTION_AUTHORITY: "CONSUMER_PROTECTION_AUTHORITY";
            GOVERNMENT_PORTAL: "GOVERNMENT_PORTAL";
        }>;
        baseUrl: z.ZodString;
        allowedDomains: z.ZodArray<z.ZodString>;
        categories: z.ZodArray<z.ZodString>;
        crawlMode: z.ZodEnum<{
            "link-discovery": "link-discovery";
            "publication-table": "publication-table";
            "static-list": "static-list";
            "manual-only": "manual-only";
        }>;
        priority: z.ZodEnum<{
            P0: "P0";
            P1: "P1";
            P2: "P2";
        }>;
        enabled: z.ZodBoolean;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SourceRegistry = z.infer<typeof SourceRegistrySchema>;
//# sourceMappingURL=source-registry.schema.d.ts.map