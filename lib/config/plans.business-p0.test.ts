import { describe, expect, it } from "vitest";
import { PLANS } from "./plans";

describe("Business pricing display", () => {
  it("matches the backend canonical Business annual price", () => {
    expect(PLANS.BUSINESS.price).toMatchObject({
      monthly: 35000,
      yearly: 357000,
      currency: "KES",
    });
  });
});
