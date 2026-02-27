# Data Model: Bank Reconciliation Dashboard

**Date**: 2026-02-25  
**Feature**: 001-reconciliation-dashboard  
**Purpose**: Define TypeScript interfaces and data structures for dashboard implementation

---

## Core Data Types

### Transaction Status

```typescript
// types/dashboard.ts

/**
 * Reconciliation status of a transaction
 * - pending: Awaiting review/action
 * - approved: Successfully reconciled
 * - rejected: Failed reconciliation or manual rejection
 */
export type TransactionStatus = 'pending' | 'approved' | 'rejected'

/**
 * Status badge color configuration
 * Maps status to visual styling
 */
export const STATUS_CONFIG: Record<TransactionStatus, {
  backgroundColor: string
  textColor: string
  label: string
}> = {
  pending: {
    backgroundColor: '#FEF3C7',
    textColor: '#F59E0B',
    label: 'Pending',
  },
  approved: {
    backgroundColor: '#DCFCE7',
    textColor: '#22C55E',
    label: 'Approved',
  },
  rejected: {
    backgroundColor: '#FEE2E2',
    textColor: '#EF4444',
    label: 'Rejected',
  },
}
```

---

### Transaction

```typescript
// types/dashboard.ts

/**
 * Represents a financial transaction in the reconciliation system
 * Used in the Recent Transactions table
 */
export interface Transaction {
  /** Unique transaction identifier */
  id: string
  
  /** Transaction date (ISO 8601 format: YYYY-MM-DD) */
  date: string
  
  /** Primary description of the transaction */
  description: string
  
  /** Transaction type subtitle (e.g., "Wire Transfer", "ACH Payment") */
  transactionType: string
  
  /** Counterparty name (person or organization) */
  counterparty: string
  
  /** Reference number (e.g., WT-2026-001, ACH-2026-002) */
  reference: string
  
  /** Transaction amount in USD */
  amount: number
  
  /** Reconciliation status */
  status: TransactionStatus
  
  /** Optional: Timestamp when transaction was created/updated */
  createdAt?: string
}

/**
 * Example transaction data (from spec)
 */
export const SAMPLE_TRANSACTIONS: Transaction[] = [
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
  {
    id: 'txn-003',
    date: '2026-02-22',
    description: 'Check deposit - John Doe',
    transactionType: 'Check Deposit',
    counterparty: 'John Doe',
    reference: 'CHK-2026-003',
    amount: 2300.00,
    status: 'rejected',
  },
  {
    id: 'txn-004',
    date: '2026-02-21',
    description: 'Electronic transfer payment',
    transactionType: 'Electronic Transfer',
    counterparty: 'Tech Solutions Inc',
    reference: 'ET-2026-004',
    amount: 12750.25,
    status: 'pending',
  },
]
```

---

### Dashboard Statistics

```typescript
// types/dashboard.ts

/**
 * Trend direction for statistical comparisons
 * - up: Positive change (green)
 * - down: Negative change (red)
 * - neutral: No change (gray)
 */
export type TrendDirection = 'up' | 'down' | 'neutral'

/**
 * Trend indicator with percentage change
 */
export interface TrendIndicator {
  /** Percentage change value (e.g., 12.5 for 12.5%) */
  percentage: number
  
  /** Direction of change */
  direction: TrendDirection
  
  /** Comparison period label (e.g., "vs last period", "vs last month") */
  comparisonLabel: string
}

/**
 * Stat card data structure
 * Represents one of the four dashboard statistics cards
 */
export interface StatCard {
  /** Unique identifier for the stat */
  id: string
  
  /** Card title (e.g., "Total Pending", "Total Approved") */
  title: string
  
  /** Main value displayed in large bold text */
  value: string | number
  
  /** Trend indicator showing change from previous period */
  trend: TrendIndicator
  
  /** Progress bar value (0-100 percentage) */
  progressValue: number
  
  /** Progress bar color */
  progressColor?: 'indigo' | 'red' | 'green'
  
  /** Descriptive label below progress bar */
  label: string
}

/**
 * Complete dashboard statistics payload
 * Returned by GET /api/dashboard/stats
 */
export interface DashboardStats {
  /** Total transactions pending reconciliation */
  totalPending: StatCard
  
  /** Total transactions approved this month */
  totalApproved: StatCard
  
  /** Total transactions rejected */
  totalRejected: StatCard
  
  /** Overall reconciliation rate percentage */
  reconciliationRate: StatCard
  
  /** Timestamp when stats were last updated */
  lastUpdated: string
}

/**
 * Example dashboard stats (from spec)
 */
export const SAMPLE_DASHBOARD_STATS: DashboardStats = {
  totalPending: {
    id: 'total-pending',
    title: 'Total Pending',
    value: 45,
    trend: {
      percentage: 12.5,
      direction: 'up',
      comparisonLabel: 'vs last period',
    },
    progressValue: 35, // Visual representation
    progressColor: 'indigo',
    label: 'Requires review',
  },
  totalApproved: {
    id: 'total-approved',
    title: 'Total Approved',
    value: '1,250',
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
```

---

### Alert Banner

```typescript
// types/dashboard.ts

/**
 * Alert banner configuration
 * Displayed when action is required
 */
export interface AlertBanner {
  /** Alert type for styling */
  type: 'warning' | 'error' | 'success' | 'info'
  
  /** Alert message text */
  message: string
  
  /** Whether the alert can be dismissed by the user */
  dismissible: boolean
  
  /** Optional: Icon to display (defaults based on type) */
  icon?: React.ReactNode
}

/**
 * Example alert banner (from spec)
 */
export const SAMPLE_ALERT_BANNER: AlertBanner = {
  type: 'warning',
  message: '45 transactions pending reconciliation - action required',
  dismissible: true,
}
```

---

### Important Notice Banner

```typescript
// types/dashboard.ts

/**
 * Important notice banner (purple gradient)
 * Prompts user to take specific action
 */
export interface ImportantNotice {
  /** Bold title text */
  title: string
  
  /** Subtitle/description text */
  subtitle: string
  
  /** Call-to-action button label */
  actionLabel: string
  
  /** Route or action to execute on button click */
  onAction: () => void
}

/**
 * Example important notice (from spec)
 */
export const SAMPLE_IMPORTANT_NOTICE: ImportantNotice = {
  title: 'Important Notice',
  subtitle: 'Review pending transactions to maintain reconciliation accuracy',
  actionLabel: 'View Pending',
  onAction: () => console.log('Navigate to pending transactions'),
}
```

---

### Navigation

```typescript
// types/dashboard.ts

/**
 * Navigation section in sidebar
 */
export type NavSection = 'GENERAL' | 'MANAGEMENT' | 'SETTINGS'

/**
 * Navigation item configuration
 */
export interface NavItem {
  /** Unique identifier */
  id: string
  
  /** Display label */
  label: string
  
  /** Navigation route/path */
  href: string
  
  /** Section this item belongs to */
  section: NavSection
  
  /** Icon component or SVG */
  icon: React.ReactNode
  
  /** Whether this item is currently active */
  isActive?: boolean
}

/**
 * Complete navigation configuration
 */
export const DASHBOARD_NAVIGATION: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    section: 'GENERAL',
    icon: DashboardIcon,
    isActive: true,
  },
  {
    id: 'reconciliation',
    label: 'Reconciliation',
    href: '/reconciliation',
    section: 'GENERAL',
    icon: ReconciliationIcon,
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    section: 'GENERAL',
    icon: ReportsIcon,
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/customers',
    section: 'MANAGEMENT',
    icon: CustomersIcon,
  },
  {
    id: 'audit-trail',
    label: 'Audit Trail',
    href: '/audit',
    section: 'MANAGEMENT',
    icon: AuditIcon,
  },
  {
    id: 'gl-accounts',
    label: 'G/L Accounts',
    href: '/gl-accounts',
    section: 'MANAGEMENT',
    icon: AccountsIcon,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    section: 'SETTINGS',
    icon: SettingsIcon,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    section: 'SETTINGS',
    icon: AnalyticsIcon,
  },
]
```

---

### Filter and Sort Options

```typescript
// types/dashboard.ts

/**
 * Available status filter options
 */
export type StatusFilter = 'all' | TransactionStatus

/**
 * Available sort options
 */
export type SortOption = 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc'

/**
 * Transaction table filter state
 */
export interface TransactionFilters {
  /** Status filter selection */
  status: StatusFilter
  
  /** Sort selection */
  sort: SortOption
  
  /** Search query (from header search bar) */
  search?: string
}

/**
 * Default filter state
 */
export const DEFAULT_FILTERS: TransactionFilters = {
  status: 'all',
  sort: 'date-desc',
  search: '',
}
```

---

### User Profile

```typescript
// types/dashboard.ts

/**
 * User profile information
 * Displayed in sidebar and header
 */
export interface UserProfile {
  /** User's full name */
  name: string
  
  /** User's initials for avatar */
  initials: string
  
  /** User's role/title */
  role: string
  
  /** Avatar image URL (optional) */
  avatarUrl?: string
}

/**
 * Example user profile (from spec)
 */
export const SAMPLE_USER: UserProfile = {
  name: 'John Doe',
  initials: 'JD',
  role: 'Bank Admin',
}
```

---

## API Response Types

### Dashboard Stats Response

```typescript
// types/dashboard.ts

/**
 * API response for GET /api/dashboard/stats
 */
export interface DashboardStatsResponse {
  /** Success flag */
  success: boolean
  
  /** Statistics data */
  data: DashboardStats
  
  /** Error message if success is false */
  error?: string
}
```

### Recent Transactions Response

```typescript
// types/dashboard.ts

/**
 * API response for GET /api/transactions/recent
 */
export interface RecentTransactionsResponse {
  /** Success flag */
  success: boolean
  
  /** Array of transactions */
  data: Transaction[]
  
  /** Total count (for pagination) */
  total: number
  
  /** Applied filters */
  filters: TransactionFilters
  
  /** Error message if success is false */
  error?: string
}
```

---

## Validation Rules

### Transaction Validation

```typescript
// lib/dashboard/validation.ts

import { Transaction } from '@/types/dashboard'

/**
 * Validate transaction data structure
 */
export function validateTransaction(transaction: unknown): transaction is Transaction {
  if (!transaction || typeof transaction !== 'object') return false
  
  const tx = transaction as Record<string, unknown>
  
  return (
    typeof tx.id === 'string' &&
    typeof tx.date === 'string' &&
    typeof tx.description === 'string' &&
    typeof tx.transactionType === 'string' &&
    typeof tx.counterparty === 'string' &&
    typeof tx.reference === 'string' &&
    typeof tx.amount === 'number' &&
    ['pending', 'approved', 'rejected'].includes(tx.status as string)
  )
}

/**
 * Validate transaction amount is positive
 */
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && amount >= 0 && isFinite(amount)
}

/**
 * Validate date string is ISO 8601 format
 */
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false
  
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}
```

---

## Data Transformation Utilities

### Currency Formatting

```typescript
// lib/dashboard/formatters.ts

/**
 * Format amount as USD currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Example: formatCurrency(15000) → "$15,000.00"
```

### Date Formatting

```typescript
// lib/dashboard/formatters.ts

/**
 * Format ISO date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

// Example: formatDate('2026-02-24') → "Feb 24, 2026"
```

### Percentage Formatting

```typescript
// lib/dashboard/formatters.ts

/**
 * Format percentage with sign and direction
 */
export function formatPercentage(percentage: number): string {
  const sign = percentage > 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}

// Example: formatPercentage(12.5) → "+12.5%"
```

---

## Summary

This data model defines:

1. **Core Types**: Transaction, TransactionStatus, StatCard, DashboardStats
2. **UI Components**: AlertBanner, ImportantNotice, NavItem, UserProfile
3. **Filters**: TransactionFilters, StatusFilter, SortOption
4. **API Responses**: Typed responses for dashboard stats and transactions endpoints
5. **Validation**: Type guards and validation functions for data integrity
6. **Formatters**: Utility functions for currency, date, and percentage display

All types are designed to be:
- **Type-safe**: Full TypeScript coverage
- **Testable**: Clear interfaces for mocking and assertions
- **Extensible**: Easy to add new fields or statuses
- **Consistent**: Follows existing project conventions
