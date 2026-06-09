/**
 * Base application error class
 * All custom errors extend from this
 */
export declare class AppError extends Error {
    statusCode: number;
    code: string;
    metadata?: Record<string, any> | undefined;
    constructor(statusCode: number, code: string, message: string, metadata?: Record<string, any> | undefined);
    /**
     * Serialize error for API response
     */
    toJSON(): {
        error: {
            details?: Record<string, any> | undefined;
            code: string;
            message: string;
        };
    };
}
/**
 * 400 Bad Request
 * Client sent invalid data
 */
export declare class BadRequestError extends AppError {
    constructor(message?: string, metadata?: Record<string, any>);
}
/**
 * 401 Unauthorized
 * Authentication required or failed
 */
export declare class UnauthorizedError extends AppError {
    constructor(message?: string, code?: string, metadata?: Record<string, any>);
}
/**
 * 403 Forbidden
 * User authenticated but doesn't have permission
 */
export declare class ForbiddenError extends AppError {
    constructor(message?: string, metadata?: Record<string, any>);
}
/**
 * 404 Not Found
 * Resource not found
 */
export declare class NotFoundError extends AppError {
    constructor(resource?: string, metadata?: Record<string, any>);
}
/**
 * 409 Conflict
 * Resource already exists or constraint violation
 */
export declare class ConflictError extends AppError {
    constructor(message?: string, metadata?: Record<string, any>);
}
/**
 * 422 Validation Error
 * Request data failed validation
 */
export declare class ValidationError extends AppError {
    constructor(message?: string, validationErrors?: Record<string, any>);
    /**
     * Create from Zod validation error
     */
    static fromZod(zodError: any): ValidationError;
}
/**
 * 429 Too Many Requests
 * Rate limit exceeded
 */
export declare class TooManyRequestsError extends AppError {
    constructor(message?: string, retryAfter?: number, metadata?: Record<string, any>);
}
/**
 * 500 Internal Server Error
 * Unexpected server error
 */
export declare class InternalServerError extends AppError {
    constructor(message?: string, metadata?: Record<string, any>);
}
/**
 * 503 Service Unavailable
 * Service temporarily unavailable
 */
export declare class ServiceUnavailableError extends AppError {
    constructor(service?: string, metadata?: Record<string, any>);
}
/**
 * Authentication-specific errors
 */
export declare class InvalidCredentialsError extends UnauthorizedError {
    constructor();
}
export declare class EmailNotVerifiedError extends UnauthorizedError {
    constructor();
}
export declare class AccountSuspendedError extends ForbiddenError {
    constructor();
}
export declare class TokenExpiredError extends UnauthorizedError {
    constructor();
}
export declare class SessionNotFoundError extends UnauthorizedError {
    constructor();
}
export declare class EmailAlreadyExistsError extends ConflictError {
    constructor();
}
export declare class WeakPasswordError extends BadRequestError {
    constructor();
}
/**
 * Resource-specific errors
 */
export declare class UserNotFoundError extends NotFoundError {
    constructor(userId?: string);
}
export declare class PolicyNotFoundError extends NotFoundError {
    constructor(policyId?: string);
}
export declare class DocumentNotFoundError extends NotFoundError {
    constructor(documentId?: string);
}
export declare class OrganizationNotFoundError extends NotFoundError {
    constructor(organizationId?: string);
}
/**
 * File upload errors
 */
export declare class InvalidFileTypeError extends BadRequestError {
    constructor(allowedTypes: string[]);
}
export declare class FileTooLargeError extends BadRequestError {
    constructor(maxSize: number, actualSize: number);
}
/**
 * AI/RAG errors
 */
export declare class AIServiceError extends InternalServerError {
    constructor(message?: string, metadata?: Record<string, any>);
}
export declare class PolicyGenerationError extends InternalServerError {
    constructor(message?: string, metadata?: Record<string, any>);
}
export declare class ComplianceQueryError extends InternalServerError {
    constructor(message?: string, metadata?: Record<string, any>);
}
export declare class VectorSearchError extends InternalServerError {
    constructor(message?: string, metadata?: Record<string, any>);
}
/**
 * Document processing errors
 */
export declare class DocumentUploadError extends InternalServerError {
    constructor(message?: string, metadata?: Record<string, any>);
}
export declare class DocumentParsingError extends InternalServerError {
    constructor(message?: string, metadata?: Record<string, any>);
}
export declare class DocumentIndexingError extends InternalServerError {
    constructor(message?: string, metadata?: Record<string, any>);
}
/**
 * External service errors
 */
export declare class EmailServiceError extends ServiceUnavailableError {
    constructor(message?: string);
}
export declare class StorageServiceError extends ServiceUnavailableError {
    constructor(message?: string);
}
export declare class RedisError extends ServiceUnavailableError {
    constructor(message?: string);
}
export declare class PineconeError extends ServiceUnavailableError {
    constructor(message?: string);
}
/**
 * Check if error is an AppError
 */
export declare function isAppError(error: any): error is AppError;
/**
 * Convert any error to AppError
 */
export declare function toAppError(error: any): AppError;
//# sourceMappingURL=error.d.ts.map