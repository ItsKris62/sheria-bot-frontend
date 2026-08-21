/**
 * Regulatory Document Ingestion Script
 *
 * Reads documents from the `documents/` folder at the project root and ingests
 * them into the RAG system (Pinecone + PostgreSQL).
 *
 * Usage:
 *   pnpm ingest
 *
 * Workflow:
 *   1. Place documents in documents/<country-or-scope>/
 *   2. Set hardcoded registry entries below or add entries to a corpus manifest
 *   3. Run `pnpm ingest`, optionally filtered with `--country=rwanda`
 *
 * Documents are processed sequentially (not in parallel) to avoid rate-limiting
 * on embedding APIs. Already-indexed documents (same SHA-256 checksum) are
 * automatically skipped.
 */
import { type DocumentIngestionInput } from '@/lib/ingestion/document-processor';
import type { Country as ManifestCountry } from './corpus/manifest.schema';
/**
 * Local string-union matching the `RegulatoryDocumentCategory` Prisma enum.
 * After running `pnpm prisma generate` the generated type will be compatible  -
 * this definition is only here to avoid importing from `@prisma/client` before
 * the first migration runs.
 */
type DocumentCategory = 'DATA_PROTECTION' | 'CYBERSECURITY' | 'FINTECH_REGULATION' | 'AML_CFT' | 'PAYMENT_SYSTEMS' | 'INTERNATIONAL_STANDARD';
export interface RegistryEntry extends Omit<DocumentIngestionInput, 'filePath' | 'category'> {
    manifestId?: string;
    /**
     * Path relative to the `documents/` folder at the project root.
     * Example: 'kenya/data-protection-act-2019.pdf'
     */
    fileName: string;
    /**
     * Uses a local string union that matches the `RegulatoryDocumentCategory`
     * Prisma enum. After `prisma generate` the types align automatically.
     */
    category: DocumentCategory;
}
export declare function buildRegistry(countryFilter: ManifestCountry | null): RegistryEntry[];
export declare function resolveDocumentPath(fileName: string): string;
export {};
//# sourceMappingURL=ingest-documents.d.ts.map