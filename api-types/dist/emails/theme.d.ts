/**
 * SheriaBot Email Design System Tokens & Primitives
 * Authoritative RegTech & GovTech Design System for Kenya
 */
export declare const SHERIABOT_URL: string;
/**
 * SheriaBot Core Design Tokens
 */
export declare const SHERIA_EMAIL_PALETTE: {
    readonly brand: {
        readonly primary: "#00875A";
        readonly primaryHover: "#006C48";
        readonly primarySubtle: "#E8F5EE";
        readonly obsidian: "#0A0A0A";
        readonly navy: "#1A2B4A";
        readonly gold: "#D4A843";
        readonly goldSubtle: "#FDF8EC";
    };
    readonly surfaces: {
        readonly appBackground: "#F4F4F5";
        readonly cardBackground: "#FFFFFF";
        readonly cardSubtle: "#FAFAFA";
        readonly headerDark: "#0A0A0A";
        readonly borderLight: "#E4E4E7";
        readonly borderSubtle: "#F4F4F5";
        readonly borderDark: "#27272A";
    };
    readonly text: {
        readonly primary: "#0A0A0A";
        readonly body: "#27272A";
        readonly secondary: "#52525B";
        readonly muted: "#71717A";
        readonly faint: "#A1A1AA";
        readonly onDark: "#FFFFFF";
        readonly onEmerald: "#FFFFFF";
    };
};
/**
 * 5-Tier Regulatory Severity & Status Matrix
 */
export declare const SEVERITY_MATRIX: {
    readonly CRITICAL: {
        readonly border: "#DC2626";
        readonly bg: "#FEF2F2";
        readonly text: "#991B1B";
        readonly badge: "#DC2626";
        readonly label: "CRITICAL STATUTORY ALERT";
        readonly icon: "⚠️";
    };
    readonly HIGH: {
        readonly border: "#EA580C";
        readonly bg: "#FFF7ED";
        readonly text: "#C2410C";
        readonly badge: "#EA580C";
        readonly label: "HIGH REGULATORY PRIORITY";
        readonly icon: "⚡";
    };
    readonly MEDIUM: {
        readonly border: "#D4A843";
        readonly bg: "#FDF8EC";
        readonly text: "#854D0E";
        readonly badge: "#D4A843";
        readonly label: "REGULATORY NOTICE";
        readonly icon: "📌";
    };
    readonly LOW: {
        readonly border: "#3B82F6";
        readonly bg: "#EFF6FF";
        readonly text: "#1E40AF";
        readonly badge: "#3B82F6";
        readonly label: "INFORMATIONAL UPDATE";
        readonly icon: "ℹ️";
    };
    readonly COMPLIANT: {
        readonly border: "#00875A";
        readonly bg: "#E8F5EE";
        readonly text: "#006C48";
        readonly badge: "#00875A";
        readonly label: "COMPLIANT / AUDIT PASSED";
        readonly icon: "✓";
    };
};
/**
 * Backward-compatible EMAIL_THEME constant
 */
export declare const EMAIL_THEME: {
    readonly colors: {
        readonly primary: "#00875A";
        readonly primaryLight: "#22C55E";
        readonly accent: "#00875A";
        readonly obsidian: "#0A0A0A";
        readonly navy: "#1A2B4A";
        readonly gold: "#D4A843";
        readonly headerBackground: "#0A0A0A";
        readonly background: "#F4F4F5";
        readonly cardBackground: "#FFFFFF";
        readonly cardSubtle: "#FAFAFA";
        readonly text: "#0A0A0A";
        readonly textBody: "#27272A";
        readonly textSecondary: "#52525B";
        readonly textMuted: "#71717A";
        readonly textFaint: "#A1A1AA";
        readonly border: "#E4E4E7";
        readonly borderDark: "#27272A";
        readonly success: "#00875A";
        readonly warning: "#D4A843";
        readonly danger: "#DC2626";
        readonly dangerBg: "#FEF2F2";
        readonly warningBg: "#FDF8EC";
        readonly successBg: "#E8F5EE";
    };
    readonly fonts: {
        readonly body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
        readonly sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
        readonly mono: "'IBM Plex Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace";
        readonly citation: "'IBM Plex Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace";
    };
    readonly spacing: {
        readonly containerWidth: "600px";
        readonly containerPadding: "32px";
        readonly containerPaddingMobile: "16px";
        readonly sectionGap: "20px";
    };
    readonly radii: {
        readonly container: "10px";
        readonly card: "6px";
        readonly badge: "4px";
        readonly button: "6px";
    };
};
export declare const LOGO_URL: string;
export declare const EMAIL_SIGNATURE_LOGO_URL: string;
export declare const APP_NAME = "SheriaBot";
export declare const SUPPORT_EMAIL: string;
export declare const CURRENT_YEAR: number;
export declare const REGISTERED_OFFICE = "The Mirage, Tower 2, Penthouse Suite, Westlands, Nairobi, Kenya";
export declare const DATA_PROTECTION_DISCLAIMER = "SheriaBot processes compliance telemetry in accordance with the Kenya Data Protection Act, 2019 (ODPC Registered).";
export declare const LEGAL_DISCLAIMER = "SheriaBot provides regulatory intelligence and automated compliance insights for informational purposes and does not constitute formal legal counsel.";
//# sourceMappingURL=theme.d.ts.map