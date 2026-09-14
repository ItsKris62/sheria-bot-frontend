/**
 * Billing Date Utilities
 *
 * Precise calendar-month and calendar-year arithmetic for subscriptions and usage accounting.
 *
 * Invariants:
 * 1. Never uses fixed 30-day (2,592,000s) or 365-day (31,536,000s) approximations.
 * 2. End-of-month clamping: e.g. Jan 31 + 1 month -> Feb 28 (or Feb 29 in leap years), Aug 31 + 1 month -> Sep 30.
 * 3. Leap-year clamping: Feb 29 + 1 year -> Feb 28 in non-leap years.
 * 4. UTC storage and calculation consistency.
 * 5. Early renewal preserves already-paid service time.
 * 6. Annual billing period and monthly usage quota periods are strictly separated.
 */
export declare function isLeapYear(year: number): boolean;
export declare function getDaysInMonth(year: number, monthIndex0: number): number;
/**
 * Adds calendar months to a UTC Date, clamping day-of-month to the target month's maximum.
 * If anchorDay is provided, preserves the original billing anchor day across short months.
 */
export declare function addCalendarMonths(date: Date, months: number, anchorDay?: number): Date;
/**
 * Adds calendar years to a UTC Date, clamping Feb 29 to Feb 28 on non-leap years.
 */
export declare function addCalendarYears(date: Date, years: number): Date;
/**
 * Computes the next billing cycle start and end dates based on subscription interval.
 *
 * - For early renewals, preserves remaining prepaid service:
 *   If paidThrough > now, starts at paidThrough and extends by 1 month or 1 year.
 * - For expired or new subscriptions, starts at now and extends by 1 month or 1 year.
 * - Preserves the original billing anchorDay across short-month clamping.
 */
export declare function computeSubscriptionCycle(params: {
    interval: 'monthly' | 'yearly';
    paidThrough?: Date | null;
    anchorDay?: number;
    now?: Date;
}): {
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
};
/**
 * Returns the current monthly usage entitlement period (UTC calendar month).
 */
export declare function getMonthlyQuotaPeriod(now?: Date): {
    periodStart: Date;
    periodEnd: Date;
    periodKey: string;
};
//# sourceMappingURL=billing-dates.d.ts.map