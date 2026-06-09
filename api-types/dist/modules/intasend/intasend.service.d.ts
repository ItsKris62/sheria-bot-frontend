/**
 * IntaSend Service
 *
 * Wraps the intasend-node SDK for M-Pesa STK push payments.
 *
 * Webhook security note:
 *   The intasend-node SDK has no built-in webhook signature verification.
 *   On webhook receipt we re-call collection.status(invoice_id) to confirm
 *   the reported state directly from IntaSend's API before acting on it.
 *   This is more reliable than trusting the webhook payload alone because
 *   it goes back to the authoritative source.
 */
import { type STKPushInput, type STKPushResponse, type PaymentStatusResponse } from './intasend.types';
/**
 * Normalise a Kenyan phone number to the 254XXXXXXXXX format.
 *
 * Accepts:
 *   07XX XXX XXX  ->  2547XXXXXXXX
 *   01XX XXX XXX  ->  2541XXXXXXXX
 *   +254XXXXXXXXX ->  254XXXXXXXXX
 *   254XXXXXXXXX  ->  254XXXXXXXXX (already valid)
 *
 * Returns null if the number cannot be normalised.
 */
export declare function normalisePhoneNumber(raw: string): string | null;
declare class IntaSendService {
    /**
     * Initiate an M-Pesa STK push.
     *
     * @param input - phoneNumber (254XXXXXXXXX), amount in KES (whole number,
     *                NOT cents), accountReference, and narrative.
     * @returns invoiceId for status polling + raw response for metadata storage.
     */
    initiateSTKPush(input: STKPushInput): Promise<STKPushResponse>;
    /**
     * Check the current status of a payment by its IntaSend invoice ID.
     *
     * Called both by the frontend polling endpoint and by the webhook handler
     * to re-verify the reported state before acting on it.
     */
    getPaymentStatus(invoiceId: string): Promise<PaymentStatusResponse>;
}
export declare const intaSendService: IntaSendService;
export { IntaSendService };
//# sourceMappingURL=intasend.service.d.ts.map