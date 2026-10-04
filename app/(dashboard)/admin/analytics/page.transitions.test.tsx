import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import AnalyticsPage from "./page"

interface QueryResult<T> {
  data?: T
  isLoading: boolean
  isPlaceholderData: boolean
  isError: boolean
}

const testState = vi.hoisted(() => ({
  growth: {} as Record<number, QueryResult<{ series: Array<{ date: string; count: number }> }>>,
  dau: {} as Record<string, QueryResult<{ today: number; series: Array<{ date: string; dau: number }> }>>,
}))

function resolved<T>(data: T): QueryResult<T> {
  return { data, isLoading: false, isPlaceholderData: false, isError: false }
}

function pending<T>(): QueryResult<T> {
  return { isLoading: true, isPlaceholderData: false, isError: false }
}

function filterDays(filter: { dateFrom: string; dateTo: string }) {
  return Math.round((new Date(filter.dateTo).getTime() - new Date(filter.dateFrom).getTime()) / 86_400_000) + 1
}

vi.mock("@/lib/trpc", () => ({
  trpc: {
    admin: {
      getStats: {
        useQuery: () => resolved({
          users: { total: 1000, active: 800 },
          organizations: { total: 50 },
        }),
      },
      getUserGrowth: {
        useQuery: (input: { dateFrom: string; dateTo: string }) => testState.growth[filterDays(input)],
      },
      getAIUsageMetrics: { useQuery: () => pending() },
      getRevenueMetrics: { useQuery: () => pending() },
      getSubscriptionBreakdown: { useQuery: () => pending() },
    },
    analytics: {
      getDailyActiveUsers: {
        useQuery: ({ range }: { range: string }) => testState.dau[range],
      },
    },
  },
}))

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ data }: { data: unknown }) => <div>{JSON.stringify(data)}</div>,
  BarChart: ({ data }: { data: unknown }) => <div>{JSON.stringify(data)}</div>,
  LineChart: ({ data }: { data: unknown }) => <div>{JSON.stringify(data)}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Area: () => null,
  Bar: () => null,
  CartesianGrid: () => null,
  Cell: () => null,
  Legend: () => null,
  Line: () => null,
  Pie: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}))

vi.mock("@/components/ui/select", async () => {
  const React = await import("react")
  const SelectContext = React.createContext<{ onValueChange: (value: string) => void }>({ onValueChange: () => undefined })

  return {
    Select: ({ children, onValueChange }: { children: React.ReactNode; onValueChange: (value: string) => void }) => (
      <SelectContext.Provider value={{ onValueChange }}>{children}</SelectContext.Provider>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectValue: () => null,
    SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => {
      const { onValueChange } = React.useContext(SelectContext)
      return <button onClick={() => onValueChange(value)}>{children}</button>
    },
  }
})

describe("Admin Analytics truthful range transitions", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-03T09:00:00.000Z"))
    testState.growth = {
      7: pending(),
      30: pending(),
      90: resolved({ series: [{ date: "growth-90", count: 9 }] }),
    }
    testState.dau = {
      last7d: pending(),
      last30d: pending(),
      last90d: resolved({ today: 90, series: [{ date: "dau-90", dau: 9 }] }),
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("keeps independent KPIs while replacing range data panel-by-panel", () => {
    const { rerender } = render(<AnalyticsPage />)

    expect(screen.getByText("1,000")).toBeInTheDocument()
    expect(screen.getByText(/growth-90/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Last 7 days" }))

    expect(screen.getByText("1,000")).toBeInTheDocument()
    expect(screen.queryByText(/growth-90/)).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Updating analytics for last 7 days")
    expect(screen.getByRole("status").parentElement).toHaveAttribute("aria-busy", "true")

    testState.growth[7] = resolved({ series: [{ date: "growth-7", count: 7 }] })
    rerender(<AnalyticsPage />)

    expect(screen.getByText(/growth-7/)).toBeInTheDocument()
    expect(screen.getByRole("status")).toBeInTheDocument()

    testState.dau.last7d = resolved({ today: 7, series: [{ date: "dau-7", dau: 7 }] })
    rerender(<AnalyticsPage />)

    expect(screen.getByText(/dau-7/)).toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("keeps the latest rapid range selection authoritative", () => {
    const { rerender } = render(<AnalyticsPage />)

    fireEvent.click(screen.getByRole("button", { name: "Last 7 days" }))
    fireEvent.click(screen.getByRole("button", { name: "Last 30 days" }))

    testState.growth[7] = resolved({ series: [{ date: "stale-growth-7", count: 7 }] })
    testState.dau.last7d = resolved({ today: 7, series: [{ date: "stale-dau-7", dau: 7 }] })
    rerender(<AnalyticsPage />)

    expect(screen.getByRole("status")).toHaveTextContent("Updating analytics for last 30 days")
    expect(screen.queryByText(/stale-growth-7/)).not.toBeInTheDocument()

    testState.growth[30] = resolved({ series: [{ date: "growth-30", count: 30 }] })
    testState.dau.last30d = resolved({ today: 30, series: [{ date: "dau-30", dau: 30 }] })
    rerender(<AnalyticsPage />)

    expect(screen.getByText(/growth-30/)).toBeInTheDocument()
    expect(screen.getByText(/dau-30/)).toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })
})
