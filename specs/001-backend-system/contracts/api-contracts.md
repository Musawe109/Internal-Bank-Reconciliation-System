# API Contracts: Internal Bank Reconciliation System

**Version**: 1.0.0
**OpenAPI**: 3.0.3
**Base URL**: `/api`

These contracts define the API endpoints for the IBRS backend. All responses match frontend TypeScript interfaces exactly.

---

## Common Types

### Classification (Enum)

```yaml
Classification:
  type: string
  enum:
    - MATCHED
    - UNMATCHED_BANK_ONLY
    - UNMATCHED_INTERNAL_ONLY
    - VARIANCE_DETECTED
```

### WorkflowState (Enum)

```yaml
WorkflowState:
  type: string
  enum:
    - DRAFT
    - PROCESSING
    - PENDING_APPROVAL
    - APPROVED
    - REJECTED
```

### PaginationInfo

```yaml
PaginationInfo:
  type: object
  properties:
    currentPage:
      type: integer
      minimum: 1
    pageSize:
      type: integer
      minimum: 1
      maximum: 250
    totalItems:
      type: integer
      minimum: 0
    totalPages:
      type: integer
      minimum: 0
    hasNextPage:
      type: boolean
    hasPreviousPage:
      type: boolean
```

### ErrorResponse

```yaml
ErrorResponse:
  type: object
  properties:
    errorCode:
      type: string
    message:
      type: string
    details:
      type: object
      additionalProperties:
        type: string
    timestamp:
      type: string
      format: date-time
    path:
      type: string
```

---

## Endpoints

### 1. Reconciliation

#### POST /api/reconciliation

Upload a bank CSV file for reconciliation.

**Request**:
```yaml
contentType: multipart/form-data
body:
  type: object
  properties:
    file:
      type: string
      format: binary
  required:
    - file
```

**Response (200 OK)**:
```yaml
UploadCsvResponse:
  type: object
  properties:
    reconciliationId:
      type: string
      format: uuid
    fileName:
      type: string
    uploadedAt:
      type: string
      format: date-time
    transactionCount:
      type: integer
    status:
      type: string
      enum:
        - SUCCESS
        - PARTIAL_SUCCESS
        - FAILED
    errors:
      type: array
      items:
        $ref: '#/components/schemas/UploadError'
```

**UploadError**:
```yaml
UploadError:
  type: object
  properties:
    rowNumber:
      type: integer
      minimum: 1
    errorMessage:
      type: string
    fieldValue:
      type: string
```

---

#### GET /api/reconciliation

List reconciliation sessions with pagination.

**Request**:
```yaml
queryParameters:
  page:
    type: integer
    default: 1
    minimum: 1
  pageSize:
    type: integer
    default: 25
    minimum: 1
    maximum: 250
  sortBy:
    type: string
    enum:
      - createdAt
      - updatedAt
      - bankFileName
  sortOrder:
    type: string
    enum:
      - ASC
      - DESC
```

**Response (200 OK)**:
```yaml
GetReconciliationListResponse:
  type: object
  properties:
    reconciliations:
      type: array
      items:
        $ref: '#/components/schemas/ReconciliationSummary'
    pagination:
      $ref: '#/components/schemas/PaginationInfo'
```

---

#### GET /api/reconciliation/{id}

Get reconciliation details by ID.

**Request**:
```yaml
pathParameters:
  id:
    type: string
    format: uuid
```

**Response (200 OK)**:
```yaml
GetReconciliationResponse:
  type: object
  properties:
    summary:
      $ref: '#/components/schemas/ReconciliationSummary'
    transactions:
      type: array
      items:
        $ref: '#/components/schemas/TransactionRecord'
    pagination:
      $ref: '#/components/schemas/PaginationInfo'
```

---

### 2. Transactions

#### GET /api/reconciliation/{id}/transactions

Get transactions for a reconciliation with pagination and filters.

**Request**:
```yaml
pathParameters:
  id:
    type: string
    format: uuid
queryParameters:
  page:
    type: integer
    default: 1
  pageSize:
    type: integer
    default: 25
  classification:
    type: string
    enum:
      - MATCHED
      - UNMATCHED_BANK_ONLY
      - UNMATCHED_INTERNAL_ONLY
      - VARIANCE_DETECTED
  sortBy:
    type: string
    enum:
      - amount
      - date
      - reference
  sortOrder:
    type: string
    enum:
      - ASC
      - DESC
  searchReference:
    type: string
```

**Response (200 OK)**:
```yaml
GetTransactionsResponse:
  type: object
  properties:
    transactions:
      type: array
      items:
        $ref: '#/components/schemas/TransactionRecord'
    pagination:
      $ref: '#/components/schemas/PaginationInfo'
```

---

#### PUT /api/transactions/{transactionId}/classification

Update transaction classification (manual override).

**Request**:
```yaml
pathParameters:
  transactionId:
    type: string
    format: uuid
body:
  type: object
  properties:
    newClassification:
      $ref: '#/components/schemas/Classification'
    reason:
      type: string
      minLength: 10
  required:
    - newClassification
    - reason
```

**Response (200 OK)**:
```yaml
UpdateClassificationResponse:
  type: object
  properties:
    transaction:
      $ref: '#/components/schemas/TransactionRecord'
    auditLogId:
      type: string
      format: uuid
```

---

### 3. Workflow

#### POST /api/reconciliation/{id}/submit

Submit reconciliation for approval.

**Request**:
```yaml
pathParameters:
  id:
    type: string
    format: uuid
```

**Response (200 OK)**:
```yaml
SubmitForApprovalResponse:
  type: object
  properties:
    reconciliationId:
      type: string
      format: uuid
    previousState:
      $ref: '#/components/schemas/WorkflowState'
    newState:
      $ref: '#/components/schemas/WorkflowState'
    submittedAt:
      type: string
      format: date-time
    submittedBy:
      type: string
      format: uuid
```

---

#### POST /api/reconciliation/{id}/approve

Approve reconciliation.

**Request**:
```yaml
pathParameters:
  id:
    type: string
    format: uuid
body:
  type: object
  properties:
    approverComments:
      type: string
      maxLength: 1000
```

**Response (200 OK)**:
```yaml
ApproveReconciliationResponse:
  type: object
  properties:
    reconciliationId:
      type: string
      format: uuid
    previousState:
      $ref: '#/components/schemas/WorkflowState'
    newState:
      $ref: '#/components/schemas/WorkflowState'
    approvedAt:
      type: string
      format: date-time
    approvedBy:
      type: string
      format: uuid
```

---

#### POST /api/reconciliation/{id}/reject

Reject reconciliation.

**Request**:
```yaml
pathParameters:
  id:
    type: string
    format: uuid
body:
  type: object
  properties:
    rejectionReason:
      type: string
      minLength: 10
  required:
    - rejectionReason
```

**Response (200 OK)**:
```yaml
RejectReconciliationResponse:
  type: object
  properties:
    reconciliationId:
      type: string
      format: uuid
    previousState:
      $ref: '#/components/schemas/WorkflowState'
    newState:
      $ref: '#/components/schemas/WorkflowState'
    rejectedAt:
      type: string
      format: date-time
    rejectedBy:
      type: string
      format: uuid
```

---

### 4. Audit Log

#### GET /api/audit-log

Get audit log entries with pagination and filters.

**Request**:
```yaml
queryParameters:
  page:
    type: integer
    default: 1
  pageSize:
    type: integer
    default: 25
  entityId:
    type: string
    format: uuid
  entityType:
    type: string
    enum:
      - RECONCILIATION
      - TRANSACTION
      - BATCH_UPLOAD
      - WORKFLOW
  actionType:
    type: string
    enum:
      - RECONCILIATION_CREATED
      - CSV_UPLOADED
      - RECONCILIATION_STARTED
      - RECONCILIATION_COMPLETED
      - CLASSIFICATION_OVERRIDDEN
      - WORKFLOW_STATE_CHANGED
      - RECORD_APPROVED
      - RECORD_REJECTED
      - AUDIT_LOG_VIEWED
  userId:
    type: string
    format: uuid
  startDate:
    type: string
    format: date
  endDate:
    type: string
    format: date
  sortBy:
    type: string
    enum:
      - timestamp
      - actionType
      - entityType
  sortOrder:
    type: string
    enum:
      - ASC
      - DESC
```

**Response (200 OK)**:
```yaml
GetAuditLogResponse:
  type: object
  properties:
    entries:
      type: array
      items:
        $ref: '#/components/schemas/AuditLogEntry'
    pagination:
      $ref: '#/components/schemas/PaginationInfo'
```

---

## Data Schemas

### ReconciliationSummary

```yaml
ReconciliationSummary:
  type: object
  properties:
    id:
      type: string
      format: uuid
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
    bankFileName:
      type: string
    totalBankTransactions:
      type: integer
    totalInternalRecords:
      type: integer
    workflowState:
      $ref: '#/components/schemas/WorkflowState'
    classificationCounts:
      $ref: '#/components/schemas/ClassificationCounts'
    createdBy:
      type: string
      format: uuid
    updatedBy:
      type: string
      format: uuid
      nullable: true
```

### ClassificationCounts

```yaml
ClassificationCounts:
  type: object
  properties:
    matched:
      type: integer
    unmatchedBankOnly:
      type: integer
    unmatchedInternalOnly:
      type: integer
    varianceDetected:
      type: integer
```

### TransactionRecord

```yaml
TransactionRecord:
  type: object
  properties:
    id:
      type: string
      format: uuid
    amount:
      type: number
      format: float
    reference:
      type: string
    date:
      type: string
      format: date
    classification:
      $ref: '#/components/schemas/Classification'
    varianceAmount:
      type: number
      format: float
      nullable: true
    bankTransaction:
      $ref: '#/components/schemas/BankTransactionDetails'
      nullable: true
    internalRecord:
      $ref: '#/components/schemas/InternalRecordDetails'
      nullable: true
    matchedPairId:
      type: string
      format: uuid
      nullable: true
    overrides:
      type: array
      items:
        $ref: '#/components/schemas/ManualOverride'
      nullable: true
```

### BankTransactionDetails

```yaml
BankTransactionDetails:
  type: object
  properties:
    id:
      type: string
      format: uuid
    amount:
      type: number
      format: float
    reference:
      type: string
    date:
      type: string
      format: date
    description:
      type: string
    transactionType:
      type: string
      nullable: true
```

### InternalRecordDetails

```yaml
InternalRecordDetails:
  type: object
  properties:
    id:
      type: string
      format: uuid
    amount:
      type: number
      format: float
    reference:
      type: string
    date:
      type: string
      format: date
    description:
      type: string
    accountCode:
      type: string
      nullable: true
    costCenter:
      type: string
      nullable: true
```

### ManualOverride

```yaml
ManualOverride:
  type: object
  properties:
    id:
      type: string
      format: uuid
    previousClassification:
      $ref: '#/components/schemas/Classification'
    newClassification:
      $ref: '#/components/schemas/Classification'
    reason:
      type: string
    overriddenBy:
      type: string
      format: uuid
    overriddenAt:
      type: string
      format: date-time
```

### AuditLogEntry

```yaml
AuditLogEntry:
  type: object
  properties:
    id:
      type: string
      format: uuid
    timestamp:
      type: string
      format: date-time
    actionType:
      $ref: '#/components/schemas/AuditActionType'
    entityType:
      $ref: '#/components/schemas/AuditEntityType'
    entityId:
      type: string
      format: uuid
    userId:
      type: string
      format: uuid
    userName:
      type: string
    details:
      type: object
      additionalProperties:
        type: string
    ipAddress:
      type: string
      nullable: true
    userAgent:
      type: string
      nullable: true
```

---

## Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `FILE_NOT_FOUND` | 400 | Uploaded file not found |
| `INVALID_FILE_FORMAT` | 400 | CSV file format invalid |
| `MISSING_COLUMNS` | 400 | Required CSV columns missing |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_TRANSITION` | 400 | Workflow state transition invalid |
| `ALREADY_APPROVED` | 409 | Reconciliation already approved |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `ORACLE_UNAVAILABLE` | 503 | Oracle database unavailable |
| `INTERNAL_ERROR` | 500 | Unexpected internal error |
