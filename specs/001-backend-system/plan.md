# Implementation Plan: Dashboard Redesign - Enterprise Fintech UI

**Branch**: `001-backend-system` | **Date**: 2026-02-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification for Internal Bank Reconciliation System with enterprise-grade UI redesign

## Summary

Complete redesign of the Internal Bank Reconciliation System dashboard to achieve enterprise-grade fintech UI suitable for SaaS commercialization. The redesign focuses on modern 2026 aesthetic, professional corporate styling, and Stripe-quality design patterns using Next.js App Router, React, Tailwind CSS v4, TypeScript, and Framer Motion.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x, Next.js 16.x
**Primary Dependencies**: Framer Motion (animations), Tailwind CSS v4 (styling), Next.js App Router (routing/server components)
**Storage**: Frontend state management (TBD - Zustand/Jotai/Context), Backend PostgreSQL via API
**Testing**: Jest, React Testing Library, Playwright for E2E
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Single frontend application with backend API
**Performance Goals**: 
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Animation frame rate 60fps
- API response display < 100ms (skeleton loading)
**Constraints**: 
- Bundle size < 200KB (gzipped) initial load
- Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
- WCAG 2.1 AA compliance
- Support 100k+ transaction display with virtualization
**Scale/Scope**: 
- 15-20 unique page/screen states
- 30-40 reusable components
- 3-5 complex data visualization views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Test-First (TDD) | ✅ PASS | All components require tests before implementation |
| CLI Interface | N/A | Frontend UI project - text I/O not applicable |
| Library-First | ✅ PASS | Components designed as reusable libraries |
| Integration Testing | ✅ PASS | Contract tests for API, E2E for critical flows |
| Observability | ✅ PASS | Structured logging, error boundaries, metrics |
| Simplicity (YAGNI) | ✅ PASS | Start minimal, iterate based on user feedback |

**GATE RESULT**: PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-system/
├── plan.md              # This file
├── research.md          # Phase 0 output (design research)
├── data-model.md        # Phase 1 output (UI component model)
├── quickstart.md        # Phase 1 output (dev setup guide)
├── contracts/           # Phase 1 output (API contracts)
│   ├── openapi.yaml     # OpenAPI 3.1 specification
│   └── frontend-types.ts # TypeScript interface contracts
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (Repository)

```text
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth layout group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Main dashboard layout
│   │   ├── layout.tsx       # Dashboard shell (nav, sidebar)
│   │   ├── page.tsx         # Dashboard home
│   │   ├── reconciliation/
│   │   │   ├── [id]/
│   │   │   ├── new/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   ├── approvals/
│   │   ├── audit/
│   │   └── settings/
│   ├── api/                 # API routes (if needed)
│   ├── globals.css          # Global styles + Tailwind
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Base UI primitives (atomic)
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Table/
│   │   ├── Modal/
│   │   ├── Dropdown/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   └── index.ts         # Barrel export
│   ├── layout/              # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── Container/
│   ├── forms/               # Form components
│   │   ├── TextField/
│   │   ├── SelectField/
│   │   ├── DatePicker/
│   │   └── FileUpload/
│   ├── data-display/        # Data visualization
│   │   ├── DataTable/
│   │   ├── StatCard/
│   │   ├── Chart/
│   │   └── Timeline/
│   ├── feedback/            # User feedback
│   │   ├── Toast/
│   │   ├── Spinner/
│   │   ├── ProgressBar/
│   │   └── Alert/
│   └── reconciliation/      # Domain-specific components
│       ├── TransactionRow/
│       ├── ClassificationBadge/
│       ├── ReconciliationSummary/
│       └── OverrideModal/
├── features/                # Feature modules (business logic)
│   ├── auth/
│   ├── reconciliation/
│   ├── transactions/
│   ├── approvals/
│   └── audit/
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useReconciliation.ts
│   ├── useTransactions.ts
│   └── useDebounce.ts
├── lib/                     # Utilities
│   ├── api.ts               # API client
│   ├── utils.ts             # General utilities
│   ├── formatters.ts        # Data formatters
│   └── validators.ts        # Zod schemas
├── stores/                  # State management (Zustand)
│   ├── auth-store.ts
│   ├── reconciliation-store.ts
│   └── ui-store.ts
├── styles/                  # Design tokens
│   ├── tokens.css           # CSS custom properties
│   └── animations.css       # Animation definitions
├── types/                   # TypeScript types
│   ├── api.ts               # API response types
│   ├── models.ts            # Domain models
│   └── ui.ts                # UI component props
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Structure Decision**: Monorepo-style frontend structure with clear separation between:
- `components/ui` - Reusable atomic components (design system)
- `components/*` - Composite components by concern
- `features/*` - Business logic and state
- `stores/*` - Global state management

## Phase 0: Research & Design Strategy

### Unknowns to Resolve

1. **Design System Architecture**: Research Stripe, Linear, Vercel design patterns for enterprise fintech
2. **Color Token Strategy**: Define semantic color system for financial data (success/variance states)
3. **Animation Strategy**: Framer Motion patterns for data-heavy interfaces
4. **State Management**: Evaluate Zustand vs Jotai vs Context for reconciliation state
5. **Data Virtualization**: Best practices for 100k+ transaction display
6. **Accessibility**: WCAG 2.1 AA compliance for financial applications

### Research Tasks

- [ ] Research enterprise fintech UI patterns (Stripe Dashboard, Plaid, Mercury)
- [ ] Research Tailwind CSS v4 new features and migration patterns
- [ ] Research Framer Motion performance optimization for data tables
- [ ] Research Next.js App Router best practices for dashboard applications
- [ ] Research accessible data table patterns for screen readers

## Phase 1: Design Deliverables

### 1. Design System Architecture

#### Color Tokens

```css
/* Semantic Color Palette - Enterprise Fintech */
:root {
  /* Neutrals (Slate scale) */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;
  
  /* Primary (Corporate Blue) */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  /* Status Colors - Financial Semantics */
  --color-success: #10b981;      /* Matched transactions */
  --color-success-muted: #d1fae5;
  --color-warning: #f59e0b;      /* Variance detected */
  --color-warning-muted: #fef3c7;
  --color-error: #ef4444;        /* Unmatched/Rejected */
  --color-error-muted: #fee2e2;
  --color-info: #6366f1;         /* Pending/Info */
  --color-info-muted: #e0e7ff;
  
  /* Functional Colors */
  --color-border: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);
  --color-background: var(--color-neutral-0);
  --color-surface: var(--color-neutral-50);
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-tertiary: var(--color-neutral-400);
}
```

#### Typography Scale

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Font Sizes (modular scale) */
  --text-xs: 0.75rem;     /* 12px - Captions, badges */
  --text-sm: 0.875rem;    /* 14px - Secondary text */
  --text-base: 1rem;      /* 16px - Body text */
  --text-lg: 1.125rem;    /* 18px - Lead text */
  --text-xl: 1.25rem;     /* 20px - H3 */
  --text-2xl: 1.5rem;     /* 24px - H2 */
  --text-3xl: 1.875rem;   /* 30px - H1 */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### Spacing System

```css
:root {
  /* 4px base grid */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

#### Elevation & Shadows

```css
:root {
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### 2. Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (64px)                                              │
│  [Logo] [Navigation]              [User] [Notifications]    │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ SIDEBAR  │  MAIN CONTENT AREA                               │
│ (240px)  │  ┌────────────────────────────────────────────┐ │
│          │  │  Page Header                               │ │
│ • Dash   │  ├────────────────────────────────────────────┤ │
│ • Recon  │  │                                            │ │
│ • Trans  │  │  Content Body                              │ │
│ • Approve│  │  (Scrollable, independent of sidebar)      │ │
│ • Audit  │  │                                            │ │
│          │  │                                            │ │
│ ──────── │  └────────────────────────────────────────────┘ │
│ Settings │                                                  │
│          ├──────────────────────────────────────────────────┤
│          │  FOOTER / STATUS BAR (optional)                  │
└──────────┴──────────────────────────────────────────────────┘
```

### 3. Component Hierarchy

```
App
├── RootLayout
│   ├── AuthProvider
│   └── DashboardLayout
│       ├── Header
│       │   ├── Logo
│       │   ├── Navigation
│       │   └── UserMenu
│       ├── Sidebar
│       │   └── NavItem[]
│       └── MainContent
│           ├── PageHeader
│           │   ├── Title
│           │   ├── Breadcrumb
│           │   └── Actions
│           ├── ContentBody
│           │   ├── StatCards[]
│           │   ├── DataTable
│           │   │   ├── TableHeader
│           │   │   ├── TableBody
│           │   │   │   └── TransactionRow[]
│           │   │   └── TableFooter (Pagination)
│           │   └── DetailPanel (slide-over)
│           └── ToastContainer
```

### 4. Animation Strategy

**Principles**:
- **Purposeful**: Animations serve functional purposes (orientation, feedback, hierarchy)
- **Subtle**: Duration 150-300ms, easing `cubic-bezier(0.4, 0, 0.2, 1)`
- **Performant**: GPU-accelerated transforms only (translate, scale, opacity)

**Animation Tokens**:

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Framer Motion Variants**:

```typescript
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

// Panel slide-over
const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit: { x: '100%' }
};

// List items (stagger)
const listVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 }
  })
};

// Scale feedback (buttons, cards)
const scaleVariants = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 }
};
```

### 5. Data Model (UI Components)

See `data-model.md` for complete entity definitions.

### 6. API Contracts

See `contracts/` directory for:
- OpenAPI 3.1 specification
- TypeScript interface definitions

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Design System tokens | Enterprise SaaS requires consistent, scalable theming | Direct Tailwind classes insufficient for multi-theme support |
| State management (Zustand) | Complex reconciliation state across components | Context API insufficient for frequent updates (100k rows) |
| Framer Motion | Professional animations required for SaaS polish | CSS transitions insufficient for complex gestures/orchestration |

## Constitution Check (Post-Design)

*Re-evaluation after Phase 1 design completion*

| Gate | Status | Notes |
|------|--------|-------|
| Test-First | ✅ PASS | Component test strategy defined |
| Library-First | ✅ PASS | Components designed as reusable packages |
| Integration Testing | ✅ PASS | API contract tests + E2E flows defined |
| Observability | ✅ PASS | Error boundaries, logging hooks planned |
| Simplicity | ✅ PASS | YAGNI - start with core components only |

**GATE RESULT**: PASS - Proceed to Phase 2 (Tasks)

## Next Steps

1. **Create Tasks** (`/sp.tasks`): Break down implementation into testable tasks
2. **Create Checklist** (`/sp.checklist`): Generate domain-specific checklist
3. **Begin Implementation**: Start with design system tokens and base components

---

**Artifacts Generated**:
- `research.md` - Design research and competitive analysis
- `data-model.md` - UI component data models
- `contracts/openapi.yaml` - API specification
- `contracts/frontend-types.ts` - TypeScript interfaces
- `quickstart.md` - Development setup guide

**Branch**: `001-backend-system`
**Plan Path**: `C:\Users\ts.com\Internal Bank Reconciliation System\specs\001-backend-system\plan.md`
