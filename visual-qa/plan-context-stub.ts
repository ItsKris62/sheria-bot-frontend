export function usePlan() {
  return {
    plan: "BUSINESS",
    planDisplayName: "Business",
    isLoading: false,
    homeJurisdictionCode: "KE",
    enabledJurisdictions: ["KE", "RW", "MW", "NG"],
    hasFeature: () => true,
    isPilotAccess: true,
  }
}
