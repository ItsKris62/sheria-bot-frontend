const state = { user: { id: "visual-user", organizationId: "visual-org", fullName: "Visual QA" }, token: "fixture-only" }
export function useAuthStore<T>(selector: (value: typeof state) => T): T { return selector(state) }
