# Tasks: Backend System for Internal Bank Reconciliation

**Input**: Design documents from `/specs/001-backend-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and NOT included in this task breakdown. Add test tasks separately if TDD approach is requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend application**: `backend/` at repository root
- **Source code**: `backend/app/`, `backend/app/api/`, `backend/app/core/`, `backend/app/db/`, `backend/app/models/`, `backend/app/schemas/`, `backend/app/services/`
- **Tests**: `backend/tests/`
- **Migrations**: `backend/alembic/versions/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure per plan.md:
  - `backend/app/`
  - `backend/app/api/`
  - `backend/app/api/routes/`
  - `backend/app/core/`
  - `backend/app/db/`
  - `backend/app/models/`
  - `backend/app/schemas/`
  - `backend/app/services/`
  - `backend/alembic/`
  - `backend/tests/unit/`
  - `backend/tests/integration/`
  - `backend/tests/contract/`

- [X] T002 Initialize Python project with dependencies in `backend/requirements.txt`:
  - FastAPI, Uvicorn, SQLModel, SQLAlchemy, Pydantic
  - cx_Oracle, psycopg2-binary
  - Alembic, python-dotenv
  - Passlib[bcrypt], python-jose[cryptography] (JWT-ready)

- [X] T003 [P] Configure environment settings in `backend/app/config.py`:
  - Pydantic BaseSettings class
  - DATABASE_URL, ORACLE_DSN, ORACLE_USER, ORACLE_PASSWORD
  - SECRET_KEY, FRONTEND_URL, CORS_ORIGINS

- [X] T004 [P] Create FastAPI application entry in `backend/app/main.py`:
  - Initialize FastAPI app with metadata
  - Include routers
  - Setup exception handlers

- [X] T005 [P] Configure CORS middleware in `backend/app/main.py`:
  - Add CORSMiddleware with FRONTEND_URL
  - Allow credentials and methods

- [X] T006 [P] Create environment configuration files:
  - `backend/.env.example` with all required variables
  - `backend/.gitignore` with .env, __pycache__, .pytest_cache

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Setup PostgreSQL connection in `backend/app/db/postgres.py`:
  - SQLAlchemy engine with connection pooling
  - SessionLocal factory
  - get_db dependency for routes

- [X] T008 [P] Setup Oracle read-only connection in `backend/app/db/oracle.py`:
  - cx_Oracle SessionPool
  - Read-only user credentials
  - fetch_internal_transactions function

- [X] T009 [P] Create SQLModel base in `backend/app/db/base.py`:
  - Base class with metadata
  - Import all models for Alembic

- [X] T010 [P] Define database enums in `backend/app/models/enums.py`:
  - WorkflowState enum (DRAFT, PROCESSING, PENDING_APPROVAL, APPROVED, REJECTED)
  - Classification enum (MATCHED, UNMATCHED_BANK_ONLY, UNMATCHED_INTERNAL_ONLY, VARIANCE_DETECTED)
  - AuditActionType enum
  - AuditEntityType enum

- [X] T011 [P] Create standardized response wrapper in `backend/app/core/responses.py`:
  - APIResponse generic class (success, data, error)
  - SuccessResponse, ErrorResponse helpers

- [X] T012 [P] Create custom exceptions in `backend/app/core/exceptions.py`:
  - ApiError base class
  - ValidationError, NotFoundError, InvalidTransitionError
  - OracleUnavailableError

- [X] T013 [P] Configure Alembic migrations in `backend/alembic/env.py`:
  - Target metadata from SQLModel
  - Database URL from config
  - Run migration context

- [X] T014 Create health check endpoint in `backend/app/api/routes/health.py`:
  - GET /health endpoint
  - Check PostgreSQL connection
  - Check Oracle connection
  - Return status

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Upload and Reconcile (Priority: P1) 🎯 MVP

**Goal**: Implement CSV upload, reconciliation engine, and results display

**Independent Test**: User can upload a valid CSV file, see reconciliation results with correct classification counts, and view transactions in dashboard.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create ReconciliationSession model in `backend/app/models/reconciliation.py`:
  - Fields: id, created_at, updated_at, bank_file_name, total_bank_transactions, workflow_state, classification counts
  - Relationships to BankTransaction, WorkflowStateEntry

- [ ] T016 [P] [US1] Create BankTransaction model in `backend/app/models/transaction.py`:
  - Fields: id, reconciliation_session_id, amount, reference, date, description, raw_data (JSON)
  - Indexes on amount, reference, date

- [ ] T017 [P] [US1] Create InternalTransaction model in `backend/app/models/transaction.py`:
  - Fields: id, amount, reference, date, description, account_code, cost_center, oracle_id
  - Indexes on amount, reference, date, oracle_id

- [ ] T018 [P] [US1] Create ReconciliationResult model in `backend/app/models/reconciliation.py`:
  - Fields: id, reconciliation_session_id, bank_transaction_id, internal_transaction_id, classification, variance_amount
  - Indexes on classification, session_id

- [ ] T019 [US1] Create Pydantic schemas in `backend/app/schemas/reconciliation.py`:
  - ReconciliationSessionCreate, ReconciliationSessionResponse
  - ClassificationCounts schema
  - Match frontend TypeScript interfaces exactly

- [ ] T020 [US1] Create Pydantic schemas in `backend/app/schemas/transaction.py`:
  - BankTransactionResponse, InternalTransactionResponse
  - TransactionRecord schema (matches frontend)
  - BankTransactionDetails, InternalRecordDetails

- [ ] T021 [US1] Create CSV upload endpoint in `backend/app/api/routes/reconciliation.py`:
  - POST /api/reconciliation
  - File upload with multipart/form-data
  - Server-side CSV validation (required columns, data types)
  - Return reconciliationId, fileName, transactionCount

- [ ] T022 [US1] Implement CSV parsing service in `backend/app/services/ingestion.py`:
  - parse_csv function with validation
  - normalize_bank_transaction function
  - Reject malformed data with clear errors

- [ ] T023 [US1] Fetch internal transactions in `backend/app/services/ingestion.py`:
  - fetch_internal_records function (Oracle read-only query)
  - Normalize Oracle records to InternalTransaction schema
  - Handle Oracle unavailable error

- [ ] T024 [US1] Create reconciliation engine service in `backend/app/services/reconciliation.py`:
  - match_transactions function with O(n log n) complexity
  - Hash-based grouping by amount
  - Reference + date tolerance matching (configurable, default ±2 days)
  - Classify: Matched, UnmatchedBankOnly, UnmatchedInternalOnly, VarianceDetected

- [ ] T025 [US1] Store reconciliation results in `backend/app/services/reconciliation.py`:
  - persist_results function
  - Create ReconciliationResult records
  - Update ReconciliationSession counts
  - Automatic workflow transition to PROCESSING

- [ ] T026 [US1] Create get reconciliation list endpoint in `backend/app/api/routes/reconciliation.py`:
  - GET /api/reconciliation
  - Pagination (page, pageSize, sortBy, sortOrder)
  - Return ReconciliationSummary array with pagination

- [ ] T027 [US1] Create get transactions endpoint in `backend/app/api/routes/transactions.py`:
  - GET /api/reconciliation/{id}/transactions
  - Pagination and filtering support
  - Return TransactionRecord array with pagination

- [ ] T028 [US1] Create Alembic migration for User Story 1 tables:
  - reconciliation_sessions, bank_transactions, internal_transactions, reconciliation_results
  - All indexes created

**Checkpoint**: At this point, User Story 1 should be fully functional - users can upload CSV and view reconciliation dashboard

---

## Phase 4: User Story 2 - Filter and Search Results (Priority: P2)

**Goal**: Add filtering, sorting, and search capabilities to reconciliation results

**Independent Test**: User can apply classification filters and search by reference, seeing only matching transactions.

### Implementation for User Story 2

- [ ] T029 [P] [US2] Add filtering to transactions endpoint in `backend/app/api/routes/transactions.py`:
  - classification query parameter (optional)
  - Filter ReconciliationResult query by classification
  - Return only matching transactions

- [ ] T030 [P] [US2] Add sorting to transactions endpoint in `backend/app/api/routes/transactions.py`:
  - sortBy parameter (amount, date, reference)
  - sortOrder parameter (ASC, DESC)
  - Apply ORDER BY dynamically

- [ ] T031 [US2] Add search by reference in `backend/app/api/routes/transactions.py`:
  - searchReference query parameter
  - Case-insensitive partial match (ILIKE)
  - Return matching transactions

- [ ] T032 [US2] Create filter response schema in `backend/app/schemas/transaction.py`:
  - Include classification counts in response
  - Frontend needs counts for filter badges

- [ ] T033 [US2] Optimize database queries in `backend/app/services/reconciliation.py`:
  - Ensure indexes are used (reference, amount, date, classification)
  - Add EXPLAIN ANALYZE verification
  - Target: 100k records query < 500ms

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - filtering, sorting, search functional

---

## Phase 5: User Story 3 - Manual Override (Priority: P3)

**Goal**: Implement manual classification override with mandatory reason logging

**Independent Test**: User can change a transaction's classification, enter a reason (10+ chars), and see the change reflected immediately.

### Implementation for User Story 3

- [ ] T034 [P] [US3] Create ManualOverride model in `backend/app/models/reconciliation.py`:
  - Fields: id, reconciliation_result_id, previous_classification, new_classification, reason, overridden_at, overridden_by
  - Foreign key to ReconciliationResult
  - Index on reconciliation_result_id, overridden_at

- [ ] T035 [P] [US3] Create ManualOverride schema in `backend/app/schemas/reconciliation.py`:
  - ManualOverrideRequest (newClassification, reason)
  - ManualOverrideResponse (includes all fields)
  - Validate reason minimum 10 characters

- [ ] T036 [US3] Create manual override endpoint in `backend/app/api/routes/transactions.py`:
  - PUT /api/transactions/{transactionId}/classification
  - Request: newClassification, reason (min 10 chars)
  - Update ReconciliationResult classification
  - Create ManualOverride record
  - Return updated TransactionRecord

- [ ] T037 [US3] Implement override service in `backend/app/services/reconciliation.py`:
  - override_classification function
  - Validate reason length
  - Store previous classification
  - Log to audit (call audit service)

- [ ] T038 [US3] Add override history to transaction response in `backend/app/schemas/transaction.py`:
  - Include overrides array in TransactionRecord
  - Lazy loading for performance

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - manual override with reason logging functional

---

## Phase 6: User Story 4 - Workflow Status (Priority: P4)

**Goal**: Implement workflow state visualization and approval controls

**Independent Test**: User can submit reconciliation for approval, approver can approve/reject, state changes reflected in UI.

### Implementation for User Story 4

- [ ] T039 [P] [US4] Create WorkflowStateEntry model in `backend/app/models/workflow.py`:
  - Fields: id, reconciliation_session_id, state, previous_state, transitioned_at, transitioned_by, reason
  - Foreign key to ReconciliationSession
  - Index on session_id, state, transitioned_at

- [ ] T040 [P] [US4] Create workflow transition validator in `backend/app/services/workflow.py`:
  - VALID_TRANSITIONS dictionary
  - validate_transition function (current_state, action) → new_state
  - Raise InvalidTransitionError on invalid transitions

- [ ] T041 [US4] Create submit for approval endpoint in `backend/app/api/routes/workflow.py`:
  - POST /api/reconciliation/{id}/submit
  - Transition: Draft → Processing
  - Lock reconciliation (no more edits)
  - Return SubmitForApprovalResponse

- [ ] T042 [US4] Create approve endpoint in `backend/app/api/routes/workflow.py`:
  - POST /api/reconciliation/{id}/approve
  - Transition: PendingApproval → Approved
  - Optional approver comments
  - Return ApproveReconciliationResponse

- [ ] T043 [US4] Create reject endpoint in `backend/app/api/routes/workflow.py`:
  - POST /api/reconciliation/{id}/reject
  - Transition: PendingApproval → Rejected
  - Mandatory rejection reason (min 10 chars)
  - Return RejectReconciliationResponse

- [ ] T044 [US4] Implement workflow service in `backend/app/services/workflow.py`:
  - submit_for_approval function
  - approve_reconciliation function
  - reject_reconciliation function
  - Create WorkflowStateEntry on each transition
  - Log to audit service

- [ ] T045 [US4] Enforce locking rules in `backend/app/services/reconciliation.py`:
  - Check workflow state before allowing edits
  - Raise error if state is Approved or Processing
  - Allow edits in Draft and Rejected states

- [ ] T046 [US4] Update ReconciliationSession workflow_state on transition:
  - Update current state field
  - Maintain history in WorkflowStateEntry table

**Checkpoint**: At this point, User Stories 1-4 should all work independently - workflow state rendering and controls functional

---

## Phase 7: User Story 5 - Audit Log Viewer (Priority: P5)

**Goal**: Implement immutable audit log viewer with filtering and pagination

**Independent Test**: User can view chronological audit log with filters; log is read-only with no edit/delete options.

### Implementation for User Story 5

- [ ] T047 [P] [US5] Create AuditLogEntry model in `backend/app/models/audit.py`:
  - Fields: id, timestamp, action_type, entity_type, entity_id, user_id, user_name, previous_state, new_state, details, ip_address, user_agent
  - All fields indexed appropriately
  - JSON columns for state/details

- [ ] T048 [P] [US5] Create AuditLogEntry schema in `backend/app/schemas/audit.py`:
  - AuditLogEntryResponse (matches frontend interface)
  - AuditActionDetails schema
  - GetAuditLogResponse with pagination

- [ ] T049 [US5] Create audit logging service in `backend/app/services/audit.py`:
  - log_action function (append-only)
  - No update or delete methods
  - Called by all other services on state changes

- [ ] T050 [US5] Create audit retrieval endpoint in `backend/app/api/routes/audit.py`:
  - GET /api/audit-log
  - Pagination (page, pageSize)
  - Filters: entityId, entityType, actionType, userId, startDate, endDate
  - Sorting: timestamp DESC by default
  - Return GetAuditLogResponse

- [ ] T051 [US5] Integrate audit logging in all services:
  - reconciliation.py: log CSV upload, reconciliation complete, override
  - workflow.py: log all state transitions
  - ingestion.py: log file upload
  - Pass user_id, action_type, entity details

- [ ] T052 [US5] Create Alembic migration for audit_logs table:
  - All fields with correct types
  - Indexes on timestamp, entity_type, entity_id, action_type, user_id
  - DB-level constraints: REVOKE UPDATE, DELETE permissions

**Checkpoint**: At this point, all 5 user stories should be independently functional - audit log viewer complete

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final hardening

- [ ] T053 [P] Create all Pydantic schemas matching frontend TypeScript interfaces:
  - Verify all schemas in schemas/ directory
  - Ensure no `Any` types remain
  - Field names match camelCase exactly

- [ ] T054 [P] Standardize HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request (validation errors)
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 409: Conflict (already approved)
  - 500: Internal Server Error
  - 503: Service Unavailable (Oracle down)

- [ ] T055 [P] Add global exception handler in `backend/app/core/exceptions.py`:
  - Catch all exceptions
  - Return standardized ErrorResponse
  - No stack traces in production

- [ ] T056 [P] Validate enum alignment with frontend:
  - Classification enum values match TypeScript exactly
  - WorkflowState enum values match TypeScript exactly
  - No renaming or translation

- [ ] T057 [P] Remove debug prints and logging:
  - Remove all print() statements
  - Configure proper logging with levels
  - No sensitive data in logs

- [ ] T058 [P] Create Dockerfile in `backend/Dockerfile`:
  - Multi-stage build (builder, runtime)
  - Python 3.11 slim base
  - Copy requirements, install, copy code
  - Expose port 8000

- [ ] T059 [P] Create docker-compose.yml in `backend/docker-compose.yml`:
  - Backend service
  - PostgreSQL service
  - Environment variables
  - Volume mounts for development

- [ ] T060 [P] Update quickstart.md with accurate run instructions:
  - Development setup steps
  - Docker deployment steps
  - API usage examples
  - Troubleshooting section

- [ ] T061 [P] Integration test with frontend:
  - Start backend and frontend
  - Test upload flow end-to-end
  - Test filtering and search
  - Test manual override
  - Test workflow transitions
  - Test audit log viewer
  - Verify no TypeScript contract errors

- [ ] T062 [P] Performance validation:
  - Upload 100k transactions
  - Measure reconciliation time (target: ≤30 seconds)
  - Measure query time (target: <500ms)
  - Profile and optimize if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Dependencies | Can Start After |
|-------|--------------|-----------------|
| **US1 (Upload & Reconcile)** | Foundational (Phase 2) | T028 complete |
| **US2 (Filter Results)** | US1 (transactions endpoint exists) | T027 complete |
| **US3 (Manual Override)** | US1 (results exist) | T028 complete |
| **US4 (Workflow Status)** | US1 (reconciliation exists) | T028 complete |
| **US5 (Audit Log)** | Foundational (models, services) | T014 complete |

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)** - All tasks can run in parallel:
- T002, T003, T004, T005, T006 can all run simultaneously (different files)

**Phase 2 (Foundational)** - Parallel opportunities:
- T007, T008, T009, T010, T011, T012, T013 can run in parallel (different files)
- T014 depends on T011, T012 (exceptions, responses ready)

**Phase 3 (US1)** - Parallel opportunities:
- T015, T016, T017, T018 (models) can run in parallel
- T019, T020 (schemas) can run in parallel after models
- T021, T022, T023, T024, T025 (services) can run in parallel after schemas
- T026, T027 (endpoints) can run in parallel after services

**Phase 4 (US2)** - Parallel opportunities:
- T029, T030, T031 (endpoint enhancements) can run in parallel
- T032 (schema) can run in parallel

**Phase 5 (US3)** - Parallel opportunities:
- T034 (model) and T035 (schema) can run in parallel
- T036, T037, T038 (endpoint, service, schema update) can run in parallel after model/schema

**Phase 6 (US4)** - Parallel opportunities:
- T039 (model), T040 (validator) can run in parallel
- T041, T042, T043 (endpoints) can run in parallel after validator
- T044, T045, T046 (service, locking, update) can run in parallel

**Phase 7 (US5)** - Parallel opportunities:
- T047 (model), T048 (schema) can run in parallel
- T049 (service), T050 (endpoint), T051 (integration), T052 (migration) can run in parallel

**Phase 8 (Polish)** - Parallel opportunities:
- T053, T054, T055, T056, T057, T058, T059, T060, T061, T062 can all run in parallel

---

## Parallel Execution Examples

### Example: Launch Foundational Phase in Parallel

```bash
# Task: Create PostgreSQL connection in backend/app/db/postgres.py
# Task: Create Oracle connection in backend/app/db/oracle.py
# Task: Create SQLModel base in backend/app/db/base.py
# Task: Define enums in backend/app/models/enums.py
# Task: Create response wrapper in backend/app/core/responses.py
# Task: Create exceptions in backend/app/core/exceptions.py
# Task: Configure Alembic in backend/alembic/env.py
```

### Example: Launch User Story 1 in Parallel

```bash
# Task: Create ReconciliationSession model in backend/app/models/reconciliation.py
# Task: Create BankTransaction model in backend/app/models/transaction.py
# Task: Create InternalTransaction model in backend/app/models/transaction.py
# Task: Create ReconciliationResult model in backend/app/models/reconciliation.py
# Task: Create Pydantic schemas in backend/app/schemas/reconciliation.py
# Task: Create Pydantic schemas in backend/app/schemas/transaction.py
```

### Example: Launch User Story 5 in Parallel (Full Story Parallelism)

```bash
# Task: Create AuditLogEntry model in backend/app/models/audit.py
# Task: Create AuditLogEntry schema in backend/app/schemas/audit.py
# Task: Create audit logging service in backend/app/services/audit.py
# Task: Create audit retrieval endpoint in backend/app/api/routes/audit.py
# Task: Create Alembic migration for audit_logs table
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Upload & Reconcile)
4. **STOP and VALIDATE**: Test upload flow end-to-end
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done, all user stories can start in parallel:
   - Developer A: User Story 1 (Upload & Reconcile)
   - Developer B: User Story 2 (Filter Results)
   - Developer C: User Story 3 (Manual Override)
   - Developer D: User Story 4 (Workflow Status)
   - Developer E: User Story 5 (Audit Log)
3. Stories complete and integrate independently
4. Team reconvenes for Phase 8 (Polish)

---

## Task Summary

| Phase | Description | Task Count | Story |
|-------|-------------|------------|-------|
| Phase 1 | Setup | 6 | N/A |
| Phase 2 | Foundational | 8 | N/A |
| Phase 3 | User Story 1 | 14 | US1 |
| Phase 4 | User Story 2 | 5 | US2 |
| Phase 5 | User Story 3 | 5 | US3 |
| Phase 6 | User Story 4 | 8 | US4 |
| Phase 7 | User Story 5 | 6 | US5 |
| Phase 8 | Polish | 10 | N/A |
| **Total** | | **62** | |

### MVP Scope (Minimum)

For MVP deployment, complete:
- Phase 1: Setup (6 tasks)
- Phase 2: Foundational (8 tasks)
- Phase 3: User Story 1 (14 tasks)

**MVP Total**: 28 tasks → Upload and basic reconciliation functional

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Verify enum alignment after each phase (Classification, WorkflowState)
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks follow checklist format: `- [ ] TaskID [P] [Story] Description with file path`
- API responses MUST match frontend TypeScript interfaces exactly (no drift)
- Standardized response format: `{ success: boolean, data?: object, error?: string }`
