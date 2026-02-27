# API Contracts: Bank Reconciliation Dashboard

**Date**: 2026-02-25  
**Feature**: 001-reconciliation-dashboard  
**Purpose**: Define API endpoints and request/response contracts for dashboard functionality

---

## Overview

This document defines the REST API contracts for the Bank Reconciliation Dashboard. All endpoints follow RESTful conventions and return JSON responses.

**Base URL**: `/api` (frontend API routes)  
**Authentication**: JWT Bearer token (required for all endpoints)  
**Content Type**: `application/json`

---

## Endpoints

### GET /api/dashboard/stats

Retrieves dashboard statistics including pending, approved, rejected counts and reconciliation rate.

**Authentication**: Required  
**Rate Limit**: 100 requests per minute

#### Request

```http
GET /api/dashboard/stats HTTP/1.1
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type   | Required | Default | Description                           |
|-----------|--------|----------|---------|---------------------------------------|
| period    | string | No       | current | Period for stats: `current` \| `last` |
| month     | string | No       | current | Month in YYYY-MM format               |

#### Response

**Status**: `200 OK`

```json
{
  "success": true,
  "data": {
    "totalPending": {
      "id": "total-pending",
      "title": "Total Pending",
      "value": 45,
      "trend": {
        "percentage": 12.5,
        "direction": "up",
        "comparisonLabel": "vs last period"
      },
      "progressValue": 35,
      "progressColor": "indigo",
      "label": "Requires review"
    },
    "totalApproved": {
      "id": "total-approved",
      "title": "Total Approved",
      "value": 1250,
      "trend": {
        "percentage": 8.2,
        "direction": "up",
        "comparisonLabel": "vs last period"
      },
      "progressValue": 95,
      "progressColor": "indigo",
      "label": "This month"
    },
    "totalRejected": {
      "id": "total-rejected",
      "title": "Total Rejected",
      "value": 23,
      "trend": {
        "percentage": 3.1,
        "direction": "down",
        "comparisonLabel": "vs last period"
      },
      "progressValue": 15,
      "progressColor": "red",
      "label": "Needs attention"
    },
    "reconciliationRate": {
      "id": "reconciliation-rate",
      "title": "Reconciliation Rate",
      "value": "96.5%",
      "trend": {
        "percentage": 0.5,
        "direction": "neutral",
        "comparisonLabel": "vs last period"
      },
      "progressValue": 96.5,
      "progressColor": "indigo",
      "label": "Target: 98%"
    },
    "lastUpdated": "2026-02-25T10:30:00Z"
  }
}
```

#### Error Responses

**Status**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Invalid or missing authentication token"
}
```

**Status**: `500 Internal Server Error`
```json
{
  "success": false,
  "error": "Failed to retrieve dashboard statistics"
}
```

---

### GET /api/transactions/recent

Retrieves recent transactions with optional filtering and sorting.

**Authentication**: Required  
**Rate Limit**: 200 requests per minute

#### Request

```http
GET /api/transactions/recent?status=all&sort=date-desc&limit=50 HTTP/1.1
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type   | Required | Default     | Description                                      |
|-----------|--------|----------|-------------|--------------------------------------------------|
| status    | string | No       | all         | Filter by status: `all` \| `pending` \| `approved` \| `rejected` |
| sort      | string | No       | date-desc   | Sort order: `date-asc` \| `date-desc` \| `amount-asc` \| `amount-desc` |
| limit     | number | No       | 50          | Number of transactions to return (max 100)       |
| offset    | number | No       | 0           | Pagination offset                                |
| search    | string | No       | -           | Search query for description/counterparty        |

#### Response

**Status**: `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "txn-001",
      "date": "2026-02-24",
      "description": "Wire transfer from ABC Corporation",
      "transactionType": "Wire Transfer",
      "counterparty": "ABC Corporation",
      "reference": "WT-2026-001",
      "amount": 15000.00,
      "status": "pending",
      "createdAt": "2026-02-24T09:15:00Z"
    },
    {
      "id": "txn-002",
      "date": "2026-02-23",
      "description": "ACH payment received from XYZ Ltd",
      "transactionType": "ACH Payment",
      "counterparty": "XYZ Ltd",
      "reference": "ACH-2026-002",
      "amount": 8500.50,
      "status": "approved",
      "createdAt": "2026-02-23T14:30:00Z"
    },
    {
      "id": "txn-003",
      "date": "2026-02-22",
      "description": "Check deposit - John Doe",
      "transactionType": "Check Deposit",
      "counterparty": "John Doe",
      "reference": "CHK-2026-003",
      "amount": 2300.00,
      "status": "rejected",
      "createdAt": "2026-02-22T11:45:00Z"
    }
  ],
  "total": 1250,
  "filters": {
    "status": "all",
    "sort": "date-desc",
    "search": ""
  }
}
```

#### Error Responses

**Status**: `400 Bad Request`
```json
{
  "success": false,
  "error": "Invalid query parameter: status must be one of 'all', 'pending', 'approved', 'rejected'"
}
```

**Status**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Invalid or missing authentication token"
}
```

---

### GET /api/transactions/export

Exports transactions as CSV file.

**Authentication**: Required  
**Rate Limit**: 10 requests per minute

#### Request

```http
GET /api/transactions/export?format=csv&status=all&sort=date-desc HTTP/1.1
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type   | Required | Default | Description                                      |
|-----------|--------|----------|---------|--------------------------------------------------|
| format    | string | No       | csv     | Export format: `csv` (only CSV supported)        |
| status    | string | No       | all     | Filter by status: `all` \| `pending` \| `approved` \| `rejected` |
| sort      | string | No       | date-desc | Sort order: `date-asc` \| `date-desc` \| `amount-asc` \| `amount-desc` |
| fromDate  | string | No       | -       | Start date in YYYY-MM-DD format                  |
| toDate    | string | No       | -       | End date in YYYY-MM-DD format                    |

#### Response

**Status**: `200 OK`

**Content-Type**: `text/csv`  
**Content-Disposition**: `attachment; filename="transactions-2026-02-25.csv"`

```csv
DATE,DESCRIPTION,COUNTERPARTY,REFERENCE,AMOUNT,STATUS
2026-02-24,"Wire transfer from ABC Corporation",ABC Corporation,WT-2026-001,$15000.00,Pending
2026-02-23,"ACH payment received from XYZ Ltd",XYZ Ltd,ACH-2026-002,$8500.50,Approved
2026-02-22,"Check deposit - John Doe",John Doe,CHK-2026-003,$2300.00,Rejected
```

#### Error Responses

**Status**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Invalid or missing authentication token"
}
```

**Status**: `500 Internal Server Error`
```json
{
  "success": false,
  "error": "Failed to generate export file"
}
```

---

### POST /api/dashboard/alerts/dismiss

Dismisses an alert banner (user preference stored server-side).

**Authentication**: Required  
**Rate Limit**: 20 requests per minute

#### Request

```http
POST /api/dashboard/alerts/dismiss HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "alertType": "pending-reconciliation",
  "dismissedAt": "2026-02-25T10:30:00Z"
}
```

#### Request Body

| Field       | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| alertType   | string | Yes      | Type of alert: `pending-reconciliation` |
| dismissedAt | string | Yes      | ISO 8601 timestamp of dismissal    |

#### Response

**Status**: `200 OK`

```json
{
  "success": true,
  "message": "Alert dismissed successfully"
}
```

#### Error Responses

**Status**: `400 Bad Request`
```json
{
  "success": false,
  "error": "Invalid request body: missing required field 'alertType'"
}
```

**Status**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Invalid or missing authentication token"
}
```

---

## Data Models

### Transaction

```typescript
interface Transaction {
  id: string              // UUID
  date: string            // ISO 8601 date (YYYY-MM-DD)
  description: string     // Transaction description
  transactionType: string // Type: "Wire Transfer", "ACH Payment", etc.
  counterparty: string    // Person or organization name
  reference: string       // Reference number
  amount: number          // Amount in USD
  status: string          // "pending" | "approved" | "rejected"
  createdAt?: string      // ISO 8601 timestamp
}
```

### StatCard

```typescript
interface StatCard {
  id: string            // Unique identifier
  title: string         // Card title
  value: number | string // Display value
  trend: TrendIndicator // Trend information
  progressValue: number // 0-100 for progress bar
  progressColor?: string // "indigo" | "red" | "green"
  label: string         // Descriptive label
}
```

### TrendIndicator

```typescript
interface TrendIndicator {
  percentage: number         // Percentage change (e.g., 12.5)
  direction: string          // "up" | "down" | "neutral"
  comparisonLabel: string    // e.g., "vs last period"
}
```

### DashboardStats

```typescript
interface DashboardStats {
  totalPending: StatCard
  totalApproved: StatCard
  totalRejected: StatCard
  reconciliationRate: StatCard
  lastUpdated: string  // ISO 8601 timestamp
}
```

---

## Error Handling

### Standard Error Response Format

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code                    | HTTP Status | Description                          |
|-------------------------|-------------|--------------------------------------|
| `UNAUTHORIZED`          | 401         | Missing or invalid JWT token         |
| `INVALID_REQUEST`       | 400         | Malformed request or invalid params  |
| `NOT_FOUND`             | 404         | Resource not found                   |
| `RATE_LIMIT_EXCEEDED`   | 429         | Too many requests                    |
| `INTERNAL_ERROR`        | 500         | Server-side error                    |
| `DATA_UNAVAILABLE`      | 503         | Backend data source unavailable      |

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

| Endpoint                    | Limit              |
|-----------------------------|--------------------|
| GET /api/dashboard/stats    | 100 requests/min   |
| GET /api/transactions/recent| 200 requests/min   |
| GET /api/transactions/export| 10 requests/min    |
| POST /api/dashboard/alerts  | 20 requests/min    |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645789200
```

---

## Backend Integration Notes

### Database Queries

The dashboard stats endpoint should aggregate data from:

1. **ReconciliationSession** - Current session state
2. **BankTransaction** - Uploaded bank transactions
3. **InternalTransaction** - Oracle financial system records
4. **ReconciliationResult** - Matching outcomes

### Performance Considerations

1. **Caching**: Dashboard stats should be cached for 5 minutes to reduce database load
2. **Pagination**: Transaction list supports pagination with offset/limit
3. **Indexing**: Ensure indexes on `status`, `transaction_date`, and `reconciliation_session_id`
4. **Query Optimization**: Use materialized views for complex aggregations if needed

### Data Freshness

- Stats: Cached for 5 minutes, invalidated on new transaction upload
- Transactions: Real-time from database
- Export: Generated on-demand from current data

---

## Testing Guidelines

### Unit Tests

```typescript
// Test GET /api/dashboard/stats
describe('GET /api/dashboard/stats', () => {
  it('should return dashboard statistics with valid auth', async () => {
    const response = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', 'Bearer valid-token')
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty('totalPending')
    expect(response.body.data).toHaveProperty('totalApproved')
    expect(response.body.data).toHaveProperty('totalRejected')
    expect(response.body.data).toHaveProperty('reconciliationRate')
  })
  
  it('should return 401 without auth token', async () => {
    const response = await request(app)
      .get('/api/dashboard/stats')
    
    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })
})
```

### Integration Tests

```typescript
// Test transaction filtering
describe('GET /api/transactions/recent', () => {
  it('should filter transactions by status', async () => {
    const response = await request(app)
      .get('/api/transactions/recent?status=pending')
      .set('Authorization', 'Bearer valid-token')
    
    expect(response.status).toBe(200)
    expect(response.body.data.every(tx => tx.status === 'pending')).toBe(true)
  })
  
  it('should sort transactions by date descending', async () => {
    const response = await request(app)
      .get('/api/transactions/recent?sort=date-desc')
      .set('Authorization', 'Bearer valid-token')
    
    const dates = response.body.data.map(tx => new Date(tx.date))
    expect(dates).toEqual(dates.sort((a, b) => b.getTime() - a.getTime()))
  })
})
```

---

## Version History

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| 1.0.0   | 2026-02-25 | Initial API contract definition  |
