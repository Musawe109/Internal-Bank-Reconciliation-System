# Tasks: Frontend Architecture (Phase 1 - UI + State + API Contracts)

**Input**: Design documents from `/specs/001-frontend-architecture/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this feature - focus on implementation first, add tests during polish phase or as requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/` for source code, `frontend/` for config files
- **Tests**: `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Initialize Next.js 14+ project with App Router in `frontend/` directory
- [x] T002 [P] Configure TypeScript strict mode in `frontend/tsconfig.json` per research.md
- [x] T003 [P] Install and configure Tailwind CSS 3.x in `frontend/tailwind.config.js`
- [x] T004 [P] Create base folder structure: `frontend/src/app/`, `frontend/src/components/`, `frontend/src/lib/`, `frontend/src/hooks/`
- [x] T005 [P] Install Jest and React Testing Library dependencies
- [x] T006 [P] Install Playwright for E2E testing
- [x] T007 Configure ESLint with TypeScript strict rules in `frontend/.eslintrc.json`
- [x] T008 Configure Prettier for consistent formatting in `frontend/.prettierrc`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 [P] Create centralized API client in `frontend/src/lib/api/client.ts` with fetch wrapper
- [x] T010 [P] Create API error handling utilities in `frontend/src/lib/api/errors.ts`
- [x] T011 [P] Create API endpoint definitions in `frontend/src/lib/api/endpoints.ts`
- [x] T012 [P] Create API types in `frontend/src/lib/api/types.ts`
- [x] T013 [P] Create enum: WorkflowState in `frontend/src/lib/enums/workflow-state.ts`
- [x] T014 [P] Create enum: ClassificationType in `frontend/src/lib/enums/classification.ts`
- [x] T015 [P] Create enum: UploadStatus in `frontend/src/lib/enums/upload-status.ts`
- [x] T016 [P] Create enum: AuditEventType in `frontend/src/lib/enums/audit-event-type.ts`
- [x] T017 [P] Create environment configuration in `frontend/src/lib/config/index.ts`
- [x] T018 Create `.env.local` and `.env.example` with `NEXT_PUBLIC_API_BASE_URL`
- [x] T019 [P] Create core TypeScript types in `frontend/src/lib/types/reconciliation.ts`
- [x] T020 [P] Create core TypeScript types in `frontend/src/lib/types/upload.ts`
- [x] T021 [P] Create core TypeScript types in `frontend/src/lib/types/audit.ts`
- [x] T022 [P] Create custom useApi hook in `frontend/src/hooks/use-api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Reconciliation Dashboard Access and Overview (Priority: P1) 🎯 MVP

**Goal**: Build the main dashboard with navigation, summary cards, and route structure

**Independent Test**: Users can access the application, view the dashboard with reconciliation summaries, and navigate to different sections without errors

### Implementation for User Story 1

- [x] T023 [P] [US1] Create root layout with sidebar and header in `frontend/src/app/layout.tsx`
- [x] T024 [P] [US1] Create Sidebar navigation component in `frontend/src/components/dashboard/navigation/Sidebar.tsx`
- [x] T025 [P] [US1] Create Header component in `frontend/src/components/dashboard/navigation/Header.tsx`
- [x] T026 [US1] Create navigation links: `/dashboard`, `/upload`, `/reconciliation/[id]`, `/audit` in Sidebar component
- [x] T027 [P] [US1] Create ReconciliationSummary type in `frontend/src/lib/types/dashboard.ts`
- [x] T028 [P] [US1] Create SummaryCard component in `frontend/src/components/dashboard/summary-cards/SummaryCard.tsx`
- [x] T029 [P] [US1] Create SummaryCards container component in `frontend/src/components/dashboard/summary-cards/SummaryCards.tsx`
- [x] T030 [US1] Create dashboard page in `frontend/src/app/dashboard/page.tsx` with summary cards
- [x] T031 [US1] Create home page redirect to dashboard in `frontend/src/app/page.tsx`
- [ ] T032 [US1] Add loading states for dashboard data fetching
- [ ] T033 [US1] Add error boundaries for dashboard section
- [ ] T034 [US1] Implement responsive design for tablet/desktop in layout styles

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - CSV Upload and File Processing (Priority: P1)

**Goal**: Build CSV upload flow with drag-and-drop, validation, progress, and history

**Independent Test**: Users can upload CSV files, see validation feedback, and track processing status through the UI

### Implementation for User Story 2

- [x] T035 [P] [US2] Create CSVUpload type in `frontend/src/lib/types/upload.ts` (extend existing)
- [x] T036 [P] [US2] Create FileDrop component for drag-and-drop in `frontend/src/components/upload/file-drop/FileDrop.tsx`
- [x] T037 [P] [US2] Create UploadProgress component in `frontend/src/components/upload/progress/UploadProgress.tsx`
- [x] T038 [P] [US2] Create ValidationFeedback component in `frontend/src/components/upload/validation/ValidationFeedback.tsx`
- [x] T039 [US2] Create upload page in `frontend/src/app/upload/page.tsx`
- [x] T040 [US2] Implement file selection and type validation (CSV, max 50MB)
- [x] T041 [US2] Implement upload progress state with API client integration
- [x] T042 [US2] Add success confirmation UI with record count display
- [x] T043 [US2] Add error state UI for validation failures
- [x] T044 [P] [US2] Create UploadHistory component in `frontend/src/components/upload/history/UploadHistory.tsx`
- [x] T045 [US2] Implement upload history view with status indicators
- [ ] T046 [US2] Add loading spinners during upload processing
- [ ] T047 [US2] Implement retry logic for failed uploads

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Reconciliation Item Management with Classification (Priority: P1)

**Goal**: Build paginated reconciliation table with filtering, sorting, and classification

**Independent Test**: Users can view reconciliation items in a table, apply filters/sorting, classify items, and see status changes

### Implementation for User Story 3

- [x] T048 [P] [US3] Create StatusBadge component in `frontend/src/components/ui/status-badge/StatusBadge.tsx`
- [x] T049 [P] [US3] Create ClassificationBadge component in `frontend/src/components/ui/classification-badge/ClassificationBadge.tsx`
- [x] T050 [P] [US3] Create FilterControls component in `frontend/src/components/reconciliation/filters/FilterControls.tsx`
- [x] T051 [P] [US3] Create SortableHeader component in `frontend/src/components/ui/table/SortableHeader.tsx`
- [x] T052 [US3] Install TanStack Table v8 dependency
- [x] T053 [US3] Install @tanstack/react-virtual for virtualization
- [x] T054 [P] [US3] Create PaginatedTable component in `frontend/src/components/ui/table/PaginatedTable.tsx`
- [x] T055 [P] [US3] Create TablePagination component in `frontend/src/components/ui/table/TablePagination.tsx`
- [x] T056 [US3] Create reconciliation items page in `frontend/src/app/reconciliation/page.tsx`
- [x] T057 [US3] Implement server-side pagination (50 items per page default)
- [x] T058 [US3] Implement filters: status, classification, date range, amount
- [x] T059 [US3] Implement column sorting (date, amount, status, classification)
- [x] T060 [US3] Implement search functionality
- [x] T061 [P] [US3] Create ClassificationDropdown component in `frontend/src/components/reconciliation/classification/ClassificationDropdown.tsx`
- [ ] T062 [US3] Integrate classification update with API client
- [x] T063 [US3] Add empty state handling with helpful guidance
- [ ] T064 [US3] Implement virtualization for efficient re-renders (10k+ items)
- [x] T065 [US3] Add filter tags display for active filters

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 4 - Workflow State Transitions and Manual Overrides (Priority: P2)

**Goal**: Build workflow action buttons, confirmation dialogs, and manual override modal

**Independent Test**: Users can trigger workflow actions, see confirmation dialogs, and observe state changes with appropriate feedback

### Implementation for User Story 4

- [x] T066 [P] [US4] Create WorkflowAction enum in `frontend/src/lib/enums/workflow-action.ts`
- [x] T067 [P] [US4] Create ConfirmationDialog component in `frontend/src/components/ui/dialog/ConfirmationDialog.tsx`
- [x] T068 [P] [US4] Create ManualOverrideModal component in `frontend/src/components/reconciliation/override/ManualOverrideModal.tsx`
- [x] T069 [P] [US4] Create ActionButtons component in `frontend/src/components/reconciliation/actions/ActionButtons.tsx`
- [x] T070 [US4] Create reconciliation detail page in `frontend/src/app/reconciliation/[id]/page.tsx`
- [x] T071 [P] [US4] Create TransactionList component in `frontend/src/components/reconciliation/detail/TransactionList.tsx`
- [x] T072 [P] [US4] Create VarianceHighlight component in `frontend/src/components/reconciliation/detail/VarianceHighlight.tsx`
- [x] T073 [US4] Implement "Mark as Resolved" action with confirmation
- [x] T074 [US4] Implement "Flag for Review" action with visual indicator
- [x] T075 [US4] Implement manual override form with reason/code input
- [ ] T076 [US4] Integrate workflow actions with API client
- [x] T077 [US4] Add success toast notifications after actions
- [x] T078 [US4] Add loading states during workflow transitions
- [ ] T079 [US4] Implement table refresh after action completion
- [x] T080 [US4] Add error handling for concurrent modification conflicts

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Audit Log Viewer (Priority: P2)

**Goal**: Build audit log page with paginated table, filtering, and expandable details

**Independent Test**: Users can access audit logs, filter by event type/date/user, and view detailed event information

### Implementation for User Story 5

- [x] T081 [P] [US5] Create AuditTable component in `frontend/src/components/audit/table/AuditTable.tsx`
- [x] T082 [P] [US5] Create AuditFilters component in `frontend/src/components/audit/filters/AuditFilters.tsx`
- [x] T083 [P] [US5] Create AuditEventDetail component in `frontend/src/components/audit/detail/AuditEventDetail.tsx`
- [x] T084 [US5] Create audit log page in `frontend/src/app/audit/page.tsx`
- [x] T085 [US5] Implement chronological event list display
- [x] T086 [US5] Implement filters: event type, date range, user, item ID
- [x] T087 [US5] Implement pagination for audit events (50 per page)
- [x] T088 [US5] Add expandable rows for event details (before/after states)
- [x] T089 [US5] Render immutable audit entries (no edit/delete actions)
- [x] T090 [US5] Add read-only visual design styling
- [ ] T091 [US5] Integrate audit API with typed responses

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: User Story 6 - API Contract Hardening (Priority: P2)

**Goal**: Harden API integration with proper typing, remove mock data, validate all contracts

**Independent Test**: All API calls are strictly typed, no `any` types remain, enums used consistently

### Implementation for User Story 6

- [x] T092 [P] [US6] Create LoadingSpinner component in `frontend/src/components/ui/loading/LoadingSpinner.tsx`
- [x] T093 [P] [US6] Create LoadingState wrapper component in `frontend/src/components/ui/loading/LoadingState.tsx`
- [x] T094 [P] [US6] Create EmptyState component in `frontend/src/components/ui/empty/EmptyState.tsx`
- [x] T095 [P] [US6] Create ErrorBanner component in `frontend/src/components/ui/error/ErrorBanner.tsx`
- [x] T096 [P] [US6] Create Toast notification component in `frontend/src/components/ui/toast/Toast.tsx`
- [x] T097 [US6] Implement timeout handling in API client (30s default)
- [x] T098 [US6] Implement retry logic with exponential backoff (3 retries)
- [x] T099 [US6] Add user-friendly timeout error messages
- [x] T100 [US6] Add user-friendly network error messages
- [x] T101 [US6] Implement empty state messages for all tables
- [x] T102 [US6] Add retry buttons for recoverable errors
- [x] T103 [US6] Implement global error boundary in root layout
- [x] T104 [US6] Add logging for API errors (development mode)
- [x] T105 [US6] Implement authentication token expiration handling

**Checkpoint**: All user stories should now have robust error handling

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T106 [P] Replace all mock data with actual API integration per contracts/api-contracts.md
- [x] T107 [P] Remove all `any` types - enforce strict TypeScript typing
- [x] T108 Validate enum usage across all components (no hardcoded strings)
- [x] T109 [P] Add unit tests for utility functions in `frontend/src/lib/`
- [x] T110 [P] Add component tests for reusable UI components in `tests/components/`
- [x] T111 [P] Add integration tests for API client in `tests/integration/`
- [x] T112 Run TypeScript strict mode validation: `npm run type-check`
- [x] T113 Run ESLint and fix all warnings: `npm run lint`
- [x] T114 [P] Update quickstart.md with actual setup instructions
- [x] T115 [P] Add README.md for frontend project
- [x] T116 Performance optimization: verify sub-100ms re-renders for 10k+ items
- [x] T117 Accessibility audit: verify WCAG 2.1 AA compliance
- [x] T118 Security review: verify no sensitive data in client-side storage
- [x] T119 Code cleanup: remove unused imports and dead code
- [x] T120 [P] Setup Playwright E2E tests in `tests/e2e/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Dashboard Access - Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: CSV Upload - Can start after Foundational (Phase 2) - Independent
- **User Story 3 (P1)**: Reconciliation Table - Can start after Foundational (Phase 2) - Independent
- **User Story 4 (P2)**: Workflow Actions - Can start after Foundational (Phase 2) - Uses components from US3
- **User Story 5 (P2)**: Audit Log - Can start after Foundational (Phase 2) - Independent
- **User Story 6 (P2)**: API Hardening - Should be done after all stories for full integration

### Within Each User Story

- Models/types before components
- Components before page integration
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: T001-T006 can all run in parallel (different files)

**Phase 2 (Foundational)**:
- T009-T017 can run in parallel (API layer and enums)
- T019-T022 can run in parallel (types and hooks)

**Phase 3 (US1)**:
- T023-T025 can run in parallel (layout components)
- T027-T029 can run in parallel (types and summary components)

**Phase 4 (US2)**:
- T035-T038 can run in parallel (types and upload components)

**Phase 5 (US3)**:
- T048-T051 can run in parallel (UI components)
- T054-T055 can run in parallel (table components)

**Phase 6 (US4)**:
- T066-T069 can run in parallel (enums and dialogs)
- T071-T072 can run in parallel (detail components)

**Phase 7 (US5)**:
- T081-T083 can run in parallel (audit components)

**Phase 8 (US6)**:
- T092-T096 can run in parallel (UI components)

**Phase 9 (Polish)**:
- T106-T107 can run in parallel
- T109-T111 can run in parallel (tests)

---

## Parallel Example: User Story 1

```bash
# Launch all layout components for User Story 1 together:
Task: "Create root layout with sidebar and header in frontend/src/app/layout.tsx"
Task: "Create Sidebar navigation component in frontend/src/components/dashboard/navigation/Sidebar.tsx"
Task: "Create Header component in frontend/src/components/dashboard/navigation/Header.tsx"

# Launch all summary components for User Story 1 together:
Task: "Create ReconciliationSummary type in frontend/src/lib/types/dashboard.ts"
Task: "Create SummaryCard component in frontend/src/components/dashboard/summary-cards/SummaryCard.tsx"
Task: "Create SummaryCards container component in frontend/src/components/dashboard/summary-cards/SummaryCards.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Dashboard loads with summary cards
   - Navigation works to all routes
   - No TypeScript errors
   - No console errors
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Polish and harden
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Dashboard)
   - Developer B: User Story 2 (Upload)
   - Developer C: User Story 3 (Table)
3. After P1 stories complete:
   - Developer A: User Story 4 (Workflow)
   - Developer B: User Story 5 (Audit)
   - Developer C: User Story 6 (API Hardening)
4. Stories complete and integrate independently

---

## Task Summary

| Phase | User Story | Task Count | Priority |
|-------|-----------|------------|----------|
| 1 | Setup | 8 | - |
| 2 | Foundational | 14 | - |
| 3 | US1: Dashboard Access | 12 | P1 |
| 4 | US2: CSV Upload | 13 | P1 |
| 5 | US3: Reconciliation Table | 18 | P1 |
| 6 | US4: Workflow Actions | 15 | P2 |
| 7 | US5: Audit Log | 11 | P2 |
| 8 | US6: API Hardening | 14 | P2 |
| 9 | Polish | 15 | - |
| **Total** | | **120** | |

### MVP Scope (Minimum)

- Phase 1: Setup (8 tasks)
- Phase 2: Foundational (14 tasks)
- Phase 3: User Story 1 (12 tasks)
- **MVP Total: 34 tasks**

### P1 Complete (Core Functionality)

- MVP + Phase 4 (US2) + Phase 5 (US3)
- **P1 Total: 34 + 13 + 18 = 65 tasks**

### Full Feature Complete

- All phases (1-9)
- **Total: 120 tasks**

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **CRITICAL**: Complete Phase 2 (Foundational) before starting ANY user story
- **CRITICAL**: No hardcoded classification strings - always use enums
- **CRITICAL**: All workflow actions must call backend API - no local state-only transitions
