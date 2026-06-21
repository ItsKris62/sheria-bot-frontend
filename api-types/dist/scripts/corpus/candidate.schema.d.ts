/**
 * Candidate Manifest Schema
 *
 * Defines the Zod schema for candidate document manifests. Candidates are
 * documents discovered from official sources that require human review before
 * becoming part of the production corpus.
 *
 * Candidate manifests live under `documents/_incoming/<country>/candidate-manifest.json`.
 */
import { z } from 'zod';
export declare const CandidateDecisionEnum: z.ZodEnum<{
    SUPERSEDED: "SUPERSEDED";
    APPROVED: "APPROVED";
    REJECTED: "REJECTED";
    DUPLICATE: "DUPLICATE";
    NEEDS_REVIEW: "NEEDS_REVIEW";
}>;
export type CandidateDecision = z.infer<typeof CandidateDecisionEnum>;
export declare const CandidateCountryEnum: z.ZodEnum<{
    Malawi: "Malawi";
    Nigeria: "Nigeria";
}>;
export type CandidateCountry = z.infer<typeof CandidateCountryEnum>;
export declare const CandidateJurisdictionCodeEnum: z.ZodEnum<{
    MW: "MW";
    NG: "NG";
}>;
export type CandidateJurisdictionCode = z.infer<typeof CandidateJurisdictionCodeEnum>;
export declare const CandidatePriorityEnum: z.ZodEnum<{
    UNKNOWN: "UNKNOWN";
    P0: "P0";
    P1: "P1";
    P2: "P2";
}>;
export type CandidatePriority = z.infer<typeof CandidatePriorityEnum>;
export declare const CANDIDATE_COUNTRY_JURISDICTION_MAP: Record<CandidateCountry, CandidateJurisdictionCode>;
export declare const CandidateEntrySchema: z.ZodObject<{
    id: z.ZodString;
    country: z.ZodEnum<{
        Malawi: "Malawi";
        Nigeria: "Nigeria";
    }>;
    jurisdictionCode: z.ZodEnum<{
        MW: "MW";
        NG: "NG";
    }>;
    discoveredTitle: z.ZodString;
    normalizedTitle: z.ZodString;
    sourceUrl: z.ZodString;
    sourcePageUrl: z.ZodString;
    regulator: z.ZodString;
    suggestedCategory: z.ZodEnum<{
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
    suggestedDocumentType: z.ZodEnum<{
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
    suggestedAuthorityStatus: z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_FORCE: "IN_FORCE";
        SUPERSEDED: "SUPERSEDED";
        CONSULTATION: "CONSULTATION";
        REPORT: "REPORT";
        UNKNOWN: "UNKNOWN";
        GUIDANCE: "GUIDANCE";
    }>;
    suggestedIsBinding: z.ZodNullable<z.ZodBoolean>;
    priority: z.ZodEnum<{
        UNKNOWN: "UNKNOWN";
        P0: "P0";
        P1: "P1";
        P2: "P2";
    }>;
    decision: z.ZodEnum<{
        SUPERSEDED: "SUPERSEDED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        DUPLICATE: "DUPLICATE";
        NEEDS_REVIEW: "NEEDS_REVIEW";
    }>;
    decisionReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reviewedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reviewedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discoveredAt: z.ZodString;
    contentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fileExtension: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    proposedLocalPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    downloadedLocalPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    duplicateOf: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodArray<z.ZodString>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CandidateEntry = z.infer<typeof CandidateEntrySchema>;
export declare const CandidateManifestSchema: z.ZodObject<{
    version: z.ZodNumber;
    country: z.ZodEnum<{
        Malawi: "Malawi";
        Nigeria: "Nigeria";
    }>;
    jurisdictionCode: z.ZodEnum<{
        MW: "MW";
        NG: "NG";
    }>;
    discoveredAt: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        country: z.ZodEnum<{
            Malawi: "Malawi";
            Nigeria: "Nigeria";
        }>;
        jurisdictionCode: z.ZodEnum<{
            MW: "MW";
            NG: "NG";
        }>;
        discoveredTitle: z.ZodString;
        normalizedTitle: z.ZodString;
        sourceUrl: z.ZodString;
        sourcePageUrl: z.ZodString;
        regulator: z.ZodString;
        suggestedCategory: z.ZodEnum<{
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
        suggestedDocumentType: z.ZodEnum<{
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
        suggestedAuthorityStatus: z.ZodEnum<{
            DRAFT: "DRAFT";
            IN_FORCE: "IN_FORCE";
            SUPERSEDED: "SUPERSEDED";
            CONSULTATION: "CONSULTATION";
            REPORT: "REPORT";
            UNKNOWN: "UNKNOWN";
            GUIDANCE: "GUIDANCE";
        }>;
        suggestedIsBinding: z.ZodNullable<z.ZodBoolean>;
        priority: z.ZodEnum<{
            UNKNOWN: "UNKNOWN";
            P0: "P0";
            P1: "P1";
            P2: "P2";
        }>;
        decision: z.ZodEnum<{
            SUPERSEDED: "SUPERSEDED";
            APPROVED: "APPROVED";
            REJECTED: "REJECTED";
            DUPLICATE: "DUPLICATE";
            NEEDS_REVIEW: "NEEDS_REVIEW";
        }>;
        decisionReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reviewedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reviewedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        discoveredAt: z.ZodString;
        contentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fileExtension: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        proposedLocalPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        downloadedLocalPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        duplicateOf: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        tags: z.ZodArray<z.ZodString>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CandidateManifest = z.infer<typeof CandidateManifestSchema>;
//# sourceMappingURL=candidate.schema.d.ts.map