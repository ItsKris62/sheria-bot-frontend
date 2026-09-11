/**
 * Read-Only Legacy Source & Signal Analysis Script
 *
 * Inspects legacy BlogSourceMonitor, BlogSourceItem, and RegulatorySignal
 * records to report distribution, duplication, and alert associations.
 */
export interface LegacyAnalysisReport {
    timestamp: string;
    blogSourceMonitors: {
        total: number;
        officialCount: number;
        byJurisdiction: Record<string, number>;
    };
    blogSourceItems: {
        total: number;
        byJurisdiction: Record<string, number>;
        withRegulatorySignals: number;
    };
    regulatorySignals: {
        total: number;
        byJurisdiction: Record<string, number>;
        bySeverity: Record<string, number>;
    };
    regulatoryAlerts: {
        total: number;
        legacyWithoutSourceItem: number;
        linkedToSourceItem: number;
    };
}
export declare function analyzeLegacySources(): Promise<LegacyAnalysisReport>;
//# sourceMappingURL=analyze-legacy-sources.d.ts.map