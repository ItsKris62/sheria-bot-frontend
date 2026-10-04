import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import CalendarPage from "./page"

const testState = vi.hoisted(() => ({
  months: {} as Record<number, {
    data?: Array<Record<string, unknown>>
    isLoading: boolean
    isPlaceholderData: boolean
    isError: boolean
    refetch: ReturnType<typeof vi.fn>
  }>,
  upcoming: [] as Array<Record<string, unknown>>,
}))

vi.mock("@/lib/trpc", () => ({
  trpc: {
    calendar: {
      list: {
        useQuery: ({ month }: { month: number }) => testState.months[month],
      },
      upcoming: {
        useQuery: () => ({ data: testState.upcoming, isLoading: false }),
      },
    },
  },
}))

vi.mock("@/lib/plan-context", () => ({
  usePlan: () => ({ hasFeature: () => true }),
}))

vi.mock("@/components/plan/feature-gate", () => ({
  FeatureGate: ({ children }: { children: React.ReactNode }) => children,
  LockedFeatureCard: () => null,
}))

vi.mock("@/components/calendar/AddEventModal", () => ({
  AddEventModal: () => null,
}))

vi.mock("@/lib/analytics", () => ({
  trackFeatureUsage: vi.fn(),
}))

function event(id: string, title: string, dueDate: string) {
  return {
    id,
    title,
    description: null,
    dueDate,
    priority: "MEDIUM",
    status: "UPCOMING",
    category: "CUSTOM",
    regulation: null,
  }
}

function result(data?: Array<Record<string, unknown>>, overrides: Partial<(typeof testState.months)[number]> = {}) {
  return {
    data,
    isLoading: false,
    isPlaceholderData: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  }
}

describe("Calendar truthful month transitions", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 15, 12))
    testState.upcoming = [event("upcoming", "Independent deadline", "2026-09-20")]
    testState.months = {
      9: result([event("september", "September filing", "2026-09-10")]),
      10: result(undefined, { isLoading: true }),
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("replaces old-month events with stable local loading geometry", () => {
    const { rerender } = render(<CalendarPage />)

    expect(screen.getByText("September filing")).toBeInTheDocument()
    expect(screen.getByText("Independent deadline")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Next month" }))

    expect(screen.getByText("October 2026")).toBeInTheDocument()
    expect(screen.queryByText("September filing")).not.toBeInTheDocument()
    expect(screen.getByLabelText("October 2026 calendar")).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Loading October 2026 calendar")
    expect(screen.getByText("Independent deadline")).toBeInTheDocument()

    testState.months[10] = result([event("october", "October filing", "2026-10-12")])
    rerender(<CalendarPage />)

    expect(screen.getByText("October filing")).toBeInTheDocument()
    expect(screen.getByLabelText("October 2026 calendar")).toHaveAttribute("aria-busy", "false")
  })

  it("shows an empty month only after its query resolves", () => {
    const { rerender } = render(<CalendarPage />)
    fireEvent.click(screen.getByRole("button", { name: "Next month" }))

    expect(screen.queryByText("No events scheduled for October 2026.")).not.toBeInTheDocument()

    testState.months[10] = result([])
    rerender(<CalendarPage />)

    expect(screen.getByText("No events scheduled for October 2026.")).toBeInTheDocument()
  })

  it("shows a localized target-month error while month navigation remains available", () => {
    testState.months[10] = result(undefined, { isError: true })
    render(<CalendarPage />)

    fireEvent.click(screen.getByRole("button", { name: "Next month" }))

    expect(screen.getByText("Could not load October 2026")).toBeInTheDocument()
    expect(screen.queryByText("September filing")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }))
    expect(screen.getByText("September filing")).toBeInTheDocument()
  })
})
