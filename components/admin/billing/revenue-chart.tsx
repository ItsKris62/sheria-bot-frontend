"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface RevenuePoint {
  date: string
  amount: number
}

interface RevenueChartProps {
  data: RevenuePoint[]
}

function formatKES(amount: number) {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`
  return `KES ${amount.toLocaleString()}`
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickFormatter={(value: string) => new Date(`${value}-01`).toLocaleDateString("en-KE", { month: "short" })}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
          formatter={(value: number) => [formatKES(value), "Revenue"]}
        />
        <Bar dataKey="amount" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
