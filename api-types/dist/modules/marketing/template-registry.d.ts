/**
 * Marketing Template Registry
 *
 * Maps MarketingTemplateKey enum values to:
 *   - The React component to render
 *   - A Zod schema that validates templateVariables from the DB
 *
 * IMPORTANT: unsubscribeUrl, recipientFirstName, and recipientEmail are
 * NEVER stored in templateVariables — they are injected by the send pipeline
 * at render time. The Zod schemas here validate only the admin-supplied
 * campaign variables.
 *
 * This protects against mis-configured templateVariables (admin error or
 * DB tampering) before any email is rendered or sent.
 */
import React from 'react';
import { MarketingTemplateKey } from '@prisma/client';
export interface TemplateRegistryEntry {
    component: React.ComponentType<any>;
    validateVars: (vars: unknown) => Record<string, unknown>;
}
export declare const TEMPLATE_REGISTRY: Record<MarketingTemplateKey, TemplateRegistryEntry>;
//# sourceMappingURL=template-registry.d.ts.map