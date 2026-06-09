/**
 * Application constants
 * Enums, regulatory data, error codes, and other constant values
 */
/**
 * User roles enum
 */
export declare enum UserRole {
    ADMIN = "ADMIN",
    REGULATOR = "REGULATOR",
    STARTUP = "STARTUP",
    ENTERPRISE = "ENTERPRISE"
}
/**
 * User status enum
 */
export declare enum UserStatus {
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    DEACTIVATED = "DEACTIVATED"
}
/**
 * Organization type enum
 */
export declare enum OrganizationType {
    GOVERNMENT = "GOVERNMENT",
    REGULATOR = "REGULATOR",
    STARTUP = "STARTUP",
    ENTERPRISE = "ENTERPRISE",
    NGO = "NGO"
}
/**
 * Policy status enum
 */
export declare enum PolicyStatus {
    DRAFT = "DRAFT",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Policy urgency levels
 */
export declare enum PolicyUrgency {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Legal document status
 */
export declare enum DocumentStatus {
    UPLOADING = "UPLOADING",
    PROCESSING = "PROCESSING",
    INDEXED = "INDEXED",
    FAILED = "FAILED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Document type enum
 */
export declare enum DocumentType {
    ACT = "ACT",
    REGULATION = "REGULATION",
    GUIDELINE = "GUIDELINE",
    POLICY = "POLICY",
    DIRECTIVE = "DIRECTIVE",
    CIRCULAR = "CIRCULAR"
}
/**
 * Compliance query status
 */
export declare enum ComplianceQueryStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
/**
 * Checklist status
 */
export declare enum ChecklistStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    OVERDUE = "OVERDUE"
}
/**
 * Notification types
 */
export declare enum NotificationType {
    POLICY_READY = "POLICY_READY",
    POLICY_FAILED = "POLICY_FAILED",
    COMMENT_ADDED = "COMMENT_ADDED",
    COMMENT_REPLY = "COMMENT_REPLY",
    COMPLIANCE_ALERT = "COMPLIANCE_ALERT",
    DOCUMENT_INDEXED = "DOCUMENT_INDEXED",
    SYSTEM_ALERT = "SYSTEM_ALERT",
    SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
    PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
    ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED"
}
/**
 * Audit log actions
 */
export declare enum AuditAction {
    USER_CREATED = "USER_CREATED",
    USER_UPDATED = "USER_UPDATED",
    USER_DELETED = "USER_DELETED",
    USER_LOGIN = "USER_LOGIN",
    USER_LOGOUT = "USER_LOGOUT",
    POLICY_GENERATED = "POLICY_GENERATED",
    POLICY_UPDATED = "POLICY_UPDATED",
    POLICY_DELETED = "POLICY_DELETED",
    DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED",
    DOCUMENT_DELETED = "DOCUMENT_DELETED",
    COMPLIANCE_QUERY = "COMPLIANCE_QUERY",
    SETTINGS_CHANGED = "SETTINGS_CHANGED",
    ROLE_CHANGED = "ROLE_CHANGED"
}
/**
 * Citation confidence levels
 */
export declare enum CitationConfidence {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    UNVERIFIED = "UNVERIFIED"
}
/**
 * Kenyan regulatory areas
 * Key compliance domains for fintech
 */
export declare const REGULATORY_AREAS: readonly ["Data Protection", "Fintech & Digital Lending", "Anti-Money Laundering (AML)", "Know Your Customer (KYC)", "Consumer Protection", "Cybersecurity", "Payment Systems", "Banking & Financial Services", "Insurance", "Capital Markets", "Tax Compliance", "Employment & Labor", "Intellectual Property", "Competition & Antitrust", "Environmental Compliance"];
export type RegulatoryArea = (typeof REGULATORY_AREAS)[number];
/**
 * Kenyan legal acts and regulations
 * Key legislation for fintech compliance
 */
export declare const KENYAN_LEGAL_ACTS: readonly [{
    readonly name: "Data Protection Act, 2019";
    readonly shortName: "DPA 2019";
    readonly year: 2019;
    readonly areas: readonly ["Data Protection", "Cybersecurity"];
    readonly authority: "Office of the Data Protection Commissioner";
}, {
    readonly name: "Data Protection (General) Regulations, 2021";
    readonly shortName: "DPA Regulations 2021";
    readonly year: 2021;
    readonly areas: readonly ["Data Protection"];
    readonly authority: "Office of the Data Protection Commissioner";
}, {
    readonly name: "Central Bank of Kenya Act (Cap. 491)";
    readonly shortName: "CBK Act";
    readonly year: 1966;
    readonly areas: readonly ["Banking & Financial Services", "Fintech & Digital Lending"];
    readonly authority: "Central Bank of Kenya";
}, {
    readonly name: "Banking Act (Cap. 488)";
    readonly shortName: "Banking Act";
    readonly year: 1989;
    readonly areas: readonly ["Banking & Financial Services"];
    readonly authority: "Central Bank of Kenya";
}, {
    readonly name: "Microfinance Act, 2006";
    readonly shortName: "Microfinance Act";
    readonly year: 2006;
    readonly areas: readonly ["Fintech & Digital Lending"];
    readonly authority: "Central Bank of Kenya";
}, {
    readonly name: "Central Bank of Kenya (Digital Credit Providers) Regulations, 2022";
    readonly shortName: "Digital Credit Regulations 2022";
    readonly year: 2022;
    readonly areas: readonly ["Fintech & Digital Lending", "Consumer Protection"];
    readonly authority: "Central Bank of Kenya";
}, {
    readonly name: "National Payment System Act, 2011";
    readonly shortName: "NPS Act 2011";
    readonly year: 2011;
    readonly areas: readonly ["Payment Systems", "Fintech & Digital Lending"];
    readonly authority: "Central Bank of Kenya";
}, {
    readonly name: "National Payment System Regulations, 2014";
    readonly shortName: "NPS Regulations 2014";
    readonly year: 2014;
    readonly areas: readonly ["Payment Systems"];
    readonly authority: "Central Bank of Kenya";
}, {
    readonly name: "Proceeds of Crime and Anti-Money Laundering Act, 2009";
    readonly shortName: "POCAMLA 2009";
    readonly year: 2009;
    readonly areas: readonly ["Anti-Money Laundering (AML)", "KYC"];
    readonly authority: "Financial Reporting Centre";
}, {
    readonly name: "Proceeds of Crime and Anti-Money Laundering (Amendment) Act, 2017";
    readonly shortName: "POCAMLA Amendment 2017";
    readonly year: 2017;
    readonly areas: readonly ["Anti-Money Laundering (AML)"];
    readonly authority: "Financial Reporting Centre";
}, {
    readonly name: "Consumer Protection Act, 2012";
    readonly shortName: "CPA 2012";
    readonly year: 2012;
    readonly areas: readonly ["Consumer Protection"];
    readonly authority: "Competition Authority of Kenya";
}, {
    readonly name: "Computer Misuse and Cybercrimes Act, 2018";
    readonly shortName: "Cybercrimes Act 2018";
    readonly year: 2018;
    readonly areas: readonly ["Cybersecurity"];
    readonly authority: "Communications Authority of Kenya";
}, {
    readonly name: "Kenya Information and Communications Act (Cap. 411A)";
    readonly shortName: "KICA";
    readonly year: 1998;
    readonly areas: readonly ["Cybersecurity", "Data Protection"];
    readonly authority: "Communications Authority of Kenya";
}, {
    readonly name: "Capital Markets Act (Cap. 485A)";
    readonly shortName: "CMA Act";
    readonly year: 1989;
    readonly areas: readonly ["Capital Markets"];
    readonly authority: "Capital Markets Authority";
}, {
    readonly name: "Insurance Act (Cap. 487)";
    readonly shortName: "Insurance Act";
    readonly year: 2006;
    readonly areas: readonly ["Insurance"];
    readonly authority: "Insurance Regulatory Authority";
}, {
    readonly name: "Income Tax Act (Cap. 470)";
    readonly shortName: "ITA";
    readonly year: 1973;
    readonly areas: readonly ["Tax Compliance"];
    readonly authority: "Kenya Revenue Authority";
}, {
    readonly name: "Value Added Tax Act, 2013";
    readonly shortName: "VAT Act 2013";
    readonly year: 2013;
    readonly areas: readonly ["Tax Compliance"];
    readonly authority: "Kenya Revenue Authority";
}, {
    readonly name: "Tax Procedures Act, 2015";
    readonly shortName: "TPA 2015";
    readonly year: 2015;
    readonly areas: readonly ["Tax Compliance"];
    readonly authority: "Kenya Revenue Authority";
}, {
    readonly name: "Employment Act, 2007";
    readonly shortName: "Employment Act 2007";
    readonly year: 2007;
    readonly areas: readonly ["Employment & Labor"];
    readonly authority: "Ministry of Labour";
}, {
    readonly name: "Competition Act, 2010";
    readonly shortName: "Competition Act 2010";
    readonly year: 2010;
    readonly areas: readonly ["Competition & Antitrust"];
    readonly authority: "Competition Authority of Kenya";
}];
/**
 * Kenyan regulatory authorities
 */
export declare const REGULATORY_AUTHORITIES: readonly ["Central Bank of Kenya (CBK)", "Office of the Data Protection Commissioner (ODPC)", "Communications Authority of Kenya (CA)", "Capital Markets Authority (CMA)", "Insurance Regulatory Authority (IRA)", "Kenya Revenue Authority (KRA)", "Financial Reporting Centre (FRC)", "Competition Authority of Kenya (CAK)", "Retirement Benefits Authority (RBA)", "Sacco Societies Regulatory Authority (SASRA)"];
/**
 * Error codes for API responses
 */
export declare const ERROR_CODES: {
    readonly INVALID_CREDENTIALS: "AUTH_1001";
    readonly EMAIL_NOT_VERIFIED: "AUTH_1002";
    readonly ACCOUNT_SUSPENDED: "AUTH_1003";
    readonly ACCOUNT_DEACTIVATED: "AUTH_1004";
    readonly INVALID_TOKEN: "AUTH_1005";
    readonly TOKEN_EXPIRED: "AUTH_1006";
    readonly REFRESH_TOKEN_INVALID: "AUTH_1007";
    readonly SESSION_NOT_FOUND: "AUTH_1008";
    readonly EMAIL_ALREADY_EXISTS: "AUTH_1009";
    readonly WEAK_PASSWORD: "AUTH_1010";
    readonly INSUFFICIENT_PERMISSIONS: "AUTHZ_2001";
    readonly INVALID_ROLE: "AUTHZ_2002";
    readonly ORGANIZATION_MISMATCH: "AUTHZ_2003";
    readonly RESOURCE_FORBIDDEN: "AUTHZ_2004";
    readonly INVALID_INPUT: "VAL_3001";
    readonly MISSING_REQUIRED_FIELD: "VAL_3002";
    readonly INVALID_EMAIL: "VAL_3003";
    readonly INVALID_PHONE: "VAL_3004";
    readonly INVALID_DATE: "VAL_3005";
    readonly INVALID_FILE_TYPE: "VAL_3006";
    readonly FILE_TOO_LARGE: "VAL_3007";
    readonly RESOURCE_NOT_FOUND: "RES_4001";
    readonly USER_NOT_FOUND: "RES_4002";
    readonly POLICY_NOT_FOUND: "RES_4003";
    readonly DOCUMENT_NOT_FOUND: "RES_4004";
    readonly ORGANIZATION_NOT_FOUND: "RES_4005";
    readonly RATE_LIMIT_EXCEEDED: "RATE_5001";
    readonly TOO_MANY_REQUESTS: "RATE_5002";
    readonly DAILY_LIMIT_EXCEEDED: "RATE_5003";
    readonly AI_SERVICE_ERROR: "AI_6001";
    readonly POLICY_GENERATION_FAILED: "AI_6002";
    readonly COMPLIANCE_QUERY_FAILED: "AI_6003";
    readonly EMBEDDING_GENERATION_FAILED: "AI_6004";
    readonly VECTOR_SEARCH_FAILED: "AI_6005";
    readonly DOCUMENT_UPLOAD_FAILED: "DOC_7001";
    readonly DOCUMENT_PARSING_FAILED: "DOC_7002";
    readonly DOCUMENT_INDEXING_FAILED: "DOC_7003";
    readonly INVALID_DOCUMENT_FORMAT: "DOC_7004";
    readonly DATABASE_ERROR: "DB_8001";
    readonly TRANSACTION_FAILED: "DB_8002";
    readonly CONSTRAINT_VIOLATION: "DB_8003";
    readonly UNIQUE_VIOLATION: "DB_8004";
    readonly EXTERNAL_SERVICE_ERROR: "EXT_9001";
    readonly EMAIL_SERVICE_ERROR: "EXT_9002";
    readonly STORAGE_SERVICE_ERROR: "EXT_9003";
    readonly PAYMENT_SERVICE_ERROR: "EXT_9004";
    readonly REDIS_ERROR: "EXT_9005";
    readonly PINECONE_ERROR: "EXT_9006";
    readonly INTERNAL_SERVER_ERROR: "SYS_10001";
    readonly SERVICE_UNAVAILABLE: "SYS_10002";
    readonly MAINTENANCE_MODE: "SYS_10003";
};
/**
 * Error messages for error codes
 */
export declare const ERROR_MESSAGES: Record<string, string>;
/**
 * Cache key prefixes
 * Matches Redis configuration
 */
export declare const CACHE_KEYS: {
    readonly SESSION: "session:";
    readonly USER: "user:";
    readonly POLICY: "policy:";
    readonly COMPLIANCE: "compliance:";
    readonly RAG: "rag:";
    readonly TOKEN: "token:";
    readonly RATE_LIMIT: "ratelimit:";
    readonly NOTIFICATION: "notification:";
    readonly ANALYTICS: "analytics:";
};
/**
 * Pagination defaults
 */
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 10;
    readonly MAX_LIMIT: 100;
};
/**
 * Date formats
 */
export declare const DATE_FORMATS: {
    readonly API: "YYYY-MM-DD";
    readonly DISPLAY: "DD/MM/YYYY";
    readonly DATETIME: "YYYY-MM-DD HH:mm:ss";
    readonly TIME: "HH:mm:ss";
};
/**
 * Currency formats (Kenyan Shilling)
 */
export declare const CURRENCY: {
    readonly CODE: "KES";
    readonly SYMBOL: "KSh";
    readonly DECIMAL_PLACES: 2;
};
//# sourceMappingURL=constants.d.ts.map