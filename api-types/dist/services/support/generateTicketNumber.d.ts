/**
 * Generates a unique ticket number in the format SB-YYYY-NNNNN.
 * Must be called inside a transaction to prevent race conditions.
 */
export declare function generateTicketNumber(prisma: any): Promise<string>;
//# sourceMappingURL=generateTicketNumber.d.ts.map