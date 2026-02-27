# API Contracts: Reconciliation Service

**Version**: 1.0.0
**Generated**: 2026-02-25
**Feature**: 001-frontend-architecture

---

## Overview

This document defines the API contracts for the Internal Bank Reconciliation System frontend. All API calls must reference these contracts. No hardcoded endpoints in components.

**Base URL**: `NEXT_PUBLIC_API_BASE_URL` (environment variable)

---

## Authentication

All endpoints require authentication via Bearer token in Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Dashboard Summary

**GET** `/api/dashboard/summary`

Retrieves reconciliation summary counts for dashboard cards.

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    total: number;
    matched: number;
    unmatched: number;
    pending: number;
    flagged: number;
    resolved: number;
    totalVariance: number;
    lastUpdated: string; // ISO 8601
  };
}
```

**Error Responses**:
- 401 Unauthorized: Invalid or missing authentication token
- 500 Internal Server Error: Server error

---

### 2. Reconciliation Items List

**GET** `/api/reconciliation/items`

Retrieves paginated list of reconciliation items with optional filters.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| pageSize | number | No | Items per page (default: 50, max: 100) |
| status | string | No | Filter by status: matched, unmatched, pending, flagged, resolved |
| classification | string | No | Filter by classification type |
| dateFrom | string | No | Filter by date from (ISO 8601) |
| dateTo | string | No | Filter by date to (ISO 8601) |
| amountFrom | number | No | Filter by amount from |
| amountTo | number | No | Filter by amount to |
| sortBy | string | No | Sort field: date, amount, status, classification |
| sortOrder | string | No | Sort order: asc, desc (default: desc) |
| search | string | No | Search query for text search |

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    items: ReconciliationItem[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
```

**ReconciliationItem Type**:
```typescript
interface ReconciliationItem {
  id: string;
  transactionDate: string; // ISO 8601
  amount: number;
  currency: string; // ISO 4217
  description: string;
  status: WorkflowState; // matched, unmatched, pending, flagged, resolved
  classification: ClassificationType | null; // Timing Difference, Missing Transaction, etc.
  bankTransactionId: string;
  internalTransactionId: string;
  variance: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  updatedBy: string; // User ID
}
```

---

### 3. Reconciliation Item Detail

**GET** `/api/reconciliation/items/:id`

Retrieves detailed information for a specific reconciliation item.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Reconciliation item ID |

**Response** (200 OK):
```typescript
{
  success: true;
  data: ReconciliationItemDetail;
}
```

**ReconciliationItemDetail Type**:
```typescript
interface ReconciliationItemDetail extends ReconciliationItem {
  bankTransaction: BankTransaction;
  internalTransaction: InternalTransaction;
  auditTrail: AuditEvent[];
  attachments: Attachment[];
}

interface BankTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  reference: string;
  accountNumber: string;
}

interface InternalTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  reference: string;
  accountCode: string;
  category: string;
}
```

---

### 4. Update Classification

**PUT** `/api/reconciliation/items/:id/classification`

Updates the classification of a reconciliation item.

**Request Body**:
```typescript
{
  classification: ClassificationType; // Timing Difference, Missing Transaction, Bank Error, System Error, Manual Override
  reason?: string; // Optional reason for classification
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: ReconciliationItem;
}
```

**Error Responses**:
- 400 Bad Request: Invalid classification type
- 404 Not Found: Item not found
- 409 Conflict: Item was modified concurrently

---

### 5. Workflow Actions

**POST** `/api/reconciliation/items/:id/actions`

Performs a workflow action on a reconciliation item.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Reconciliation item ID |

**Request Body**:
```typescript
{
  action: WorkflowAction; // markResolved, flagForReview, applyOverride, revert
  reason?: string; // Required for applyOverride
  overrideCode?: string; // Required for applyOverride
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: ReconciliationItem;
}
```

**Error Responses**:
- 400 Bad Request: Invalid action or missing required fields
- 403 Forbidden: Action not allowed in current state
- 404 Not Found: Item not found

---

### 6. CSV Upload

**POST** `/api/uploads/csv`

Uploads a CSV file for reconciliation processing.

**Request Body**: `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| file | File | CSV file (max 50MB) |
| uploadType | string | Upload type: bank_statement, internal_transactions |

**Response** (202 Accepted):
```typescript
{
  success: true;
  data: {
    uploadId: string;
    status: UploadStatus; // processing, completed, failed
    recordCount: number | null;
    estimatedCompletionTime: string | null; // ISO 8601
  };
}
```

**Error Responses**:
- 400 Bad Request: Invalid file format or missing required fields
- 413 Payload Too Large: File exceeds 50MB limit
- 422 Unprocessable Entity: CSV validation failed

---

### 7. Upload Status

**GET** `/api/uploads/:uploadId/status`

Retrieves the status of a CSV upload processing.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| uploadId | string | Upload ID |

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    uploadId: string;
    status: UploadStatus;
    recordCount: number | null;
    processedCount: number;
    errorCount: number;
    errorMessage: string | null;
    completedAt: string | null; // ISO 8601
  };
}
```

---

### 8. Upload History

**GET** `/api/uploads/history`

Retrieves history of CSV uploads.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| pageSize | number | No | Items per page (default: 20) |
| status | string | No | Filter by status: processing, completed, failed |
| dateFrom | string | No | Filter by date from (ISO 8601) |
| dateTo | string | No | Filter by date to (ISO 8601) |

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    uploads: UploadRecord[];
    pagination: PaginationInfo;
  };
}
```

**UploadRecord Type**:
```typescript
interface UploadRecord {
  uploadId: string;
  filename: string;
  uploadType: string;
  uploadedAt: string; // ISO 8601
  uploadedBy: string; // User ID
  status: UploadStatus;
  recordCount: number | null;
  processedCount: number;
  errorCount: number;
}
```

---

### 9. Audit Log

**GET** `/api/audit/events`

Retrieves audit log events.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| pageSize | number | No | Items per page (default: 50) |
| eventType | string | No | Filter by event type: upload, classification, workflow_action, override |
| userId | string | No | Filter by user ID |
| itemId | string | No | Filter by reconciliation item ID |
| dateFrom | string | No | Filter by date from (ISO 8601) |
| dateTo | string | No | Filter by date to (ISO 8601) |

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    events: AuditEvent[];
    pagination: PaginationInfo;
  };
}
```

**AuditEvent Type**:
```typescript
interface AuditEvent {
  id: string;
  timestamp: string; // ISO 8601
  eventType: AuditEventType;
  userId: string;
  userName: string;
  itemId: string | null;
  description: string;
  metadata: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    reason?: string;
    overrideCode?: string;
  };
  ipAddress: string;
  userAgent: string;
}
```

---

### 10. Audit Event Detail

**GET** `/api/audit/events/:id`

Retrieves detailed information for a specific audit event.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Audit event ID |

**Response** (200 OK):
```typescript
{
  success: true;
  data: AuditEventDetail;
}
```

**AuditEventDetail Type**:
```typescript
interface AuditEventDetail extends AuditEvent {
  fullMetadata: Record<string, unknown>;
  relatedEvents: AuditEvent[];
}
```

---

## Enumerations

### WorkflowState

```typescript
enum WorkflowState {
  MATCHED = 'matched',
  UNMATCHED = 'unmatched',
  PENDING = 'pending',
  FLAGGED = 'flagged',
  RESOLVED = 'resolved',
}
```

### ClassificationType

```typescript
enum ClassificationType {
  TIMING_DIFFERENCE = 'Timing Difference',
  MISSING_TRANSACTION = 'Missing Transaction',
  BANK_ERROR = 'Bank Error',
  SYSTEM_ERROR = 'System Error',
  MANUAL_OVERRIDE = 'Manual Override',
}
```

### UploadStatus

```typescript
enum UploadStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
```

### WorkflowAction

```typescript
enum WorkflowAction {
  MARK_RESOLVED = 'markResolved',
  FLAG_FOR_REVIEW = 'flagForReview',
  APPLY_OVERRIDE = 'applyOverride',
  REVERT = 'revert',
}
```

### AuditEventType

```typescript
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

## Error Response Format

All error responses follow this format:

```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>; // Validation errors
  };
}
```

**Standard Error Codes**:
| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Request validation failed |
| CONFLICT | 409 | Resource conflict (concurrent modification) |
| SERVER_ERROR | 500 | Internal server error |
| TIMEOUT | 504 | Request timeout |

---

## Rate Limiting

API endpoints are rate-limited:
- Standard endpoints: 100 requests per minute per user
- Upload endpoints: 10 requests per minute per user

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Versioning

API version is included in the URL path: `/api/v1/...`
Current version: v1 (implicit, no prefix needed for v1)

Breaking changes will require version bump to v2.
