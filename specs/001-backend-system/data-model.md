# Data Model: UI Components & Domain Entities

**Feature**: Dashboard Redesign - Enterprise Fintech UI
**Date**: 2026-02-22
**Branch**: `001-backend-system`

---

## Overview

This document defines the data models for UI components and domain entities in the Internal Bank Reconciliation System. Models are organized by layer:

1. **Domain Entities** - Core business objects from backend
2. **UI Component Props** - Component interface contracts
3. **State Models** - Client-side state management schemas
4. **API Request/Response** - API contract types

---

## 1. Domain Entities

### ReconciliationSession

Represents a single bank CSV upload and its reconciliation results.

```typescript
interface ReconciliationSession {
  id: string;                    // UUID
  fileName: string;              // Original uploaded file name
  fileSize: number;              // File size in bytes
  uploadedAt: string;            // ISO 8601 timestamp
  uploadedBy: string;            // User ID
  
  // Transaction Counts
  totalBankTransactions: number;
  totalInternalTransactions: number;
  matchedCount: number;
  unmatchedBankOnlyCount: number;
  unmatchedInternalOnlyCount: number;
  varianceDetectedCount: number;
  
  // Workflow State
  status: ReconciliationStatus;  // Draft | Processing | PendingApproval | Approved | Rejected
  submittedAt?: string;          // ISO 8601 timestamp
  approvedAt?: string;           // ISO 8601 timestamp
  approvedBy?: string;           // User ID
  rejectedAt?: string;           // ISO 8601 timestamp
  rejectedBy?: string;           // User ID
  rejectionReason?: string;      // Required if rejected
  
  // Metadata
  processingStartedAt?: string;
  processingCompletedAt?: string;
  errorMessage?: string;         // If processing failed
}

enum ReconciliationStatus {
  Draft = 'draft',
  Processing = 'processing',
  PendingApproval = 'pending_approval',
  Approved = 'approved',
  Rejected = 'rejected'
}
```

### BankTransaction

A transaction from the uploaded bank CSV file.

```typescript
interface BankTransaction {
  id: string;                    // UUID
  reconciliationSessionId: string;
  
  // Transaction Data
  amount: number;                // Decimal (positive = credit, negative = debit)
  currency: string;              // ISO 4217 (e.g., 'USD', 'EUR')
  transactionDate: string;       // ISO 8601 date
  valueDate?: string;            // ISO 8601 date (when funds available)
  reference: string;             // Bank reference number
  description: string;           // Transaction description/narrative
  
  // Counterparty Info (if available)
  counterpartyName?: string;
  counterpartyAccount?: string;
  
  // Classification Result
  classification: TransactionClassification;
  matchedInternalTransactionId?: string;  // If matched
  varianceAmount?: number;       // If variance detected
  overrideReason?: string;       // If manually overridden
  overriddenAt?: string;
  overriddenBy?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

enum TransactionClassification {
  Matched = 'matched',
  UnmatchedBankOnly = 'unmatched_bank_only',
  UnmatchedInternalOnly = 'unmatched_internal_only',
  VarianceDetected = 'variance_detected'
}
```

### InternalTransaction

A transaction from the Oracle financial system.

```typescript
interface InternalTransaction {
  id: string;                    // UUID
  reconciliationSessionId?: string;  // Null until reconciliation created
  
  // Transaction Data
  amount: number;
  currency: string;
  transactionDate: string;
  reference: string;
  description: string;
  
  // Oracle-Specific Fields
  accountCode: string;           // General ledger account
  costCenter: string;            // Cost center code
  journalEntryId: string;        // Oracle journal entry ID
  lineNumber?: number;           // Journal line number
  
  // Additional Metadata
  createdBy: string;
  createdAt: string;
  sourceSystem: string;          // 'ORACLE' | 'MANUAL' | 'INTEGRATION'
}
```

### ReconciliationResult

The outcome of matching a bank transaction with internal transactions.

```typescript
interface ReconciliationResult {
  id: string;
  reconciliationSessionId: string;
  bankTransactionId: string;
  
  // Match Result
  classification: TransactionClassification;
  confidenceScore?: number;      // 0-1 matching confidence (for ML future)
  
  // Matched Records
  matchedInternalTransactionIds: string[];  // Can be 0, 1, or many
  
  // Variance Details
  varianceAmount?: number;       // Positive = bank > internal, Negative = bank < internal
  varianceReason?: string;       // Auto-detected reason (e.g., 'fee', 'timing')
  
  // Manual Override
  isOverridden: boolean;
  previousClassification?: TransactionClassification;
  overrideReason?: string;
  overriddenAt?: string;
  overriddenBy?: string;
  
  // Audit
  createdAt: string;
  updatedAt: string;
}
```

### WorkflowState

Tracks the current approval state of a reconciliation session.

```typescript
interface WorkflowState {
  reconciliationSessionId: string;
  currentState: ReconciliationStatus;
  previousState?: ReconciliationStatus;
  transitionedAt: string;
  transitionedBy: string;        // User ID
  transitionReason?: string;     // Required for rejections
  metadata: Record<string, unknown>;  // Additional context
}
```

### AuditLogEntry

Immutable record of a user action.

```typescript
interface AuditLogEntry {
  id: string;
  
  // Action Details
  timestamp: string;             // ISO 8601 timestamp
  userId: string;
  userEmail: string;
  userName: string;
  actionType: AuditActionType;
  
  // Target Entity
  entityType: string;            // 'reconciliation' | 'transaction' | 'override' | 'workflow'
  entityId: string;
  
  // Action Details
  action: string;                // 'create' | 'update' | 'delete' | 'submit' | 'approve' | 'reject'
  previousState?: Record<string, unknown>;  // Snapshot before change
  newState?: Record<string, unknown>;       // Snapshot after change
  details?: Record<string, unknown>;        // Action-specific metadata
  
  // System Info
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

enum AuditActionType {
  Login = 'login',
  Logout = 'logout',
  FileUpload = 'file_upload',
  ReconciliationCreate = 'reconciliation_create',
  ReconciliationSubmit = 'reconciliation_submit',
  ReconciliationApprove = 'reconciliation_approve',
  ReconciliationReject = 'reconciliation_reject',
  ClassificationOverride = 'classification_override',
  FilterApply = 'filter_apply',
  Export = 'export'
}
```

### ManualOverride

Records when a user manually changes a transaction classification.

```typescript
interface ManualOverride {
  id: string;
  reconciliationSessionId: string;
  bankTransactionId: string;
  
  // Override Details
  previousClassification: TransactionClassification;
  newClassification: TransactionClassification;
  reason: string;                // Minimum 10 characters
  supportingDocumentId?: string; // Optional attachment
  
  // Audit
  userId: string;
  userEmail: string;
  createdAt: string;
  
  // Approval (overrides may require approval)
  approvalStatus: OverrideApprovalStatus;
  approvedAt?: string;
  approvedBy?: string;
}

enum OverrideApprovalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}
```

### User

System user with role-based access.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

enum UserRole {
  Viewer = 'viewer',           // Read-only access
  Processor = 'processor',     // Can upload, reconcile, override
  Approver = 'approver',       // Can approve/reject reconciliations
  Admin = 'admin'              // Full access including user management
}
```

---

## 2. UI Component Props

### Layout Components

```typescript
// DashboardLayout
interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

// Header
interface HeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Sidebar
interface SidebarProps {
  navigation: NavigationItem[];
  activePath: string;
  collapsed?: boolean;
  onNavigate: (path: string) => void;
}

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: number;                // Unread count, etc.
  children?: NavigationItem[];   // Nested navigation
}
```

### Data Display Components

```typescript
// DataTable (Virtualized)
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowHeight: number;
  totalRows?: number;            // For server-side pagination
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  onRowSelect?: (row: T) => void;
  selectedRowIds?: string[];
  emptyState?: React.ReactNode;
}

interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  width?: number | 'auto' | 'flex';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  cell?: (row: T) => React.ReactNode;
  headerCell?: () => React.ReactNode;
}

// StatCard
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;               // Percentage change
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number[];              // Sparkline data
  onClick?: () => void;
  isLoading?: boolean;
}

// ClassificationBadge
interface ClassificationBadgeProps {
  classification: TransactionClassification;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// TransactionRow
interface TransactionRowProps {
  transaction: BankTransaction;
  isSelected?: boolean;
  isExpanded?: boolean;
  onSelect: () => void;
  onExpand: () => void;
  onOverride: () => void;
}
```

### Form Components

```typescript
// FileUpload
interface FileUploadProps {
  accept: string;                // e.g., '.csv'
  maxSize?: number;              // In bytes
  onFileSelect: (file: File) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  dropzoneText?: string;
}

// TextField
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

// SelectField
interface SelectFieldProps<T> {
  label: string;
  value: T | null;
  onChange: (value: T | null) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
}

interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

// DatePicker
interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  required?: boolean;
}

// FilterBar
interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  availableFilters: FilterDefinition[];
}

interface FilterState {
  classification?: TransactionClassification[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  status?: ReconciliationStatus[];
}

interface FilterDefinition {
  key: keyof FilterState;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: SelectOption<unknown>[];
}
```

### Feedback Components

```typescript
// Toast
interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;           // ms, 0 = persistent
  onDismiss: () => void;
}

enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

// ToastContainer
interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;              // For accessibility
}

// ProgressBar
interface ProgressBarProps {
  value: number;               // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Alert
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  children?: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
}
```

### Modal Components

```typescript
// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

// OverrideModal
interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classification: TransactionClassification, reason: string) => Promise<void>;
  transaction: BankTransaction;
  currentClassification: TransactionClassification;
  availableClassifications: TransactionClassification[];
}

// ConfirmationDialog
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}
```

---

## 3. State Models

### UI State (Zustand)

```typescript
interface UIState {
  // Navigation
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Detail Panel
  detailPanelOpen: boolean;
  detailPanelContent: React.ReactNode | null;
  
  // Active Selection
  selectedReconciliationId: string | null;
  selectedTransactionId: string | null;
  
  // Filters
  activeFilters: FilterState;
  savedFilters: SavedFilter[];
  
  // Toasts
  toasts: ToastProps[];
  
  // Actions
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  openDetailPanel: (content: React.ReactNode) => void;
  closeDetailPanel: () => void;
  setSelectedReconciliation: (id: string | null) => void;
  setSelectedTransaction: (id: string | null) => void;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  dismissToast: (id: string) => void;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}
```

### Reconciliation State (Zustand)

```typescript
interface ReconciliationState {
  // Current Session
  currentSession: ReconciliationSession | null;
  transactions: BankTransaction[];
  internalTransactions: InternalTransaction[];
  results: ReconciliationResult[];
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalRows: number;
  
  // Sorting
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  
  // Loading States
  isLoadingSession: boolean;
  isLoadingTransactions: boolean;
  isProcessing: boolean;
  error: Error | null;
  
  // Actions
  loadSession: (id: string) => Promise<void>;
  loadTransactions: (params: LoadTransactionsParams) => Promise<void>;
  submitForApproval: (id: string) => Promise<void>;
  approve: (id: string) => Promise<void>;
  reject: (id: string, reason: string) => Promise<void>;
  overrideClassification: (
    transactionId: string,
    classification: TransactionClassification,
    reason: string
  ) => Promise<void>;
  setPagination: (page: number, pageSize: number) => void;
  setSorting: (column: string, direction: 'asc' | 'desc') => void;
  reset: () => void;
}

interface LoadTransactionsParams {
  sessionId: string;
  page?: number;
  pageSize?: number;
  filters?: FilterState;
  sort?: { column: string; direction: 'asc' | 'desc' };
}
```

### Auth State (Zustand)

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}
```

---

## 4. API Request/Response Types

### Reconciliation API

```typescript
// POST /api/reconciliations
interface CreateReconciliationRequest {
  fileName: string;
  fileData: string;              // Base64 encoded CSV
}

interface CreateReconciliationResponse {
  session: ReconciliationSession;
}

// GET /api/reconciliations
interface ListReconciliationsRequest {
  page?: number;
  pageSize?: number;
  status?: ReconciliationStatus[];
  dateFrom?: string;
  dateTo?: string;
}

interface ListReconciliationsResponse {
  reconciliations: ReconciliationSession[];
  pagination: PaginationMeta;
}

// GET /api/reconciliations/:id
interface GetReconciliationResponse {
  session: ReconciliationSession;
  summary: ReconciliationSummary;
}

interface ReconciliationSummary {
  totalTransactions: number;
  matchedPercentage: number;
  unmatchedPercentage: number;
  variancePercentage: number;
  totalVarianceAmount: number;
}

// POST /api/reconciliations/:id/submit
interface SubmitReconciliationRequest {
  id: string;
}

interface SubmitReconciliationResponse {
  session: ReconciliationSession;
}

// POST /api/reconciliations/:id/approve
interface ApproveReconciliationRequest {
  id: string;
}

// POST /api/reconciliations/:id/reject
interface RejectReconciliationRequest {
  id: string;
  reason: string;
}

// GET /api/reconciliations/:id/transactions
interface GetTransactionsRequest {
  sessionId: string;
  page?: number;
  pageSize?: number;
  classification?: TransactionClassification[];
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface GetTransactionsResponse {
  transactions: BankTransaction[];
  pagination: PaginationMeta;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### Transaction Override API

```typescript
// POST /api/transactions/:id/override
interface OverrideTransactionRequest {
  transactionId: string;
  classification: TransactionClassification;
  reason: string;                // Min 10 characters
}

interface OverrideTransactionResponse {
  transaction: BankTransaction;
  override: ManualOverride;
}

// GET /api/transactions/:id/overrides
interface GetOverridesRequest {
  transactionId: string;
}

interface GetOverridesResponse {
  overrides: ManualOverride[];
}
```

### Audit API

```typescript
// GET /api/audit-logs
interface GetAuditLogsRequest {
  page?: number;
  pageSize?: number;
  actionType?: AuditActionType[];
  entityType?: string[];
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface GetAuditLogsResponse {
  logs: AuditLogEntry[];
  pagination: PaginationMeta;
}
```

### Auth API

```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// POST /api/auth/logout
interface LogoutResponse {
  success: boolean;
}

// GET /api/auth/me
interface GetCurrentUserResponse {
  user: User;
}
```

### Error Responses

```typescript
interface ErrorResponse {
  error: {
    code: string;                // Machine-readable error code
    message: string;             // Human-readable message
    details?: Record<string, string[]>;  // Field-specific errors
    stack?: string;              // Development only
  };
}

// Error Codes
enum ErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Authorization
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Not Found
  NOT_FOUND = 'NOT_FOUND',
  RECONCILIATION_NOT_FOUND = 'RECONCILIATION_NOT_FOUND',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  
  // Conflict
  CONFLICT = 'CONFLICT',
  ALREADY_APPROVED = 'ALREADY_APPROVED',
  ALREADY_SUBMITTED = 'ALREADY_SUBMITTED',
  
  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}
```

---

## 5. Validation Rules

### File Upload Validation

```typescript
interface FileUploadValidation {
  allowedExtensions: ['.csv'];
  maxFileSize: 100 * 1024 * 1024;  // 100MB
  requiredColumns: [
    'amount',
    'date',
    'reference',
    'description'
  ];
  optionalColumns: [
    'currency',
    'counterparty_name',
    'counterparty_account',
    'value_date'
  ];
}
```

### Manual Override Validation

```typescript
interface OverrideValidation {
  reason: {
    minLength: 10;
    maxLength: 500;
    required: true;
  };
  classification: {
    allowedTransitions: {
      [TransactionClassification.UnmatchedBankOnly]: [
        TransactionClassification.Matched,
        TransactionClassification.UnmatchedInternalOnly
      ];
      [TransactionClassification.UnmatchedInternalOnly]: [
        TransactionClassification.Matched,
        TransactionClassification.UnmatchedBankOnly
      ];
      [TransactionClassification.VarianceDetected]: [
        TransactionClassification.Matched
      ];
    };
  };
}
```

### Workflow Transition Validation

```typescript
interface WorkflowTransitionValidation {
  allowedTransitions: {
    [ReconciliationStatus.Draft]: [
      ReconciliationStatus.Processing,
      ReconciliationStatus.PendingApproval
    ];
    [ReconciliationStatus.Processing]: [
      ReconciliationStatus.PendingApproval,
      ReconciliationStatus.Draft  // On error
    ];
    [ReconciliationStatus.PendingApproval]: [
      ReconciliationStatus.Approved,
      ReconciliationStatus.Rejected,
      ReconciliationStatus.Draft  // On recall
    ];
    [ReconciliationStatus.Approved]: [];  // Terminal state
    [ReconciliationStatus.Rejected]: [
      ReconciliationStatus.PendingApproval,
      ReconciliationStatus.Draft
    ];
  };
}
```

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│      User           │
│─────────────────────│
│ id                  │
│ email               │
│ name                │
│ role                │
└──────────┬──────────┘
           │
           │ creates
           ▼
┌─────────────────────┐
│ Reconciliation      │
│ Session             │
│─────────────────────│
│ id                  │
│ fileName            │
│ status              │
│ uploadedAt          │
│ uploadedBy (FK)     │
└──────────┬──────────┘
           │
           │ contains
           ▼
┌─────────────────────┐       ┌─────────────────────┐
│ Bank Transaction    │◄──────│ Reconciliation      │
│─────────────────────│       │ Result              │
│ id                  │       │─────────────────────│
│ sessionId (FK)      │       │ id                  │
│ amount              │       │ sessionId (FK)      │
│ reference           │       │ bankTransactionId   │
│ classification      │       │ classification      │
└──────────┬──────────┘       │ matchedInternalIds  │
           │                  └──────────┬──────────┘
           │ matches                     │
           ▼                             │
┌─────────────────────┐                  │
│ Internal            │◄─────────────────┘
│ Transaction         │  (references)
│─────────────────────│
│ id                  │
│ sessionId (FK)      │
│ amount              │
│ reference           │
│ accountCode         │
└──────────┬──────────┘
           │
           │ triggers
           ▼
┌─────────────────────┐
│ Manual Override     │
│─────────────────────│
│ id                  │
│ transactionId (FK)  │
│ previousClass       │
│ newClassification   │
│ reason              │
│ userId (FK)         │
└─────────────────────┘

All entities → Audit Log Entries (immutable)
```

---

**Document Version**: 1.0.0
**Last Updated**: 2026-02-22
**Maintainer**: Design System Team
