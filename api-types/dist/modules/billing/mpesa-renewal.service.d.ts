interface RenewalResult {
    scanned: number;
    remindersSent: number;
    transitionedPastDue: number;
    expired: number;
    skipped: number;
    errors: number;
}
declare class MpesaRenewalService {
    run(): Promise<RenewalResult>;
}
export declare const mpesaRenewalService: MpesaRenewalService;
export { MpesaRenewalService };
//# sourceMappingURL=mpesa-renewal.service.d.ts.map