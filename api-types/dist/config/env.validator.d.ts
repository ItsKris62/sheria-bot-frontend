import { z } from 'zod';
/**
 * Production environment variable validation schema.
 * Stricter than app.config.ts - enforces minimum secret lengths,
 * URL formats, and production-only requirements.
 */
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodPipe<z.ZodPipe<z.ZodDefault<z.ZodString>, z.ZodTransform<number, string>>, z.ZodNumber>;
    APP_URL: z.ZodString;
    FRONTEND_URL: z.ZodString;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        error: "error";
        debug: "debug";
        info: "info";
        fatal: "fatal";
        warn: "warn";
        trace: "trace";
    }>>;
    DATABASE_URL: z.ZodString;
    DIRECT_URL: z.ZodOptional<z.ZodString>;
    UPSTASH_REDIS_REST_URL: z.ZodString;
    UPSTASH_REDIS_REST_TOKEN: z.ZodString;
    SUPABASE_URL: z.ZodString;
    SUPABASE_ANON_KEY: z.ZodString;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodString;
    SUPABASE_JWT_SECRET: z.ZodString;
    RESEND_API_KEY: z.ZodString;
    FROM_EMAIL: z.ZodString;
    ANTHROPIC_API_KEY: z.ZodString;
    ANTHROPIC_MODEL: z.ZodDefault<z.ZodString>;
    PINECONE_API_KEY: z.ZodString;
    PINECONE_ENVIRONMENT: z.ZodDefault<z.ZodString>;
    PINECONE_INDEX_NAME: z.ZodDefault<z.ZodString>;
    R2_ACCOUNT_ID: z.ZodString;
    R2_ACCESS_KEY_ID: z.ZodString;
    R2_SECRET_ACCESS_KEY: z.ZodString;
    R2_BUCKET_NAME: z.ZodDefault<z.ZodString>;
    R2_PUBLIC_URL: z.ZodString;
    MALWARE_SCAN_ENABLED: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
    CLAMAV_HOST: z.ZodOptional<z.ZodString>;
    CLAMAV_PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    CLAMAV_TIMEOUT_MS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    RATE_LIMIT_MAX: z.ZodPipe<z.ZodPipe<z.ZodDefault<z.ZodString>, z.ZodTransform<number, string>>, z.ZodNumber>;
    RATE_LIMIT_WINDOW: z.ZodDefault<z.ZodString>;
    ADMIN_EMAIL: z.ZodOptional<z.ZodString>;
    ADMIN_PASSWORD: z.ZodOptional<z.ZodString>;
    VAULT_RECONCILIATION_DRY_RUN: z.ZodOptional<z.ZodDefault<z.ZodCoercedBoolean<unknown>>>;
    VAULT_RECONCILIATION_VERIFY_HASHES: z.ZodOptional<z.ZodDefault<z.ZodCoercedBoolean<unknown>>>;
    VAULT_DELETED_RETENTION_DAYS: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type EnvConfig = z.infer<typeof envSchema>;
/**
 * Validate environment variables.
 * Exits the process with a value-safe error report on failure.
 */
export declare function validateEnvironment(): EnvConfig;
/**
 * Print a safe summary of loaded configuration (no secrets).
 */
export declare function printEnvSummary(env: EnvConfig): void;
export {};
//# sourceMappingURL=env.validator.d.ts.map