import { z } from 'zod';
export declare const ALERT_JURISDICTIONS: readonly ["KE", "RW", "MW"];
export declare const REGULATORY_BODIES: readonly ["CBK", "CMA", "ODPC", "CA", "GAZETTE", "BNR", "RURA", "RISA", "RWANDA_GAZETTE", "RBM", "MACRA", "MALAWI_GAZETTE"];
export declare const ALERT_CATEGORIES: readonly ["PRUDENTIAL", "DATA_PROTECTION", "AML_CFT", "LICENSING", "CAPITAL_MARKETS", "GENERAL"];
export declare const ALERT_SEVERITIES: readonly ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export declare const EMAIL_FREQUENCIES: readonly ["REALTIME", "DAILY", "WEEKLY"];
export declare const createAlertSchema: z.ZodObject<{
    title: z.ZodString;
    summary: z.ZodString;
    body: z.ZodString;
    sourceUrl: z.ZodOptional<z.ZodString>;
    jurisdictionCode: z.ZodDefault<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
    }>>;
    regulatoryBody: z.ZodEnum<{
        GAZETTE: "GAZETTE";
        CBK: "CBK";
        CMA: "CMA";
        ODPC: "ODPC";
        CA: "CA";
        BNR: "BNR";
        RURA: "RURA";
        RISA: "RISA";
        RWANDA_GAZETTE: "RWANDA_GAZETTE";
        RBM: "RBM";
        MACRA: "MACRA";
        MALAWI_GAZETTE: "MALAWI_GAZETTE";
    }>;
    category: z.ZodEnum<{
        DATA_PROTECTION: "DATA_PROTECTION";
        AML_CFT: "AML_CFT";
        PRUDENTIAL: "PRUDENTIAL";
        LICENSING: "LICENSING";
        CAPITAL_MARKETS: "CAPITAL_MARKETS";
        GENERAL: "GENERAL";
    }>;
    severity: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const getAlertsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    jurisdictionCode: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
    }>>;
    regulatoryBody: z.ZodOptional<z.ZodEnum<{
        GAZETTE: "GAZETTE";
        CBK: "CBK";
        CMA: "CMA";
        ODPC: "ODPC";
        CA: "CA";
        BNR: "BNR";
        RURA: "RURA";
        RISA: "RISA";
        RWANDA_GAZETTE: "RWANDA_GAZETTE";
        RBM: "RBM";
        MACRA: "MACRA";
        MALAWI_GAZETTE: "MALAWI_GAZETTE";
    }>>;
    severity: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    unreadOnly: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const upsertSubscriptionSchema: z.ZodObject<{
    jurisdictions: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
    }>>>;
    regulatoryBodies: z.ZodArray<z.ZodEnum<{
        GAZETTE: "GAZETTE";
        CBK: "CBK";
        CMA: "CMA";
        ODPC: "ODPC";
        CA: "CA";
        BNR: "BNR";
        RURA: "RURA";
        RISA: "RISA";
        RWANDA_GAZETTE: "RWANDA_GAZETTE";
        RBM: "RBM";
        MACRA: "MACRA";
        MALAWI_GAZETTE: "MALAWI_GAZETTE";
    }>>;
    categories: z.ZodArray<z.ZodEnum<{
        DATA_PROTECTION: "DATA_PROTECTION";
        AML_CFT: "AML_CFT";
        PRUDENTIAL: "PRUDENTIAL";
        LICENSING: "LICENSING";
        CAPITAL_MARKETS: "CAPITAL_MARKETS";
        GENERAL: "GENERAL";
    }>>;
    severityThreshold: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    emailEnabled: z.ZodBoolean;
    inAppEnabled: z.ZodBoolean;
    emailFrequency: z.ZodEnum<{
        REALTIME: "REALTIME";
        DAILY: "DAILY";
        WEEKLY: "WEEKLY";
    }>;
}, z.core.$strip>;
export declare const markAsReadSchema: z.ZodObject<{
    notificationId: z.ZodString;
}, z.core.$strip>;
export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type GetAlertsInput = z.infer<typeof getAlertsSchema>;
export type UpsertSubscriptionInput = z.infer<typeof upsertSubscriptionSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
//# sourceMappingURL=alert.schema.d.ts.map