import { z } from 'zod';
export declare const blogJurisdictionSchema: z.ZodEnum<{
    KE: "KE";
    MW: "MW";
    RW: "RW";
    NG: "NG";
    REGIONAL: "REGIONAL";
    GLOBAL: "GLOBAL";
}>;
export declare const blogAuthorityTypeSchema: z.ZodEnum<{
    CENTRAL_BANK: "CENTRAL_BANK";
    DATA_PROTECTION: "DATA_PROTECTION";
    AML_CFT: "AML_CFT";
    COMMUNICATIONS: "COMMUNICATIONS";
    SECURITIES: "SECURITIES";
    CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
    COMPETITION: "COMPETITION";
    GAZETTE: "GAZETTE";
    LEGAL_DATABASE: "LEGAL_DATABASE";
    INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
    DEVELOPMENT_FINANCE: "DEVELOPMENT_FINANCE";
    INDUSTRY_BODY: "INDUSTRY_BODY";
    INTERNAL: "INTERNAL";
    OTHER: "OTHER";
}>;
export declare const blogMonitoringMethodSchema: z.ZodEnum<{
    RSS: "RSS";
    HTML_LISTING: "HTML_LISTING";
    API: "API";
    MANUAL: "MANUAL";
}>;
export declare const blogMonitorStatusSchema: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    INACTIVE: "INACTIVE";
    NEEDS_VERIFICATION: "NEEDS_VERIFICATION";
    FAILING: "FAILING";
}>;
export declare const blogSourceTypeSchema: z.ZodEnum<{
    OFFICIAL: "OFFICIAL";
    THIRD_PARTY: "THIRD_PARTY";
    INTERNAL: "INTERNAL";
    MEDIA: "MEDIA";
    INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
}>;
export declare const blogSourceItemStatusSchema: z.ZodEnum<{
    NEW: "NEW";
    READY_FOR_SCORING: "READY_FOR_SCORING";
    SCORED: "SCORED";
    DUPLICATE: "DUPLICATE";
    DISMISSED: "DISMISSED";
    FETCH_FAILED: "FETCH_FAILED";
    CONVERTED_TO_SUGGESTION: "CONVERTED_TO_SUGGESTION";
}>;
export declare const blogDiscoveryRunStatusSchema: z.ZodEnum<{
    RUNNING: "RUNNING";
    SUCCESS: "SUCCESS";
    PARTIAL_SUCCESS: "PARTIAL_SUCCESS";
    FAILED: "FAILED";
    SKIPPED_LOCKED: "SKIPPED_LOCKED";
}>;
export declare const adminListMonitorsSchema: z.ZodObject<{
    jurisdiction: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
        REGIONAL: "REGIONAL";
        GLOBAL: "GLOBAL";
    }>>;
    authorityType: z.ZodOptional<z.ZodEnum<{
        CENTRAL_BANK: "CENTRAL_BANK";
        DATA_PROTECTION: "DATA_PROTECTION";
        AML_CFT: "AML_CFT";
        COMMUNICATIONS: "COMMUNICATIONS";
        SECURITIES: "SECURITIES";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        COMPETITION: "COMPETITION";
        GAZETTE: "GAZETTE";
        LEGAL_DATABASE: "LEGAL_DATABASE";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
        DEVELOPMENT_FINANCE: "DEVELOPMENT_FINANCE";
        INDUSTRY_BODY: "INDUSTRY_BODY";
        INTERNAL: "INTERNAL";
        OTHER: "OTHER";
    }>>;
    sourceType: z.ZodOptional<z.ZodEnum<{
        OFFICIAL: "OFFICIAL";
        THIRD_PARTY: "THIRD_PARTY";
        INTERNAL: "INTERNAL";
        MEDIA: "MEDIA";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
    }>>;
    monitoringMethod: z.ZodOptional<z.ZodEnum<{
        RSS: "RSS";
        HTML_LISTING: "HTML_LISTING";
        API: "API";
        MANUAL: "MANUAL";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        NEEDS_VERIFICATION: "NEEDS_VERIFICATION";
        FAILING: "FAILING";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const adminGetMonitorSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const adminCreateMonitorSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    jurisdiction: z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
        REGIONAL: "REGIONAL";
        GLOBAL: "GLOBAL";
    }>;
    countryLabel: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    authorityType: z.ZodEnum<{
        CENTRAL_BANK: "CENTRAL_BANK";
        DATA_PROTECTION: "DATA_PROTECTION";
        AML_CFT: "AML_CFT";
        COMMUNICATIONS: "COMMUNICATIONS";
        SECURITIES: "SECURITIES";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        COMPETITION: "COMPETITION";
        GAZETTE: "GAZETTE";
        LEGAL_DATABASE: "LEGAL_DATABASE";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
        DEVELOPMENT_FINANCE: "DEVELOPMENT_FINANCE";
        INDUSTRY_BODY: "INDUSTRY_BODY";
        INTERNAL: "INTERNAL";
        OTHER: "OTHER";
    }>;
    sourceType: z.ZodEnum<{
        OFFICIAL: "OFFICIAL";
        THIRD_PARTY: "THIRD_PARTY";
        INTERNAL: "INTERNAL";
        MEDIA: "MEDIA";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
    }>;
    monitoringMethod: z.ZodDefault<z.ZodEnum<{
        RSS: "RSS";
        HTML_LISTING: "HTML_LISTING";
        API: "API";
        MANUAL: "MANUAL";
    }>>;
    baseUrl: z.ZodString;
    feedUrl: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">, z.ZodNull]>>;
    topics: z.ZodDefault<z.ZodArray<z.ZodString>>;
    keywords: z.ZodDefault<z.ZodArray<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        NEEDS_VERIFICATION: "NEEDS_VERIFICATION";
        FAILING: "FAILING";
    }>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    maxItemsPerRun: z.ZodDefault<z.ZodNumber>;
    fetchTimeoutMs: z.ZodDefault<z.ZodNumber>;
    respectRobots: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const adminUpdateMonitorSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    jurisdiction: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
        REGIONAL: "REGIONAL";
        GLOBAL: "GLOBAL";
    }>>;
    countryLabel: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    authorityType: z.ZodOptional<z.ZodEnum<{
        CENTRAL_BANK: "CENTRAL_BANK";
        DATA_PROTECTION: "DATA_PROTECTION";
        AML_CFT: "AML_CFT";
        COMMUNICATIONS: "COMMUNICATIONS";
        SECURITIES: "SECURITIES";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        COMPETITION: "COMPETITION";
        GAZETTE: "GAZETTE";
        LEGAL_DATABASE: "LEGAL_DATABASE";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
        DEVELOPMENT_FINANCE: "DEVELOPMENT_FINANCE";
        INDUSTRY_BODY: "INDUSTRY_BODY";
        INTERNAL: "INTERNAL";
        OTHER: "OTHER";
    }>>;
    sourceType: z.ZodOptional<z.ZodEnum<{
        OFFICIAL: "OFFICIAL";
        THIRD_PARTY: "THIRD_PARTY";
        INTERNAL: "INTERNAL";
        MEDIA: "MEDIA";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
    }>>;
    monitoringMethod: z.ZodOptional<z.ZodEnum<{
        RSS: "RSS";
        HTML_LISTING: "HTML_LISTING";
        API: "API";
        MANUAL: "MANUAL";
    }>>;
    baseUrl: z.ZodOptional<z.ZodString>;
    feedUrl: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">, z.ZodNull]>>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxItemsPerRun: z.ZodOptional<z.ZodNumber>;
    fetchTimeoutMs: z.ZodOptional<z.ZodNumber>;
    respectRobots: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const adminSetMonitorStatusSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        NEEDS_VERIFICATION: "NEEDS_VERIFICATION";
        FAILING: "FAILING";
    }>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const adminVerifyMonitorSchema: z.ZodObject<{
    id: z.ZodString;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const adminDeleteMonitorSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const adminListSourceItemsSchema: z.ZodObject<{
    monitorId: z.ZodOptional<z.ZodString>;
    jurisdiction: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
        REGIONAL: "REGIONAL";
        GLOBAL: "GLOBAL";
    }>>;
    authorityType: z.ZodOptional<z.ZodEnum<{
        CENTRAL_BANK: "CENTRAL_BANK";
        DATA_PROTECTION: "DATA_PROTECTION";
        AML_CFT: "AML_CFT";
        COMMUNICATIONS: "COMMUNICATIONS";
        SECURITIES: "SECURITIES";
        CONSUMER_PROTECTION: "CONSUMER_PROTECTION";
        COMPETITION: "COMPETITION";
        GAZETTE: "GAZETTE";
        LEGAL_DATABASE: "LEGAL_DATABASE";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
        DEVELOPMENT_FINANCE: "DEVELOPMENT_FINANCE";
        INDUSTRY_BODY: "INDUSTRY_BODY";
        INTERNAL: "INTERNAL";
        OTHER: "OTHER";
    }>>;
    sourceType: z.ZodOptional<z.ZodEnum<{
        OFFICIAL: "OFFICIAL";
        THIRD_PARTY: "THIRD_PARTY";
        INTERNAL: "INTERNAL";
        MEDIA: "MEDIA";
        INTERNATIONAL_STANDARD: "INTERNATIONAL_STANDARD";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        NEW: "NEW";
        READY_FOR_SCORING: "READY_FOR_SCORING";
        SCORED: "SCORED";
        DUPLICATE: "DUPLICATE";
        DISMISSED: "DISMISSED";
        FETCH_FAILED: "FETCH_FAILED";
        CONVERTED_TO_SUGGESTION: "CONVERTED_TO_SUGGESTION";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const adminGetSourceItemSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const adminDismissSourceItemSchema: z.ZodObject<{
    id: z.ZodString;
    reason: z.ZodString;
}, z.core.$strip>;
export declare const adminRunMonitorNowSchema: z.ZodObject<{
    monitorId: z.ZodString;
}, z.core.$strip>;
export declare const adminListDiscoveryRunsSchema: z.ZodObject<{
    monitorId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        RUNNING: "RUNNING";
        SUCCESS: "SUCCESS";
        PARTIAL_SUCCESS: "PARTIAL_SUCCESS";
        FAILED: "FAILED";
        SKIPPED_LOCKED: "SKIPPED_LOCKED";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=blog-automation.schema.d.ts.map