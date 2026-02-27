// API Contracts: Dashboard Redesign
// Feature: 002-dashboard-redesign
// Date: 2026-02-24
// Purpose: TypeScript type definitions for API contracts

// ============================================================================
// Core Types
// ============================================================================

export type TransactionStatus = 'pending' | 'approved' | 'rejected'

export type TrendDirection = 'up' | 'down' | 'stable'

export type AlertPriority = 'high' | 'medium' | 'low'

export type SortField = 'date' | 'amount' | 'description' | 'status' | 'createdAt'

export type SortOrder = 'asc' | 'desc'

// ============================================================================
// Data Models
// ============================================================================

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  status: TransactionStatus
  counterparty?: string
  category?: string
  reference?: string
  createdAt: string
  updatedAt: string
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface ReconciliationStats {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalCount: number
  pendingAmount: number
  approvedAmount: number
  rejectedAmount: number
  reconciliationRate: number
  trend?: TrendDirection
  trendPercentage?: number
}

export interface DashboardAlert {
  id: string
  priority: AlertPriority
  message: string
  actionLabel?: string
  actionHandler?: () => void
  dismissed: boolean
  createdAt: string
}

// ============================================================================
// Request/Response Types
// ============================================================================

// GET /api/reconciliation/stats
export type GetStatsResponse = ReconciliationStats

// GET /api/reconciliation/transactions
export interface GetTransactionsRequest {
  page?: number
  pageSize?: number
  status?: TransactionStatus | TransactionStatus[]
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  category?: string
  counterparty?: string
  search?: string
  sort?: SortField
  order?: SortOrder
}

export interface GetTransactionsResponse {
  transactions: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// PATCH /api/reconciliation/transactions/:id
export interface UpdateTransactionRequest {
  status: TransactionStatus
  rejectionReason?: string
}

export type UpdateTransactionResponse = Transaction

// GET /api/reconciliation/transactions/:id
export type GetTransactionResponse = Transaction

// GET /api/reconciliation/alerts
export interface GetAlertsResponse {
  alerts: DashboardAlert[]
}

// POST /api/reconciliation/alerts/:id/dismiss
export type DismissAlertResponse = void

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  status: number
  message: string
  code: string
  details?: Record<string, string[]>
  requestId?: string
  timestamp?: string
}

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVICE_UNAVAILABLE'

// ============================================================================
// Filter and Sort Types
// ============================================================================

export interface TransactionFilter {
  status?: TransactionStatus | TransactionStatus[]
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  category?: string
  counterparty?: string
  search?: string
}

export interface TransactionSort {
  field: SortField
  order: SortOrder
}

export interface TransactionListParams extends TransactionFilter, TransactionSort {
  page?: number
  pageSize?: number
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface StatsCardProps {
  label: string
  value: number | string
  trend?: {
    direction: TrendDirection
    percentage: number
  }
  progress?: number
  footer?: string
  isLoading?: boolean
}

export interface TransactionTableProps {
  transactions: Transaction[]
  filter: TransactionFilter
  sort: TransactionSort
  onFilterChange: (filter: TransactionFilter) => void
  onSortChange: (sort: TransactionSort) => void
  onTransactionAction: (transaction: Transaction, action: string) => void
  isLoading?: boolean
  error?: ApiError
  emptyMessage?: string
}

export interface StatusBadgeProps {
  status: TransactionStatus
  label?: string
  compact?: boolean
}

export interface AlertBarProps {
  alert: DashboardAlert
  onDismiss: (alertId: string) => void
  onAction: (alertId: string) => void
}

export interface NavItem {
  id: string
  label: string
  icon: string | React.ComponentType
  badge?: number
  disabled?: boolean
}

export interface SidebarProps {
  activeItem: string
  items: {
    general: NavItem[]
    management: NavItem[]
    settings: NavItem[]
  }
  onNavigate: (itemId: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

// ============================================================================
// Loading State Types
// ============================================================================

export interface LoadingState {
  isLoading: boolean
  sections: {
    stats: boolean
    transactions: boolean
    alerts: boolean
  }
  error: ApiError | null
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

// ============================================================================
// Rate Limiting Headers
// ============================================================================

export interface RateLimitHeaders {
  'X-RateLimit-Limit': string
  'X-RateLimit-Remaining': string
  'X-RateLimit-Reset': string
}
