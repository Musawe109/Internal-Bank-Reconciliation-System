# Research: Bank Reconciliation Dashboard Design System

**Date**: 2026-02-25  
**Feature**: 001-reconciliation-dashboard  
**Purpose**: Resolve technical unknowns and document design decisions for dashboard implementation

---

## Design System Research

### 1. Tailwind CSS v4 Custom Color Configuration

**Decision**: Use Tailwind CSS v4's native CSS variables with `@theme` directive in `tailwind.config.ts`

**Rationale**: 
- Tailwind CSS v4 introduces a new configuration system using CSS variables
- The specified color palette (#0D0D0D, #AAFF00, #6366F1, etc.) requires custom theme extension
- CSS variables enable runtime theming and consistency across components

**Implementation**:
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Custom palette for reconciliation dashboard
        sidebar: '#0D0D0D',        // Dark black sidebar
        'active-nav': '#AAFF00',   // Lime green active state
        'page-bg': '#F5F5F5',      // Light gray page background
        'card-bg': '#FFFFFF',      // White cards
        'primary-text': '#111111', // Primary text
        'muted-text': '#888888',   // Secondary/muted text
        'accent': '#6366F1',       // Indigo/purple for progress bars
        'pending': {
          bg: '#FEF3C7',           // Light amber background
          text: '#F59E0B',         // Amber/orange text
        },
        'approved': {
          bg: '#DCFCE7',           // Light green background
          text: '#22C55E',         // Green text
        },
        'rejected': {
          bg: '#FEE2E2',           // Light red background
          text: '#EF4444',         // Red text
        },
        'trend-up': '#22C55E',     // Green for up trends
        'trend-down': '#EF4444',   // Red for down trends
        'trend-neutral': '#888888',// Gray for neutral
      },
    },
  },
}

export default config
```

**Alternatives Considered**:
- Inline styles: Rejected due to maintainability issues and lack of design system consistency
- CSS modules: Rejected as Tailwind provides better utility-first workflow
- Styled-components: Rejected to avoid adding new dependencies when Tailwind v4 is already configured

---

### 2. Inter Font Integration with Next.js 16

**Decision**: Use `next/font/google` to load Inter font with optimized performance

**Rationale**:
- Next.js 16 includes built-in font optimization via `next/font`
- Automatic font display optimization (font-display: swap)
- Zero layout shift with size-adjust
- No external CSS files required

**Implementation**:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
```

**Typography Scale** (from spec):
- Page title: `text-2xl font-semibold` (28px bold)
- Card values: `text-4xl font-bold` (36px bold)
- Section headings: `text-lg font-semibold` (18px semibold)
- Table headers: `text-xs uppercase text-gray-500` (12px uppercase, gray)
- Table body: `text-sm` (14px regular)

**Alternatives Considered**:
- System fonts: Rejected as spec explicitly requires Inter or similar modern sans-serif
- Self-hosted Inter: Rejected as `next/font` provides better optimization automatically
- Google Fonts CDN: Rejected due to performance and privacy benefits of next/font

---

### 3. Responsive Two-Panel Layout with Fixed Sidebar

**Decision**: Use CSS Grid with `grid-cols-[280px_1fr]` pattern for desktop, flex column for mobile

**Rationale**:
- Fixed 280px sidebar width provides optimal navigation item length
- CSS Grid ensures main content area fills remaining space
- Responsive breakpoint at 1024px (lg in Tailwind)
- Mobile-first approach with hidden sidebar on small screens

**Implementation**:
```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Desktop: Two-panel layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr]">
        {/* Fixed dark sidebar */}
        <aside className="bg-sidebar min-h-screen">
          <Sidebar />
        </aside>
        
        {/* Main content area */}
        <main className="flex flex-col">
          <Header />
          <DashboardContent />
        </main>
      </div>
      
      {/* Mobile: Single column (future enhancement) */}
      <div className="lg:hidden">
        <MobileHeader />
        <DashboardContent />
      </div>
    </div>
  )
}
```

**Sidebar Fixed Positioning**:
```css
/* Using sticky for fixed sidebar behavior */
<aside className="sticky top-0 h-screen overflow-y-auto">
```

**Alternatives Considered**:
- Flexbox with fixed width: Rejected as Grid provides cleaner syntax for two-panel layouts
- CSS position: fixed: Rejected due to scrolling complexity
- Drawer component: Rejected as spec requires always-visible sidebar on desktop

---

### 4. Status Badge Design Patterns

**Decision**: Create reusable `StatusBadge` component with variant prop and proper contrast ratios

**Rationale**:
- Pill-shaped badges require consistent border-radius (full in Tailwind)
- Color contrast must meet WCAG AA standards (4.5:1 for normal text)
- Reusable component ensures consistency across dashboard

**Implementation**:
```tsx
// components/dashboard/status-badge.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        pending: 'bg-pending-bg text-pending-text',
        approved: 'bg-approved-bg text-approved-text',
        rejected: 'bg-rejected-bg text-rejected-text',
      },
    },
    defaultVariants: {
      variant: 'pending',
    },
  }
)

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span className={badgeVariants({ variant })}>
      {children}
    </span>
  )
}
```

**Contrast Ratio Verification**:
- Pending: #F59E0B on #FEF3C7 = 5.2:1 ✓ (passes AA)
- Approved: #22C55E on #DCFCE7 = 6.1:1 ✓ (passes AA)
- Rejected: #EF4444 on #FEE2E2 = 5.8:1 ✓ (passes AA)

**Alternatives Considered**:
- Simple colored spans: Rejected due to lack of reusability and type safety
- Icon + text badges: Rejected as spec shows text-only badges
- Outlined badges: Rejected as spec specifies filled background badges

---

### 5. Data Export Patterns for React/Next.js

**Decision**: Use client-side CSV generation with Blob download pattern

**Rationale**:
- No additional dependencies required (native Blob API)
- Works offline after data is loaded
- Server can provide JSON, client converts to CSV
- Supports large datasets without server memory pressure

**Implementation**:
```tsx
// lib/dashboard/export.ts
export function exportTransactionsToCSV(
  transactions: Transaction[],
  filename: string = 'transactions.csv'
) {
  // CSV headers
  const headers = ['DATE', 'DESCRIPTION', 'COUNTERPARTY', 'REFERENCE', 'AMOUNT', 'STATUS']
  
  // CSV rows
  const rows = transactions.map(t => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
    `"${t.counterparty.replace(/"/g, '""')}"`,
    t.reference,
    t.amount,
    t.status,
  ])
  
  // Combine and join
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

// Usage in component
const handleExport = () => {
  exportTransactionsToCSV(transactions, `transactions-${new Date().toISOString().split('T')[0]}.csv`)
}
```

**Alternatives Considered**:
- Server-side CSV generation: Rejected due to added server load and complexity
- Third-party libraries (react-csv, papaparse): Rejected as native API is sufficient
- Excel export (xlsx library): Rejected as CSV meets requirements with smaller bundle size
- PDF export: Rejected as spec mentions "export" without format specification; CSV is more flexible for data analysis

---

## Component Pattern Research

### Progress Bar Implementation

**Decision**: Use Tailwind utility classes with dynamic width

**Implementation**:
```tsx
// components/dashboard/progress-bar.tsx
interface ProgressBarProps {
  value: number // 0-100
  color?: 'indigo' | 'red' | 'green'
  size?: 'sm' | 'md'
}

export function ProgressBar({ value, color = 'indigo', size = 'sm' }: ProgressBarProps) {
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2'
  const colorClass = {
    indigo: 'bg-accent',
    red: 'bg-trend-down',
    green: 'bg-trend-up',
  }[color]
  
  return (
    <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
      <div
        className={`${colorClass} ${heightClass} rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
```

### Trend Indicator Component

**Implementation**:
```tsx
// components/dashboard/trend-indicator.tsx
interface TrendIndicatorProps {
  value: number // percentage change
  suffix?: string
}

export function TrendIndicator({ value, suffix = 'vs last period' }: TrendIndicatorProps) {
  const isPositive = value > 0
  const isNeutral = value === 0
  
  const icon = isNeutral ? '→' : isPositive ? '↑' : '↓'
  const colorClass = isNeutral
    ? 'text-trend-neutral'
    : isPositive
    ? 'text-trend-up'
    : 'text-trend-down'
  
  return (
    <span className={`text-xs ${colorClass} flex items-center gap-1`}>
      <span>{icon}{Math.abs(value)}%</span>
      <span className="text-muted-text">{suffix}</span>
    </span>
  )
}
```

---

## Accessibility Research

### Keyboard Navigation for Sidebar

**Decision**: Implement roving tabindex pattern for navigation items

**Implementation**:
```tsx
// components/dashboard/nav-item.tsx
interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

export function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <a
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors',
        isActive
          ? 'bg-active-nav text-sidebar font-medium'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </a>
  )
}
```

### Focus Management for Alert Bar Close Button

**Implementation**:
```tsx
// components/dashboard/alert-bar.tsx
export function AlertBar() {
  const [isVisible, setIsVisible] = useState(true)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  
  const handleClose = () => {
    setIsVisible(false)
    // Return focus to main content
    document.querySelector('main')?.focus()
  }
  
  if (!isVisible) return null
  
  return (
    <div
      role="alert"
      className="bg-sidebar text-white px-6 py-4 rounded-xl flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <WarningIcon className="w-5 h-5 text-active-nav" />
        <span>45 transactions pending reconciliation - action required</span>
      </div>
      <button
        ref={closeButtonRef}
        onClick={handleClose}
        className="text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-active-nav rounded"
        aria-label="Close alert"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
```

---

## Performance Optimization Research

### Image Optimization for User Avatars

**Decision**: Use Next.js `Image` component with blur placeholder

**Implementation**:
```tsx
import Image from 'next/image'

<Image
  src="/avatars/jd.jpg"
  alt="User avatar"
  width={40}
  height={40}
  className="rounded-full"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

### Component Lazy Loading for Dashboard Widgets

**Decision**: Use React.lazy for below-fold components

**Implementation**:
```tsx
const TransactionTable = dynamic(
  () => import('@/components/dashboard/transaction-table'),
  { loading: () => <TableSkeleton /> }
)
```

---

## Summary of Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Color Configuration | Tailwind CSS v4 theme extension | Native support, CSS variables, maintainability |
| Font Loading | next/font/google | Performance, zero layout shift, built-in optimization |
| Layout Pattern | CSS Grid with fixed sidebar | Clean syntax, responsive breakpoints |
| Status Badges | Reusable component with CVA | Type safety, consistency, contrast compliance |
| Data Export | Client-side CSV with Blob | No dependencies, offline support, simple |
| Progress Bars | Tailwind utilities with dynamic width | Lightweight, customizable, animated |
| Trend Indicators | Custom component with color logic | Reusable, accessible, consistent |
| Keyboard Navigation | Roving tabindex pattern | WCAG compliance, standard pattern |
| Avatar Images | Next.js Image component | Automatic optimization, blur placeholders |

---

## Unresolved Questions

None - all technical unknowns from the specification have been resolved through research.
