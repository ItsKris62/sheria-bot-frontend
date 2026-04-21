'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from '@/lib/design-system'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  footer?: React.ReactNode
}

export function ChartCard({
  title,
  description,
  children,
  className,
  footer,
}: ChartCardProps) {
  return (
    <Card className={cn('border-border bg-card', className)}>
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">{children}</div>
      </CardContent>
      {footer && <div className="px-6 py-4 border-t border-border text-sm text-muted-foreground">{footer}</div>}
    </Card>
  )
}

interface SimpleLineChartProps {
  data: Array<{ date: string; value: number; compare?: number }>
  title: string
  description?: string
  showComparison?: boolean
}

export function SimpleLineChart({
  data,
  title,
  description,
  showComparison = false,
}: SimpleLineChartProps) {
  return (
    <ChartCard title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`hsl(var(--border))`} />
          <XAxis dataKey="date" stroke={`hsl(var(--muted-foreground))`} />
          <YAxis stroke={`hsl(var(--muted-foreground))`} />
          <Tooltip
            contentStyle={{
              backgroundColor: `hsl(var(--card))`,
              border: `1px solid hsl(var(--border))`,
              borderRadius: '0.5rem',
            }}
          />
          {showComparison && <Legend />}
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={false}
            name="Current"
          />
          {showComparison && (
            <Line
              type="monotone"
              dataKey="compare"
              stroke={CHART_COLORS[2]}
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              name="Previous"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface SimpleBarChartProps {
  data: Array<{ name: string; value: number; compare?: number }>
  title: string
  description?: string
  showComparison?: boolean
}

export function SimpleBarChart({
  data,
  title,
  description,
  showComparison = false,
}: SimpleBarChartProps) {
  return (
    <ChartCard title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`hsl(var(--border))`} />
          <XAxis dataKey="name" stroke={`hsl(var(--muted-foreground))`} />
          <YAxis stroke={`hsl(var(--muted-foreground))`} />
          <Tooltip
            contentStyle={{
              backgroundColor: `hsl(var(--card))`,
              border: `1px solid hsl(var(--border))`,
              borderRadius: '0.5rem',
            }}
          />
          {showComparison && <Legend />}
          <Bar dataKey="value" fill={CHART_COLORS[1]} name="Current" />
          {showComparison && <Bar dataKey="compare" fill={CHART_COLORS[2]} name="Previous" />}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface SimplePieChartProps {
  data: Array<{ name: string; value: number }>
  title: string
  description?: string
}

export function SimplePieChart({
  data,
  title,
  description,
}: SimplePieChartProps) {
  const colors = [CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3], CHART_COLORS[4], CHART_COLORS[5]]

  return (
    <ChartCard title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill={CHART_COLORS[1]}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: `hsl(var(--card))`,
              border: `1px solid hsl(var(--border))`,
              borderRadius: '0.5rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
