export interface GeneratedPolicyExportCitation {
    id: string;
    sectionId: string;
    actName: string;
    section: string;
    subsection: string | null;
    textSnippet: string;
    confidence: string;
    verified: boolean;
    citationVerified: boolean | null;
}
export interface GeneratedPolicyExportSection {
    id: string;
    title?: string;
    content?: unknown;
    contentMarkdown?: string;
    status?: string;
    wordCount?: number;
    editedAt?: string;
    editedByUserId?: string;
}
export interface GeneratedPolicyDocxParams {
    policyId: string;
    title: string;
    policyType: string;
    jurisdiction: string;
    organizationName: string;
    version: number;
    createdAt: Date;
    completedAt: Date | null;
    exportedAt: Date;
    exportedBy: string;
    executiveSummary: string | null;
    tableOfContents: unknown;
    sections: GeneratedPolicyExportSection[];
    citations: GeneratedPolicyExportCitation[];
    reviewNotes: string | null;
}
declare class GeneratedPolicyExportService {
    generateDocx(params: GeneratedPolicyDocxParams): Promise<Buffer>;
    sanitiseFilename(name: string): string;
}
export declare const generatedPolicyExportService: GeneratedPolicyExportService;
export { GeneratedPolicyExportService };
//# sourceMappingURL=generated-policy-export.service.d.ts.map