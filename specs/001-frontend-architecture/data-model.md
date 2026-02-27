# Data Model: Frontend Types and Entities

**Feature**: 001-frontend-architecture
**Date**: 2026-02-25
**Purpose**: Define TypeScript types and interfaces for frontend data structures

---

## Core Entities

### ReconciliationItem

Represents a single reconciliation record in the system.

```typescript
interface ReconciliationItem {
  /** Unique identifier for the reconciliation item */
  id: string;
  
  /** Date of the transaction being reconciled */
  transactionDate: string; // ISO 8601 format
  
  /** Transaction amount */
  amount: number;
  
  /** Currency code (ISO 4217) */
  currency: string;
  
  /** Transaction description */
  description: string;
  
  /** Current workflow state */
  status: WorkflowState;
  
  /** Classification type if categorized, null otherwise */
  classification: ClassificationType | null;
  
  /** Reference to bank transaction */
  bankTransactionId: string;
  
  /** Reference to internal transaction */
  internalTransactionId: string;
  
  /** Variance amount between bank and internal records */
  variance: number;
  
  /** Timestamp when item was created */
  createdAt: string; // ISO 8601 format
  
  /** Timestamp when item was last updated */
  updatedAt: string; // ISO 8601 format
  
  /** ID of user who last updated the item */
  updatedBy: string;
}
```

**Validation Rules**:
- `amount` must be a positive number
- `variance` can be positive, negative, or zero
- `status` must be one of the WorkflowState enum values
- `classification` must be one of the ClassificationType enum values or null
- `transactionDate` must be a valid ISO 8601 date

---

### ReconciliationSummary

Aggregated data for dashboard summary cards.

```typescript
interface ReconciliationSummary {
  /** Total number of reconciliation items */
  total: number;
  
  /** Count of matched items */
  matched: number;
  
  /** Count of unmatched items */
  unmatched: number;
  
  /** Count of items pending review */
  pending: number;
  
  /** Count of items flagged for review */
  flagged: number;
  
  /** Count of resolved items */
  resolved: number;
  
  /** Total variance amount across all items */
  totalVariance: number;
  
  /** Timestamp when summary was last updated */
  lastUpdated: string; // ISO 8601 format
}
```

**Validation Rules**:
- All counts must be non-negative integers
- `total` must equal sum of all status counts
- `totalVariance` can be positive, negative, or zero

---

### CSVUpload

Represents an uploaded CSV file and its processing status.

```typescript
interface CSVUpload {
  /** Unique identifier for the upload */
  uploadId: string;
  
  /** Original filename */
  filename: string;
  
  /** Type of upload: bank_statement or internal_transactions */
  uploadType: UploadType;
  
  /** Current processing status */
  status: UploadStatus;
  
  /** Total number of records in the file */
  recordCount: number | null;
  
  /** Number of records processed */
  processedCount: number;
  
  /** Number of records with errors */
  errorCount: number;
  
  /** Error message if processing failed */
  errorMessage: string | null;
  
  /** ID of user who uploaded the file */
  uploadedBy: string;
  
  /** Timestamp when file was uploaded */
  uploadedAt: string; // ISO 8601 format
  
  /** Timestamp when processing completed */
  completedAt: string | null; // ISO 8601 format
  
  /** Estimated completion time if processing */
  estimatedCompletionTime: string | null; // ISO 8601 format
}
```

**Validation Rules**:
- `recordCount` must be positive when not null
- `processedCount` must be <= `recordCount` when both are not null
- `errorCount` must be <= `processedCount`
- `completedAt` must be present when status is 'completed' or 'failed'

---

### AuditEvent

Records user actions for audit trail.

```typescript
interface AuditEvent {
  /** Unique identifier for the audit event */
  id: string;
  
  /** Timestamp when event occurred */
  timestamp: string; // ISO 8601 format
  
  /** Type of event */
  eventType: AuditEventType;
  
  /** ID of user who performed the action */
  userId: string;
  
  /** Name of user who performed the action */
  userName: string;
  
  /** ID of affected reconciliation item, if applicable */
  itemId: string | null;
  
  /** Human-readable description of the event */
  description: string;
  
  /** Additional metadata about the event */
  metadata: AuditEventMetadata;
  
  /** IP address from which action was performed */
  ipAddress: string;
  
  /** User agent string of the client */
  userAgent: string;
}

interface AuditEventMetadata {
  /** State before the change (for modifications) */
  before?: Record<string, unknown>;
  
  /** State after the change (for modifications) */
  after?: Record<string, unknown>;
  
  /** Reason provided for the action */
  reason?: string;
  
  /** Override code if override was applied */
  overrideCode?: string;
}
```

**Validation Rules**:
- `timestamp` must be a valid ISO 8601 datetime
- `eventType` must be one of the AuditEventType enum values
- `metadata.before` and `metadata.after` must be present for classification/workflow changes

---

### UserData

Information about the logged-in user.

```typescript
interface UserData {
  /** Unique user identifier */
  id: string;
  
  /** User's display name */
  displayName: string;
  
  /** User's email address */
  email: string;
  
  /** User's role(s) for RBAC */
  roles: UserRole[];
  
  /** User's preferences */
  preferences: UserPreferences;
}

interface UserPreferences {
  /** Default page size for tables */
  pageSize: number;
  
  /** Default sort field for reconciliation table */
  defaultSortBy: string;
  
  /** Default sort order */
  defaultSortOrder: SortOrder;
  
  /** Theme preference */
  theme: 'light' | 'dark' | 'system';
}

enum UserRole {
  VIEWER = 'viewer',
  RECONCILER = 'reconciler',
  APPROVER = 'approver',
  ADMIN = 'admin',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
```

---

## Enumerations

All enums must be imported from `@/lib/enums/` - no hardcoded values in components.

### WorkflowState

```typescript
// lib/enums/workflow-state.ts
enum WorkflowState {
  MATCHED = 'matched',
  UNMATCHED = 'unmatched',
  PENDING = 'pending',
  FLAGGED = 'flagged',
  RESOLVED = 'resolved',
}
```

**State Transitions**:
```
UNMATCHED → PENDING (when user starts working on it)
UNMATCHED → RESOLVED (when marked as resolved)
UNMATCHED → FLAGGED (when flagged for review)

PENDING → UNMATCHED (when user reverts)
PENDING → RESOLVED (when resolved)
PENDING → FLAGGED (when flagged)

FLAGGED → UNMATCHED (when unflagged)
FLAGGED → RESOLVED (when resolved after review)

RESOLVED → UNMATCHED (when reverted)
```

---

### ClassificationType

```typescript
// lib/enums/classification.ts
enum ClassificationType {
  TIMING_DIFFERENCE = 'Timing Difference',
  MISSING_TRANSACTION = 'Missing Transaction',
  BANK_ERROR = 'Bank Error',
  SYSTEM_ERROR = 'System Error',
  MANUAL_OVERRIDE = 'Manual Override',
}
```

---

### UploadStatus

```typescript
// lib/enums/upload-status.ts
enum UploadStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
```

---

### UploadType

```typescript
// lib/enums/upload-type.ts
enum UploadType {
  BANK_STATEMENT = 'bank_statement',
  INTERNAL_TRANSACTIONS = 'internal_transactions',
}
```

---

### AuditEventType

```typescript
// lib/enums/audit-event-type.ts
enum AuditEventType {
  UPLOAD = 'upload',
  CLASSIFICATION = 'classification',
  WORKFLOW_ACTION = 'workflow_action',
  OVERRIDE = 'override',
  LOGIN = 'login',
  LOGOUT = 'logout',
}
```

---

### WorkflowAction

```typescript
// lib/enums/workflow-action.ts
enum WorkflowAction {
  MARK_RESOLVED = 'markResolved',
  FLAG_FOR_REVIEW = 'flagForReview',
  APPLY_OVERRIDE = 'applyOverride',
  REVERT = 'revert',
}
```

---

## API Response Types

### Generic Response Wrapper

```typescript
type ApiResponse<T> = 
  | SuccessResponse<T>
  | ErrorResponse;

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: ApiError;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```

### Pagination Types

```typescript
interface PaginatedResponse<T> {
  success: true;
  data: {
    items: T[];
    pagination: PaginationInfo;
  };
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

---

## Component Props Types

### Table Component

```typescript
interface PaginatedTableProps<T> {
  /** Data to display */
  data: T[];
  
  /** Column definitions */
  columns: ColumnDef<T>[];
  
  /** Current page number */
  currentPage: number;
  
  /** Total pages */
  totalPages: number;
  
  /** Page size */
  pageSize: number;
  
  /** Total items */
  totalItems: number;
  
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  
  /** Callback when page size changes */
  onPageSizeChange: (pageSize: number) => void;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Empty state message */
  emptyMessage?: string;
}
```

### Status Badge Component

```typescript
interface StatusBadgeProps {
  /** Status to display */
  status: WorkflowState;
  
  /** Custom label (optional, uses status name by default) */
  label?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional CSS classes */
  className?: string;
}
```

### Classification Dropdown

```typescript
interface ClassificationDropdownProps {
  /** Current classification value */
  value: ClassificationType | null;
  
  /** Callback when classification changes */
  onChange: (classification: ClassificationType) => void;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  isLoading?: boolean;
}
```

### Manual Override Modal

```typescript
interface ManualOverrideModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  
  /** Callback to close modal */
  onClose: () => void;
  
  /** Callback when override is submitted */
  onSubmit: (data: OverrideData) => Promise<void>;
  
  /** Reconciliation item ID */
  itemId: string;
}

interface OverrideData {
  /** Override reason */
  reason: string;
  
  /** Override authorization code */
  overrideCode: string;
}
```

---

## Filter Types

### Reconciliation Filter

```typescript
interface ReconciliationFilters {
  /** Filter by status */
  status?: WorkflowState;
  
  /** Filter by classification */
  classification?: ClassificationType;
  
  /** Filter by date range */
  dateRange?: DateRange;
  
  /** Filter by amount range */
  amountRange?: AmountRange;
  
  /** Search query */
  search?: string;
}

interface DateRange {
  from: string; // ISO 8601 date
  to: string; // ISO 8601 date
}

interface AmountRange {
  from: number;
  to: number;
}
```

### Audit Log Filter

```typescript
interface AuditFilters {
  /** Filter by event type */
  eventType?: AuditEventType;
  
  /** Filter by user ID */
  userId?: string;
  
  /** Filter by item ID */
  itemId?: string;
  
  /** Filter by date range */
  dateRange?: DateRange;
}
```

---

## Hook Return Types

### useApi Hook

```typescript
interface UseApiReturn {
  /** Generic request method */
  request: <T>(endpoint: string, config?: RequestConfig) => Promise<T>;
  
  /** GET request */
  get: <T>(endpoint: string) => Promise<T>;
  
  /** POST request */
  post: <T>(endpoint: string, body: unknown) => Promise<T>;
  
  /** PUT request */
  post: <T>(endpoint: string, body: unknown) => Promise<T>;
  
  /** DELETE request */
  delete: <T>(endpoint: string) => Promise<T>;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error state */
  error: ApiError | null;
}
```

### useReconciliation Hook

```typescript
interface UseReconciliationReturn {
  /** List of reconciliation items */
  items: ReconciliationItem[];
  
  /** Summary data */
  summary: ReconciliationSummary | null;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error state */
  error: Error | null;
  
  /** Apply filters */
  setFilters: (filters: ReconciliationFilters) => void;
  
  /** Change page */
  setPage: (page: number) => void;
  
  /** Update classification */
  updateClassification: (id: string, classification: ClassificationType) => Promise<void>;
  
  /** Perform workflow action */
  performAction: (id: string, action: WorkflowAction, data?: ActionData) => Promise<void>;
  
  /** Refresh data */
  refresh: () => Promise<void>;
}
```

### useUpload Hook

```typescript
interface UseUploadReturn {
  /** Upload file */
  uploadFile: (file: File, uploadType: UploadType) => Promise<string>;
  
  /** Get upload status */
  getUploadStatus: (uploadId: string) => Promise<CSVUpload>;
  
  /** Upload history */
  history: CSVUpload[];
  
  /** Current upload */
  currentUpload: CSVUpload | null;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error state */
  error: Error | null;
  
  /** Upload progress (0-100) */
  progress: number;
}
```

---

## Type Safety Rules

1. **No `any` types**: All types must be explicitly defined
2. **Use enums for fixed values**: Status, classification, workflow states
3. **Nullable vs optional**: Use `| null` for values that can be null, `?` for optional properties
4. **Readonly where applicable**: Mark types as `readonly` when they shouldn't be mutated
5. **Generic API responses**: Use `ApiResponse<T>` pattern for all API calls
6. **Discriminated unions**: Use for response types (success/error)
