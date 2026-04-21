# SheriaBot Dashboard — Quick Start Guide

## For Developers

This guide gets you up and running with the SheriaBot Dashboard design system in 5 minutes.

## 1. Setup

```bash
# Install dependencies (if not already done)
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 2. Understanding the Structure

```
Components Layer:
  UI Primitives (Radix UI) → Dashboard Components → Page Components

Styling Layer:
  CSS Variables (globals.css) → Tailwind Classes → Components

Data Layer:
  Mock Data (mock-data.ts) → Components → UI
```

## 3. Creating Your First Dashboard Page

### Step 1: Create the page file

```tsx
// app/(dashboard)/my-page/page.tsx

'use client'

import { PageHeader, StatCard } from '@/components/ui/dashboard-components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockData } from '@/lib/mock-data'

export default function MyDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="My Dashboard" 
          description="Real-time metrics and insights"
        />
        
        {/* Metric Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            label="Total Users" 
            value={mockData.users.length} 
            change={12}
            changeLabel="vs last month"
          />
          <StatCard 
            label="Active Organizations" 
            value={mockData.fintechOrganizations.length}
            change={5}
          />
          <StatCard 
            label="Compliance Score" 
            value="87%"
            change={3}
          />
        </div>
        
        {/* Content Cards */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add your content here */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Step 2: View your page

Navigate to `http://localhost:3000/my-page` to see your dashboard.

### Step 3: Add mock data

```tsx
import { mockData, generateUsers, generateAuditLogs } from '@/lib/mock-data'

// Use pre-built datasets
const users = mockData.users              // 200 users
const orgs = mockData.fintechOrganizations // 30 orgs
const logs = mockData.auditLogs            // 1000 logs

// Or generate custom
const customUsers = generateUsers(500)
const customLogs = generateAuditLogs(100)
```

## 4. Available Components

### Dashboard Components

```tsx
import { 
  StatCard,      // Metric display with trend
  EmptyState,    // No data placeholder
  PageHeader,    // Page title with breadcrumbs
  UsageMeter,    // Progress for quotas
  TierBadge      // Organization tier badge
} from '@/components/ui/dashboard-components'

// StatCard
<StatCard 
  label="Users"
  value={1234}
  change={12}
  changeLabel="vs last month"
  icon={<UsersIcon />}
  variant="default" // or 'success', 'warning', 'destructive'
/>

// EmptyState
<EmptyState
  icon={<BoxIcon />}
  title="No items"
  description="Create your first item to get started"
  action={<Button>Create</Button>}
/>

// PageHeader
<PageHeader
  title="Users"
  description="Manage team members"
  breadcrumbs={[
    { label: 'Admin' },
    { label: 'Users' }
  ]}
  action={<Button>Add User</Button>}
/>

// UsageMeter
<UsageMeter
  label="API Calls"
  used={750}
  total={1000}
  unit="calls"
  color="success" // 'warning', 'destructive'
/>

// TierBadge
<TierBadge tier="Enterprise" /> {/* 'Free', 'Pro', 'Enterprise' */}
```

### Chart Components

```tsx
import {
  SimpleLineChart,
  SimpleBarChart,
  SimplePieChart,
  ChartCard
} from '@/components/charts/dashboard-charts'

// Line Chart
<SimpleLineChart
  data={[
    { date: '2026-01-01', value: 100, compare: 90 },
    { date: '2026-01-02', value: 120, compare: 110 }
  ]}
  title="Revenue Trend"
  description="Last 30 days"
  showComparison={true}
/>

// Bar Chart
<SimpleBarChart
  data={[
    { name: 'Q1', value: 1000, compare: 900 },
    { name: 'Q2', value: 1200, compare: 1100 }
  ]}
  title="Quarterly Revenue"
  showComparison={true}
/>

// Pie Chart
<SimplePieChart
  data={[
    { name: 'Free', value: 60 },
    { name: 'Pro', value: 30 },
    { name: 'Enterprise', value: 10 }
  ]}
  title="Users by Tier"
/>
```

### Layout Components

```tsx
import { AppShell, TopBar, Sidebar } from '@/components/app-shell'

<AppShell
  sidebarItems={[
    { 
      icon: <HomeIcon />, 
      label: 'Dashboard', 
      href: '/dashboard'
    },
    // ... more items
  ]}
  currentPath="/dashboard"
  title="SheriaBot"
>
  {children}
</AppShell>
```

### UI Primitives

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
// ... and many more in /components/ui/
```

## 5. Using Design Tokens

### In Tailwind Classes

```tsx
// Colors
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-secondary text-secondary-foreground">Secondary</div>
<div className="bg-accent text-accent-foreground">Accent</div>
<div className="bg-success text-success-foreground">Success</div>
<div className="bg-warning text-warning-foreground">Warning</div>
<div className="bg-destructive text-destructive-foreground">Destructive</div>

// Spacing
<div className="p-4 md:p-8 gap-6">Padded container</div>

// Border radius
<div className="rounded-lg">Rounded corner</div>

// Text styles
<h1 className="text-3xl font-bold">Heading</h1>
<p className="text-sm text-muted-foreground">Secondary text</p>
```

### In TypeScript

```tsx
import { 
  SHERIA_COLORS, 
  CHART_COLORS, 
  TYPOGRAPHY,
  SPACING,
  Z_INDEX 
} from '@/lib/design-system'

// Get primary color
const primaryColor = SHERIA_COLORS.primary[500]  // '#1A2B4A'

// Get chart color
const chartColor = CHART_COLORS[1]  // '#00875A'

// Get typography class
const headingClass = TYPOGRAPHY.h2  // 'text-3xl font-bold...'
```

## 6. Dark Mode

Dark mode is **enabled by default**. Components automatically use the correct colors.

To toggle theme (usually in TopBar):

```tsx
const toggleTheme = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}
```

## 7. Responsive Design

Build mobile-first, then enhance for larger screens:

```tsx
{/* Mobile: 1 column */}
{/* md (768px): 2 columns */}
{/* lg (1024px): 4 columns */}
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</div>
```

Common breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 8. Common Patterns

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
    icon={<AlertCircleIcon className="w-8 h-8" />}
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
    icon={<BoxIcon className="w-8 h-8" />}
    title="No data"
    description="Create your first item to get started"
    action={<Button>Create</Button>}
  />
) : (
  <List data={data} />
)}
```

## 9. Form Inputs

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

<div className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      placeholder="user@example.com"
      className="mt-2"
    />
  </div>
  
  <Button type="submit">Submit</Button>
</div>
```

## 10. Tables

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>
          <Badge>{row.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## 11. Accessibility

All components are accessible by default. Ensure you:

- Use semantic HTML (`<button>` not `<div onClick>`)
- Add alt text to images
- Include aria-labels for icon-only buttons
- Test with keyboard navigation (Tab, Enter)
- Verify color contrast (≥4.5:1 for text)

```tsx
// Good
<button aria-label="Close menu" onClick={close}>
  <XIcon className="w-4 h-4" />
</button>

// Good
<img src="image.png" alt="Dashboard screenshot" />

// Good
<div className="flex items-center gap-2">
  <CheckCircle2 className="w-4 h-4 text-success" />
  <span>Success</span>
</div>
```

## 12. Helpful Resources

- **Design System**: `/DESIGN_SYSTEM.md` — Complete design documentation
- **Implementation Guide**: `/IMPLEMENTATION_GUIDE.md` — Full reference
- **Mock Data**: `/lib/mock-data.ts` — Data generation utilities
- **Example Page**: `/app/dashboard-example.tsx` — Working template
- **Component Explorer**: Browse `/components/ui/` for all primitives

## 13. Common Tasks

### Add a new metric to StatCard grid
```tsx
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <StatCard label="Metric 1" value={100} />
  <StatCard label="Metric 2" value={200} />
  {/* Add more cards */}
</div>
```

### Add a modal dialog
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Add a dropdown menu
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Action 1</DropdownMenuItem>
    <DropdownMenuItem>Action 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 14. Deployment

When ready to deploy:

```bash
# Build for production
npm run build

# Deploy to Vercel (if using)
npm run deploy

# Or deploy to your hosting
```

## Need Help?

- Check `/DESIGN_SYSTEM.md` for design token reference
- Review `/IMPLEMENTATION_GUIDE.md` for detailed examples
- Look at `/app/dashboard-example.tsx` for page structure
- Browse `/components/` to see available components

---

**Happy building!** 🚀
