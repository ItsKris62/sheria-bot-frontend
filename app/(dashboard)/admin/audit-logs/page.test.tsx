import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import AuditLogsPage from "./page"

const state = vi.hoisted(() => ({
  lastInput: undefined as undefined | Record<string, unknown>,
}))

vi.mock("@/lib/trpc", () => ({
  getErrorMessage: (error: Error) => error.message,
  trpc: {
    admin: {
      getLogs: {
        useQuery: (input: Record<string, unknown>) => {
          state.lastInput = input
          const page = Number(input.page)
          const search = input.search
          if (search) {
            return { data: { items: [], total: 0, page: 1, limit: 50, totalPages: 1 }, isLoading: false, isError: false }
          }
          return {
            data: {
              items: [{
                id: `log-${page}`,
                action: `page-${page}-event`,
                entityType: "User",
                entityId: null,
                userId: "user-1",
                actorName: "Admin",
                actorEmail: "admin@sheriabot.com",
                actorOrganization: "SheriaBot",
                severity: "INFO",
                ipAddress: null,
                metadata: null,
                createdAt: "2026-10-05T10:00:00.000Z",
              }],
              total: 51,
              page,
              limit: 50,
              totalPages: 2,
            },
            isLoading: false,
            isError: false,
          }
        },
      },
      exportAuditLogs: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

describe("Admin audit-log pagination", () => {
  beforeEach(() => { state.lastInput = undefined })

  it("sends one-indexed server pagination and navigates both directions", () => {
    render(<AuditLogsPage />)
    expect(screen.getByText("page-1-event")).toBeInTheDocument()
    expect(state.lastInput).toMatchObject({ page: 1, limit: 50 })

    fireEvent.click(screen.getByRole("button", { name: "Next audit-log page" }))
    expect(screen.getByText("page-2-event")).toBeInTheDocument()
    expect(state.lastInput).toMatchObject({ page: 2, limit: 50 })
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Previous audit-log page" }))
    expect(screen.getByText("page-1-event")).toBeInTheDocument()
    expect(state.lastInput).toMatchObject({ page: 1, limit: 50 })
  })

  it("resets to page one when a filter is applied and cleared", () => {
    render(<AuditLogsPage />)
    fireEvent.click(screen.getByRole("button", { name: "Next audit-log page" }))

    const search = screen.getByLabelText("Search audit logs")
    fireEvent.change(search, { target: { value: "security" } })
    expect(state.lastInput).toMatchObject({ page: 1, search: "security" })
    expect(screen.getByText("No audit events were found for the selected period")).toBeInTheDocument()

    fireEvent.change(search, { target: { value: "" } })
    expect(state.lastInput).toMatchObject({ page: 1 })
    expect(state.lastInput).not.toHaveProperty("search")
  })
})
