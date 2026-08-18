import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const billingPage = readFileSync(resolve(__dirname, "page.tsx"), "utf8")
const mpesaFlow = readFileSync(resolve(__dirname, "../../../../components/billing/MpesaPaymentFlow.tsx"), "utf8")
const subscriptionBanner = readFileSync(resolve(__dirname, "../../../../components/plan/subscription-status-banner.tsx"), "utf8")

describe("billing IntaSend active-provider routing", () => {
  it("routes plan checkout to M-Pesa when IntaSend is active or Stripe is disabled", () => {
    expect(billingPage).toContain('billing?.activePaymentProvider ?? "INTASEND"')
    expect(billingPage).toContain('activeProvider === "INTASEND" || !stripeEnabled')
    expect(billingPage).toContain('activeProvider !== "STRIPE" || !stripeEnabled')
    expect(billingPage).toContain("setMpesaFlow({ plan: selectedPlan, paymentPurpose })")
    expect(billingPage).toContain('const isManagedByStripe = isStripeProviderActive && billing?.stripeCustomerId != null')
  })

  it("uses backend catalogue prices for M-Pesa display instead of local plan constants", () => {
    expect(billingPage).toContain("billing?.catalogPrice?.[planId]")
    expect(billingPage).toContain("planPriceKes={mpesaPriceForPlan(mpesaFlow.plan)}")
    expect(mpesaFlow).toContain("planPriceKes")
    expect(mpesaFlow).not.toContain("PLAN_PRICES")
  })

  it("keeps the global subscription banner out of Stripe portal while IntaSend is active", () => {
    expect(subscriptionBanner).not.toContain("createPortalSession")
    expect(subscriptionBanner).toContain('href="/settings/billing"')
    expect(subscriptionBanner).toContain("Pay Renewal")
  })
})
