import { z } from 'zod';
/**
 * Email validation schema
 * Standard email format with Kenyan TLD support
 */
export declare const emailSchema: z.ZodString;
/**
 * Kenyan phone number validation
 * Supports formats:
 * - +254712345678
 * - 0712345678
 * - 712345678
 */
export declare const phoneSchema: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
/**
 * Password validation schema.
 * Re-exported from the shared security module so all code paths share the
 * exact same rules: min 10 chars, uppercase, lowercase, digit, special char,
 * with granular per-rule messages.
 */
export { passwordSchema } from '@/shared/validation/password.schema';
/**
 * URL validation schema
 */
export declare const urlSchema: z.ZodString;
/**
 * UUID validation schema
 */
export declare const uuidSchema: z.ZodString;
/**
 * Date validation schema
 * Accepts ISO date string
 */
export declare const dateSchema: z.ZodString;
/**
 * Date range validation schema
 */
export declare const dateRangeSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
}, z.core.$strip>;
/**
 * Pagination schema
 * Standard pagination with page and limit
 */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Cursor-based pagination schema
 * For large datasets
 */
export declare const cursorPaginationSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Sort order schema
 */
export declare const sortOrderSchema: z.ZodDefault<z.ZodEnum<{
    asc: "asc";
    desc: "desc";
}>>;
/**
 * Search schema
 * For search queries with filters
 */
export declare const searchSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    query: z.ZodOptional<z.ZodString>;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    sort: z.ZodOptional<z.ZodObject<{
        field: z.ZodString;
        order: z.ZodDefault<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Kenyan national ID validation
 * Format: 12345678 (8 digits)
 */
export declare const nationalIdSchema: z.ZodString;
/**
 * Kenyan KRA PIN validation
 * Format: A123456789Z (letter + 9 digits + letter)
 */
export declare const kraPinSchema: z.ZodString;
/**
 * Currency amount validation (Kenyan Shillings)
 * Positive number with up to 2 decimal places
 */
export declare const currencySchema: z.ZodNumber;
/**
 * Percentage validation
 * 0-100 inclusive
 */
export declare const percentageSchema: z.ZodNumber;
/**
 * File upload validation schema
 */
export declare const fileUploadSchema: z.ZodObject<{
    filename: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    data: z.ZodOptional<z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>>;
}, z.core.$strip>;
/**
 * Coordinate validation (for location data)
 */
export declare const coordinateSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
}, z.core.$strip>;
/**
 * MongoDB ObjectId validation (if needed)
 */
export declare const objectIdSchema: z.ZodString;
/**
 * Slug validation (for URLs)
 * Lowercase alphanumeric with hyphens
 */
export declare const slugSchema: z.ZodString;
/**
 * Color hex code validation
 */
export declare const hexColorSchema: z.ZodString;
/**
 * JSON string validation
 * Validates that string is valid JSON
 */
export declare const jsonStringSchema: z.ZodString;
/**
 * IP address validation (IPv4 and IPv6)
 */
export declare const ipAddressSchema: z.ZodString;
/**
 * Kenyan business registration number validation
 * Format varies, but typically alphanumeric
 */
export declare const businessRegSchema: z.ZodString;
/**
 * Validate Kenyan M-PESA phone number
 * Must be Safaricom number starting with 7
 */
export declare const mpesaPhoneSchema: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
/**
 * Helper: Create enum schema with custom error message
 */
export declare function createEnumSchema<T extends readonly string[]>(values: T, errorMessage?: string): z.ZodEnum<{
    [x: string]: any;
}>;
/**
 * Helper: Create optional nullable schema
 */
export declare function nullable<T extends z.ZodTypeAny>(schema: T): z.ZodOptional<z.ZodNullable<T>>;
/**
 * Helper: Create array schema with min/max length
 */
export declare function arraySchema<T extends z.ZodTypeAny>(itemSchema: T, minLength?: number, maxLength?: number): z.ZodArray<T>;
/**
 * Helper: Validate and parse with Zod schema
 * Throws ValidationError if validation fails
 */
export declare function validateInput<T extends z.ZodTypeAny>(schema: T, data: unknown): Promise<z.infer<T>>;
/**
 * Helper: Safe parse (returns result instead of throwing)
 */
export declare function safeValidate<T extends z.ZodTypeAny>(schema: T, data: unknown): {
    success: true;
    data: z.infer<T>;
} | {
    success: false;
    error: z.ZodError;
};
/**
 * Helper: Check if value matches schema
 */
export declare function isValid<T extends z.ZodTypeAny>(schema: T, data: unknown): boolean;
/**
 * Sanitize input string
 * Remove HTML tags and dangerous characters
 */
export declare function sanitizeString(input: string): string;
/**
 * Sanitize object recursively
 * Apply sanitizeString to all string values
 */
export declare function sanitizeObject<T extends Record<string, any>>(obj: T): T;
/**
 * Export common type helpers
 */
export type InferInput<T extends z.ZodTypeAny> = z.input<T>;
export type InferOutput<T extends z.ZodTypeAny> = z.output<T>;
//# sourceMappingURL=validation.d.ts.map