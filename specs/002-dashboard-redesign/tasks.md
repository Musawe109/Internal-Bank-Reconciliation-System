# Tasks: Dashboard UI Structural Redesign

**Input**: Design documents from `/specs/002-dashboard-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Component tests included for TDD approach (Red-Green-Refactor)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/`, `frontend/components/`, `frontend/app/`
- **Tests**: `frontend/tests/` or component-level `*.test.tsx`
- Paths based on plan.md project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verify existing design system

- [X] T001 Verify frontend directory structure matches plan.md (frontend/, components/, app/)
- [X] T002 [P] Verify Tailwind CSS v4 is installed in frontend/package.json
- [X] T003 [P] Verify Inter font is configured in frontend/app/layout.tsx
- [ ] T004 [P] Verify Jest and React Testing Library are configured for testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout structure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Create dashboard layout wrapper in frontend/app/dashboard/page.tsx
- [X] T006 [P] Implement soft gray outer background (bg-slate-100 min-h-screen) in dashboard page
- [X] T007 [P] Implement centered main container (max-w-7xl mx-auto px-8 py-8) in dashboard page
- [X] T008 [P] Implement inner content wrapper (bg-white rounded-3xl shadow-lg p-8) in dashboard page
- [X] T009 [P] Verify responsive spacing utilities (gap-6, mt-6, mt-8, mb-6, p-6, p-8) are available

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Dashboard Overview (Priority: P1) 🎯 MVP

**Goal**: Implement dashboard overview with statistics cards and highlight card

**Independent Test**: Can be fully tested by loading the dashboard and verifying the layered layout structure, statistics cards visual quality, and overall spacing/alignment

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Create dashboard page test in frontend/tests/dashboard/page.test.tsx
- [ ] T011 [P] [US1] Create StatsCard component test in frontend/components/dashboard/StatsCard/StatsCard.test.tsx
- [ ] T012 [P] [US1] Create StatsGrid component test in frontend/components/dashboard/StatsGrid/StatsGrid.test.tsx
- [ ] T013 [US1] Create highlight card test in frontend/components/dashboard/HighlightCard/HighlightCard.test.tsx

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create StatsCard component in frontend/components/dashboard/StatsCard/StatsCard.tsx
- [ ] T015 [P] [US1] Create StatsCard index export in frontend/components/dashboard/StatsCard/index.ts
- [ ] T016 [P] [US1] Create StatsGrid component in frontend/components/dashboard/StatsGrid/StatsGrid.tsx
- [ ] T017 [P] [US1] Create StatsGrid index export in frontend/components/dashboard/StatsGrid/index.ts
- [ ] T018 [US1] Implement responsive grid layout (grid-cols-1 md:grid-cols-2 xl:grid-cols-4) in StatsGrid
- [ ] T019 [US1] Implement card styling (bg-white rounded-2xl shadow-md border border-slate-100 p-6) in StatsCard
- [ ] T020 [US1] Implement hover effect (transition-all duration-300 hover:shadow-xl) in StatsCard
- [ ] T021 [US1] Implement label styling (text-slate-500 text-sm) in StatsCard
- [ ] T022 [US1] Implement value styling (text-3xl font-bold text-slate-800) in StatsCard
- [ ] T023 [US1] Implement optional trend indicator in StatsCard
- [ ] T024 [US1] Implement optional progress bar in StatsCard
- [ ] T025 [P] [US1] Create HighlightCard component in frontend/components/dashboard/HighlightCard/HighlightCard.tsx
- [ ] T026 [P] [US1] Create HighlightCard index export in frontend/components/dashboard/HighlightCard/index.ts
- [ ] T027 [US1] Implement gradient background (bg-gradient-to-r from-indigo-500 to-purple-600) in HighlightCard
- [ ] T028 [US1] Implement white text and rounded styling in HighlightCard
- [ ] T029 [US1] Add skeleton loader for StatsCard loading state
- [ ] T030 [US1] Add empty state messaging for no data scenario

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate Dashboard Sections (Priority: P2)

**Goal**: Implement modern sidebar navigation with premium styling

**Independent Test**: Can be tested by verifying sidebar visual styling (white background, rounded edges, shadow), navigation item styling, and active/hover state changes

### Tests for User Story 2 ⚠️

- [ ] T031 [P] [US2] Create Sidebar component test in frontend/components/layout/Sidebar/Sidebar.test.tsx
- [ ] T032 [P] [US2] Create NavItem component test in frontend/components/layout/Sidebar/NavItem.test.tsx

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create NavItem component in frontend/components/layout/Sidebar/NavItem.tsx
- [ ] T034 [US2] Update Sidebar component in frontend/components/layout/Sidebar/Sidebar.tsx (extend from 001-design-system)
- [ ] T035 [US2] Implement sidebar container styling (bg-white subtle shadow rounded-2xl p-6) in Sidebar
- [ ] T036 [US2] Implement section grouping with space-y-2 in Sidebar
- [ ] T037 [US2] Implement nav item default styling (text-slate-600 rounded-lg px-4 py-2) in NavItem
- [ ] T038 [US2] Implement nav item hover effect (hover:bg-slate-50 hover:text-slate-900) in NavItem
- [ ] T039 [US2] Implement active item styling (bg-slate-100 border-l-4 border-indigo-600 text-slate-900 font-medium) in NavItem
- [ ] T040 [US2] Add icon support for navigation items in NavItem
- [ ] T041 [US2] Implement grouped sections (General, Management, Settings) in Sidebar

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Header with Search (Priority: P2)

**Goal**: Implement header with search functionality, notification icon, and profile avatar

**Independent Test**: Can be tested by verifying header elements (title, subtitle, search input, notification icon, profile avatar) display with proper styling and spacing

### Tests for User Story 3 ⚠️

- [ ] T042 [P] [US3] Create Header component test in frontend/components/layout/Header/Header.test.tsx
- [ ] T043 [P] [US3] Create SearchInput component test in frontend/components/layout/Header/SearchInput.test.tsx

### Implementation for User Story 3

- [ ] T044 [P] [US3] Create SearchInput component in frontend/components/layout/Header/SearchInput.tsx
- [ ] T045 [US3] Update Header component in frontend/components/layout/Header/Header.tsx (extend from 001-design-system)
- [ ] T046 [US3] Implement page title styling (font-semibold text-2xl text-slate-800) in Header
- [ ] T047 [US3] Implement subtitle styling (text-slate-500) in Header
- [ ] T048 [US3] Implement search input styling (bg-slate-100 rounded-xl px-4 py-2) in SearchInput
- [ ] T049 [US3] Implement search focus ring (focus:ring-2 focus:ring-indigo-500) in SearchInput
- [ ] T050 [US3] Add search icon inside input in SearchInput
- [ ] T051 [P] [US3] Create NotificationIcon component in frontend/components/layout/Header/NotificationIcon.tsx
- [ ] T052 [US3] Implement notification icon in Header
- [ ] T053 [P] [US3] Create ProfileAvatar component in frontend/components/layout/Header/ProfileAvatar.tsx
- [ ] T054 [US3] Implement profile avatar with rounded-full styling in ProfileAvatar
- [ ] T055 [US3] Implement balanced spacing between header elements

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Identify Transaction Status at a Glance (Priority: P3)

**Goal**: Implement transaction table with status badges

**Independent Test**: Can be tested by verifying status badges display with correct colors (emerald for approved, amber for pending, rose for rejected) and rounded-full styling

### Tests for User Story 4 ⚠️

- [ ] T056 [P] [US4] Create TransactionTable component test in frontend/components/dashboard/TransactionTable/TransactionTable.test.tsx
- [ ] T057 [P] [US4] Create StatusBadge component test in frontend/components/dashboard/StatusBadge/StatusBadge.test.tsx

### Implementation for User Story 4

- [ ] T058 [P] [US4] Create StatusBadge component in frontend/components/dashboard/StatusBadge/StatusBadge.tsx
- [ ] T059 [P] [US4] Create StatusBadge index export in frontend/components/dashboard/StatusBadge/index.ts
- [ ] T060 [US4] Implement approved badge (bg-emerald-100 text-emerald-700) in StatusBadge
- [ ] T061 [US4] Implement pending badge (bg-amber-100 text-amber-700) in StatusBadge
- [ ] T062 [US4] Implement rejected badge (bg-rose-100 text-rose-700) in StatusBadge
- [ ] T063 [US4] Implement rounded-full styling (rounded-full px-3 py-1 text-sm font-medium) in StatusBadge
- [ ] T064 [P] [US4] Create TransactionTable component in frontend/components/dashboard/TransactionTable/TransactionTable.tsx
- [ ] T065 [P] [US4] Create TransactionTable index export in frontend/components/dashboard/TransactionTable/index.ts
- [ ] T066 [US4] Implement table container (bg-white rounded-2xl shadow-md mt-8 overflow-hidden) in TransactionTable
- [ ] T067 [US4] Implement table header section with title, filter, sort, and action buttons in TransactionTable
- [ ] T068 [US4] Implement primary action button (bg-black text-white rounded-xl px-4 py-2 hover:opacity-90) in TransactionTable
- [ ] T069 [US4] Implement table header styling (bg-slate-100 uppercase text-xs tracking-wide text-slate-600) in TransactionTable
- [ ] T070 [US4] Implement table row styling (px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100) in TransactionTable
- [ ] T071 [US4] Implement right alignment for amounts in TransactionTable
- [ ] T072 [US4] Integrate StatusBadge in TransactionTable rows
- [ ] T073 [US4] Implement empty state for table in TransactionTable
- [ ] T074 [US4] Implement text truncation with ellipsis for long descriptions

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T075 [P] Verify WCAG 2.1 AA color contrast ratios for all text and interactive elements
- [ ] T076 [P] Verify focus indicators meet accessibility standards
- [ ] T077 [P] Test responsive layout at breakpoints (320px, 768px, 1024px, 1280px, 1920px)
- [ ] T078 [P] Verify no pure black (#000) colors used anywhere in interface
- [ ] T079 [P] Verify Inter font is applied consistently across all components
- [ ] T080 [P] Verify typography hierarchy (semibold headings, bold numbers, slate-800/500 text)
- [ ] T081 [P] Verify consistent spacing (gap-6, mt-6, mt-8, mb-6, p-6, p-8) across all components
- [ ] T082 [P] Add visual regression tests for dashboard layout
- [ ] T083 [P] Update quickstart.md with actual component usage examples
- [ ] T084 [P] Run performance audit (verify <2s load time, <500ms search response)
- [ ] T085 [P] Code cleanup and remove unused imports
- [ ] T086 [P] Verify all components have proper TypeScript types from contracts/types.ts

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Components before integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks can run in parallel (all marked [P])
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- All components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create dashboard page test in frontend/tests/dashboard/page.test.tsx"
Task: "Create StatsCard component test in frontend/components/dashboard/StatsCard/StatsCard.test.tsx"
Task: "Create StatsGrid component test in frontend/components/dashboard/StatsGrid/StatsGrid.test.tsx"

# Launch all components for User Story 1 together:
Task: "Create StatsCard component in frontend/components/dashboard/StatsCard/StatsCard.tsx"
Task: "Create StatsGrid component in frontend/components/dashboard/StatsGrid/StatsGrid.tsx"
Task: "Create HighlightCard component in frontend/components/dashboard/HighlightCard/HighlightCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Stats Cards + Highlight) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Sidebar) → Test independently → Deploy/Demo
4. Add User Story 3 (Header with Search) → Test independently → Deploy/Demo
5. Add User Story 4 (Transaction Table) → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Stats Cards)
   - Developer B: User Story 2 (Sidebar)
   - Developer C: User Story 3 (Header)
   - Developer D: User Story 4 (Table)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All components extend existing 001-design-system foundation
- UI-only refactor: No backend/API/state changes required
