/**
 * Gap Analysis Generation Prompts
 * AI prompts for comparing uploaded policy documents against
 * jurisdiction-scoped regulatory requirements using RAG-retrieved context.
 */
import { z } from 'zod';
import { type JurisdictionContext } from '@/types/jurisdiction';
export type { JurisdictionContext };
export interface GapAnalysisParams {
    policyText: string;
    documentName: string;
    documentType: string;
    regulatoryFrameworks: string[];
    benchmarkDocumentIds?: string[];
    analysisDepth: 'quick' | 'standard' | 'deep';
    focusAreas?: string[];
    ragContext?: string;
    jurisdictionContext?: JurisdictionContext;
    signal?: AbortSignal;
    beforeAiOperation?: (plan?: GapAnalysisModelCallPlan) => Promise<void>;
}
export interface GapAnalysisModelCallPlan {
    stage: 'analysis' | 'merge' | 'enhanced_review' | 'verification';
    estimatedInputTokens: number;
    maxOutputTokens: number;
}
export interface BenchmarkDocumentSummary {
    id: string;
    title: string;
    documentType?: string | null;
    regulatoryBody?: string | null;
}
export declare const RegulatoryEvidenceRefSchema: z.ZodObject<{
    evidenceId: z.ZodString;
    vectorId: z.ZodString;
    documentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    documentTitle: z.ZodString;
    jurisdiction: z.ZodUnion<readonly [z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>, z.ZodLiteral<"GLOBAL">, z.ZodLiteral<"INTERNATIONAL">]>;
    frameworkSlug: z.ZodString;
    sourceAuthority: z.ZodOptional<z.ZodString>;
    section: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    sourceStatus: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodString;
    similarityScore: z.ZodOptional<z.ZodNumber>;
    rerankScore: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const PolicyEvidenceRefSchema: z.ZodObject<{
    policyEvidenceId: z.ZodString;
    chunkIndex: z.ZodOptional<z.ZodNumber>;
    page: z.ZodOptional<z.ZodNumber>;
    sectionHeading: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodString;
    startOffset: z.ZodOptional<z.ZodNumber>;
    endOffset: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const FindingVerificationSchema: z.ZodObject<{
    verdict: z.ZodEnum<{
        PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
        UNSUPPORTED: "UNSUPPORTED";
        SUPPORTED: "SUPPORTED";
        NOT_VERIFIABLE: "NOT_VERIFIABLE";
    }>;
    confidence: z.ZodOptional<z.ZodNumber>;
    unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const FindingCoverageSchema: z.ZodObject<{
    regulatoryEvidenceAvailable: z.ZodDefault<z.ZodBoolean>;
    policySectionAssessed: z.ZodDefault<z.ZodBoolean>;
    extractionComplete: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const DocumentCoverageSchema: z.ZodObject<{
    totalChunks: z.ZodNumber;
    processedChunks: z.ZodNumber;
    failedChunks: z.ZodNumber;
    skippedChunks: z.ZodNumber;
    extractionComplete: z.ZodBoolean;
}, z.core.$strip>;
export declare const FrameworkCoverageSchema: z.ZodObject<{
    frameworkSlug: z.ZodString;
    evidenceStatus: z.ZodEnum<{
        COMPLETE: "COMPLETE";
        PARTIAL: "PARTIAL";
        INSUFFICIENT: "INSUFFICIENT";
        UNAVAILABLE: "UNAVAILABLE";
    }>;
    assessedRequirementCount: z.ZodNumber;
    totalKnownRequirementCount: z.ZodOptional<z.ZodNumber>;
    unassessedRequirementCount: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const GapItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    requirement: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    frameworkSlug: z.ZodOptional<z.ZodString>;
    jurisdiction: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    status: z.ZodDefault<z.ZodEnum<{
        PARTIAL: "PARTIAL";
        COMPLIANT: "COMPLIANT";
        GAP: "GAP";
        NOT_ASSESSED: "NOT_ASSESSED";
        INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE";
    }>>;
    severity: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
        INFO: "INFO";
    }>;
    severityRationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    regulatoryBasis: z.ZodString;
    description: z.ZodString;
    policyCurrentState: z.ZodString;
    recommendation: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    priority: z.ZodNumber;
    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    requestedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    resolvedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    invalidEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    policyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    requestedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    resolvedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    invalidPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    regulatoryEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        vectorId: z.ZodString;
        documentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        documentTitle: z.ZodString;
        jurisdiction: z.ZodUnion<readonly [z.ZodEnum<{
            KE: "KE";
            MW: "MW";
            RW: "RW";
            NG: "NG";
        }>, z.ZodLiteral<"GLOBAL">, z.ZodLiteral<"INTERNATIONAL">]>;
        frameworkSlug: z.ZodString;
        sourceAuthority: z.ZodOptional<z.ZodString>;
        section: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodNumber>;
        effectiveDate: z.ZodOptional<z.ZodString>;
        sourceStatus: z.ZodOptional<z.ZodString>;
        excerpt: z.ZodString;
        similarityScore: z.ZodOptional<z.ZodNumber>;
        rerankScore: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    policyEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        policyEvidenceId: z.ZodString;
        chunkIndex: z.ZodOptional<z.ZodNumber>;
        page: z.ZodOptional<z.ZodNumber>;
        sectionHeading: z.ZodOptional<z.ZodString>;
        excerpt: z.ZodString;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    verification: z.ZodDefault<z.ZodObject<{
        verdict: z.ZodEnum<{
            PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
            UNSUPPORTED: "UNSUPPORTED";
            SUPPORTED: "SUPPORTED";
            NOT_VERIFIABLE: "NOT_VERIFIABLE";
        }>;
        confidence: z.ZodOptional<z.ZodNumber>;
        unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    coverage: z.ZodDefault<z.ZodObject<{
        regulatoryEvidenceAvailable: z.ZodDefault<z.ZodBoolean>;
        policySectionAssessed: z.ZodDefault<z.ZodBoolean>;
        extractionComplete: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
    regulatoryDeadline: z.ZodOptional<z.ZodString>;
    citationVerified: z.ZodOptional<z.ZodBoolean>;
    verificationStatus: z.ZodOptional<z.ZodEnum<{
        verified: "verified";
        unverified: "unverified";
        not_checked: "not_checked";
    }>>;
    sourceDocumentTitle: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    sourceSnippet: z.ZodOptional<z.ZodString>;
    authorityStatus: z.ZodOptional<z.ZodString>;
    isBinding: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const FrameworkResultSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    score: z.ZodNumber;
    gaps: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        requirement: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        frameworkSlug: z.ZodOptional<z.ZodString>;
        jurisdiction: z.ZodOptional<z.ZodEnum<{
            KE: "KE";
            MW: "MW";
            RW: "RW";
            NG: "NG";
        }>>;
        status: z.ZodDefault<z.ZodEnum<{
            PARTIAL: "PARTIAL";
            COMPLIANT: "COMPLIANT";
            GAP: "GAP";
            NOT_ASSESSED: "NOT_ASSESSED";
            INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE";
        }>>;
        severity: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
            INFO: "INFO";
        }>;
        severityRationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        regulatoryBasis: z.ZodString;
        description: z.ZodString;
        policyCurrentState: z.ZodString;
        recommendation: z.ZodString;
        effort: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
        }>;
        priority: z.ZodNumber;
        evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        requestedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        resolvedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        invalidEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        policyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        requestedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        resolvedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        invalidPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        regulatoryEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            vectorId: z.ZodString;
            documentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            documentTitle: z.ZodString;
            jurisdiction: z.ZodUnion<readonly [z.ZodEnum<{
                KE: "KE";
                MW: "MW";
                RW: "RW";
                NG: "NG";
            }>, z.ZodLiteral<"GLOBAL">, z.ZodLiteral<"INTERNATIONAL">]>;
            frameworkSlug: z.ZodString;
            sourceAuthority: z.ZodOptional<z.ZodString>;
            section: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodNumber>;
            effectiveDate: z.ZodOptional<z.ZodString>;
            sourceStatus: z.ZodOptional<z.ZodString>;
            excerpt: z.ZodString;
            similarityScore: z.ZodOptional<z.ZodNumber>;
            rerankScore: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        policyEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
            policyEvidenceId: z.ZodString;
            chunkIndex: z.ZodOptional<z.ZodNumber>;
            page: z.ZodOptional<z.ZodNumber>;
            sectionHeading: z.ZodOptional<z.ZodString>;
            excerpt: z.ZodString;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        verification: z.ZodDefault<z.ZodObject<{
            verdict: z.ZodEnum<{
                PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
                UNSUPPORTED: "UNSUPPORTED";
                SUPPORTED: "SUPPORTED";
                NOT_VERIFIABLE: "NOT_VERIFIABLE";
            }>;
            confidence: z.ZodOptional<z.ZodNumber>;
            unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
            reason: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        coverage: z.ZodDefault<z.ZodObject<{
            regulatoryEvidenceAvailable: z.ZodDefault<z.ZodBoolean>;
            policySectionAssessed: z.ZodDefault<z.ZodBoolean>;
            extractionComplete: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
        responsibleRole: z.ZodOptional<z.ZodString>;
        regulatoryDeadline: z.ZodOptional<z.ZodString>;
        citationVerified: z.ZodOptional<z.ZodBoolean>;
        verificationStatus: z.ZodOptional<z.ZodEnum<{
            verified: "verified";
            unverified: "unverified";
            not_checked: "not_checked";
        }>>;
        sourceDocumentTitle: z.ZodOptional<z.ZodString>;
        sourceSection: z.ZodOptional<z.ZodString>;
        sourceSnippet: z.ZodOptional<z.ZodString>;
        authorityStatus: z.ZodOptional<z.ZodString>;
        isBinding: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    strengths: z.ZodArray<z.ZodString>;
    summary: z.ZodString;
}, z.core.$strip>;
export declare const ActionPlanItemSchema: z.ZodObject<{
    priority: z.ZodNumber;
    action: z.ZodString;
    framework: z.ZodString;
    deadline: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    resources: z.ZodArray<z.ZodString>;
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GapAnalysisResultSchema: z.ZodObject<{
    overallScore: z.ZodNumber;
    assessmentCoverage: z.ZodDefault<z.ZodNumber>;
    executiveSummary: z.ZodString;
    frameworks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        score: z.ZodNumber;
        gaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            requirement: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            frameworkSlug: z.ZodOptional<z.ZodString>;
            jurisdiction: z.ZodOptional<z.ZodEnum<{
                KE: "KE";
                MW: "MW";
                RW: "RW";
                NG: "NG";
            }>>;
            status: z.ZodDefault<z.ZodEnum<{
                PARTIAL: "PARTIAL";
                COMPLIANT: "COMPLIANT";
                GAP: "GAP";
                NOT_ASSESSED: "NOT_ASSESSED";
                INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE";
            }>>;
            severity: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
                INFO: "INFO";
            }>;
            severityRationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            regulatoryBasis: z.ZodString;
            description: z.ZodString;
            policyCurrentState: z.ZodString;
            recommendation: z.ZodString;
            effort: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
            }>;
            priority: z.ZodNumber;
            evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            requestedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            resolvedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            invalidEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            policyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            requestedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            resolvedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            invalidPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
            regulatoryEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
                evidenceId: z.ZodString;
                vectorId: z.ZodString;
                documentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                documentTitle: z.ZodString;
                jurisdiction: z.ZodUnion<readonly [z.ZodEnum<{
                    KE: "KE";
                    MW: "MW";
                    RW: "RW";
                    NG: "NG";
                }>, z.ZodLiteral<"GLOBAL">, z.ZodLiteral<"INTERNATIONAL">]>;
                frameworkSlug: z.ZodString;
                sourceAuthority: z.ZodOptional<z.ZodString>;
                section: z.ZodOptional<z.ZodString>;
                page: z.ZodOptional<z.ZodNumber>;
                effectiveDate: z.ZodOptional<z.ZodString>;
                sourceStatus: z.ZodOptional<z.ZodString>;
                excerpt: z.ZodString;
                similarityScore: z.ZodOptional<z.ZodNumber>;
                rerankScore: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>>;
            policyEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
                policyEvidenceId: z.ZodString;
                chunkIndex: z.ZodOptional<z.ZodNumber>;
                page: z.ZodOptional<z.ZodNumber>;
                sectionHeading: z.ZodOptional<z.ZodString>;
                excerpt: z.ZodString;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>>;
            verification: z.ZodDefault<z.ZodObject<{
                verdict: z.ZodEnum<{
                    PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
                    UNSUPPORTED: "UNSUPPORTED";
                    SUPPORTED: "SUPPORTED";
                    NOT_VERIFIABLE: "NOT_VERIFIABLE";
                }>;
                confidence: z.ZodOptional<z.ZodNumber>;
                unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
                reason: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            coverage: z.ZodDefault<z.ZodObject<{
                regulatoryEvidenceAvailable: z.ZodDefault<z.ZodBoolean>;
                policySectionAssessed: z.ZodDefault<z.ZodBoolean>;
                extractionComplete: z.ZodDefault<z.ZodBoolean>;
            }, z.core.$strip>>;
            evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
            responsibleRole: z.ZodOptional<z.ZodString>;
            regulatoryDeadline: z.ZodOptional<z.ZodString>;
            citationVerified: z.ZodOptional<z.ZodBoolean>;
            verificationStatus: z.ZodOptional<z.ZodEnum<{
                verified: "verified";
                unverified: "unverified";
                not_checked: "not_checked";
            }>>;
            sourceDocumentTitle: z.ZodOptional<z.ZodString>;
            sourceSection: z.ZodOptional<z.ZodString>;
            sourceSnippet: z.ZodOptional<z.ZodString>;
            authorityStatus: z.ZodOptional<z.ZodString>;
            isBinding: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        strengths: z.ZodArray<z.ZodString>;
        summary: z.ZodString;
    }, z.core.$strip>>;
    crossCuttingStrengths: z.ZodArray<z.ZodString>;
    actionPlan: z.ZodArray<z.ZodObject<{
        priority: z.ZodNumber;
        action: z.ZodString;
        framework: z.ZodString;
        deadline: z.ZodString;
        effort: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
        }>;
        resources: z.ZodArray<z.ZodString>;
        dependsOn: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>>>;
        responsibleRole: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    metadata: z.ZodObject<{
        documentName: z.ZodString;
        analysisDepth: z.ZodString;
        frameworksAnalysed: z.ZodArray<z.ZodString>;
        totalGaps: z.ZodNumber;
        criticalGaps: z.ZodNumber;
        highGaps: z.ZodNumber;
        mediumGaps: z.ZodOptional<z.ZodNumber>;
        lowGaps: z.ZodOptional<z.ZodNumber>;
        analysisDate: z.ZodString;
        calculatedScore: z.ZodOptional<z.ZodNumber>;
        complianceAlignmentScore: z.ZodOptional<z.ZodNumber>;
        assessmentCoverageScore: z.ZodOptional<z.ZodNumber>;
        coverageStatus: z.ZodDefault<z.ZodEnum<{
            COMPLETE: "COMPLETE";
            PARTIAL: "PARTIAL";
            INSUFFICIENT: "INSUFFICIENT";
        }>>;
        scoringVersion: z.ZodOptional<z.ZodString>;
        modelSuggestedScore: z.ZodOptional<z.ZodNumber>;
        documentCoverage: z.ZodOptional<z.ZodObject<{
            totalChunks: z.ZodNumber;
            processedChunks: z.ZodNumber;
            failedChunks: z.ZodNumber;
            skippedChunks: z.ZodNumber;
            extractionComplete: z.ZodBoolean;
        }, z.core.$strip>>;
        frameworkCoverage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            frameworkSlug: z.ZodString;
            evidenceStatus: z.ZodEnum<{
                COMPLETE: "COMPLETE";
                PARTIAL: "PARTIAL";
                INSUFFICIENT: "INSUFFICIENT";
                UNAVAILABLE: "UNAVAILABLE";
            }>;
            assessedRequirementCount: z.ZodNumber;
            totalKnownRequirementCount: z.ZodOptional<z.ZodNumber>;
            unassessedRequirementCount: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>>;
        selectedBenchmarkDocuments: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodPipe<z.ZodString, z.ZodTransform<{
            id: string;
            title: string;
            documentType: null;
            regulatoryBody: null;
        }, string>>, z.ZodObject<{
            id: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            title: z.ZodString;
            documentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            regulatoryBody: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>]>>>;
        chunksProcessed: z.ZodOptional<z.ZodNumber>;
        tokenCost: z.ZodOptional<z.ZodObject<{
            inputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            estimatedCostUsd: z.ZodNumber;
        }, z.core.$strip>>;
        jurisdictionCode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            KE: "KE";
            MW: "MW";
            RW: "RW";
            NG: "NG";
        }>>>;
        verifierStatus: z.ZodOptional<z.ZodEnum<{
            PARTIAL: "PARTIAL";
            PASS: "PASS";
            FAIL: "FAIL";
        }>>;
        unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        retrievalVersion: z.ZodOptional<z.ZodString>;
        executionProfileVersion: z.ZodOptional<z.ZodString>;
        executionStages: z.ZodOptional<z.ZodObject<{
            retrieval: z.ZodString;
            documentTraversal: z.ZodString;
            enhancedReview: z.ZodString;
            verification: z.ZodString;
        }, z.core.$strip>>;
        executionMetrics: z.ZodOptional<z.ZodObject<{
            retrievalQueryCount: z.ZodNumber;
            retrievalCandidateCount: z.ZodNumber;
            acceptedEvidenceCount: z.ZodNumber;
            weakEvidenceRetryCount: z.ZodNumber;
            documentChunks: z.ZodNumber;
            processedChunks: z.ZodNumber;
            analysisCallCount: z.ZodNumber;
            verificationCallCount: z.ZodNumber;
            inputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            durationMs: z.ZodNumber;
        }, z.core.$strip>>;
        executionLimitations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Raw gap item returned by the per-chunk phase.
 * Identical to GapItemSchema but includes a `framework` identifier so the
 * merge pass can group gaps by framework.
 */
export declare const RawChunkGapItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    requirement: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    frameworkSlug: z.ZodOptional<z.ZodString>;
    jurisdiction: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    status: z.ZodDefault<z.ZodEnum<{
        PARTIAL: "PARTIAL";
        COMPLIANT: "COMPLIANT";
        GAP: "GAP";
        NOT_ASSESSED: "NOT_ASSESSED";
        INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE";
    }>>;
    severity: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
        INFO: "INFO";
    }>;
    severityRationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    regulatoryBasis: z.ZodString;
    description: z.ZodString;
    policyCurrentState: z.ZodString;
    recommendation: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    priority: z.ZodNumber;
    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    requestedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    resolvedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    invalidEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    policyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    requestedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    resolvedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    invalidPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    regulatoryEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        vectorId: z.ZodString;
        documentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        documentTitle: z.ZodString;
        jurisdiction: z.ZodUnion<readonly [z.ZodEnum<{
            KE: "KE";
            MW: "MW";
            RW: "RW";
            NG: "NG";
        }>, z.ZodLiteral<"GLOBAL">, z.ZodLiteral<"INTERNATIONAL">]>;
        frameworkSlug: z.ZodString;
        sourceAuthority: z.ZodOptional<z.ZodString>;
        section: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodNumber>;
        effectiveDate: z.ZodOptional<z.ZodString>;
        sourceStatus: z.ZodOptional<z.ZodString>;
        excerpt: z.ZodString;
        similarityScore: z.ZodOptional<z.ZodNumber>;
        rerankScore: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    policyEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        policyEvidenceId: z.ZodString;
        chunkIndex: z.ZodOptional<z.ZodNumber>;
        page: z.ZodOptional<z.ZodNumber>;
        sectionHeading: z.ZodOptional<z.ZodString>;
        excerpt: z.ZodString;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    verification: z.ZodDefault<z.ZodObject<{
        verdict: z.ZodEnum<{
            PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
            UNSUPPORTED: "UNSUPPORTED";
            SUPPORTED: "SUPPORTED";
            NOT_VERIFIABLE: "NOT_VERIFIABLE";
        }>;
        confidence: z.ZodOptional<z.ZodNumber>;
        unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    coverage: z.ZodDefault<z.ZodObject<{
        regulatoryEvidenceAvailable: z.ZodDefault<z.ZodBoolean>;
        policySectionAssessed: z.ZodDefault<z.ZodBoolean>;
        extractionComplete: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
    regulatoryDeadline: z.ZodOptional<z.ZodString>;
    citationVerified: z.ZodOptional<z.ZodBoolean>;
    verificationStatus: z.ZodOptional<z.ZodEnum<{
        verified: "verified";
        unverified: "unverified";
        not_checked: "not_checked";
    }>>;
    sourceDocumentTitle: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    sourceSnippet: z.ZodOptional<z.ZodString>;
    authorityStatus: z.ZodOptional<z.ZodString>;
    isBinding: z.ZodOptional<z.ZodBoolean>;
    framework: z.ZodString;
}, z.core.$strip>;
/** Zod schema for the full JSON array a single chunk analysis returns. */
export declare const ChunkOutputSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    requirement: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    frameworkSlug: z.ZodOptional<z.ZodString>;
    jurisdiction: z.ZodOptional<z.ZodEnum<{
        KE: "KE";
        MW: "MW";
        RW: "RW";
        NG: "NG";
    }>>;
    status: z.ZodDefault<z.ZodEnum<{
        PARTIAL: "PARTIAL";
        COMPLIANT: "COMPLIANT";
        GAP: "GAP";
        NOT_ASSESSED: "NOT_ASSESSED";
        INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE";
    }>>;
    severity: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
        INFO: "INFO";
    }>;
    severityRationale: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    regulatoryBasis: z.ZodString;
    description: z.ZodString;
    policyCurrentState: z.ZodString;
    recommendation: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    priority: z.ZodNumber;
    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    requestedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    resolvedEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    invalidEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    policyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    requestedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    resolvedPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    invalidPolicyEvidenceIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    regulatoryEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        vectorId: z.ZodString;
        documentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        documentTitle: z.ZodString;
        jurisdiction: z.ZodUnion<readonly [z.ZodEnum<{
            KE: "KE";
            MW: "MW";
            RW: "RW";
            NG: "NG";
        }>, z.ZodLiteral<"GLOBAL">, z.ZodLiteral<"INTERNATIONAL">]>;
        frameworkSlug: z.ZodString;
        sourceAuthority: z.ZodOptional<z.ZodString>;
        section: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodNumber>;
        effectiveDate: z.ZodOptional<z.ZodString>;
        sourceStatus: z.ZodOptional<z.ZodString>;
        excerpt: z.ZodString;
        similarityScore: z.ZodOptional<z.ZodNumber>;
        rerankScore: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    policyEvidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        policyEvidenceId: z.ZodString;
        chunkIndex: z.ZodOptional<z.ZodNumber>;
        page: z.ZodOptional<z.ZodNumber>;
        sectionHeading: z.ZodOptional<z.ZodString>;
        excerpt: z.ZodString;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    verification: z.ZodDefault<z.ZodObject<{
        verdict: z.ZodEnum<{
            PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
            UNSUPPORTED: "UNSUPPORTED";
            SUPPORTED: "SUPPORTED";
            NOT_VERIFIABLE: "NOT_VERIFIABLE";
        }>;
        confidence: z.ZodOptional<z.ZodNumber>;
        unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    coverage: z.ZodDefault<z.ZodObject<{
        regulatoryEvidenceAvailable: z.ZodDefault<z.ZodBoolean>;
        policySectionAssessed: z.ZodDefault<z.ZodBoolean>;
        extractionComplete: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
    regulatoryDeadline: z.ZodOptional<z.ZodString>;
    citationVerified: z.ZodOptional<z.ZodBoolean>;
    verificationStatus: z.ZodOptional<z.ZodEnum<{
        verified: "verified";
        unverified: "unverified";
        not_checked: "not_checked";
    }>>;
    sourceDocumentTitle: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    sourceSnippet: z.ZodOptional<z.ZodString>;
    authorityStatus: z.ZodOptional<z.ZodString>;
    isBinding: z.ZodOptional<z.ZodBoolean>;
    framework: z.ZodString;
}, z.core.$strip>>;
export type RegulatoryEvidenceRef = z.infer<typeof RegulatoryEvidenceRefSchema>;
export type PolicyEvidenceRef = z.infer<typeof PolicyEvidenceRefSchema>;
export type FindingVerification = z.infer<typeof FindingVerificationSchema>;
export type FindingCoverage = z.infer<typeof FindingCoverageSchema>;
export type GapItem = z.infer<typeof GapItemSchema>;
export type FrameworkResult = z.infer<typeof FrameworkResultSchema>;
export type ActionPlanItem = z.infer<typeof ActionPlanItemSchema>;
export type GapAnalysisResult = z.infer<typeof GapAnalysisResultSchema>;
export type RawChunkGapItem = z.infer<typeof RawChunkGapItemSchema>;
export type ChunkOutput = z.infer<typeof ChunkOutputSchema>;
export interface PolicyChunk {
    index: number;
    total: number;
    text: string;
    charStart: number;
    charEnd: number;
}
export declare const CHUNK_SIZE = 6000;
export declare const CHUNK_OVERLAP = 800;
export declare function chunkPolicyText(text: string, chunkSize?: number, overlap?: number): PolicyChunk[];
export declare function sanitizePolicyText(text: string): {
    sanitized: string;
    wasModified: boolean;
};
export declare function generateGapAnalysisSystemPrompt(jurisdictionContext?: JurisdictionContext): string;
export declare function generateChunkAnalysisUserPrompt(params: Omit<GapAnalysisParams, 'policyText'> & {
    chunkText: string;
}, chunkIndex: number, totalChunks: number): string;
export declare function generateMergeUserPrompt(rawGaps: unknown[], params: Omit<GapAnalysisParams, 'policyText'> & {
    chunkCount: number;
}): string;
export declare function generateGapAnalysisUserPrompt(params: GapAnalysisParams): string;
export declare const GAP_SCORING_VERSION = "v1.0-deterministic";
export interface DeterministicScoreBreakdown {
    calculatedScore: number;
    modelSuggestedScore?: number;
    scoringVersion: string;
    penalties: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalPenalty: number;
    };
    gapCounts: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        total: number;
    };
}
export declare function calculateDeterministicGapScore(gaps: Array<{
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}>, modelSuggestedScore?: number): DeterministicScoreBreakdown;
export declare function parseGapAnalysisOutput(rawContent: string): GapAnalysisResult;
export declare function parseChunkAnalysisOutput(rawContent: string, chunkIndex: number): RawChunkGapItem[];
//# sourceMappingURL=gap-analysis.d.ts.map