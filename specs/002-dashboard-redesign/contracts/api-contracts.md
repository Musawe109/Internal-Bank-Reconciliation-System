# API Contracts: Dashboard Redesign

**Feature**: 002-dashboard-redesign  
**Date**: 2026-02-24  
**Purpose**: Define API contracts for dashboard data fetching

---

## Base URL

```
/api/reconciliation
```

---

## Endpoints

### GET /stats

Retrieve reconciliation statistics for dashboard cards.

**Request**:
```http
GET /api/reconciliation/stats
Authorization: Bearer <token>
```

**Response** (200 OK):
```typescript
{
  "pendingCount": 45,
  "approvedCount": 1250,
  "rejectedCount": 23,
  "totalCount": 1318,
  "pendingAmount": 125000.50,
  "approvedAmount": 3450000.00,
  "rejectedAmount": 15000.00,
  "reconciliationRate": 96.5,
  "trend": "up",
  "trendPercentage": 2.3
}
```

**Error Responses**:
```typescript
// 401 Unauthorized
{
  "status": 401,
  "message": "Authentication required",
  "code": "UNAUTHORIZED"
}

// 500 Internal Server Error
{
  "status": 500,
  "message": "Failed to fetch statistics",
  "code": "SERVER_ERROR"
}
```

---

### GET /transactions

Retrieve list of reconciliation transactions with filtering, sorting, and pagination.

**Request**:
```http
GET /api/reconciliation/transactions?page=1&pageSize=20&status=pending&sort=date&order=desc
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `pageSize` | integer | No | 20 | Items per page (max 100) |
| `status` | string[] | No | - | Filter by status (comma-separated) |
| `dateFrom` | string | No | - | Filter from date (ISO 8601) |
| `dateTo` | string | No | - | Filter to date (ISO 8601) |
| `amountMin` | number | No | - | Minimum amount filter |
| `amountMax` | number | No | - | Maximum amount filter |
| `category` | string | No | - | Filter by category |
| `search` | string | No | - | Search term for description |
| `sort` | string | No | date | Sort field |
| `order` | string | No | desc | Sort order (asc/desc) |

**Response** (200 OK):
```typescript
{
  "transactions": [
    {
      "id": "txn_abc123",
      "description": "Wire transfer from ABC Corp",
      "amount": 15000.00,
      "date": "2026-02-24",
      "status": "pending",
      "counterparty": "ABC Corporation",
      "category": "wire_transfer",
      "reference": "WT-2026-001",
      "createdAt": "2026-02-24T10:30:00Z",
      "updatedAt": "2026-02-24T10:30:00Z"
    }
    // ... more transactions
  ],
  "total": 45,
  "page": 1,
  "pageSize": 20,
  "totalPages": 3
}
```

**Error Responses**:
```typescript
// 400 Bad Request - Invalid parameters
{
  "status": 400,
  "message": "Invalid query parameters",
  "code": "VALIDATION_ERROR",
  "details": {
    "dateFrom": ["Must be a valid ISO 8601 date"],
    "page": ["Must be a positive integer"]
  }
}

// 401 Unauthorized
{
  "status": 401,
  "message": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

---

### PATCH /transactions/:id

Update transaction status (approve or reject).

**Request**:
```http
PATCH /api/reconciliation/transactions/txn_abc123
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"
}
```

**Request Body**:
```typescript
{
  "status": "approved" | "rejected",  // Required
  "rejectionReason": string           // Required if status is "rejected"
}
```

**Response** (200 OK):
```typescript
{
  "id": "txn_abc123",
  "description": "Wire transfer from ABC Corp",
  "amount": 15000.00,
  "date": "2026-02-24",
  "status": "approved",
  "counterparty": "ABC Corporation",
  "category": "wire_transfer",
  "reference": "WT-2026-001",
  "createdAt": "2026-02-24T10:30:00Z",
  "updatedAt": "2026-02-24T14:22:00Z",
  "reviewedBy": "user_xyz",
  "reviewedAt": "2026-02-24T14:22:00Z"
}
```

**Error Responses**:
```typescript
// 400 Bad Request - Validation failed
{
  "status": 400,
  "message": "Rejection reason is required",
  "code": "VALIDATION_ERROR",
  "details": {
    "rejectionReason": ["This field is required when status is 'rejected'"]
  }
}

// 404 Not Found
{
  "status": 404,
  "message": "Transaction not found",
  "code": "NOT_FOUND"
}

// 409 Conflict - Already processed
{
  "status": 409,
  "message": "Transaction has already been approved",
  "code": "CONFLICT"
}

// 401 Unauthorized
{
  "status": 401,
  "message": "Authentication required",
  "code": "UNAUTHORIZED"
}

// 403 Forbidden - Insufficient permissions
{
  "status": 403,
  "message": "You do not have permission to approve transactions",
  "code": "FORBIDDEN"
}
```

---

### GET /transactions/:id

Retrieve a single transaction by ID.

**Request**:
```http
GET /api/reconciliation/transactions/txn_abc123
Authorization: Bearer <token>
```

**Response** (200 OK):
```typescript
{
  "id": "txn_abc123",
  "description": "Wire transfer from ABC Corp",
  "amount": 15000.00,
  "date": "2026-02-24",
  "status": "pending",
  "counterparty": "ABC Corporation",
  "category": "wire_transfer",
  "reference": "WT-2026-001",
  "createdAt": "2026-02-24T10:30:00Z",
  "updatedAt": "2026-02-24T10:30:00Z"
}
```

**Error Responses**:
```typescript
// 404 Not Found
{
  "status": 404,
  "message": "Transaction not found",
  "code": "NOT_FOUND"
}
```

---

### GET /alerts

Retrieve active dashboard alerts/notifications.

**Request**:
```http
GET /api/reconciliation/alerts
Authorization: Bearer <token>
```

**Response** (200 OK):
```typescript
{
  "alerts": [
    {
      "id": "alert_001",
      "priority": "high",
      "message": "45 transactions pending reconciliation - action required",
      "actionLabel": "Review Now",
      "dismissed": false,
      "createdAt": "2026-02-24T08:00:00Z"
    }
  ]
}
```

**Error Responses**:
```typescript
// 401 Unauthorized
{
  "status": 401,
  "message": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

---

### POST /alerts/:id/dismiss

Dismiss an alert.

**Request**:
```http
POST /api/reconciliation/alerts/alert_001/dismiss
Authorization: Bearer <token>
```

**Response** (204 No Content):
```
(no body)
```

**Error Responses**:
```typescript
// 404 Not Found
{
  "status": 404,
  "message": "Alert not found",
  "code": "NOT_FOUND"
}
```

---

## Rate Limiting

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| GET /stats | 100 requests | 1 minute |
| GET /transactions | 200 requests | 1 minute |
| PATCH /transactions/:id | 50 requests | 1 minute |
| GET /alerts | 100 requests | 1 minute |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645700400
```

**429 Too Many Requests Response**:
```typescript
{
  "status": 429,
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 30
}
```

---

## Authentication

All endpoints require Bearer token authentication.

**Header**:
```http
Authorization: Bearer <jwt_token>
```

**Token Acquisition**:
- Obtain token from authentication service
- Token must include `reconciliation:read` scope for GET endpoints
- Token must include `reconciliation:write` scope for PATCH endpoints

---

## CORS

**Allowed Origins**:
- `https://app.yourdomain.com` (production)
- `http://localhost:3000` (development)

**Allowed Methods**:
- GET, PATCH, POST, OPTIONS

**Allowed Headers**:
- Authorization, Content-Type, X-Request-ID

**Credentials**:
- Allowed (for cookie-based session if needed)

---

## Versioning

API version is included in the path:
```
/api/v1/reconciliation/...
```

Current version: `v1`

**Backward Compatibility**:
- Breaking changes require new major version
- Deprecation notices provided 3 months in advance
- Old versions supported for 6 months after deprecation

---

## Error Handling

### Standard Error Response Format

```typescript
interface ErrorResponse {
  status: number        // HTTP status code
  message: string       // Human-readable message
  code: string          // Machine-readable error code
  details?: object      // Field-specific validation errors
  requestId?: string    // Request ID for debugging
  timestamp?: string    // ISO 8601 timestamp
}
```

### Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Request validation failed |
| CONFLICT | 409 | Resource conflict (e.g., already processed) |
| SERVER_ERROR | 500 | Internal server error |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

---

## OpenAPI Specification

For complete API documentation, see the OpenAPI spec at:
```
/api/docs/openapi.json
```

Or view interactive documentation at:
```
/api/docs
```

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-24
