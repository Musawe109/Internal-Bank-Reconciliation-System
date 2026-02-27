# Internal Bank Reconciliation System - Frontend

Enterprise reconciliation dashboard for bank reconciliation officers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x
- **Testing**: Jest, React Testing Library, Playwright
- **State**: Server Components + minimal client state

## Quick Start

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

```bash
# Install dependencies
cd frontend
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local and set your API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build & Run
npm run build        # Production build
npm run start        # Start production server

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests (requires dev server)

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

## Project Structure

```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── upload/             # CSV upload page
│   ├── reconciliation/     # Reconciliation pages
│   │   └── [id]/           # Detail page (dynamic)
│   ├── audit/              # Audit log page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home (redirects to dashboard)
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── status-badge/   # Status indicator badges
│   │   ├── table/          # Table components
│   │   ├── dialog/         # Dialog components
│   │   ├── loading/        # Loading states
│   │   ├── empty/          # Empty states
│   │   ├── error/          # Error states
│   │   └── toast/          # Toast notifications
│   ├── dashboard/          # Dashboard components
│   ├── upload/             # Upload components
│   ├── reconciliation/     # Reconciliation components
│   └── audit/              # Audit components
├── lib/
│   ├── api/                # API client & services
│   │   ├── client.ts       # Centralized fetch wrapper
│   │   ├── endpoints.ts    # Endpoint definitions
│   │   ├── types.ts        # API types
│   │   ├── errors.ts       # Error classes
│   │   ├── reconciliation.ts
│   │   ├── uploads.ts
│   │   └── audit.ts
│   ├── enums/              # Enum definitions
│   ├── types/              # TypeScript types
│   └── config/             # Configuration
└── hooks/                  # Custom React hooks
    └── use-api.ts          # API hook

tests/
├── unit/                   # Unit tests
├── components/             # Component tests
├── integration/            # Integration tests
└── e2e/                    # E2E tests (Playwright)
```

## Features

### Dashboard
- Reconciliation summary cards
- Quick actions
- Navigation to all sections

### CSV Upload
- Drag-and-drop file upload
- File validation (type, size)
- Upload progress tracking
- Upload history

### Reconciliation Items
- Paginated table (configurable page size)
- Multi-criteria filtering
- Column sorting
- Search functionality
- Classification dropdown per item
- Status badges

### Reconciliation Detail
- Transaction comparison (bank vs internal)
- Variance highlighting
- Classification management
- Workflow actions (resolve, flag, override)
- Confirmation dialogs

### Audit Log
- Chronological event list
- Expandable event details
- Before/after state comparison
- Multi-criteria filtering
- Immutable read-only design

## API Integration

All API calls go through the centralized client:

```typescript
import { getReconciliationItems } from '@/lib/api/reconciliation';

// Fetch items with filters
const items = await getReconciliationItems({
  status: 'unmatched',
  page: 1,
  pageSize: 50,
});
```

## State Management

- **Server state**: Fetched via API services
- **Client state**: React hooks for local UI state
- **No global state library**: Minimal external dependencies

## Type Safety

- TypeScript strict mode enabled
- No `any` types allowed
- All API responses typed
- Enums for fixed values (status, classification, workflow states)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_DEBUG` | No | Enable debug mode (true/false) |

## Code Quality

### ESLint Rules
- TypeScript strict rules enabled
- No unused variables (except prefixed with `_`)
- Consistent type imports

### Prettier Config
- Single quotes
- 100 character line width
- 2 space tabs
- LF line endings

## Testing Strategy

1. **Unit Tests**: Utility functions, API client
2. **Component Tests**: Reusable UI components
3. **Integration Tests**: API layer, hooks
4. **E2E Tests**: Critical user flows (Playwright)

Run tests:
```bash
npm run test           # Unit + component tests
npm run test:e2e       # E2E tests
```

## Performance Guidelines

- Pagination for all tables (default 50 items/page)
- Virtualization ready for large datasets
- Server Components for data fetching
- Minimal client-side state

## Accessibility

- WCAG 2.1 AA target compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support

## Security

- No sensitive data in client storage
- Auth tokens in localStorage (consider httpOnly cookies for production)
- All workflow actions via API (no local state changes)
- Input validation on all forms

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm run test`
4. Run lint: `npm run lint`
5. Run type check: `npm run type-check`
6. Submit PR

## License

Internal use only.
