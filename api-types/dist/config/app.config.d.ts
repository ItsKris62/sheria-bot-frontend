/**
 * Application configuration object
 * All app settings centralized and typed
 */
export declare const appConfig: {
    readonly env: "development" | "production" | "test";
    readonly isDevelopment: boolean;
    readonly isProduction: boolean;
    readonly isTest: boolean;
    readonly malwareScanEnabled: boolean;
    readonly clamav: {
        readonly host: string | undefined;
        readonly port: number;
        readonly timeoutMs: number;
    };
    readonly features: {
        readonly orchestratorEnabled: boolean;
        readonly agentsEnabled: boolean;
    };
    readonly agents: {
        readonly maxCostPerRunUsd: number;
        readonly maxCostPerDayUsd: number;
        readonly maxIterationsPerRun: number;
        readonly automation: {
            readonly logRateLimitMax: number;
            readonly logRateLimitWindowSeconds: number;
            readonly generateRateLimitMax: number;
            readonly generateRateLimitWindowSeconds: number;
            readonly hmacSecret: string;
            readonly decisionLinkSecret: string;
            readonly metricsRateLimitMax: number;
            readonly metricsRateLimitWindowSeconds: number;
            readonly approvalCreateRateLimitMax: number;
            readonly approvalCreateRateLimitWindowSeconds: number;
            readonly approvalReadRateLimitMax: number;
            readonly approvalReadRateLimitWindowSeconds: number;
            readonly webhookIngress: {
                readonly header: string;
                readonly secret: string;
            };
            readonly workflowRateLimitMax: number;
            readonly workflowRateLimitWindowSeconds: number;
        };
        readonly trigger: {
            readonly rateLimitMax: number;
            readonly rateLimitWindowSeconds: number;
        };
    };
    readonly posthog: {
        readonly personalApiKey: string | undefined;
        readonly host: string | undefined;
        readonly projectId: string | undefined;
    };
    readonly sentry: {
        readonly apiToken: string | undefined;
        readonly org: string | undefined;
        readonly project: string | undefined;
    };
    readonly port: number;
    readonly appUrl: string;
    readonly frontendUrl: string;
    readonly database: {
        readonly url: string;
        readonly directUrl: string | undefined;
    };
    readonly redis: {
        readonly restUrl: string;
        readonly restToken: string;
    };
    readonly supabase: {
        readonly url: string;
        readonly anonKey: string;
        readonly serviceRoleKey: string;
        readonly jwtSecret: string;
    };
    readonly email: {
        readonly apiKey: string;
        readonly from: string;
        readonly fromName: "SheriaBot";
        readonly supportRecipient: string;
    };
    readonly ai: {
        readonly apiKey: string;
        readonly model: string;
    };
    readonly openai: {
        readonly apiKey: string | undefined;
        readonly model: string;
    };
    readonly gemini: {
        readonly apiKey: string | undefined;
        readonly model: string;
    };
    readonly pinecone: {
        readonly apiKey: string;
        readonly environment: string;
        readonly indexName: string;
    };
    readonly storage: {
        readonly accountId: string;
        readonly accessKeyId: string;
        readonly secretAccessKey: string;
        readonly bucketName: string;
        readonly publicUrl: string;
    };
    readonly publicStorage: {
        readonly accessKeyId: string;
        readonly secretAccessKey: string;
        readonly bucketName: string;
        readonly endpoint: `https://${string}.r2.cloudflarestorage.com`;
        readonly bucketUrl: string;
    };
    readonly rateLimit: {
        readonly max: number;
        readonly window: string;
    };
    readonly stripe: {
        readonly secretKey: string;
        readonly publishableKey: string;
        readonly webhookSecret: string;
    };
    readonly intasend: {
        readonly publishableKey: string;
        readonly secretKey: string;
        readonly isTest: boolean;
        readonly webhookChallenge: string;
        readonly webhookUrl: string;
        readonly subscriptionPlans: {
            readonly STARTUP: {
                readonly monthly: string;
                readonly yearly: string;
            };
            readonly BUSINESS: {
                readonly monthly: string;
                readonly yearly: string;
            };
        };
    };
    readonly marketing: {
        readonly fromEmail: string;
        readonly fromName: string;
        readonly webhookSecret: string;
        readonly tokenHmacSecret: string;
        readonly appPublicUrl: string;
        readonly adminNotificationEmail: string;
        readonly pilotInvitationExpiryDays: number;
    };
};
/**
 * Helper function to check if running in development
 */
export declare const isDevelopment: () => boolean;
/**
 * Helper function to check if running in production
 */
export declare const isProduction: () => boolean;
/**
 * Helper function to check if running in test mode
 */
export declare const isTest: () => boolean;
/**
 * Export environment type for use in other modules
 */
export type AppConfig = typeof appConfig;
//# sourceMappingURL=app.config.d.ts.map