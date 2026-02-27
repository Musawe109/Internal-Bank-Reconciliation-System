# Implementation Plan: Dashboard UI Layout and Spacing Refinement

**Branch**: `001-dashboard-ui-refactor` | **Date**: 2026-02-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification for UI layout and spacing refactor to achieve modern SaaS fintech standards

## Summary

Refactor the dashboard UI layout structure, spacing system, and responsiveness using Tailwind CSS in Next.js. The implementation focuses on creating consistent spacing between sections, establishing visual hierarchy through layered shadows, implementing responsive grid layouts, and ensuring the dashboard feels spacious and premium. This is a structural refactor only—no changes to business logic, APIs, or data flow.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.2.3, Next.js 16.1.6
**Primary Dependencies**: Tailwind CSS 4.x (via @tailwindcss/postcss)
**Storage**: N/A (UI-only refactor)
**Testing**: React Testing Library, Jest (existing frontend test setup)
**Target Platform**: Web application (responsive: mobile, tablet, desktop)
**Performance Goals**: 60fps rendering, no layout shift during responsive transitions
**Constraints**: Must not modify business logic, APIs, backend functionality, data flow, or state management; Must maintain existing functionality while improving layout
**Scale/Scope**: Frontend dashboard pages and components only; ~5-10 component files to modify

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Status**: The project constitution file is a template with placeholder values. No active gates to evaluate.

**Plan Alignment**:
- ✅ UI-only changes (no backend/data modifications)
- ✅ Smallest viable diff (spacing/layout classes only)
- ✅ No unrelated refactoring
- ✅ Maintains existing functionality
- ✅ Testable outcomes defined in spec

## Project Structure

### Documentation (this feature)

```text
specs/001-dashboard-ui-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output (Tailwind CSS best practices, responsive patterns)
├── data-model.md        # N/A (UI-only feature)
├── quickstart.md        # Phase 1 output (development setup, testing instructions)
├── contracts/           # N/A (no API contracts for UI refactor)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx     # Main dashboard page (layout structure)
│   └── layout.tsx       # Root layout (may need spacing updates)
├── components/
│   ├── ui/
│   │   ├── Card.tsx     # Stats card component (shadow, padding, hover)
│   │   └── Table.tsx    # Table component (spacing, overflow)
│   └── dashboard/
│       ├── Header.tsx   # Header with search (flex layout)
│       ├── StatsGrid.tsx # Responsive grid (breakpoints)
│       └── Sidebar.tsx  # Collapsible sidebar (mobile)
├── styles/
│   └── globals.css      # Global styles (background, spacing tokens)
└── tests/
    ├── dashboard/
    │   └── layout.test.tsx  # Layout and spacing tests
    └── components/
        └── Card.test.tsx    # Card styling tests
```

**Structure Decision**: Using existing frontend structure. Components are organized by domain (dashboard/) and reusable UI components (ui/). Tests mirror the component structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. This is a straightforward UI refactor with clear boundaries.

## Phase 0: Research

### Research Topics

1. **Tailwind CSS 4.x Responsive Design Patterns**
   - Best practices for responsive grid layouts (grid-cols-1, sm:grid-cols-2, xl:grid-cols-4)
   - Mobile-first breakpoint strategy (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
   - Spacing scale consistency (space-y-8, p-6, gap-6)

2. **Shadow Layering for Visual Depth**
   - Shadow hierarchy: shadow-lg (outer), shadow-md (cards), shadow-xl (hover)
   - Transition timing for hover effects (duration-300)
   - Avoiding visual flattening in modern UI design

3. **Mobile-First Responsive Patterns**
   - Collapsible sidebar implementation for mobile
   - Table horizontal scrolling (overflow-x-auto)
   - Flex container stacking (flex-col lg:flex-row)

4. **Next.js 16 + Tailwind CSS 4 Integration**
   - Tailwind CSS 4 configuration in Next.js 16
   - PostCSS setup for utility classes
   - Performance optimization for utility-heavy components

### Research Findings

**Tailwind CSS 4.x** introduces a new engine with improved performance and a JavaScript-first configuration approach. The responsive breakpoints follow standard mobile-first conventions.

**Responsive Grid Strategy**: Use `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` for progressive enhancement from mobile to desktop.

**Spacing System**: Tailwind's spacing scale uses 0.25rem (4px) increments. Key values:
- `p-6` = 1.5rem (24px) padding
- `space-y-8` = 2rem (32px) vertical spacing
- `gap-6` = 1.5rem (24px) gap

**Shadow System**: Consistent shadow layering creates visual depth:
- `shadow-lg` = 0 10px 15px -3px rgba(0,0,0,0.1) (outer containers)
- `shadow-md` = 0 4px 6px -1px rgba(0,0,0,0.1) (cards)
- `shadow-xl` = 0 20px 25px -5px rgba(0,0,0,0.1) (hover states)

**Mobile Patterns**:
- Sidebar: Use state-based collapse with hamburger menu on mobile
- Tables: Wrap in container with `overflow-x-auto` for horizontal scroll
- Header: Flex container with `flex-col lg:flex-row` for responsive stacking

## Phase 1: Design & Contracts

### Component Design

#### 1. Dashboard Container Component

**Purpose**: Outer wrapper with background, centering, and max-width constraint

**Structure**:
```tsx
<div className="min-h-screen bg-slate-100">
  <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
    <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 space-y-8">
      {/* Dashboard content */}
    </div>
  </main>
</div>
```

**Responsibilities**:
- Provide soft gray background (bg-slate-100)
- Center content with max-width constraint (max-w-7xl)
- Apply consistent padding at container level
- Wrap dashboard in white card with large rounded corners and shadow

#### 2. Stats Card Component

**Purpose**: Reusable card for displaying statistics with consistent styling and hover effects

**Structure**:
```tsx
<div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 
                transition-all duration-300 hover:shadow-xl">
  <div className="space-y-2">
    {/* Card content */}
  </div>
</div>
```

**Responsibilities**:
- Consistent padding (p-6 = 24px)
- Medium shadow with hover elevation
- Light border for definition
- Smooth transition on hover

#### 3. Responsive Grid Component

**Purpose**: Container for stats cards with responsive column behavior

**Structure**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
  {/* Stats cards */}
</div>
```

**Breakpoints**:
- Mobile (<640px): 1 column
- Tablet (640px-1279px): 2 columns
- Desktop (≥1280px): 4 columns

#### 4. Header Component

**Purpose**: Flexible header with title and search, responsive layout

**Structure**:
```tsx
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
  <div>
    <h1 className="font-semibold text-slate-800">Dashboard</h1>
    <p className="text-slate-500">Welcome back</p>
  </div>
  <div className="w-full lg:w-96">
    <input className="w-full bg-slate-100 rounded-xl px-4 py-2" />
  </div>
</div>
```

**Responsibilities**:
- Stack vertically on mobile
- Side-by-side on desktop
- Search input full-width on mobile, constrained on desktop

#### 5. Table Component

**Purpose**: Wrapped table with proper spacing and overflow handling

**Structure**:
```tsx
<div className="bg-white rounded-2xl shadow-md mt-8 p-6 overflow-hidden">
  <div className="mb-6">{/* Header controls */}</div>
  <div className="overflow-x-auto">
    <table>
      <tbody>
        <tr className="px-6 py-4 border-b border-slate-100 hover:bg-slate-50">
          {/* Row content */}
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Responsibilities**:
- Container with rounded corners and shadow
- Horizontal scroll on mobile
- Consistent row padding and hover states

### Typography System

**Hierarchy**:
- Headings: `font-semibold text-slate-800`
- Secondary text: `text-slate-500`
- Numbers/Stats: `text-3xl font-bold text-slate-800`

### Spacing System

**Vertical Rhythm**:
- Between major sections: `space-y-8` (32px)
- Section margins: `mt-8 mb-8` (32px)
- Internal card spacing: `space-y-2` (8px)

**Padding**:
- Container: `p-6 lg:p-8` (24px mobile, 32px desktop)
- Cards: `p-6` (24px)
- Table rows: `px-6 py-4` (24px horizontal, 16px vertical)

## Phase 2: Testing Strategy

### Visual Regression Tests

**Purpose**: Ensure layout changes don't break existing visual appearance

**Tools**: Chromatic, Percy, or Playwright screenshots

**Coverage**:
- Dashboard at mobile (375px), tablet (768px), desktop (1280px)
- Card hover states
- Table overflow behavior

### Unit Tests

**Card Component**:
- Renders with correct shadow classes
- Hover state applies shadow-xl
- Padding is consistent (p-6)

**Grid Component**:
- Responsive breakpoints apply correctly
- Gap spacing is consistent (gap-6)

**Header Component**:
- Flex layout switches at lg breakpoint
- Search input width changes appropriately

### Integration Tests

**Dashboard Layout**:
- All sections have consistent spacing (space-y-8)
- Container has proper max-width and centering
- Background and shadow hierarchy applied correctly

**Responsive Behavior**:
- Sidebar collapses on mobile
- Stats grid changes column count at breakpoints
- Table scrolls horizontally on mobile

## Phase 3: Implementation Approach

### Incremental Rollout Strategy

1. **Start with container structure** (DashboardContainer component)
2. **Update stats cards** (Card component styling)
3. **Implement responsive grid** (StatsGrid component)
4. **Refactor header** (Header component flex layout)
5. **Update table section** (Table component spacing)
6. **Add mobile sidebar** (Sidebar collapsible behavior)
7. **Final polish** (Typography, shadows, transitions)

### Risk Mitigation

**Risk**: Breaking existing functionality during refactor
**Mitigation**: 
- Keep changes isolated to layout/styling classes only
- Maintain existing component props and interfaces
- Comprehensive testing before each commit

**Risk**: Performance degradation from excessive utility classes
**Mitigation**:
- Use Tailwind's built-in optimization (CSS purging)
- Monitor bundle size after build
- Test rendering performance with React DevTools

## Quickstart

### Development Setup

```bash
cd frontend
npm install  # Ensure Tailwind CSS 4.x is installed
npm run dev  # Start development server
```

### Testing Locally

```bash
npm run test           # Run unit tests
npm run test:watch     # Watch mode for TDD
npm run build          # Verify production build
npm run lint           # Check for ESLint errors
```

### Responsive Testing

Use Chrome DevTools Device Mode to test at:
- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1280x800 (MacBook)

## Acceptance Criteria

The implementation is complete when:

- [ ] All dashboard sections have consistent 32px spacing (space-y-8)
- [ ] Stats cards display in responsive grid (1/2/4 columns)
- [ ] Cards have proper shadow hierarchy and hover effects
- [ ] Header adapts from stacked (mobile) to side-by-side (desktop)
- [ ] Table has horizontal scroll on mobile
- [ ] Sidebar is collapsible on mobile
- [ ] Typography hierarchy is consistent throughout
- [ ] All transitions are smooth (300ms duration)
- [ ] No visual flattening (proper shadow depths applied)
- [ ] Dashboard feels spacious and premium

## Follow-ups

1. Consider creating a design system documentation site (Storybook)
2. Add visual regression testing to CI/CD pipeline
3. Document spacing and typography tokens for future consistency
4. Consider dark mode support using Tailwind's dark: variants
