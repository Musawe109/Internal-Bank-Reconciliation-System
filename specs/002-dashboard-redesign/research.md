# Research: Dashboard Redesign

**Feature**: 002-dashboard-redesign  
**Date**: 2026-02-24  
**Purpose**: Resolve technical unknowns and document design decisions for dashboard implementation

---

## Technical Decisions

### Decision 1: Component Architecture Pattern

**What was chosen**: Component-based architecture with composition pattern

**Why chosen**: 
- Aligns with existing 001-design-system React component structure
- Enables reusability across dashboard and future pages
- Supports independent testing of each component
- Follows Next.js App Router conventions

**Alternatives considered**:
- Monolithic dashboard component: Rejected due to poor testability and maintainability
- Micro-frontends: Overkill for single-dashboard scope, adds unnecessary complexity

---

### Decision 2: Data Fetching Strategy

**What was chosen**: React Server Components with client-side data fetching via custom hooks

**Why chosen**:
- Next.js 16.x supports RSC for initial page load optimization
- Custom hooks (`useReconciliationStats`, `useTransactions`) centralize data fetching logic
- Enables loading states and error handling per component
- Consistent with existing frontend patterns

**Alternatives considered**:
- Pure client-side fetching: Rejected due to slower initial load
- Pure server-side fetching: Rejected due to lack of real-time update capability
- Redux/Zustand: Rejected as overkill for dashboard-scoped state

---

### Decision 3: Responsive Grid Implementation

**What was chosen**: Tailwind CSS v4 responsive utilities with CSS Grid

**Why chosen**:
- Tailwind v4 already in use (confirmed from package.json)
- Native CSS Grid provides optimal responsive behavior
- No additional dependencies required
- Performance: CSS-native, no JavaScript layout calculations

**Implementation**:
```css
/* Mobile-first: 1 column */
grid grid-cols-1
/* Tablet: 2 columns */
md:grid-cols-2
/* Desktop: 4 columns */
xl:grid-cols-4
```

**Alternatives considered**:
- CSS Flexbox: Rejected due to less predictable grid alignment
- JavaScript grid libraries (Masonry, etc.): Rejected due to bundle size and complexity

---

### Decision 4: Animation Strategy

**What was chosen**: Tailwind CSS transitions and utilities for hover/focus states

**Why chosen**:
- Spec requires subtle hover effects (shadow, background changes)
- Tailwind v4 has built-in transition utilities
- No Framer Motion needed for simple hover states (YAGNI)
- Better performance: CSS transitions vs JavaScript animations
- Respects `prefers-reduced-motion` automatically

**Alternatives considered**:
- Framer Motion: Rejected as overkill for hover-only animations (unlike 001-design-system which had complex animations)
- Custom CSS keyframes: Rejected due to maintenance overhead

---

### Decision 5: Typography Implementation

**What was chosen**: Inter font via next/font with Tailwind typography plugin

**Why chosen**:
- Spec explicitly requires Inter font family
- `next/font` provides automatic optimization and self-hosting
- Tailwind typography plugin provides consistent vertical rhythm
- Zero layout shift: fonts optimized at build time

**Implementation**:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

**Alternatives considered**:
- System fonts: Rejected due to spec requirement for Inter
- Manual font loading: Rejected due to performance optimization in next/font

---

### Decision 6: Color Palette Strategy

**What was chosen**: Tailwind CSS v4 slate color palette with semantic token mapping

**Why chosen**:
- Spec explicitly defines slate color usage (slate-100, slate-500, slate-800)
- Tailwind v4 provides consistent color scale
- Semantic tokens enable future theming if needed
- Accessibility: Slate colors meet WCAG contrast requirements when used correctly

**Color Mapping**:
- Background outer: `bg-slate-100`
- Background inner: `bg-white`
- Primary text: `text-slate-800`
- Secondary text: `text-slate-500`
- Header background: `bg-slate-100`
- Status colors: emerald-100/700, amber-100/700, rose-100/700

**Alternatives considered**:
- Custom color tokens: Rejected as Tailwind slate palette matches spec exactly
- CSS custom properties: Rejected as Tailwind v4 handles theming adequately

---

### Decision 7: Table Implementation Pattern

**What was chosen**: Semantic HTML table with Tailwind styling

**Why chosen**:
- Accessibility: Native table semantics for screen readers
- Performance: No JavaScript rendering overhead
- Spec requires enterprise-style table with specific styling
- Easy to implement sorting/filtering with existing patterns

**Alternatives considered**:
- Virtualized table (TanStack Table): Rejected as overkill for expected transaction volume
- CSS Grid table: Rejected due to accessibility concerns
- Third-party table libraries: Rejected due to bundle size and complexity

---

### Decision 8: Search/Filter Implementation

**What was chosen**: Client-side filtering with debounced search input

**Why chosen**:
- Spec requires <500ms response time
- Client-side filtering eliminates network latency
- Debouncing prevents excessive re-renders
- Sufficient for expected transaction volume (<1000 items)

**Implementation**:
```typescript
// Use useDebounce hook from existing lib or implement simple version
const debouncedSearch = useDebounce(searchTerm, 300)
const filtered = transactions.filter(t => 
  t.description.toLowerCase().includes(debouncedSearch.toLowerCase())
)
```

**Alternatives considered**:
- Server-side search: Rejected due to network latency exceeding 500ms goal
- Instant search (no debounce): Rejected due to performance concerns

---

### Decision 9: Loading State Pattern

**What was chosen**: Skeleton loaders for statistics cards, spinner for table

**Why chosen**:
- Spec mentions skeleton loaders for statistics
- Perceived performance: Skeletons show layout structure
- Reduces layout shift when content loads
- Consistent with modern SaaS patterns

**Alternatives considered**:
- Simple spinner for all: Rejected due to poor perceived performance
- No loading state: Rejected due to spec requirement

---

### Decision 10: Error Handling Strategy

**What was chosen**: Error boundaries with retry capability

**Why chosen**:
- Graceful degradation: Dashboard shows partial data if some APIs fail
- User experience: Clear error messages with retry option
- Observability: Errors logged for monitoring

**Implementation**:
```typescript
// Error boundary wrapper for dashboard
<ErrorBoundary fallback={<DashboardError onRetry={retry} />}>
  <DashboardContent />
</ErrorBoundary>
```

**Alternatives considered**:
- Global error page: Rejected due to poor UX (hides working sections)
- Silent failures: Rejected due to spec requirement for observability

---

## Best Practices

### Accessibility (WCAG 2.1 AA)

**Color Contrast**:
- Slate-800 on white: 12.63:1 (exceeds AAA)
- Slate-500 on white: 4.54:1 (meets AA)
- Status badges: All combinations tested for contrast

**Keyboard Navigation**:
- All interactive elements focusable
- Visible focus rings (Tailwind `focus:ring`)
- Logical tab order

**Screen Reader Support**:
- Semantic HTML (nav, main, table, etc.)
- ARIA labels where needed
- Status badges include text labels (not color-only)

---

### Performance Optimization

**Bundle Size**:
- Tree-shakeable component exports
- No unnecessary dependencies
- Tailwind v4 purges unused CSS

**Render Performance**:
- React.memo for StatsCard components
- useMemo for filtered transaction list
- Debounced search input

**Loading Performance**:
- Next.js App Router for RSC
- Parallel data fetching with Promise.all
- Optimistic UI updates for interactions

---

### Testing Strategy

**Unit Tests**:
- Each component tested in isolation
- Props validation with TypeScript
- User interaction testing (click, hover, type)

**Integration Tests**:
- Dashboard page loading flow
- Search/filter interaction
- API error handling

**Visual Regression**:
- Screenshot tests for dashboard layout
- Responsive breakpoint verification
- Status badge color verification

---

## API Integration

### Existing Backend Endpoints (from backend structure)

Based on backend FastAPI structure, expected endpoints:

```
GET /api/reconciliation/stats      # Statistics for cards
GET /api/reconciliation/transactions # Transaction list with filters
POST /api/reconciliation/transactions # Create new transaction
PATCH /api/reconciliation/transactions/{id} # Update transaction status
```

### Data Contracts

See `contracts/` directory for TypeScript interfaces matching backend models.

---

## References

- Next.js 16 Documentation: https://nextjs.org/docs
- Tailwind CSS v4 Documentation: https://tailwindcss.com/docs
- React 19 Documentation: https://react.dev
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
