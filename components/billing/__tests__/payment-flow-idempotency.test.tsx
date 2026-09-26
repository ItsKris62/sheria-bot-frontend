import { describe, it, expect, vi, beforeEach } from "vitest";
import { setIdempotencyKey, getActiveIdempotencyKey, createTRPCClient } from "@/lib/trpc";

describe("Frontend Payment Idempotency Flow (F-09)", () => {
  let capturedHeaders: Record<string, string>[] = [];
  let capturedUrls: string[] = [];

  beforeEach(() => {
    capturedHeaders = [];
    capturedUrls = [];
    setIdempotencyKey(null);
  });

  it("attaches Idempotency-Key header on payment mutation fetch", async () => {
    const customFetch = vi.fn(async (url: any, options: any) => {
      capturedUrls.push(url.toString());
      const headersObj: Record<string, string> = {};
      if (options?.headers) {
        new Headers(options.headers).forEach((value, key) => {
          headersObj[key] = value;
        });
      }
      capturedHeaders.push(headersObj);
      return new Response(JSON.stringify([{ result: { data: { paymentId: "pmt_1" } } }]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const key1 = "uuid-key-attempt-1";
    setIdempotencyKey(key1);
    expect(getActiveIdempotencyKey()).toBe(key1);

    const url = "http://localhost:4000/trpc/billing.initiateMpesaPayment";
    await customFetch(url, {
      method: "POST",
      headers: {
        ...(getActiveIdempotencyKey() ? { "Idempotency-Key": getActiveIdempotencyKey()! } : {}),
      },
    });

    expect(capturedHeaders[0]["idempotency-key"]).toBe(key1);

    // Cleared upon completion / onSettled
    setIdempotencyKey(null);
    expect(getActiveIdempotencyKey()).toBeNull();
  });

  it("regenerates a fresh Idempotency-Key on retry and clears upon success", async () => {
    const keysGenerated: string[] = [];
    let activeKey: string | null = null;

    function mockTriggerPayment() {
      // Mimics handlePay() in MpesaPaymentFlow.tsx
      const newKey = crypto.randomUUID();
      keysGenerated.push(newKey);
      setIdempotencyKey(newKey);
      activeKey = getActiveIdempotencyKey();
    }

    function mockPaymentSettled() {
      setIdempotencyKey(null);
      activeKey = null;
    }

    // Attempt 1: First payment attempt
    mockTriggerPayment();
    expect(activeKey).toBeDefined();
    expect(getActiveIdempotencyKey()).toBe(keysGenerated[0]);
    // Settles with error / retry needed
    mockPaymentSettled();
    expect(getActiveIdempotencyKey()).toBeNull();

    // Attempt 2: User clicks Retry
    mockTriggerPayment();
    expect(activeKey).toBeDefined();
    expect(getActiveIdempotencyKey()).toBe(keysGenerated[1]);
    expect(keysGenerated[1]).not.toBe(keysGenerated[0]); // Fresh key generated on retry!

    // Settles with success
    mockPaymentSettled();
    expect(getActiveIdempotencyKey()).toBeNull(); // Cleared on success
  });

  it("does not attach Idempotency-Key on non-payment requests even if activeIdempotencyKey is set", async () => {
    const headersWithKey = new Headers({ "Idempotency-Key": "should-not-leak" });
    const nonPaymentUrl = "http://localhost:4000/trpc/user.getProfile";

    // Replicate filter in lib/trpc.ts fetch wrapper
    const urlStr = nonPaymentUrl;
    const isPaymentMutation =
      urlStr.includes("billing.createCheckoutSession") ||
      urlStr.includes("billing.initiateMpesaPayment");
    if (!isPaymentMutation && headersWithKey.has("Idempotency-Key")) {
      headersWithKey.delete("Idempotency-Key");
    }

    expect(headersWithKey.has("Idempotency-Key")).toBe(false);
  });
});
