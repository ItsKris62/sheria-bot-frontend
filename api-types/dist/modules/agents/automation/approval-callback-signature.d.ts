export interface ApprovalCallbackSignatureInput {
    approvalId: string;
    decision: 'approved' | 'rejected';
    timestampSeconds: number;
}
/**
 * HMAC-SHA256 over "${approvalId}.${decision}.${timestamp}", hex-encoded.
 * Must match n8n's verification exactly (field order, dot separator, unix
 * seconds) - this scheme is already implemented and tested on the n8n side.
 */
export declare function signApprovalCallback(secret: string, input: ApprovalCallbackSignatureInput): string;
//# sourceMappingURL=approval-callback-signature.d.ts.map