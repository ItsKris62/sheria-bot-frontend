/**
 * Corpus Manifest Schema
 *
 * Defines the Zod schema and TypeScript types for per-country corpus manifest
 * files. Each manifest lives at `documents/<country>/manifest.json` and
 * declares every document that belongs to that country's regulatory corpus.
 *
 * Phase 2 — read-only validation and inventory. Does NOT drive ingestion yet.
 */
import { z } from 'zod';
export declare const CountryEnum: z.ZodEnum<{
    Kenya: "Kenya";
    Malawi: "Malawi";
    Nigeria: "Nigeria";
    International: "International";
}>;
export type Country = z.infer<typeof CountryEnum>;
export declare const JurisdictionCodeEnum: z.ZodEnum<{
    KE: "KE";
    MW: "MW";
    NG: "NG";
    GLOBAL: "GLOBAL";
    EU: "EU";
    INTL: "INTL";
}>;
export type JurisdictionCode = z.infer<typeof JurisdictionCodeEnum>;
export declare const ScopeEnum: z.ZodEnum<{
    REGIONAL: "REGIONAL";
    COUNTRY: "COUNTRY";
    INTERNATIONAL: "INTERNATIONAL";
}>;
export type Scope = z.infer<typeof ScopeEnum>;
export declare const CategoryEnum: z.ZodEnum<{
    other: "other";
    guidance: "guidance";
    payments: "payments";
    microfinance: "microfinance";
    insurance: "insurance";
    banking: "banking";
    cybersecurity: "cybersecurity";
    core: "core";
    "aml-cft": "aml-cft";
    "data-protection": "data-protection";
    "consumer-protection": "consumer-protection";
    "capital-markets": "capital-markets";
    "digital-lending": "digital-lending";
    "open-banking": "open-banking";
    tax: "tax";
    "ai-governance": "ai-governance";
    cloud: "cloud";
    ict: "ict";
    accessibility: "accessibility";
}>;
export type Category = z.infer<typeof CategoryEnum>;
export declare const DocumentTypeEnum: z.ZodEnum<{
    DRAFT: "DRAFT";
    OTHER: "OTHER";
    REGULATION: "REGULATION";
    CIRCULAR: "CIRCULAR";
    GUIDELINE: "GUIDELINE";
    POLICY: "POLICY";
    STANDARD: "STANDARD";
    ACT: "ACT";
    DIRECTIVE: "DIRECTIVE";
    REPORT: "REPORT";
    FRAMEWORK: "FRAMEWORK";
    CHECKLIST: "CHECKLIST";
}>;
export type DocumentType = z.infer<typeof DocumentTypeEnum>;
export declare const AuthorityStatusEnum: z.ZodEnum<{
    DRAFT: "DRAFT";
    IN_FORCE: "IN_FORCE";
    SUPERSEDED: "SUPERSEDED";
    CONSULTATION: "CONSULTATION";
    REPORT: "REPORT";
    UNKNOWN: "UNKNOWN";
    GUIDANCE: "GUIDANCE";
}>;
export type AuthorityStatus = z.infer<typeof AuthorityStatusEnum>;
export declare const ReviewStatusEnum: z.ZodEnum<{
    SUPERSEDED: "SUPERSEDED";
    APPROVED: "APPROVED";
    REJECTED: "REJECTED";
    NEEDS_REVIEW: "NEEDS_REVIEW";
    PLACEHOLDER: "PLACEHOLDER";
}>;
export type ReviewStatus = z.infer<typeof ReviewStatusEnum>;
export declare const PriorityEnum: z.ZodEnum<{
    UNKNOWN: "UNKNOWN";
    P0: "P0";
    P1: "P1";
    P2: "P2";
}>;
export type Priority = z.infer<typeof PriorityEnum>;
export declare const COUNTRY_JURISDICTION_MAP: Record<Country, JurisdictionCode[]>;
export declare const CorpusManifestEntrySchema: z.ZodObject<{
    id: z.ZodString;
    country: z.ZodEnum<{
        Kenya: "Kenya";
        Malawi: "Malawi";
        Nigeria: "Nigeria";
        International: "International";
    }>;
    jurisdictionCode: z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        NG: "NG";
        GLOBAL: "GLOBAL";
        EU: "EU";
        INTL: "INTL";
    }>;
    scope: z.ZodEnum<{
        REGIONAL: "REGIONAL";
        COUNTRY: "COUNTRY";
        INTERNATIONAL: "INTERNATIONAL";
    }>;
    category: z.ZodEnum<{
        other: "other";
        guidance: "guidance";
        payments: "payments";
        microfinance: "microfinance";
        insurance: "insurance";
        banking: "banking";
        cybersecurity: "cybersecurity";
        core: "core";
        "aml-cft": "aml-cft";
        "data-protection": "data-protection";
        "consumer-protection": "consumer-protection";
        "capital-markets": "capital-markets";
        "digital-lending": "digital-lending";
        "open-banking": "open-banking";
        tax: "tax";
        "ai-governance": "ai-governance";
        cloud: "cloud";
        ict: "ict";
        accessibility: "accessibility";
    }>;
    regulator: z.ZodString;
    title: z.ZodString;
    documentType: z.ZodEnum<{
        DRAFT: "DRAFT";
        OTHER: "OTHER";
        REGULATION: "REGULATION";
        CIRCULAR: "CIRCULAR";
        GUIDELINE: "GUIDELINE";
        POLICY: "POLICY";
        STANDARD: "STANDARD";
        ACT: "ACT";
        DIRECTIVE: "DIRECTIVE";
        REPORT: "REPORT";
        FRAMEWORK: "FRAMEWORK";
        CHECKLIST: "CHECKLIST";
    }>;
    authorityStatus: z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_FORCE: "IN_FORCE";
        SUPERSEDED: "SUPERSEDED";
        CONSULTATION: "CONSULTATION";
        REPORT: "REPORT";
        UNKNOWN: "UNKNOWN";
        GUIDANCE: "GUIDANCE";
    }>;
    isBinding: z.ZodBoolean;
    localPath: z.ZodString;
    sourceUrl: z.ZodNullable<z.ZodString>;
    checksumSha256: z.ZodNullable<z.ZodString>;
    reviewStatus: z.ZodEnum<{
        SUPERSEDED: "SUPERSEDED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        NEEDS_REVIEW: "NEEDS_REVIEW";
        PLACEHOLDER: "PLACEHOLDER";
    }>;
    priority: z.ZodEnum<{
        UNKNOWN: "UNKNOWN";
        P0: "P0";
        P1: "P1";
        P2: "P2";
    }>;
    tags: z.ZodArray<z.ZodString>;
    effectiveDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    publicationDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    version: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    language: z.ZodOptional<z.ZodString>;
    supersedes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    frameworkSlugs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discoveredFrom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    retrievedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CorpusManifestEntry = z.infer<typeof CorpusManifestEntrySchema>;
export declare const CorpusManifestSchema: z.ZodObject<{
    version: z.ZodNumber;
    country: z.ZodEnum<{
        Kenya: "Kenya";
        Malawi: "Malawi";
        Nigeria: "Nigeria";
        International: "International";
    }>;
    jurisdictionCode: z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        NG: "NG";
        GLOBAL: "GLOBAL";
        EU: "EU";
        INTL: "INTL";
    }>;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        country: z.ZodEnum<{
            Kenya: "Kenya";
            Malawi: "Malawi";
            Nigeria: "Nigeria";
            International: "International";
        }>;
        jurisdictionCode: z.ZodEnum<{
            KE: "KE";
            MW: "MW";
            NG: "NG";
            GLOBAL: "GLOBAL";
            EU: "EU";
            INTL: "INTL";
        }>;
        scope: z.ZodEnum<{
            REGIONAL: "REGIONAL";
            COUNTRY: "COUNTRY";
            INTERNATIONAL: "INTERNATIONAL";
        }>;
        category: z.ZodEnum<{
            other: "other";
            guidance: "guidance";
            payments: "payments";
            microfinance: "microfinance";
            insurance: "insurance";
            banking: "banking";
            cybersecurity: "cybersecurity";
            core: "core";
            "aml-cft": "aml-cft";
            "data-protection": "data-protection";
            "consumer-protection": "consumer-protection";
            "capital-markets": "capital-markets";
            "digital-lending": "digital-lending";
            "open-banking": "open-banking";
            tax: "tax";
            "ai-governance": "ai-governance";
            cloud: "cloud";
            ict: "ict";
            accessibility: "accessibility";
        }>;
        regulator: z.ZodString;
        title: z.ZodString;
        documentType: z.ZodEnum<{
            DRAFT: "DRAFT";
            OTHER: "OTHER";
            REGULATION: "REGULATION";
            CIRCULAR: "CIRCULAR";
            GUIDELINE: "GUIDELINE";
            POLICY: "POLICY";
            STANDARD: "STANDARD";
            ACT: "ACT";
            DIRECTIVE: "DIRECTIVE";
            REPORT: "REPORT";
            FRAMEWORK: "FRAMEWORK";
            CHECKLIST: "CHECKLIST";
        }>;
        authorityStatus: z.ZodEnum<{
            DRAFT: "DRAFT";
            IN_FORCE: "IN_FORCE";
            SUPERSEDED: "SUPERSEDED";
            CONSULTATION: "CONSULTATION";
            REPORT: "REPORT";
            UNKNOWN: "UNKNOWN";
            GUIDANCE: "GUIDANCE";
        }>;
        isBinding: z.ZodBoolean;
        localPath: z.ZodString;
        sourceUrl: z.ZodNullable<z.ZodString>;
        checksumSha256: z.ZodNullable<z.ZodString>;
        reviewStatus: z.ZodEnum<{
            SUPERSEDED: "SUPERSEDED";
            APPROVED: "APPROVED";
            REJECTED: "REJECTED";
            NEEDS_REVIEW: "NEEDS_REVIEW";
            PLACEHOLDER: "PLACEHOLDER";
        }>;
        priority: z.ZodEnum<{
            UNKNOWN: "UNKNOWN";
            P0: "P0";
            P1: "P1";
            P2: "P2";
        }>;
        tags: z.ZodArray<z.ZodString>;
        effectiveDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publicationDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        version: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        language: z.ZodOptional<z.ZodString>;
        supersedes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        frameworkSlugs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        discoveredFrom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        retrievedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CorpusManifest = z.infer<typeof CorpusManifestSchema>;
//# sourceMappingURL=manifest.schema.d.ts.map