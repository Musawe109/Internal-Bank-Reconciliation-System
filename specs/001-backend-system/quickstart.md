# Quickstart: Dashboard Redesign Development Setup

**Feature**: Dashboard Redesign - Enterprise Fintech UI
**Branch**: `001-backend-system`
**Last Updated**: 2026-02-22

---

## Prerequisites

Ensure you have the following installed before starting:

```bash
# Required
Node.js >= 20.x
npm >= 10.x
Git >= 2.x

# Recommended
fnm (Fast Node Manager) - for Node version management
```

### Verify Installation

```bash
node --version    # Should output v20.x.x
npm --version     # Should output 10.x.x
git --version     # Should output 2.x.x
```

---

## 1. Clone and Setup

```bash
# Navigate to project root
cd "C:\Users\ts.com\Internal Bank Reconciliation System"

# Install frontend dependencies
cd frontend
npm install

# Verify installation
npm run type-check
```

---

## 2. Environment Configuration

### Frontend Environment

Create `.env.local` in the `frontend/` directory:

```bash
# frontend/.env.local

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_FEATURE_DARK_MODE=false
NEXT_PUBLIC_FEATURE_ADVANCED_FILTERS=true

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENV=development
```

### Backend Environment

If running backend locally, ensure `backend/.env` is configured:

```bash
# backend/.env

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ibrs_dev

# Oracle Connection (for internal transactions)
ORACLE_HOST=
ORACLE_PORT=1521
ORACLE_SERVICE=
ORACLE_USER=
ORACLE_PASSWORD=

# JWT Configuration
JWT_SECRET=your-development-secret-key-min-32-chars
JWT_EXPIRY=1h

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_DIR=./uploads
```

---

## 3. Development Server

### Start Frontend

```bash
cd frontend

# Development mode with hot reload
npm run dev

# Server starts at http://localhost:3000
```

### Start Backend (if needed)

```bash
cd backend

# Using Docker Compose (recommended)
docker-compose up -d

# Or run locally
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 4. Verify Setup

### Frontend Health Check

Open browser to `http://localhost:3000` - should see the application.

### API Health Check

```bash
curl http://localhost:8000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-22T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 5. Design System Development

### View Design Tokens

Design tokens are defined in `frontend/app/globals.css`:

```css
:root {
  /* Color Tokens */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f8fafc;
  /* ... see plan.md for full token list */
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  
  /* Spacing */
  --space-1: 0.25rem;
  /* ... */
}
```

### Component Library Structure

```
frontend/components/
├── ui/           # Base components (Button, Input, Table)
├── layout/       # Layout components (Header, Sidebar)
├── forms/        # Form components
├── data-display/ # Data visualization
├── feedback/     # Toast, Spinner, Alert
└── reconciliation/ # Domain-specific components
```

---

## 6. Development Workflow

### Creating New Components

1. **Create component directory**:
   ```bash
   mkdir frontend/components/ui/MyComponent
   ```

2. **Create component files**:
   ```
   MyComponent/
   ├── MyComponent.tsx      # Component implementation
   ├── MyComponent.test.tsx # Tests
   ├── MyComponent.stories.tsx # Storybook (optional)
   └── index.ts             # Barrel export
   ```

3. **Follow TDD**:
   ```bash
   # Write test first
   npm test -- MyComponent.test
   
   # Then implement
   npm run dev
   ```

### Running Tests

```bash
# Unit tests
npm test

# Test with coverage
npm test -- --coverage

# E2E tests
npm run test:e2e

# Single test file
npm test -- Button.test
```

### Type Checking

```bash
# Run TypeScript type check
npm run type-check

# Watch mode
npm run type-check -- --watch
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## 7. Implementation Order

Follow this sequence for implementing the redesign:

### Phase 1: Design System Foundation

1. **Design Tokens** (`frontend/app/globals.css`)
   - Color palette
   - Typography scale
   - Spacing system
   - Shadows/elevation

2. **Base UI Components** (`frontend/components/ui/`)
   - Button
   - Input
   - Badge
   - Avatar

### Phase 2: Layout Shell

3. **Layout Components** (`frontend/components/layout/`)
   - Header
   - Sidebar
   - Main container

4. **Dashboard Page** (`frontend/app/(dashboard)/page.tsx`)
   - Stat cards
   - Recent reconciliations table

### Phase 3: Core Features

5. **Reconciliation Pages**
   - List view
   - Detail view
   - Upload flow

6. **Transaction Table**
   - Virtualized data table
   - Filters
   - Sorting

### Phase 4: Interactions

7. **Forms & Modals**
   - Override modal
   - Confirmation dialogs

8. **Feedback**
   - Toast notifications
   - Loading states

### Phase 5: Polish

9. **Animations**
   - Page transitions
   - Micro-interactions

10. **Accessibility Audit**
    - Keyboard navigation
    - Screen reader testing

---

## 8. Useful Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
npm test             # Run tests
npm run test:e2e     # E2E tests

# Backend
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f            # View logs
docker-compose exec db psql ...   # Database access
```

---

## 9. Project Structure Reference

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth layout group
│   ├── (dashboard)/         # Dashboard layout group
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles + tokens
│   └── layout.tsx           # Root layout
├── components/               # React components
│   ├── ui/                  # Base primitives
│   ├── layout/              # Layout components
│   ├── forms/               # Form components
│   ├── data-display/        # Data visualization
│   ├── feedback/            # Feedback components
│   └── reconciliation/      # Domain components
├── features/                 # Feature modules
├── hooks/                    # Custom hooks
├── lib/                      # Utilities
│   ├── api.ts               # API client
│   ├── utils.ts             # Helpers
│   └── validators.ts        # Zod schemas
├── stores/                   # Zustand stores
├── styles/                   # Design tokens
├── types/                    # TypeScript types
└── tests/                    # Test files
```

---

## 10. Common Issues & Solutions

### Issue: Port 3000 already in use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: TypeScript errors after install

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run type-check
```

### Issue: API CORS errors

Ensure backend `ALLOWED_ORIGINS` includes frontend URL:
```bash
ALLOWED_ORIGINS=http://localhost:3000
```

### Issue: Database connection failed

```bash
# Check backend is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

---

## 11. Resources

### Documentation

- [Plan Document](./plan.md) - Full implementation plan
- [Research](./research.md) - Design research and decisions
- [Data Model](./data-model.md) - Entity definitions
- [API Contracts](./contracts/) - OpenAPI spec and TypeScript types

### Design References

- [Stripe Dashboard](https://stripe.com/dashboard) - Enterprise fintech reference
- [Linear](https://linear.app) - Modern UI patterns
- [Vercel Dashboard](https://vercel.com/dashboard) - Clean data display

### Technology Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Virtual](https://tanstack.com/virtual)

---

## 12. Getting Help

### Internal Resources

- Check `specs/001-backend-system/` for feature documentation
- Review existing components in `frontend/components/`
- Ask in team chat for quick questions

### External Resources

- Stack Overflow (tags: nextjs, react, tailwindcss)
- GitHub Issues for library-specific problems
- Discord/Slack communities for real-time help

---

**Ready to start development?** Run `npm run dev` in the frontend directory and open `http://localhost:3000`.

**Need to create tasks?** Run `/sp.tasks` to generate the implementation task list.
