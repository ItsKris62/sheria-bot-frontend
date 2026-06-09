/**
 * Chunk configuration
 */
export interface ChunkConfig {
    maxChunkSize: number;
    chunkOverlap: number;
    respectSentences: boolean;
    respectSections: boolean;
}
/**
 * Document chunk
 */
export interface DocumentChunk {
    index: number;
    text: string;
    startChar: number;
    endChar: number;
    section?: string;
    subsection?: string;
    citation?: string;
    metadata?: Record<string, any>;
}
/**
 * Chunk document into optimal pieces for embedding
 * @param text Document text
 * @param config Chunk configuration
 * @param metadata Additional metadata to attach
 */
export declare function chunkDocument(text: string, config?: Partial<ChunkConfig>, metadata?: Record<string, any>): DocumentChunk[];
/**
 * Chunk legal act/regulation with special handling
 */
export declare function chunkLegalAct(actText: string, actName: string, year: number, regulatoryArea: string): DocumentChunk[];
/**
 * Calculate optimal chunk size based on content type
 */
export declare function getOptimalChunkSize(contentType: string): number;
/**
 * Merge small chunks that are below minimum size
 */
export declare function mergeSmallChunks(chunks: DocumentChunk[], minSize?: number): DocumentChunk[];
/**
 * Preview chunks (useful for testing)
 */
export declare function previewChunks(chunks: DocumentChunk[], maxChunks?: number): void;
//# sourceMappingURL=chunking.d.ts.map