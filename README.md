# AI-Assisted Multi-Agent Recruitment Management System

**A full-stack AI recruitment pipeline with Human-in-the-Loop safety gate**

---

## Architecture Overview

Three independent tiers, each with a single responsibility. Boundaries are enforced — no tier talks to a non-adjacent tier.

```
┌──────────────────────────────────────────────────────────────┐
│                         Browser                              │
│              React + Vite (port 5173 / 80)                   │
└────────────────────────┬─────────────────────────────────────┘
                         │ JWT-secured REST
                         ▼
┌──────────────────────────────────────────────────────────────┐
│               Spring Boot 3.3  (port 8080)                   │
│   Auth · Jobs · Candidates · Resumes · Evaluations           │
│   HITL Gate · Email · Flyway migrations                      │
└────────────────────────┬─────────────────────────────────────┘
                         │ Internal HTTP (no auth)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│            Python FastAPI + LangGraph  (port 8000)           │
│   Multi-agent pipeline: Screen → Questions → Evaluate        │
│   Google Gemini · Pydantic output validation · Stateless     │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
                    MySQL 8  (port 3306)
```

---

## Tech Stack

| Layer      | Technology                                           |
|------------|------------------------------------------------------|
| Frontend   | React 19, Vite, TypeScript, Tailwind CSS v3, shadcn/ui, React Query v5, Zustand, Framer Motion |
| Backend    | Spring Boot 3.3, Spring Security 6, Spring Data JPA, Flyway, JWT (jjwt 0.12) |
| AI Service | Python 3.11, FastAPI, LangGraph, LangChain, Google Gemini |
| Database   | MySQL 8.0                                            |
| DevOps     | Docker, Docker Compose, nginx                        |

---

## Features

- **Multi-agent AI pipeline** — three independent LangGraph nodes: screening (resume vs. job), question generation, and interview evaluation
- **Human-in-the-Loop approval gate** — no interview invite can be sent until a recruiter explicitly approves the evaluation in the UI
- **JWT-secured REST APIs** — stateless Spring Security filter chain; every endpoint requires a Bearer token except login/register
- **PDF resume parsing** — Apache PDFBox extracts raw text from uploaded PDFs; text is stored and passed verbatim to the AI
- **Production React frontend** — Linear/Vercel aesthetic; command palette (Cmd+K); animated score ring; mobile-responsive sheet navigation
- **Docker deployment** — single `docker-compose up --build` starts all four services

---

## System Flow

1. Recruiter logs in → receives JWT
2. Creates a job posting with a description
3. Uploads a candidate's PDF resume against a specific job
4. Triggers **AI Screening** → LangGraph scores the resume, returns match score + recommendation
5. If CONSIDER or HIRE → recruiter triggers **Question Generation** → AI produces technical + behavioural questions
6. Recruiter conducts the interview, pastes the transcript
7. Triggers **Interview Evaluation** → AI scores the interview, returns HIRE / CONSIDER / REJECT
8. Recruiter reviews the evaluation in the **HITL Gate**
9. If Approved → recruiter clicks **Send Invite** → email dispatched to candidate
10. All evaluations visible in Dashboard with real-time stats

---

## Quick Start — Docker

```bash
cp .env.example .env
# Edit .env: set MYSQL_ROOT_PASSWORD, JWT_SECRET, GOOGLE_API_KEY
docker-compose up --build
```

Frontend → http://localhost  
Backend API → http://localhost:8080  
AI Service → http://localhost:8000

---

## Quick Start — Local Development

### Prerequisites

- Java 17+, Maven 3.9+
- Python 3.11+
- Node.js 20+
- MySQL 8.0 running locally (database: `recruitdb`)

### 1. MySQL

```sql
CREATE DATABASE IF NOT EXISTS recruitdb;
```

### 2. Backend

```bash
cd backend
# Edit src/main/resources/application.yml — set DB password
mvn spring-boot:run
```

### 3. AI Service

```bash
cd ai-service
cp .env.example .env
# Edit .env — set GOOGLE_API_KEY
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend → http://localhost:5173

---

## API Reference

| Method | Path                          | Auth | Description                              |
|--------|-------------------------------|------|------------------------------------------|
| POST   | /auth/register                | No   | Register a new recruiter account         |
| POST   | /auth/login                   | No   | Login, returns JWT                       |
| GET    | /jobs                         | Yes  | List all jobs                            |
| POST   | /jobs                         | Yes  | Create a job posting                     |
| GET    | /dashboard/stats              | Yes  | Total jobs, candidates, pending evals    |
| POST   | /resumes/upload               | Yes  | Upload PDF resume (multipart/form-data)  |
| POST   | /screen                       | Yes  | Trigger AI screening for a resume        |
| POST   | /questions/generate           | Yes  | Generate interview questions             |
| POST   | /interview/evaluate           | Yes  | Submit transcript for AI evaluation      |
| GET    | /evaluations/recent           | Yes  | Last 5 evaluations                       |
| POST   | /interview/{id}/approve       | Yes  | HITL: approve an evaluation              |
| POST   | /interview/{id}/reject        | Yes  | HITL: reject an evaluation               |
| POST   | /interview/{id}/send-invite   | Yes  | Send interview invite (requires APPROVED)|

---

## Project Structure

```
ai-recruitment/
├── backend/                  # Spring Boot 3.3 — Java 17
│   ├── src/main/java/com/recruit/
│   │   ├── config/           # Security, CORS, JWT, exception handler
│   │   ├── controller/       # REST endpoints
│   │   ├── dto/              # API contracts (never expose entities)
│   │   ├── entity/           # JPA entities + enums
│   │   ├── repository/       # Spring Data JPA interfaces
│   │   └── service/          # Business logic + EvaluationMapper
│   └── src/main/resources/
│       ├── application.yml         # Shared config + active profile
│       ├── application-dev.yml     # Dev overrides (Mailtrap, show-sql)
│       ├── application-prod.yml    # Prod overrides (validate DDL, no SQL log)
│       └── db/migration/
│           └── V1__init_schema.sql # Flyway baseline
│
├── ai-service/               # Python 3.11 — FastAPI + LangGraph
│   ├── app/
│   │   ├── main.py           # FastAPI app + routes
│   │   ├── agents/           # LangGraph nodes + prompts
│   │   └── models/           # Pydantic output schemas
│   └── requirements.txt
│
├── frontend/                 # React 19 — Vite + TypeScript
│   ├── src/
│   │   ├── api/              # Typed API functions
│   │   ├── components/       # shadcn/ui + custom (ScoreRing, HitlGate)
│   │   ├── pages/            # Route-level pages
│   │   ├── store/            # Zustand: auth + theme
│   │   └── lib/              # axios, errors, jwt decode, navigation
│   └── nginx.conf            # Production static + API proxy
│
├── docker-compose.yml        # Full stack: mysql + backend + ai-service + frontend
├── .env.example              # Template for docker-compose secrets
├── decisions.md              # Architecture Decision Records
└── README.md
```

---

## Architecture Decisions

See [decisions.md](decisions.md) for full ADRs. Key principles:

- **Java owns state, Python owns AI** — Spring Boot is the system of record; the AI service is stateless
- **HITL gate enforced at the API level** — email dispatch is refused unless `evaluation.status == APPROVED`; the UI cannot bypass this
- **Every AI output validated via Pydantic** — if the LLM returns malformed JSON, the error surfaces immediately rather than corrupting the database
- **Entities never leave the service layer** — DTOs cross every boundary; JPA entities stay inside `service/` and below
- **Flyway manages the schema** — in dev, `ddl-auto: update` runs alongside Flyway for convenience; in prod, `ddl-auto: validate` makes Flyway the sole source of truth

---

## Screenshots

| Dashboard | Screening | Interview |
|-----------|-----------|-----------|
| ![dashboard](docs/screenshots/dashboard.png) | ![screening](docs/screenshots/screening.png) | ![interview](docs/screenshots/interview.png) |

---

## License

MIT
