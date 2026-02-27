# Research: Frontend Architecture (Phase 1)

**Feature**: 001-frontend-architecture
**Date**: 2026-02-25
**Purpose**: Resolve technical unknowns and document decisions for frontend implementation

---

## 1. Next.js 14+ App Router Best Practices

### Decision
Use Next.js 14+ with App Router, leveraging Server Components by default and Client Components only when interactivity is required.

### Rationale
- **Server Components**: Default for all pages that fetch data, providing automatic code splitting, zero bundle size for server-only code, and direct backend access
- **Client Components**: Used sparingly for interactive components (forms, filters, drag-and-drop, modals)
- **Nested Layouts**: App Router supports nested layouts for shared UI (sidebar, header) across route groups
- **Data Fetching**: Server components fetch data on server, client components use React Query or SWR for client-side caching

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Next.js 13 Pages Router | App Router is the future, better for nested layouts and server components |
| Pure Client-Side SPA | Loses SEO, initial load performance, and server-side data fetching benefits |
| Remix | Less mature ecosystem, App Router provides similar server-side capabilities |

### Implementation Pattern
```typescript
// Server Component (default) - app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetch(`${API_URL}/dashboard`, { cache: 'no-store' });
  return <DashboardClient data={data} />;
}

// Client Component - needs 'use client' directive
'use client';
export function DashboardClient({ data }) {
  const [filters, setFilters] = useState({});
  // Interactive logic here
}
```

---

## 2. Pagination/Virtualization for Large Tables

### Decision
Use **TanStack Table v8** for table logic with **server-side pagination** as primary approach. For client-side virtualization with already-fetched data, use **@tanstack/react-virtual**.

### Rationale
- **TanStack Table**: Headless, framework-agnostic, supports sorting, filtering, pagination out of box
- **Server-side pagination**: Fetch only required rows (e.g., 50 per page), critical for 100k+ datasets
- **Virtualization**: For cases where data is already loaded, renders only visible rows
- **Combined approach**: Server pagination for initial load, virtualization for current page

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| react-window | Lower-level, requires manual implementation of table logic |
| react-virtual | Similar to react-window, TanStack Virtual is more React-friendly |
| AG Grid / Material Table | Heavy bundles, locked into specific UI frameworks |
| Custom pagination | Reinventing wheel, TanStack is well-tested and maintained |

### Implementation Pattern
```typescript
// Server-side pagination
const response = await fetch(`${API_URL}/reconciliation?page=${page}&pageSize=${pageSize}`);

// TanStack Table with virtualization
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  manualPagination: true, // Server-side
  pageCount: Math.ceil(total / pageSize),
});
```

---

## 3. TypeScript Strict Mode Configuration

### Decision
Enable full TypeScript strict mode with additional strict flags for maximum type safety. No `any` types allowed in production code.

### Rationale
- Catches bugs at compile time
- Enforces explicit handling of undefined/null
- Ensures function parameter types are always defined
- Prevents implicit `any` from creeping in

### Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}
```

### API Response Typing Pattern
```typescript
// Generic API response type
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

// Specific response types
type ReconciliationResponse = ApiResponse<ReconciliationItem[]>;
type UploadResponse = ApiResponse<{ uploadId: string; recordCount: number }>;

// Use in API client
async function getReconciliationItems(): Promise<ReconciliationResponse> {
  // Implementation
}
```

---

## 4. Centralized API Client Patterns

### Decision
Create a centralized fetch wrapper in `lib/api/client.ts` with standardized error handling, timeouts, retry logic, and request/response interceptors.

### Rationale
- Single source of truth for API configuration
- Consistent error handling across all components
- Easy to add auth tokens, logging, monitoring
- Simplifies testing with mockable client

### Implementation Pattern
```typescript
// lib/api/client.ts
type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  timeout?: number;
  retries?: number;
};

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', body, retries = 3 } = config;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(response.status, response.statusText);
        }

        return await response.json();
      } catch (error) {
        if (attempt === retries) throw error;
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Convenience methods
  get<T>(endpoint: string) { return this.request<T>(endpoint); }
  post<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: 'POST', body }); }
  put<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: 'PUT', body }); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, { method: 'DELETE' }); }
}

// Error class
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Export singleton
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL!);
```

### Error Handling Strategy
```typescript
// lib/api/errors.ts
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export function handleApiError(error: unknown): ErrorCode {
  if (error instanceof ApiError) {
    if (error.status === 401) return ErrorCode.UNAUTHORIZED;
    if (error.status === 403) return ErrorCode.FORBIDDEN;
    if (error.status === 404) return ErrorCode.NOT_FOUND;
    if (error.status >= 500) return ErrorCode.SERVER_ERROR;
  }
  if (error instanceof Error && error.name === 'AbortError') return ErrorCode.TIMEOUT;
  return ErrorCode.NETWORK_ERROR;
}
```

---

## 5. Tailwind CSS Enterprise Dashboard Patterns

### Decision
Use Tailwind CSS with custom configuration for enterprise theming, component-based utility classes, and responsive design patterns.

### Rationale
- Utility-first approach speeds development
- Custom theme configuration for brand consistency
- Responsive utilities built-in
- Small bundle size with PurgeCSS
- Extensive ecosystem and documentation

### Configuration Pattern
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        status: {
          matched: '#22c55e',
          unmatched: '#ef4444',
          pending: '#f59e0b',
          flagged: '#dc2626',
          resolved: '#16a34a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Reusable Component Pattern
```typescript
// components/ui/status-badge/StatusBadge.tsx
import { type FC } from 'react';
import { type WorkflowState } from '@/lib/enums/workflow-state';

const statusClasses: Record<WorkflowState, string> = {
  matched: 'bg-green-100 text-green-800',
  unmatched: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  flagged: 'bg-red-200 text-red-900',
  resolved: 'bg-green-200 text-green-900',
};

interface StatusBadgeProps {
  status: WorkflowState;
  label?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, label }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {label || status}
    </span>
  );
};
```

---

## Summary of Technology Decisions

| Area | Decision | Alternative Rejected |
|------|----------|---------------------|
| Framework | Next.js 14+ App Router | Pages Router, Remix, pure SPA |
| Table Library | TanStack Table v8 | AG Grid, Material Table, custom |
| Virtualization | @tanstack/react-virtual | react-window |
| State Management | Server Components + minimal client state | Redux, Zustand, Jotai |
| API Client | Custom fetch wrapper | Axios, React Query (for mutations) |
| Styling | Tailwind CSS | Material UI, Chakra, styled-components |
| Testing | Jest + React Testing Library + Playwright | Vitest, Cypress |
| TypeScript | Strict mode, no `any` | Loose typing, gradual migration |

---

## Unresolved Questions

None. All technical unknowns have been resolved through research.
