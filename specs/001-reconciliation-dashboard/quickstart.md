# Quickstart: Bank Reconciliation Dashboard Development

**Date**: 2026-02-25  
**Feature**: 001-reconciliation-dashboard  
**Purpose**: Development setup guide for implementing the dashboard

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: v20.x or later
- **npm**: v10.x or later
- **Git**: For version control
- **VS Code**: Recommended IDE with ESLint and Prettier extensions

---

## 1. Clone and Setup

```bash
# Navigate to the project root
cd "C:\Users\ts.com\Internal Bank Reconciliation System"

# Ensure you're on the correct branch
git checkout 001-reconciliation-dashboard

# Install frontend dependencies
cd frontend
npm install
```

---

## 2. Development Server

```bash
# Start the Next.js development server
npm run dev

# Server will start on http://localhost:3000
```

**Verify Setup**:
- Open http://localhost:3000/dashboard
- You should see the current dashboard page
- Check browser console for any errors

---

## 3. Project Structure

```
frontend/
├── app/
│   └── dashboard/
│       └── page.tsx           # Main dashboard page (modify this)
├── components/
│   └── dashboard/
│       ├── stats-grid.tsx     # Stats grid component
│       ├── highlight-card.tsx # Highlight/notice card
│       ├── transaction-table.tsx # Transaction table
│       └── alert-bar.tsx      # Alert banner
├── types/
│   └── dashboard.ts           # TypeScript types (create this)
├── lib/
│   └── dashboard/
│       ├── formatters.ts      # Utility functions (create this)
│       └── constants.ts       # Design tokens (create this)
└── tests/
    └── components/
        └── dashboard/         # Component tests (create this)
```

---

## 4. Design System Setup

### 4.1 Configure Tailwind Colors

Update `tailwind.config.ts` to add the custom color palette:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette for reconciliation dashboard
        sidebar: '#0D0D0D',
        'active-nav': '#AAFF00',
        'page-bg': '#F5F5F5',
        'card-bg': '#FFFFFF',
        'primary-text': '#111111',
        'muted-text': '#888888',
        'accent': '#6366F1',
        'pending': {
          bg: '#FEF3C7',
          text: '#F59E0B',
        },
        'approved': {
          bg: '#DCFCE7',
          text: '#22C55E',
        },
        'rejected': {
          bg: '#FEE2E2',
          text: '#EF4444',
        },
        'trend-up': '#22C55E',
        'trend-down': '#EF4444',
        'trend-neutral': '#888888',
      },
    },
  },
  plugins: [],
}

export default config
```

### 4.2 Setup Inter Font

Update `app/layout.tsx`:

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Bank Reconciliation System',
  description: 'Monitor and manage bank reconciliation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
```

---

## 5. Mock Data Setup

Create mock data for development and testing:

```typescript
// lib/dashboard/mock-data.ts
import { DashboardStats, Transaction } from '@/types/dashboard'

export const mockDashboardStats: DashboardStats = {
  totalPending: {
    id: 'total-pending',
    title: 'Total Pending',
    value: 45,
    trend: {
      percentage: 12.5,
      direction: 'up',
      comparisonLabel: 'vs last period',
    },
    progressValue: 35,
    progressColor: 'indigo',
    label: 'Requires review',
  },
  totalApproved: {
    id: 'total-approved',
    title: 'Total Approved',
    value: 1250,
    trend: {
      percentage: 8.2,
      direction: 'up',
      comparisonLabel: 'vs last period',
    },
    progressValue: 95,
    progressColor: 'indigo',
    label: 'This month',
  },
  totalRejected: {
    id: 'total-rejected',
    title: 'Total Rejected',
    value: 23,
    trend: {
      percentage: 3.1,
      direction: 'down',
      comparisonLabel: 'vs last period',
    },
    progressValue: 15,
    progressColor: 'red',
    label: 'Needs attention',
  },
  reconciliationRate: {
    id: 'reconciliation-rate',
    title: 'Reconciliation Rate',
    value: '96.5%',
    trend: {
      percentage: 0.5,
      direction: 'neutral',
      comparisonLabel: 'vs last period',
    },
    progressValue: 96.5,
    progressColor: 'indigo',
    label: 'Target: 98%',
  },
  lastUpdated: new Date().toISOString(),
}

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    date: '2026-02-24',
    description: 'Wire transfer from ABC Corporation',
    transactionType: 'Wire Transfer',
    counterparty: 'ABC Corporation',
    reference: 'WT-2026-001',
    amount: 15000.00,
    status: 'pending',
  },
  {
    id: 'txn-002',
    date: '2026-02-23',
    description: 'ACH payment received from XYZ Ltd',
    transactionType: 'ACH Payment',
    counterparty: 'XYZ Ltd',
    reference: 'ACH-2026-002',
    amount: 8500.50,
    status: 'approved',
  },
  // ... add more mock transactions
]
```

---

## 6. Component Development Workflow

### 6.1 Create New Components

Example: Creating the StatusBadge component

```bash
# Create component file
New-Item -Path "components/dashboard/status-badge.tsx" -ItemType File
```

```tsx
// components/dashboard/status-badge.tsx
import { TransactionStatus, STATUS_CONFIG } from '@/types/dashboard'

interface StatusBadgeProps {
  status: TransactionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }}
    >
      {config.label}
    </span>
  )
}
```

### 6.2 Test Component in Isolation

Create a test page to preview components:

```tsx
// app/dashboard/components-preview/page.tsx
import { StatusBadge } from '@/components/dashboard/status-badge'

export default function ComponentsPreview() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Component Preview</h1>
      
      <div className="flex gap-4">
        <StatusBadge status="pending" />
        <StatusBadge status="approved" />
        <StatusBadge status="rejected" />
      </div>
    </div>
  )
}
```

Visit http://localhost:3000/dashboard/components-preview to preview.

---

## 7. Testing

### 7.1 Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type check
npm run type-check

# Lint
npm run lint
```

### 7.2 Write Component Tests

Example test for StatusBadge:

```tsx
// tests/components/dashboard/status-badge.test.tsx
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/dashboard/status-badge'

describe('StatusBadge', () => {
  it('renders pending status with correct colors', () => {
    render(<StatusBadge status="pending" />)
    
    const badge = screen.getByText('Pending')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle('background-color: #FEF3C7')
    expect(badge).toHaveStyle('color: #F59E0B')
  })
  
  it('renders approved status with correct colors', () => {
    render(<StatusBadge status="approved" />)
    
    const badge = screen.getByText('Approved')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle('background-color: #DCFCE7')
    expect(badge).toHaveStyle('color: #22C55E')
  })
  
  it('renders rejected status with correct colors', () => {
    render(<StatusBadge status="rejected" />)
    
    const badge = screen.getByText('Rejected')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle('background-color: #FEE2E2')
    expect(badge).toHaveStyle('color: #EF4444')
  })
})
```

---

## 8. Visual Regression Testing

### 8.1 Setup Chromatic (Optional)

For visual regression testing:

```bash
npm install --save-dev chromatic
```

```json
// package.json
{
  "scripts": {
    "chromatic": "chromatic --project-token=YOUR_PROJECT_TOKEN"
  }
}
```

### 8.2 Manual Visual Testing

1. Take screenshots of the current dashboard
2. Implement new design
3. Compare side-by-side with spec requirements:
   - Sidebar color: #0D0D0D
   - Active nav: #AAFF00
   - Page background: #F5F5F5
   - Card shadows and rounded corners
   - Typography sizes match spec

---

## 9. API Integration

### 9.1 Create API Client

```typescript
// lib/dashboard/api.ts
import { DashboardStats, Transaction } from '@/types/dashboard'

const API_BASE = '/api'

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  
  return response.json()
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const result = await fetchApi<{ success: boolean; data: DashboardStats }>('/dashboard/stats')
  return result.data
}

export async function getRecentTransactions(
  status = 'all',
  sort = 'date-desc',
  limit = 50
): Promise<Transaction[]> {
  const params = new URLSearchParams({ status, sort, limit: limit.toString() })
  const result = await fetchApi<{ success: boolean; data: Transaction[] }>(
    `/transactions/recent?${params}`
  )
  return result.data
}

export async function exportTransactions(status = 'all', sort = 'date-desc'): Promise<void> {
  const params = new URLSearchParams({ status, sort })
  window.open(`${API_BASE}/transactions/export?${params}`, '_blank')
}
```

### 9.2 Use in Components

```tsx
// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, getRecentTransactions } from '@/lib/dashboard/api'
import { DashboardStats, Transaction } from '@/types/dashboard'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, transactionsData] = await Promise.all([
          getDashboardStats(),
          getRecentTransactions(),
        ])
        setStats(statsData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  if (loading) {
    return <DashboardSkeleton />
  }
  
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Dashboard content */}
    </div>
  )
}
```

---

## 10. Debugging

### 10.1 Browser DevTools

- **React DevTools**: Inspect component tree and props
- **Network Tab**: Monitor API requests and responses
- **Console**: Check for errors and warnings
- **Elements Tab**: Inspect computed styles and CSS

### 10.2 Common Issues

**Issue**: Colors not matching spec  
**Solution**: Check Tailwind config is properly extended, clear `.next` cache

**Issue**: Font not loading  
**Solution**: Verify `next/font/google` setup in layout.tsx

**Issue**: API calls failing  
**Solution**: Check authentication token, verify backend is running

**Issue**: TypeScript errors  
**Solution**: Run `npm run type-check` and fix type mismatches

---

## 11. Deployment

### 11.1 Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run start
```

### 11.2 Docker Deployment

```bash
# From project root
docker-compose build frontend
docker-compose up frontend
```

---

## 12. Checklist

Before considering implementation complete:

- [ ] All stat cards display correct values and trends
- [ ] Alert banner shows when pending transactions exist
- [ ] Transaction table displays with correct columns
- [ ] Status badges use correct colors
- [ ] Filter dropdowns function correctly
- [ ] Export button downloads CSV
- [ ] Sidebar navigation highlights active item
- [ ] All colors match spec (#0D0D0D, #AAFF00, etc.)
- [ ] Typography matches spec (28px, 36px, 18px, etc.)
- [ ] Responsive at 1024px+ viewport
- [ ] All component tests pass
- [ ] Type check passes
- [ ] Lint passes
- [ ] Build succeeds without errors

---

## Resources

- **Spec**: [specs/001-reconciliation-dashboard/spec.md](../spec.md)
- **Research**: [research.md](./research.md)
- **Data Models**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/api-contracts.md](./contracts/api-contracts.md)
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS v4**: https://tailwindcss.com/docs
