/** Shared "1d" / "24h" style window parser for every agents.automation.* procedure that takes a `window` input. */
export declare function parseWindowDays(window: string): number;
/** Comma-separated jurisdiction filter parser, shared across getSources/fetchSource/getMetrics/etc. */
export declare function parseJurisdictionFilter(jurisdictions: string | undefined): string[] | null;
//# sourceMappingURL=duration.d.ts.map