# Internal Bank Reconciliation System (IBRS)

An enterprise-grade financial reconciliation platform designed to automate and streamline the matching of bank statements with internal transaction records.

## 🚀 Overview

The Internal Bank Reconciliation System (IBRS) provides a robust solution for bank reconciliation officers to manage, verify, and audit financial transactions. It features high-performance automated matching, comprehensive workflow approvals, and a full audit trail.

### Key Features

-   **Automated Reconciliation**: O(n log n) hash-based matching engine capable of processing 100k transactions in ≤30 seconds.
-   **CSV Ingestion**: Flexible drag-and-drop upload for bank statements with real-time validation.
-   **Workflow Management**: Structured approval process (Submit → Review → Approve/Reject) for reconciliation sessions.
-   **Manual Override**: Secure reclassification of transactions with mandatory reason logging for exceptions.
-   **Immutable Audit Trail**: Comprehensive logging of all system actions for compliance and transparency.
-   **Dual Database Architecture**: Optimized performance using PostgreSQL for application state and read-only Oracle integration for financial data.

## 🏗️ Architecture

The system follows a modern decoupled architecture:

-   **Frontend**: Next.js 14 application providing a high-performance, accessible dashboard.
-   **Backend**: FastAPI (Python 3.11+) REST API handling business logic, reconciliation algorithms, and data persistence.
-   **Storage**: 
    -   **PostgreSQL**: Primary store for application data, user sessions, and reconciliation results.
    -   **Oracle**: Integration point for legacy financial transaction records.

## 🛠️ Tech Stack

### Backend
-   **Framework**: FastAPI
-   **Database**: SQLModel (SQLAlchemy + Pydantic)
-   **Migrations**: Alembic
-   **Testing**: Pytest
-   **Containerization**: Docker & Docker Compose

### Frontend
-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Testing**: Jest, React Testing Library, Playwright
-   **UI Components**: Custom accessible components (WCAG 2.1 AA target)

## 📁 Project Structure

```
.
├── backend/            # FastAPI application logic and API
├── frontend/           # Next.js dashboard and UI components
├── specs/              # Technical specifications and design documents
└── .specify/           # Project templates and configuration
```

## 🚦 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Python 3.11+

### Local Setup

1.  **Clone the repository**
2.  **Backend Setup**:
    ```bash
    cd backend
    copy .env.example .env  # Configure your variables
    pip install -r requirements.txt
    alembic upgrade head
    uvicorn app.main:app --reload
    ```
3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    cp .env.example .env.local
    npm run dev
    ```

For detailed instructions, see the [Backend README](./backend/README.md) and [Frontend README](./frontend/README.md).

## 📄 Documentation

Technical specifications, data models, and workflow diagrams can be found in the `/specs` directory:
- [Data Model](./specs/001-backend-system/data-model.md)
- [Reconciliation Engine](./specs/reconciliation-engine.md)
- [Workflow Design](./specs/workflow.md)

## 🔐 License

Internal use only.
