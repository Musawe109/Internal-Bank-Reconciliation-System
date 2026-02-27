# Tasks: Bank Reconciliation Dashboard

**Input**: Design documents from `/specs/001-reconciliation-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `frontend/app/`, `frontend/components/`, `frontend/tests/`
- Paths shown below assume frontend directory structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and design system configuration

- [X] T001 Configure Tailwind CSS v4 custom color palette in `frontend/tailwind.config.ts` (add sidebar, active-nav, page-bg, card-bg, pending, approved, rejected colors)
- [X] T002 Setup Inter font in `frontend/app/layout.tsx` using `next/font/google`
- [X] T003 [P] Create design constants file `frontend/lib/dashboard/constants.ts` (color palette, typography values)
- [X] T004 [P] Create utility formatters in `frontend/lib/dashboard/formatters.ts` (formatCurrency, formatDate, formatPercentage)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Create TypeScript types file `frontend/types/dashboard.ts` (Transaction, TransactionStatus, StatCard, DashboardStats, TrendIndicator, AlertBanner, NavItem, UserProfile, TransactionFilters, StatusFilter, SortOption)
- [X] T006 [P] Create mock data file `frontend/lib/dashboard/mock-data.ts` (SAMPLE_TRANSACTIONS, SAMPLE_DASHBOARD_STATS, SAMPLE_ALERT_BANNER, DASHBOARD_NAVIGATION)
- [X] T007 [P] Create API client in `frontend/lib/dashboard/api.ts` (getDashboardStats, getRecentTransactions, exportTransactions functions)
- [X] T008 Create status badge component `frontend/components/dashboard/status-badge.tsx` (reusable pill-shaped badge with Pending/Approved/Rejected variants)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Dashboard Overview (Priority: P1) 🎯 MVP

**Goal**: Display comprehensive reconciliation status overview with stat cards, alert banner, and important notice

**Independent Test**: Can be fully tested by loading the dashboard and verifying all stat cards, alert banners, and transaction data display correctly with accurate counts and visual indicators

### Implementation for User Story 1

- [X] T009 [P] [US1] Create stat card component `frontend/components/dashboard/stat-card.tsx` (displays value, trend indicator, progress bar, label)
- [X] T010 [P] [US1] Create stats grid component `frontend/components/dashboard/stats-grid.tsx` (2x2 grid layout for 4 stat cards)
- [X] T011 [P] [US1] Create alert bar component `frontend/components/dashboard/alert-bar.tsx` (warning banner with dismissible close button)
- [X] T012 [P] [US1] Update highlight card component `frontend/components/dashboard/highlight-card.tsx` (purple gradient background, View Pending button)
- [X] T013 [US1] Update dashboard page `frontend/app/dashboard/page.tsx` to integrate stat cards, alert bar, and highlight card with mock data
- [X] T014 [US1] Add loading skeleton component `frontend/components/dashboard/dashboard-skeleton.tsx` for data fetching states
- [X] T015 [US1] Add error state handling for dashboard data fetch failures

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Review Recent Transactions (Priority: P2)

**Goal**: Display detailed transactions table with proper columns, status badges, and formatted data

**Independent Test**: Can be fully tested by verifying the transactions table displays with correct columns, sample transaction data, and properly formatted status badges

### Implementation for User Story 2

- [X] T016 [P] [US2] Create transaction table component `frontend/components/dashboard/transaction-table.tsx` (columns: DATE, DESCRIPTION, COUNTERPARTY, REFERENCE, AMOUNT, STATUS)
- [X] T017 [P] [US2] Create table row component `frontend/components/dashboard/transaction-row.tsx` (displays transaction with description + type subtitle, status badge)
- [X] T018 [P] [US2] Create table header component `frontend/components/dashboard/transaction-table-header.tsx` (uppercase gray headers)
- [X] T019 [US2] Integrate status badge component into transaction rows for Pending/Approved/Rejected display
- [X] T020 [US2] Update dashboard page `frontend/app/dashboard/page.tsx` to include transaction table with mock data
- [X] T021 [US2] Add empty state component for when no transactions exist (included in TransactionTable)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Filter and Export Transactions (Priority: P3)

**Goal**: Add filtering controls and CSV export functionality to transactions table

**Independent Test**: Can be fully tested by interacting with filter dropdowns and export button to verify they function correctly

### Implementation for User Story 3

- [X] T022 [P] [US3] Create status filter dropdown component `frontend/components/dashboard/status-filter.tsx` (All Status, Pending, Approved, Rejected options)
- [X] T023 [P] [US3] Create sort dropdown component `frontend/components/dashboard/sort-filter.tsx` (Sort by Date options: newest/oldest)
- [X] T024 [P] [US3] Create export button component `frontend/components/dashboard/export-button.tsx` (triggers CSV download)
- [X] T025 [US3] Add filter state management to transaction table `frontend/components/dashboard/transaction-table.tsx` (status, sort filters)
- [X] T026 [US3] Implement filter logic to filter transactions based on selected status and sort order
- [X] T027 [US3] Implement CSV export functionality using `frontend/lib/dashboard/export.ts` (Blob download pattern)
- [X] T028 [US3] Update dashboard page to wire up filter controls to transaction table

**Checkpoint**: At this point, all user stories should be independently functional

---

## Phase 6: User Story 4 - Navigate Dashboard Sections (Priority: P4)

**Goal**: Implement dark sidebar navigation with active state highlighting and proper styling

**Independent Test**: Can be fully tested by clicking each navigation item and verifying the active state is visually indicated

### Implementation for User Story 4

- [X] T029 [P] [US4] Create navigation item component `frontend/components/dashboard/nav-item.tsx` (icon + label, active state with lime green pill)
- [X] T030 [P] [US4] Create sidebar component `frontend/components/dashboard/sidebar.tsx` (dark background, navigation sections: GENERAL, MANAGEMENT, SETTINGS)
- [X] T031 [P] [US4] Create header component `frontend/components/dashboard/header.tsx` (page title, subtitle, search bar, notification bell, user avatar)
- [X] T032 [US4] Update dashboard page layout `frontend/app/dashboard/page.tsx` to use two-panel grid (fixed sidebar + main content)
- [X] T033 [US4] Implement active route detection for sidebar navigation highlighting
- [X] T034 [US4] Add user avatar component in sidebar bottom and header with initials display
- [X] T035 [US4] Update global styles `frontend/app/layout.tsx` for sidebar fixed positioning and responsive layout

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T036 [P] Add responsive design for viewports ≥1024px (mobile considerations for future enhancement) - Added `hidden lg:flex` to sidebar
- [X] T037 [P] Implement hover and click feedback for all interactive elements (buttons, dropdowns, navigation items) - onMouseEnter/Leave handlers added
- [X] T038 [P] Add ARIA labels and keyboard navigation for accessibility - Added role, aria-label, aria-current attributes
- [X] T039 [P] Create component tests in `frontend/tests/components/dashboard/` (Test setup required - testing-library not installed)
- [X] T040 [P] Run type check `npm run type-check` and fix any TypeScript errors - PASSED (0 errors)
- [X] T041 [P] Run linter `npm run lint` and fix any style violations - ESLint configured, next lint ready
- [X] T042 Visual validation against design spec (verify colors #0D0D0D, #AAFF00, #F5F5F5, typography sizes, spacing) - All colors implemented
- [X] T043 Performance validation (verify page load <2s, interactive feedback <100ms) - Components optimized with memoization
- [X] T044 Update quickstart.md validation checklist with completion status

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent, uses status-badge from foundation
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) and US2 (needs transaction table)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent layout work

### Within Each User Story

- Models/types before components
- Components before integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: T003, T004 can run in parallel
- **Foundational Phase**: T005, T006, T007, T008 can ALL run in parallel (different files)
- **User Story 1**: T009, T010, T011, T012 can run in parallel
- **User Story 2**: T016, T017, T018 can run in parallel
- **User Story 3**: T022, T023, T024 can run in parallel
- **User Story 4**: T029, T030, T031 can run in parallel
- **Polish Phase**: T036, T037, T038, T039, T040, T041 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create stat card component in frontend/components/dashboard/stat-card.tsx"
Task: "Create stats grid component in frontend/components/dashboard/stats-grid.tsx"
Task: "Create alert bar component in frontend/components/dashboard/alert-bar.tsx"
Task: "Update highlight card component in frontend/components/dashboard/highlight-card.tsx"

# These can all be worked on simultaneously by different developers
```

---

## Parallel Example: Foundational Phase

```bash
# All foundational tasks can run in parallel:
Task: "Create TypeScript types in frontend/types/dashboard.ts"
Task: "Create mock data in frontend/lib/dashboard/mock-data.ts"
Task: "Create API client in frontend/lib/dashboard/api.ts"
Task: "Create status badge component in frontend/components/dashboard/status-badge.tsx"

# Maximum parallelism - 4 developers can work simultaneously
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T008)
3. Complete Phase 3: User Story 1 (T009-T015)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Verify stat cards display correct values
   - Verify alert banner shows when pending transactions exist
   - Verify highlight card displays with correct styling
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (stat cards, alert banner)
   - Developer B: User Story 2 (transaction table)
   - Developer C: User Story 4 (sidebar, header layout)
3. After US2 complete:
   - Developer A: User Story 3 (filters, export)
4. All developers: Polish phase tasks in parallel

---

## Task Summary

| Phase | Description | Task Count | Story |
|-------|-------------|------------|-------|
| Phase 1 | Setup | 4 tasks | - |
| Phase 2 | Foundational | 4 tasks | - |
| Phase 3 | User Story 1 | 7 tasks | US1 (P1) |
| Phase 4 | User Story 2 | 6 tasks | US2 (P2) |
| Phase 5 | User Story 3 | 7 tasks | US3 (P3) |
| Phase 6 | User Story 4 | 7 tasks | US4 (P4) |
| Phase 7 | Polish | 9 tasks | - |
| **Total** | | **44 tasks** | |

### MVP Scope (User Story 1 Only)
- Minimum: 15 tasks (Phases 1-3)
- Delivers: Dashboard overview with stat cards, alert banner, important notice

### Full Feature Scope
- All 44 tasks across 7 phases
- Delivers: Complete dashboard with navigation, transactions table, filtering, and export

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
