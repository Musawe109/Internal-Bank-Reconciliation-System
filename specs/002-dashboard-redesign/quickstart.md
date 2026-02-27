# Quickstart: Dashboard Redesign

**Feature**: 002-dashboard-redesign  
**Date**: 2026-02-24  
**Purpose**: Get started with dashboard development quickly

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: v20.x or later
- **npm**: v10.x or later
- **Git**: Latest version

Verify your setup:

```bash
node --version  # Should be v20.x+
npm --version   # Should be v10.x+
```

---

## 1. Clone and Setup

```bash
# Navigate to repository root
cd "C:\Users\ts.com\Internal Bank Reconciliation System"

# Ensure you're on the feature branch
git checkout 002-dashboard-redesign

# Install frontend dependencies
cd frontend
npm install
```

---

## 2. Verify Existing Design System

This feature builds on the 001-design-system. Verify it's in place:

```bash
# Check that globals.css exists
ls frontend/app/globals.css

# Check that Sidebar component exists (from 001-design-system)
ls frontend/components/layout/Sidebar/
```

If these don't exist, complete 001-design-system first.

---

## 3. Create Component Structure

Create the directory structure for dashboard components:

```bash
# Navigate to frontend directory
cd frontend

# Create component directories
mkdir -p components/dashboard/StatsCard
mkdir -p components/dashboard/StatsGrid
mkdir -p components/dashboard/AlertBar
mkdir -p components/dashboard/TransactionTable
mkdir -p components/dashboard/StatusBadge
mkdir -p features/reconciliation/hooks
```

---

## 4. Copy Contract Types

Copy the TypeScript types to your features directory:

```bash
# Copy contract types
cp ../specs/002-dashboard-redesign/contracts/types.ts features/reconciliation/types.ts
```

---

## 5. Create First Component (StatsCard)

Create the StatsCard component to verify your setup:

**File**: `frontend/components/dashboard/StatsCard/StatsCard.tsx`

```typescript
'use client'

import React from 'react'

interface StatsCardProps {
  label: string
  value: number | string
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
  progress?: number
  footer?: string
  isLoading?: boolean
}

export function StatsCard({
  label,
  value,
  trend,
  progress,
  footer,
  isLoading = false,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
        {progress && (
          <div className="h-2 bg-slate-200 rounded w-full"></div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 transition-all duration-300 hover:shadow-xl">
      {/* Label */}
      <p className="text-slate-500 text-sm font-medium mb-2">{label}</p>

      {/* Value */}
      <p className="text-3xl font-bold text-slate-800 mb-4">{value}</p>

      {/* Trend indicator */}
      {trend && (
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              trend.direction === 'up'
                ? 'text-emerald-600'
                : trend.direction === 'down'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
            {Math.abs(trend.percentage)}%
          </span>
          <span className="text-slate-400 text-sm">vs last period</span>
        </div>
      )}

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      {footer && <p className="text-slate-500 text-sm mt-4">{footer}</p>}
    </div>
  )
}
```

---

## 6. Create Component Test

Create a test for the StatsCard component:

**File**: `frontend/components/dashboard/StatsCard/StatsCard.test.tsx`

```typescript
import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatsCard } from './StatsCard'

describe('StatsCard', () => {
  it('renders label and value', () => {
    render(
      <StatsCard
        label="Total Pending"
        value={45}
      />
    )

    expect(screen.getByText('Total Pending')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('renders trend indicator when provided', () => {
    render(
      <StatsCard
        label="Total Pending"
        value={45}
        trend={{ direction: 'up', percentage: 12.5 }}
      />
    )

    expect(screen.getByText('12.5%')).toBeInTheDocument()
  })

  it('renders progress bar when provided', () => {
    render(
      <StatsCard
        label="Reconciliation Rate"
        value="96.5%"
        progress={96.5}
      />
    )

    const progressBar = document.querySelector('.bg-indigo-600')
    expect(progressBar).toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <StatsCard
        label="Loading..."
        value={0}
        isLoading={true}
      />
    )

    expect(screen.getByTestId('stats-card-loading')).toBeInTheDocument()
  })
})
```

---

## 7. Run the Development Server

```bash
# From frontend directory
npm run dev
```

Open http://localhost:3000 to verify the application runs.

---

## 8. Run Tests

```bash
# Run tests for the StatsCard component
npm test -- StatsCard.test.tsx
```

All tests should pass.

---

## Next Steps

### Phase 1: Complete Core Components

1. **StatusBadge** - Status indicator component
2. **StatsGrid** - Responsive grid layout for stats
3. **AlertBar** - Alert/notification banner
4. **TransactionTable** - Enterprise-style data table
5. **Header** - Extend existing with search bar

### Phase 2: Data Integration

1. Create API service: `features/reconciliation/api.ts`
2. Create custom hooks:
   - `features/reconciliation/hooks/useReconciliationStats.ts`
   - `features/reconciliation/hooks/useTransactions.ts`
3. Implement error boundaries
4. Add loading states

### Phase 3: Dashboard Page

1. Create main page: `app/dashboard/page.tsx`
2. Compose all components
3. Add integration tests
4. Performance optimization

---

## Development Workflow

### Test-First (TDD)

For each component:

1. **Red**: Write failing test
2. **Green**: Implement minimum code to pass
3. **Refactor**: Clean up while keeping tests green

Example:

```bash
# 1. Write test first
# Edit: components/dashboard/StatusBadge/StatusBadge.test.tsx

# 2. Run test (should fail)
npm test -- StatusBadge.test.tsx

# 3. Implement component
# Edit: components/dashboard/StatusBadge/StatusBadge.tsx

# 4. Run test (should pass)
npm test -- StatusBadge.test.tsx
```

---

## Common Tasks

### Run Type Check

```bash
npm run type-check
```

### Run Linter

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

### Run All Tests

```bash
npm test
```

---

## Troubleshooting

### Issue: Module not found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

```bash
# Check TypeScript configuration
cat tsconfig.json

# Verify types are copied correctly
cat features/reconciliation/types.ts
```

### Issue: Tailwind styles not working

```bash
# Verify Tailwind config
cat tailwind.config.ts

# Verify globals.css import
cat app/layout.tsx
```

---

## Resources

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/api-contracts.md](./contracts/api-contracts.md)
- **TypeScript Types**: [contracts/types.ts](./contracts/types.ts)

---

**Last Updated**: 2026-02-24
