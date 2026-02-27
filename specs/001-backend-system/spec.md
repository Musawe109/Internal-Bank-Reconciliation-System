# Feature Specification: Backend System for Internal Bank Reconciliation

**Feature Branch**: `001-backend-system`
**Created**: 2026-02-19
**Status**: Draft
**Input**: Backend system specification for IBRS with frontend integration

## User Scenarios & Testing

### User Story 1 - Upload Bank Statement and View Reconciliation Results (Priority: P1)

**Why this priority**: This is the core MVP functionality - users must be able to upload a bank CSV file and see reconciliation results. Without this, the system provides no value.

**Independent Test**: Can be fully tested by uploading a valid CSV file and verifying the reconciliation summary displays with correct classification counts.

**Acceptance Scenarios**:

1. **Given** a user has a valid bank CSV file, **When** they upload it through the system, **Then** the file is validated, parsed, and reconciliation results are displayed within 30 seconds for 1,000 transactions
2. **Given** a user uploads an invalid file format, **When** the system validates it, **Then** a clear error message is shown and no data is processed
3. **Given** a reconciliation session is created, **When** the user views the dashboard, **Then** they see transaction counts categorized by classification (Matched, Unmatched Bank Only, Unmatched Internal Only, Variance Detected)

---

### User Story 2 - Filter and Search Reconciliation Results (Priority: P2)

**Why this priority**: Users need to efficiently find specific transactions and focus on exceptions (unmatched/variance) that require attention.

**Independent Test**: Can be tested by applying classification filters and search queries, verifying only matching transactions are displayed.

**Acceptance Scenarios**:

1. **Given** reconciliation results are displayed, **When** a user selects a classification filter, **Then** only transactions with that classification are shown
2. **Given** a large dataset exists, **When** a user searches by reference number, **Then** matching results appear within 1 second
3. **Given** filtered results are displayed, **When** the user clears filters, **Then** all transactions are shown again

---

### User Story 3 - Override Transaction Classification with Reason (Priority: P3)

**Why this priority**: Users need to correct automated classification errors and document their reasoning for audit purposes.

**Independent Test**: Can be tested by changing a transaction's classification, entering a reason, and verifying the change is reflected immediately.

**Acceptance Scenarios**:

1. **Given** a transaction is displayed, **When** a user overrides its classification with a valid reason (10+ characters), **Then** the classification updates and the action is logged
2. **Given** a user attempts to override without a sufficient reason, **When** they submit with less than 10 characters, **Then** the system rejects the submission with a clear error message
3. **Given** a transaction has been overridden, **When** viewing its details, **Then** the override history is visible

---

### User Story 4 - Submit Reconciliation for Approval (Priority: P4)

**Why this priority**: Reconciliation must go through an approval workflow before being finalized, ensuring proper oversight.

**Independent Test**: Can be tested by submitting a reconciliation and verifying the workflow state changes and UI reflects the locked state.

**Acceptance Scenarios**:

1. **Given** a reconciliation is in Draft state, **When** a user submits it for approval, **Then** the state changes to Pending Approval and editing is locked
2. **Given** a reconciliation is Pending Approval, **When** an approver approves it, **Then** the state changes to Approved and the record is permanently locked
3. **Given** a reconciliation is Pending Approval, **When** an approver rejects it with a reason, **Then** the state changes to Rejected and editing is re-enabled

---

### User Story 5 - View Audit Log of All Actions (Priority: P5)

**Why this priority**: Regulatory compliance requires a complete, immutable audit trail of all system actions.

**Independent Test**: Can be tested by performing actions and verifying they appear in the audit log with correct details.

**Acceptance Scenarios**:

1. **Given** actions have been performed in the system, **When** a user views the audit log, **Then** all actions are displayed in reverse chronological order
2. **Given** the audit log is displayed, **When** a user filters by date range or action type, **Then** only matching entries are shown
3. **Given** an audit entry exists, **When** viewing it, **Then** the entry shows timestamp, user, action type, entity affected, and details

---

### Edge Cases

- What happens when a CSV file exceeds 100,000 transactions? System processes it within 60 seconds or shows progress indication
- How does the system handle duplicate reference numbers in the bank CSV? Each row is treated as a separate transaction with unique internal ID
- What happens when Oracle database is unavailable during reconciliation? System returns clear error message and does not create partial reconciliation session
- How does the system handle CSV files with missing required columns? File is rejected with specific error indicating which columns are missing
- What happens when two users attempt to modify the same reconciliation simultaneously? Last write wins with optimistic locking warning
- How does the system handle timezone differences in transaction dates? All dates are normalized to UTC for storage and matching

## Requirements

### Functional Requirements

- **FR-001**: System MUST accept CSV file uploads containing bank transaction data
- **FR-002**: System MUST validate CSV file format and required columns before processing
- **FR-003**: System MUST fetch internal transaction records from Oracle database (read-only)
- **FR-004**: System MUST match bank transactions with internal records based on amount, reference number, and date tolerance (configurable, default ±2 days)
- **FR-005**: System MUST classify each transaction as: Matched, Unmatched Bank Only, Unmatched Internal Only, or Variance Detected
- **FR-006**: System MUST store reconciliation results in PostgreSQL database with full audit trail
- **FR-007**: System MUST enforce workflow state transitions: Draft → Processing → Pending Approval → Approved/Rejected
- **FR-008**: System MUST allow manual classification override with mandatory reason (minimum 10 characters)
- **FR-009**: System MUST log every user action to immutable audit log with timestamp, user ID, action type, entity ID, and details
- **FR-010**: System MUST provide paginated API endpoints for reconciliation results (support 100k+ records)
- **FR-011**: System MUST filter transactions by classification, date range, and reference number search
- **FR-012**: System MUST sort transactions by amount, date, or reference in ascending or descending order
- **FR-013**: System MUST lock reconciliation records in Approved state (no modifications allowed)
- **FR-014**: System MUST reject reconciliation with mandatory reason when approver rejects
- **FR-015**: System MUST return API responses matching frontend TypeScript interface contracts exactly
- **FR-016**: System MUST validate all input data using schema validation
- **FR-017**: System MUST return structured error responses with error code, message, and details
- **FR-018**: System MUST configure CORS to allow only the frontend domain
- **FR-019**: System MUST index database tables on reference, amount, date, classification, and reconciliation session ID
- **FR-020**: System MUST process 100,000 transactions within 30 seconds

### Key Entities

- **Reconciliation Session**: Represents a single bank CSV upload and its reconciliation results. Contains file metadata, transaction counts, workflow state, and timestamps. Has many bank transactions and internal transactions.
- **Bank Transaction**: A transaction from the uploaded bank CSV file. Contains amount, reference, date, description, and classification result.
- **Internal Transaction**: A transaction from the Oracle financial system. Contains amount, reference, date, description, account code, and cost center.
- **Reconciliation Result**: The outcome of matching a bank transaction with internal transactions. Contains classification, variance amount (if applicable), and links to matched records.
- **Workflow State**: Tracks the current approval state of a reconciliation session. Transitions are logged in audit trail.
- **Audit Log Entry**: Immutable record of a user action. Contains timestamp, user ID, action type, entity type, entity ID, and action-specific details.
- **Manual Override**: Records when a user manually changes a transaction classification. Contains previous classification, new classification, reason, user ID, and timestamp.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can upload a CSV file with 1,000 transactions and view reconciliation results within 30 seconds
- **SC-002**: System processes 100,000 transactions end-to-end (upload, matching, storage) within 60 seconds
- **SC-003**: 95% of CSV uploads succeed on first attempt when file format is valid
- **SC-004**: Users can filter and search results, with filter changes reflecting within 1 second
- **SC-005**: 90% of manual override attempts complete successfully with clear validation feedback
- **SC-006**: Workflow state transitions are visible in the UI within 2 seconds of submission
- **SC-007**: Audit log displays all actions in correct chronological order with complete details
- **SC-008**: System handles 100 concurrent users without performance degradation (response time < 2 seconds)
- **SC-009**: All API responses match frontend TypeScript interface contracts with zero type mismatches
- **SC-010**: Database queries on 100k records complete within 500ms with proper indexing
