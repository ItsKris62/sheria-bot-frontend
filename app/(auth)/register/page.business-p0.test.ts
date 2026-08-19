import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("registration invitation contract", () => {
  const source = readFileSync(resolve(__dirname, "page.tsx"), "utf8");

  it("reads invitation token and email from the invite URL", () => {
    expect(source).toContain('useSearchParams');
    expect(source).toContain('searchParams.get("token")');
    expect(source).toContain('searchParams.get("email")');
  });

  it("submits invitationToken and does not send companyName for invited joins", () => {
    expect(source).toContain("invitationToken: invitationToken || undefined");
    expect(source).toContain("companyName: hasInvitation ? undefined : formData.companyName || undefined");
  });
});
