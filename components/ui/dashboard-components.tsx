import React from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: 'border-border bg-card hover:bg-card/80',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    destructive: 'border-destructive/20 bg-destructive/5',
  }

  const changeColor = change && change > 0 ? 'text-success' : change && change < 0 ? 'text-destructive' : 'text-muted-foreground'

  return (
    <div
      className={cn(
        'rounded-lg border p-4 md:p-6 transition-all hover:shadow-md',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {(change !== undefined || changeLabel) && (
            <p className={cn('text-xs font-medium mt-2', changeColor)}>
              {change !== undefined && (
                <>
                  {change > 0 ? '↑' : change < 0 ? '↓' : ''} {Math.abs(change)}%
                  {changeLabel && ` ${changeLabel}`}
                </>
              )}
              {!change && changeLabel}
            </p>
          )}
        </div>
        {icon && <div className="text-primary/50 ml-4">{icon}</div>}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 md:p-12 text-center',
        className
      )}
    >
      {icon && <div className="text-muted-foreground mb-4 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-border">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}

interface UsageMeterProps {
  label: string
  used: number
  total: number
  unit?: string
  color?: 'success' | 'warning' | 'destructive'
}

export function UsageMeter({
  label,
  used,
  total,
  unit = '',
  color = 'success',
}: UsageMeterProps) {
  const percentage = (used / total) * 100
  const colorMap = {
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {used} / {total} {unit}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full transition-all', colorMap[color])}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

interface TierBadgeProps {
  tier: 'Free' | 'Pro' | 'Enterprise'
}

export function TierBadge({ tier }: TierBadgeProps) {
  const tierStyles = {
    Free: 'bg-muted text-muted-foreground',
    Pro: 'bg-primary/10 text-primary border border-primary/20',
    Enterprise: 'bg-accent/10 text-accent border border-accent/20',
  }

  return (
    <div className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', tierStyles[tier])}>
      {tier}
    </div>
  )
}
