# Architecture Decisions Log

## ADR-001: Why two runtimes (Java + Python)?

* Java/Spring Boot owns security, persistence, and orchestration — terrain where Java's ecosystem (Spring Security, JPA, Spring Mail) is mature and production-proven.
* Python owns the AI layer because LangGraph, LangChain, and the Anthropic SDK are Python-first.
* **Decision:** keep them separate and stateless on the Python side. The AI service takes text in, returns JSON out, holds no database.

## ADR-002: Why does the frontend talk only to Spring Boot?

* **Single auth surface:** only one place manages JWT validation.
* **Single source of truth:** MySQL via Spring Boot is the system of record. The UI never writes directly.
* **Security:** the AI service has no auth — if the frontend talked to it directly, anyone could call it.

## ADR-003: Why is the HITL gate in Spring Boot, not inside LangGraph?

* LangGraph's `interrupt()` + checkpointer is the "in-graph" pattern — powerful for long-running agentic loops.
* For this system the gate is a business rule (`evaluation.status` must be `APPROVED` before email), not an AI decision. Spring Boot is the right owner of business rules.
* **Benefit:** the gate cannot be bypassed by changing the UI — the backend refuses regardless.

## ADR-004: Why DTOs at every boundary?

* Exposing JPA entities directly would leak lazy-loading exceptions, circular references, and internal fields over the API.
* DTOs give us explicit control over what leaves the service and make API contracts stable.

## ADR-005: Why structured Pydantic output from agents?

* LLMs can return well-formed text but unpredictable structure. Pydantic validation forces the shape we need.
* If parsing fails, we know immediately — we don't silently propagate bad data into MySQL.

## ADR-006: Why Docker Compose for local deployment?

* The system has four moving parts (MySQL, Spring Boot, FastAPI, React/nginx) with startup ordering dependencies (backend must wait for MySQL to be healthy; frontend proxies to backend).
* Docker Compose encodes those dependencies in `depends_on: condition: service_healthy`, eliminating the "start them in the right order by hand" problem.
* A single `.env` file holds all secrets; `.env.example` documents them without committing real values.
* **Alternative considered:** separate run scripts per service. Rejected because it requires the developer to manage four terminal windows and know the correct startup order.

## ADR-007: Why Flyway alongside Hibernate ddl-auto?

* `ddl-auto: update` is convenient in dev — Hibernate adds new columns as entities change without touching migration files.
* In production, auto-DDL is dangerous: it can silently alter or drop columns. Flyway's versioned migrations are auditable and reversible.
* **Decision:** `application-dev.yml` keeps `ddl-auto: update` alongside `flyway.enabled: true` so developers get fast iteration. `application-prod.yml` sets `ddl-auto: validate` — Hibernate only checks that the schema matches entities and refuses to start if it doesn't. Flyway owns all schema changes in prod.
* `baseline-on-migrate: true` allows Flyway to be adopted on an existing database without marking every table as "missing migration."

## ADR-008: Why a global exception handler instead of per-controller try/catch?

* Per-controller try/catch leads to duplicated error-shaping logic and inconsistent response shapes (some controllers might return a string, others a map).
* `@RestControllerAdvice` with `@ExceptionHandler` methods gives every exception type a single canonical JSON shape: `{error, timestamp, status}`.
* The handler logs the full stack trace server-side while returning only a safe message to the client — stack traces never reach the API consumer.
* Spring Boot's default error page (`/error`) returns HTML or a verbose JSON blob; the handler intercepts before that path is reached for controller-thrown exceptions.

---

*Add a new ADR every time you make a non-obvious decision. This file is your interview evidence.*
