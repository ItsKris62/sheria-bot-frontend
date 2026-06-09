import { type SystemConfig } from '@/modules/admin/admin.types';
type SystemConfigValueType = 'string' | 'number' | 'boolean' | 'json';
type RuntimeAIUseCase = 'policy' | 'checklist' | 'query' | 'verification';
export interface RuntimeAIConfig {
    apiKey: string;
    model: string;
    temperature: number;
}
interface SystemConfigDefinition {
    key: string;
    aliases?: readonly string[];
    type: SystemConfigValueType;
    category: string;
    description: string;
    defaultValue: unknown;
}
export declare const SYSTEM_CONFIG_DEFINITIONS: readonly SystemConfigDefinition[];
export declare function normalizeSystemConfigPatch(config: Record<string, unknown>): Record<string, unknown>;
export declare function sanitizeSystemConfigForAudit(config: Record<string, unknown>): Record<string, unknown>;
export declare function toAdminSystemConfig(config: SystemConfig): SystemConfig;
export declare function resolveRuntimeAIConfigFromSystemConfig(config: Partial<SystemConfig>, useCase: RuntimeAIUseCase): RuntimeAIConfig;
export declare function loadSystemConfig(options?: {
    syncDefinitions?: boolean;
}): Promise<SystemConfig>;
export declare function updateSystemConfigSnapshot(config: Record<string, unknown>, updatedBy?: string): Promise<SystemConfig>;
export declare function getSystemConfigNumber(key: string, fallback: number): Promise<number>;
export declare function getRuntimeAIConfig(useCase: RuntimeAIUseCase): Promise<RuntimeAIConfig>;
export {};
//# sourceMappingURL=system-config.d.ts.map