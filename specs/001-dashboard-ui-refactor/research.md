# Research: Dashboard UI Layout and Spacing Refinement

**Feature**: 001-dashboard-ui-refactor  
**Date**: 2026-02-25  
**Purpose**: Document technical research for Tailwind CSS responsive design, spacing systems, and visual depth patterns

---

## 1. Tailwind CSS 4.x Responsive Design Patterns

### Research Question
What are the best practices for implementing responsive grid layouts in Tailwind CSS 4.x?

### Decision
Use mobile-first responsive breakpoints with progressive enhancement:
- `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`

### Rationale
Tailwind CSS 4.x maintains the same responsive utility class system as v3 but with improved performance. The mobile-first approach ensures:
- Default styles work on all devices
- Breakpoints add complexity progressively
- Cleaner HTML with no arbitrary values

### Breakpoint Reference (Tailwind Default)
| Breakpoint | Min Width | Class Prefix |
|------------|-----------|--------------|
| sm         | 640px     | sm:          |
| md         | 768px     | md:          |
| lg         | 1024px    | lg:          |
| xl         | 1280px    | xl:          |
| 2xl        | 1536px    | 2xl:         |

### Alternatives Considered
- **Custom breakpoints**: Rejected - adds complexity, standard breakpoints work well
- **Container queries**: Rejected - limited browser support, overkill for this use case

---

## 2. Spacing Scale and Consistency

### Research Question
What spacing values create consistent vertical rhythm in a dashboard layout?

### Decision
Use Tailwind's spacing scale with these key values:
- `space-y-8` = 2rem (32px) - between major sections
- `p-6` = 1.5rem (24px) - card padding
- `gap-6` = 1.5rem (24px) - grid gaps
- `px-6 py-4` = 24px horizontal, 16px vertical - table rows

### Rationale
Tailwind's spacing scale is based on 0.25rem (4px) increments, providing:
- Consistent visual rhythm
- Easy mental model (multiply by 4 for pixels)
- Good balance between granularity and simplicity

### Spacing Scale Reference
| Class | Value | Pixels |
|-------|-------|--------|
| p-4   | 1rem  | 16px   |
| p-5   | 1.25rem | 20px |
| p-6   | 1.5rem | 24px  |
| p-8   | 2rem  | 32px   |
| space-y-6 | 1.5rem | 24px |
| space-y-8 | 2rem | 32px  |

### Alternatives Considered
- **Custom spacing scale**: Rejected - adds complexity, default scale is comprehensive
- **Using margins only**: Rejected - mixing margin/padding creates inconsistency

---

## 3. Shadow Layering for Visual Depth

### Research Question
How to create visual hierarchy using shadow depths without appearing flat?

### Decision
Implement three-tier shadow hierarchy:
- `shadow-lg` - outer containers (dashboard wrapper)
- `shadow-md` - cards and components
- `shadow-xl` - hover states and elevated elements

### Rationale
Layered shadows create depth perception:
- Outer container has largest shadow to "lift" entire dashboard
- Cards have medium shadow for individual elevation
- Hover states increase shadow for interactive feedback
- Transition duration of 300ms feels smooth and premium

### Shadow Reference (Tailwind Default)
| Class | Value | Use Case |
|-------|-------|----------|
| shadow-md | 0 4px 6px -1px rgba(0,0,0,0.1) | Cards, panels |
| shadow-lg | 0 10px 15px -3px rgba(0,0,0,0.1) | Containers, modals |
| shadow-xl | 0 20px 25px -5px rgba(0,0,0,0.1) | Hover, dropdowns |

### Transition Timing
```css
transition-all duration-300
```
- 300ms is the sweet spot for UI transitions
- Long enough to feel smooth, short enough to feel responsive

### Alternatives Considered
- **Flat design with borders only**: Rejected - lacks visual depth, feels dated
- **Heavy shadows everywhere**: Rejected - creates visual noise, reduces hierarchy

---

## 4. Mobile-First Responsive Patterns

### Research Question
What patterns ensure proper mobile behavior for dashboard components?

### Decision

#### 4.1 Collapsible Sidebar
Use state-based collapse with hamburger menu trigger on mobile:
```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);

// Mobile: overlay sidebar when open
// Desktop: always visible
```

**Pattern**: Hidden on mobile by default, slides in when triggered. Fixed position on desktop.

#### 4.2 Table Horizontal Scrolling
Wrap tables in container with `overflow-x-auto`:
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">...</table>
</div>
```

**Pattern**: Container scrolls horizontally while rest of page remains static.

#### 4.3 Flex Container Stacking
Use `flex-col lg:flex-row` for responsive flex layouts:
```tsx
<div className="flex flex-col lg:flex-row gap-4">
  {/* Stacks on mobile, side-by-side on desktop */}
</div>
```

**Pattern**: Default mobile behavior is vertical stacking, desktop switches to horizontal.

### Alternatives Considered
- **Responsive tables with card layout on mobile**: Rejected - more complex, horizontal scroll preserves column relationships
- **Hidden sidebar on desktop**: Rejected - desktop users benefit from always-visible navigation

---

## 5. Next.js 16 + Tailwind CSS 4 Integration

### Research Question
How to properly configure Tailwind CSS 4 in Next.js 16?

### Decision
Use `@tailwindcss/postcss` package with default configuration.

### Setup
```bash
npm install tailwindcss @tailwindcss/postcss
```

**postcss.config.mjs**:
```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

**tailwind.config.ts**:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  // ... custom theme extensions
};
export default config;
```

### Performance Optimization
Tailwind CSS 4 includes:
- Improved JIT compiler (faster builds)
- Smaller CSS output (better tree-shaking)
- Native CSS nesting support

### Alternatives Considered
- **Tailwind v3**: Rejected - v4 has better performance and Next.js 16 compatibility
- **CSS-in-JS solutions**: Rejected - Tailwind provides better performance and smaller bundle

---

## 6. Border Radius for Modern UI

### Research Question
What border radius values create a modern, premium feel?

### Decision
Use large border radius for primary containers:
- `rounded-3xl` = 1.5rem (24px) - dashboard container
- `rounded-2xl` = 1rem (16px) - cards, panels
- `rounded-xl` = 0.75rem (12px) - inputs, buttons

### Rationale
Larger border radius creates:
- Friendlier, more approachable UI
- Modern SaaS aesthetic
- Better visual separation between layers

### Border Radius Reference
| Class | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| rounded-xl | 0.75rem | 12px | Buttons, inputs |
| rounded-2xl | 1rem | 16px | Cards, panels |
| rounded-3xl | 1.5rem | 24px | Main containers |

---

## 7. Typography Hierarchy

### Research Question
How to establish clear typography hierarchy for dashboard content?

### Decision
Three-tier hierarchy using font weight and color:

| Element | Weight | Color | Size |
|---------|--------|-------|------|
| Headings | semibold (600) | slate-800 | default |
| Secondary | normal (400) | slate-500 | default |
| Numbers/Stats | bold (700) | slate-800 | 3xl (30px) |

### Rationale
- Font weight creates hierarchy without size changes
- Color contrast (slate-800 vs slate-500) indicates importance
- Large numbers draw attention to key metrics

---

## Summary of Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Responsive Grid | Mobile-first breakpoints | Standard pattern, works everywhere |
| Spacing Scale | Tailwind default (4px increments) | Consistent, predictable |
| Shadow System | Three-tier (md/lg/xl) | Clear visual hierarchy |
| Sidebar Pattern | Collapsible on mobile | Space-efficient, familiar UX |
| Table Behavior | Horizontal scroll | Preserves data relationships |
| Border Radius | Large (xl/2xl/3xl) | Modern SaaS aesthetic |
| Transition Timing | 300ms | Smooth but responsive |

---

## References

- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Responsive Design Patterns](https://tailwindcss.com/docs/responsive-design)
- [Box Shadow Utilities](https://tailwindcss.com/docs/box-shadow)
