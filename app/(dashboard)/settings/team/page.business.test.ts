import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

function source(relativePath: string): string {
  return readFileSync(resolve(__dirname, relativePath), "utf8")
}

describe("Business Team settings page", () => {
  const page = source("page.tsx")
  const settingsLayout = readFileSync(resolve(__dirname, "../layout.tsx"), "utf8")
  const registerPage = readFileSync(resolve(__dirname, "../../../(auth)/register/page.tsx"), "utf8")
  const securityPage = readFileSync(resolve(__dirname, "../security/page.tsx"), "utf8")
  const plans = readFileSync(resolve(__dirname, "../../../../lib/config/plans.ts"), "utf8")

  it("uses real backend organization data for team summary and seats", () => {
    expect(page).toContain("trpc.organization.getTeamOverview.useQuery")
    expect(page).toContain("seatUsage.usedSeats")
    expect(page).toContain("seatUsage.seatLimit")
    expect(page).toContain("seatUsage.availableSeats")
    expect(page).toContain("Active members")
    expect(page).toContain("Suspended members")
    expect(page).toContain("Pending invitations")
    expect(page).toContain("Total capacity")
  })

  it("renders members, MFA posture, RBAC-aware controls, and safe confirmations", () => {
    expect(page).toContain("Organization role")
    expect(page).toContain("Last active")
    expect(page).toContain("MFA")
    expect(page).toContain("canManageMembers")
    expect(page).toContain("AlertDialog")
    expect(page).toContain("trpc.organization.updateMemberRole.useMutation")
    expect(page).toContain("trpc.organization.suspendMember.useMutation")
    expect(page).toContain("trpc.organization.reactivateMember.useMutation")
    expect(page).toContain("trpc.organization.removeMember.useMutation")
  })

  it("exposes invite, resend, revoke, seat-full, and backend error handling UX", () => {
    expect(page).toContain("trpc.organization.createInvitation.useMutation")
    expect(page).toContain("trpc.organization.resendInvitation.useMutation")
    expect(page).toContain("trpc.organization.revokeInvitation.useMutation")
    expect(page).toContain("disabled={!inviteEmail || createInvitation.isPending || seatsFull}")
    expect(page).toContain("getErrorMessage(error)")
    expect(page).toContain("Pending invitations count toward")
  })

  it("adds Team navigation in the required settings structure", () => {
    expect(settingsLayout).toContain('{ title: "Profile", href: "/settings"')
    expect(settingsLayout).toContain('{ title: "Organization", href: "/settings/organization"')
    expect(settingsLayout).toContain('{ title: "Team", href: "/settings/team"')
    expect(settingsLayout).toContain('{ title: "Security", href: "/settings/security"')
    expect(settingsLayout).toContain('{ title: "Billing", href: "/settings/billing"')
    expect(settingsLayout).toContain('{ title: "Notifications", href: "/settings/notifications"')
  })

  it("makes invitation registration context explicit without exposing tokens", () => {
    expect(registerPage).toContain("Accept your invitation")
    expect(registerPage).toContain("Join your SheriaBot Business organization")
    expect(registerPage).toContain("readOnly={Boolean(invitedEmail)}")
    expect(registerPage).toContain("companyName: hasInvitation ? undefined")
    expect(registerPage).not.toContain(">{invitationToken}<")
  })

  it("shows Business security center and pricing matrix differentiators", () => {
    expect(securityPage).toContain("OrganizationSecurityCenter")
    expect(securityPage).toContain("trpc.organization.getSecurityCenter.useQuery")
    expect(securityPage).toContain("trpc.organization.updateSecurityPolicy.useMutation")
    expect(securityPage).toContain("trpc.organization.getActivityLog.useQuery")
    expect(plans).toContain("Team workspace (6 total seats)")
    expect(plans).toContain("Team Security Posture")
    expect(plans).toContain("MFA status + policy")
  })
})
