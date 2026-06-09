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
 *   1. Place documents in documents/kenya/ or documents/international/
 *   2. Set the correct `fileName` in DOCUMENT_REGISTRY below
 *   3. Run `pnpm ingest`
 *
 * Documents are processed sequentially (not in parallel) to avoid rate-limiting
 * on embedding APIs. Already-indexed documents (same SHA-256 checksum) are
 * automatically skipped.
 */
export {};
//# sourceMappingURL=ingest-documents.d.ts.map