/**
 * Password hashing and verification
 */
/**
 * Hash password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Verify password against hash
 * @param password Plain text password
 * @param hashedPassword Hashed password from database
 * @returns true if password matches
 */
export declare function verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
/**
 * Token generation
 */
/**
 * Generate secure random token
 * @param length Token length in bytes (default: 32)
 * @returns Hex string token
 */
export declare function generateToken(length?: number): string;
/**
 * Generate short alphanumeric code (for verification, etc.)
 * @param length Code length (default: 6)
 * @returns Alphanumeric code
 */
export declare function generateCode(length?: number): string;
/**
 * Generate unique ID using nanoid
 * @param length ID length (default: 21)
 * @returns Unique ID
 */
export declare function generateId(length?: number): string;
/**
 * Generate short ID (for public IDs, slugs)
 * @param length ID length (default: 8)
 * @returns Short unique ID
 */
export declare function generateShortId(length?: number): string;
/**
 * String manipulation
 */
/**
 * Slugify text for URLs
 * @param text Text to slugify
 * @returns URL-safe slug
 *
 * @example
 * slugify("Data Protection Act 2019") // "data-protection-act-2019"
 */
export declare function slugify(text: string): string;
/**
 * Truncate text to specified length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @param suffix Suffix to add if truncated (default: '...')
 * @returns Truncated text
 */
export declare function truncate(text: string, maxLength: number, suffix?: string): string;
/**
 * Capitalize first letter of string
 * @param text Text to capitalize
 * @returns Capitalized text
 */
export declare function capitalize(text: string): string;
/**
 * Capitalize first letter of each word
 * @param text Text to title case
 * @returns Title cased text
 */
export declare function titleCase(text: string): string;
/**
 * Format Kenyan phone number for display
 * @param phone Phone number (any format)
 * @returns Formatted phone (e.g., "+254 712 345 678")
 */
export declare function formatPhone(phone: string): string;
/**
 * Currency formatting
 */
/**
 * Format amount as Kenyan Shillings
 * @param amount Amount in KES
 * @param showSymbol Whether to show currency symbol
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // "KSh 1,234.56"
 * formatCurrency(1000, false) // "1,000.00"
 */
export declare function formatCurrency(amount: number, showSymbol?: boolean): string;
/**
 * Parse currency string to number
 * @param currencyString Currency string (e.g., "KSh 1,234.56")
 * @returns Amount as number
 */
export declare function parseCurrency(currencyString: string): number;
/**
 * Hashing and encoding
 */
/**
 * Calculate SHA-256 hash of string
 * Useful for cache keys, checksums
 * @param text Text to hash
 * @returns Hex hash string
 */
export declare function hashString(text: string): string;
/**
 * Calculate MD5 hash (for quick checksums)
 * @param text Text to hash
 * @returns Hex hash string
 */
export declare function md5Hash(text: string): string;
/**
 * Base64 encode string
 * @param text Text to encode
 * @returns Base64 encoded string
 */
export declare function base64Encode(text: string): string;
/**
 * Base64 decode string
 * @param encoded Base64 encoded string
 * @returns Decoded string
 */
export declare function base64Decode(encoded: string): string;
/**
 * URL-safe base64 encode
 * @param text Text to encode
 * @returns URL-safe base64 string
 */
export declare function base64UrlEncode(text: string): string;
/**
 * URL-safe base64 decode
 * @param encoded URL-safe base64 string
 * @returns Decoded string
 */
export declare function base64UrlDecode(encoded: string): string;
/**
 * File handling
 */
/**
 * Generate unique filename with timestamp
 * @param originalName Original filename
 * @param preserveExtension Whether to keep original extension
 * @returns Unique filename
 *
 * @example
 * generateFilename("document.pdf") // "1704067200000-abc123.pdf"
 */
export declare function generateFilename(originalName: string, preserveExtension?: boolean): string;
/**
 * Get file extension from filename
 * @param filename Filename
 * @returns Extension with dot (e.g., ".pdf")
 */
export declare function getFileExtension(filename: string): string;
/**
 * Get MIME type from file extension
 * @param extension File extension (with or without dot)
 * @returns MIME type
 */
export declare function getMimeType(extension: string): string;
/**
 * Format file size for display
 * @param bytes File size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted size (e.g., "1.5 MB")
 */
export declare function formatFileSize(bytes: number, decimals?: number): string;
/**
 * Date and time
 */
/**
 * Calculate reading time from text
 * Assumes average reading speed of 200 words per minute
 * @param text Text content
 * @returns Reading time in minutes
 */
export declare function calculateReadingTime(text: string): number;
/**
 * Format duration in milliseconds to human-readable string
 * @param ms Duration in milliseconds
 * @returns Formatted duration (e.g., "2m 30s")
 */
export declare function formatDuration(ms: number): string;
/**
 * Check if date is in the past
 * @param date Date to check
 * @returns true if date is in the past
 */
export declare function isPast(date: Date | string): boolean;
/**
 * Check if date is in the future
 * @param date Date to check
 * @returns true if date is in the future
 */
export declare function isFuture(date: Date | string): boolean;
/**
 * Get date X days from now
 * @param days Number of days
 * @returns Future date
 */
export declare function addDays(days: number): Date;
/**
 * Object manipulation
 */
/**
 * Deep clone object
 * @param obj Object to clone
 * @returns Cloned object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Pick specific keys from object
 * @param obj Source object
 * @param keys Keys to pick
 * @returns New object with only specified keys
 */
export declare function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Omit specific keys from object
 * @param obj Source object
 * @param keys Keys to omit
 * @returns New object without specified keys
 */
export declare function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Check if object is empty
 * @param obj Object to check
 * @returns true if object has no keys
 */
export declare function isEmpty(obj: Record<string, any>): boolean;
/**
 * Array utilities
 */
/**
 * Remove duplicates from array
 * @param arr Array with potential duplicates
 * @returns Array with unique values
 */
export declare function unique<T>(arr: T[]): T[];
/**
 * Chunk array into smaller arrays
 * @param arr Source array
 * @param size Chunk size
 * @returns Array of chunks
 */
export declare function chunk<T>(arr: T[], size: number): T[][];
/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param arr Array to shuffle
 * @returns Shuffled array (new array)
 */
export declare function shuffle<T>(arr: T[]): T[];
/**
 * Async utilities
 */
/**
 * Sleep for specified duration
 * @param ms Duration in milliseconds
 * @returns Promise that resolves after duration
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Retry async function with exponential backoff
 * @param fn Async function to retry
 * @param maxAttempts Maximum number of attempts
 * @param delay Initial delay in ms
 * @returns Result of function
 */
export declare function retry<T>(fn: () => Promise<T>, maxAttempts?: number, delay?: number): Promise<T>;
/**
 * Sanitization
 */
/**
 * Sanitize HTML by removing tags
 * @param html HTML string
 * @returns Plain text
 */
export declare function stripHtml(html: string): string;
/**
 * Sanitize filename (remove special characters)
 * @param filename Original filename
 * @returns Sanitized filename
 */
export declare function sanitizeFilename(filename: string): string;
/**
 * Mask sensitive data (for logging)
 * @param value Value to mask
 * @param visibleChars Number of visible characters at start/end
 * @returns Masked value
 *
 * @example
 * maskSensitive("1234567890", 2) // "12****90"
 */
export declare function maskSensitive(value: string, visibleChars?: number): string;
//# sourceMappingURL=helpers.d.ts.map