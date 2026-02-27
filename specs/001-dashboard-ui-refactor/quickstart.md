# Quickstart: Dashboard UI Layout and Spacing Refinement

**Feature**: 001-dashboard-ui-refactor  
**Date**: 2026-02-25  
**Purpose**: Development setup and testing instructions for implementing the UI layout refactor

---

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git (for branch management)

## Development Setup

### 1. Verify Branch

Ensure you're on the correct feature branch:

```bash
git checkout 001-dashboard-ui-refactor
```

### 2. Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

**Verify Tailwind CSS 4.x is installed:**

```bash
npm list tailwindcss
```

Expected output: `tailwindcss@4.x.x`

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Open Dashboard

Navigate to `http://localhost:3000/dashboard` to view the dashboard page.

---

## Implementation Checklist

Use this checklist to track implementation progress:

### Container Structure
- [ ] Add soft background: `min-h-screen bg-slate-100`
- [ ] Center main container: `max-w-7xl mx-auto px-6 lg:px-8 py-8`
- [ ] Wrap dashboard: `bg-white rounded-3xl shadow-lg p-6 lg:p-8 space-y-8`

### Stats Cards
- [ ] Implement responsive grid: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6`
- [ ] Card styling: `bg-white rounded-2xl shadow-md border border-slate-100`
- [ ] Card padding: `p-6`
- [ ] Hover effect: `hover:shadow-xl transition-all duration-300`
- [ ] Internal spacing: `space-y-2`

### Header Area
- [ ] Flex container: `flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`
- [ ] Search input width: `w-full lg:w-96`
- [ ] Search styling: `bg-slate-100 rounded-xl px-4 py-2`

### Table Section
- [ ] Table wrapper: `bg-white rounded-2xl shadow-md mt-8 p-6 overflow-hidden`
- [ ] Header controls spacing: `mb-6`
- [ ] Table row padding: `px-6 py-4`
- [ ] Table row border: `border-b border-slate-100`
- [ ] Hover state: `hover:bg-slate-50`
- [ ] Mobile scroll: `overflow-x-auto`

### Typography
- [ ] Headings: `font-semibold text-slate-800`
- [ ] Secondary text: `text-slate-500`
- [ ] Numbers: `text-3xl font-bold text-slate-800`

### Visual Depth
- [ ] Outer container shadow: `shadow-lg`
- [ ] Card shadows: `shadow-md`
- [ ] Hover shadows: `shadow-xl`

---

## Testing

### Manual Testing

#### Responsive Testing

Use Chrome DevTools Device Mode to test at these breakpoints:

**Mobile (375x667 - iPhone SE)**
- [ ] Stats cards stack vertically (1 column)
- [ ] Sidebar is collapsible
- [ ] Table has horizontal scroll
- [ ] Search input is full width
- [ ] Header stacks vertically

**Tablet (768x1024 - iPad)**
- [ ] Stats cards display in 2 columns
- [ ] Sidebar is visible
- [ ] Table fits without scroll
- [ ] Header is side-by-side

**Desktop (1280x800 - MacBook)**
- [ ] Stats cards display in 4 columns
- [ ] Sidebar is properly positioned on left
- [ ] Content is centered with max-width constraint
- [ ] All hover effects work smoothly

#### Visual Testing

**Spacing Consistency**
- [ ] All major sections have 32px spacing between them
- [ ] Cards have consistent 24px padding
- [ ] Table rows have consistent padding (24px horizontal, 16px vertical)

**Shadow Hierarchy**
- [ ] Dashboard container has large shadow (shadow-lg)
- [ ] Cards have medium shadow (shadow-md)
- [ ] Hover states increase to large shadow (shadow-xl)
- [ ] Transitions feel smooth (300ms)

**Typography**
- [ ] Headings are semibold and dark (slate-800)
- [ ] Secondary text is lighter (slate-500)
- [ ] Numbers are large (3xl) and bold

### Automated Testing

#### Run Unit Tests

```bash
npm run test
```

#### Run Type Check

```bash
npm run type-check
```

#### Run Linter

```bash
npm run lint
```

#### Build for Production

```bash
npm run build
```

Verify no errors or warnings.

---

## Component Files to Modify

Based on the existing frontend structure, these are the files that need modification:

### Primary Files

1. **`frontend/app/dashboard/page.tsx`**
   - Main dashboard page structure
   - Container layout and spacing
   - Section organization

2. **`frontend/components/dashboard/Header.tsx`**
   - Flex layout for title and search
   - Responsive behavior

3. **`frontend/components/dashboard/StatsGrid.tsx`**
   - Responsive grid implementation
   - Card spacing and layout

4. **`frontend/components/ui/Card.tsx`** (create if doesn't exist)
   - Reusable card component
   - Shadow, padding, hover effects

5. **`frontend/components/dashboard/Sidebar.tsx`**
   - Mobile collapsible behavior
   - Desktop fixed positioning

### Supporting Files

6. **`frontend/components/ui/Table.tsx`** (if table component exists)
   - Table wrapper styling
   - Row padding and borders

7. **`frontend/styles/globals.css`**
   - Any global style updates
   - Background colors

---

## Common Issues and Solutions

### Issue: Styles not updating

**Solution**: Clear Next.js cache and restart dev server

```bash
rm -rf .next
npm run dev
```

### Issue: Tailwind classes not applying

**Solution**: Verify `tailwind.config.ts` content paths include all component directories

```ts
content: [
  "./app/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./features/**/*.{ts,tsx}",
],
```

### Issue: Responsive breakpoints not working

**Solution**: Ensure classes are in correct order (mobile-first)

```tsx
// ✅ Correct: mobile-first
className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"

// ❌ Wrong: desktop-first (won't work)
className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1"
```

### Issue: Hover transitions feel janky

**Solution**: Add `transition-all duration-300` for smooth transitions

```tsx
className="shadow-md hover:shadow-xl transition-all duration-300"
```

### Issue: Table overflow not working on mobile

**Solution**: Ensure parent container doesn't have `overflow-hidden`

```tsx
// ✅ Correct
<div className="overflow-x-auto">
  <table>...</table>
</div>

// ❌ Wrong (parent constrains table)
<div className="overflow-hidden">
  <div className="overflow-x-auto">
    <table>...</table>
  </div>
</div>
```

---

## Performance Checklist

- [ ] Build completes without warnings
- [ ] No layout shift on page load
- [ ] Hover transitions run at 60fps
- [ ] No excessive re-renders (check with React DevTools)
- [ ] CSS bundle size is reasonable (<50KB gzipped)

---

## Git Workflow

### Commit Frequently

Make small, focused commits:

```bash
git add frontend/app/dashboard/page.tsx
git commit -m "refactor(dashboard): update container structure with consistent spacing"

git add frontend/components/dashboard/StatsGrid.tsx
git commit -m "refactor(dashboard): implement responsive grid for stats cards"

git add frontend/components/ui/Card.tsx
git commit -m "feat(ui): add reusable Card component with shadow hierarchy"
```

### Push to Remote

```bash
git push origin 001-dashboard-ui-refactor
```

---

## Definition of Done

The implementation is complete when:

- [ ] All acceptance criteria from spec.md are met
- [ ] All manual testing checklists pass
- [ ] All automated tests pass
- [ ] Build completes without errors
- [ ] Code is formatted (prettier)
- [ ] Linter passes with no errors
- [ ] Changes are committed and pushed
- [ ] Pull request is created with before/after screenshots

---

## Next Steps

After implementation:

1. Create pull request
2. Request code review
3. Address feedback
4. Merge to main branch
5. Deploy to staging
6. Verify on production-like environment
7. Deploy to production

---

## Support

For questions or issues:
- Check the [spec.md](./spec.md) for requirements
- Check the [research.md](./research.md) for technical decisions
- Check the [plan.md](./plan.md) for implementation approach
