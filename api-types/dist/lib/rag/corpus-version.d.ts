import type { JurisdictionCode, JurisdictionContext } from '@/types/jurisdiction';
export declare const CORPUS_VERSION_FALLBACK = "LEGACY_UNVERSIONED";
export type CorpusVersionSnapshot = Partial<Record<JurisdictionCode, string>>;
export declare function getCorpusVersionSnapshot(context: JurisdictionContext): Promise<CorpusVersionSnapshot>;
//# sourceMappingURL=corpus-version.d.ts.map