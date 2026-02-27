# Tasks: Enterprise Fintech SaaS Dashboard UI Redesign

**Input**: Design reference image and user requirements for premium enterprise fintech UI
**Prerequisites**: spec.md (required), plan.md (required)
**Feature Directory**: `C:\Users\ts.com\Internal Bank Reconciliation System\specs\001-design-system`

**Tests**: Tests are OPTIONAL - not explicitly requested in this UI redesign task.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/components/`, `frontend/app/`, `frontend/features/`
- All paths relative to project root: `C:\Users\ts.com\Internal Bank Reconciliation System\`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and design system foundation

- [ ] T001 Verify Next.js 16.x and Tailwind CSS v4 setup in `frontend/package.json`
- [ ] T002 [P] Install design system dependencies: Framer Motion, classnames (clsx) in `frontend/package.json`
- [ ] T003 [P] Create design token structure in `frontend/app/globals.css`
- [ ] T004 [P] Create design tokens TypeScript definitions in `frontend/types/design-tokens.ts`
- [ ] T005 [P] Configure Tailwind v4 theme extension in `frontend/tailwind.config.ts`
- [ ] T006 [P] Setup utility functions in `frontend/lib/utils.ts` (cn helper for class merging)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core design tokens and base utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [P] Define semantic color tokens in `frontend/app/globals.css` (primary: navy blue, accent: deep blue, success: soft green, warning: amber, error: soft red)
- [ ] T008 [P] Define typography scale in `frontend/app/globals.css` (6 levels: xs to 3xl, Inter font family)
- [ ] T009 [P] Define spacing system in `frontend/app/globals.css` (4px grid, gap-4 to gap-12)
- [ ] T010 [P] Define shadow/elevation tokens in `frontend/app/globals.css` (xs to xl, 4 levels, subtle shadows)
- [ ] T011 [P] Define border radius tokens in `frontend/app/globals.css` (sm: 8px, md: 10px, lg: 12px, xl: 16px)
- [ ] T012 [P] Define animation duration tokens in `frontend/app/globals.css` (150ms to 500ms, ease-in-out)
- [ ] T013 [P] Remove harsh yellows and overly saturated colors from `frontend/app/globals.css`
- [ ] T014 [P] Create base layout wrapper component in `frontend/components/layout/LayoutWrapper.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Apply Enterprise Fintech Visual Styling (Priority: P1) 🎯 MVP

**Goal**: Implement complete design token system with enterprise fintech color palette (navy blue primary, soft gray surfaces #F8FAFC, clean white backgrounds), typography (Inter font), spacing, shadows (subtle elevation), and border radius (10-12px) that enables consistent premium banking SaaS styling across all components.

**Independent Test**: Can be fully tested by verifying design tokens are applied correctly across dashboard page and measuring visual consistency - should look like Stripe Dashboard or modern banking admin panels.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Define primary brand colors (navy blue: #1e3a5f, deep blue: #2563eb) in `frontend/app/globals.css`
- [ ] T016 [P] [US1] Define background colors (white: #ffffff, soft gray: #F8FAFC, slate: #64748b) in `frontend/app/globals.css`
- [ ] T017 [P] [US1] Define status color tokens (success: #10b981, warning: #f59e0b, error: #ef4444, info: #3b82f6) in `frontend/app/globals.css`
- [ ] T018 [P] [US1] Define status badge background variants (bg-*-50, text-*-700, border-*-200) in `frontend/app/globals.css`
- [ ] T019 [P] [US1] Define typography scale with Inter font in `frontend/app/globals.css` (text-xs to text-3xl, font-medium/semibold/bold)
- [ ] T020 [P] [US1] Define text color tokens (gray-900 primary, gray-600 secondary, gray-400 muted) in `frontend/app/globals.css`
- [ ] T021 [P] [US1] Define spacing scale based on 4px grid in `frontend/app/globals.css` (gap-4, gap-6, gap-8, gap-12)
- [ ] T022 [P] [US1] Define shadow tokens (shadow-sm, shadow-md, shadow-lg with soft elevation) in `frontend/app/globals.css`
- [ ] T023 [P] [US1] Define border radius tokens (rounded-lg: 10px, rounded-xl: 12px, rounded-2xl: 16px) in `frontend/app/globals.css`
- [ ] T024 [P] [US1] Define animation timing tokens (duration-200, duration-300, ease-in-out) in `frontend/app/globals.css`
- [ ] T025 [US1] Create design token documentation in `frontend/DESIGN_TOKENS.md`
- [ ] T026 [US1] Add prefers-reduced-motion media query support in `frontend/app/globals.css`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - all design tokens are available for component development

---

## Phase 4: User Story 2 - Redesign Sidebar with Premium Dark Theme (Priority: P2)

**Goal**: Transform sidebar from light theme to dark navy/slate theme with proper icon+label alignment, active menu highlight with soft background, improved section spacing (General/Settings), and compact premium user profile area.

**Independent Test**: Can be tested by rendering sidebar and verifying dark navy background, proper spacing between sections, active state highlighting, and professional user profile presentation.

### Implementation for User Story 2

- [ ] T027 [P] [US2] Update Sidebar container to dark navy background (bg-slate-900 or navy #1e3a5f) in `frontend/components/layout/sidebar.tsx`
- [ ] T028 [P] [US2] Update navigation items with proper icon+label alignment (gap-3, px-3 py-2.5) in `frontend/components/layout/sidebar.tsx`
- [ ] T029 [P] [US2] Implement active menu item with soft highlight background (bg-indigo-600 or navy highlight) in `frontend/components/layout/sidebar.tsx`
- [ ] T030 [P] [US2] Improve spacing between General and Settings sections (py-5, mt-auto) in `frontend/components/layout/sidebar.tsx`
- [ ] T031 [P] [US2] Create compact premium user profile area (h-9 w-9 avatar, truncate text, dropdown indicator) in `frontend/components/layout/sidebar.tsx`
- [ ] T032 [P] [US2] Add smooth hover transitions for navigation items (hover:bg-slate-800, transition-colors) in `frontend/components/layout/sidebar.tsx`
- [ ] T033 [US2] Update sidebar border color to subtle (border-slate-800) in `frontend/components/layout/sidebar.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - sidebar has premium dark theme

---

## Phase 5: User Story 3 - Redesign Header with Search and Minimal Styling (Priority: P3)

**Goal**: Implement clean white header with integrated search bar ("Find transactions by ID, customer, or amount"), minimal notification bell with red indicator, and streamlined right-side actions.

**Independent Test**: Can be tested by rendering header and verifying search bar functionality, clean minimal styling, and proper notification indicator.

### Implementation for User Story 3

- [ ] T034 [P] [US3] Update Header container to clean white background (bg-white, border-b border-gray-200) in `frontend/components/layout/header.tsx`
- [ ] T035 [P] [US3] Implement search bar with placeholder text and search icon in `frontend/components/layout/header.tsx`
- [ ] T036 [P] [US3] Style search input (h-10, pl-4 pr-10, rounded-lg, border border-gray-200, focus:ring-2 focus:ring-blue-500) in `frontend/components/layout/header.tsx`
- [ ] T037 [P] [US3] Implement notification bell with red indicator dot (absolute positioning, bg-red-500) in `frontend/components/layout/header.tsx`
- [ ] T038 [P] [US3] Add hover states for notification button (hover:bg-gray-100, transition-colors) in `frontend/components/layout/header.tsx`
- [ ] T039 [US3] Remove old header title and user info sections from `frontend/components/layout/header.tsx`

**Checkpoint**: At this point, User Stories 1-3 should all work independently - header is production-ready

---

## Phase 6: User Story 4 - Implement Alert Banner Component (Priority: P4)

**Goal**: Create dismissible alert card component with left border color indicator (amber for warning), icon + structured message layout, primary action button ("Escalate Review" styled as filled button), and less visually aggressive styling.

**Independent Test**: Can be tested by rendering alert banner and verifying left border indicator, proper icon+message layout, action button styling, and dismiss functionality.

### Implementation for User Story 4

- [ ] T040 [P] [US4] Create AlertBanner component TypeScript props interface in `frontend/components/ui/alert-banner.tsx`
- [ ] T041 [P] [US4] Implement alert container with left border indicator (border-l-4 border-amber-500, bg-amber-50) in `frontend/components/ui/alert-banner.tsx`
- [ ] T042 [P] [US4] Add warning icon (amber-500) to alert banner in `frontend/components/ui/alert-banner.tsx`
- [ ] T043 [P] [US4] Implement structured message layout (icon + text + action button) in `frontend/components/ui/alert-banner.tsx`
- [ ] T044 [P] [US4] Style primary action button "Escalate Review" (filled button, amber-600 bg) in `frontend/components/ui/alert-banner.tsx`
- [ ] T045 [P] [US4] Add dismiss button with close icon in `frontend/components/ui/alert-banner.tsx`
- [ ] T046 [US4] Create alert variants (warning, error, info, success) in `frontend/components/ui/alert-banner.tsx`
- [ ] T047 [US4] Integrate AlertBanner into dashboard page in `frontend/app/dashboard/page.tsx`

**Checkpoint**: At this point, User Stories 1-4 should all work independently - alert system is production-ready

---

## Phase 7: User Story 5 - Redesign KPI Summary Cards with Sparklines (Priority: P5)

**Goal**: Implement premium KPI cards with uniform size and spacing, subtle shadow + hover lift effect, improved number typography (larger, bold, clear), "last 30 days" in smaller muted text, improved sparkline styling (thinner, softer colors), and icon inside each card header.

**Independent Test**: Can be tested by rendering KPI cards and verifying hover animations (lift + shadow), consistent spacing, proper typography hierarchy, and sparkline visualization.

### Implementation for User Story 5

- [ ] T048 [P] [US5] Create KPI Card component TypeScript props interface in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T049 [P] [US5] Implement card container (bg-white, rounded-xl, border border-gray-200, p-5) in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T050 [P] [US5] Add hover animation (hover:shadow-lg, hover:border-gray-300, transition-all duration-200) in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T051 [P] [US5] Implement accent color bar on right side (h-8 w-1 rounded-full bg-*-500) in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T052 [P] [US5] Style card title (text-sm, font-medium, text-gray-500) in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T053 [P] [US5] Implement large value display (text-3xl, font-bold, text-gray-900) in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T054 [P] [US5] Add period text (text-xs, text-gray-400, "last 30 days") in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T055 [P] [US5] Create Sparkline component with SVG polyline in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T056 [P] [US5] Style sparkline with thinner stroke (strokeWidth="2", softer colors) in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T057 [P] [US5] Implement 4 KPI cards (Pending Reversals, Total Reversals, AI-Flagged Issues, Unmatched Transaction) in `frontend/features/reconciliation/summary-cards.tsx`
- [ ] T058 [US5] Create responsive grid layout (grid-cols-1 md:grid-cols-2 xl:grid-cols-4, gap-4) in `frontend/features/reconciliation/summary-cards.tsx`

**Checkpoint**: At this point, User Stories 1-5 should all work independently - KPI cards are production-ready

---

## Phase 8: User Story 6 - Redesign Filter Bar and Table Controls (Priority: P6)

**Goal**: Implement modern minimal filter and search UI with "Reversal History Log" title, Filter and Sort by buttons, search input, "New reversal request" primary button (black bg), and "Import/Export" secondary button.

**Independent Test**: Can be tested by rendering filter bar and verifying button styling, search functionality, sort dropdown, and overall modern minimal appearance.

### Implementation for User Story 6

- [ ] T059 [P] [US6] Update FilterBar container to minimal layout (flex, items-center, justify-between, gap-4) in `frontend/components/ui/filter-bar.tsx`
- [ ] T060 [P] [US6] Add "Reversal History Log" title (text-lg, font-semibold, text-gray-900) in `frontend/components/ui/filter-bar.tsx`
- [ ] T061 [P] [US6] Implement Filter button with icon (border border-gray-200, hover:bg-gray-50) in `frontend/components/ui/filter-bar.tsx`
- [ ] T062 [P] [US6] Implement Sort by dropdown with icon (appearance-none, pl-3 pr-8, rounded-lg) in `frontend/components/ui/filter-bar.tsx`
- [ ] T063 [P] [US6] Style search input (w-72, h-10, pl-4 pr-10, rounded-lg, border border-gray-200) in `frontend/components/ui/filter-bar.tsx`
- [ ] T064 [P] [US6] Implement "New reversal request" button (bg-black, text-white, px-4 py-2, rounded-lg) in `frontend/components/ui/filter-bar.tsx`
- [ ] T065 [P] [US6] Implement "Import/Export" button (border border-gray-200, bg-white, hover:bg-gray-50) in `frontend/components/ui/filter-bar.tsx`
- [ ] T066 [US6] Remove old classification filter buttons from `frontend/components/ui/filter-bar.tsx`

**Checkpoint**: At this point, User Stories 1-6 should all work independently - filter bar is production-ready

---

## Phase 9: User Story 7 - Redesign Transaction Table with Premium Styling (Priority: P7)

**Goal**: Implement enterprise-grade transaction table with sticky header, premium row styling (zebra striping subtle), smooth hover effects, status badges (Matched→soft green, Unmatched Internal→blue, Unmatched Bank→amber, Variance→red), right-aligned amounts, proper cell padding, and three-dot menu action buttons.

**Independent Test**: Can be tested by rendering transaction table and verifying header styling, row hover animations, badge consistency, amount alignment, and action button styling.

### Implementation for User Story 7

- [ ] T067 [P] [US7] Update table container (bg-white, rounded-xl, border border-gray-200, overflow-hidden) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T068 [P] [US7] Implement sticky header (bg-gray-50, border-b border-gray-200) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T069 [P] [US7] Style header cells (px-6 py-3, text-xs, font-medium, text-gray-500, uppercase, tracking-wider) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T070 [P] [US7] Add table columns: Reversal ID, Initiated By, Customer Name, Amount, Risk Level, Classification, Date, Status, Action in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T071 [P] [US7] Implement zebra row striping (even: bg-white, odd: bg-gray-50/50) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T072 [P] [US7] Add row hover effect (hover:bg-gray-50, transition-colors) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T073 [P] [US7] Style table cells (px-6 py-4, text-sm, text-gray-700) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T074 [P] [US7] Right-align amount column (text-right, font-semibold, text-gray-900, Nigerian Naira symbol) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T075 [P] [US7] Implement Risk Level column with colored dots (red: Variance, amber: Unmatched Bank, emerald: others) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T076 [P] [US7] Update StatusBadge colors (Matched: green-50/green-700, Variance: red-50/red-700, others: amber-50/amber-700) in `frontend/components/ui/status-badge.tsx`
- [ ] T077 [P] [US7] Implement Status column badges (Approved: green, Pending: amber, Rejected: red) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T078 [P] [US7] Replace View button with three-dot menu icon (p-1.5, rounded-lg, hover:bg-gray-100) in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T079 [US7] Update Pagination styling (bg-gray-50, border-t border-gray-200, black active page) in `frontend/components/ui/pagination.tsx`

**Checkpoint**: At this point, User Stories 1-7 should all work independently - transaction table is production-ready

---

## Phase 10: User Story 8 - Add Smooth Hover States and Button Consistency (Priority: P8)

**Goal**: Implement smooth hover states across all interactive elements, consistent button styling (Primary: black bg, Secondary: border gray-200, Ghost: minimal), and spacing consistency across entire layout.

**Independent Test**: Can be tested by hovering over all interactive elements and verifying smooth transitions, consistent button hierarchy, and uniform spacing throughout the dashboard.

### Implementation for User Story 8

- [ ] T080 [P] [US8] Define primary button variant (bg-black, text-white, hover:bg-gray-800) in `frontend/components/ui/button.tsx`
- [ ] T081 [P] [US8] Define secondary button variant (border border-gray-200, bg-white, hover:bg-gray-50) in `frontend/components/ui/button.tsx`
- [ ] T082 [P] [US8] Define ghost button variant (text-gray-700, hover:bg-gray-100) in `frontend/components/ui/button.tsx`
- [ ] T083 [P] [US8] Add smooth hover transitions (transition-colors, duration-200) to all buttons in `frontend/components/ui/button.tsx`
- [ ] T084 [P] [US8] Apply consistent button styling across FilterBar in `frontend/components/ui/filter-bar.tsx`
- [ ] T085 [P] [US8] Apply consistent button styling across table actions in `frontend/features/reconciliation/reconciliation-table.tsx`
- [ ] T086 [US8] Verify spacing consistency across entire layout (px-6 py-6, gap-4, gap-6) in `frontend/app/dashboard/page.tsx`

**Checkpoint**: At this point, User Stories 1-8 should all work independently - consistent interactions are production-ready

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final polish

- [ ] T087 [P] Verify WCAG 2.1 AA contrast ratios for all components (text gray-900 on white, gray-700 on gray-50)
- [ ] T088 [P] Verify keyboard navigation works across all interactive elements (Tab order, focus rings)
- [ ] T089 [P] Add prefers-reduced-motion support to all hover animations
- [ ] T090 [P] Code cleanup and remove unused CSS classes from old design
- [ ] T091 [P] Performance optimization (verify bundle size, remove unused exports)
- [ ] T092 [P] Update README.md with new design system documentation
- [ ] T093 [P] Create component usage guide in `frontend/COMPONENT_GUIDE.md`
- [ ] T094 Test dashboard on different viewport widths (320px to 1920px)
- [ ] T095 Verify investor-demo quality - clean, structured, trustworthy, corporate feel

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → ...)
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses tokens from US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses tokens from US1
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Uses tokens from US1
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Uses tokens from US1
- **User Story 6 (P6)**: Can start after US5 - Extends table structure
- **User Story 7 (P7)**: Can start after US6 - Uses StatusBadge, table structure
- **User Story 8 (P8)**: Can start after US7 - Polish across all components

### Within Each User Story

- Models/types before component implementation
- Base component structure before variants
- Core implementation before polish/animations
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, multiple user stories can start in parallel (if team capacity allows)
- Within each user story, tasks marked [P] can run in parallel (different files, no dependencies)

---

## Parallel Example: User Story 1

```bash
# Launch all color token tasks for User Story 1 together:
Task: "Define primary brand colors in frontend/app/globals.css"
Task: "Define background colors in frontend/app/globals.css"
Task: "Define status color tokens in frontend/app/globals.css"

# Launch all typography and spacing tasks together:
Task: "Define typography scale with Inter font in frontend/app/globals.css"
Task: "Define text color tokens in frontend/app/globals.css"
Task: "Define spacing scale based on 4px grid in frontend/app/globals.css"
```

---

## Parallel Example: User Story 5

```bash
# Launch all KPI card styling tasks together:
Task: "Implement card container in frontend/features/reconciliation/summary-cards.tsx"
Task: "Add hover animation in frontend/features/reconciliation/summary-cards.tsx"
Task: "Style card title in frontend/features/reconciliation/summary-cards.tsx"
Task: "Implement large value display in frontend/features/reconciliation/summary-cards.tsx"

# Launch sparkline tasks:
Task: "Create Sparkline component with SVG polyline in frontend/features/reconciliation/summary-cards.tsx"
Task: "Style sparkline with thinner stroke in frontend/features/reconciliation/summary-cards.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently - verify design tokens create premium fintech look
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Design Tokens) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Sidebar) → Test independently → Deploy/Demo
4. Add User Story 3 (Header) → Test independently → Deploy/Demo
5. Add User Story 4 (Alert Banner) → Test independently → Deploy/Demo
6. Add User Story 5 (KPI Cards) → Test independently → Deploy/Demo
7. Add User Story 6 (Filter Bar) → Test independently → Deploy/Demo
8. Add User Story 7 (Table) → Test independently → Deploy/Demo
9. Add User Story 8 (Polish) → Test independently → Deploy/Demo
10. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 2 (Sidebar)
   - Developer B: User Story 3 (Header)
   - Developer C: User Story 4 (Alert Banner)
3. Next wave:
   - Developer A: User Story 5 (KPI Cards)
   - Developer B: User Story 6 (Filter Bar)
   - Developer C: User Story 7 (Table)
4. Stories complete and integrate independently

---

## Summary

**Total Tasks**: 95
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 8 tasks
- **Phase 3 (US1)**: 12 tasks
- **Phase 4 (US2)**: 7 tasks
- **Phase 5 (US3)**: 6 tasks
- **Phase 6 (US4)**: 8 tasks
- **Phase 7 (US5)**: 11 tasks
- **Phase 8 (US6)**: 8 tasks
- **Phase 9 (US7)**: 13 tasks
- **Phase 10 (US8)**: 7 tasks
- **Phase 11 (Polish)**: 9 tasks

**Parallel Opportunities**: 60+ tasks marked [P] can run in parallel
**Independent Test Criteria**: Each user story has clear independent test criteria
**MVP Scope**: User Story 1 (Design Tokens) - enables premium fintech styling
**Final Feel**: Professional fintech SaaS platform (Stripe Dashboard quality)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Focus on clarity, spacing, and hierarchy throughout
- Avoid flashy gradients or playful styles - keep it corporate and trustworthy
