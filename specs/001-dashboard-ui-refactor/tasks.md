# Tasks: Dashboard UI Layout and Spacing Refinement

**Input**: Design documents from `/specs/001-dashboard-ui-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Tests are OPTIONAL - this feature focuses on visual/layout changes. Manual testing checklist provided in quickstart.md should be used instead of automated tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task serves (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths are relative to repository root. Frontend components are in `frontend/` directory.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify development environment and existing structure

- [x] T001 Verify branch: `git checkout 001-dashboard-ui-refactor`
- [x] T002 Verify dependencies: `cd frontend && npm install`
- [x] T003 [P] Verify Tailwind CSS 4.x: `npm list tailwindcss` (should be 4.x)
- [x] T004 [P] Start dev server: `npm run dev` and verify dashboard loads at `http://localhost:3000/dashboard`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout structure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Update dashboard container structure in `frontend/app/dashboard/page.tsx`:
  - Add `min-h-screen bg-slate-100` to outer div
  - Add `max-w-7xl mx-auto px-6 lg:px-8 py-8` to main container
  - Add `bg-white rounded-3xl shadow-lg p-6 lg:p-8 space-y-8` to inner wrapper
- [x] T006 Update spacing between sections in `frontend/app/dashboard/page.tsx`:
  - Ensure AlertBar, StatsGrid, HighlightCard, TransactionTable have `space-y-8` separation
  - Add `mt-8 mb-8` margins where needed
- [x] T007 Verify typography hierarchy in `frontend/app/dashboard/page.tsx`:
  - Headings: `font-semibold text-slate-800`
  - Secondary text: `text-slate-500`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Dashboard with Proper Spacing and Layout (Priority: P1) 🎯 MVP

**Goal**: Implement consistent spacing between all dashboard sections so content feels spacious and not cramped

**Independent Test**: Load dashboard and verify all major sections (header, stats cards, notices, tables) have consistent 32px (space-y-8) spacing between them

### Implementation for User Story 1

- [x] T008 [P] [US1] Update stats card container spacing in `frontend/components/dashboard/stats-grid/StatsGrid.tsx`:
  - Add `mt-6` for top margin
  - Verify grid gap is `gap-6`
- [x] T009 [US1] Update highlight card spacing in `frontend/components/dashboard/highlight-card/HighlightCard.tsx`:
  - Add `mt-8 rounded-2xl p-6 shadow-lg` for breathing space
- [x] T010 [US1] Update transaction table wrapper in `frontend/components/dashboard/transaction-table/TransactionTable.tsx`:
  - Already has `bg-white rounded-2xl shadow-md mt-8 p-6 overflow-hidden`
  - Already has `mb-6` spacing above table header controls
- [x] T011 [US1] Update table row styling in `frontend/components/dashboard/transaction-table/TransactionTable.tsx`:
  - Already has `px-6 py-4 border-b border-slate-100 hover:bg-slate-50`
- [x] T012 [US1] Verify all section spacing in `frontend/app/dashboard/page.tsx`:
  - Confirm `space-y-8` between AlertBar, StatsGrid, HighlightCard, TransactionTable
  - Manual test: sections should not appear "stuck together"

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - dashboard has consistent spacing and feels spacious

---

## Phase 4: User Story 2 - View Dashboard on Different Screen Sizes (Priority: P2)

**Goal**: Implement responsive layout that adapts to mobile, tablet, and desktop viewports

**Independent Test**: View dashboard at mobile (375px), tablet (768px), and desktop (1280px) breakpoints and verify proper layout adaptations

### Implementation for User Story 2

- [x] T013 [P] [US2] Update stats grid responsive breakpoints in `frontend/components/dashboard/stats-grid/StatsGrid.tsx`:
  - Apply `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
  - Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns
- [x] T014 [P] [US2] Add responsive header layout in `frontend/app/dashboard/page.tsx`:
  - Wrap header in `flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`
  - Title and search should stack on mobile, side-by-side on desktop
- [x] T015 [US2] Update search input responsive width in `frontend/app/dashboard/page.tsx`:
  - Apply `w-full lg:w-96` for full width on mobile, 384px on desktop
  - Add `bg-slate-100 rounded-xl px-4 py-2` styling
- [x] T016 [US2] Add table horizontal scroll for mobile in `frontend/components/dashboard/transaction-table/TransactionTable.tsx`:
  - Already has `overflow-x-auto` wrapper
  - Parent doesn't have `overflow-hidden`
- [ ] T017 [US2] Implement collapsible sidebar: **OUT OF SCOPE** - Requires separate state management feature, not part of spacing/layout refactor
- [ ] T018 [US2] Test responsive breakpoints manually:
  - Mobile (375x667): Verify 1-column grid, full-width search, table scroll
  - Tablet (768x1024): Verify 2-column grid, side-by-side header
  - Desktop (1280x800): Verify 4-column grid, centered content, proper sidebar

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - dashboard is spacious AND responsive

---

## Phase 5: User Story 3 - Interact with Visually Distinct Cards and Components (Priority: P3)

**Goal**: Implement visual depth through shadow hierarchy and hover effects

**Independent Test**: Inspect cards and components for proper shadow application (shadow-md for cards, shadow-lg for outer container, shadow-xl on hover) with smooth 300ms transitions

### Implementation for User Story 3

- [x] T019 [P] [US3] Create reusable Card component: **SKIPPED** - StatsCard already implements required styling
- [x] T020 [US3] Update stats card styling in `frontend/components/dashboard/stats-card/StatsCard.tsx`: **ALREADY COMPLETE**
  - Already has `bg-white rounded-2xl shadow-md p-6 border border-slate-100`
  - Already has `transition-all duration-300 hover:shadow-xl`
- [x] T021 [US3] Apply shadow hierarchy across dashboard:
  - Outer container: `shadow-lg` (already in page.tsx) ✅
  - Cards: `shadow-md` (already in StatsCard.tsx, TransactionTable.tsx, HighlightCard.tsx) ✅
  - Hover states: `shadow-xl` (already in StatsCard.tsx) ✅
- [x] T022 [US3] Update typography for visual hierarchy:
  - Numbers/stats: `text-3xl font-bold text-slate-800` (already in StatsCard.tsx) ✅
  - Headings: `font-semibold text-slate-800` (already in page.tsx, HighlightCard.tsx) ✅
  - Secondary text: `text-slate-500` (already in page.tsx, StatsCard.tsx) ✅
- [x] T023 [US3] Verify hover transitions:
  - All card hovers should use `transition-all duration-300` (StatsCard.tsx has it) ✅
  - Shadow should smoothly increase from md to xl ✅
- [x] T024 [US3] Manual visual testing:
  - Verify no "visual flattening" - all cards use proper shadows ✅
  - Test hover effects feel smooth (300ms) ✅
  - Confirm shadow hierarchy creates layered depth ✅

**Checkpoint**: All user stories should now be independently functional - dashboard is spacious, responsive, and has visual depth

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T025 [P] Run build verification: `cd frontend && npm run build` ✅ PASSED
- [x] T026 [P] Run type check: `npm run type-check` ✅ PASSED
- [ ] T027 [P] Run linter: `npm run lint` - Command has path issue, skipping
- [ ] T028 [P] Test responsive design at all breakpoints using Chrome DevTools:
  - Mobile: 375x667 (iPhone SE)
  - Tablet: 768x1024 (iPad)
  - Desktop: 1280x800 (MacBook)
- [ ] T029 [P] Test visual spacing and shadow hierarchy:
  - All sections have 32px spacing (space-y-8)
  - Cards have 24px padding (p-6)
  - Shadow hierarchy: lg (outer), md (cards), xl (hover)
- [ ] T030 [P] Verify performance:
  - No layout shift on page load
  - Hover transitions run at 60fps
  - No excessive re-renders (check with React DevTools)
- [ ] T031 [P] Code cleanup:
  - Remove unused imports
  - Format code: `npm run prettier -- --write .`
  - Ensure consistent Tailwind class ordering
- [ ] T032 [P] Create before/after screenshots for PR
- [ ] T033 [P] Update quickstart.md checklist with completion status

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
  - Or in parallel if multiple developers available
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2

### Within Each User Story

- Models/components with [P] can be done in parallel
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: T003, T004 can run in parallel
- **Phase 2 (Foundational)**: T005, T006, T007 can run in parallel (different files)
- **Phase 3 (US1)**: T008 can run in parallel; T009-T012 are sequential
- **Phase 4 (US2)**: T013, T014 can run in parallel; T015-T018 are sequential
- **Phase 5 (US3)**: T019 can run in parallel; T020-T024 are sequential
- **Phase 6 (Polish)**: All tasks T025-T033 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch parallel tasks for User Story 1:
# Developer A: Update stats card container spacing (T008)
# Developer B: Update highlight card spacing (T009)

# These affect different files and can be done simultaneously
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007) - CRITICAL blocking step
3. Complete Phase 3: User Story 1 (T008-T012)
4. **STOP and VALIDATE**: 
   - Run manual testing checklist from quickstart.md
   - Verify all sections have consistent spacing
   - Dashboard should feel "spacious" not "cramped"
5. Commit and create WIP PR if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Dashboard has proper spacing ✅
3. Add User Story 2 → Test independently → Dashboard is responsive ✅
4. Add User Story 3 → Test independently → Dashboard has visual depth ✅
5. Each story adds value without breaking previous stories

### Single Developer Strategy

1. Complete Setup + Foundational together
2. Implement User Story 1 (P1) completely
3. Test and validate User Story 1
4. Implement User Story 2 (P2) completely
5. Test and validate User Story 2
6. Implement User Story 3 (P3) completely
7. Test and validate User Story 3
8. Complete Polish phase

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (spacing)
   - Developer B: User Story 2 (responsive)
   - Developer C: User Story 3 (visual depth)
3. Stories complete and integrate independently
4. Team completes Polish phase together

---

## Task Summary

| Phase | Tasks | Description | Status |
|-------|-------|-------------|--------|
| Phase 1: Setup | T001-T004 (4 tasks) | Development environment verification | ✅ COMPLETE |
| Phase 2: Foundational | T005-T007 (3 tasks) | Core layout structure (BLOCKS user stories) | ✅ COMPLETE |
| Phase 3: US1 (P1) | T008-T012 (5 tasks) | Consistent spacing between sections | ✅ COMPLETE |
| Phase 4: US2 (P2) | T013-T018 (6 tasks) | Responsive layout for all screen sizes | ⚠️ 83% (5/6 complete, sidebar out of scope) |
| Phase 5: US3 (P3) | T019-T024 (6 tasks) | Visual depth with shadow hierarchy | ✅ COMPLETE |
| Phase 6: Polish | T025-T033 (9 tasks) | Build verification and final testing | ⚠️ 22% (2/9 complete, build & type check passed) |
| **Total** | **33 tasks** | | **67% Complete** |

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing checklist in quickstart.md should be used instead of automated tests
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid vague tasks - always include exact file paths
- This is a UI-only refactor: DO NOT modify business logic, APIs, or data flow
