# Backend - Internal Bank Reconciliation System

FastAPI backend for the Internal Bank Reconciliation System (IBRS).

## Features

- **CSV Upload & Reconciliation**: Upload bank statements, automatically match with internal transactions
- **Workflow Approval**: Submit, approve, or reject reconciliation sessions
- **Manual Override**: Reclassify transactions with mandatory reason logging
- **Audit Logging**: Immutable audit trail of all actions
- **Dual Database**: PostgreSQL for application data, Oracle (read-only) for financial data

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Oracle client libraries (if connecting to Oracle)

### Development Setup

1. **Clone and navigate to backend**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

4. **Configure environment**:
   ```bash
   copy .env.example .env
   ```
   Edit `.env` with your database credentials.

5. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start the server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Deployment

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

3. **Access API**: http://localhost:8000
4. **API Docs**: http://localhost:8000/docs

## API Endpoints

### Reconciliation
- `POST /api/reconciliation` - Upload CSV for reconciliation
- `GET /api/reconciliation` - List reconciliation sessions
- `GET /api/reconciliation/{id}` - Get reconciliation details

### Transactions
- `GET /api/reconciliation/{id}/transactions` - Get transactions with filters
- `PUT /api/transactions/{id}/classification` - Manual override

### Workflow
- `POST /api/reconciliation/{id}/submit` - Submit for approval
- `POST /api/reconciliation/{id}/approve` - Approve reconciliation
- `POST /api/reconciliation/{id}/reject` - Reject reconciliation

### Audit
- `GET /api/audit-log` - Get audit log entries

### Health
- `GET /api/health` - Health check endpoint

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/          # API endpoint handlers
│   ├── core/                # Configuration, exceptions, responses
│   ├── db/                  # Database connections
│   ├── models/              # SQLModel database models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── services/            # Business logic layer
│   └── main.py              # FastAPI application entry
├── alembic/                 # Database migrations
├── tests/                   # Test suites
├── Dockerfile               # Production Docker image
├── docker-compose.yml       # Development Docker setup
└── requirements.txt         # Python dependencies
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/ibrs` |
| `ORACLE_DSN` | Oracle connection DSN | - |
| `ORACLE_USER` | Oracle read-only user | - |
| `ORACLE_PASSWORD` | Oracle password | - |
| `SECRET_KEY` | JWT secret key | - |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `DEBUG` | Enable debug mode | `true` |

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/unit/test_reconciliation.py
```

## Performance

- **Target**: 100k transactions processed in ≤30 seconds
- **Algorithm**: O(n log n) hash-based matching
- **Indexes**: Optimized queries on amount, reference, date, classification

## License

Internal use only.
