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
export {};
//# sourceMappingURL=ingest-documents.d.ts.map