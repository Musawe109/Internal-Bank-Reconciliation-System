# Quickstart: Frontend Development Setup

**Feature**: 001-frontend-architecture
**Date**: 2026-02-25
**Purpose**: Get developers up and running quickly with the frontend

---

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

---

## 1. Clone and Install

```bash
# Navigate to project root
cd "C:\Users\ts.com\Internal Bank Reconciliation System"

# Install frontend dependencies
cd frontend
npm install
```

---

## 2. Environment Configuration

Create `.env.local` file in the `frontend` directory:

```bash
# Copy example
cp .env.example .env.local
```

Edit `.env.local`:

```env
# API Base URL (required)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Development settings
NEXT_PUBLIC_DEBUG=true
```

**Environment Variables**:
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_DEBUG` | No | Enable debug logging (true/false) |

---

## 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

---

## 4. Verify Setup

1. Open browser to `http://localhost:3000`
2. You should see the dashboard (or redirect to login if auth is enabled)
3. Check browser console for errors

---

## Development Commands

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Start production server (after build)
npm run start

# Format code
npm run format

# Check formatting
npm run format:check
```

---

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── upload/       # Upload page
│   │   ├── reconciliation/
│   │   │   └── [id]/     # Detail page
│   │   ├── audit/        # Audit log page
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── upload/       # Upload components
│   │   ├── reconciliation/
│   │   └── audit/        # Audit components
│   ├── lib/              # Utilities
│   │   ├── api/          # API client
│   │   ├── types/        # TypeScript types
│   │   ├── enums/        # Enum definitions
│   │   └── config/       # Configuration
│   └── hooks/            # Custom React hooks
├── tests/                # Test files
├── .env.local            # Local environment variables
├── .env.example          # Environment template
├── next.config.js        # Next.js config
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

---

## Key Files to Know

### API Client

`src/lib/api/client.ts` - Centralized API client

```typescript
import { apiClient } from '@/lib/api/client';

// GET request
const response = await apiClient.get<ReconciliationResponse>('/reconciliation/items');

// POST request
const result = await apiClient.post<UploadResponse>('/uploads/csv', formData);
```

### Type Definitions

`src/lib/types/reconciliation.ts` - Core types

```typescript
import type { ReconciliationItem, WorkflowState } from '@/lib/types/reconciliation';
```

### Enums

`src/lib/enums/workflow-state.ts` - Enum definitions

```typescript
import { WorkflowState } from '@/lib/enums/workflow-state';
```

---

## Common Tasks

### Add a New Page

1. Create folder in `src/app/`:
   ```bash
   mkdir src/app/settings
   ```

2. Create `page.tsx`:
   ```typescript
   export default function SettingsPage() {
     return <div>Settings</div>;
   }
   ```

3. Navigate to `/settings`

### Add a New Component

1. Create component file:
   ```typescript
   // src/components/ui/my-component/MyComponent.tsx
   import { type FC } from 'react';
   
   interface MyComponentProps {
     title: string;
   }
   
   export const MyComponent: FC<MyComponentProps> = ({ title }) => {
     return <div>{title}</div>;
   };
   ```

2. Export from index:
   ```typescript
   // src/components/ui/my-component/index.ts
   export { MyComponent } from './MyComponent';
   ```

### Add API Endpoint

1. Add to endpoints file:
   ```typescript
   // src/lib/api/endpoints.ts
   export const endpoints = {
     // ... existing endpoints
     settings: {
       get: () => '/settings',
       update: () => '/settings',
     },
   };
   ```

2. Add type:
   ```typescript
   // src/lib/types/settings.ts
   export interface Settings {
     // ... settings fields
   }
   ```

3. Use in component:
   ```typescript
   const settings = await apiClient.get<SettingsResponse>(endpoints.settings.get());
   ```

---

## Testing

### Run Unit Tests

```bash
npm run test
```

### Run Specific Test File

```bash
npm run test -- src/components/ui/table/__tests__/table.test.tsx
```

### Run E2E Tests

```bash
# Start dev server in one terminal
npm run dev

# Run E2E tests in another terminal
npm run test:e2e
```

---

## Debugging

### Enable Debug Mode

Add to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

### Browser DevTools

- React DevTools: Inspect component tree
- Network tab: Monitor API calls
- Console: View logs and errors

### VS Code Debugging

Add to `.vscode/launch.json`:
```json
{
  "name": "Debug Next.js",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/frontend"
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors

```bash
# Run type check to see errors
npm run type-check
```

### API Calls Failing

1. Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. Verify backend is running
3. Check browser console for CORS errors

---

## Code Style

### ESLint Rules

- TypeScript strict mode enforced
- No `any` types
- No console.log in production
- All imports sorted

### Formatting

Code is auto-formatted on save with Prettier. Manual formatting:

```bash
npm run format
```

### Commit Messages

Follow conventional commits:
```
feat: add reconciliation filter
fix: resolve pagination bug
docs: update API contracts
test: add table component tests
```

---

## Next Steps

1. Read the [specification](./spec.md) for feature requirements
2. Review [API contracts](./contracts/api-contracts.md)
3. Understand [data models](./data-model.md)
4. Start with Phase 0: Project Initialization

---

## Getting Help

- Check existing issues in the repository
- Review the constitution for development principles
- Ask in team chat with `#frontend` tag
