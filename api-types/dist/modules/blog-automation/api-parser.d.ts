import { DiscoveredItem } from './rss-parser';
import { type ApiMonitorConfig } from '@/server/schemas/blog-automation.schema';
export { type ApiMonitorConfig };
/**
 * Safely traverses an object given a dot-notation path (e.g. 'data.items' or 'results').
 */
export declare function getNestedValue(obj: any, path: string): any;
/**
 * Extracts an array of items from a JSON API payload using dot-notation itemsPath.
 */
export declare function extractItemsFromPayload(payload: any, itemsPath?: string): any[];
/**
 * Resolves a raw URL against an API endpoint origin/base.
 */
export declare function resolveItemUrl(rawUrl: string, baseUrl: string): string | null;
/**
 * Extracts and validates ApiMonitorConfig stored in monitor.notes or constructs fallback.
 */
export declare function extractApiConfig(monitor: {
    notes?: string | null;
    feedUrl?: string | null;
    baseUrl?: string;
}): ApiMonitorConfig | null;
/**
 * Ingests and normalizes items from a REST/JSON API endpoint.
 */
export declare function parseApiFeed(config: ApiMonitorConfig, maxItems?: number, timeoutMs?: number): Promise<DiscoveredItem[]>;
//# sourceMappingURL=api-parser.d.ts.map