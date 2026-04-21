# SheriaBot Dashboard Design System

## Overview

This document provides a complete guide to the SheriaBot Dashboard UI overhaul, including the design system, component architecture, and implementation patterns.

## Color System

### Brand Colors

- **Primary (Navy)**: `#1A2B4A` - HSL(210, 45%, 22%)
  - Used for: Primary buttons, links, active states, headers
  
- **Secondary (Emerald)**: `#00875A` - HSL(160, 100%, 26%)
  - Used for: Success states, positive actions, completion indicators
  
- **Accent (Gold)**: `#D4A843` - HSL(45, 73%, 58%)
  - Used for: Highlights, important information, accent elements

### Neutral Palette

- **Light Mode**: White/off-white backgrounds with dark text
- **Dark Mode**: Deep charcoal backgrounds with light text
- **Gray Scale**: 9-step neutral scale for borders, dividers, and text hierarchy

### Status Colors

- **Success**: Emerald (#00875A)
- **Warning**: Amber/Orange (#F59E0B)
- **Error/Destructive**: Red (#EF4444)
- **Info**: Navy (#1A2B4A)

## Typography

### Font Families

- **Sans-serif (Body)**: Inter (via next/font/google)
- **Monospace (Code)**: JetBrains Mono (via next/font/google)

### Type Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | 48px/3rem | Bold | Page titles |
| H2 | 36px/2.25rem | Bold | Section headers |
| H3 | 24px/1.5rem | Bold | Card titles |
| H4 | 20px/1.25rem | Semibold | Subsection titles |
| Body | 16px/1rem | Regular | Body text |
| Small | 14px/0.875rem | Regular | Secondary text |
| Label | 14px/0.875rem | Medium | Form labels |

## Spacing

Using Tailwind's default spacing scale (multiplied by 4px):

```
xs: 4px (0.25rem)
sm: 8px (0.5rem)
md: 16px (1rem)
lg: 24px (1.5rem)
xl: 32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

## Component Architecture

### Primitive Components

Located in `/components/ui/`, these are Radix UI-based primitives:
- Button
- Card
- Input
- Dialog
- Dropdown Menu
- Tabs
- Table
- And many more...

### Dashboard-Specific Components

Located in `/components/ui/dashboard-components.tsx`:

#### StatCard
Displays a metric with optional trend indicator
```tsx
<StatCard
  label="Total Users"
  value={1234}
  change={12}
  changeLabel="vs last month"
  icon={<UsersIcon />}
  variant="default" // or 'success', 'warning', 'destructive'
/>
```

#### EmptyState
Shows when no data is available
```tsx
<EmptyState
  icon={<BoxIcon />}
  title="No items yet"
  description="Get started by creating your first item"
  action={<Button>Create Item</Button>}
/>
```

#### PageHeader
Consistent header for all dashboard pages
```tsx
<PageHeader
  title="Users"
  description="Manage platform users"
  breadcrumbs={[{ label: 'Admin' }, { label: 'Users' }]}
  action={<Button>Add User</Button>}
/>
```

#### UsageMeter
Visual progress indicator for usage/quota
```tsx
<UsageMeter
  label="API Calls"
  used={750}
  total={1000}
  unit="calls"
  color="success" // or 'warning', 'destructive'
/>
```

#### TierBadge
Organization/user tier indicator
```tsx
<TierBadge tier="Enterprise" /> // 'Free', 'Pro', 'Enterprise'
```

### Layout Components

Located in `/components/app-shell.tsx`:

#### AppShell
Main application layout wrapper
```tsx
<AppShell
  sidebarItems={navigationItems}
  currentPath="/dashboard"
  title="SheriaBot"
  collapsedSidebar={false}
>
  {children}
</AppShell>
```

#### TopBar
Fixed header with search, notifications, theme toggle
- Sticky positioning
- Search functionality
- Theme toggle (light/dark)
- User avatar dropdown
- Notification bell

#### Sidebar
Collapsible navigation sidebar
- Expandable/collapsible items
- Active state tracking
- Badge support
- Responsive behavior

### Chart Components

Located in `/components/charts/dashboard-charts.tsx`:

#### SimpleLineChart
Time-series line chart with optional comparison
```tsx
<SimpleLineChart
  data={[{ date: '2026-01-01', value: 100, compare: 90 }]}
  title="Revenue Trend"
  showComparison={true}
/>
```

#### SimpleBarChart
Bar chart with optional comparison
```tsx
<SimpleBarChart
  data={[{ name: 'Q1', value: 1000, compare: 900 }]}
  title="Quarterly Revenue"
  showComparison={true}
/>
```

#### SimplePieChart
Pie chart for categorical data
```tsx
<SimplePieChart
  data={[{ name: 'Free', value: 60 }, { name: 'Pro', value: 30 }]}
  title="Users by Tier"
/>
```

#### ChartCard
Wrapper for all charts with consistent styling
- Auto-sizing
- Title and description
- Footer content support
- Consistent color scheme

## Design Tokens

### Tailwind Configuration

All design tokens are defined in:
- **CSS Variables**: `/app/globals.css` (`:root` and `.dark`)
- **Tailwind Config**: `/tailwind.config.ts`
- **Utility Exports**: `/lib/design-system.ts`

### Using Design Tokens

#### In Tailwind Classes
```tsx
<div className="bg-primary text-primary-foreground border-border">
  Content using design tokens
</div>
```

#### In TypeScript/Utility Functions
```tsx
import { SHERIA_COLORS, CHART_COLORS, TYPOGRAPHY } from '@/lib/design-system'

const primaryColor = SHERIA_COLORS.primary[500]
const chartColor = CHART_COLORS[1]
```

## Mock Data

Located in `/lib/mock-data.ts`:

### Available Generators

```tsx
import { mockData, generateUsers, generateFintechOrganizations } from '@/lib/mock-data'

// Pre-generated complete dataset
const users = mockData.users // 200 users
const orgs = mockData.fintechOrganizations // 30 fintech orgs
const regulators = mockData.regulatorOrganizations // 5 regulators
const auditLogs = mockData.auditLogs // 1000 logs
const alerts = mockData.regulatoryAlerts // 100 alerts
const timeSeries = mockData.timeSeriesData // Revenue, users, compliance, activeUsers

// Or generate custom datasets
const customUsers = generateUsers(500)
const customOrgs = generateFintechOrganizations()
```

### Data Features

- **Kenyan Context**: All names are Kenyan, amounts in KES, relevant organizations
- **Realistic**: Proper distributions, correlations between fields
- **Time-based**: Dates within last 6 months, time-series trends
- **Variety**: Multiple org types, user roles, compliance scores

## Responsive Design

### Breakpoints

- **Mobile (xs)**: 320px
- **Tablet (md)**: 768px
- **Desktop (lg)**: 1024px
- **Large Desktop (xl)**: 1280px
- **Extra Large (2xl)**: 1536px

### Mobile-First Approach

All layouts designed mobile-first, then enhanced for larger screens:

```tsx
{/* Mobile: 1 column */}
{/* Tablet (md): 2 columns */}
{/* Desktop (lg): 4 columns */}
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Items */}
</div>
```

## Dark Mode

### Automatic

Dark mode is enabled by default. Implement theme toggle:

```tsx
const toggleTheme = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}
```

### CSS Variables

Both light and dark mode use separate CSS variable sets in `/app/globals.css`:
- `:root` - Light mode (default)
- `.dark` - Dark mode (when class is present)

## Accessibility

### Requirements

- **Color Contrast**: All text meets WCAG AA standards (≥4.5:1)
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Indicators**: Clear focus rings (using Tailwind's focus-visible)
- **ARIA Labels**: All interactive elements have appropriate ARIA labels
- **Status Indicators**: Don't rely on color alone (use icons + color)
- **Reduced Motion**: Respect `prefers-reduced-motion` preference

### Implementation

```tsx
// Focus rings
<button className="focus-visible:ring-2 focus-visible:ring-primary">
  Accessible Button
</button>

// ARIA labels
<button aria-label="Close menu" aria-pressed={isOpen}>
  Menu
</button>

// Status + Icon (not color alone)
<div className="flex items-center gap-2">
  <CheckCircle2 className="w-4 h-4 text-success" />
  <span>Success</span>
</div>
```

## Page Structure Example

```tsx
'use client'

import { PageHeader, StatCard } from '@/components/ui/dashboard-components'
import { SimpleLineChart } from '@/components/charts/dashboard-charts'
import { mockData } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          description="Overview and key metrics"
          breadcrumbs={[{ label: 'Home' }]}
        />

        {/* Key Metrics Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value="₭2.4M"
            change={12}
            icon={<TrendingUpIcon />}
          />
          {/* More stat cards */}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SimpleLineChart
            data={mockData.timeSeriesData.revenue}
            title="Revenue Trend"
          />
        </div>

      </div>
    </div>
  )
}
```

## Common Patterns

### Loading State
```tsx
{isLoading ? (
  <>
    <Skeleton className="h-12 w-full rounded-lg" />
    <Skeleton className="h-12 w-full rounded-lg" />
  </>
) : (
  <YourContent />
)}
```

### Error State
```tsx
{error ? (
  <EmptyState
    icon={<AlertCircleIcon />}
    title="Failed to load"
    description={error.message}
  />
) : (
  <YourContent />
)}
```

### Empty State
```tsx
{data.length === 0 ? (
  <EmptyState
    icon={<BoxIcon />}
    title="No data"
    description="Create your first item to get started"
    action={<Button>Create Item</Button>}
  />
) : (
  <List data={data} />
)}
```

## Performance Considerations

1. **Lazy Loading**: Charts and heavy components use React.lazy
2. **Data Chunking**: Tables use pagination for large datasets
3. **Memoization**: Use React.memo for frequently updated components
4. **Image Optimization**: Use next/image for all images

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android latest

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Style Checking**: Use design system exports from `/lib/design-system.ts`
3. **Component Testing**: Use Storybook for isolated component testing
4. **Visual Testing**: Test on multiple breakpoints and in dark mode

## Resources

- Design System: `/lib/design-system.ts`
- Mock Data: `/lib/mock-data.ts`
- UI Components: `/components/ui/`
- Dashboard Components: `/components/ui/dashboard-components.tsx`
- Chart Components: `/components/charts/dashboard-charts.tsx`
- Layout Components: `/components/app-shell.tsx`
