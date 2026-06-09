/**
 * UTM and Resend tag constants for marketing emails.
 *
 * UTMs are appended to outbound URLs ONLY when the FeatureFlag
 * 'marketing_utm_tracking' is enabled. This prevents URL noise when
 * no analytics tool is configured to receive the tracking parameters.
 */
export declare const UTM_DEFAULTS: {
    readonly source: "sheriabot";
    readonly medium: "email";
};
/**
 * Build a UTM-tagged URL when tracking is enabled.
 *
 * @param baseUrl    Original URL without UTM parameters
 * @param campaign   Campaign identifier (matches MarketingCampaign.name slug)
 * @param tracking   Whether tracking is enabled (read from FeatureFlag)
 * @returns Original URL or URL with utm_source/utm_medium/utm_campaign appended
 */
export declare function maybeAppendUtm(baseUrl: string, campaign: string, tracking: boolean): string;
export declare const FEATURE_FLAG_UTM_TRACKING: "marketing_utm_tracking";
//# sourceMappingURL=email-analytics.constants.d.ts.map