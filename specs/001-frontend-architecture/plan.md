# Implementation Plan: Frontend Architecture (Phase 1 - UI + State + API Contracts)

**Branch**: `001-frontend-architecture` | **Date**: 2026-02-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-architecture/spec.md` and user-provided implementation phases

## Summary

Build the frontend for the Internal Bank Reconciliation System using Next.js (App Router) with TypeScript strict mode, implementing a clean enterprise dashboard for reconciliation officers to upload CSV files, view and classify reconciliation items, manage workflow states, and audit all activities. The implementation follows an 8-phase approach from project initialization through API contract hardening, with centralized API abstraction, pagination for large datasets, and workflow-state-driven rendering.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Tailwind CSS 3.x
**Storage**: N/A (frontend only, no direct database access)
**Testing**: Jest, React Testing Library, Playwright for E2E
**Target Platform**: Modern web browsers (Chrome, Firefox, Edge, Safari) - Web application
**Project Type**: frontend (Next.js application with backend API integration - backend separate)
**Performance Goals**: Page load <3s, dashboard responsive with 1000+ items, sub-100ms re-renders for 10k+ items
**Constraints**: No rendering 100k rows directly (pagination/virtualization required), no hardcoded business logic, no local state-only workflow transitions
**Scale/Scope**: Enterprise dashboard for bank reconciliation officers, 8 major phases, 6 user stories, 20 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Compliance Status | Notes |
|------------------------|-------------------|-------|
| I. Spec-Driven Development | ✅ PASS | Spec exists at `specs/001-frontend-architecture/spec.md` |
| II. Separation of Concerns | ✅ PASS | API abstraction layer, no business logic in UI, enum-driven |
| III. Type Safety & Quality | ✅ PASS | TypeScript strict mode, no `any` types allowed |
| IV. API Abstraction | ✅ PASS | Centralized API client, environment variables for endpoints |
| V. Performance & Scalability | ✅ PASS | Pagination/virtualization for large datasets |
| VI. Security & Workflow Integrity | ✅ PASS | All workflow actions via API, no local state transitions |
| VII. Reusability & Consistency | ✅ PASS | Reusable components (tables, status badges, filters) |

**Gate Result**: ✅ PASS - All constitution principles satisfied. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-architecture/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Reconciliation dashboard
│   │   ├── upload/             # CSV upload page
│   │   ├── reconciliation/     # Reconciliation detail pages
│   │   │   └── [id]/
│   │   ├── audit/              # Audit log viewer
│   │   ├── layout.tsx          # Root layout with sidebar/header
│   │   └── page.tsx            # Home/redirect to dashboard
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── table/          # Paginated table component
│   │   │   ├── status-badge/   # Status indicator badges
│   │   │   ├── filters/        # Filter components
│   │   │   ├── dialog/         # Confirmation dialogs
│   │   │   └── toast/          # Notification toasts
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── summary-cards/  # Reconciliation summary cards
│   │   │   └── navigation/     # Sidebar and header
│   │   ├── upload/             # Upload flow components
│   │   │   ├── file-drop/      # Drag-and-drop upload
│   │   │   ├── progress/       # Upload progress indicator
│   │   │   └── validation/     # Validation feedback
│   │   ├── reconciliation/     # Reconciliation components
│   │   │   ├── item-table/     # Reconciliation items table
│   │   │   ├── classification/ # Classification dropdown
│   │   │   └── override-modal/ # Manual override form
│   │   └── audit/              # Audit log components
│   │       └── audit-table/    # Audit log table
│   ├── lib/
│   │   ├── api/                # API client abstraction
│   │   │   ├── client.ts       # Centralized fetch wrapper
│   │   │   ├── endpoints.ts    # API endpoint definitions
│   │   │   ├── types.ts        # API request/response types
│   │   │   └── errors.ts       # Error handling utilities
│   │   ├── types/              # TypeScript type definitions
│   │   │   ├── reconciliation.ts
│   │   │   ├── upload.ts
│   │   │   ├── audit.ts
│   │   │   └── workflow.ts
│   │   ├── enums/              # Enum definitions
│   │   │   ├── classification.ts
│   │   │   ├── status.ts
│   │   │   └── workflow-state.ts
│   │   └── config/             # Configuration
│   │       └── index.ts        # Environment variables
│   └── hooks/                  # Custom React hooks
│       ├── use-api/            # API call hooks
│       ├── use-reconciliation/ # Reconciliation logic
│       └── use-upload/         # Upload state management
├── public/                     # Static assets
├── .env.local                  # Environment variables (API base URL)
├── .env.example                # Environment template
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript config (strict mode)
├── jest.config.js              # Jest testing configuration
└── package.json                # Dependencies and scripts

tests/
├── components/                 # Component unit tests
├── integration/                # API integration tests
└── e2e/                        # End-to-end Playwright tests
```

**Structure Decision**: Option 2 (Web application - frontend only). Backend is separate and will be implemented in parallel/subsequent phase. Frontend uses Next.js App Router with clear separation: `app/` for routes, `components/` for UI, `lib/` for utilities/API, `hooks/` for state logic.

## Implementation Phases

### Phase 0: Project Initialization

**Goals**:
- Setup Next.js (App Router) with TypeScript
- Enable strict mode
- Install Tailwind CSS
- Setup folder structure as defined in system-architecture spec
- Create centralized API client layer
- Configure environment variables (.env)

**Deliverables**:
- Base project structure
- Clean folder hierarchy
- API abstraction file (`lib/api/client.ts`, `lib/api/endpoints.ts`, `lib/api/types.ts`)
- Environment configuration (`.env.local`, `.env.example`)
- No business logic yet

**Exit Criteria**:
- `npm run dev` starts without errors
- TypeScript strict mode enabled in `tsconfig.json`
- Tailwind CSS configured and working
- API client layer created with fetch wrapper
- Environment variables documented

---

### Phase 1: Layout & Navigation System

**Goals**:
- Build main layout (sidebar + header)
- Create route structure:
  - `/dashboard`
  - `/upload`
  - `/reconciliation/[id]`
  - `/audit`
- Define reusable layout components

**Deliverables**:
- Responsive dashboard shell
- Navigation working (sidebar with menu items)
- Route-based page rendering
- Header with user info placeholder

**Exit Criteria**:
- All routes accessible
- Navigation highlights active route
- Responsive design works on tablet/desktop
- No console errors

---

### Phase 2: Upload Flow UI

**Goals**:
- CSV upload component
- File validation UI
- Upload progress state
- Success / Error states

**Constraints**:
- No parsing logic in frontend
- Only API call abstraction

**Deliverables**:
- Functional upload UI with drag-and-drop
- File type/size validation feedback
- Progress bar during upload
- Success confirmation with record count
- Error messages for validation failures
- Upload history view

**Exit Criteria**:
- File selection works
- Drag-and-drop functional
- Progress indicator displays
- Success/error states render correctly
- API integration placeholder in place

---

### Phase 3: Reconciliation Dashboard

**Goals**:
- Summary cards (Matched, Unmatched, Variance, Pending)
- Table component (paginated)
- Classification filters
- Sorting & search

**Constraints**:
- No heavy in-memory rendering
- Pagination required
- Classification enum enforced

**Deliverables**:
- Summary cards with counts
- Paginated table component
- Filter controls (status, classification, date, amount)
- Sortable columns
- Search functionality
- Empty state handling

**Exit Criteria**:
- Summary cards display correct data
- Pagination works (next/prev, page numbers)
- Filters apply correctly
- Sorting toggles asc/desc
- Table renders efficiently with 1000+ items

---

### Phase 4: Reconciliation Detail View

**Goals**:
- Display transactions by classification
- Status badge rendering
- Variance highlighting
- Manual override modal UI

**Constraints**:
- No local-only state transitions
- All actions routed through API client

**Deliverables**:
- Detailed reconciliation page
- Transaction list grouped by classification
- Status badges (matched, unmatched, pending, flagged)
- Variance amount highlighting
- Manual override modal with reason input
- Confirmation dialogs

**Exit Criteria**:
- Detail view loads correctly
- Status badges render with correct colors
- Manual override modal opens/closes
- Form validation works
- API calls triggered on submit

---

### Phase 5: Workflow Controls

**Goals**:
- Render workflow states:
  - Draft
  - Processing
  - Pending Approval
  - Approved
  - Rejected
- Button enable/disable logic
- Confirmation dialogs

**Deliverables**:
- State-aware UI rendering
- Proper locking visuals
- Action buttons with correct enabled states
- Confirmation dialogs for destructive actions
- Loading states during transitions

**Exit Criteria**:
- Workflow states render correctly
- Buttons enabled/disabled based on state
- Confirmation dialogs appear
- Loading spinners during API calls
- Success/error feedback after actions

---

### Phase 6: Audit Log Viewer

**Goals**:
- Audit table
- Immutable display
- Filter by user / date / action
- Pagination

**Deliverables**:
- Audit page UI
- Clean read-only design
- Chronological event list
- Filter controls
- Expandable event details

**Exit Criteria**:
- Audit log displays correctly
- Filters work (user, date range, event type)
- Pagination functional
- Event details expandable
- Read-only (no edit actions)

---

### Phase 7: API Contract Hardening

**Goals**:
- Replace mock data with API integration
- Ensure all responses strictly typed
- Remove all "any" types
- Validate enum usage

**Deliverables**:
- Fully typed API layer
- Contract-safe frontend
- No mock data (except for development fallback)
- All enums enforced

**Exit Criteria**:
- TypeScript strict mode clean (no errors)
- No `any` types in codebase
- All API responses typed
- Enums used consistently
- No hardcoded classification values

---

## Quality Gates

Before moving to backend phase:
- [ ] No hardcoded classifications
- [ ] No business logic in UI
- [ ] All state transitions via API client
- [ ] Pagination implemented
- [ ] TypeScript strict mode clean
- [ ] No console errors
- [ ] All user stories tested
- [ ] Constitution compliance verified

---

## Phase 0: Research

### Research Tasks

1. **Next.js 14+ App Router Best Practices**
   - Research server components vs client components usage
   - Research routing conventions and nested layouts
   - Research data fetching patterns (server vs client)

2. **Pagination/Virtualization for Large Tables**
   - Research TanStack Table (React Table) v8
   - Research virtualization libraries (react-window, react-virtual)
   - Research server-side pagination patterns

3. **TypeScript Strict Mode Configuration**
   - Research strict mode flags
   - Research best practices for type-safe API calls
   - Research generic types for API responses

4. **Centralized API Client Patterns**
   - Research fetch wrapper patterns
   - Research error handling strategies
   - Research retry logic and timeouts
   - Research request/response interceptors

5. **Tailwind CSS Enterprise Dashboard Patterns**
   - Research responsive dashboard layouts
   - Research reusable component patterns with Tailwind
   - Research theming and configuration

### Research Findings

See `research.md` for detailed findings and decisions.

---

## Phase 1: Design & Contracts - COMPLETE

### Artifacts Generated

- [x] `research.md` - Technology decisions and best practices
- [x] `data-model.md` - TypeScript types and interfaces
- [x] `contracts/api-contracts.md` - API endpoint specifications
- [x] `quickstart.md` - Developer onboarding guide

### Constitution Re-Check

*Re-evaluating after Phase 1 design completion.*

| Constitution Principle | Design Compliance | Evidence |
|------------------------|-------------------|----------|
| I. Spec-Driven Development | ✅ PASS | All designs reference spec.md requirements |
| II. Separation of Concerns | ✅ PASS | API layer in `lib/api/`, UI in `components/`, types in `lib/types/` |
| III. Type Safety & Quality | ✅ PASS | All types defined in data-model.md, strict mode enforced |
| IV. API Abstraction | ✅ PASS | Centralized client in `lib/api/client.ts`, endpoints in `lib/api/endpoints.ts` |
| V. Performance & Scalability | ✅ PASS | TanStack Table + server-side pagination in design |
| VI. Security & Workflow Integrity | ✅ PASS | All workflow actions via API, no local state transitions in contracts |
| VII. Reusability & Consistency | ✅ PASS | Reusable components defined (table, status-badge, filters, dialog) |

**Gate Result**: ✅ PASS - All constitution principles satisfied in design. Proceed to Phase 2 (/sp.tasks).

---

## Next Phase: Tasks

Run `/sp.tasks` to break this plan into actionable tasks with test cases.

**Tasks will cover**:
- Phase 0: Project Initialization tasks
- Phase 1: Layout & Navigation tasks
- Phase 2: Upload Flow UI tasks
- Phase 3: Reconciliation Dashboard tasks
- Phase 4: Reconciliation Detail View tasks
- Phase 5: Workflow Controls tasks
- Phase 6: Audit Log Viewer tasks
- Phase 7: API Contract Hardening tasks

Each task will include:
- Clear acceptance criteria
- Test cases (unit, integration)
- Files to modify
- Definition of done
