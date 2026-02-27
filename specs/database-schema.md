# Frontend Data Contracts

**Feature Branch**: `001-frontend-ui-contracts`  
**Created**: 2026-02-19  
**Status**: Draft  
**Parent Spec**: [001-frontend-ui-contracts/spec.md](./001-frontend-ui-contracts/spec.md)

## Purpose

Define TypeScript interfaces for all API responses consumed by the frontend application. All API responses MUST be strictly typed with no usage of `any`.

## Core Types

### ReconciliationSummary

High-level summary of a reconciliation session.

```typescript
interface ReconciliationSummary {
  id: string;
  createdAt: string;           // ISO 8601 date-time
  updatedAt: string;           // ISO 8601 date-time
  bankFileName: string;
  totalBankTransactions: number;
  totalInternalRecords: number;
  workflowState: WorkflowState;
  classificationCounts: ClassificationCounts;
  createdBy: string;           // User ID
  updatedBy?: string;          // User ID (optional if never updated)
}

interface ClassificationCounts {
  matched: number;
  unmatchedBankOnly: number;
  unmatchedInternalOnly: number;
  varianceDetected: number;
}
```

### TransactionRecord

Individual transaction from bank CSV or internal system.

```typescript
interface TransactionRecord {
  id: string;
  amount: number;
  reference: string;
  date: string;                // ISO 8601 date (YYYY-MM-DD)
  classification: Classification;
  varianceAmount?: number;     // Present only when classification is Variance Detected
  bankTransaction?: BankTransactionDetails;
  internalRecord?: InternalRecordDetails;
  matchedPairId?: string;      // ID linking matched bank + internal records
  overrides?: ManualOverride[];
}

interface BankTransactionDetails {
  id: string;
  amount: number;
  reference: string;
  date: string;
  description: string;
  transactionType?: string;
}

interface InternalRecordDetails {
  id: string;
  amount: number;
  reference: string;
  date: string;
  description: string;
  accountCode?: string;
  costCenter?: string;
}

interface ManualOverride {
  id: string;
  previousClassification: Classification;
  newClassification: Classification;
  reason: string;
  overriddenBy: string;        // User ID
  overriddenAt: string;        // ISO 8601 date-time
}
```

### AuditLogEntry

Immutable record of an action performed in the system.

```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string;           // ISO 8601 date-time
  actionType: AuditActionType;
  entityType: AuditEntityType;
  entityId: string;
  userId: string;
  userName: string;
  details: AuditActionDetails;
  ipAddress?: string;
  userAgent?: string;
}

type AuditActionType =
  | 'RECONCILIATION_CREATED'
  | 'CSV_UPLOADED'
  | 'RECONCILIATION_STARTED'
  | 'RECONCILIATION_COMPLETED'
  | 'CLASSIFICATION_OVERRIDDEN'
  | 'WORKFLOW_STATE_CHANGED'
  | 'RECORD_APPROVED'
  | 'RECORD_REJECTED'
  | 'AUDIT_LOG_VIEWED';

type AuditEntityType =
  | 'RECONCILIATION'
  | 'TRANSACTION'
  | 'BATCH_UPLOAD'
  | 'WORKFLOW';

interface AuditActionDetails {
  [key: string]: string | number | boolean | null;
  // Specific fields depend on action type
  // Example for CLASSIFICATION_OVERRIDDEN:
  // - previousValue: Classification
  // - newValue: Classification
  // - reason: string
}
```

### WorkflowState

Current stage of a reconciliation record in the approval lifecycle.

```typescript
enum WorkflowState {
  Draft = 'DRAFT',
  Processing = 'PROCESSING',
  PendingApproval = 'PENDING_APPROVAL',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
}
```

**State Transition Rules**:

| From State | Valid Transitions | Invalid Transitions |
|------------|-------------------|---------------------|
| **Draft** | Processing, Rejected | PendingApproval, Approved |
| **Processing** | PendingApproval, Rejected | Draft, Approved |
| **PendingApproval** | Approved, Rejected, Draft | Processing |
| **Approved** | (none - terminal state) | All transitions |
| **Rejected** | Draft (resubmit) | Processing, PendingApproval, Approved |

### Classification

Reconciliation classification categories (from Constitution Principle II).

```typescript
enum Classification {
  Matched = 'MATCHED',
  UnmatchedBankOnly = 'UNMATCHED_BANK_ONLY',
  UnmatchedInternalOnly = 'UNMATCHED_INTERNAL_ONLY',
  VarianceDetected = 'VARIANCE_DETECTED',
}
```

## API Response Types

### Upload Endpoints

```typescript
interface UploadCsvResponse {
  reconciliationId: string;
  fileName: string;
  uploadedAt: string;
  transactionCount: number;
  status: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED';
  errors?: UploadError[];
}

interface UploadError {
  rowNumber: number;
  errorMessage: string;
  fieldValue?: string;
}
```

### Reconciliation Endpoints

```typescript
interface GetReconciliationResponse {
  summary: ReconciliationSummary;
  transactions: TransactionRecord[];
  pagination: PaginationInfo;
}

interface GetReconciliationByIdRequest {
  id: string;
}

interface UpdateClassificationRequest {
  transactionId: string;
  newClassification: Classification;
  reason: string;
}

interface UpdateClassificationResponse {
  transaction: TransactionRecord;
  auditLogId: string;
}
```

### Workflow Endpoints

```typescript
interface SubmitForApprovalRequest {
  reconciliationId: string;
}

interface SubmitForApprovalResponse {
  reconciliationId: string;
  previousState: WorkflowState;
  newState: WorkflowState;
  submittedAt: string;
  submittedBy: string;
}

interface ApproveReconciliationRequest {
  reconciliationId: string;
  approverComments?: string;
}

interface ApproveReconciliationResponse {
  reconciliationId: string;
  previousState: WorkflowState;
  newState: WorkflowState;
  approvedAt: string;
  approvedBy: string;
}

interface RejectReconciliationRequest {
  reconciliationId: string;
  rejectionReason: string;
}

interface RejectReconciliationResponse {
  reconciliationId: string;
  previousState: WorkflowState;
  newState: WorkflowState;
  rejectedAt: string;
  rejectedBy: string;
}
```

### Audit Log Endpoints

```typescript
interface GetAuditLogRequest {
  entityId?: string;         // Filter by entity (reconciliation ID, transaction ID)
  entityType?: AuditEntityType;
  actionType?: AuditActionType;
  userId?: string;
  startDate?: string;        // ISO 8601 date
  endDate?: string;          // ISO 8601 date
  pagination?: PaginationParams;
}

interface GetAuditLogResponse {
  entries: AuditLogEntry[];
  pagination: PaginationInfo;
}
```

### Pagination Types

```typescript
interface PaginationParams {
  page: number;              // 1-indexed
  pageSize: number;          // 25, 50, 100, 250
  sortBy?: string;           // Column name
  sortOrder?: 'ASC' | 'DESC';
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### Error Response Types

```typescript
interface ErrorResponse {
  errorCode: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
  path: string;
}

interface ValidationErrorResponse extends ErrorResponse {
  validationErrors: FieldValidationError[];
}

interface FieldValidationError {
  field: string;
  message: string;
  value?: string;
}
```

## Type Safety Rules

### No Usage of `any`

All types MUST be explicitly defined. The `any` type is PROHIBITED.

**Valid**:
```typescript
interface Example {
  data: unknown;             // When type is truly unknown
  metadata: Record<string, string>;
}
```

**Invalid**:
```typescript
interface Example {
  data: any;                 // PROHIBITED
}
```

### Strict Enum Usage

All enums MUST be used with their full qualified name. String literals matching enum values are PROHIBITED in business logic.

**Valid**:
```typescript
if (transaction.classification === Classification.Matched) {
  // Handle matched transaction
}
```

**Invalid**:
```typescript
if (transaction.classification === 'MATCHED') {  // PROHIBITED
  // Handle matched transaction
}
```

### Nullable vs Optional

- Use `?` (optional) when a field may be absent from the response
- Use `| null` when a field is always present but may be null
- Use `undefined` only for function return types, not in data models

## Acceptance Criteria

- [x] **All API Responses Typed**: Every API endpoint has corresponding request/response types defined
- [x] **No Usage of "any"**: All types are explicitly defined; `unknown` used only when type is genuinely unknown
- [x] **Strict Enum Usage**: Enums defined for `WorkflowState` and `Classification`; string literals prohibited in business logic
- [x] **TypeScript Strict Mode Compatible**: All types conform to TypeScript strict mode requirements
- [x] **Immutable Audit Logs**: `AuditLogEntry` type enforces immutability (no update/delete methods)

## Related Documents

- [Reconciliation Rendering Spec](./reconciliation-engine.md) - UI classification display
- [Feature Specification](./001-frontend-ui-contracts/spec.md) - User stories and requirements
- [Constitution](../../.specify/memory/constitution.md) - Principle II (Financial Data Integrity), Principle IV (Security-by-Design)
