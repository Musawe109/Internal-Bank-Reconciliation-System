# Data Model: Dashboard Redesign

**Feature**: 002-dashboard-redesign  
**Date**: 2026-02-24  
**Purpose**: Define TypeScript types and interfaces for dashboard data structures

---

## Core Entities

### ReconciliationStats

Represents aggregated statistics displayed in the dashboard cards.

```typescript
interface ReconciliationStats {
  /** Total number of transactions pending reconciliation */
  pendingCount: number
  /** Total number of approved transactions */
  approvedCount: number
  /** Total number of rejected transactions */
  rejectedCount: number
  /** Total number of all transactions */
  totalCount: number
  /** Total monetary value pending reconciliation */
  pendingAmount: number
  /** Total monetary value approved */
  approvedAmount: number
  /** Total monetary value rejected */
  rejectedAmount: number
  /** Percentage of transactions reconciled (0-100) */
  reconciliationRate: number
  /** Trend indicator: 'up' | 'down' | 'stable' */
  trend?: 'up' | 'down' | 'stable'
  /** Percentage change from previous period */
  trendPercentage?: number
}
```

**Validation Rules**:
- All count fields MUST be non-negative integers
- All amount fields MUST be non-negative numbers
- `reconciliationRate` MUST be between 0 and 100
- `trendPercentage` MUST be between -100 and 100 when present
- `trend` and `trendPercentage` MUST both be present or both absent

---

### Transaction

Represents a single bank reconciliation transaction.

```typescript
interface Transaction {
  /** Unique transaction identifier */
  id: string
  /** Transaction description or reference */
  description: string
  /** Transaction amount (positive for credits, negative for debits) */
  amount: number
  /** Transaction date in ISO 8601 format */
  date: string
  /** Current reconciliation status */
  status: TransactionStatus
  /** Counterparty name or account */
  counterparty?: string
  /** Transaction category or type */
  category?: string
  /** Internal reference number */
  reference?: string
  /** Timestamp when transaction was created */
  createdAt: string
  /** Timestamp when transaction was last updated */
  updatedAt: string
  /** User who approved/rejected (if applicable) */
  reviewedBy?: string
  /** Timestamp of review */
  reviewedAt?: string
  /** Rejection reason (if rejected) */
  rejectionReason?: string
}
```

**Validation Rules**:
- `id` MUST be a non-empty string (UUID format recommended)
- `description` MUST be a non-empty string (max 200 characters)
- `amount` MUST be a non-zero number
- `date` MUST be a valid ISO 8601 date string
- `status` MUST be one of: 'pending', 'approved', 'rejected'
- `createdAt` and `updatedAt` MUST be valid ISO 8601 datetime strings
- `reviewedBy` and `reviewedAt` MUST both be present if status is 'approved' or 'rejected'
- `rejectionReason` MUST be present if status is 'rejected'

---

### TransactionStatus

Type definition for transaction status values.

```typescript
type TransactionStatus = 'pending' | 'approved' | 'rejected'
```

**Status Badge Mapping**:
- `pending` → Amber badge (bg-amber-100, text-amber-700)
- `approved` → Emerald badge (bg-emerald-100, text-emerald-700)
- `rejected` → Rose badge (bg-rose-100, text-rose-700)

---

### TransactionFilter

Filter criteria for transaction list queries.

```typescript
interface TransactionFilter {
  /** Filter by status */
  status?: TransactionStatus | TransactionStatus[]
  /** Filter by date range (start date) */
  dateFrom?: string
  /** Filter by date range (end date) */
  dateTo?: string
  /** Filter by amount range (minimum) */
  amountMin?: number
  /** Filter by amount range (maximum) */
  amountMax?: number
  /** Filter by category */
  category?: string
  /** Filter by counterparty */
  counterparty?: string
  /** Search term for description/reference */
  search?: string
}
```

**Validation Rules**:
- If `dateFrom` and `dateTo` both present, `dateFrom` MUST be <= `dateTo`
- If `amountMin` and `amountMax` both present, `amountMin` MUST be <= `amountMax`
- `search` term MUST be at least 2 characters if provided

---

### TransactionSort

Sort configuration for transaction list.

```typescript
type SortField = 'date' | 'amount' | 'description' | 'status' | 'createdAt'

type SortOrder = 'asc' | 'desc'

interface TransactionSort {
  /** Field to sort by */
  field: SortField
  /** Sort direction */
  order: SortOrder
}
```

---

### TransactionListResponse

Response structure for transaction list API.

```typescript
interface TransactionListResponse {
  /** Array of transactions */
  transactions: Transaction[]
  /** Total number of transactions matching filter (before pagination) */
  total: number
  /** Current page number (1-indexed) */
  page: number
  /** Number of items per page */
  pageSize: number
  /** Total number of pages */
  totalPages: number
}
```

---

### DashboardData

Complete data structure for dashboard page.

```typescript
interface DashboardData {
  /** Statistics for cards */
  stats: ReconciliationStats
  /** Recent transactions for table */
  recentTransactions: Transaction[]
  /** Active alerts/notifications */
  alerts: DashboardAlert[]
  /** Last updated timestamp */
  lastUpdated: string
}
```

---

### DashboardAlert

Alert/notification displayed in the alert bar.

```typescript
interface DashboardAlert {
  /** Unique alert identifier */
  id: string
  /** Alert priority level */
  priority: 'high' | 'medium' | 'low'
  /** Alert message content */
  message: string
  /** Optional action button label */
  actionLabel?: string
  /** Optional action to perform when button clicked */
  actionHandler?: () => void
  /** Alert dismissal state */
  dismissed: boolean
  /** Alert creation timestamp */
  createdAt: string
}
```

**Validation Rules**:
- `message` MUST be a non-empty string (max 500 characters)
- `actionLabel` and `actionHandler` MUST both be present or both absent
- `priority` determines visual styling (high = red accent, medium = amber, low = blue)

---

## State Machines

### Transaction Status Flow

```
[Created] → [Pending] → [Approved]
                       ↘ [Rejected] → [Pending] (on appeal)
```

**State Transitions**:
- `pending` → `approved`: User approves transaction
- `pending` → `rejected`: User rejects transaction with reason
- `rejected` → `pending`: User appeals rejection (resets for re-review)
- `approved` → No further transitions allowed (final state)

---

## Component Props Types

### StatsCard Props

```typescript
interface StatsCardProps {
  /** Card title/label */
  label: string
  /** Primary numeric value */
  value: number | string
  /** Optional trend indicator */
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
  /** Optional progress bar value (0-100) */
  progress?: number
  /** Optional footer content */
  footer?: string
  /** Loading state */
  isLoading?: boolean
}
```

---

### TransactionTable Props

```typescript
interface TransactionTableProps {
  /** Transactions to display */
  transactions: Transaction[]
  /** Current filter state */
  filter: TransactionFilter
  /** Current sort state */
  sort: TransactionSort
  /** Callback when filter changes */
  onFilterChange: (filter: TransactionFilter) => void
  /** Callback when sort changes */
  onSortChange: (sort: TransactionSort) => void
  /** Callback when transaction action triggered */
  onTransactionAction: (transaction: Transaction, action: string) => void
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: Error
  /** Empty state message */
  emptyMessage?: string
}
```

---

### StatusBadge Props

```typescript
interface StatusBadgeProps {
  /** Transaction status */
  status: TransactionStatus
  /** Optional custom label (defaults to status capitalized) */
  label?: string
  /** Compact display mode */
  compact?: boolean
}
```

---

### AlertBar Props

```typescript
interface AlertBarProps {
  /** Alert to display */
  alert: DashboardAlert
  /** Callback when alert dismissed */
  onDismiss: (alertId: string) => void
  /** Callback when alert action triggered */
  onAction: (alertId: string) => void
}
```

---

### Sidebar Props

```typescript
interface SidebarProps {
  /** Currently active navigation item */
  activeItem: string
  /** Navigation items grouped by section */
  items: {
    general: NavItem[]
    management: NavItem[]
    settings: NavItem[]
  }
  /** Callback when navigation item selected */
  onNavigate: (itemId: string) => void
  /** Collapsed state for mobile */
  isCollapsed?: boolean
  /** Callback to toggle collapse */
  onToggleCollapse?: () => void
}
```

```typescript
interface NavItem {
  /** Unique item identifier */
  id: string
  /** Display label */
  label: string
  /** Icon component or name */
  icon: string | React.ComponentType
  /** Optional badge count */
  badge?: number
  /** Disabled state */
  disabled?: boolean
}
```

---

## API Response Types

### Stats API Response

```typescript
// GET /api/reconciliation/stats
type GetStatsResponse = ReconciliationStats
```

### Transactions API Response

```typescript
// GET /api/reconciliation/transactions
type GetTransactionsRequest = {
  filter?: TransactionFilter
  sort?: TransactionSort
  page?: number
  pageSize?: number
}

type GetTransactionsResponse = TransactionListResponse
```

### Transaction Action API

```typescript
// PATCH /api/reconciliation/transactions/:id
type UpdateTransactionRequest = {
  status: TransactionStatus
  rejectionReason?: string
}

type UpdateTransactionResponse = Transaction
```

---

## Error Types

### API Error

```typescript
interface ApiError {
  /** HTTP status code */
  status: number
  /** Error message */
  message: string
  /** Detailed error information */
  details?: Record<string, string[]>
  /** Error code for programmatic handling */
  code: string
}
```

**Error Codes**:
- `VALIDATION_ERROR` (400): Request validation failed
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Transaction already processed
- `SERVER_ERROR` (500): Internal server error

---

## Loading States

### Component Loading State

```typescript
interface LoadingState {
  /** Overall loading flag */
  isLoading: boolean
  /** Specific section loading flags */
  sections: {
    stats: boolean
    transactions: boolean
    alerts: boolean
  }
  /** Error if any */
  error: ApiError | null
}
```

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-24
